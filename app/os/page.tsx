import { getRunStats, getLatestUsageSnapshots } from "@/lib/os/queries";
import { getHealthChecks } from "@/lib/os/health";
import StatCard from "./_components/StatCard";
import UsageWindows from "./_components/UsageWindows";
import HealthTile from "./_components/HealthTile";
import Link from "next/link";

export const revalidate = 30;

function fmt(usd: number) {
  return usd < 0.01 ? "<$0.01" : `$${usd.toFixed(4)}`;
}

export default async function OsOverviewPage() {
  const [stats, usage, health] = await Promise.all([
    getRunStats(),
    getLatestUsageSnapshots(),
    getHealthChecks(),
  ]);

  const passRate =
    stats.total > 0
      ? Math.round(((stats.passed / (stats.total - stats.running)) * 100) || 0)
      : 0;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Overview
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Agent OS observability dashboard
        </p>
      </div>

      {/* Run stats */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Pipeline Runs
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Runs" value={stats.total} />
          <StatCard
            label="Pass Rate"
            value={`${passRate}%`}
            sub={`${stats.passed} passed · ${stats.failed} failed`}
          />
          <StatCard
            label="Running"
            value={stats.running}
            accent={stats.running > 0}
          />
          <StatCard
            label="Pending Approvals"
            value={stats.pending_approvals}
            accent={stats.pending_approvals > 0}
            sub={
              stats.pending_approvals > 0
                ? "Action required"
                : "All clear"
            }
          />
        </div>
      </section>

      {/* Cost */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          API Cost (USD)
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Today"
            value={fmt(stats.cost_today)}
            sub="since midnight"
          />
          <StatCard label="Last 7 days" value={fmt(stats.cost_7d)} />
          <StatCard label="All time" value={fmt(stats.cost_all)} />
        </div>
      </section>

      {/* Claude usage */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Claude Subscription Usage
        </h2>
        <UsageWindows snapshots={usage} />
        <p className="text-xs text-text-dim mt-2">
          Run{" "}
          <code className="font-mono bg-surface px-1 py-0.5 rounded">
            npm run export-usage
          </code>{" "}
          locally to refresh.
        </p>
      </section>

      {/* Integration health */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Integration Health
          </h2>
          <Link
            href="/os/integrations"
            className="text-xs text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {health.map((h) => (
            <HealthTile key={h.name} check={h} />
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Quick Links
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/os/runs", label: "View runs" },
            { href: "/os/approvals", label: "Approval queue" },
            { href: "/os/brain", label: "Brain stats" },
            { href: "/os/audit", label: "Audit log" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 bg-surface border border-border text-text-muted text-sm rounded-lg hover:border-primary/40 hover:text-text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
