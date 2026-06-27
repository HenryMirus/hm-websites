import { createClient } from "@/lib/supabase/server";
import { getUserRole, requireAdmin } from "@/lib/auth/getRole";
import PortalShell from "../../../_components/PortalShell";
import ClientForm from "../../_components/ClientForm";
import { notFound } from "next/navigation";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [supabase, role] = await Promise.all([createClient(), getUserRole()]);

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, email, company_name, phone, status")
    .eq("id", id)
    .single();

  if (!client) notFound();

  return (
    <PortalShell role={role}>
      <div className="p-8 max-w-2xl">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
          Kunden bearbeiten
        </h1>
        <p className="text-text-muted text-sm mb-8">{client.company_name || client.name}</p>
        <ClientForm client={client} />
      </div>
    </PortalShell>
  );
}
