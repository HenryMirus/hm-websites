"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/getRole";
import { revalidatePath } from "next/cache";
import { runAutomation } from "@/lib/automations/engine";
import { findDueAutomations } from "@/lib/automations/triggers";
import type { Automation, AutomationStep, AutomationTrigger, RunContext } from "@/lib/automations/types";

export interface AutomationInput {
  id?: string;
  name: string;
  description?: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  steps: AutomationStep[];
}

export async function saveAutomationAction(
  input: AutomationInput
): Promise<{ error?: string; id?: string }> {
  await requireAdmin();
  if (!input.name?.trim()) return { error: "Name ist ein Pflichtfeld." };
  if (!input.trigger?.type) return { error: "Bitte einen Trigger wählen." };

  const supabase = await createClient();
  const row = {
    name: input.name.trim(),
    description: input.description?.trim() || null,
    enabled: input.enabled,
    trigger: input.trigger,
    steps: input.steps ?? [],
  };

  if (input.id) {
    const { error } = await supabase.from("automations").update(row).eq("id", input.id);
    if (error) return { error: error.message };
    revalidatePath("/portal/automations");
    revalidatePath(`/portal/automations/${input.id}`);
    return { id: input.id };
  }

  const { data, error } = await supabase.from("automations").insert(row).select("id").single();
  if (error) return { error: error.message };
  revalidatePath("/portal/automations");
  return { id: data.id };
}

export async function toggleAutomationAction(id: string, enabled: boolean): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("automations").update({ enabled }).eq("id", id);
  revalidatePath("/portal/automations");
}

export async function deleteAutomationAction(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { data: a } = await supabase.from("automations").select("is_system").eq("id", id).single();
  if (a?.is_system) return { error: "System-Automationen können nur deaktiviert werden." };
  const { error } = await supabase.from("automations").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/portal/automations");
  return {};
}

/**
 * Testlauf: führt die Automation einmal aus (is_test=true, keine Idempotenz).
 * Für date/schedule-Trigger wird der erste passende Kontext genutzt, sonst ein
 * Demo-Kontext mit dem ersten Kunden.
 */
export async function runAutomationTestAction(
  id: string
): Promise<{ error?: string; status?: string }> {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: automation } = await admin
    .from("automations")
    .select("*")
    .eq("id", id)
    .single<Automation>();
  if (!automation) return { error: "Automation nicht gefunden." };

  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";
  let ctx: RunContext = { portalUrl, vars: {} };

  // Für Datums-Trigger: ersten realen fälligen Kontext suchen (ohne Datum-Check
  // wäre nichts fällig → wir nehmen einfach den ersten Kunden + sein Projekt).
  const { data: client } = await admin
    .from("clients")
    .select("id, name, email, projects(id, title, status)")
    .limit(1)
    .maybeSingle();
  if (client) {
    const proj = (client as any).projects?.[0];
    ctx = {
      portalUrl,
      vars: {},
      client: { id: client.id, name: client.name, email: client.email },
      project: proj ? { id: proj.id, title: proj.title, status: proj.status } : undefined,
      message: { content: "Test-Vorschau dieser Automation.", sender_role: "admin" },
      milestone: { id: "test", title: "Test-Meilenstein" },
    };
  }

  const summary = await runAutomation(automation, ctx, { isTest: true });
  revalidatePath(`/portal/automations/${id}`);
  if (summary.status === "failed") return { error: summary.error ?? "Fehlgeschlagen.", status: summary.status };
  return { status: summary.status };
}

/** Cron-Tick manuell auslösen (verarbeitet alle fälligen zeitbasierten Automationen). */
export async function runCronTickAction(): Promise<{ evaluated: number; ran: number }> {
  await requireAdmin();
  const due = await findDueAutomations(new Date());
  let ran = 0;
  for (const { automation, ctx } of due) {
    const s = await runAutomation(automation, ctx);
    if (s.status === "success") ran++;
  }
  revalidatePath("/portal/automations");
  return { evaluated: due.length, ran };
}

export interface TemplateInput {
  key: string;
  name: string;
  subject: string;
  heading: string;
  preheader: string;
  body_html: string;
  cta_label: string;
  cta_href: string;
}

export async function saveEmailTemplateAction(input: TemplateInput): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("email_templates")
    .update({
      name: input.name,
      subject: input.subject,
      heading: input.heading,
      preheader: input.preheader,
      body_html: input.body_html,
      cta_label: input.cta_label,
      cta_href: input.cta_href,
    })
    .eq("key", input.key);
  if (error) return { error: error.message };
  revalidatePath("/portal/automations/templates");
  revalidatePath(`/portal/automations/templates/${input.key}`);
  return {};
}
