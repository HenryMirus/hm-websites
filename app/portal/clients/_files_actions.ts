"use server";

import { requireAdmin } from "@/lib/auth/getRole";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const BUCKET = "client-files";

export type FileCategory = "brand" | "images" | "videos" | "content" | "other";

export async function uploadFileAction(
  clientId: string,
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  const category = (formData.get("category") as FileCategory) || "other";
  const projectId = (formData.get("project_id") as string) || null;

  if (!file || file.size === 0) return { error: "Keine Datei ausgewählt." };
  if (file.size > 52_428_800) return { error: "Datei zu groß (max. 50 MB)." };

  const ext = file.name.split(".").pop() ?? "";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const folder = projectId
    ? `${clientId}/projects/${projectId}/${category}`
    : `${clientId}/${category}`;
  const storagePath = `${folder}/${Date.now()}_${safeName}`;

  const admin = createAdminClient();
  const supabase = await createClient();

  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) return { error: `Upload fehlgeschlagen: ${uploadError.message}` };

  const { data: { user } } = await supabase.auth.getUser();

  await admin.from("client_files").insert({
    client_id: clientId,
    project_id: projectId || null,
    storage_path: storagePath,
    file_name: file.name,
    mime_type: file.type || null,
    category,
    size_bytes: file.size,
    uploaded_by: user?.id ?? null,
  });

  revalidatePath(`/portal/clients/${clientId}/edit`);
  return { success: true };
}

export async function deleteFileAction(fileId: string, clientId: string): Promise<void> {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: file } = await admin
    .from("client_files")
    .select("storage_path")
    .eq("id", fileId)
    .single();

  if (file?.storage_path) {
    await admin.storage.from(BUCKET).remove([file.storage_path]);
  }

  await admin.from("client_files").delete().eq("id", fileId);

  revalidatePath(`/portal/clients/${clientId}/edit`);
}

export async function getSignedUrlsAction(
  paths: string[]
): Promise<Record<string, string>> {
  await requireAdmin();
  const admin = createAdminClient();

  const result: Record<string, string> = {};
  for (const path of paths) {
    const { data } = await admin.storage
      .from(BUCKET)
      .createSignedUrl(path, 3600);
    if (data?.signedUrl) result[path] = data.signedUrl;
  }
  return result;
}
