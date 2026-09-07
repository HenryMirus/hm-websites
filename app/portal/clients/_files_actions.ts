"use server";

import { requireAdmin } from "@/lib/auth/getRole";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { FILES_BUCKET, buildStoragePath, toFileCategory } from "@/lib/portal/files";
import { revalidatePath } from "next/cache";

/**
 * Übernimmt eine Projekt- oder Chat-Datei zusätzlich dauerhaft ins Kundenprofil
 * (scope="client", ohne Projekt- oder Nachrichtenbezug). Das Original bleibt, wo
 * es ist — so muss der Kunde ein einmal geliefertes Logo im nächsten Projekt
 * nicht erneut hochladen.
 */
export async function promoteFileToClientProfileAction(
  fileId: string
): Promise<{ error?: string; id?: string }> {
  await requireAdmin();

  const admin = createAdminClient();
  const supabase = await createClient();

  const { data: file, error } = await admin
    .from("client_files")
    .select("id, client_id, storage_path, file_name, mime_type, category, size_bytes, scope")
    .eq("id", fileId)
    .single();

  if (error || !file) return { error: "Datei nicht gefunden." };
  if (file.scope === "client") return { error: "Liegt bereits im Kundenprofil." };

  const category = toFileCategory(file.category);
  const targetPath = buildStoragePath({
    clientId: file.client_id,
    scope: "client",
    category,
    fileName: file.file_name,
  });

  const { error: copyError } = await admin.storage
    .from(FILES_BUCKET)
    .copy(file.storage_path, targetPath);
  if (copyError) return { error: `Kopieren fehlgeschlagen: ${copyError.message}` };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: inserted, error: insertError } = await admin
    .from("client_files")
    .insert({
      client_id: file.client_id,
      project_id: null,
      message_id: null,
      scope: "client",
      storage_path: targetPath,
      file_name: file.file_name,
      mime_type: file.mime_type,
      category,
      size_bytes: file.size_bytes,
      uploaded_by: user?.id ?? null,
      uploaded_by_role: "admin",
      source_file_id: file.id,
    })
    .select("id")
    .single();

  if (insertError) {
    await admin.storage.from(FILES_BUCKET).remove([targetPath]);
    return { error: `Speichern fehlgeschlagen: ${insertError.message}` };
  }

  revalidatePath(`/portal/clients/${file.client_id}/edit`);
  return { id: inserted.id };
}
