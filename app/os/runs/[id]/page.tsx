import { notFound } from "next/navigation";
import { getRun, getRunSteps } from "@/lib/os/queries";
import RunStatusBadge from "../../_components/RunStatusBadge";
import ScoreBar from "../../_components/ScoreBar";
import Link from "next/link";

export const revalidate = 10;

function ApprovalBadge({ val }: { val: string }) {
  const map: Record<string, string> = {
    "n/a": "text-text-dim",
    pending: "text-yellow-400",
    approved: "text-emerald-400",
    rejected: "text-accent",
    mixed: "text-orange-400",
  };
  return (
    <span className={`text-xs font-mono ${map[val] ?? "text-text-muted"}`}>
      {val}
    </span>
  );
}

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [run, steps] = await Promise.all([getRun(id), getRunSteps(id)]);
  if (!run) notFound();

  // Group steps by iteration → phase
  const byIter: Record<number, Record<string, typeof steps>> = {};
  for (const s of steps) {
    if (!byIter[s.iteration]) byIter[s.iteration] = {};
    if (!byIter[s.iteration][s.phase]) byIter[s.iteration][s.phase] = [];
    byIter[s.iteration][s.phase].push(s);
  }
  const iterations = Object.keys(byIter)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <Link
        href="/os/runs"
        className="text-xs text-text-muted hover:text-primary transition-colors mb-6 inline-block"
      >
        ← All runs
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <RunStatusBadge status={run.status} />
            <span className="font-mono text-xs text-text-muted">
              {run.id_text}
            </span>
          </div>
          <p className="text-text-primary text-sm line-clamp-2">{run.prompt}</p>
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          {
            label: "Pipeline",
            value: run.pipeline.replace("orchestrator/", ""),
          },
          {
            label: "Final score",
            value: run.final_score != null ? run.final_score.toFixed(3) : "—",
          },
          { label: "Iterations", value: run.iterations ?? "—" },
          {
            label: "Cost",
            value:
              run.total_cost_usd != null
                ? `$${run.total_cost_usd.toFixed(4)}`
                : "—",
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-surface border border-border rounded-lg px-4 py-3"
          >
            <p className="text-xs text-text-muted mb-0.5">{label}</p>
            <p className="text-sm font-mono text-text-primary">{value}</p>
          </div>
        ))}
      </div>

      {/* Critical findings */}
      {(run.critical_findings?.length ?? 0) > 0 && (
        <div className="mb-8 bg-accent/5 border border-accent/20 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
            Critical Findings
          </h3>
          <ul className="space-y-1">
            {run.critical_findings!.map((f, i) => (
              <li key={i} className="text-sm text-text-primary">
                · {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps by iteration */}
      {iterations.map((iter) => (
        <section key={iter} className="mb-8">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Iteration {iter}
          </h2>
          {Object.entries(byIter[iter]).map(([phase, phaseSteps]) => (
            <div key={phase} className="mb-4">
              <h3 className="text-xs text-text-dim mb-2 ml-1">{phase}</h3>
              <div className="space-y-2">
                {phaseSteps.map((s) => (
                  <div
                    key={s.id}
                    className="bg-surface border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-primary">
                        {s.agent}
                      </span>
                      <RunStatusBadge
                        status={
                          s.status as "running" | "passed" | "failed" | "cancelled"
                        }
                      />
                      <ScoreBar score={s.score} />
                      <ApprovalBadge val={s.approval} />
                      {s.cost_usd != null && (
                        <span className="ml-auto text-xs font-mono text-text-dim">
                          ${s.cost_usd.toFixed(4)}
                        </span>
                      )}
                    </div>
                    {s.summary && (
                      <p className="text-xs text-text-muted line-clamp-3">
                        {s.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}

      {steps.length === 0 && (
        <p className="text-text-muted text-sm">
          No step data available — run may still be starting.
        </p>
      )}
    </div>
  );
}
