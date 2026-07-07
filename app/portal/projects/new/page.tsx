import { requireAdmin } from "@/lib/auth/getRole";
import { createClient } from "@/lib/supabase/server";
import PortalShell from "../../_components/PortalShell";
import ProjectForm from "../_components/ProjectForm";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import Link from "next/link";

export const revalidate = 0;

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>;
}) {
  const { client_id: defaultClientId } = await searchParams;
  await requireAdmin();

  const [supabase, unreadMessages] = await Promise.all([
    createClient(),
    getUnreadMessageCount(),
  ]);

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, company_name")
    .order("name");

  return (
    <PortalShell role="admin" unreadMessages={unreadMessages}>
      <div className="p-8 max-w-2xl">
        <Link
          href={defaultClientId ? `/portal/clients/${defaultClientId}/edit` : "/portal/projects"}
          className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-dim text-sm mb-6 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {defaultClientId ? "Zurück zum Kunden" : "Alle Projekte"}
        </Link>

        <h1 className="font-display font-bold text-2xl text-text-primary mb-8">
          Neues Projekt
        </h1>

        <ProjectForm clients={clients ?? []} defaultClientId={defaultClientId} />
      </div>
    </PortalShell>
  );
}
