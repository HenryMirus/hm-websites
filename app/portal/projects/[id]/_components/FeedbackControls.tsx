"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import type { ProjectFormState } from "../../_actions";

interface Feedback {
  id: string;
  round: number;
  source: string;
  summary: string;
  status: string;
  given_at: string;
}

interface FeedbackControlsProps {
  feedback: Feedback[];
  projectId: string;
  createFeedbackAction: (projectId: string, prev: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  deleteFeedbackAction: (id: string, projectId: string) => Promise<void>;
}

export default function FeedbackControls({
  feedback,
  projectId,
  createFeedbackAction,
  deleteFeedbackAction,
}: FeedbackControlsProps) {
  const [showForm, setShowForm] = useState(false);
  const boundCreate = createFeedbackAction.bind(null, projectId);
  const [state, formAction] = useFormState(boundCreate, {} as ProjectFormState);

  const nextRound = feedback.length > 0 ? Math.max(...feedback.map((f) => f.round)) + 1 : 1;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-text-primary">Feedback-Runden</h2>
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
          <div className="flex gap-3">
            <input type="number" name="round" defaultValue={nextRound} min={1} placeholder="Runde"
              className="w-20 bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-primary transition-colors" />
            <input type="text" name="source" placeholder="Quelle (z.B. Kunde, Intern)" defaultValue="Kunde"
              className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors" />
            <select name="status" defaultValue="open"
              className="bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-primary transition-colors">
              <option value="open">Offen</option>
              <option value="addressed">Erledigt</option>
              <option value="wont_fix">Kein Fix</option>
            </select>
          </div>
          <textarea name="summary" placeholder="Feedback-Zusammenfassung *" required rows={3}
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

      {feedback.length === 0 && !showForm && (
        <p className="text-text-muted text-sm">Keine Feedback-Runden</p>
      )}

      <div className="space-y-3">
        {feedback.map((f) => (
          <div key={f.id} className="py-2 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-text-muted">Runde {f.round}</span>
              <span className="font-mono text-[10px] text-text-muted">·</span>
              <span className="font-mono text-[10px] text-text-muted">{f.source}</span>
              <span className={`ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                f.status === "addressed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                f.status === "wont_fix" ? "bg-border/60 text-text-muted border-border" :
                "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              }`}>
                {f.status === "addressed" ? "Erledigt" : f.status === "wont_fix" ? "Kein Fix" : "Offen"}
              </span>
              <button
                onClick={() => deleteFeedbackAction(f.id, projectId)}
                className="shrink-0 p-1 text-text-muted hover:text-accent transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5M3 3.5l.5 8.5h7l.5-8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="text-text-dim text-sm">{f.summary}</p>
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
