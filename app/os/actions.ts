"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/os/login");

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (data?.role !== "admin") redirect("/os/login");
  return user;
}

export async function decideApproval(
  approvalId: string,
  decision: "approved" | "rejected"
) {
  const user = await assertAdmin();
  const db = createAdminClient();

  const { error } = await db
    .schema("agent_os")
    .from("pipeline_approvals")
    .update({
      status: decision,
      decided_at: new Date().toISOString(),
      decided_by: user.id,
    })
    .eq("id", approvalId)
    .eq("status", "pending");

  if (error) throw new Error(`decideApproval: ${error.message}`);
  revalidatePath("/os/approvals");
}
