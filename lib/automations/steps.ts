// ─── Schritt-Ausführung ─────────────────────────────────────────────────────

import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email/send";
import { renderTemplate, interpolate, type EmailTemplateRow } from "@/lib/email/templates";
import { buildVars, type AutomationStep, type RunContext, type StepResult } from "./types";

type Admin = SupabaseClient;
export type StepOutcome = StepResult & { stop?: boolean };

async function getAdminEmails(admin: Admin): Promise<string[]> {
  const { data: profiles } = await admin.from("profiles").select("id").eq("role", "admin");
  if (!profiles || profiles.length === 0) return [];
  const adminIds = profiles.map((p) => p.id as string);
  const { data } = await admin.auth.admin.listUsers({ perPage: 200 });
  return (data?.users ?? [])
    .filter((u) => adminIds.includes(u.id) && u.email)
    .map((u) => u.email as string);
}

async function firstAdminId(admin: Admin): Promise<string | null> {
  const { data } = await admin.from("profiles").select("id").eq("role", "admin").limit(1).single();
  return (data?.id as string) ?? null;
}

async function runSendEmail(
  config: Record<string, any>,
  ctx: RunContext,
  admin: Admin
): Promise<StepOutcome> {
  const vars = buildVars(ctx);
  const { data: template } = await admin
    .from("email_templates")
    .select("*")
    .eq("key", config.templateKey)
    .single<EmailTemplateRow>();

  if (!template) {
    return { type: "send_email", status: "failed", error: `Template "${config.templateKey}" nicht gefunden.` };
  }

  let recipients: string[] = [];
  if (config.recipient === "admins") {
    recipients = await getAdminEmails(admin);
  } else if (config.recipient === "custom") {
    recipients = interpolate(String(config.to ?? ""), vars)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    // default: client
    if (ctx.client?.email) recipients = [ctx.client.email];
  }

  if (recipients.length === 0) {
    return { type: "send_email", status: "skipped", detail: "Keine Empfänger-Adresse." };
  }

  const { subject, html } = renderTemplate(template, vars);
  await sendEmail({ to: recipients, subject, html });
  return { type: "send_email", status: "success", detail: `→ ${recipients.join(", ")}` };
}

async function runAiGenerate(
  config: Record<string, any>,
  ctx: RunContext
): Promise<StepOutcome> {
  const outputVar = String(config.outputVar || "ai_content");
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    ctx.vars[outputVar] = ""; // graceful: E-Mail-Template fällt auf Default zurück
    return { type: "ai_generate", status: "skipped", detail: "ANTHROPIC_API_KEY nicht gesetzt." };
  }

  const prompt = interpolate(String(config.prompt ?? ""), buildVars(ctx));
  // Kontext anreichern: letzte Nachrichten & Projekte des Kunden
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey });
  const msg = await client.messages.create({
    model: String(config.model || "claude-sonnet-4-6"),
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });
  const text = msg.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("\n")
    .trim();

  ctx.vars[outputVar] = text;
  return { type: "ai_generate", status: "success", detail: `${text.length} Zeichen → {{${outputVar}}}` };
}

async function runCreateMessage(
  config: Record<string, any>,
  ctx: RunContext,
  admin: Admin
): Promise<StepOutcome> {
  if (!ctx.client?.id) {
    return { type: "create_message", status: "skipped", detail: "Kein Kunde im Kontext." };
  }
  const senderId = await firstAdminId(admin);
  if (!senderId) {
    return { type: "create_message", status: "failed", error: "Kein Admin als Absender gefunden." };
  }
  const content = interpolate(String(config.content ?? ""), buildVars(ctx));
  const { error } = await admin.from("messages").insert({
    client_id: ctx.client.id,
    sender_id: senderId,
    sender_role: "admin",
    content,
  });
  if (error) return { type: "create_message", status: "failed", error: error.message };
  return { type: "create_message", status: "success" };
}

async function runCreateTask(
  config: Record<string, any>,
  ctx: RunContext,
  admin: Admin
): Promise<StepOutcome> {
  if (!ctx.project?.id) {
    return { type: "create_task", status: "skipped", detail: "Kein Projekt im Kontext." };
  }
  const title = interpolate(String(config.title ?? ""), buildVars(ctx));
  const { error } = await admin.from("tasks").insert({
    project_id: ctx.project.id,
    title,
    priority: config.priority || "medium",
  });
  if (error) return { type: "create_task", status: "failed", error: error.message };
  return { type: "create_task", status: "success" };
}

async function runHttpRequest(
  config: Record<string, any>,
  ctx: RunContext
): Promise<StepOutcome> {
  const vars = buildVars(ctx);
  const url = interpolate(String(config.url ?? ""), vars);
  if (!url) return { type: "http_request", status: "skipped", detail: "Keine URL." };
  const method = (config.method || "POST").toUpperCase();
  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json", ...(config.headers || {}) },
  };
  if (method !== "GET" && config.body) init.body = interpolate(String(config.body), vars);
  try {
    const res = await fetch(url, init);
    return {
      type: "http_request",
      status: res.ok ? "success" : "failed",
      detail: `${method} ${url} → ${res.status}`,
      error: res.ok ? undefined : `HTTP ${res.status}`,
    };
  } catch (e) {
    return { type: "http_request", status: "failed", error: (e as Error).message };
  }
}

function runCondition(config: Record<string, any>, ctx: RunContext): StepOutcome {
  const vars = buildVars(ctx);
  const actual = vars[String(config.field ?? "")] ?? "";
  const expected = interpolate(String(config.value ?? ""), vars);
  let ok = true;
  switch (config.op) {
    case "eq": ok = actual === expected; break;
    case "neq": ok = actual !== expected; break;
    case "contains": ok = actual.includes(expected); break;
    case "not_empty": ok = actual.trim().length > 0; break;
    default: ok = true;
  }
  return ok
    ? { type: "condition", status: "success", detail: "erfüllt" }
    : { type: "condition", status: "skipped", detail: "nicht erfüllt — gestoppt", stop: true };
}

export async function executeStep(
  step: AutomationStep,
  ctx: RunContext,
  admin: Admin
): Promise<StepOutcome> {
  switch (step.type) {
    case "send_email": return runSendEmail(step.config, ctx, admin);
    case "ai_generate": return runAiGenerate(step.config, ctx);
    case "create_message": return runCreateMessage(step.config, ctx, admin);
    case "create_task": return runCreateTask(step.config, ctx, admin);
    case "http_request": return runHttpRequest(step.config, ctx);
    case "condition": return runCondition(step.config, ctx);
    default:
      return { type: step.type, status: "skipped", detail: "Unbekannter Schritt-Typ." };
  }
}
