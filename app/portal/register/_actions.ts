"use server";

import { setPasswordWithRecoveryToken } from "@/lib/auth/setPasswordWithRecoveryToken";
import { redirect } from "next/navigation";
import { PORTAL_URL } from "@/lib/config/site";

export async function registerAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const password = (formData.get("password") as string) ?? "";
  const confirm = (formData.get("confirm") as string) ?? "";

  const result = await setPasswordWithRecoveryToken(password, confirm);
  if (result.error) return { error: result.error };

  const portalBase = PORTAL_URL;
  redirect(`${portalBase}/login?registered=1`);
}
