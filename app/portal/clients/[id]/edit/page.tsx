import { createClient } from "@/lib/supabase/server";
import { getUserRole, requireAdmin } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import PortalShell from "../../../_components/PortalShell";
import ClientForm from "../../_components/ClientForm";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  discovery:   { label: "Discovery",   color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  design:      { label: "Design",      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  development: { label: "Development", color: "bg-primary/15 text-primary border-primary/25" },
  review:      { label: "Review",      color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  live:        { label: "Live ✓",      color: "bg-green-500/10 text-green-400 border-green-500/20" },
  maintenance: { label: "Wartung",     color: "bg-border/60 text-text-muted border-border" },
  cancelled:   { label: "Abgebrochen", color: "bg-accent/10 text-accent border-accent/20" },
};

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [supabase, role, unreadMessages] = await Promise.all([
    createClient(),
    getUserRole(),
    getUnreadMessageCount(),
  ]);

  const [{ data: client }, { data: projects }] = await Promise.all([
    supabase
      .from("clients")
      .select("id, name, email, company_name, phone, status")
      .eq("id", id)
      .single(),
    supabase
      .from("projects")
      .select("id, title, status, deadline, budget")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!client) notFound();

  return (
    <PortalShell role={role} unreadMessages={unreadMessages}>
      <div className="p-8">
        <Link
          href="/portal/clients"
          className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-dim text-sm mb-6 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Alle Kunden
        </Link>

        <h1 className="font-display font-bold text-2xl text-text-primary mb-1">
          Kunden bearbeiten
        </h1>
        <p className="text-text-muted text-sm mb-8">{client.company_name || client.name}</p>

        <div className="grid xl:grid-cols-2 gap-8 items-start max-w-4xl">
          {/* Linke Spalte: Kunden-Formular */}
          <div>
            <ClientForm client={client} />
          </div>

          {/* Rechte Spalte: Projekte */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-text-primary">Projekte</h2>
              <Link
                href={`/portal/projects/new?client_id=${id}`}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:text-primary/80 transition-colors"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Neues Projekt
              </Link>
            </div>

            {projects && projects.length > 0 ? (
              <div className="space-y-2">
                {projects.map((p) => {
                  const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.discovery;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{p.title}</p>
                        {p.deadline && (
                          <p className="font-mono text-[10px] text-text-muted mt-0.5">
                            ⏱ {new Date(p.deadline).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        )}
                      </div>
                      <span className={`shrink-0 font-mono text-[10px] px-2 py-0.5 rounded-md border ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <Link
                          href={`/portal/projects/${p.id}`}
                          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg transition-colors"
                          title="Ansehen"
                        >
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                            <path d="M1 7s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                        </Link>
                        <Link
                          href={`/portal/projects/${p.id}/edit`}
                          className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Bearbeiten"
                        >
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                            <path d="M10 2l2 2-8 8H2v-2L10 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-text-muted text-sm mb-3">Noch keine Projekte</p>
                <Link
                  href={`/portal/projects/new?client_id=${id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Erstes Projekt anlegen →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
