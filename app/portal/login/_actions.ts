"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function requestPasswordReset(
  email: string
): Promise<{ error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = createAdminClient();

  // Prüfen ob die E-Mail im System existiert
  const { data: exists, error: rpcError } = await admin.rpc(
    "email_exists_in_portal",
    { p_email: normalizedEmail }
  );

  if (rpcError) return { error: "Fehler beim Prüfen der E-Mail." };

  if (!exists) {
    return {
      error:
        "Kein Konto mit dieser E-Mail-Adresse gefunden. Wende Dich an henry@hm-ai.de.",
    };
  }

  // E-Mail existiert → Reset-Link senden
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const portalUrl =
    process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";
  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: `${portalUrl}/auth/callback?type=recovery`,
  });

  if (error) {
    if (error.message.toLowerCase().includes("rate limit")) {
      return { error: "Zu viele Anfragen. Bitte warte einige Minuten und versuche es erneut." };
    }
    return { error: error.message };
  }
  return {};
}
