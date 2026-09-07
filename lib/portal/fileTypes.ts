/**
 * Reine Typen und Konstanten rund um Portal-Dateien — bewusst ohne
 * Server-Imports, damit Client-Komponenten sie mitbenutzen können.
 * Die serverseitigen Helfer liegen in `lib/portal/files.ts`.
 */

export const MAX_FILE_SIZE = 52_428_800; // 50 MB — deckt sich mit dem Bucket-Limit

export type FileCategory = "brand" | "images" | "videos" | "content" | "other";

/**
 * Wo eine Datei hängt:
 *  client  — Kundenprofil, projektübergreifend wiederverwendbar (nur Admin legt an)
 *  project — an genau einem Projekt, von Kunde oder Admin hochgeladen
 *  chat    — Anhang einer Nachricht (message_id gesetzt, sobald abgeschickt)
 */
export type FileScope = "client" | "project" | "chat";

export const FILE_CATEGORIES: { value: FileCategory; label: string; icon: string }[] = [
  { value: "brand", label: "Branding", icon: "◈" },
  { value: "images", label: "Bilder", icon: "▣" },
  { value: "videos", label: "Videos", icon: "▶" },
  { value: "content", label: "Content", icon: "≡" },
  { value: "other", label: "Sonstiges", icon: "◦" },
];

const CATEGORY_VALUES = FILE_CATEGORIES.map((c) => c.value);

export function toFileCategory(value: unknown): FileCategory {
  return CATEGORY_VALUES.includes(value as FileCategory) ? (value as FileCategory) : "other";
}

export function categoryLabel(value: string): string {
  return FILE_CATEGORIES.find((c) => c.value === value)?.label ?? "Sonstiges";
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

export interface PortalFile {
  id: string;
  client_id: string;
  project_id: string | null;
  message_id: string | null;
  scope: FileScope;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  category: FileCategory;
  size_bytes: number | null;
  uploaded_by: string | null;
  uploaded_by_role: "admin" | "client" | null;
  created_at: string;
}

export type PortalFileWithUrl = PortalFile & { signedUrl?: string };
