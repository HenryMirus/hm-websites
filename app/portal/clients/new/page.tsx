import { getUserRole, requireAdmin } from "@/lib/auth/getRole";
import PortalShell from "../../_components/PortalShell";
import ClientForm from "../_components/ClientForm";

export default async function NewClientPage() {
  await requireAdmin();
  const role = await getUserRole();
  return (
    <PortalShell role={role}>
      <div className="p-8 max-w-2xl">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-8">
          Neuen Kunden anlegen
        </h1>
        <ClientForm />
      </div>
    </PortalShell>
  );
}
