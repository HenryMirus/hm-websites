import { getUserRole, requireAdmin } from "@/lib/auth/getRole";
import { createClient } from "@/lib/supabase/server";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import PortalShell from "../_components/PortalShell";
import ApiKeyCreateForm from "./_components/ApiKeyCreateForm";
import RevokeKeyButton from "./_components/RevokeKeyButton";

export const revalidate = 0;

export default async function ApiKeysPage() {
  await requireAdmin();
  const [supabase, role, unreadMessages] = await Promise.all([createClient(), getUserRole(), getUnreadMessageCount()]);

  const { data: keys } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, created_at, last_used_at, revoked_at")
    .order("created_at", { ascending: false });

  const active = keys?.filter((k) => !k.revoked_at) ?? [];
  const revoked = keys?.filter((k) => k.revoked_at) ?? [];

  return (
    <PortalShell role={role} unreadMessages={unreadMessages}>
      <div className="p-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-text-primary">API-Keys</h1>
            <p className="text-text-muted text-sm mt-1">
              Zur Authentifizierung bei <code className="font-mono text-xs bg-bg border border-border px-1.5 py-0.5 rounded">POST /api/v1/clients</code>
            </p>
          </div>
        </div>

        {/* Usage hint */}
        <div className="bg-bg border border-border rounded-xl p-4 mb-8 font-mono text-xs text-text-dim">
          <p className="text-text-muted mb-2">Verwendung:</p>
          <p>curl -X POST https://clients.hm-labs.de/api/v1/clients \</p>
          <p className="pl-4">-H &quot;Authorization: Bearer hm_live_...&quot; \</p>
          <p className="pl-4">-H &quot;Content-Type: application/json&quot; \</p>
          <p className="pl-4">-d &apos;&#123;&quot;name&quot;:&quot;Max&quot;,&quot;email&quot;:&quot;max@firma.de&quot;&#125;&apos;</p>
        </div>

        {/* Aktive Keys */}
        {active.length > 0 && (
          <section className="mb-8">
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-3">
              Aktiv ({active.length})
            </p>
            <div className="space-y-3">
              {active.map((key) => (
                <div key={key.id} className="bg-surface border border-border rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{key.name}</p>
                    <p className="font-mono text-xs text-text-muted mt-0.5">
                      {key.key_prefix}••••••••••••••••••••••••••••••••••••••••••••••••
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="font-mono text-[10px] text-text-muted">
                        Erstellt {new Date(key.created_at).toLocaleDateString("de-DE")}
                      </span>
                      {key.last_used_at && (
                        <span className="font-mono text-[10px] text-text-muted">
                          · Zuletzt genutzt {new Date(key.last_used_at).toLocaleDateString("de-DE")}
                        </span>
                      )}
                      {!key.last_used_at && (
                        <span className="font-mono text-[10px] text-text-muted">· Noch nie genutzt</span>
                      )}
                    </div>
                  </div>
                  <RevokeKeyButton id={key.id} name={key.name} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Neuen Key erstellen */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-display font-semibold text-text-primary mb-1">Neuen Key erstellen</h2>
          <p className="text-text-muted text-sm mb-5">
            Der vollständige Key wird nur einmal angezeigt — danach nur noch das Präfix.
          </p>
          <ApiKeyCreateForm />
        </div>

        {/* Widerrufene Keys */}
        {revoked.length > 0 && (
          <section>
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-3">
              Widerrufen ({revoked.length})
            </p>
            <div className="space-y-2">
              {revoked.map((key) => (
                <div key={key.id} className="bg-surface/50 border border-border/50 rounded-xl p-4 opacity-50">
                  <p className="text-text-muted text-sm line-through">{key.name}</p>
                  <p className="font-mono text-[10px] text-text-muted mt-0.5">
                    Widerrufen {new Date(key.revoked_at!).toLocaleDateString("de-DE")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!keys?.length && (
          <p className="text-center text-text-muted text-sm py-10">Noch keine API-Keys vorhanden.</p>
        )}
      </div>
    </PortalShell>
  );
}
