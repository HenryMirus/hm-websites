"use client";

import { useCallback, useId, useRef, useState } from "react";
import {
  FILE_CATEGORIES,
  MAX_FILE_SIZE,
  formatBytes,
  type FileCategory,
  type PortalFileWithUrl,
} from "@/lib/portal/fileTypes";

interface Upload {
  key: string;
  name: string;
  size: number;
  progress: number;
  error?: string;
}

interface FileDropzoneProps {
  /** Felder, die jeder Upload mitschickt: project_id, client_id, message_id, scope */
  fields: Record<string, string>;
  onUploaded: (file: PortalFileWithUrl) => void;
  /** Kategorie-Auswahl anzeigen (im Chat unnötig) */
  withCategory?: boolean;
  defaultCategory?: FileCategory;
  hint?: string;
  compact?: boolean;
}

/** Ein Upload, mit Fortschritt — fetch kennt keinen Upload-Progress, XHR schon. */
function uploadFile(
  file: File,
  fields: Record<string, string>,
  onProgress: (percent: number) => void
): Promise<PortalFileWithUrl> {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append("file", file);
    Object.entries(fields).forEach(([k, v]) => v && body.append(k, v));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/portal/files");
    xhr.withCredentials = true;
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      try {
        const payload = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(payload.file);
        else reject(new Error(payload.error ?? `Fehler ${xhr.status}`));
      } catch {
        reject(new Error(`Upload fehlgeschlagen (${xhr.status})`));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Netzwerkfehler beim Upload.")));
    xhr.send(body);
  });
}

export default function FileDropzone({
  fields,
  onUploaded,
  withCategory = true,
  defaultCategory = "other",
  hint,
  compact = false,
}: FileDropzoneProps) {
  const [category, setCategory] = useState<FileCategory>(defaultCategory);
  const [dragging, setDragging] = useState(false);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      const files = Array.from(fileList ?? []);
      if (files.length === 0) return;

      await Promise.all(
        files.map(async (file) => {
          const key = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
          setUploads((prev) => [...prev, { key, name: file.name, size: file.size, progress: 0 }]);

          if (file.size > MAX_FILE_SIZE) {
            setUploads((prev) =>
              prev.map((u) => (u.key === key ? { ...u, error: "Datei zu groß (max. 50 MB)." } : u))
            );
            return;
          }

          try {
            const uploaded = await uploadFile(file, { ...fields, category }, (progress) =>
              setUploads((prev) => prev.map((u) => (u.key === key ? { ...u, progress } : u)))
            );
            setUploads((prev) => prev.filter((u) => u.key !== key));
            onUploaded(uploaded);
          } catch (e) {
            setUploads((prev) =>
              prev.map((u) =>
                u.key === key ? { ...u, error: e instanceof Error ? e.message : "Upload fehlgeschlagen." } : u
              )
            );
          }
        })
      );
    },
    [category, fields, onUploaded]
  );

  return (
    <div className="space-y-2">
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Dateien hierher ziehen oder auswählen"
        className={`w-full cursor-pointer rounded-xl border border-dashed transition-colors outline-none focus-visible:border-primary ${
          compact ? "px-3 py-3" : "px-4 py-6"
        } ${
          dragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 bg-bg"
        }`}
      >
        <div className="flex items-center justify-center gap-2.5 text-center pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className={dragging ? "text-primary" : "text-text-muted"}>
            <path d="M7 1v8M3 5l4-4 4 4M1 11h12v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-left">
            <p className={`text-xs ${dragging ? "text-primary" : "text-text-dim"}`}>
              {dragging ? "Loslassen zum Hochladen" : "Dateien hierher ziehen oder klicken"}
            </p>
            <p className="font-mono text-[11px] text-text-muted">{hint ?? "max. 50 MB pro Datei"}</p>
          </div>
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          className="sr-only"
          onChange={(e) => {
            void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {withCategory && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[11px] text-text-muted mr-1">Kategorie</span>
          {FILE_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
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
      )}

      {uploads.length > 0 && (
        <div className="space-y-1">
          {uploads.map((u) => (
            <div key={u.key} className="bg-bg border border-border/60 rounded-lg px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-text-dim truncate">{u.name}</p>
                <span className="font-mono text-[11px] text-text-muted shrink-0">
                  {u.error ? "Fehler" : `${u.progress}% · ${formatBytes(u.size)}`}
                </span>
              </div>
              {u.error ? (
                <p className="text-accent text-[11px] mt-1">{u.error}</p>
              ) : (
                <div className="h-1 bg-border/60 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${u.progress}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
