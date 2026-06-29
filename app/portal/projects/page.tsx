import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import PortalShell from "../_components/PortalShell";
import Link from "next/link";

export const revalidate = 0;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  discovery:   { label: "Discovery",    color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  design:      { label: "Design",       color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  development: { label: "Development",  color: "bg-primary/15 text-primary border-primary/25" },
  review:      { label: "Review",       color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  live:        { label: "Live ✓",       color: "bg-green-500/10 text-green-400 border-green-500/20" },
  maintenance: { label: "Wartung",      color: "bg-border/60 text-text-muted border-border" },
  cancelled:   { label: "Abgebrochen",  color: "bg-accent/10 text-accent border-accent/20" },
};

export default async function ProjectsPage() {
  const [supabase, role, unreadMessages] = await Promise.all([
    createClient(),
    getUserRole(),
    getUnreadMessageCount(),
  ]);

  const { data: projects } = await supabase
    .from("projects")
    .select("*, clients(name, company_name, email)")
    .order("created_at", { ascending: false });

  const active = projects?.filter((p) => !["live", "maintenance", "cancelled"].includes(p.status)) ?? [];
  const done = projects?.filter((p) => ["live", "maintenance", "cancelled"].includes(p.status)) ?? [];

  return (
    <PortalShell role={role} unreadMessages={unreadMessages}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-2xl text-text-primary">
            {role === "admin" ? "Projekte" : "Meine Projekte"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-text-muted">{projects?.length ?? 0} gesamt</span>
            {role === "admin" && (
              <Link
                href="/portal/projects/new"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Neues Projekt
              </Link>
            )}
          </div>
        </div>

        {active.length > 0 && (
          <section className="mb-10">
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-4">
              Aktiv ({active.length})
            </p>
            <div className="grid gap-3">
              {active.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </section>
        )}

        {done.length > 0 && (
          <section>
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-4">
              Abgeschlossen ({done.length})
            </p>
            <div className="grid gap-3">
              {done.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </section>
        )}

        {!projects?.length && (
          <div className="py-20 text-center text-text-muted text-sm">
            Noch keine Projekte vorhanden.
          </div>
        )}
      </div>
    </PortalShell>
  );
}

function ProjectCard({ project }: { project: any }) {
  const cfg = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.discovery;
  const client = project.clients;

  return (
    <Link
      href={`/portal/projects/${project.id}`}
      className="block bg-surface border border-border hover:border-primary/30 rounded-2xl p-5 transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <h3 className="font-display font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
              {project.title}
            </h3>
            <span className={`shrink-0 font-mono text-[10px] px-2 py-0.5 rounded-md border ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>
          {client && (
            <p className="text-text-muted text-sm">{client.company_name || client.name}</p>
          )}
          {project.description && (
            <p className="text-text-dim text-sm mt-1.5 line-clamp-1">{project.description}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          {project.budget && (
            <p className="font-mono text-sm text-text-primary">
              {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(project.budget)}
            </p>
          )}
          {project.deadline && (
            <p className="font-mono text-[11px] text-text-muted mt-0.5">
              ⏱ {new Date(project.deadline).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}
            </p>
          )}
        </div>
      </div>
      {project.tech_stack && Object.keys(project.tech_stack).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {(Array.isArray(project.tech_stack) ? project.tech_stack : Object.values(project.tech_stack)).slice(0, 5).map((t: any) => (
            <span key={t} className="font-mono text-[10px] bg-bg border border-border text-text-muted rounded px-1.5 py-0.5">
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
