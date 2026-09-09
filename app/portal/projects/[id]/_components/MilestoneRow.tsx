"use client";

import { useState } from "react";
import { updateMilestoneStatusAction, deleteMilestoneAction } from "../../_actions";
import ProgressBar from "../../../_components/ProgressBar";

const MS_STATUS: Record<string, { label: string; icon: string; color: string; next: string }> = {
  pending:     { label: "Offen",     icon: "○", color: "text-text-muted",  next: "in_progress" },
  in_progress: { label: "In Arbeit", icon: "◑", color: "text-primary",     next: "completed" },
  completed:   { label: "Fertig",    icon: "●", color: "text-green-400",   next: "pending" },
  blocked:     { label: "Blockiert", icon: "✕", color: "text-accent",      next: "pending" },
};

const TASK_ICON: Record<string, { icon: string; color: string }> = {
  todo:        { icon: "○", color: "text-text-muted" },
  in_progress: { icon: "◑", color: "text-primary" },
  done:        { icon: "●", color: "text-green-400" },
};

interface Milestone {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
}

/** Nur was die Zeile zum Anzeigen braucht — nicht die ganze Aufgabe. */
export interface MilestoneTask {
  id: string;
  title: string;
  status: string;
}

export default function MilestoneRow({
  ms,
  projectId,
  isAdmin,
  tasks = [],
}: {
  ms: Milestone;
  projectId: string;
  isAdmin: boolean;
  /** Die Aufgaben dieses Meilensteins. Leer heißt: noch keine zugeordnet. */
  tasks?: MilestoneTask[];
}) {
  const cfg = MS_STATUS[ms.status] ?? MS_STATUS.pending;
  const [open, setOpen] = useState(false);

  const done = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;

  return (
    <div className="py-2 border-b border-border/50 last:border-0">
      <div className="flex items-start gap-3">
        {isAdmin ? (
          <button
            onClick={() => updateMilestoneStatusAction(ms.id, projectId, cfg.next)}
            className={`font-mono text-sm mt-0.5 hover:opacity-70 transition-opacity ${cfg.color}`}
            title={`→ ${MS_STATUS[cfg.next].label}`}
          >
            {cfg.icon}
          </button>
        ) : (
          <span className={`font-mono text-sm mt-0.5 ${cfg.color}`}>{cfg.icon}</span>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <p className={`text-sm font-medium ${ms.status === "completed" ? "text-text-muted line-through" : "text-text-primary"}`}>
              {ms.title}
            </p>
            {total > 0 && (
              <button
                onClick={() => setOpen((v) => !v)}
                className="font-mono text-[11px] text-text-muted hover:text-primary transition-colors shrink-0"
                aria-expanded={open}
                title={open ? "Aufgaben ausblenden" : "Aufgaben anzeigen"}
              >
                {done}/{total} {open ? "▴" : "▾"}
              </button>
            )}
          </div>

          {total > 0 && <ProgressBar done={done} total={total} className="mt-1.5 max-w-[240px]" />}

          {ms.due_date && (
            <p className="font-mono text-[11px] text-text-muted mt-1">
              {new Date(ms.due_date).toLocaleDateString("de-DE")}
            </p>
          )}
        </div>

        <span className="font-mono text-[11px] text-text-muted shrink-0">{cfg.label}</span>
        {isAdmin && (
          <button
            onClick={() => deleteMilestoneAction(ms.id, projectId)}
            className="shrink-0 p-1 text-text-muted hover:text-accent transition-colors"
            title="Löschen"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5M3 3.5l.5 8.5h7l.5-8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {open && total > 0 && (
        <ul className="mt-2 ml-7 space-y-1 border-l border-border/50 pl-3">
          {tasks.map((t) => {
            const ti = TASK_ICON[t.status] ?? TASK_ICON.todo;
            return (
              <li key={t.id} className="flex items-start gap-2">
                <span className={`font-mono text-[11px] mt-0.5 shrink-0 ${ti.color}`}>{ti.icon}</span>
                <span className={`text-xs ${t.status === "done" ? "text-text-muted line-through" : "text-text-dim"}`}>
                  {t.title}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
