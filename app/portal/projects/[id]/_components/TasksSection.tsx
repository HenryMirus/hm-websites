"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import type { ProjectFormState } from "../../_actions";

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string; next: string }> = {
  todo:        { label: "Offen",      icon: "○", color: "text-text-muted",  next: "in_progress" },
  in_progress: { label: "In Arbeit",  icon: "◑", color: "text-primary",     next: "done" },
  done:        { label: "Erledigt",   icon: "●", color: "text-green-400",   next: "todo" },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low:    { label: "Niedrig", color: "text-text-muted" },
  medium: { label: "Mittel",  color: "text-yellow-400" },
  high:   { label: "Hoch",    color: "text-accent" },
};

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  milestone_id?: string | null;
  kundensichtbar?: boolean;
}

interface MilestoneOption {
  id: string;
  title: string;
}

interface TasksSectionProps {
  tasks: Task[];
  projectId: string;
  isAdmin: boolean;
  /** Für die Zuordnung im Anlegen-Formular und das Etikett an der Aufgabe. */
  milestones?: MilestoneOption[];
  createTaskAction?: (projectId: string, prev: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  updateTaskStatusAction?: (id: string, projectId: string, status: string) => Promise<void>;
  deleteTaskAction?: (id: string, projectId: string) => Promise<void>;
}

export default function TasksSection({
  tasks,
  projectId,
  isAdmin,
  milestones = [],
  createTaskAction,
  updateTaskStatusAction,
  deleteTaskAction,
}: TasksSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const boundCreate = createTaskAction?.bind(null, projectId);
  const [state, formAction] = useFormState(
    boundCreate ?? (async (_: ProjectFormState, __: FormData) => ({} as ProjectFormState)),
    {} as ProjectFormState
  );

  const msTitle = new Map(milestones.map((m) => [m.id, m.title]));

  const grouped = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-text-primary">Aufgaben</h2>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-text-muted">
            {tasks.filter((t) => t.status === "done").length}/{tasks.length} erledigt
          </span>
          {isAdmin && (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="font-mono text-[11px] text-primary hover:text-primary/80 transition-colors"
            >
              {showForm ? "− schließen" : "+ Hinzufügen"}
            </button>
          )}
        </div>
      </div>

      {isAdmin && showForm && (
        <form
          action={async (formData: FormData) => {
            await formAction(formData);
            setShowForm(false);
          }}
          className="mb-4 bg-bg border border-border rounded-xl p-4 space-y-3"
        >
          <input
            type="text"
            name="title"
            placeholder="Aufgabe..."
            required
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
          />
          <input
            type="text"
            name="description"
            placeholder="Beschreibung (optional)"
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
          />
          {milestones.length > 0 && (
            <select
              name="milestone_id"
              defaultValue=""
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-primary transition-colors"
            >
              <option value="">Keinem Meilenstein zugeordnet</option>
              {milestones.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          )}
          <label className="flex items-center gap-2 text-sm text-text-dim select-none">
            <input type="checkbox" name="kundensichtbar" className="accent-primary" />
            Für den Kunden sichtbar (Standard: nur intern)
          </label>
          <div className="flex gap-3">
            <select
              name="priority"
              defaultValue="medium"
              className="bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-primary transition-colors"
            >
              <option value="low">Niedrig</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
            </select>
            <input
              type="date"
              name="due_date"
              className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          {state?.error && (
            <p className="text-accent text-xs">{state.error}</p>
          )}
          <div className="flex gap-2">
            <AddButton />
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-text-muted hover:text-text-dim transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {tasks.length === 0 && !showForm && (
        <p className="text-text-muted text-sm">Keine Aufgaben</p>
      )}

      {(["in_progress", "todo", "done"] as const).map((s) => {
        const list = grouped[s];
        if (!list.length) return null;
        const cfg = STATUS_CONFIG[s];
        return (
          <div key={s} className="mb-3">
            <p className={`font-mono text-[11px] uppercase tracking-wider mb-2 ${cfg.color}`}>
              {cfg.label} ({list.length})
            </p>
            <div className="space-y-1.5">
              {list.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  isAdmin={isAdmin}
                  milestoneTitle={task.milestone_id ? msTitle.get(task.milestone_id) : undefined}
                  updateTaskStatusAction={updateTaskStatusAction}
                  deleteTaskAction={deleteTaskAction}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskRow({
  task,
  projectId,
  isAdmin,
  milestoneTitle,
  updateTaskStatusAction,
  deleteTaskAction,
}: {
  task: Task;
  projectId: string;
  isAdmin: boolean;
  milestoneTitle?: string;
  updateTaskStatusAction?: (id: string, projectId: string, status: string) => Promise<void>;
  deleteTaskAction?: (id: string, projectId: string) => Promise<void>;
}) {
  const cfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.todo;
  const pCfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;

  return (
    <div className="flex items-start gap-2.5 py-1.5 border-b border-border/40 last:border-0">
      {isAdmin && updateTaskStatusAction ? (
        <button
          onClick={() => updateTaskStatusAction(task.id, projectId, cfg.next)}
          className={`font-mono text-sm mt-0.5 shrink-0 hover:opacity-70 transition-opacity ${cfg.color}`}
          title={`→ ${STATUS_CONFIG[cfg.next].label}`}
        >
          {cfg.icon}
        </button>
      ) : (
        <span className={`font-mono text-sm mt-0.5 shrink-0 ${cfg.color}`}>{cfg.icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${task.status === "done" ? "text-text-muted line-through" : "text-text-primary"}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-text-muted text-xs mt-0.5">{task.description}</p>
        )}
        <div className="flex items-center flex-wrap gap-2 mt-0.5">
          <span className={`font-mono text-[11px] ${pCfg.color}`}>{pCfg.label}</span>
          {milestoneTitle && (
            <span className="font-mono text-[11px] text-text-muted bg-bg border border-border rounded px-1.5 py-0.5">
              {milestoneTitle}
            </span>
          )}
          {isAdmin && task.kundensichtbar === false && (
            <span className="font-mono text-[11px] text-accent border border-accent/30 rounded px-1.5 py-0.5">
              intern
            </span>
          )}
          {task.due_date && (
            <span className="font-mono text-[11px] text-text-muted">
              · {new Date(task.due_date).toLocaleDateString("de-DE")}
            </span>
          )}
        </div>
      </div>
      {isAdmin && deleteTaskAction && (
        <button
          onClick={() => deleteTaskAction(task.id, projectId)}
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

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50 transition-colors"
    >
      {pending ? "..." : "Hinzufügen"}
    </button>
  );
}
