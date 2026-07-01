import { createClient } from "@/lib/supabase/server";
import { requireAdmin, getUserRole } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import PortalShell from "@/app/portal/_components/PortalShell";
import AutomationForm from "../_components/AutomationForm";

export const revalidate = 0;

export default async function NewAutomationPage() {
  await requireAdmin();
  const [supabase, role, unreadMessages] = await Promise.all([
    createClient(),
    getUserRole(),
    getUnreadMessageCount(),
  ]);

  const { data: templates } = await supabase
    .from("email_templates")
    .select("key, name")
    .order("name");

  return (
    <PortalShell role={role} unreadMessages={unreadMessages}>
      <div className="p-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-text-primary">Neue Automation</h1>
          <p className="text-text-dim text-sm mt-1">Trigger, Schritte und Konfiguration festlegen.</p>
        </div>
        <AutomationForm templates={templates ?? []} />
      </div>
    </PortalShell>
  );
}
