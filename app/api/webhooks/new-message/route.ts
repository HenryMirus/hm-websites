import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isWebhookAuthorized } from "@/lib/auth/webhookAuth";
import { dispatchEvent } from "@/lib/automations/engine";
import type { RunContext } from "@/lib/automations/types";

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
    const { data: client } = await admin
      .from("clients")
      .select("id, name, email")
      .eq("id", record.client_id)
      .single();

    if (!client?.id) {
      return NextResponse.json({ ok: true, skipped: true, reason: "no client" });
    }

    const ctx: RunContext = {
      portalUrl: portalBase,
      client: { id: client.id, name: client.name ?? "Kunde", email: client.email },
      message: { content: record.content.slice(0, 200), sender_role: record.sender_role },
      vars: {},
    };

    const { fired } = await dispatchEvent(
      "message.created",
      { sender_role: record.sender_role },
      ctx
    );
    return NextResponse.json({ ok: true, fired });
  } catch (e) {
    console.error("[Webhook] new-message:", e);
    return NextResponse.json({ error: "Automation run failed" }, { status: 500 });
  }
}
