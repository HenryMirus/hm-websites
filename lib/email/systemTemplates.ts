import { createAdminClient } from "@/lib/supabase/admin";
import type { EmailTemplateRow } from "./templates";

// Fallbacks für die System-Mails, falls die Zeilen in `email_templates` (noch)
// fehlen. Inhaltlich identisch mit den Migrationen
// db/migrations/2026-10-28_contact_email_templates.sql und
// db/migrations/2026-10-28_portal_notification_templates.sql — im Portal unter
// Automationen → Vorlagen bearbeitete Fassungen haben Vorrang.
const P = `margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;`;
const ROW = `padding:6px 0;font-size:13px;line-height:1.6;vertical-align:top;`;
const quote = (border: string) =>
  `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr><td style="background-color:#09090F;border:1px solid #1E1E2E;border-left:3px solid ${border};border-radius:8px;padding:14px 16px;"><p style="margin:0;font-size:13px;color:#8888AA;line-height:1.6;white-space:pre-wrap;">{{preview}}</p></td></tr></table>`;

const BLUE = {
  accent: "linear-gradient(90deg,#4F7FFF 0%,#7B9FFF 100%)",
  icon_bg: "rgba(79,127,255,0.10)",
  icon_border: "rgba(79,127,255,0.22)",
  cta_bg: "#2A5CE8",
};
const RED = {
  accent: "linear-gradient(90deg,#FF4D6A 0%,#FF7A8A 100%)",
  icon_bg: "rgba(255,77,106,0.10)",
  icon_border: "rgba(255,77,106,0.22)",
  cta_bg: "#FF4D6A",
};
const GREEN = {
  accent: "linear-gradient(90deg,#22C55E 0%,#4ADE80 100%)",
  icon_bg: "rgba(34,197,94,0.10)",
  icon_border: "rgba(34,197,94,0.22)",
  cta_bg: "#16A34A",
};

