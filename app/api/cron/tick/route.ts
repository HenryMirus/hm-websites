import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { findDueAutomations } from "@/lib/automations/triggers";
import { runAutomation } from "@/lib/automations/engine";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Scheduler-Auth: akzeptiert CRON_SECRET oder WEBHOOK_SECRET als Bearer-Token.
// Im Dev ohne gesetztes Secret erlaubt (lokales Testen via curl), in Production
// ist ein Secret zwingend.
function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET ?? process.env.WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";

  const auth = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(auth);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await findDueAutomations(new Date());
  const results = [];
  for (const { automation, ctx } of due) {
    try {
      const summary = await runAutomation(automation, ctx);
      results.push({ name: automation.name, dedupe: ctx.dedupeKey, status: summary.status });
    } catch (e) {
      results.push({ name: automation.name, dedupe: ctx.dedupeKey, status: "error", error: (e as Error).message });
    }
  }

  return NextResponse.json({ ok: true, evaluated: due.length, results });
}
