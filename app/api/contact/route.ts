import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeLeadScore } from "@/lib/leadScoring";
import { notifyContactSubmission } from "@/lib/email/contactNotifications";

// Bewusst strenger als RFC 5322: keine ?, &, %, Kommas oder Leerzeichen, damit
// die Adresse gefahrlos in mailto:-Links und Mail-Header wandern kann.
const EMAIL_REGEX = /^[A-Za-z0-9._+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const MAX_BODY_BYTES = 64 * 1024;
const RATE_LIMIT_MAX = 5; // requests
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
// Eingangsbestätigungen gehen an eine fremde, ungeprüfte Adresse. Damit das
// Formular nicht zum Mailbomben taugt: höchstens 2 je Adresse pro Tag und
// 30 insgesamt pro Stunde. Darüber wird die Anfrage gespeichert und gemeldet,
// nur die Bestätigung entfällt.
const CONFIRM_PER_ADDRESS = 2;
const CONFIRM_ADDRESS_WINDOW_MS = 24 * 60 * 60 * 1000;
const CONFIRM_GLOBAL_PER_HOUR = 30;
const MAX_TRACKED_KEYS = 5000;

// In-memory, per-instance rate limit. Good enough for a low-volume contact form;
// resets on restart.
const submissionsByIp = new Map<string, number[]>();
const confirmationsByAddress = new Map<string, number[]>();
let confirmationsLastHour: number[] = [];

function hit(map: Map<string, number[]>, key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (map.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= max) {
    map.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  map.set(key, timestamps);
  // Abgelaufene Schlüssel entfernen, damit die Map nicht unbegrenzt wächst.
  if (map.size > MAX_TRACKED_KEYS) {
    map.forEach((ts, k) => {
      if (ts.every((t) => now - t >= windowMs)) map.delete(k);
    });
    if (map.size > MAX_TRACKED_KEYS) map.clear();
  }
  return false;
}

function mayConfirm(email: string): boolean {
  const now = Date.now();
  confirmationsLastHour = confirmationsLastHour.filter((t) => now - t < 60 * 60 * 1000);
  if (confirmationsLastHour.length >= CONFIRM_GLOBAL_PER_HOUR) return false;
  if (hit(confirmationsByAddress, email, CONFIRM_PER_ADDRESS, CONFIRM_ADDRESS_WINDOW_MS)) return false;
  confirmationsLastHour.push(now);
  return true;
}

/**
 * Client-IP hinter nginx: x-real-ip setzt der Proxy selbst. Ohne ihn der
 * letzte Eintrag von X-Forwarded-For (den hängt der Proxy an), nicht der erste
 * — den kann jeder Client frei mitschicken.
 */
function clientIp(req: NextRequest): string {
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const xff = req.headers.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  return xff?.[xff.length - 1] || "unknown";
}

function str(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(req: NextRequest) {
  try {
    if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Anfrage zu groß." }, { status: 413 });
    }

    if (hit(submissionsByIp, clientIp(req), RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      );
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Anfrage zu groß." }, { status: 413 });
    }
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
    }

    // Honeypot (Masterplan §5.7): Bots füllen das unsichtbare Feld —
    // wir antworten mit Erfolg, speichern aber nichts.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    const name = str(body.name, 1000);
    const emailRaw = str(body.email, 1000);
    if (!name || !emailRaw) {
      return NextResponse.json({ error: "Name und E-Mail sind erforderlich." }, { status: 400 });
    }
    if (name.length > 200 || emailRaw.length > 254) {
      return NextResponse.json({ error: "Eingabe zu lang." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(emailRaw)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse." }, { status: 400 });
    }
    const email = emailRaw.toLowerCase();

    const message = str(body.message, 5001) ?? "";
    if (message.length > 5000) {
      return NextResponse.json({ error: "Nachricht zu lang." }, { status: 400 });
    }
    const phone = str(body.phone, 51);
    if (phone && phone.length > 50) {
      return NextResponse.json({ error: "Telefonnummer zu lang." }, { status: 400 });
    }
    const company = str(body.company, 200);
    const subject = str(body.subject, 300);
    const source = str(body.source, 500);
    const budget = str(body.budget, 100);

    const wizardAnswers =
      body.wizard_answers && typeof body.wizard_answers === "object" ? body.wizard_answers : null;
    if (wizardAnswers && JSON.stringify(wizardAnswers).length > 16_000) {
      return NextResponse.json({ error: "Anfrage zu groß." }, { status: 413 });
    }

    const supabase = await createClient();

    // Lead-Score: rein interne Priorisierungshilfe (siehe lib/leadScoring.ts),
    // serverseitig berechnet, damit er nicht durch die Anfrage manipulierbar ist.
    const { score, tier, breakdown } = computeLeadScore({
      wizardAnswers: wizardAnswers as Parameters<typeof computeLeadScore>[0]["wizardAnswers"],
      phone: phone ?? undefined,
      message,
    });

    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      company,
      phone,
      message,
      subject,
      source_url: source,
      lead_score: score,
      lead_tier: tier,
      metadata: {
        ...(wizardAnswers ? { wizard_answers: wizardAnswers } : {}),
        ...(budget ? { budget } : {}),
        score_breakdown: breakdown,
        submitted_at: new Date().toISOString(),
      },
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Fehler beim Speichern." }, { status: 500 });
    }

    await notifyContactSubmission(
      { name, email, company, phone, subject, message, leadScore: score, leadTier: tier },
      { confirm: mayConfirm(email) }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
