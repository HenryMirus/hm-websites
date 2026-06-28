"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { verifyRecoveryToken } from "@/lib/auth/recoveryToken";
import { redirect } from "next/navigation";

export async function updatePasswordAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const password = (formData.get("password") as string) ?? "";
  const confirm = (formData.get("confirm") as string) ?? "";

  if (password.length < 8) {
    return { error: "Das Passwort muss mindestens 8 Zeichen lang sein." };
  }
  if (password !== confirm) {
    return { error: "Die Passwörter stimmen nicht überein." };
  }

  // 1. Aktuelle Session prüfen
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Keine gültige Session. Bitte den Reset-Link erneut anfordern." };
  }

  // 2. HMAC-signiertes Recovery-Cookie verifizieren
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("sb_recovery")?.value;

  if (!rawToken || !verifyRecoveryToken(rawToken, user.id)) {
    return {
      error: "Ungültiger oder abgelaufener Reset-Link. Bitte ein neues Passwort-Reset anfordern.",
    };
  }

  // 3. Passwort aktualisieren
  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) {
    return { error: updateError.message };
  }

  // 4. Recovery-Cookie sofort löschen (Single-Use)
  cookieStore.delete("sb_recovery");

  // 5. Alle Sessions global abmelden (alle Geräte)
  const admin = createAdminClient();
  await admin.auth.admin.signOut(user.id);

  redirect("/login?pw=changed");
}
