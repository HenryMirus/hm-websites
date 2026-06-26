import { createClient } from "@/lib/supabase/server";
import PortalShell from "../../_components/PortalShell";
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

const MS_STATUS: Record<string, { label: string; icon: string }> = {
  pending:     { label: "Offen",       icon: "○" },
  in_progress: { label: "In Arbeit",   icon: "◑" },
  completed:   { label: "Fertig",      icon: "●" },
  blocked:     { label: "Blockiert",   icon: "✕" },
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: milestones }, { data: decisions }, { data: feedback }] =
    await Promise.all([
      supabase.from("projects").select("*, clients(*)").eq("id", id).single(),
      supabase.from("project_milestones").select("*").eq("project_id", id).order("sort_order"),
      supabase.from("project_decisions").select("*").eq("project_id", id).order("decided_at", { ascending: false }),
      supabase.from("project_feedback").select("*").eq("project_id", id).order("given_at", { ascending: false }),
    ]);

  if (!project) notFound();

  const cfg = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.discovery;
  const client = project.clients;

  return (
    <PortalShell>
      <div className="p-8 max-w-4xl">
        {/* Back */}
        <Link href="/portal/projects" className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-dim text-sm mb-6 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Alle Projekte
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display font-bold text-3xl text-text-primary">{project.title}</h1>
              <span className={`font-mono text-xs px-2.5 py-1 rounded-lg border ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>
            {client && (
              <p className="text-text-dim">
                {client.company_name || client.name}
                {client.email && (
                  <a href={`mailto:${client.email}`} className="ml-2 text-primary hover:underline">
                    {client.email}
                  </a>
                )}
              </p>
            )}
          </div>
          {project.budget && (
            <div className="text-right shrink-0">
              <p className="font-mono text-sm text-text-muted">Budget</p>
              <p className="font-display font-bold text-2xl text-text-primary">
                {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(project.budget)}
              </p>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Typ", value: project.type },
            { label: "Start", value: project.start_date ? new Date(project.start_date).toLocaleDateString("de-DE") : "—" },
            { label: "Deadline", value: project.deadline ? new Date(project.deadline).toLocaleDateString("de-DE") : "—" },
            { label: "Launch", value: project.launch_date ? new Date(project.launch_date).toLocaleDateString("de-DE") : "—" },
          ].map((m) => (
            <div key={m.label} className="bg-surface border border-border rounded-xl p-3">
              <p className="font-mono text-[10px] text-text-muted mb-1">{m.label}</p>
              <p className="text-text-primary text-sm font-medium capitalize">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Links */}
        {(project.vercel_url || project.github_url || project.figma_url) && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.vercel_url && <ExternalLink href={project.vercel_url} label="Vercel" />}
            {project.github_url && <ExternalLink href={project.github_url} label="GitHub" />}
            {project.figma_url && <ExternalLink href={project.figma_url} label="Figma" />}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Milestones */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-text-primary">Meilensteine</h2>
              <span className="font-mono text-[11px] text-text-muted">
                {milestones?.filter((m) => m.status === "completed").length ?? 0}/{milestones?.length ?? 0} fertig
              </span>
            </div>
            {milestones?.length ? (
              <div className="space-y-2">
                {milestones.map((ms) => {
                  const msCfg = MS_STATUS[ms.status] ?? MS_STATUS.pending;
                  return (
                    <div key={ms.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                      <span className={`font-mono text-sm mt-0.5 ${ms.status === "completed" ? "text-green-400" : ms.status === "blocked" ? "text-accent" : "text-text-muted"}`}>
                        {msCfg.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${ms.status === "completed" ? "text-text-muted line-through" : "text-text-primary"}`}>
                          {ms.title}
                        </p>
                        {ms.due_date && (
                          <p className="font-mono text-[10px] text-text-muted mt-0.5">
                            {new Date(ms.due_date).toLocaleDateString("de-DE")}
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-text-muted shrink-0">{msCfg.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-text-muted text-sm">Keine Meilensteine</p>
            )}
          </div>

          {/* Decisions */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="font-display font-semibold text-text-primary mb-4">Entscheidungen</h2>
            {decisions?.length ? (
              <div className="space-y-3">
                {decisions.map((d) => (
                  <div key={d.id} className="py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-text-muted bg-bg border border-border rounded px-1.5 py-0.5">
                        {d.category}
                      </span>
                      <p className="text-text-primary text-sm font-medium">{d.title}</p>
                    </div>
                    <p className="text-text-dim text-sm">{d.decision}</p>
                    {d.rationale && (
                      <p className="text-text-muted text-xs mt-1 italic">{d.rationale}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm">Keine Entscheidungen</p>
            )}
          </div>

          {/* Feedback */}
          {feedback && feedback.length > 0 && (
            <div className="bg-surface border border-border rounded-2xl p-6 lg:col-span-2">
              <h2 className="font-display font-semibold text-text-primary mb-4">Feedback-Runden</h2>
              <div className="space-y-3">
                {feedback.map((f) => (
                  <div key={f.id} className="py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-text-muted">Runde {f.round}</span>
                      <span className="font-mono text-[10px] text-text-muted">·</span>
                      <span className="font-mono text-[10px] text-text-muted">{f.source}</span>
                      <span className={`ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                        f.status === "addressed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        f.status === "wont_fix" ? "bg-border/60 text-text-muted border-border" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>
                        {f.status === "addressed" ? "Erledigt" : f.status === "wont_fix" ? "Kein Fix" : "Offen"}
                      </span>
                    </div>
                    <p className="text-text-dim text-sm">{f.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {project.notes && (
            <div className="bg-surface border border-border rounded-2xl p-6 lg:col-span-2">
              <h2 className="font-display font-semibold text-text-primary mb-3">Notizen</h2>
              <p className="text-text-dim text-sm leading-relaxed whitespace-pre-wrap">{project.notes}</p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-mono text-xs text-text-dim hover:text-primary border border-border hover:border-primary/30 rounded-lg px-3 py-1.5 transition-colors"
    >
      {label}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M4 2H2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V6M6 1h3m0 0v3M9 1 5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
