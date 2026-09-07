import { createAdminClient } from "@/lib/supabase/admin";

export type GrantAccessResult = { error?: string };

/**
 * Verschafft einem Kunden Zugang zum Portal, egal ob dessen Auth-Account
 * schon existiert oder nicht. inviteUserByEmail schlägt bei Supabase für
 * jeden bereits existierenden Account mit "already registered" fehl, auch
 * wenn er nie bestätigt wurde - das betrifft jeden zweiten Einladungs-
 * Versuch an dieselbe Adresse. In dem Fall stattdessen automatisch einen
 * Passwort-Setzen-Link verschicken (resetPasswordForEmail), der für jeden
 * bestehenden Account funktioniert.
 */
export async function grantClientPortalAccess(email: string, name?: string): Promise<GrantAccessResult> {
  const admin = createAdminClient();
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";

  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${portalUrl}/auth/callback`,
    data: name ? { name } : undefined,
  });

  if (!inviteError) return {};

  const alreadyExists =
    inviteError.code === "email_exists" || /already.*registered/i.test(inviteError.message ?? "");

  if (!alreadyExists) return { error: inviteError.message };

  const { error: resetError } = await admin.auth.resetPasswordForEmail(email, {
    redirectTo: `${portalUrl}/auth/callback`,
  });

  if (resetError) return { error: resetError.message };
  return {};
}
