import type { SupabaseClient } from "@supabase/supabase-js";
import { buildVars, type RunContext } from "@/lib/automations/types";
import { sendEmail } from "./send";
import { renderTemplate } from "./templates";
import { loadSystemTemplate } from "./systemTemplates";
import { getAdminRecipients } from "./recipients";

/**
 * Standard-Benachrichtigung, wenn für ein Portal-Ereignis keine Automation
 * angelegt ist. So geht bei neuer Nachricht oder erreichtem Meilenstein immer
 * eine Mail raus, auch wenn unter Automationen nichts eingerichtet wurde. Wer
 * das Verhalten ändern will, legt dort eine Automation für das Ereignis an
 * (aktiv oder pausiert) — dann übernimmt sie, und dieser Pfad schweigt.
 *
 * Wirft nie: die auslösende Aktion ist zu diesem Zeitpunkt schon gespeichert.
 */
export async function sendDefaultPortalNotification(
  event: string,
  facts: Record<string, string | null | undefined>,
  ctx: RunContext,
  admin: SupabaseClient
): Promise<void> {
  let key: string;
  let to: string[];

  if (event === "message.created" && facts.sender_role === "admin") {
    key = "notify_new_message_client";
    to = await clientRecipient(ctx, admin);
  } else if (event === "message.created" && facts.sender_role === "client") {
    key = "notify_new_message_admin";
    to = await getAdminRecipients(admin);
  } else if (event === "milestone.completed") {
    key = "notify_milestone_reached";
    to = await clientRecipient(ctx, admin);
  } else {
    return;
  }

  if (to.length === 0) {
    console.warn(`[Email] ${key}: keine Empfänger-Adresse.`);
    return;
  }

  try {
    const template = await loadSystemTemplate(key);
    const vars = {
      ...buildVars(ctx),
      client_id: ctx.client?.id ?? "",
      project_url: ctx.vars.project_url ?? `${ctx.portalUrl}/projects`,
    };
    // ctx.vars kommen hier nur aus dem Code (project_url), nicht aus ai_generate,
    // deshalb wird alles maskiert.
    await sendEmail({ to, ...renderTemplate(template, vars) });
  } catch (e) {
    console.error(`[Email] ${key} fehlgeschlagen:`, e);
  }
}

async function clientRecipient(ctx: RunContext, admin: SupabaseClient): Promise<string[]> {
  if (ctx.client?.email) return [ctx.client.email];
  if (!ctx.client?.id) return [];
  const { data } = await admin.from("clients").select("email").eq("id", ctx.client.id).maybeSingle();
  return data?.email ? [data.email as string] : [];
}
