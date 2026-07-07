// ─── Engine: führt eine Automation aus & protokolliert den Lauf ─────────────

import { createAdminClient } from "@/lib/supabase/admin";
import { executeStep } from "./steps";
import { getMatchingEventAutomations } from "./triggers";
import type { Automation, RunContext, StepResult } from "./types";

/**
 * Feuert alle aktiven event-Automationen für ein Ereignis. Genutzt von den
 * Supabase-Webhooks UND dem Inline-Fallback in den Server Actions, damit es
 * genau einen Ausführungspfad gibt.
 */
export async function dispatchEvent(
  event: string,
  facts: Record<string, string | null | undefined>,
  ctx: RunContext
): Promise<{ fired: number }> {
  const automations = await getMatchingEventAutomations(event, facts);
  for (const automation of automations) {
    await runAutomation(automation, ctx);
  }
  return { fired: automations.length };
}

export interface RunOptions {
  isTest?: boolean;
}

export interface RunSummary {
  automationId: string;
  status: "success" | "failed" | "skipped";
  runId: string | null;
  steps: StepResult[];
  error?: string;
}

/**
 * Führt alle Schritte einer Automation sequentiell aus und schreibt einen
 * automation_runs-Eintrag. Idempotent: existiert (außerhalb von Tests) bereits
 * ein erfolgreicher Lauf mit demselben dedupeKey, wird übersprungen.
 */
export async function runAutomation(
  automation: Automation,
  ctx: RunContext,
  opts: RunOptions = {}
): Promise<RunSummary> {
  const admin = createAdminClient();
  const isTest = opts.isTest ?? false;

  // Idempotenz-Vorprüfung (der Unique-Index ist der Backstop bei Races).
  if (!isTest && ctx.dedupeKey) {
    const { data: existing } = await admin
      .from("automation_runs")
      .select("id")
      .eq("automation_id", automation.id)
      .eq("dedupe_key", ctx.dedupeKey)
      .eq("status", "success")
      .eq("is_test", false)
      .maybeSingle();
    if (existing) {
      return { automationId: automation.id, status: "skipped", runId: existing.id, steps: [] };
    }
  }

  const { data: run } = await admin
    .from("automation_runs")
    .insert({
      automation_id: automation.id,
      status: "running",
      trigger_context: {
        client_id: ctx.client?.id ?? null,
        project_id: ctx.project?.id ?? null,
        client_name: ctx.client?.name ?? null,
      },
      dedupe_key: ctx.dedupeKey ?? null,
      is_test: isTest,
    })
    .select("id")
    .single();

  const runId = run?.id ?? null;
  const steps: StepResult[] = [];
  let finalStatus: "success" | "failed" | "skipped" = "success";
  let errorMsg: string | undefined;

  for (const step of automation.steps ?? []) {
    try {
      const outcome = await executeStep(step, ctx, admin);
      const { stop, ...result } = outcome;
      steps.push(result);
      if (result.status === "failed") {
        finalStatus = "failed";
        errorMsg = result.error;
        break;
      }
      if (stop) {
        finalStatus = "skipped";
        break;
      }
    } catch (e) {
      const msg = (e as Error).message;
      steps.push({ type: step.type, status: "failed", error: msg });
      finalStatus = "failed";
      errorMsg = msg;
      break;
    }
  }

  if (runId) {
    await admin
      .from("automation_runs")
      .update({
        status: finalStatus,
        steps_result: steps,
        error: errorMsg ?? null,
        finished_at: new Date().toISOString(),
      })
      .eq("id", runId);
  }

  if (!isTest) {
    await admin
      .from("automations")
      .update({ last_run_at: new Date().toISOString(), last_run_status: finalStatus })
      .eq("id", automation.id);
  }

  return { automationId: automation.id, status: finalStatus, runId, steps, error: errorMsg };
}
