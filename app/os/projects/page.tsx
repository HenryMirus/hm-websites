import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProjectActions from "../_components/ProjectActions";
import NewProjectButton from "../_components/NewProjectButton";

export const revalidate = 0;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  discovery: { label: "Discovery", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  design: { label: "Design", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  development: { label: "Development", color: "bg-primary/15 text-primary border-primary/25" },
  review: { label: "Review", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  live: { label: "Live ✓", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  maintenance: { label: "Wartung", color: "bg-border/60 text-text-muted border-border" },
  cancelled: { label: "Abgebrochen", color: "bg-accent/10 text-accent border-accent/20" },
};

interface ProjectRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  deadline: string | null;
  tech_stack: unknown;
  clients: { name: string | null; company_name: string | null } | null;
}

export default async function OsProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, status, deadline, tech_stack, clients(name, company_name)")
    .order("created_at", { ascending: false });

  const projects = (data ?? []) as unknown as ProjectRow[];
  const active = projects.filter((p) => !["live", "maintenance", "cancelled"].includes(p.status));
  const done = projects.filter((p) => ["live", "maintenance", "cancelled"].includes(p.status));

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">
            Projects
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Coordinate delivery work. Status is shared with the client Portal;
            here you run pipelines and track agent work.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-muted">
            {projects.length} total
          </span>
          <NewProjectButton />
        </div>
      </div>

      {error && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-accent text-sm mb-6">
          Could not load projects: {error.message}
        </div>
      )}

      {active.length > 0 && (
        <section className="mb-10">
          <p className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-4">
            Active ({active.length})
          </p>
          <div className="grid gap-3">
            {active.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {done.length > 0 && (
        <section>
          <p className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-4">
            Done ({done.length})
          </p>
          <div className="grid gap-3">
            {done.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {!projects.length && !error && (
        <div className="py-20 text-center text-text-muted text-sm">
          No projects yet. Scaffold one with{" "}
          <code className="font-mono bg-surface px-1.5 py-0.5 rounded text-xs">
            npm run new-project
          </code>{" "}
          in agent-os.
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectRow }) {
  const cfg = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.discovery;
  const client = project.clients;
  const stack = Array.isArray(project.tech_stack)
    ? (project.tech_stack as string[])
    : project.tech_stack && typeof project.tech_stack === "object"
      ? Object.values(project.tech_stack as Record<string, string>)
      : [];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <h3 className="font-display font-semibold text-text-primary truncate">
              {project.title}
            </h3>
            <span className={`shrink-0 font-mono text-[10px] px-2 py-0.5 rounded-md border ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>
          {client && (
            <p className="text-text-muted text-sm">
              {client.company_name || client.name}
            </p>
          )}
          {project.description && (
            <p className="text-text-dim text-sm mt-1.5 line-clamp-1">
              {project.description}
            </p>
          )}
          {stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {stack.slice(0, 6).map((t) => (
                <span
                  key={String(t)}
                  className="font-mono text-[10px] bg-bg border border-border text-text-muted rounded px-1.5 py-0.5"
                >
                  {String(t)}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          {project.deadline && (
            <p className="font-mono text-[11px] text-text-muted">
              ⏱{" "}
              {new Date(project.deadline).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "short",
              })}
            </p>
          )}
        </div>
      </div>

      {/* Pipeline actions — run against this project via the local OS server. */}
      <ProjectActions defaultTarget={guessTarget(client)} />
      <div className="mt-2 text-right">
        <Link
          href="/os/runs"
          className="font-mono text-[10px] text-text-muted hover:text-primary transition-colors"
        >
          view runs →
        </Link>
      </div>
    </div>
  );
}

/** Best-guess local project dir from the client name (matches new-project.ts layout). */
function guessTarget(client: ProjectRow["clients"]): string {
  const name = client?.company_name || client?.name || "client";
  const clientDir = name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  return `~/Code/Clients/${clientDir}/website`;
}
