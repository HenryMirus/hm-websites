"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/getRole";
import { grantClientPortalAccess } from "@/lib/portal/grantClientPortalAccess";
import { revalidatePath } from "next/cache";

export type ConvertLeadState = { error?: string; clientId?: string };

/**
 * Legt aus einem Lead (contact_submissions) einen Kunden an, falls noch
 * keiner mit dieser E-Mail existiert, und verschickt in jedem Fall die
 * Einladungs-E-Mail. Existiert der Kunde bereits, wird nur die Einladung
 * (erneut) verschickt - kein Duplikat-Fehler mehr. Spiegelt sonst den
 * Ablauf aus createClientAction (app/portal/clients/_actions.ts).
 */
export async function convertLeadToClientAction(leadId: string): Promise<ConvertLeadState> {
  await requireAdmin();

  const supabase = await createClient();
  const { data: lead, error: leadError } = await supabase
    .from("contact_submissions")
    .select("name, email, company, phone")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) return { error: "Lead nicht gefunden." };

  const email = lead.email?.trim().toLowerCase();
  const name = lead.name?.trim();
  if (!email || !name) return { error: "Lead hat keinen Namen oder keine E-Mail." };

  const { data: existingClient, error: lookupError } = await supabase
    .from("clients")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) return { error: lookupError.message };

  let clientId: string;

  if (existingClient) {
    clientId = existingClient.id;
  } else {
    const { data: newClient, error: dbError } = await supabase
      .from("clients")
      .insert({
        name,
        email,
        company_name: lead.company?.trim() || null,
        phone: lead.phone?.trim() || null,
        status: "prospect",
      })
      .select("id")
      .single();

    if (dbError) return { error: dbError.message };
    clientId = newClient.id;
  }

  const { error: inviteError } = await grantClientPortalAccess(email, name);

  if (inviteError) {
    // Kunde existiert (neu oder schon vorher), nur der Versand schlug fehl - über ResendInviteButton nachholbar.
    console.error("Invite-Fehler:", inviteError);
    revalidatePath("/portal/leads");
    revalidatePath("/portal/clients");
    return { error: `Kunde vorhanden, aber Einladung fehlgeschlagen: ${inviteError}`, clientId };
  }

  revalidatePath("/portal/leads");
  revalidatePath("/portal/clients");
  return { clientId };
}
