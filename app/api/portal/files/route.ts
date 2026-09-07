import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  FILES_BUCKET,
  FILE_COLUMNS,
  MAX_FILE_SIZE,
  buildStoragePath,
  hasValidOrigin,
  resolveActor,
  toFileCategory,
  withSignedUrls,
  type Actor,
  type FileScope,
} from "@/lib/portal/files";

export const dynamic = "force-dynamic";

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function parseScope(value: unknown, projectId: string | null, messageId: string | null): FileScope {
  if (value === "client" || value === "project" || value === "chat") return value;
  if (messageId) return "chat";
  return projectId ? "project" : "client";
}

/** Prüft, dass das Ziel (Projekt/Nachricht) wirklich zu diesem Kunden gehört. */
async function resolveTarget(
  actor: Actor,
  input: { clientId: string | null; projectId: string | null; messageId: string | null; scope: FileScope }
): Promise<{ clientId: string; projectId: string | null; messageId: string | null } | { error: string; status: number }> {
  const admin = createAdminClient();
  let clientId = actor.kind === "client" ? actor.clientId : input.clientId;

  if (input.projectId) {
    const { data: project } = await admin
      .from("projects")
      .select("id, client_id")
      .eq("id", input.projectId)
      .single();
    if (!project) return { error: "Projekt nicht gefunden.", status: 404 };
    if (clientId && project.client_id !== clientId) {
      return { error: "Projekt gehört nicht zu diesem Kunden.", status: 403 };
    }
    clientId = project.client_id;
  }

  if (input.messageId) {
    const { data: message } = await admin
      .from("messages")
      .select("id, client_id")
      .eq("id", input.messageId)
      .single();
    if (!message) return { error: "Nachricht nicht gefunden.", status: 404 };
    if (clientId && message.client_id !== clientId) {
      return { error: "Nachricht gehört nicht zu diesem Kunden.", status: 403 };
    }
    clientId = message.client_id;
  }

  if (!clientId) return { error: "client_id oder project_id ist erforderlich.", status: 422 };
  if (input.scope === "project" && !input.projectId) {
    return { error: "scope=project braucht eine project_id.", status: 422 };
  }
  if (actor.kind === "client" && input.scope === "client") {
    return { error: "Dateien im Kundenprofil legt nur HM Labs an.", status: 403 };
  }

  return { clientId, projectId: input.projectId, messageId: input.messageId };
}

/**
 * Upload. Multipart mit `file` plus optional `category`, `scope`,
 * `project_id`, `client_id` (nur Admin), `message_id`.
 * Der Bucket bleibt privat; zurück kommt eine signierte URL (1 h).
 */
export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return bad("Ungültige Herkunft.", 403);

  const actor = await resolveActor(request);
  if (!actor) return bad("Unauthorized", 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad("Multipart-Body erwartet.", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return bad("Keine Datei übergeben.", 422);
  if (file.size > MAX_FILE_SIZE) return bad("Datei zu groß (max. 50 MB).", 413);

  const projectId = (form.get("project_id") as string) || null;
  const messageId = (form.get("message_id") as string) || null;
  const scope = parseScope(form.get("scope"), projectId, messageId);
  const category = toFileCategory(form.get("category"));

  const target = await resolveTarget(actor, {
    clientId: (form.get("client_id") as string) || null,
    projectId,
    messageId,
    scope,
  });
  if ("error" in target) return bad(target.error, target.status);

  const admin = createAdminClient();
  const storagePath = buildStoragePath({
    clientId: target.clientId,
    scope,
    projectId: target.projectId,
    category,
    fileName: file.name,
  });

  const { error: uploadError } = await admin.storage
    .from(FILES_BUCKET)
    .upload(storagePath, await file.arrayBuffer(), {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (uploadError) return bad(`Upload fehlgeschlagen: ${uploadError.message}`, 500);

  const { data: row, error: dbError } = await admin
    .from("client_files")
    .insert({
      client_id: target.clientId,
      project_id: target.projectId,
      message_id: target.messageId,
      scope,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type || null,
      category,
      size_bytes: file.size,
      uploaded_by: actor.userId,
      uploaded_by_role: actor.kind,
    })
    .select(FILE_COLUMNS)
    .single();

  if (dbError || !row) {
    // Storage nicht mit einer Waise zurücklassen, wenn die Zeile nicht kam
    await admin.storage.from(FILES_BUCKET).remove([storagePath]);
    return bad(`Speichern fehlgeschlagen: ${dbError?.message ?? "unbekannt"}`, 500);
  }

  const [withUrl] = await withSignedUrls([row]);
  return NextResponse.json({ file: withUrl }, { status: 201 });
}

/**
 * Liste. Genau einer von `project_id`, `client_id`, `message_ids` (kommagetrennt).
 * Kunden sehen ausschließlich Dateien ihres eigenen Kundendatensatzes.
 */
export async function GET(request: NextRequest) {
  const actor = await resolveActor(request);
  if (!actor) return bad("Unauthorized", 401);

  const params = request.nextUrl.searchParams;
  const projectId = params.get("project_id");
  const messageIds = params.get("message_ids");
  const clientId = actor.kind === "client" ? actor.clientId : params.get("client_id");
  const scope = params.get("scope");

  const admin = createAdminClient();
  let query = admin.from("client_files").select(FILE_COLUMNS).order("created_at", { ascending: false });

  if (projectId) query = query.eq("project_id", projectId);
  if (messageIds) query = query.in("message_id", messageIds.split(",").filter(Boolean));
  if (clientId) query = query.eq("client_id", clientId);
  if (scope) query = query.eq("scope", scope);
  if (!projectId && !messageIds && !clientId) {
    return bad("project_id, client_id oder message_ids erforderlich.", 422);
  }

  const { data, error } = await query;
  if (error) return bad(error.message, 500);

  const rows = (data ?? []).filter((f) => actor.kind === "admin" || f.client_id === actor.clientId);
  return NextResponse.json({ files: await withSignedUrls(rows) });
}
