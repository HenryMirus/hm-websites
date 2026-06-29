"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SettingsState = { error?: string; success?: string };

export async function updateProfileAction(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht angemeldet." };

  const name = (formData.get("name") as string)?.trim();
  const company_name = (formData.get("company_name") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;

  if (!name) return { error: "Name ist ein Pflichtfeld." };

  const { error } = await supabase
    .from("clients")
    .update({ name, company_name, phone, updated_at: new Date().toISOString() })
    .eq("auth_user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/portal/settings");
  return { success: "Profil gespeichert." };
}

export async function changeEmailAction(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "E-Mail darf nicht leer sein." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Ungültige E-Mail-Adresse." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht angemeldet." };
  if (email === user.email) return { error: "Das ist bereits deine aktuelle E-Mail-Adresse." };

  const { error } = await supabase.auth.updateUser({ email });
  if (error) return { error: error.message };

  return { success: "Bestätigungs-E-Mail wurde gesendet. Bitte prüfe dein Postfach und klicke den Link." };
}

export async function changePasswordAction(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const password = (formData.get("password") as string) ?? "";
  const confirm = (formData.get("confirm") as string) ?? "";

  if (password.length < 8) return { error: "Mindestens 8 Zeichen erforderlich." };
  if (password !== confirm) return { error: "Passwörter stimmen nicht überein." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };
  return { success: "Passwort erfolgreich geändert." };
}
