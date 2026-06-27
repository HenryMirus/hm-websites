import { createClient } from "@/lib/supabase/server";
import { getUserRole, requireAdmin } from "@/lib/auth/getRole";
import PortalShell from "../_components/PortalShell";
import Link from "next/link";
import DeleteClientButton from "./_components/DeleteClientButton";

export const revalidate = 0;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  prospect: { label: "Interessent", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  active:   { label: "Aktiv",       color: "bg-green-500/10 text-green-400 border-green-500/20" },
  inactive: { label: "Inaktiv",     color: "bg-border/60 text-text-muted border-border" },
};

export default async function ClientsPage() {
  await requireAdmin();
  const [supabase, role] = await Promise.all([createClient(), getUserRole()]);

  const { data: clients } = await supabase
    .from("clients")
    .select("*, projects(id, title, status)")
    .order("created_at", { ascending: false });

  return (
    <PortalShell role={role}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-2xl text-text-primary">Kunden</h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-text-muted">{clients?.length ?? 0} gesamt</span>
            <Link
              href="/portal/clients/new"
              className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Neuer Kunde
            </Link>
          </div>
        </div>

        <div className="grid gap-3">
          {clients?.map((client) => {
            const cfg = STATUS_CONFIG[client.status] ?? STATUS_CONFIG.prospect;
            const activeProjects = client.projects?.filter((p: any) =>
              !["live", "maintenance", "cancelled"].includes(p.status)
            );

            return (
              <div key={client.id} className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                      <span className="font-display font-bold text-primary">
                        {(client.company_name || client.name).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-semibold text-text-primary">
                          {client.company_name || client.name}
                        </h3>
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        {!client.auth_user_id && (
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border bg-orange-500/10 text-orange-400 border-orange-500/20">
                            Einladung ausstehend
                          </span>
                        )}
                      </div>
                      <a href={`mailto:${client.email}`} className="text-primary text-sm hover:underline">
                        {client.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right mr-2">
                      {client.projects?.length > 0 && (
                        <p className="font-mono text-xs text-text-muted">
                          {client.projects.length} Projekt{client.projects.length !== 1 ? "e" : ""}
                          {activeProjects?.length > 0 && (
                            <span className="text-primary"> · {activeProjects.length} aktiv</span>
                          )}
                        </p>
                      )}
                      {client.phone && (
                        <a href={`tel:${client.phone}`} className="font-mono text-xs text-text-muted hover:text-primary transition-colors mt-0.5 block">
                          {client.phone}
                        </a>
                      )}
                    </div>
                    <Link
                      href={`/portal/clients/${client.id}/edit`}
                      className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg transition-colors"
                      title="Bearbeiten"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                    <DeleteClientButton id={client.id} name={client.company_name || client.name} />
                  </div>
                </div>

                {client.projects?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
                    {client.projects.map((p: any) => (
                      <a
                        key={p.id}
                        href={`/portal/projects/${p.id}`}
                        className="font-mono text-[11px] text-text-dim hover:text-primary bg-bg border border-border hover:border-primary/30 rounded-md px-2 py-0.5 transition-colors"
                      >
                        {p.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {!clients?.length && (
            <div className="py-20 text-center">
              <p className="text-text-muted text-sm mb-4">Noch keine Kunden vorhanden.</p>
              <Link href="/portal/clients/new" className="text-primary hover:underline text-sm">
                Ersten Kunden anlegen →
              </Link>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
