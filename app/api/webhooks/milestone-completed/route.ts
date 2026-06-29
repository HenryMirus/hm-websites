import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyClientMilestoneReached } from "@/lib/email/notify";

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

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
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
      .select("title, clients(name, email)")
      .eq("id", record.project_id)
      .single();

    const client = (project as any)?.clients;
    if (!project || !client?.email) {
      return NextResponse.json({ ok: true, skipped: true, reason: "no client email" });
    }

    await notifyClientMilestoneReached(
      client.email,
      client.name ?? "Kunde",
      project.title,
      record.title,
      `${portalBase}/projects/${record.project_id}`
    );
  } catch (e) {
    console.error("[Webhook] milestone-completed:", e);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
