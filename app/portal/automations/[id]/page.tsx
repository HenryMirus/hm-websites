import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, getUserRole } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import PortalShell from "@/app/portal/_components/PortalShell";
import { describeTrigger } from "@/lib/automations/describe";
import { STEPS } from "@/lib/automations/registry";
import type { Automation, AutomationRun } from "@/lib/automations/types";
import TestlaufButton from "../_components/TestlaufButton";

export const revalidate = 0;

const STATUS_BADGE: Record<string, string> = {
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  failed: "bg-accent/10 text-accent border-accent/20",
  skipped: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  running: "bg-primary/10 text-primary border-primary/25",
  pending: "bg-border text-text-dim border-border",
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AutomationDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const [supabase, role, unreadMessages] = await Promise.all([
    createClient(),
    getUserRole(),
    getUnreadMessageCount(),
  ]);

  const [{ data: automation }, { data: runs }] = await Promise.all([
    supabase.from("automations").select("*").eq("id", params.id).single(),
    supabase
      .from("automation_runs")
      .select("*")
      .eq("automation_id", params.id)
      .order("started_at", { ascending: false })
      .limit(30),
  ]);

  if (!automation) notFound();

  const a = automation as Automation;
  const runList = (runs ?? []) as AutomationRun[];

  return (
    <PortalShell role={role} unreadMessages={unreadMessages}>
      <div className="p-8 max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Link href="/portal/automations" className="text-text-muted hover:text-text-primary text-sm transition-colors">
                ← Automationen
              </Link>
            </div>
            <h1 className="font-display text-2xl font-bold text-text-primary">{a.name}</h1>
            {a.description && (
              <p className="text-text-dim text-sm mt-1">{a.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/portal/automations/${a.id}/edit`}
              className="text-sm text-text-dim hover:text-text-primary border border-border rounded-xl px-4 py-2.5 transition-colors"
            >
              Bearbeiten
            </Link>
          </div>
        </div>

        {/* Info-Karten */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-surface border border-border rounded-2xl p-4">
            <p className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-1">Status</p>
            <p className={`text-sm font-semibold ${a.enabled ? "text-green-400" : "text-text-muted"}`}>
              {a.enabled ? "Aktiv" : "Inaktiv"}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-4">
            <p className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-1">Letzter Run</p>
            <p className="text-sm text-text-primary">{fmt(a.last_run_at)}</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-4">
            <p className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-1">Letzter Status</p>
            {a.last_run_status ? (
              <span className={`inline-flex font-mono text-[11px] px-1.5 py-0.5 rounded border ${STATUS_BADGE[a.last_run_status] ?? "bg-border text-text-dim border-border"}`}>
                {a.last_run_status}
              </span>
            ) : (
              <p className="text-sm text-text-muted">—</p>
            )}
          </div>
        </div>

        {/* Trigger & Schritte */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Trigger</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <p className="text-sm text-text-primary">{describeTrigger(a.trigger)}</p>
          {a.is_system && (
            <span className="font-mono text-[10px] text-text-muted border border-border rounded px-1.5 py-0.5">
              System-Automation
            </span>
          )}

          <div className="flex items-center gap-2 pt-2">
            <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Schritte</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          {a.steps.length === 0 ? (
            <p className="text-sm text-text-muted">Keine Schritte konfiguriert.</p>
          ) : (
            <ol className="space-y-2">
              {a.steps.map((step, i) => {
                const def = STEPS.find((s) => s.type === step.type);
                return (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="font-mono text-[11px] text-text-muted mt-0.5 w-4 shrink-0">{i + 1}.</span>
                    <div>
                      <span className="font-medium text-text-primary">
                        {def?.icon} {def?.label ?? step.type}
                      </span>
                      {step.config?.templateKey && (
                        <span className="ml-2 font-mono text-[11px] text-text-muted">
                          [{step.config.templateKey}]
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Testlauf */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Testlauf</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <p className="text-sm text-text-dim mb-4">
            Führt die Automation einmalig mit dem ersten verfügbaren Kunden/Projekt aus (ohne Idempotenz-Sperre).
          </p>
          <TestlaufButton id={a.id} />
        </div>

        {/* Run-History */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Run-Verlauf</span>
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] text-text-muted">{runList.length} Einträge</span>
          </div>

          {runList.length === 0 ? (
            <p className="text-sm text-text-muted">Noch keine Runs vorhanden.</p>
          ) : (
            <div className="space-y-2">
              {runList.map((run) => (
                <div key={run.id} className="border border-border rounded-xl p-4 bg-bg/40">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded border ${STATUS_BADGE[run.status] ?? "bg-border text-text-dim border-border"}`}>
                      {run.status}
                    </span>
                    {run.is_test && (
                      <span className="font-mono text-[10px] text-text-muted border border-border rounded px-1.5 py-0.5">
                        Test
                      </span>
                    )}
                    <span className="text-xs text-text-dim">{fmt(run.started_at)}</span>
                    {run.finished_at && (
                      <span className="text-xs text-text-muted">
                        → {fmt(run.finished_at)}
                      </span>
                    )}
                    {run.dedupe_key && (
                      <span className="font-mono text-[10px] text-text-muted ml-auto">
                        key: {run.dedupe_key}
                      </span>
                    )}
                  </div>
                  {run.error && (
                    <p className="text-xs text-accent mt-2 font-mono">{run.error}</p>
                  )}
                  {run.steps_result && run.steps_result.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {run.steps_result.map((sr, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            sr.status === "success"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : sr.status === "failed"
                              ? "bg-accent/10 text-accent border-accent/20"
                              : "bg-border text-text-muted border-border"
                          }`}
                          title={sr.detail ?? sr.error ?? ""}
                        >
                          {sr.type}: {sr.status}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
