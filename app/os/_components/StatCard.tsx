export default function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-1">
      <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
      <p
        className={`text-2xl font-display font-bold ${accent ? "text-accent" : "text-text-primary"}`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-text-muted">{sub}</p>}
    </div>
  );
}
