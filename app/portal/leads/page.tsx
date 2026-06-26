import { createClient } from "@/lib/supabase/server";
import PortalShell from "../_components/PortalShell";
import LeadsClient from "./_components/LeadsClient";

export const revalidate = 0;

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <PortalShell>
      <LeadsClient initialLeads={leads ?? []} />
    </PortalShell>
  );
}
