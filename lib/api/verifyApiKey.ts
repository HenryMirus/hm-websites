import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function verifyApiKey(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer hm_live_")) return false;

  const rawKey = authHeader.slice(7);
  const keyHash = createHash("sha256").update(rawKey).digest("hex");

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key_hash", keyHash)
    .is("revoked_at", null)
    .single();

  if (!data) return false;

  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return true;
}
