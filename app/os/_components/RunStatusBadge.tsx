export default function RunStatusBadge({
  status,
}: {
  status: "running" | "passed" | "failed" | "cancelled";
}) {
  const map = {
    running: "bg-primary/20 text-primary",
    passed: "bg-emerald-500/20 text-emerald-400",
    failed: "bg-accent/20 text-accent",
    cancelled: "bg-border text-text-muted",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${map[status] ?? map.cancelled}`}
    >
      {status}
    </span>
  );
}
