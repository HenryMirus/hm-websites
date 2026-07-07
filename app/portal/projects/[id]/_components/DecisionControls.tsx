"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import type { ProjectFormState } from "../../_actions";

interface Decision {
  id: string;
  title: string;
  decision: string;
  category: string;
  rationale: string | null;
  decided_at: string;
}

interface DecisionControlsProps {
  decisions: Decision[];
  projectId: string;
  createDecisionAction: (projectId: string, prev: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  deleteDecisionAction: (id: string, projectId: string) => Promise<void>;
}

export default function DecisionControls({
  decisions,
  projectId,
  createDecisionAction,
  deleteDecisionAction,
}: DecisionControlsProps) {
  const [showForm, setShowForm] = useState(false);
  const boundCreate = createDecisionAction.bind(null, projectId);
  const [state, formAction] = useFormState(boundCreate, {} as ProjectFormState);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-text-primary">Entscheidungen</h2>
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
          <input type="text" name="title" placeholder="Titel *" required
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors" />
          <input type="text" name="category" placeholder="Kategorie (z.B. Design, Tech)" defaultValue="Allgemein"
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors" />
          <textarea name="decision" placeholder="Entscheidung *" required rows={2}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors resize-none" />
          <textarea name="rationale" placeholder="Begründung (optional)" rows={2}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors resize-none" />
          {state?.error && <p className="text-accent text-xs">{state.error}</p>}
          <div className="flex gap-2">
            <AddButton />
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-text-muted hover:text-text-dim">
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {decisions.length === 0 && !showForm && (
        <p className="text-text-muted text-sm">Keine Entscheidungen</p>
      )}

      <div className="space-y-3">
        {decisions.map((d) => (
          <div key={d.id} className="py-2 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-text-muted bg-bg border border-border rounded px-1.5 py-0.5">{d.category}</span>
              <p className="text-text-primary text-sm font-medium flex-1">{d.title}</p>
              <button
                onClick={() => deleteDecisionAction(d.id, projectId)}
                className="shrink-0 p-1 text-text-muted hover:text-accent transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5M3 3.5l.5 8.5h7l.5-8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="text-text-dim text-sm">{d.decision}</p>
            {d.rationale && <p className="text-text-muted text-xs mt-1 italic">{d.rationale}</p>}
          </div>
        ))}
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
