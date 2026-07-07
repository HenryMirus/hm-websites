import { createClient } from "@/lib/supabase/server";
import type {
  BrainStats,
  KnowledgeEntry,
  PipelineApproval,
  PipelineRun,
  PipelineStep,
  RunStats,
  UsageSnapshot,
} from "./types";

export async function getRuns(limit = 50): Promise<PipelineRun[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("agent_os")
    .from("pipeline_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`getRuns: ${error.message}`);
  return (data ?? []) as PipelineRun[];
}

export async function getRun(idText: string): Promise<PipelineRun | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("agent_os")
    .from("pipeline_runs")
    .select("*")
    .eq("id_text", idText)
    .single();
  return data as PipelineRun | null;
}

export async function getRunSteps(runIdText: string): Promise<PipelineStep[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("agent_os")
    .from("pipeline_steps")
    .select("*")
    .eq("run_id_text", runIdText)
    .order("iteration", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(`getRunSteps: ${error.message}`);
  return (data ?? []) as PipelineStep[];
}

export async function getPendingApprovals(): Promise<PipelineApproval[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("agent_os")
    .from("pipeline_approvals")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw new Error(`getPendingApprovals: ${error.message}`);
  return (data ?? []) as PipelineApproval[];
}

export async function getAllApprovals(limit = 100): Promise<PipelineApproval[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("agent_os")
    .from("pipeline_approvals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`getAllApprovals: ${error.message}`);
  return (data ?? []) as PipelineApproval[];
}

export async function getLatestUsageSnapshots(): Promise<
  Record<"5h" | "weekly", UsageSnapshot | null>
> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("agent_os")
    .from("usage_snapshots")
    .select("*")
    .order("captured_at", { ascending: false })
    .limit(4);
  const rows = (data ?? []) as UsageSnapshot[];
  const result: Record<"5h" | "weekly", UsageSnapshot | null> = {
    "5h": null,
    weekly: null,
  };
  for (const row of rows) {
    if (!result[row.window_kind]) result[row.window_kind] = row;
  }
  return result;
}

export async function getRunStats(): Promise<RunStats> {
  const supabase = await createClient();
  const now = new Date();
  const todayIso = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toISOString();
  const ago7dIso = new Date(
    now.getTime() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const [runsRes, approvalsRes] = await Promise.all([
    supabase
      .schema("agent_os")
      .from("pipeline_runs")
      .select("status, total_cost_usd, created_at"),
    supabase
      .schema("agent_os")
      .from("pipeline_approvals")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const rows = runsRes.data ?? [];
  let total = 0,
    passed = 0,
    failed = 0,
    running = 0;
  let cost_today = 0,
    cost_7d = 0,
    cost_all = 0;

  for (const r of rows) {
    total++;
    if (r.status === "passed") passed++;
    else if (r.status === "failed") failed++;
    else if (r.status === "running") running++;
    const cost = Number(r.total_cost_usd ?? 0);
    cost_all += cost;
    if (r.created_at >= ago7dIso) cost_7d += cost;
    if (r.created_at >= todayIso) cost_today += cost;
  }

  return {
    total,
    passed,
    failed,
    running,
    cost_today,
    cost_7d,
    cost_all,
    pending_approvals: approvalsRes.count ?? 0,
  };
}

export async function getBrainStats(): Promise<BrainStats> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("agent_os")
    .from("knowledge")
    .select("type, confidence, last_reviewed_at");

  const rows = (data ?? []) as Pick<
    KnowledgeEntry,
    "type" | "confidence" | "last_reviewed_at"
  >[];
  const by_type: Record<string, number> = {};
  let confSum = 0,
    confCount = 0,
    needs_review = 0;
  const reviewCutoff = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  for (const r of rows) {
    by_type[r.type] = (by_type[r.type] ?? 0) + 1;
    if (r.confidence != null) {
      confSum += r.confidence;
      confCount++;
    }
    if (r.last_reviewed_at < reviewCutoff) needs_review++;
  }

  return {
    total: rows.length,
    by_type,
    avg_confidence:
      confCount > 0
        ? Math.round((confSum / confCount) * 100) / 100
        : null,
    needs_review,
  };
}

export async function getAuditEvents(limit = 200) {
  const supabase = await createClient();

  const [runsRes, stepsRes, approvalsRes] = await Promise.all([
    supabase
      .schema("agent_os")
      .from("pipeline_runs")
      .select("id_text, pipeline, status, created_at, finished_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .schema("agent_os")
      .from("pipeline_steps")
      .select("run_id_text, iteration, phase, agent, status, score, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .schema("agent_os")
      .from("pipeline_approvals")
      .select(
        "run_id_text, iteration, phase, agent, tool_name, status, decided_at, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  type RunRow = { kind: "run"; at: string; data: Record<string, unknown> };
  type StepRow = { kind: "step"; at: string; data: Record<string, unknown> };
  type ApprovalRow = {
    kind: "approval";
    at: string;
    data: Record<string, unknown>;
  };
  type AuditEvent = RunRow | StepRow | ApprovalRow;

  const events: AuditEvent[] = [
    ...(runsRes.data ?? []).map((r) => ({
      kind: "run" as const,
      at: r.created_at as string,
      data: r as Record<string, unknown>,
    })),
    ...(stepsRes.data ?? []).map((s) => ({
      kind: "step" as const,
      at: s.created_at as string,
      data: s as Record<string, unknown>,
    })),
    ...(approvalsRes.data ?? []).map((a) => ({
      kind: "approval" as const,
      at: a.created_at as string,
      data: a as Record<string, unknown>,
    })),
  ];

  events.sort((a, b) => b.at.localeCompare(a.at));
  return events.slice(0, limit);
}
