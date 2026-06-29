import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export type UserRole = "admin" | "client";

export async function getUserRole(): Promise<UserRole> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "client";

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (data?.role as UserRole) ?? "client";
}

/** Stellt sicher, dass ein eingeloggter User vorhanden ist. Leitet sonst zu /login weiter. */
export async function requireAuth(): Promise<User> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin(): Promise<void> {
  const role = await getUserRole();
  if (role !== "admin") {
    redirect("/portal/projects");
  }
}
