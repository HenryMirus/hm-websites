import { getRuns } from "@/lib/os/queries";
import RunStatusBadge from "../_components/RunStatusBadge";
import ScoreBar from "../_components/ScoreBar";
import Link from "next/link";

export const revalidate = 15;

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function RunsPage() {
  const runs = await getRuns(50);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-display font-bold text-2xl text-text-primary mb-6">
        Pipeline Runs
      </h1>

      {runs.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-8 text-center text-text-muted">
          No runs yet. Start one with{" "}
          <code className="font-mono text-sm bg-bg px-1.5 py-0.5 rounded">
            npm run os -- build "…" --target &lt;dir&gt;
          </code>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-text-muted uppercase tracking-wider">
                <th className="text-left px-4 py-3">Run ID</th>
                <th className="text-left px-4 py-3">Pipeline</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Score</th>
                <th className="text-right px-4 py-3">Cost</th>
                <th className="text-right px-4 py-3">Iters</th>
                <th className="text-right px-4 py-3">Started</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {runs.map((run) => (
                <tr
                  key={run.id}
                  className="hover:bg-bg/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/os/runs/${run.id_text}`}
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      {run.id_text.slice(0, 18)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-muted text-xs truncate max-w-[140px]">
                    {run.pipeline}
                  </td>
                  <td className="px-4 py-3">
                    <RunStatusBadge status={run.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBar score={run.final_score} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-text-muted">
                    {run.total_cost_usd != null
                      ? `$${run.total_cost_usd.toFixed(4)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-text-muted">
                    {run.iterations ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-text-muted">
                    {relTime(run.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
