// ─── Automations: gemeinsame Typen ──────────────────────────────────────────

export type TriggerType = "event" | "schedule" | "date_offset";

export type StepType =
  | "send_email"
  | "ai_generate"
  | "create_message"
  | "create_task"
  | "http_request"
  | "condition";

export interface AutomationTrigger {
  type: TriggerType;
  config: Record<string, any>;
}

export interface AutomationStep {
  type: StepType;
  config: Record<string, any>;
}

export interface Automation {
  id: string;
  name: string;
  description: string | null;
  enabled: boolean;
  trigger: AutomationTrigger;
  steps: AutomationStep[];
  is_system: boolean;
  last_run_at: string | null;
  last_run_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface AutomationRun {
  id: string;
  automation_id: string;
  status: "pending" | "running" | "success" | "failed" | "skipped";
  trigger_context: Record<string, any>;
  dedupe_key: string | null;
  steps_result: StepResult[];
  error: string | null;
  is_test: boolean;
  started_at: string;
  finished_at: string | null;
}

export interface StepResult {
  type: StepType;
  status: "success" | "failed" | "skipped";
  detail?: string;
  error?: string;
}

/** Laufzeit-Kontext, der durch die Schritte einer Automation fließt. */
export interface RunContext {
  portalUrl: string;
  client?: { id: string; name: string; email: string | null };
  project?: { id: string; title: string; status: string };
  milestone?: { id: string; title: string };
  message?: { content: string; sender_role: string };
  /** Akkumulierte Variablen für {{platzhalter}} und Folgeschritte (z.B. ai_content). */
  vars: Record<string, string>;
  /** Idempotenz-Schlüssel (z.B. "<entity_id>:2026"), gesetzt vom Trigger. */
  dedupeKey?: string;
}

/** Baut die Basis-Platzhalter aus dem Kontext (mit vars gemerged). */
export function buildVars(ctx: RunContext): Record<string, string> {
  return {
    portal_url: ctx.portalUrl,
    client_name: ctx.client?.name ?? "Kunde",
    client_email: ctx.client?.email ?? "",
    project_name: ctx.project?.title ?? "",
    milestone_name: ctx.milestone?.title ?? "",
    preview: ctx.message?.content ?? "",
    ...ctx.vars,
  };
}
