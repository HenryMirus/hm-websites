"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import type { ProjectFormState } from "../../_actions";

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

interface MilestoneControlsProps {
  milestones: Milestone[];
  projectId: string;
  createMilestoneAction: (projectId: string, prev: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  updateMilestoneStatusAction: (id: string, projectId: string, status: string) => Promise<void>;
  deleteMilestoneAction: (id: string, projectId: string) => Promise<void>;
}

export default function MilestoneControls({
  milestones,
  projectId,
  createMilestoneAction,
  updateMilestoneStatusAction,
  deleteMilestoneAction,
}: MilestoneControlsProps) {
  const [showForm, setShowForm] = useState(false);
  const boundCreate = createMilestoneAction.bind(null, projectId);
  const [state, formAction] = useFormState(boundCreate, {} as ProjectFormState);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-text-primary">Meilensteine</h2>
          <span className="font-mono text-[11px] text-text-muted">
            {milestones.filter((m) => m.status === "completed").length}/{milestones.length} fertig
          </span>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="font-mono text-[11px] text-primary hover:text-primary/80 transition-colors"
        >
          {showForm ? "− schließen" : "+ Hinzufügen"}
        </button>
      </div>

      {showForm && (
        <form
          action={async (fd: FormData) => {
            await formAction(fd);
            setShowForm(false);
          }}
          className="mb-4 bg-bg border border-border rounded-xl p-4 space-y-3"
        >
          <input
            type="text"
            name="title"
            placeholder="Meilenstein..."
            required
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
          />
          <div className="flex gap-3">
            <select
              name="status"
              defaultValue="pending"
              className="bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-primary"
            >
              <option value="pending">Offen</option>
              <option value="in_progress">In Arbeit</option>
              <option value="completed">Fertig</option>
              <option value="blocked">Blockiert</option>
            </select>
            <input
              type="date"
              name="due_date"
              className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          {state?.error && <p className="text-accent text-xs">{state.error}</p>}
          <div className="flex gap-2">
            <AddButton />
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-text-muted hover:text-text-dim">
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {milestones.length === 0 && !showForm && (
        <p className="text-text-muted text-sm">Keine Meilensteine</p>
      )}

      <div className="space-y-1.5">
        {milestones.map((ms) => {
          const cfg = MS_STATUS[ms.status] ?? MS_STATUS.pending;
          return (
            <div key={ms.id} className="flex items-start gap-2.5 py-1.5 border-b border-border/40 last:border-0">
              <button
                onClick={() => updateMilestoneStatusAction(ms.id, projectId, cfg.next)}
                className={`font-mono text-sm mt-0.5 shrink-0 hover:opacity-70 transition-opacity ${cfg.color}`}
                title={`→ ${MS_STATUS[cfg.next].label}`}
              >
                {cfg.icon}
              </button>
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
              <span className={`font-mono text-[10px] shrink-0 ${cfg.color}`}>{cfg.label}</span>
              <button
                onClick={() => deleteMilestoneAction(ms.id, projectId)}
                className="shrink-0 p-1 text-text-muted hover:text-accent transition-colors"
                title="Löschen"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5M3 3.5l.5 8.5h7l.5-8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50 transition-colors">
      {pending ? "..." : "Hinzufügen"}
    </button>
  );
}
