import { readRegistry } from "@/lib/os/registry";

export const revalidate = 30;

const AUTONOMY_STYLE: Record<string, { label: string; color: string }> = {
  auto: { label: "auto", color: "bg-green-500/15 text-green-400 border-green-500/25" },
  "propose-then-confirm": {
    label: "propose-then-confirm",
    color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  },
  manual: { label: "manual", color: "bg-accent/15 text-accent border-accent/25" },
};

export default function AgentsPage() {
  const registry = readRegistry();

  if (!registry) {
    return (
      <div className="p-8 max-w-4xl">
        <Header version={null} />
        <div className="bg-surface border border-border rounded-lg p-6 text-center text-text-muted">
          Registry not found. The dashboard reads{" "}
          <code className="font-mono bg-bg px-1.5 py-0.5 rounded text-xs">
            agent-os/registry/registry.json
          </code>{" "}
          — set{" "}
          <code className="font-mono bg-bg px-1.5 py-0.5 rounded text-xs">
            AGENT_OS_PATH
          </code>{" "}
          or check out the agent-os repo alongside this one.
        </div>
      </div>
    );
  }

  const skillById = new Map(registry.skills.map((s) => [s.id, s]));

  return (
    <div className="p-8 max-w-4xl">
      <Header version={registry.version} updated={registry.updated} />

      {/* Agents */}
      <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
        Agents ({registry.agents.length})
      </h2>
      <div className="grid gap-3 mb-10">
        {registry.agents.map((agent) => {
          const cfg = AUTONOMY_STYLE[agent.autonomy] ?? AUTONOMY_STYLE.manual;
          return (
            <div
              key={agent.id}
              className="bg-surface border border-border rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display font-semibold text-text-primary">
                    {agent.id}
                  </h3>
                  <span
                    className={`shrink-0 font-mono text-[10px] px-2 py-0.5 rounded-md border ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                  {agent.writes && (
                    <span className="shrink-0 font-mono text-[10px] px-2 py-0.5 rounded-md border bg-border/40 text-text-muted border-border">
                      writes
                    </span>
                  )}
                </div>
              </div>
              <p className="text-text-muted text-sm mb-3">{agent.description}</p>

              <div className="flex flex-wrap items-center gap-1.5">
                {agent.skills.map((s) => (
                  <span
                    key={s}
                    title={skillById.get(s)?.description ?? "unknown skill"}
                    className="font-mono text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5"
                  >
                    {s}
                  </span>
                ))}
                {agent.mcps.map((m) => (
                  <span
                    key={m}
                    className="font-mono text-[10px] bg-cyan-500/10 text-cyan-400 rounded px-1.5 py-0.5"
                  >
                    mcp:{m}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skills */}
      <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
        Skill library ({registry.skills.length})
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {registry.skills.map((skill) => {
          const usedBy = registry.agents
            .filter((a) => a.skills.includes(skill.id))
            .map((a) => a.id);
          return (
            <div
              key={skill.id}
              className="bg-surface border border-border rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-mono text-sm text-text-primary">{skill.id}</h3>
                {skill.path === "global" && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-border/40 text-text-muted">
                    global
                  </span>
                )}
              </div>
              <p className="text-text-muted text-xs mb-2">{skill.description}</p>
              {usedBy.length > 0 && (
                <p className="text-text-dim text-[11px]">
                  used by:{" "}
                  <span className="font-mono">{usedBy.join(", ")}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-text-dim text-xs">
        Edit agents in{" "}
        <code className="font-mono bg-surface px-1 rounded">
          agent-os/registry/agents/*.md
        </code>{" "}
        and skill assignments in{" "}
        <code className="font-mono bg-surface px-1 rounded">registry.json</code>.
        Changes are picked up on the next pipeline run — no redeploy.
      </p>
    </div>
  );
}

function Header({
  version,
  updated,
}: {
  version: string | null;
  updated?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Skills &amp; Agents
        </h1>
        {version && (
          <span className="font-mono text-xs text-text-muted">
            registry v{version}
            {updated ? ` · ${updated}` : ""}
          </span>
        )}
      </div>
      <p className="text-text-muted text-sm mt-1">
        The HM Labs agent roster and skill library that the pipeline enforces.
      </p>
    </div>
  );
}
