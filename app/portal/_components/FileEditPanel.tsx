"use client";

import { useEffect, useRef, useState } from "react";
import {
  FILE_CATEGORIES,
  type FileCategory,
  type FileScope,
  type PortalFileWithUrl,
} from "@/lib/portal/fileTypes";

export interface FileUpdateResult {
  file: PortalFileWithUrl;
  /** true, wenn statt eines Umzugs eine Kopie entstanden ist (Chat-Anhänge). */
  copied: boolean;
  previous: PortalFileWithUrl;
}

interface FileEditPanelProps {
  file: PortalFileWithUrl;
  /** Projekte des Kunden — ohne sie steht „Aus Projekten“ nicht zur Wahl. */
  projects?: { id: string; title: string }[];
  /** Zuordnung verschieben darf nur der Admin; der Server prüft es noch einmal. */
  allowScopeChange?: boolean;
  onCancel: () => void;
  onSaved: (result: FileUpdateResult) => void;
}

const SCOPE_LABELS: Record<FileScope, string> = {
  client: "Kundenprofil",
  project: "Aus Projekten",
  chat: "Aus dem Chat",
};

export default function FileEditPanel({
  file,
  projects = [],
  allowScopeChange = false,
  onCancel,
  onSaved,
}: FileEditPanelProps) {
  const [name, setName] = useState(file.file_name);
  const [category, setCategory] = useState<FileCategory>(file.category);
  const [scope, setScope] = useState<FileScope>(file.scope);
  const [projectId, setProjectId] = useState<string>(
    file.project_id ?? projects[0]?.id ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    nameRef.current?.select();
  }, []);

  // Ein Anhang, der an einer Nachricht hängt, bleibt im Verlauf stehen —
  // beim Verschieben entsteht am Ziel eine Kopie.
  const isSentAttachment = file.scope === "chat" && !!file.message_id;
  const leavesChat = isSentAttachment && scope !== "chat";

  async function save() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Der Name darf nicht leer sein.");
      return;
    }
    if (scope === "project" && !projectId) {
      setError("Bitte ein Projekt auswählen.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/files/${file.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_name: trimmed,
          category,
          ...(allowScopeChange
            ? { scope, project_id: scope === "project" ? projectId : null }
            : {}),
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error ?? "Speichern fehlgeschlagen.");
      onSaved({ file: payload.file, copied: Boolean(payload.copied), previous: file });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
      setSaving(false);
    }
  }

  return (
    <div
      className="mx-3 mb-1 rounded-lg border border-primary/25 bg-bg px-3 py-3 space-y-3"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onCancel();
        }
      }}
    >
      <div>
        <label
          htmlFor={`file-name-${file.id}`}
          className="block font-mono text-[11px] text-text-muted mb-1"
        >
          Name
        </label>
        <input
          id={`file-name-${file.id}`}
          ref={nameRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void save();
            }
          }}
          maxLength={200}
          className="w-full bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary/60 transition-colors"
        />
      </div>

      <div>
        <span className="block font-mono text-[11px] text-text-muted mb-1">Kategorie</span>
        <div className="flex flex-wrap gap-1.5">
          {FILE_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              aria-pressed={category === c.value}
              className={`font-mono text-[11px] px-2 py-1 rounded-md border transition-colors ${
                category === c.value
                  ? "bg-primary/15 text-primary border-primary/25"
                  : "border-border text-text-muted hover:text-text-dim hover:border-border/80"
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      {allowScopeChange && (
        <div>
          <span className="block font-mono text-[11px] text-text-muted mb-1">Zuordnung</span>
          <div className="flex flex-wrap gap-1.5">
            {(["client", "project", "chat"] as FileScope[]).map((value) => {
              // In den Chat verschieben gibt es nicht: dort hängt eine Datei
              // immer an einer Nachricht. Nur wer schon dort liegt, bleibt dort.
              // In den Chat kommt nichts von außen; wer schon dort liegt,
              // kann aber dort bleiben.
              const disabled =
                (value === "chat" && file.scope !== "chat") ||
                (value === "project" && projects.length === 0);
              return (
                <button
                  key={value}
                  type="button"
                  disabled={disabled}
                  onClick={() => setScope(value)}
                  aria-pressed={scope === value}
                  title={
                    disabled && value === "chat"
                      ? "Im Chat hängen Dateien an einer Nachricht"
                      : disabled
                      ? "Dieser Kunde hat noch kein Projekt"
                      : undefined
                  }
                  className={`font-mono text-[11px] px-2 py-1 rounded-md border transition-colors disabled:opacity-35 disabled:cursor-not-allowed ${
                    scope === value
                      ? "bg-primary/15 text-primary border-primary/25"
                      : "border-border text-text-muted hover:text-text-dim hover:border-border/80"
                  }`}
                >
                  {SCOPE_LABELS[value]}
                </button>
              );
            })}
          </div>

          {scope === "project" && projects.length > 0 && (
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              aria-label="Projekt"
              className="mt-2 w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-primary/60 transition-colors"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          )}

          {leavesChat && (
            <p className="text-text-muted text-[11px] mt-2 leading-relaxed">
              Die Nachricht behält ihren Anhang. Unter „{SCOPE_LABELS[scope]}“ entsteht eine Kopie,
              damit der Chatverlauf vollständig bleibt.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-accent text-[11px] bg-accent/10 border border-accent/20 rounded-lg px-2.5 py-1.5">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="font-mono text-[11px] px-3 py-1.5 rounded-md bg-primary-dark text-white hover:bg-primary-dark/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Speichert…" : "Speichern"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="font-mono text-[11px] px-3 py-1.5 rounded-md border border-border text-text-muted hover:text-text-dim transition-colors disabled:opacity-50"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}
