import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { verifyRecoveryToken } from "@/lib/auth/recoveryToken";

export type SetPasswordResult = { error?: string };

/**
 * Setzt das Passwort der aktuell per sb_recovery-Cookie verifizierten Session
 * und meldet danach global ab. Geteilte Logik für zwei Flows, die sich nur
 * in Copy und Redirect-Ziel unterscheiden: Passwort-Reset (/password) und
 * Konto-Einrichtung nach einer Einladung (/register).
 */
export async function setPasswordWithRecoveryToken(password: string, confirm: string): Promise<SetPasswordResult> {
  if (password.length < 8) {
    return { error: "Das Passwort muss mindestens 8 Zeichen lang sein." };
  }
  if (password !== confirm) {
    return { error: "Die Passwörter stimmen nicht überein." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Keine gültige Session. Bitte den Link erneut anfordern." };
  }

  const cookieStore = await cookies();
  const rawToken = cookieStore.get("sb_recovery")?.value;

  if (!rawToken || !verifyRecoveryToken(rawToken, user.id)) {
    return { error: "Ungültiger oder abgelaufener Link. Bitte einen neuen anfordern." };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) return { error: updateError.message };

  cookieStore.delete("sb_recovery");

  const admin = createAdminClient();
  await admin.auth.admin.signOut(user.id);

  return {};
}
