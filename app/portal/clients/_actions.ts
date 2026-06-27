"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/getRole";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ClientFormState = { error?: string };

export async function createClientAction(
  _prev: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const company_name = (formData.get("company_name") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const status = (formData.get("status") as string) || "prospect";

  if (!name || !email) return { error: "Name und E-Mail sind Pflichtfelder." };

  const supabase = await createClient();
  const { error: dbError } = await supabase
    .from("clients")
    .insert({ name, email, company_name, phone, status });

  if (dbError) {
    if (dbError.code === "23505") return { error: "Diese E-Mail existiert bereits." };
    return { error: dbError.message };
  }

  // Invite-Email senden
  const admin = createAdminClient();
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${portalUrl}/auth/callback`,
    data: { name },
  });

  if (inviteError) {
    // Eintrag war erfolgreich, Invite schlug fehl → trotzdem weiter
    console.error("Invite-Fehler:", inviteError.message);
  }

  revalidatePath("/portal/clients");
  redirect("/portal/clients");
}

export async function updateClientAction(
  id: string,
  _prev: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const company_name = (formData.get("company_name") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const status = (formData.get("status") as string) || "prospect";

  if (!name || !email) return { error: "Name und E-Mail sind Pflichtfelder." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update({ name, email, company_name, phone, status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/portal/clients");
  redirect("/portal/clients");
}

export async function deleteClientAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("clients").delete().eq("id", id);
  revalidatePath("/portal/clients");
}

export async function resendInviteAction(email: string): Promise<{ error?: string }> {
  await requireAdmin();
  const admin = createAdminClient();
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${portalUrl}/auth/callback`,
  });
  if (error) return { error: error.message };
  return {};
}
