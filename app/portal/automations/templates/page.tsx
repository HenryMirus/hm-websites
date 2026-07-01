import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, getUserRole } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import PortalShell from "@/app/portal/_components/PortalShell";

export const revalidate = 0;

export default async function EmailTemplatesPage() {
  await requireAdmin();
  const [supabase, role, unreadMessages] = await Promise.all([
    createClient(),
    getUserRole(),
    getUnreadMessageCount(),
  ]);

  const { data: templates } = await supabase
    .from("email_templates")
    .select("key, name, subject, updated_at")
    .order("name");

  return (
    <PortalShell role={role} unreadMessages={unreadMessages}>
      <div className="p-8 max-w-3xl">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <div className="mb-1">
              <Link href="/portal/automations" className="text-text-muted hover:text-text-primary text-sm transition-colors">
                ← Automationen
              </Link>
            </div>
            <h1 className="font-display text-2xl font-bold text-text-primary">E-Mail-Templates</h1>
            <p className="text-text-dim text-sm mt-1">
              Betreff, Überschriften und Inhalte der automatisierten Mails bearbeiten.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {(templates ?? []).map((t) => (
            <Link
              key={t.key}
              href={`/portal/automations/templates/${t.key}`}
              className="block bg-surface border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-text-primary group-hover:text-primary transition-colors truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5 truncate">{t.subject}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[10px] text-text-muted border border-border rounded px-1.5 py-0.5">
                    {t.key}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-muted group-hover:text-primary transition-colors">
                    <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
          {(templates ?? []).length === 0 && (
            <p className="text-text-muted text-sm">Keine Templates gefunden.</p>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
