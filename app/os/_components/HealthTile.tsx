import type { HealthCheck } from "@/lib/os/types";

export default function HealthTile({ check }: { check: HealthCheck }) {
  const colors = {
    ok: "text-emerald-400",
    error: "text-accent",
    unconfigured: "text-text-muted",
  };
  const dots = {
    ok: "bg-emerald-400",
    error: "bg-accent",
    unconfigured: "bg-text-muted",
  };
  return (
    <div className="bg-surface border border-border rounded-lg px-4 py-3 flex items-center gap-3 min-w-[160px]">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${dots[check.status]}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary truncate">{check.name}</p>
        <p className={`text-xs ${colors[check.status]}`}>
          {check.status === "ok"
            ? `${check.latency_ms}ms`
            : check.detail ?? check.status}
        </p>
      </div>
    </div>
  );
}
