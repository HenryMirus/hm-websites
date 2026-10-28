import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType, Session } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRecoveryToken } from "@/lib/auth/recoveryToken";
import { PORTAL_URL } from "@/lib/config/site";

// Drei Wege kommen hier an:
//
// 1. ?token_hash=…&type=… (bevorzugt, siehe lib/email/templates/*.html): Die
//    Mail verlinkt direkt hierher, der Einmal-Token ist noch nicht eingelöst.
//    GET zeigt nur einen Button, eingelöst wird erst per POST. Link-Scanner
//    (z. B. Defender Safe Links) öffnen Links, klicken aber keine Formulare ab,
//    und verbrauchen den Token deshalb nicht mehr.
// 2. ?code=… (PKCE).
// 3. #access_token=… (alte Vorlagen mit {{ .ConfirmationURL }}): Supabase hat
//    den Token beim Aufruf von /auth/v1/verify schon eingelöst. Fragmente
//    erreichen den Server nicht, die Bridge unten reicht sie als Query weiter.
//    Bleibt nur, bis die Vorlagen im Supabase-Dashboard umgestellt sind.

const OTP_TYPES: EmailOtpType[] = ["recovery", "invite", "magiclink", "email", "email_change", "signup"];

function page(body: string, status = 200): NextResponse {
  return new NextResponse(
    `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex"><title>HM Labs Portal</title>
    <style>
      body { font-family: system-ui, sans-serif; display: flex; min-height: 100vh;
        align-items: center; justify-content: center; margin: 0; background: #09090F; color: #EEEEFF; }
      main { text-align: center; padding: 1.5rem; }
      p { color: #8888AA; margin: 0 0 1.5rem; }
      button { font-size: 1rem; font-weight: 600; padding: 0.9rem 2rem; border-radius: 0.75rem;
        border: none; background: #4F7FFF; color: #fff; cursor: pointer; }
      button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
    </style></head><body><main>${body}</main></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } }
  );
}

function escapeAttr(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function supabaseFor(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
}

function redirectFor(flow: string | null): string {
  return flow === "recovery"
    ? `${PORTAL_URL}/password`
    : flow === "invite"
    ? `${PORTAL_URL}/register`
    : `${PORTAL_URL}/projects`;
}

/** Auth-Methoden der Session laut JWT (amr), z. B. ["password"] oder ["recovery"]. */
function authMethods(session: Session): string[] {
  try {
    const payload = JSON.parse(
      Buffer.from(session.access_token.split(".")[1], "base64url").toString("utf8")
    ) as { amr?: { method?: string }[] };
    return (payload.amr ?? []).map((a) => a.method ?? "");
  } catch {
    return [];
  }
}

/**
 * Gemeinsamer Abschluss nach erfolgreichem Login über einen Mail-Link.
 * `flow` ist nur dann recovery/invite, wenn die Session wirklich aus einem
 * solchen Link stammt — ein frei gewählter ?type=recovery reicht nicht.
 */
async function finish(session: Session, flow: string | null, response: NextResponse): Promise<NextResponse> {
  // Invite-, Magiclink- und Recovery-Flow: clients.auth_user_id verknüpfen, falls noch offen.
  // Läuft auch bei recovery, weil grantClientPortalAccess() für bereits existierende
  // Auth-Accounts auf resetPasswordForEmail (= recovery) zurückfällt statt auf invite.
  // Nur bei bestätigter Adresse: sonst könnte sich jemand mit der Adresse eines
  // eingeladenen Kunden registrieren und dessen Datensatz übernehmen.
  // .is("auth_user_id", null) verhindert, dass ein bestehender Link überschrieben wird.
  if (session.user.email && session.user.email_confirmed_at) {
    const admin = createAdminClient();
    await admin
      .from("clients")
      .update({ auth_user_id: session.user.id })
      .eq("email", session.user.email)
      .is("auth_user_id", null);
  }

  if (flow === "recovery" || flow === "invite") {
    response.cookies.set("sb_recovery", createRecoveryToken(session.user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: flow === "recovery" ? "/password" : "/register",
    });
  }
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const code = searchParams.get("code");
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");

  // Weg 1: nur den Button zeigen, nichts einlösen.
  if (tokenHash) {
    const label = type === "recovery" ? "Neues Passwort festlegen" : type === "invite" ? "Zugang einrichten" : "Weiter zum Portal";
    return page(
      `<p>Bitte bestätigen Sie, um fortzufahren.</p>
      <form method="post" action="/auth/callback">
        <input type="hidden" name="token_hash" value="${escapeAttr(tokenHash)}">
        <input type="hidden" name="type" value="${escapeAttr(type ?? "")}">
        <button type="submit">${label}</button>
      </form>`
    );
  }

  if (!code && !accessToken) {
    // Weg 3, erster Aufruf: Fragment im Browser lesen und als Query weiterreichen.
    // Fehler aus dem Fragment (z. B. abgelaufener Link) an die Login-Seite geben.
    return page(
      `<p>Einen Moment …</p>
      <script>
        var h = new URLSearchParams(location.hash.slice(1));
        if (h.get("access_token")) {
          var qs = new URLSearchParams();
          ["access_token", "refresh_token", "type"].forEach(function (k) { if (h.get(k)) qs.set(k, h.get(k)); });
          location.replace(location.pathname + "?" + qs.toString());
        } else {
          location.replace("/login?error=" + (h.get("error_code") === "otp_expired" ? "link_expired" : "missing_code"));
        }
      </script>`
    );
  }

  const response = NextResponse.redirect(redirectFor(null));
  const supabase = supabaseFor(request, response);

  const { data: { session }, error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.setSession({ access_token: accessToken!, refresh_token: refreshToken ?? "" });

  if (error || !session) {
    return NextResponse.redirect(`${PORTAL_URL}/login?error=exchange_failed`);
  }

  // Der Ablauf zählt nur, wenn die Session tatsächlich aus einem Mail-Link
  // stammt. Ein normales Passwort-Login mit angehängtem ?type=recovery bekommt
  // kein Recovery-Cookie.
  const methods = authMethods(session);
  const fromMailLink = methods.some((m) => m !== "password");
  const flow = fromMailLink && (type === "recovery" || type === "invite") ? type : null;

  const final = NextResponse.redirect(redirectFor(flow));
  response.cookies.getAll().forEach((c) => final.cookies.set(c));
  return finish(session, flow, final);
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const tokenHash = String(form.get("token_hash") ?? "");
  const type = String(form.get("type") ?? "") as EmailOtpType;

  if (!tokenHash || !OTP_TYPES.includes(type)) {
    return NextResponse.redirect(`${PORTAL_URL}/login?error=missing_code`, 303);
  }

  const flow = type === "recovery" || type === "invite" ? type : null;
  const response = NextResponse.redirect(redirectFor(flow), 303);
  const supabase = supabaseFor(request, response);

  const { data: { session }, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
  if (error || !session) {
    const reason = error?.code === "otp_expired" ? "link_expired" : "exchange_failed";
    return NextResponse.redirect(`${PORTAL_URL}/login?error=${reason}`, 303);
  }

  return finish(session, flow, response);
}
