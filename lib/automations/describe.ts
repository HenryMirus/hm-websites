import cronstrue from "cronstrue/i18n";
import type { AutomationTrigger } from "./types";

const EVENT_LABELS: Record<string, string> = {
  "message.created": "Neue Nachricht gesendet",
  "milestone.completed": "Meilenstein abgeschlossen",
};

const BASE_LABELS: Record<string, string> = {
  "project.launch_date": "Projekt-Launch",
  "project.start_date": "Projektstart",
  "client.first_project_start": "1. Projektstart des Kunden",
  "client.created_at": "Kunde angelegt",
};

/** Kurze deutsche Beschreibung eines Triggers für die Listen-/Detailansicht. */
export function describeTrigger(trigger: AutomationTrigger): string {
  const cfg = trigger?.config ?? {};
  if (trigger?.type === "event") {
    const ev = EVENT_LABELS[cfg.event] ?? cfg.event ?? "Ereignis";
    const role = cfg.filter?.sender_role;
    const suffix = role === "admin" ? " (von Admin)" : role === "client" ? " (von Kunde)" : "";
    return `Ereignis: ${ev}${suffix}`;
  }
  if (trigger?.type === "schedule") {
    try {
      return `Zeitplan: ${cronstrue.toString(String(cfg.cron), { locale: "de" })}`;
    } catch {
      return `Zeitplan: ${cfg.cron ?? "—"}`;
    }
  }
  if (trigger?.type === "date_offset") {
    const base = BASE_LABELS[cfg.base] ?? cfg.base ?? "Datum";
    const off = Number(cfg.offsetDays ?? 0);
    const offStr = off === 0 ? "am Tag" : `${off} Tage nach`;
    const rec = cfg.recurrence === "yearly" ? ", jährlich" : "";
    return `${offStr} ${base}${rec}`;
  }
  return "—";
}
