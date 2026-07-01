import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, getUserRole } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import PortalShell from "@/app/portal/_components/PortalShell";
import { describeTrigger } from "@/lib/automations/describe";
import type { Automation } from "@/lib/automations/types";
import EnabledToggle from "./_components/EnabledToggle";
import DeleteAutomationButton from "./_components/DeleteAutomationButton";
import RunTickButton from "./_components/RunTickButton";

export const revalidate = 0;

const STATUS_BADGE: Record<string, string> = {
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  failed: "bg-accent/10 text-accent border-accent/20",
  skipped: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  running: "bg-primary/10 text-primary border-primary/25",
};

export default async function AutomationsPage() {
  await requireAdmin();
  const [supabase, role, unreadMessages] = await Promise.all([
    createClient(),
    getUserRole(),
    getUnreadMessageCount(),
  ]);

  const { data } = await supabase
    .from("automations")
    .select("*")
    .order("is_system", { ascending: false })
    .order("created_at", { ascending: true });
  const automations = (data ?? []) as Automation[];

  return (
    <PortalShell role={role} unreadMessages={unreadMessages}>
      <div className="p-8 max-w-5xl">
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">Automationen</h1>
            <p className="text-text-dim text-sm mt-1">
              Wiederkehrende Workflows: E-Mails, Cron-Jobs, Hooks &amp; Skripte.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/portal/automations/templates"
              className="text-sm text-text-dim hover:text-text-primary border border-border rounded-xl px-4 py-2.5 transition-colors"
            >
              E-Mail-Templates
            </Link>
            <RunTickButton />
            <Link
              href="/portal/automations/new"
              className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              + Neue Automation
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {automations.length === 0 && (
            <p className="text-text-muted text-sm">Noch keine Automationen angelegt.</p>
          )}
          {automations.map((a) => (
            <div
              key={a.id}
              className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/portal/automations/${a.id}`}
                    className="font-medium text-text-primary hover:text-primary transition-colors truncate"
                  >
                    {a.name}
                  </Link>
                  {a.is_system && (
                    <span className="font-mono text-[10px] text-text-muted border border-border rounded px-1.5 py-0.5">
                      System
                    </span>
                  )}
                  {a.last_run_status && (
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                        STATUS_BADGE[a.last_run_status] ?? "bg-border text-text-dim border-border"
                      }`}
                    >
                      {a.last_run_status}
                    </span>
                  )}
                </div>
                <p className="text-text-muted text-xs mt-1 truncate">
                  {describeTrigger(a.trigger)} · {a.steps?.length ?? 0} Schritt(e)
                </p>
              </div>

              <EnabledToggle id={a.id} enabled={a.enabled} />
              <Link
                href={`/portal/automations/${a.id}/edit`}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg transition-colors"
                title="Bearbeiten"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.5 2.5l2 2L6 12l-3 1 1-3 7.5-7.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <DeleteAutomationButton id={a.id} name={a.name} isSystem={a.is_system} />
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
