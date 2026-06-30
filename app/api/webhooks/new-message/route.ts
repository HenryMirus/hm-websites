import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyClientNewMessage, notifyAdminsNewMessage } from "@/lib/email/notify";
import { isWebhookAuthorized } from "@/lib/auth/webhookAuth";

// Supabase Webhook Payload — Typ für messages-Tabelle
interface MessageRecord {
  id: string;
  sender_id: string;
  sender_role: "admin" | "client";
  client_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: MessageRecord;
  old_record: MessageRecord | null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isWebhookAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Nur INSERT-Events verarbeiten
  if (payload.type !== "INSERT" || payload.table !== "messages") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const { record } = payload;
  const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";
  const admin = createAdminClient();

  try {
    if (record.sender_role === "admin") {
      // Admin → Client: Kunden-Email benachrichtigen
      const { data: client } = await admin
        .from("clients")
        .select("email, name")
        .eq("id", record.client_id)
        .single();

      if (client?.email) {
        await notifyClientNewMessage(
          client.email,
          record.content.slice(0, 200),
          `${portalBase}/messages`
        );
      }
    } else {
      // Client → Admin: Alle Admins benachrichtigen
      const { data: clientRecord } = await admin
        .from("clients")
        .select("name")
        .eq("id", record.client_id)
        .single();

      const { data: profiles } = await admin
        .from("profiles")
        .select("id")
        .eq("role", "admin");

      if (profiles && profiles.length > 0) {
        const adminIds = profiles.map((p) => p.id);
        const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 200 });
        const adminEmails = users
          .filter((u) => adminIds.includes(u.id) && u.email)
          .map((u) => u.email as string);

        if (adminEmails.length > 0) {
          await notifyAdminsNewMessage(
            adminEmails,
            clientRecord?.name ?? "Kunde",
            record.content.slice(0, 200)
          );
        }
      }
    }
  } catch (e) {
    console.error("[Webhook] new-message:", e);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
