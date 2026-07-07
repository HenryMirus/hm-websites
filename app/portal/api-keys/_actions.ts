"use server";

import { createHash, randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/getRole";
import { revalidatePath } from "next/cache";

export type ApiKeyState = { error?: string; newKey?: string };

export async function createApiKeyAction(
  _prev: ApiKeyState,
  formData: FormData
): Promise<ApiKeyState> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name ist ein Pflichtfeld." };

  const rawKey = "hm_live_" + randomBytes(32).toString("hex");
  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.substring(0, 16); // "hm_live_" + 8 hex chars

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("api_keys").insert({
    name,
    key_hash: keyHash,
    key_prefix: keyPrefix,
    created_by: user?.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/portal/api-keys");
  return { newKey: rawKey };
}

export async function revokeApiKeyAction(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/portal/api-keys");
  return {};
}
