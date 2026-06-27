import { getUserRole, requireAdmin } from "@/lib/auth/getRole";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import PortalShell from "../_components/PortalShell";
import AdminInviteForm from "./_components/AdminInviteForm";
import RemoveAdminButton from "./_components/RemoveAdminButton";

export const revalidate = 0;

export default async function AdminsPage() {
  await requireAdmin();
  const [role, supabase] = await Promise.all([getUserRole(), createClient()]);

  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  // Alle Admins aus profiles holen
  const { data: adminProfiles } = await admin
    .from("profiles")
    .select("id, created_at")
    .eq("role", "admin");

  // Auth-User-Daten für diese IDs laden
  const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const adminIds = new Set(adminProfiles?.map((p) => p.id) ?? []);
  const admins = users.filter((u) => adminIds.has(u.id));

  return (
    <PortalShell role={role}>
      <div className="p-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-2xl text-text-primary">Admins</h1>
          <span className="font-mono text-xs text-text-muted">{admins.length} gesamt</span>
        </div>

        {/* Bestehende Admins */}
        <div className="grid gap-3 mb-8">
          {admins.map((u) => (
            <div key={u.id} className="bg-surface border border-border rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                  <span className="font-display font-bold text-primary">
                    {(u.email ?? "?").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">{u.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] text-text-muted">
                      {u.last_sign_in_at
                        ? `Letzter Login: ${new Date(u.last_sign_in_at).toLocaleDateString("de-DE")}`
                        : "Noch nie eingeloggt"}
                    </span>
                    {!u.confirmed_at && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border bg-orange-500/10 text-orange-400 border-orange-500/20">
                        Einladung ausstehend
                      </span>
                    )}
                    {u.id === currentUser?.id && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border bg-primary/10 text-primary border-primary/20">
                        Du
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {u.id !== currentUser?.id && (
                <RemoveAdminButton userId={u.id} email={u.email ?? ""} />
              )}
            </div>
          ))}
        </div>

        {/* Neuen Admin einladen */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="font-display font-semibold text-text-primary mb-1">Admin einladen</h2>
          <p className="text-text-muted text-sm mb-5">
            Die Person bekommt eine Einladungs-E-Mail und erhält sofort Admin-Rechte.
          </p>
          <AdminInviteForm />
        </div>
      </div>
    </PortalShell>
  );
}
