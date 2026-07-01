import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isWebhookAuthorized } from "@/lib/auth/webhookAuth";
import { dispatchEvent } from "@/lib/automations/engine";
import type { RunContext } from "@/lib/automations/types";

interface MilestoneRecord {
  id: string;
  project_id: string;
  title: string;
  status: string;
  due_date: string | null;
  sort_order: number;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: MilestoneRecord;
  old_record: MilestoneRecord | null;
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

  // Nur UPDATE-Events auf project_milestones verarbeiten
  if (payload.type !== "UPDATE" || payload.table !== "project_milestones") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const { record, old_record } = payload;

  // Nur feuern wenn Status von nicht-completed zu completed wechselt
  if (record.status !== "completed" || old_record?.status === "completed") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";
  const admin = createAdminClient();

  try {
    const { data: project } = await admin
      .from("projects")
      .select("id, title, status, clients(id, name, email)")
      .eq("id", record.project_id)
      .single();

    const client = (project as any)?.clients;
    if (!project || !client?.id) {
      return NextResponse.json({ ok: true, skipped: true, reason: "no client" });
    }

    const ctx: RunContext = {
      portalUrl: portalBase,
      client: { id: client.id, name: client.name ?? "Kunde", email: client.email },
      project: { id: project.id, title: project.title, status: project.status },
      milestone: { id: record.id, title: record.title },
      vars: { project_url: `${portalBase}/projects/${record.project_id}` },
    };

    const { fired } = await dispatchEvent("milestone.completed", {}, ctx);
    return NextResponse.json({ ok: true, fired });
  } catch (e) {
    console.error("[Webhook] milestone-completed:", e);
    return NextResponse.json({ error: "Automation run failed" }, { status: 500 });
  }
}
