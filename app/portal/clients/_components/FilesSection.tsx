"use client";

import { useFormState, useFormStatus } from "react-dom";
import { uploadFileAction, deleteFileAction, type FileCategory } from "../_files_actions";
import { useState } from "react";

interface ClientFile {
  id: string;
  file_name: string;
  mime_type: string | null;
  category: string;
  size_bytes: number | null;
  storage_path: string;
  created_at: string;
  signedUrl?: string;
}

interface FilesSectionProps {
  clientId: string;
  files: ClientFile[];
}

const CATEGORIES: { value: FileCategory; label: string; icon: string }[] = [
  { value: "brand",   label: "Branding",  icon: "◈" },
  { value: "images",  label: "Bilder",    icon: "▣" },
  { value: "videos",  label: "Videos",    icon: "▶" },
  { value: "content", label: "Content",   icon: "≡" },
  { value: "other",   label: "Sonstiges", icon: "◦" },
];

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function FileIcon({ mime }: { mime: string | null }) {
  if (!mime) return <span className="text-text-muted text-xs">📄</span>;
  if (mime.startsWith("image/")) return <span className="text-sm">🖼</span>;
  if (mime.startsWith("video/")) return <span className="text-sm">🎬</span>;
  if (mime === "application/pdf") return <span className="text-sm">📕</span>;
  if (mime.includes("word") || mime.includes("document")) return <span className="text-sm">📝</span>;
  return <span className="text-sm">📄</span>;
}

function UploadForm({ clientId }: { clientId: string }) {
  const action = uploadFileAction.bind(null, clientId);
  const [state, formAction] = useFormState(action, {});
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <form action={formAction} className="bg-bg border border-border/60 rounded-xl p-4 space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-text-muted mb-1">Datei</label>
          <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border hover:border-primary/50 rounded-lg px-3 py-2 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-muted shrink-0">
              <path d="M7 1v8M3 5l4-4 4 4M1 11h12v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs text-text-muted truncate max-w-[140px]">
              {fileName ?? "Datei auswählen…"}
            </span>
            <input
              type="file"
              name="file"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        </div>

        <div className="w-32">
          <label className="block text-xs text-text-muted mb-1">Kategorie</label>
          <select
            name="category"
            className="w-full bg-surface border border-border rounded-lg px-2 py-2 text-xs text-text-primary outline-none focus:border-primary transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <UploadButton />
        </div>
      </div>

      {state?.error && (
        <p className="text-accent text-xs bg-accent/10 border border-accent/20 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
          Hochgeladen ✓
        </p>
      )}
    </form>
  );
}

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
    >
      {pending ? (
        <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )}
      Upload
    </button>
  );
}

function DeleteButton({ fileId, clientId }: { fileId: string; clientId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Datei löschen?")) return;
    setLoading(true);
    await deleteFileAction(fileId, clientId);
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1 rounded text-text-muted hover:text-accent hover:bg-accent/10 transition-colors disabled:opacity-40"
      title="Löschen"
    >
      {loading ? (
        <span className="w-3 h-3 border border-current/40 border-t-current rounded-full animate-spin inline-block" />
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 3h10M4 3V2h4v1M5 5.5v3M7 5.5v3M2 3l.7 7.3A.67.67 0 0 0 3.37 11h5.27a.67.67 0 0 0 .66-.7L10 3H2z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

export default function FilesSection({ clientId, files }: FilesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<FileCategory | "all">("all");

  const filtered = activeCategory === "all"
    ? files
    : files.filter((f) => f.category === activeCategory);

  const countByCategory = (cat: string) => files.filter((f) => f.category === cat).length;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-text-primary">Dateien</h2>
        <span className="font-mono text-[10px] text-text-muted">{files.length} Dateien</span>
      </div>

      {/* Upload Form */}
      <UploadForm clientId={clientId} />

      {/* Category Filter */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          <button
            onClick={() => setActiveCategory("all")}
            className={`font-mono text-[10px] px-2.5 py-1 rounded-md border transition-colors ${
              activeCategory === "all"
                ? "bg-primary/15 text-primary border-primary/25"
                : "border-border text-text-muted hover:text-text-dim hover:border-border/80"
            }`}
          >
            Alle ({files.length})
          </button>
          {CATEGORIES.filter((c) => countByCategory(c.value) > 0).map((c) => (
            <button
              key={c.value}
              onClick={() => setActiveCategory(c.value)}
              className={`font-mono text-[10px] px-2.5 py-1 rounded-md border transition-colors ${
                activeCategory === c.value
                  ? "bg-primary/15 text-primary border-primary/25"
                  : "border-border text-text-muted hover:text-text-dim hover:border-border/80"
              }`}
            >
              {c.icon} {c.label} ({countByCategory(c.value)})
            </button>
          ))}
        </div>
      )}

      {/* File List */}
      {filtered.length > 0 ? (
        <div className="mt-3 space-y-1">
          {filtered.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-bg transition-colors group"
            >
              <FileIcon mime={file.mime_type} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">{file.file_name}</p>
                <p className="font-mono text-[10px] text-text-muted">
                  {CATEGORIES.find((c) => c.value === file.category)?.label}
                  {file.size_bytes ? ` · ${formatBytes(file.size_bytes)}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                <DeleteButton fileId={file.id} clientId={clientId} />
              </div>
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        <p className="text-center text-text-muted text-xs mt-6 py-4">Noch keine Dateien hochgeladen</p>
      ) : (
        <p className="text-center text-text-muted text-xs mt-4 py-3">Keine Dateien in dieser Kategorie</p>
      )}
    </div>
  );
}
