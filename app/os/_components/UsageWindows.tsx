import type { UsageSnapshot } from "@/lib/os/types";

function Ring({ pct }: { pct: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 80 ? "#FF4D6A" : pct >= 60 ? "#F59E0B" : "#4F7FFF";
  return (
    <svg width="56" height="56" className="-rotate-90">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#1E1E2E" strokeWidth="5" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

function WindowTile({
  label,
  snap,
}: {
  label: string;
  snap: UsageSnapshot | null;
}) {
  if (!snap) {
    return (
      <div className="bg-surface border border-border rounded-lg p-4 flex flex-col items-center gap-2 min-w-[140px]">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-xs text-text-dim text-center">
          No data — run export-usage
        </p>
      </div>
    );
  }
  const pct = snap.pct ?? 0;
  const usedM = (snap.used / 1_000_000).toFixed(1);
  const limitM = snap.limit_total
    ? (snap.limit_total / 1_000_000).toFixed(0)
    : null;
  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col items-center gap-2 min-w-[140px]">
      <p className="text-xs text-text-muted">{label}</p>
      <div className="relative">
        <Ring pct={pct} />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-text-primary">
          {pct}%
        </span>
      </div>
      <p className="text-xs text-text-muted font-mono">
        {usedM}M{limitM ? ` / ${limitM}M` : ""}
      </p>
      <p className="text-[10px] text-text-dim">
        {new Date(snap.captured_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

export default function UsageWindows({
  snapshots,
}: {
  snapshots: Record<"5h" | "weekly", UsageSnapshot | null>;
}) {
  return (
    <div className="flex gap-3">
      <WindowTile label="5-hour window" snap={snapshots["5h"]} />
      <WindowTile label="Weekly" snap={snapshots.weekly} />
    </div>
  );
}
