"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/getRole";
import { grantClientPortalAccess } from "@/lib/portal/grantClientPortalAccess";
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
  const { error: inviteError } = await grantClientPortalAccess(email, name);

  if (inviteError) {
    // Eintrag war erfolgreich, Invite schlug fehl → trotzdem weiter
    console.error("Invite-Fehler:", inviteError);
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

export type DeleteClientState = { error?: string };

export async function deleteClientAction(id: string): Promise<DeleteClientState> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("clients").delete().eq("id", id).select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    // Kein Fehler, aber auch keine Zeile betroffen — z.B. RLS hat gefiltert, ohne das als Fehler zu melden.
    return { error: "Löschen hatte keine Wirkung (0 Zeilen betroffen). Bitte Seite neu laden und erneut versuchen." };
  }

  revalidatePath("/portal/clients");
  return {};
}

export async function resendInviteAction(email: string): Promise<{ error?: string }> {
  await requireAdmin();
  return grantClientPortalAccess(email);
}
