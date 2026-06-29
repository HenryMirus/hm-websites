"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserRole } from "@/lib/auth/getRole";
import { revalidatePath } from "next/cache";
import { notifyClientNewMessage, notifyAdminsNewMessage } from "@/lib/email/notify";

export type MessageFormState = { error?: string };

export async function sendMessageAction(
  _prev: MessageFormState,
  formData: FormData
): Promise<MessageFormState> {
  const content = (formData.get("content") as string)?.trim();
  if (!content) return { error: "Nachricht darf nicht leer sein." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht angemeldet." };

  const role = await getUserRole();
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";

  if (role === "admin") {
    const client_id = formData.get("client_id") as string;
    if (!client_id) return { error: "Kein Kunde ausgewählt." };

    const admin = createAdminClient();
    const { error } = await admin
      .from("messages")
      .insert({ sender_id: user.id, sender_role: "admin", client_id, content });

    if (error) return { error: error.message };

    // E-Mail an Kunden
    try {
      const { data: client } = await admin.from("clients").select("email, name").eq("id", client_id).single();
      if (client) {
        await notifyClientNewMessage(
          client.email,
          content.slice(0, 200),
          `${portalUrl}/messages`
        );
      }
    } catch (e) {
      console.error("[Email] notifyClientNewMessage:", e);
    }

    revalidatePath(`/portal/messages/${client_id}`);
    revalidatePath("/portal/messages");
  } else {
    // Client sendet
    const { data: clientRecord } = await supabase
      .from("clients")
      .select("id, name")
      .eq("auth_user_id", user.id)
      .single();

    if (!clientRecord) return { error: "Kein Kunden-Profil gefunden." };

    const { error } = await supabase
      .from("messages")
      .insert({ sender_id: user.id, sender_role: "client", client_id: clientRecord.id, content });

    if (error) return { error: error.message };

    // E-Mail an alle Admins
    try {
      const adminClient = createAdminClient();
      const { data: profiles } = await adminClient
        .from("profiles")
        .select("id")
        .eq("role", "admin");

      if (profiles && profiles.length > 0) {
        const adminIds = profiles.map((p) => p.id);
        const { data: { users } } = await adminClient.auth.admin.listUsers({ perPage: 200 });
        const adminEmails = users
          .filter((u) => adminIds.includes(u.id) && u.email)
          .map((u) => u.email as string);

        if (adminEmails.length > 0) {
          await notifyAdminsNewMessage(adminEmails, clientRecord.name, content.slice(0, 200));
        }
      }
    } catch (e) {
      console.error("[Email] notifyAdminsNewMessage:", e);
    }

    revalidatePath("/portal/messages");
  }

  return {};
}

export async function markMessagesReadAction(clientId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const role = await getUserRole();
  const admin = createAdminClient();

  if (role === "admin") {
    // Admin liest → markiere alle client-gesendeten Nachrichten als gelesen
    await admin
      .from("messages")
      .update({ is_read: true })
      .eq("client_id", clientId)
      .eq("sender_role", "client")
      .eq("is_read", false);
  } else {
    // Client liest → markiere alle admin-gesendeten Nachrichten als gelesen
    await admin
      .from("messages")
      .update({ is_read: true })
      .eq("client_id", clientId)
      .eq("sender_role", "admin")
      .eq("is_read", false);
  }

  revalidatePath("/portal/messages");
}
