import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { verifyApiKey } from "@/lib/api/verifyApiKey";
import type {
  FileCategory,
  FileScope,
  PortalFile as PortalFileType,
  PortalFileWithUrl as PortalFileWithUrlType,
} from "@/lib/portal/fileTypes";

export const FILES_BUCKET = "client-files";
export const SIGNED_URL_TTL = 3600;

export {
  MAX_FILE_SIZE,
  FILE_CATEGORIES,
  toFileCategory,
  categoryLabel,
  formatBytes,
} from "@/lib/portal/fileTypes";
export type { FileCategory, FileScope, PortalFile, PortalFileWithUrl } from "@/lib/portal/fileTypes";

export const FILE_COLUMNS =
  "id, client_id, project_id, message_id, scope, storage_path, file_name, mime_type, category, size_bytes, uploaded_by, uploaded_by_role, created_at";

/** Storage-Pfad: nie den Originalnamen direkt übernehmen (Slashes, Umlaute, Kollisionen). */
export function buildStoragePath(opts: {
  clientId: string;
  scope: FileScope;
  projectId?: string | null;
  category: FileCategory;
  fileName: string;
}): string {
  const safeName = opts.fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "datei";
  const folder =
    opts.scope === "project" && opts.projectId
      ? `${opts.clientId}/projects/${opts.projectId}/${opts.category}`
      : opts.scope === "chat"
      ? `${opts.clientId}/chat/${opts.category}`
      : `${opts.clientId}/${opts.category}`;
  return `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName}`;
}

/** Signierte URLs (1 h) für eine Liste von Dateien — immer serverseitig, der Bucket bleibt privat. */
export async function withSignedUrls<T extends { storage_path: string }>(
  files: T[]
): Promise<(T & { signedUrl?: string })[]> {
  if (files.length === 0) return [];
  const admin = createAdminClient();
  const { data } = await admin.storage
    .from(FILES_BUCKET)
    .createSignedUrls(
      files.map((f) => f.storage_path),
      SIGNED_URL_TTL
    );

  const byPath = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return files.map((f) => ({ ...f, signedUrl: byPath.get(f.storage_path) ?? undefined }));
}

// ── Wer darf was ────────────────────────────────────────────────────────────

export type Actor =
  | { kind: "admin"; userId: string | null }
  | { kind: "client"; userId: string; clientId: string };

/**
 * Auth für die Datei-Routen. Drei Wege, in dieser Reihenfolge:
 *   1. API-Key (`Bearer hm_live_…`) — gilt als Admin, wie in /api/v1
 *   2. Supabase-Access-Token (`Bearer ey…`) — für Aufrufe ohne Browser-Session
 *   3. Portal-Session aus dem Cookie — der Normalfall aus der UI
 * Kunden bekommen ihre client_id serverseitig zugeordnet, sie wird nie aus
 * dem Request übernommen.
 */
export async function resolveActor(request: Request): Promise<Actor | null> {
  const authHeader = request.headers.get("authorization") ?? "";

  if (authHeader.startsWith("Bearer hm_live_")) {
    return (await verifyApiKey(request)) ? { kind: "admin", userId: null } : null;
  }

  if (authHeader.startsWith("Bearer ")) {
    const {
      data: { user },
    } = await createAdminClient().auth.getUser(authHeader.slice(7));
    return user ? actorForUser(user.id) : null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? actorForUser(user.id) : null;
}

/** Rolle und ggf. Kundendatensatz zu einer User-ID auflösen. */
async function actorForUser(userId: string): Promise<Actor | null> {
  const admin = createAdminClient();

  const { data: profile } = await admin.from("profiles").select("role").eq("id", userId).single();
  if (profile?.role === "admin") return { kind: "admin", userId };

  const { data: client } = await admin
    .from("clients")
    .select("id")
    .eq("auth_user_id", userId)
    .single();
  if (!client) return null;

  return { kind: "client", userId, clientId: client.id };
}

/**
 * Nur relevant für Cookie-Auth: ein Cross-Site-POST soll keine Datei anlegen
 * können. Requests ohne Origin (curl, Server-zu-Server mit API-Key) passieren.
 */
export function hasValidOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Alle Chat-Anhänge eines Kunden, gruppiert nach Nachricht — serverseitig
 * signiert, damit der Chat sie direkt rendern kann.
 */
export async function getMessageAttachments(
  clientId: string
): Promise<Record<string, PortalFileWithUrlType[]>> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("client_files")
    .select(FILE_COLUMNS)
    .eq("client_id", clientId)
    .eq("scope", "chat")
    .not("message_id", "is", null)
    .order("created_at", { ascending: true });

  const files = await withSignedUrls((data ?? []) as unknown as PortalFileType[]);
  return files.reduce<Record<string, PortalFileWithUrlType[]>>((acc, file) => {
    if (!file.message_id) return acc;
    (acc[file.message_id] ??= []).push(file);
    return acc;
  }, {});
}
