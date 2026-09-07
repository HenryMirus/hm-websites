"use server";

import { setPasswordWithRecoveryToken } from "@/lib/auth/setPasswordWithRecoveryToken";
import { redirect } from "next/navigation";

export async function updatePasswordAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const password = (formData.get("password") as string) ?? "";
  const confirm = (formData.get("confirm") as string) ?? "";

  const result = await setPasswordWithRecoveryToken(password, confirm);
  if (result.error) return { error: result.error };

  // Absolute URL erzwingt eine vollständige Server-Navigation statt client-seitiger
  // SPA-Navigation — verhindert kurzen 404-Flash, weil /login im Client-Router nicht existiert
  const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://clients.localhost:3000";
  redirect(`${portalBase}/login?pw=changed`);
}
