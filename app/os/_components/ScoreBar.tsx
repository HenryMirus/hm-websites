export default function ScoreBar({ score }: { score: number | null }) {
  if (score === null) return <span className="text-text-muted text-xs">—</span>;
  const pct = Math.round(score * 100);
  const color =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 50
      ? "bg-yellow-500"
      : "bg-accent";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-text-muted">{score.toFixed(2)}</span>
    </div>
  );
}
