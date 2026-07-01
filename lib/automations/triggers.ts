// ─── Trigger-Auswertung ─────────────────────────────────────────────────────

import { CronExpressionParser } from "cron-parser";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Automation, RunContext } from "./types";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";

interface DueItem {
  automation: Automation;
  ctx: RunContext;
}

function baseCtx(): Pick<RunContext, "portalUrl" | "vars"> {
  return { portalUrl: PORTAL_URL, vars: {} };
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function addDays(dateStr: string, days: number): Date {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

// ─── Event-Trigger (von den Webhooks genutzt) ───────────────────────────────

/** Lädt aktive event-Automationen für ein Ereignis und matched den Filter. */
export async function getMatchingEventAutomations(
  event: string,
  facts: Record<string, string | null | undefined>
): Promise<Automation[]> {
  const admin = createAdminClient();
  const { data } = await admin.from("automations").select("*").eq("enabled", true);

  const list = (data ?? []) as Automation[];
  return list.filter((a) => {
    if (a.trigger?.type !== "event" || a.trigger?.config?.event !== event) return false;
    const filter = a.trigger?.config?.filter as Record<string, string> | undefined;
    if (!filter) return true;
    return Object.entries(filter).every(([k, v]) => !v || facts[k] === v);
  });
}

// ─── Zeit-/Datums-Trigger (vom Cron-Tick genutzt) ───────────────────────────

export async function findDueAutomations(now: Date = new Date()): Promise<DueItem[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("automations")
    .select("*")
    .eq("enabled", true);

  const automations = ((data ?? []) as Automation[]).filter(
    (a) => a.trigger?.type === "schedule" || a.trigger?.type === "date_offset"
  );
  const due: DueItem[] = [];

  for (const a of automations) {
    if (a.trigger.type === "schedule") {
      const item = evaluateSchedule(a, now);
      if (item) due.push(item);
    } else if (a.trigger.type === "date_offset") {
      const items = await evaluateDateOffset(admin, a, now);
      due.push(...items);
    }
  }
  return due;
}

function evaluateSchedule(a: Automation, now: Date): DueItem | null {
  const cron = String(a.trigger.config?.cron ?? "").trim();
  if (!cron) return null;
  try {
    const interval = CronExpressionParser.parse(cron, { currentDate: now });
    const prev = interval.prev().toDate(); // letzte fällige Zeit ≤ now
    const last = a.last_run_at ? new Date(a.last_run_at) : null;
    if (last && prev <= last) return null; // dieses Fenster schon gelaufen
    return {
      automation: a,
      ctx: { ...baseCtx(), dedupeKey: `schedule:${prev.toISOString()}` },
    };
  } catch {
    return null; // ungültiger Cron-Ausdruck → ignorieren
  }
}

async function evaluateDateOffset(
  admin: ReturnType<typeof createAdminClient>,
  a: Automation,
  now: Date
): Promise<DueItem[]> {
  const cfg = a.trigger.config ?? {};
  const base: string = cfg.base ?? "project.launch_date";
  const offsetDays: number = Number(cfg.offsetDays ?? 0);
  const recurrence: "once" | "yearly" = cfg.recurrence === "yearly" ? "yearly" : "once";
  const statusIn: string[] = Array.isArray(cfg.statusIn) ? cfg.statusIn : [];
  const today = ymd(now);
  const todayMD = today.slice(5); // MM-DD
  const year = today.slice(0, 4);
  const out: DueItem[] = [];

  const isDue = (baseDate: string | null): { due: boolean; key: string } => {
    if (!baseDate) return { due: false, key: "" };
    const target = addDays(baseDate, offsetDays);
    if (recurrence === "yearly") {
      const due = ymd(target).slice(5) === todayMD && ymd(target) <= today;
      return { due, key: year };
    }
    return { due: ymd(target) === today, key: "once" };
  };

  if (base.startsWith("project.")) {
    const field = base.split(".")[1]; // launch_date | start_date
    const { data: projects } = await admin
      .from("projects")
      .select("id,title,status,launch_date,start_date, clients(id,name,email)");
    for (const p of (projects ?? []) as any[]) {
      if (statusIn.length && !statusIn.includes(p.status)) continue;
      const { due, key } = isDue(p[field]);
      if (!due) continue;
      out.push({
        automation: a,
        ctx: {
          ...baseCtx(),
          client: p.clients ? { id: p.clients.id, name: p.clients.name, email: p.clients.email } : undefined,
          project: { id: p.id, title: p.title, status: p.status },
          dedupeKey: `${p.id}:${key}`,
        },
      });
    }
  } else if (base === "client.created_at" || base === "client.first_project_start") {
    const { data: clients } = await admin
      .from("clients")
      .select("id,name,email,created_at, projects(start_date)");
    for (const c of (clients ?? []) as any[]) {
      let baseDate: string | null = null;
      if (base === "client.created_at") {
        baseDate = c.created_at ? ymd(new Date(c.created_at)) : null;
      } else {
        const starts = (c.projects ?? [])
          .map((p: any) => p.start_date)
          .filter(Boolean)
          .sort();
        baseDate = starts[0] ?? null;
      }
      const { due, key } = isDue(baseDate);
      if (!due) continue;
      out.push({
        automation: a,
        ctx: {
          ...baseCtx(),
          client: { id: c.id, name: c.name, email: c.email },
          dedupeKey: `${c.id}:${key}`,
        },
      });
    }
  }

  return out;
}
