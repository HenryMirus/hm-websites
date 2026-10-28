import type { SupabaseClient } from "@supabase/supabase-js";
import { EMAIL } from "@/lib/config/email";

/**
 * Empfänger für Betreiber-Benachrichtigungen: die Login-Adressen aller Admins
 * plus das Postfach aus EMAIL.INBOX (info@…), damit nichts nur in einem
 * privaten Login-Postfach landet. Doppelte Adressen werden zusammengefasst.
 */
export async function getAdminRecipients(admin: SupabaseClient): Promise<string[]> {
  const emails = new Set<string>([EMAIL.INBOX.toLowerCase()]);
  try {
    const { data: profiles } = await admin.from("profiles").select("id").eq("role", "admin");
    const adminIds = new Set((profiles ?? []).map((p) => p.id as string));
    if (adminIds.size > 0) {
      const { data } = await admin.auth.admin.listUsers({ perPage: 200 });
      for (const u of data?.users ?? []) {
        if (adminIds.has(u.id) && u.email) emails.add(u.email.toLowerCase());
      }
    }
  } catch (e) {
    console.error("[Email] Admin-Adressen nicht lesbar, nur Inbox:", e);
  }
  return Array.from(emails);
}
