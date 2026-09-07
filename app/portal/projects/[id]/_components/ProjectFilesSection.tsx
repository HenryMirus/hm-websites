"use client";

import { useMemo, useState } from "react";
import FileDropzone from "../../../_components/FileDropzone";
import FileList from "../../../_components/FileList";
import type { FileUpdateResult } from "../../../_components/FileEditPanel";
import { FILE_CATEGORIES, type FileCategory, type PortalFileWithUrl } from "@/lib/portal/fileTypes";

interface ProjectFilesSectionProps {
  projectId: string;
  initialFiles: PortalFileWithUrl[];
  isAdmin: boolean;
  /** auth.uid() — Kunden dürfen genau ihre eigenen Uploads wieder entfernen. */
  currentUserId: string | null;
  /** Nur Admin: Datei zusätzlich dauerhaft im Kundenprofil ablegen. */
  promoteAction?: (fileId: string) => Promise<{ error?: string } | void>;
  /** Nur Admin: übrige Projekte des Kunden, damit eine Datei umziehen kann. */
  projects?: { id: string; title: string }[];
}

export default function ProjectFilesSection({
  projectId,
  initialFiles,
  isAdmin,
  currentUserId,
  promoteAction,
  projects,
}: ProjectFilesSectionProps) {
  const [files, setFiles] = useState<PortalFileWithUrl[]>(initialFiles);
  const [filter, setFilter] = useState<FileCategory | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? files : files.filter((f) => f.category === filter)),
    [files, filter]
  );

  const countByCategory = (cat: string) => files.filter((f) => f.category === cat).length;

  /**
   * Umbenennen und Kategoriewechsel ersetzen die Datei an Ort und Stelle. Zieht
   * der Admin sie ins Kundenprofil oder in ein anderes Projekt, verschwindet sie
   * aus dieser Liste.
   */
  function handleUpdated({ file, copied, previous }: FileUpdateResult) {
    if (copied) return;
    const staysHere = file.scope === "project" && file.project_id === projectId;
    setFiles((prev) =>
      staysHere
        ? prev.map((f) => (f.id === previous.id ? file : f))
        : prev.filter((f) => f.id !== previous.id)
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display font-semibold text-text-primary">Dateien</h2>
        <span className="font-mono text-[11px] text-text-muted">
          {files.length} {files.length === 1 ? "Datei" : "Dateien"}
        </span>
      </div>
      <p className="text-text-muted text-xs mb-4">
        {isAdmin
          ? "Alles, was zu diesem Projekt gehört. Uploads des Kunden landen hier ebenfalls."
          : "Logo, Bilder, Texte, Briefings: alles, was ich für dieses Projekt brauche."}
      </p>

      <FileDropzone
        fields={{ project_id: projectId, scope: "project" }}
        defaultCategory="brand"
        onUploaded={(file) => setFiles((prev) => [file, ...prev])}
      />

      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`font-mono text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
              filter === "all"
                ? "bg-primary/15 text-primary border-primary/25"
                : "border-border text-text-muted hover:text-text-dim hover:border-border/80"
            }`}
          >
            Alle ({files.length})
          </button>
          {FILE_CATEGORIES.filter((c) => countByCategory(c.value) > 0).map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilter(c.value)}
              className={`font-mono text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                filter === c.value
                  ? "bg-primary/15 text-primary border-primary/25"
                  : "border-border text-text-muted hover:text-text-dim hover:border-border/80"
              }`}
            >
              {c.icon} {c.label} ({countByCategory(c.value)})
            </button>
          ))}
        </div>
      )}

      <div className="mt-3">
        <FileList
          files={filtered}
          canDelete={(f) => isAdmin || (!!currentUserId && f.uploaded_by === currentUserId)}
          onDeleted={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
          canEdit={(f) => isAdmin || (!!currentUserId && f.uploaded_by === currentUserId)}
          onUpdated={handleUpdated}
          allowScopeChange={isAdmin}
          projects={projects}
          onPromote={isAdmin ? promoteAction : undefined}
          emptyText={
            files.length === 0 ? "Noch keine Dateien in diesem Projekt" : "Keine Dateien in dieser Kategorie"
          }
        />
      </div>
    </div>
  );
}
