import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRecoveryToken } from "@/lib/auth/recoveryToken";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";

  if (!code) {
    return NextResponse.redirect(`${portalBase}/login?error=missing_code`);
  }

  const redirectUrl = type === "recovery"
    ? `${portalBase}/password`
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

  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !session) {
    return NextResponse.redirect(`${portalBase}/login?error=exchange_failed`);
  }

  if (type === "recovery") {
    const recoveryToken = createRecoveryToken(session.user.id);
    response.cookies.set("sb_recovery", recoveryToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/password",
    });
    return response;
  }

  // Invite-Flow: clients.auth_user_id verknüpfen
  const admin = createAdminClient();
  await admin
    .from("clients")
    .update({ auth_user_id: session.user.id })
    .eq("email", session.user.email!)
    .is("auth_user_id", null);

  return response;
}