export const SYSTEM_TEMPLATE_DEFAULTS: Record<string, EmailTemplateRow> = {
  contact_received_admin: {
    key: "contact_received_admin",
    name: "Neue Website-Anfrage → Admins",
    subject: "Neue Anfrage von {{name}}",
    heading: "Neue Anfrage über die Website",
    preheader: "{{name}} hat über hm-labs.tech angefragt.",
    body_html:
      `<p style="${P}"><strong style="color:#EEEEFF;">{{name}}</strong> hat über die Website eine Anfrage gesendet. Eine Antwort auf diese Mail geht direkt an {{email}}.</p>` +
      `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">` +
      `<tr><td style="${ROW}color:#5A5A7A;width:110px;">E-Mail</td><td style="${ROW}color:#EEEEFF;">{{email}}</td></tr>` +
      `<tr><td style="${ROW}color:#5A5A7A;">Unternehmen</td><td style="${ROW}color:#EEEEFF;">{{company}}</td></tr>` +
      `<tr><td style="${ROW}color:#5A5A7A;">Telefon</td><td style="${ROW}color:#EEEEFF;">{{phone}}</td></tr>` +
      `<tr><td style="${ROW}color:#5A5A7A;">Betreff</td><td style="${ROW}color:#EEEEFF;">{{subject}}</td></tr>` +
      `<tr><td style="${ROW}color:#5A5A7A;">Lead-Score</td><td style="${ROW}color:#EEEEFF;">{{lead_score}} ({{lead_tier}})</td></tr>` +
      `</table>` +
      `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr><td style="background-color:#09090F;border:1px solid #1E1E2E;border-left:3px solid #FF4D6A;border-radius:8px;padding:14px 16px;"><p style="margin:0;font-size:13px;color:#8888AA;line-height:1.6;white-space:pre-wrap;">{{message}}</p></td></tr></table>`,
    ...RED,
    icon_char: "&#x1F4E9;",
    cta_label: "Im Portal öffnen",
    cta_href: "{{portal_url}}/leads",
    note_text: null,
  },
  contact_confirmation_client: {
    key: "contact_confirmation_client",
    name: "Eingangsbestätigung Website-Anfrage → Anfragende",
    subject: "Ihre Anfrage bei HM Labs ist angekommen",
    heading: "Vielen Dank, {{name}}",
    preheader: "Ihre Anfrage ist bei mir angekommen.",
    body_html:
      `<p style="${P}">Ihre Anfrage ist bei mir angekommen. Ich sehe sie mir persönlich an und melde mich in der Regel innerhalb eines Werktags bei Ihnen.</p>` +
      `<p style="${P}">Falls Ihnen in der Zwischenzeit noch etwas einfällt, antworten Sie einfach auf diese E-Mail.</p>`,
    ...BLUE,
    icon_char: "&#x2713;",
    cta_label: "Leistungen ansehen",
    cta_href: "{{site_url}}/leistungen",
    note_text: null,
  },
  notify_new_message_client: {
    key: "notify_new_message_client",
    name: "Neue Nachricht → Kunde",
    subject: "Neue Nachricht von HM Labs",
    heading: "Neue Nachricht von HM Labs",
    preheader: "Sie haben eine neue Nachricht im Kundenportal.",
    body_html:
      `<p style="${P}">Hallo {{client_name}}, Sie haben eine neue Nachricht im Kundenportal. Melden Sie sich an, um sie zu lesen und zu antworten.</p>` +
      quote("#4F7FFF"),
    ...BLUE,
    icon_char: "&#x2709;",
    cta_label: "Nachricht öffnen",
    cta_href: "{{portal_url}}/messages",
    note_text: "Bitte antworten Sie im Portal, nicht auf diese E-Mail, damit alles an einem Ort bleibt.",
  },
  notify_new_message_admin: {
    key: "notify_new_message_admin",
    name: "Neue Nachricht → Admins",
    subject: "Neue Nachricht von {{client_name}}",
    heading: "Nachricht von {{client_name}}",
    preheader: "{{client_name}} hat im Portal geschrieben.",
    body_html:
      `<p style="${P}"><strong style="color:#EEEEFF;">{{client_name}}</strong> hat eine neue Nachricht im Portal gesendet.</p>` +
      quote("#FF4D6A"),
    ...RED,
    icon_char: "&#x1F514;",
    cta_label: "Im Portal öffnen",
    cta_href: "{{portal_url}}/messages/{{client_id}}",
    note_text: null,
  },
  notify_milestone_reached: {
    key: "notify_milestone_reached",
    name: "Meilenstein erreicht → Kunde",
    subject: "Meilenstein erreicht: {{milestone_name}}",
    heading: "Meilenstein erreicht",
    preheader: "{{milestone_name}} in {{project_name}} ist abgeschlossen.",
    body_html:
      `<p style="${P}">Hallo {{client_name}}, in Ihrem Projekt <strong style="color:#EEEEFF;">{{project_name}}</strong> ist ein Meilenstein abgeschlossen:</p>` +
      `<p style="margin:0 0 24px;font-size:16px;color:#EEEEFF;line-height:1.6;">&#10003;&nbsp; {{milestone_name}}</p>` +
      `<p style="${P}">Im Portal sehen Sie den aktuellen Stand aller Meilensteine und Aufgaben.</p>`,
    ...GREEN,
    icon_char: "&#10003;",
    cta_label: "Projekt ansehen",
    cta_href: "{{project_url}}",
    note_text: null,
  },
};

/** Lädt eine System-Vorlage aus der DB, sonst den Fallback aus dem Code. */
export async function loadSystemTemplate(key: string): Promise<EmailTemplateRow> {
  const fallback = SYSTEM_TEMPLATE_DEFAULTS[key];
  try {
    const { data } = await createAdminClient()
      .from("email_templates")
      .select("*")
      .eq("key", key)
      .maybeSingle<EmailTemplateRow>();
    return data ?? fallback;
  } catch {
    return fallback;
  }
}
