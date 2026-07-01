// ─── Registry: Metadaten aller Trigger- & Schritt-Typen ─────────────────────
//
// Eine Quelle für Engine UND Portal-Builder. Beschreibt pro Typ die Felder, die
// im Formular gezeigt werden, sodass das UI generisch daraus gebaut werden kann.

import type { StepType, TriggerType } from "./types";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "multiselect";
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  default?: string | number | string[];
  /** Nur anzeigen, wenn ein anderes Feld einen bestimmten Wert hat. */
  showIf?: { key: string; equals: string };
}

export interface TriggerDef {
  type: TriggerType;
  label: string;
  description: string;
  icon: string; // emoji für kompakte UI
  fields: FieldDef[];
}

export interface StepDef {
  type: StepType;
  label: string;
  description: string;
  icon: string;
  fields: FieldDef[];
}

const PROJECT_STATUS = [
  { value: "discovery", label: "Discovery" },
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "review", label: "Review" },
  { value: "live", label: "Live" },
  { value: "maintenance", label: "Maintenance" },
];

export const TRIGGERS: TriggerDef[] = [
  {
    type: "event",
    label: "Ereignis",
    description: "Reagiert sofort auf eine Aktion im Portal.",
    icon: "⚡",
    fields: [
      {
        key: "event",
        label: "Ereignis",
        type: "select",
        default: "message.created",
        options: [
          { value: "message.created", label: "Neue Nachricht gesendet" },
          { value: "milestone.completed", label: "Meilenstein abgeschlossen" },
        ],
      },
      {
        key: "filter.sender_role",
        label: "Nur von (Absender-Rolle)",
        type: "select",
        default: "",
        help: "Optional — nur bei 'Neue Nachricht' relevant.",
        showIf: { key: "event", equals: "message.created" },
        options: [
          { value: "", label: "Egal" },
          { value: "admin", label: "Admin (→ an Kunde)" },
          { value: "client", label: "Kunde (→ an Admins)" },
        ],
      },
    ],
  },
  {
    type: "schedule",
    label: "Zeitplan (Cron)",
    description: "Läuft nach einem festen Zeitplan.",
    icon: "⏰",
    fields: [
      {
        key: "cron",
        label: "Cron-Ausdruck",
        type: "text",
        default: "0 9 * * 1",
        placeholder: "0 9 * * 1",
        help: "5-Feld-Cron (Min Std Tag Monat Wochentag). Beispiel: 0 9 * * 1 = Mo 09:00.",
      },
    ],
  },
  {
    type: "date_offset",
    label: "Datum / Jahrestag",
    description: "Relativ zu einem Datum des Kunden/Projekts.",
    icon: "📅",
    fields: [
      {
        key: "base",
        label: "Basis-Datum",
        type: "select",
        default: "project.launch_date",
        options: [
          { value: "project.launch_date", label: "Projekt-Launch (launch_date)" },
          { value: "project.start_date", label: "Projektstart (start_date)" },
          { value: "client.first_project_start", label: "1. Projektstart des Kunden" },
          { value: "client.created_at", label: "Kunde angelegt" },
        ],
      },
      {
        key: "offsetDays",
        label: "Versatz (Tage)",
        type: "number",
        default: 30,
        help: "Tage nach dem Basis-Datum (0 = am Tag selbst).",
      },
      {
        key: "recurrence",
        label: "Wiederholung",
        type: "select",
        default: "once",
        options: [
          { value: "once", label: "Einmalig" },
          { value: "yearly", label: "Jährlich (Jahrestag)" },
        ],
      },
      {
        key: "statusIn",
        label: "Nur bei Projekt-Status",
        type: "multiselect",
        help: "Optional — leer = jeder Status. Nur bei projekt-basierten Triggern.",
        options: PROJECT_STATUS,
      },
    ],
  },
];

