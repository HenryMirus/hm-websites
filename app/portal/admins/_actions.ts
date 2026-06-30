"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, getUserRole } from "@/lib/auth/getRole";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AdminFormState = { error?: string; success?: boolean };

export async function inviteAdminAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const name = (formData.get("name") as string)?.trim();
  if (!email) return { error: "E-Mail ist ein Pflichtfeld." };

  const admin = createAdminClient();
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${portalUrl}/auth/callback`,
    data: { name },
  });

  if (error) return { error: error.message };

  // Direkt auf 'admin' setzen (Trigger erstellt 'client', sofort überschreiben)
  if (data.user) {
    await admin.from("profiles").upsert({ id: data.user.id, role: "admin" });
  }

  revalidatePath("/portal/admins");
  return { success: true };
}

export async function removeAdminAction(userId: string): Promise<AdminFormState> {
  await requireAdmin();

  // Eigenen Account nicht entfernen
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id === userId) return { error: "Sie können Ihren eigenen Account nicht entfernen." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };

  revalidatePath("/portal/admins");
  return { success: true };
}
