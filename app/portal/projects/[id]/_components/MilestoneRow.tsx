"use client";

import { updateMilestoneStatusAction, deleteMilestoneAction } from "../../_actions";

const MS_STATUS: Record<string, { label: string; icon: string; color: string; next: string }> = {
  pending:     { label: "Offen",     icon: "○", color: "text-text-muted",  next: "in_progress" },
  in_progress: { label: "In Arbeit", icon: "◑", color: "text-primary",     next: "completed" },
  completed:   { label: "Fertig",    icon: "●", color: "text-green-400",   next: "pending" },
  blocked:     { label: "Blockiert", icon: "✕", color: "text-accent",      next: "pending" },
};

interface Milestone {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
}

export default function MilestoneRow({
  ms,
  projectId,
  isAdmin,
}: {
  ms: Milestone;
  projectId: string;
  isAdmin: boolean;
}) {
  const cfg = MS_STATUS[ms.status] ?? MS_STATUS.pending;

  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
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
        <p className={`text-sm font-medium ${ms.status === "completed" ? "text-text-muted line-through" : "text-text-primary"}`}>
          {ms.title}
        </p>
        {ms.due_date && (
          <p className="font-mono text-[10px] text-text-muted mt-0.5">
            {new Date(ms.due_date).toLocaleDateString("de-DE")}
          </p>
        )}
      </div>
      <span className="font-mono text-[10px] text-text-muted shrink-0">{cfg.label}</span>
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
  );
}
