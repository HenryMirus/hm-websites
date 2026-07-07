import { createClient } from "@/lib/supabase/server";
import { getUserRole, requireAdmin } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import PortalShell from "../_components/PortalShell";
import LeadsClient from "./_components/LeadsClient";

export const revalidate = 0;

export default async function LeadsPage() {
  await requireAdmin();
  const [supabase, role, unreadMessages] = await Promise.all([
    createClient(),
    getUserRole(),
    getUnreadMessageCount(),
  ]);

  const { data: leads } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <PortalShell role={role} unreadMessages={unreadMessages}>
      <LeadsClient initialLeads={leads ?? []} />
    </PortalShell>
  );
}
