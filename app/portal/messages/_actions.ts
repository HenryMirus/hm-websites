"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserRole } from "@/lib/auth/getRole";
import { revalidatePath } from "next/cache";
import { dispatchEvent } from "@/lib/automations/engine";

export type MessageFormState = { error?: string; messageId?: string };

/**
 * Hängt bereits hochgeladene Dateien an die frisch erstellte Nachricht.
 * Die IDs kommen aus dem Client, deshalb wird hier gegengeprüft, dass die
 * Datei wirklich zu diesem Kunden gehört und noch an keiner Nachricht hängt.
 */
async function attachFilesToMessage(
  admin: ReturnType<typeof createAdminClient>,
  attachmentIds: string[],
  messageId: string,
  clientId: string
): Promise<void> {
  if (attachmentIds.length === 0) return;
  await admin
    .from("client_files")
    .update({ message_id: messageId, scope: "chat" })
    .in("id", attachmentIds)
    .eq("client_id", clientId)
    .is("message_id", null);
}

export async function sendMessageAction(
  _prev: MessageFormState,
  formData: FormData
): Promise<MessageFormState> {
  const content = ((formData.get("content") as string) ?? "").trim();
  const attachmentIds = formData.getAll("attachment_ids").filter((v): v is string => typeof v === "string" && v.length > 0);
  if (!content && attachmentIds.length === 0) {
    return { error: "Nachricht darf nicht leer sein." };
  }
  const preview = content || `${attachmentIds.length} ${attachmentIds.length === 1 ? "Datei" : "Dateien"}`;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht angemeldet." };

  const role = await getUserRole();
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";
  let messageId = "";

  if (role === "admin") {
    const client_id = formData.get("client_id") as string;
    if (!client_id) return { error: "Kein Kunde ausgewählt." };

    const admin = createAdminClient();
    const { data: message, error } = await admin
      .from("messages")
      .insert({ sender_id: user.id, sender_role: "admin", client_id, content })
      .select("id")
      .single();

    if (error || !message) return { error: error?.message ?? "Senden fehlgeschlagen." };

    await attachFilesToMessage(admin, attachmentIds, message.id, client_id);
    messageId = message.id;

    // Automationen feuern (Fallback wenn keine Supabase-Webhooks konfiguriert)
    if (!process.env.NOTIFY_VIA_WEBHOOK) {
      try {
        const { data: client } = await admin.from("clients").select("id, email, name").eq("id", client_id).single();
        if (client) {
          await dispatchEvent(
            "message.created",
            { sender_role: "admin" },
            {
              portalUrl,
              client: { id: client.id, name: client.name ?? "Kunde", email: client.email },
              message: { content: preview.slice(0, 200), sender_role: "admin" },
              vars: {},
            }
          );
        }
      } catch (e) {
        console.error("[Automation] message.created (admin):", e);
      }
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

    const admin = createAdminClient();
    const { data: message, error } = await admin
      .from("messages")
      .insert({ sender_id: user.id, sender_role: "client", client_id: clientRecord.id, content })
      .select("id")
      .single();

    if (error || !message) return { error: error?.message ?? "Senden fehlgeschlagen." };

    await attachFilesToMessage(admin, attachmentIds, message.id, clientRecord.id);
    messageId = message.id;

    // Automationen feuern (Fallback wenn keine Supabase-Webhooks konfiguriert)
    if (!process.env.NOTIFY_VIA_WEBHOOK) {
      try {
        await dispatchEvent(
          "message.created",
          { sender_role: "client" },
          {
            portalUrl,
            client: { id: clientRecord.id, name: clientRecord.name ?? "Kunde", email: null },
            message: { content: preview.slice(0, 200), sender_role: "client" },
            vars: {},
          }
        );
      } catch (e) {
        console.error("[Automation] message.created (client):", e);
      }
    }

    revalidatePath("/portal/messages");
  }

  return { messageId };
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
