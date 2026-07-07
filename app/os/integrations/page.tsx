import { getGitHubRepos } from "@/lib/os/github";
import { getVercelProjects } from "@/lib/os/vercel";
import { getHealthChecks } from "@/lib/os/health";
import HealthTile from "../_components/HealthTile";

export const revalidate = 120;

function relTime(iso: string | null) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d}d ago`;
}

function DeployState({ state }: { state: string }) {
  const map: Record<string, string> = {
    READY: "text-emerald-400",
    ERROR: "text-accent",
    BUILDING: "text-primary",
    QUEUED: "text-yellow-400",
    CANCELED: "text-text-muted",
  };
  return (
    <span className={`text-xs font-mono ${map[state] ?? "text-text-muted"}`}>
      {state}
    </span>
  );
}

export default async function IntegrationsPage() {
  const [repos, projects, health] = await Promise.all([
    getGitHubRepos(),
    getVercelProjects(),
    getHealthChecks(),
  ]);

  return (
    <div className="p-8 max-w-5xl space-y-10">
      <h1 className="font-display font-bold text-2xl text-text-primary">
        Integrations
      </h1>

      {/* Health */}
      <section>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Service Health
        </h2>
        <div className="flex flex-wrap gap-3">
          {health.map((h) => (
            <HealthTile key={h.name} check={h} />
          ))}
        </div>
      </section>

      {/* GitHub */}
      <section>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          GitHub Repos
        </h2>
        {repos.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-5 text-text-muted text-sm">
            Set{" "}
            <code className="font-mono bg-bg px-1.5 py-0.5 rounded text-xs">
              GITHUB_TOKEN
            </code>{" "}
            in your environment to enable GitHub integration.
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-text-muted uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Repo</th>
                  <th className="text-left px-4 py-3">Branch</th>
                  <th className="text-right px-4 py-3">Issues</th>
                  <th className="text-right px-4 py-3">Last push</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {repos.map((r) => (
                  <tr
                    key={r.full_name}
                    className="hover:bg-bg/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <a
                        href={r.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-mono text-xs"
                      >
                        {r.name}
                      </a>
                      {r.private && (
                        <span className="ml-2 text-[10px] text-text-dim">
                          private
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted font-mono">
                      {r.default_branch}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-text-muted">
                      {r.open_issues_count}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-text-dim">
                      {relTime(r.pushed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Vercel */}
      <section>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Vercel Projects
        </h2>
        {projects.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-5 text-text-muted text-sm">
            Set{" "}
            <code className="font-mono bg-bg px-1.5 py-0.5 rounded text-xs">
              VERCEL_TOKEN
            </code>{" "}
            in your environment to enable Vercel integration.
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-text-muted uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Project</th>
                  <th className="text-left px-4 py-3">Framework</th>
                  <th className="text-left px-4 py-3">Latest deploy</th>
                  <th className="text-right px-4 py-3">Deployed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((p) => {
                  const latest = p.latestDeployments[0] ?? null;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-bg/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-primary">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-xs text-text-muted">
                        {p.framework ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {latest ? (
                          <div className="flex items-center gap-2">
                            <DeployState state={latest.state} />
                            {latest.url && (
                              <a
                                href={`https://${latest.url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-text-dim hover:text-primary text-[10px] font-mono truncate max-w-[160px]"
                              >
                                {latest.url}
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-text-dim">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-text-dim">
                        {latest
                          ? relTime(new Date(latest.createdAt).toISOString())
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
