import { getBrainStats } from "@/lib/os/queries";
import StatCard from "../_components/StatCard";
import VaultGraph from "../_components/VaultGraph";

export const revalidate = 60;

const TYPE_COLORS: Record<string, string> = {
  reference: "bg-primary/20 text-primary",
  niche: "bg-purple-500/20 text-purple-400",
  tool: "bg-cyan-500/20 text-cyan-400",
  design: "bg-pink-500/20 text-pink-400",
  seo: "bg-yellow-500/20 text-yellow-400",
  dev: "bg-emerald-500/20 text-emerald-400",
  marketing: "bg-orange-500/20 text-orange-400",
  legal: "bg-red-500/20 text-red-400",
  tax: "bg-amber-500/20 text-amber-400",
  decision: "bg-indigo-500/20 text-indigo-400",
  lesson: "bg-teal-500/20 text-teal-400",
  project: "bg-violet-500/20 text-violet-400",
};

export default async function BrainPage() {
  const stats = await getBrainStats();
  const types = Object.entries(stats.by_type).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Brain
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Knowledge vault index — synced from{" "}
          <code className="font-mono bg-surface px-1 rounded">
            agent-os/brain/vault/
          </code>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <StatCard label="Total entries" value={stats.total} />
        <StatCard
          label="Avg confidence"
          value={
            stats.avg_confidence != null
              ? `${Math.round(stats.avg_confidence * 100)}%`
              : "—"
          }
        />
        <StatCard
          label="Needs review"
          value={stats.needs_review}
          accent={stats.needs_review > 0}
          sub="older than 30 days"
        />
      </div>

      {/* By type */}
      <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
        By Type
      </h2>
      {types.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-6 text-center text-text-muted">
          No knowledge entries yet. Run{" "}
          <code className="font-mono text-sm bg-bg px-1.5 py-0.5 rounded">
            npm run sync
          </code>{" "}
          in agent-os to populate the brain.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {types.map(([type, count]) => (
            <span
              key={type}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${TYPE_COLORS[type] ?? "bg-border text-text-muted"}`}
            >
              {type}
              <span className="font-mono opacity-70">{count}</span>
            </span>
          ))}
        </div>
      )}

      {/* Interactive vault graph (needs the local OS server) */}
      <div className="mt-10">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Graph
        </h2>
        <VaultGraph />
        <p className="mt-2 text-text-dim text-xs">
          Nodes are vault notes, edges are{" "}
          <code className="font-mono bg-surface px-1 rounded">[[wikilinks]]</code>.
          Click a node to edit the note inline. Prefer the desktop app? Open{" "}
          <code className="font-mono bg-surface px-1 rounded">
            agent-os/brain/vault/
          </code>{" "}
          as an Obsidian vault.
        </p>
      </div>
    </div>
  );
}
