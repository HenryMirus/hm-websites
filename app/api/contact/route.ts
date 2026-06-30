import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_MAX = 5; // requests
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// In-memory, per-instance rate limit. Good enough for a low-volume contact form;
// resets on cold start and isn't shared across serverless instances.
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) {
    submissionsByIp.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, company, message, subject, wizard_answers, source } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name und E-Mail sind erforderlich." }, { status: 400 });
    }

    if (name.trim().length > 200 || email.trim().length > 254) {
      return NextResponse.json({ error: "Eingabe zu lang." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse." }, { status: 400 });
    }

    if (typeof message === "string" && message.length > 5000) {
      return NextResponse.json({ error: "Nachricht zu lang." }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim() || null,
      message: message?.trim() || "",
      subject: subject?.trim() || null,
      source_url: source || null,
      metadata: wizard_answers
        ? { wizard_answers, submitted_at: new Date().toISOString() }
        : {},
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Fehler beim Speichern." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
