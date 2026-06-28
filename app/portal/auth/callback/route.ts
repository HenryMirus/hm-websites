import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRecoveryToken } from "@/lib/auth/recoveryToken";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !session) {
    return NextResponse.redirect(new URL("/login?error=exchange_failed", request.url));
  }

  const user = session.user;

  if (type === "recovery") {
    // Erzeuge ein HMAC-signiertes, kurz gültiges Cookie das ausschließlich
    // an diese User-ID gebunden ist. Ohne dieses Cookie wird die Passwort-
    // änderungs-Seite verweigert — auch bei gültiger Supabase-Session.
    const recoveryToken = createRecoveryToken(user.id);
    cookieStore.set("sb_recovery", recoveryToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 Minuten
      path: "/password",
    });
    return NextResponse.redirect(new URL("/password", request.url));
  }

  // Invite-Flow: clients.auth_user_id verknüpfen (braucht service role, da RLS)
  const admin = createAdminClient();
  await admin
    .from("clients")
    .update({ auth_user_id: user.id })
    .eq("email", user.email!)
    .is("auth_user_id", null);

  return NextResponse.redirect(new URL("/projects", request.url));
}
