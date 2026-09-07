import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRecoveryToken } from "@/lib/auth/recoveryToken";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");

  const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";

  if (!code && !accessToken) {
    // Dieses Supabase-Projekt liefert die Tokens als URL-Fragment
    // (#access_token=...&type=...), nicht als ?code=... Query-Param.
    // Fragmente erreichen den Server nie (Browser schneidet sie vor dem
    // Request ab) - diese kleine Bridge liest das Fragment im Browser aus
    // und stellt sich selbst mit den Werten als Query-Parameter erneut an,
    // damit der Handler unten sie server-seitig verarbeiten kann.
    return new NextResponse(
      `<!doctype html><html><body><script>
        var h = new URLSearchParams(location.hash.slice(1));
        var qs = new URLSearchParams();
        ["access_token", "refresh_token", "type"].forEach(function (k) {
          if (h.get(k)) qs.set(k, h.get(k));
        });
        if (qs.has("access_token")) {
          location.replace(location.pathname + "?" + qs.toString());
        } else {
          location.replace("/login?error=missing_code");
        }
      </script></body></html>`,
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  const redirectUrl =
    type === "recovery"
      ? `${portalBase}/password`
      : type === "invite"
      ? `${portalBase}/register`
      : `${portalBase}/projects`;

  // Response-Objekt zuerst erstellen, damit Supabase Cookies direkt darauf schreiben kann.
  // cookies() aus next/headers funktioniert nicht mit NextResponse.redirect() zusammen.
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(
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

  const { data: { session }, error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.setSession({ access_token: accessToken!, refresh_token: refreshToken ?? "" });

  if (error || !session) {
    return NextResponse.redirect(`${portalBase}/login?error=exchange_failed`);
  }

  // Invite-, Magiclink- und Recovery-Flow: clients.auth_user_id verknüpfen, falls noch offen.
  // Läuft auch bei type=recovery, weil grantClientPortalAccess() für bereits existierende
  // Auth-Accounts auf resetPasswordForEmail (= recovery) zurückfällt statt auf invite - ohne
  // diesen Zweig bleibt clients.auth_user_id in dem Fall dauerhaft NULL, obwohl sich der Kunde
  // erfolgreich einloggt. .is("auth_user_id", null) verhindert, dass ein bestehender Link
  // überschrieben wird.
  const admin = createAdminClient();
  await admin
    .from("clients")
    .update({ auth_user_id: session.user.id })
    .eq("email", session.user.email!)
    .is("auth_user_id", null);

  if (type === "recovery" || type === "invite") {
    const recoveryToken = createRecoveryToken(session.user.id);
    response.cookies.set("sb_recovery", recoveryToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: type === "recovery" ? "/password" : "/register",
    });
    return response;
  }

  return response;
}
