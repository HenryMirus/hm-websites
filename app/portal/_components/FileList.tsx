"use client";

import { useState, useTransition } from "react";
import { categoryLabel, formatBytes, type PortalFileWithUrl } from "@/lib/portal/fileTypes";
import FileEditPanel, { type FileUpdateResult } from "./FileEditPanel";

export function FileIcon({ mime }: { mime: string | null }) {
  if (!mime) return <span className="text-sm">📄</span>;
  if (mime.startsWith("image/")) return <span className="text-sm">🖼</span>;
  if (mime.startsWith("video/")) return <span className="text-sm">🎬</span>;
  if (mime.startsWith("audio/")) return <span className="text-sm">🎵</span>;
  if (mime === "application/pdf") return <span className="text-sm">📕</span>;
  if (mime.includes("word") || mime.includes("document")) return <span className="text-sm">📝</span>;
  if (mime.includes("sheet") || mime.includes("excel")) return <span className="text-sm">📊</span>;
  if (mime.includes("zip") || mime.includes("compressed")) return <span className="text-sm">🗜</span>;
  return <span className="text-sm">📄</span>;
}

const SCOPE_LABELS: Record<string, string> = {
  client: "Kundenprofil",
  project: "Projekt",
  chat: "Chat",
};

interface FileListProps {
  files: PortalFileWithUrl[];
  /** Wer diese Datei löschen darf — der Server prüft es noch einmal. */
  canDelete?: (file: PortalFileWithUrl) => boolean;
  onDeleted?: (id: string) => void;
  /** Wer umbenennen und die Kategorie ändern darf — der Server prüft es noch einmal. */
  canEdit?: (file: PortalFileWithUrl) => boolean;
  onUpdated?: (result: FileUpdateResult) => void;
  /** Nur Admin: im Bearbeiten-Panel auch die Zuordnung verschieben. */
  allowScopeChange?: boolean;
  /** Projekte des Kunden, Ziel für „Aus Projekten“. */
  projects?: { id: string; title: string }[];
  /** Nur Admin: Datei dauerhaft ins Kundenprofil übernehmen. */
  onPromote?: (fileId: string) => Promise<{ error?: string } | void>;
  emptyText?: string;
  /** Zusatzzeile pro Datei, z. B. der Projektname. */
  meta?: (file: PortalFileWithUrl) => string | null;
}

export default function FileList({
  files,
  canDelete,
  onDeleted,
  canEdit,
  onUpdated,
  allowScopeChange = false,
  projects,
  onPromote,
  emptyText = "Noch keine Dateien",
  meta,
}: FileListProps) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  /** Kurzer Hinweis pro Datei, wenn eine Kopie an anderer Stelle entstanden ist. */
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  async function handleDelete(file: PortalFileWithUrl) {
    if (!confirm(`„${file.file_name}" löschen?`)) return;
    setBusy(file.id);
    setError(null);
    try {
      const res = await fetch(`/api/portal/files/${file.id}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error ?? "Löschen fehlgeschlagen.");
      }
      onDeleted?.(file.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Löschen fehlgeschlagen.");
    } finally {
      setBusy(null);
    }
  }

  async function handlePromote(file: PortalFileWithUrl) {
    if (!onPromote) return;
    setBusy(file.id);
    setError(null);
    const result = await onPromote(file.id);
    setBusy(null);
    if (result && "error" in result && result.error) setError(result.error);
    else {
      setNotes((prev) => ({ ...prev, [file.id]: "ins Profil übernommen" }));
      startTransition(() => {});
    }
  }

  function handleSaved(result: FileUpdateResult) {
    setEditing(null);
    setError(null);
    if (result.copied) {
      setNotes((prev) => ({
        ...prev,
        [result.previous.id]: `kopiert: ${SCOPE_LABELS[result.file.scope] ?? result.file.scope}`,
      }));
    }
    onUpdated?.(result);
  }

  if (files.length === 0) {
    return <p className="text-text-muted text-xs py-4 text-center">{emptyText}</p>;
  }

  return (
    <div className="space-y-1">
      {error && (
        <p className="text-accent text-xs bg-accent/10 border border-accent/20 rounded-lg px-3 py-2">{error}</p>
      )}
      {files.map((file) => {
        const isBusy = busy === file.id;
        const extra = meta?.(file);
        const note = notes[file.id];
        return (
          <div key={file.id}>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-bg transition-colors group">
              <FileIcon mime={file.mime_type} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium text-text-primary truncate">{file.file_name}</p>
                  {file.uploaded_by_role === "client" && (
                    <span className="shrink-0 font-mono text-[11px] px-1.5 py-0.5 rounded border border-primary/25 bg-primary/10 text-primary">
                      vom Kunden
                    </span>
                  )}
                  {note && (
                    <span className="shrink-0 font-mono text-[11px] px-1.5 py-0.5 rounded border border-green-500/20 bg-green-500/10 text-green-400">
                      {note}
                    </span>
                  )}
                </div>
                <p className="font-mono text-[11px] text-text-muted truncate">
                  {categoryLabel(file.category)}
                  {file.size_bytes ? ` · ${formatBytes(file.size_bytes)}` : ""}
                  {` · ${new Date(file.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}`}
                  {extra ? ` · ${extra}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                {canEdit?.(file) && (
                  <button
                    type="button"
                    onClick={() => setEditing(editing === file.id ? null : file.id)}
                    disabled={isBusy}
                    aria-expanded={editing === file.id}
                    className="p-1 rounded text-text-muted hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-40"
                    title="Bearbeiten"
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M9.5 1.9a1.27 1.27 0 0 1 1.8 1.8L4.6 10.4l-2.4.6.6-2.4 6.7-6.7zM2 12.5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
                {onPromote && (
                  <button
                    type="button"
                    onClick={() => handlePromote(file)}
                    disabled={isBusy || Boolean(note)}
                    className="p-1 rounded text-text-muted hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-40"
                    title="Ins Kundenprofil übernehmen"
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M7 9V1M4 4l3-3 3 3M2 9v3.5h10V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
                {file.signedUrl && (
                  <a
                    href={file.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Öffnen"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v6A1.5 1.5 0 0 0 2.5 11h6A1.5 1.5 0 0 0 10 9.5V7M7 1h4v4M11 1 5.5 6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
                {canDelete?.(file) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(file)}
                    disabled={isBusy}
                    className="p-1 rounded text-text-muted hover:text-accent hover:bg-accent/10 transition-colors disabled:opacity-40"
                    title="Löschen"
                  >
                    {isBusy ? (
                      <span className="w-3 h-3 border border-current/40 border-t-current rounded-full animate-spin inline-block" />
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 3h10M4 3V2h4v1M5 5.5v3M7 5.5v3M2 3l.7 7.3A.67.67 0 0 0 3.37 11h5.27a.67.67 0 0 0 .66-.7L10 3H2z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>

            {editing === file.id && (
              <FileEditPanel
                file={file}
                projects={projects}
                allowScopeChange={allowScopeChange}
                onCancel={() => setEditing(null)}
                onSaved={handleSaved}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