export const STEPS: StepDef[] = [
  {
    type: "send_email",
    label: "E-Mail senden",
    description: "Versendet ein E-Mail-Template.",
    icon: "✉️",
    fields: [
      {
        key: "templateKey",
        label: "Template",
        type: "select",
        // options werden im UI dynamisch aus email_templates befüllt
        options: [],
        help: "Vorlage aus dem Tab „E-Mail-Templates“.",
      },
      {
        key: "recipient",
        label: "Empfänger",
        type: "select",
        default: "client",
        options: [
          { value: "client", label: "Kunde" },
          { value: "admins", label: "Alle Admins" },
          { value: "custom", label: "Eigene Adresse(n)" },
        ],
      },
      {
        key: "to",
        label: "Adresse(n)",
        type: "text",
        placeholder: "name@firma.de, …",
        showIf: { key: "recipient", equals: "custom" },
      },
    ],
  },
  {
    type: "ai_generate",
    label: "KI-Text erzeugen",
    description: "Erzeugt mit Claude einen Textbaustein für Folgeschritte.",
    icon: "🤖",
    fields: [
      {
        key: "prompt",
        label: "Prompt",
        type: "textarea",
        placeholder: "Schreibe …",
        help: "Platzhalter wie {{client_name}} sind erlaubt.",
      },
      {
        key: "outputVar",
        label: "Speichern als Variable",
        type: "text",
        default: "ai_content",
        help: "Im E-Mail-Template als {{variable}} nutzbar.",
      },
      {
        key: "model",
        label: "Modell",
        type: "select",
        default: "claude-sonnet-4-6",
        options: [
          { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
          { value: "claude-opus-4-8", label: "Claude Opus 4.8" },
          { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
        ],
      },
    ],
  },
  {
    type: "create_message",
    label: "Portal-Nachricht anlegen",
    description: "Postet eine Nachricht in den Kunden-Chat.",
    icon: "💬",
    fields: [
      {
        key: "content",
        label: "Nachricht",
        type: "textarea",
        placeholder: "Hallo {{client_name}}, …",
      },
    ],
  },
  {
    type: "create_task",
    label: "Aufgabe anlegen",
    description: "Legt eine Aufgabe im Projekt an.",
    icon: "✅",
    fields: [
      { key: "title", label: "Titel", type: "text", placeholder: "Follow-up …" },
      {
        key: "priority",
        label: "Priorität",
        type: "select",
        default: "medium",
        options: [
          { value: "low", label: "Niedrig" },
          { value: "medium", label: "Mittel" },
          { value: "high", label: "Hoch" },
        ],
      },
    ],
  },
  {
    type: "http_request",
    label: "Webhook / HTTP-Request",
    description: "Ruft eine externe URL auf (Hook, Skript, Pipeline).",
    icon: "🔗",
    fields: [
      { key: "url", label: "URL", type: "text", placeholder: "https://…" },
      {
        key: "method",
        label: "Methode",
        type: "select",
        default: "POST",
        options: [
          { value: "POST", label: "POST" },
          { value: "GET", label: "GET" },
          { value: "PUT", label: "PUT" },
        ],
      },
      { key: "body", label: "Body (JSON)", type: "textarea", placeholder: "{ }" },
    ],
  },
  {
    type: "condition",
    label: "Bedingung (Filter)",
    description: "Stoppt die Automation, wenn die Bedingung nicht zutrifft.",
    icon: "🔀",
    fields: [
      {
        key: "field",
        label: "Variable",
        type: "text",
        placeholder: "client_name",
        help: "Name einer Variable (ohne {{ }}).",
      },
      {
        key: "op",
        label: "Operator",
        type: "select",
        default: "eq",
        options: [
          { value: "eq", label: "= gleich" },
          { value: "neq", label: "≠ ungleich" },
          { value: "contains", label: "enthält" },
          { value: "not_empty", label: "ist nicht leer" },
        ],
      },
      { key: "value", label: "Wert", type: "text" },
    ],
  },
];

export function triggerDef(type: TriggerType): TriggerDef | undefined {
  return TRIGGERS.find((t) => t.type === type);
}
export function stepDef(type: StepType): StepDef | undefined {
  return STEPS.find((s) => s.type === type);
}
