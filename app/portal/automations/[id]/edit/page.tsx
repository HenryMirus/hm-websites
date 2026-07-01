import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, getUserRole } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import PortalShell from "@/app/portal/_components/PortalShell";
import AutomationForm from "../../_components/AutomationForm";
import type { Automation } from "@/lib/automations/types";

export const revalidate = 0;

export default async function EditAutomationPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const [supabase, role, unreadMessages] = await Promise.all([
    createClient(),
    getUserRole(),
    getUnreadMessageCount(),
  ]);

  const [{ data: automation }, { data: templates }] = await Promise.all([
    supabase.from("automations").select("*").eq("id", params.id).single(),
    supabase.from("email_templates").select("key, name").order("name"),
  ]);

  if (!automation) notFound();

  return (
    <PortalShell role={role} unreadMessages={unreadMessages}>
      <div className="p-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-text-primary">Automation bearbeiten</h1>
          <p className="text-text-dim text-sm mt-1 truncate">{(automation as Automation).name}</p>
        </div>
        <AutomationForm automation={automation as Automation} templates={templates ?? []} />
      </div>
    </PortalShell>
  );
}
