import { readRoutines } from "@/lib/os/registry";
import RunRoutineButton from "../_components/RunRoutineButton";

export const revalidate = 30;

/** First sentence of the pipeline _comment, trimmed for display. */
function summarize(comment?: string): string {
  if (!comment) return "";
  const firstSentence = comment.split(/\.\s/)[0];
  return firstSentence.length > 200 ? firstSentence.slice(0, 200) + "…" : firstSentence + ".";
}

export default function RoutinesPage() {
  const routines = readRoutines();

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Routines
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Pipeline definitions the OS can run — each is a phase graph of agents.
          Trigger a run from the terminal (Chat tab) or against a project.
        </p>
      </div>

      {routines.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-6 text-center text-text-muted">
          No pipelines found in{" "}
          <code className="font-mono bg-bg px-1.5 py-0.5 rounded text-xs">
            agent-os/orchestrator/
          </code>
          .
        </div>
      ) : (
        <div className="grid gap-3">
          {routines.map((r) => {
            const agentCount = r.phases.reduce((n, p) => n + p.agents.length, 0);
            return (
              <div
                key={r.file}
                className="bg-surface border border-border rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display font-semibold text-text-primary capitalize">
                      {r.name}
                    </h3>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-md border bg-border/40 text-text-muted border-border">
                      {r.phases.length} phase{r.phases.length !== 1 ? "s" : ""} ·{" "}
                      {agentCount} agent{agentCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-text-dim shrink-0">
                    {r.file}
                  </span>
                </div>

                {r.comment && (
                  <p className="text-text-muted text-sm mb-3">
                    {summarize(r.comment)}
                  </p>
                )}

                {/* Phase → agents flow */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {r.phases.map((phase, i) => (
                    <div key={phase.name} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-text-dim text-xs">→</span>}
                      <span
                        className="inline-flex items-center gap-1 font-mono text-[10px] bg-bg border border-border rounded px-1.5 py-0.5"
                        title={phase.parallel ? "agents run in parallel" : "sequential"}
                      >
                        <span className="text-text-muted">{phase.name}</span>
                        {phase.parallel && phase.agents.length > 1 && (
                          <span className="text-primary" title="parallel">
                            ∥
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {r.phases
                    .flatMap((p) => p.agents)
                    .map((a) => (
                      <span
                        key={a.name}
                        className="font-mono text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5"
                      >
                        {a.registry_id}
                      </span>
                    ))}
                </div>

                <RunRoutineButton file={r.file} />
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 bg-surface border border-border rounded-lg p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-1">
          Scheduling (Phase 3)
        </h3>
        <p className="text-sm text-text-muted">
          Cron and event triggers (new lead, new deployment) will fire these
          routines automatically as agents earn autonomy. Today they run on
          demand. See{" "}
          <code className="font-mono bg-bg px-1.5 py-0.5 rounded text-xs">
            agent-os/docs/roadmap.md
          </code>
          .
        </p>
      </div>
    </div>
  );
}
