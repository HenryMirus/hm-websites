import { getAllApprovals } from "@/lib/os/queries";
import ApprovalButtons from "../_components/ApprovalButtons";
import Link from "next/link";

export const revalidate = 0;

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    rejected: "bg-accent/15 text-accent border-accent/20",
    timed_out: "bg-border text-text-muted border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium ${map[status] ?? map.timed_out}`}
    >
      {status}
    </span>
  );
}

export default async function ApprovalsPage() {
  const approvals = await getAllApprovals(100);
  const pending = approvals.filter((a) => a.status === "pending");
  const resolved = approvals.filter((a) => a.status !== "pending");

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Approval Queue
        </h1>
        {pending.length > 0 && (
          <p className="text-accent text-sm mt-1">
            {pending.length} pending — the local runner is waiting for your
            decision.
          </p>
        )}
      </div>

      {/* Pending */}
      {pending.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-6 text-center text-text-muted mb-8">
          No pending approvals. Queue is clear.
        </div>
      ) : (
        <div className="space-y-4 mb-10">
          {pending.map((a) => (
            <div
              key={a.id}
              className="bg-surface border border-yellow-500/20 rounded-lg p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={a.status} />
                  <span className="text-xs font-mono text-primary">
                    {a.agent}
                  </span>
                  <span className="text-xs text-text-muted">·</span>
                  <span className="text-xs text-text-muted">{a.tool_name}</span>
                  <span className="text-xs text-text-muted">·</span>
                  <Link
                    href={`/os/runs/${a.run_id_text}`}
                    className="text-xs text-text-dim hover:text-primary transition-colors font-mono"
                  >
                    {a.run_id_text.slice(0, 14)}
                  </Link>
                </div>
                <ApprovalButtons approvalId={a.id} />
              </div>

              <p className="text-sm text-text-primary mb-2">{a.description}</p>

              <details className="text-xs">
                <summary className="cursor-pointer text-text-dim hover:text-text-muted select-none">
                  Tool input
                </summary>
                <pre className="mt-2 bg-bg rounded p-3 overflow-auto text-text-muted font-mono text-[11px] max-h-48">
                  {JSON.stringify(a.tool_input, null, 2)}
                </pre>
              </details>

              <p className="text-xs text-text-dim mt-2">
                Iteration {a.iteration} · {a.phase} ·{" "}
                {new Date(a.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <>
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Recently resolved
          </h2>
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Agent · Tool</th>
                  <th className="text-left px-4 py-2">Description</th>
                  <th className="text-right px-4 py-2">Decided</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {resolved.slice(0, 30).map((a) => (
                  <tr key={a.id} className="hover:bg-bg/30 transition-colors">
                    <td className="px-4 py-2">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-2 font-mono text-text-muted">
                      {a.agent} · {a.tool_name}
                    </td>
                    <td className="px-4 py-2 text-text-muted max-w-[260px] truncate">
                      {a.description}
                    </td>
                    <td className="px-4 py-2 text-right text-text-dim">
                      {a.decided_at
                        ? new Date(a.decided_at).toLocaleTimeString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
