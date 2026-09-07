import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  FILES_BUCKET,
  FILE_COLUMNS,
  buildStoragePath,
  hasValidOrigin,
  resolveActor,
  toFileCategory,
  withSignedUrls,
  type Actor,
  type FileScope,
  type PortalFile,
} from "@/lib/portal/files";

export const dynamic = "force-dynamic";

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Wer eine Datei ändern oder löschen darf: der Admin alles, der Kunde genau
 * seine eigenen Uploads. Eine vom Admin bereitgestellte Datei fasst er nicht an.
 */
function mayModify(actor: Actor, file: Pick<PortalFile, "client_id" | "uploaded_by">): boolean {
  if (actor.kind === "admin") return true;
  return file.client_id === actor.clientId && file.uploaded_by === actor.userId;
}

/**
 * Anzeigename: eine Zeile, keine Pfadtrenner, nicht leer. Der Storage-Pfad
 * bleibt davon unberührt — er ist ein undurchsichtiger Schlüssel, kein Name.
 */
function cleanFileName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value
    .replace(/[\r\n\t]/g, " ")
    .replace(/[/\\]/g, "-")
    .trim()
    .slice(0, 200);
  return name.length > 0 ? name : null;
}

/**
 * Umbenennen, Kategorie ändern und — nur für den Admin — die Zuordnung
 * verschieben (Kundenprofil ↔ Projekt ↔ Chat).
 *
 * Body (JSON, alle Felder optional):
 *   file_name   neuer Anzeigename
 *   category    brand | images | videos | content | other
 *   scope       client | project | chat        (nur Admin)
 *   project_id  Pflicht bei scope=project      (nur Admin)
 *
 * Eine Datei, die an einer Nachricht hängt, wird nicht aus dem Chat
 * herausgezogen: der Verlauf soll vollständig bleiben. Stattdessen entsteht
 * am Ziel eine Kopie, die Antwort meldet das mit `copied: true`.
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasValidOrigin(request)) return bad("Ungültige Herkunft.", 403);

  const actor = await resolveActor(request);
  if (!actor) return bad("Unauthorized", 401);

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return bad("JSON-Body erwartet.", 400);
  }

  const admin = createAdminClient();
  const { data: fileRow } = await admin
    .from("client_files")
    .select(FILE_COLUMNS)
    .eq("id", id)
    .single();

  if (!fileRow) return bad("Datei nicht gefunden.", 404);
  const file = fileRow as unknown as PortalFile;
  if (!mayModify(actor, file)) return bad("Keine Berechtigung.", 403);

  const patch: Record<string, unknown> = {};

  if ("file_name" in body) {
    const name = cleanFileName(body.file_name);
    if (!name) return bad("Der Name darf nicht leer sein.", 422);
    if (name !== file.file_name) patch.file_name = name;
  }

  if ("category" in body) {
    const category = toFileCategory(body.category);
    if (category !== file.category) patch.category = category;
  }

  // ── Zuordnung ─────────────────────────────────────────────────────────────
  const requestedScope = typeof body.scope === "string" ? (body.scope as FileScope) : file.scope;
  const requestedProjectId =
    "project_id" in body ? ((body.project_id as string | null) || null) : file.project_id;

  const movesScope = requestedScope !== file.scope;
  const movesProject = requestedProjectId !== file.project_id;

  if ((movesScope || movesProject) && actor.kind !== "admin") {
    return bad("Die Zuordnung ändert nur HM Labs.", 403);
  }

  let targetScope = file.scope;
  let targetProjectId = file.project_id;

  if (movesScope || movesProject) {
    if (!["client", "project", "chat"].includes(requestedScope)) {
      return bad("Unbekannte Zuordnung.", 422);
    }
    // Der Block läuft nur bei einer echten Änderung, also ist ein Ziel „chat“
    // hier immer ein Hineinschieben von außen. Das gibt es nicht: im Chat hängt
    // eine Datei an einer Nachricht, und die wählt man nicht nachträglich aus.
    if (requestedScope === "chat") {
      return bad(
        "In den Chat verschieben geht nicht — dort hängt eine Datei immer an einer Nachricht.",
        422
      );
    }

    targetProjectId = requestedScope === "project" ? requestedProjectId : null;

    if (requestedScope === "project") {
      if (!targetProjectId) return bad("Für „Aus Projekten“ braucht es ein Projekt.", 422);
      const { data: project } = await admin
        .from("projects")
        .select("id, client_id")
        .eq("id", targetProjectId)
        .single();
      if (!project) return bad("Projekt nicht gefunden.", 404);
      if (project.client_id !== file.client_id) {
        return bad("Projekt gehört zu einem anderen Kunden.", 403);
      }
    }

    targetScope = requestedScope;
  }

  // Ein echter Chat-Anhang bleibt liegen, wo er ist — am Ziel entsteht eine Kopie.
  const leavesChat = file.scope === "chat" && targetScope !== "chat" && !!file.message_id;

  if (leavesChat) {
    const category = toFileCategory(patch.category ?? file.category);
    const fileName = (patch.file_name as string | undefined) ?? file.file_name;
    const targetPath = buildStoragePath({
      clientId: file.client_id,
      scope: targetScope,
      projectId: targetProjectId,
      category,
      fileName,
    });

    const { error: copyError } = await admin.storage
      .from(FILES_BUCKET)
      .copy(file.storage_path, targetPath);
    if (copyError) return bad(`Kopieren fehlgeschlagen: ${copyError.message}`, 500);

    const { data: inserted, error: insertError } = await admin
      .from("client_files")
      .insert({
        client_id: file.client_id,
        project_id: targetProjectId,
        message_id: null,
        scope: targetScope,
        storage_path: targetPath,
        file_name: fileName,
        mime_type: file.mime_type,
        category,
        size_bytes: file.size_bytes,
        uploaded_by: actor.userId,
        uploaded_by_role: "admin",
        source_file_id: file.id,
      })
      .select(FILE_COLUMNS)
      .single();

    if (insertError || !inserted) {
      await admin.storage.from(FILES_BUCKET).remove([targetPath]);
      return bad(`Speichern fehlgeschlagen: ${insertError?.message ?? "unbekannt"}`, 500);
    }

    const [copyWithUrl] = await withSignedUrls([inserted as unknown as PortalFile]);
    return NextResponse.json({ file: copyWithUrl, copied: true });
  }

  if (targetScope !== file.scope) patch.scope = targetScope;
  if (targetProjectId !== file.project_id) patch.project_id = targetProjectId;

  if (Object.keys(patch).length === 0) {
    const [unchanged] = await withSignedUrls([file]);
    return NextResponse.json({ file: unchanged, copied: false });
  }

  const { data: updated, error } = await admin
    .from("client_files")
    .update(patch)
    .eq("id", id)
    .select(FILE_COLUMNS)
    .single();

  if (error || !updated) return bad(error?.message ?? "Speichern fehlgeschlagen.", 500);

  const [withUrl] = await withSignedUrls([updated as unknown as PortalFile]);
  return NextResponse.json({ file: withUrl, copied: false });
}

/**
 * Löschen. Admin darf alles, Kunden nur ihre eigenen Uploads —
 * eine vom Admin bereitgestellte Datei kann der Kunde nicht entfernen.
 * Was im Kundenprofil liegt, verwaltet ohnehin nur HM Labs; das gilt auch
 * dann, wenn die Datei ursprünglich vom Kunden kam.
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403 });
  }

  const actor = await resolveActor(request);
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();

  const { data: file } = await admin
    .from("client_files")
    .select("id, client_id, storage_path, uploaded_by, scope")
    .eq("id", id)
    .single();

  if (!file) return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });

  if (actor.kind === "client") {
    const own = mayModify(actor, file);
    if (!own || file.scope === "client") {
      return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403 });
    }
  }

  await admin.storage.from(FILES_BUCKET).remove([file.storage_path]);
  const { error } = await admin.from("client_files").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: id });
}
