"use client";

import { useMemo, useState } from "react";
import FileDropzone from "../../_components/FileDropzone";
import FileList from "../../_components/FileList";
import type { FileUpdateResult } from "../../_components/FileEditPanel";
import type { FileScope, PortalFileWithUrl } from "@/lib/portal/fileTypes";

type Tab = "client" | "project" | "chat";

interface FilesSectionProps {
  clientId: string;
  /** Dauerhaft im Kundenprofil — projektübergreifend wiederverwendbar. */
  profileFiles: PortalFileWithUrl[];
  /** Aus Projekten, inkl. Uploads des Kunden. */
  projectFiles: PortalFileWithUrl[];
  /** Anhänge aus dem Chat. */
  chatFiles: PortalFileWithUrl[];
  projectTitles: Record<string, string>;
  promoteAction: (fileId: string) => Promise<{ error?: string } | void>;
}

export default function FilesSection({
  clientId,
  profileFiles,
  projectFiles,
  chatFiles,
  projectTitles,
  promoteAction,
}: FilesSectionProps) {
  const [tab, setTab] = useState<Tab>("client");
  const [profile, setProfile] = useState(profileFiles);
  const [projects, setProjects] = useState(projectFiles);
  const [chat, setChat] = useState(chatFiles);

  const projectOptions = useMemo(
    () => Object.entries(projectTitles).map(([id, title]) => ({ id, title })),
    [projectTitles]
  );

  const TABS: { value: Tab; label: string; count: number }[] = [
    { value: "client", label: "Kundenprofil", count: profile.length },
    { value: "project", label: "Aus Projekten", count: projects.length },
    { value: "chat", label: "Aus dem Chat", count: chat.length },
  ];

  /**
   * Nach dem Bearbeiten kann eine Datei den Reiter wechseln. Beim Umzug
   * verschwindet sie aus dem alten, bei einer Kopie (Chat-Anhang) bleibt das
   * Original stehen. Innerhalb desselben Reiters wird an Ort und Stelle
   * ersetzt, damit ein reines Umbenennen die Liste nicht umsortiert.
   */
  function handleUpdated({ file, copied, previous }: FileUpdateResult) {
    const place = (list: PortalFileWithUrl[], scope: FileScope) => {
      const index = list.findIndex((f) => f.id === file.id);
      const without = list.filter((f) => f.id !== file.id && (copied || f.id !== previous.id));
      if (file.scope !== scope) return without;
      if (index === -1) return [file, ...without];
      const next = [...without];
      next.splice(Math.min(index, next.length), 0, file);
      return next;
    };

    setProfile((prev) => place(prev, "client"));
    setProjects((prev) => place(prev, "project"));
    setChat((prev) => place(prev, "chat"));
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display font-semibold text-text-primary">Dateien</h2>
        <span className="font-mono text-[11px] text-text-muted">
          {profile.length + projects.length + chat.length} gesamt
        </span>
      </div>
      <p className="text-text-muted text-xs mb-4">
        Was im Kundenprofil liegt, gilt projektübergreifend. Über das Stift-Symbol lassen sich Name,
        Kategorie und Zuordnung ändern, mit dem Pfeil-Symbol wandert eine Datei direkt ins
        Kundenprofil. Ein Anhang, der schon im Chat verschickt wurde, bleibt dort stehen; beim
        Verschieben entsteht am Ziel eine Kopie.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`font-mono text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
              tab === t.value
                ? "bg-primary/15 text-primary border-primary/25"
                : "border-border text-text-muted hover:text-text-dim hover:border-border/80"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {tab === "client" && (
        <>
          <FileDropzone
            fields={{ client_id: clientId, scope: "client" }}
            defaultCategory="brand"
            onUploaded={(file) => setProfile((prev) => [file, ...prev])}
          />
          <div className="mt-3">
            <FileList
              files={profile}
              canDelete={() => true}
              onDeleted={(id) => setProfile((prev) => prev.filter((f) => f.id !== id))}
              canEdit={() => true}
              onUpdated={handleUpdated}
              allowScopeChange
              projects={projectOptions}
              emptyText="Noch nichts im Kundenprofil"
            />
          </div>
        </>
      )}

      {tab === "project" && (
        <FileList
          files={projects}
          canDelete={() => true}
          onDeleted={(id) => setProjects((prev) => prev.filter((f) => f.id !== id))}
          canEdit={() => true}
          onUpdated={handleUpdated}
          allowScopeChange
          projects={projectOptions}
          onPromote={promoteAction}
          meta={(f) => (f.project_id ? projectTitles[f.project_id] ?? null : null)}
          emptyText="Noch keine Projekt-Dateien"
        />
      )}

      {tab === "chat" && (
        <FileList
          files={chat}
          canDelete={() => true}
          onDeleted={(id) => setChat((prev) => prev.filter((f) => f.id !== id))}
          canEdit={() => true}
          onUpdated={handleUpdated}
          allowScopeChange
          projects={projectOptions}
          onPromote={promoteAction}
          emptyText="Noch keine Anhänge aus dem Chat"
        />
      )}
    </div>
  );
}
