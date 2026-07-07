import { getAuditEvents } from "@/lib/os/queries";

export const revalidate = 15;

function EventRow({
  kind,
  at,
  data,
}: {
  kind: "run" | "step" | "approval";
  at: string;
  data: Record<string, unknown>;
}) {
  const kindColors = {
    run: "text-primary bg-primary/10 border-primary/20",
    step: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    approval: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  };

  let summary = "";
  if (kind === "run") {
    summary = `Run ${(data.id_text as string)?.slice(0, 14)} · ${data.pipeline} · ${data.status}`;
  } else if (kind === "step") {
    summary = `${data.agent} (${data.phase}) iter ${data.iteration} · ${data.status} · score ${(data.score as number)?.toFixed(2) ?? "—"}`;
  } else {
    summary = `${data.agent} · ${data.tool_name} · ${data.status}`;
  }

  return (
    <tr className="hover:bg-bg/30 transition-colors">
      <td className="px-4 py-2.5 w-28 shrink-0">
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-mono font-medium ${kindColors[kind]}`}
        >
          {kind}
        </span>
      </td>
      <td className="px-4 py-2.5 text-xs text-text-muted">{summary}</td>
      <td className="px-4 py-2.5 text-right text-xs text-text-dim whitespace-nowrap">
        {new Date(at).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
    </tr>
  );
}

export default async function AuditPage() {
  const events = await getAuditEvents(200);

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-text-primary mb-6">
        Audit Log
      </h1>

      {events.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-8 text-center text-text-muted">
          No events yet.
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-text-muted uppercase tracking-wider">
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Event</th>
                <th className="text-right px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((e, i) => (
                <EventRow key={i} kind={e.kind} at={e.at} data={e.data} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
