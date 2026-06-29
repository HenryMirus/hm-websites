import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/getRole";

export async function getUnreadMessageCount(): Promise<number> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const role = await getUserRole();

  if (role === "admin") {
    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("sender_role", "client")
      .eq("is_read", false);
    return count ?? 0;
  }

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!client) return 0;

  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("client_id", client.id)
    .eq("sender_role", "admin")
    .eq("is_read", false);

  return count ?? 0;
}
