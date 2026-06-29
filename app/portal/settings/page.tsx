import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import PortalShell from "../_components/PortalShell";
import ProfileForm from "./_components/ProfileForm";
import PasswordChangeForm from "./_components/PasswordChangeForm";
import EmailChangeForm from "./_components/EmailChangeForm";

export const revalidate = 0;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h2 className="font-display font-semibold text-text-primary mb-5">{title}</h2>
      {children}
    </div>
  );
}

export default async function SettingsPage() {
  const [supabase, role, unreadMessages] = await Promise.all([
    createClient(),
    getUserRole(),
    getUnreadMessageCount(),
  ]);

  const { data: { user } } = await supabase.auth.getUser();

  const clientRecord = role === "client" && user
    ? (await supabase.from("clients").select("name, company_name, phone").eq("auth_user_id", user.id).single()).data
    : null;

  return (
    <PortalShell role={role} unreadMessages={unreadMessages}>
      <div className="p-8 max-w-xl">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-8">Einstellungen</h1>

        <div className="space-y-5">
          {/* Konto-Info */}
          <Section title="Konto">
            <div className="flex items-center gap-3 p-3 bg-bg rounded-xl border border-border">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-primary text-sm">
                  {(user?.email ?? "?").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-text-primary text-sm font-medium truncate">{user?.email}</p>
                <p className="font-mono text-[10px] text-text-muted">
                  {role === "admin" ? "Admin" : "Kunde"}
                </p>
              </div>
            </div>
            <EmailChangeForm currentEmail={user?.email ?? ""} />
          </Section>

          {/* Profil – nur für Clients */}
          {role === "client" && clientRecord && (
            <Section title="Profil">
              <ProfileForm
                name={clientRecord.name}
                companyName={clientRecord.company_name}
                phone={clientRecord.phone}
              />
            </Section>
          )}

          {/* Sicherheit */}
          <Section title="Sicherheit">
            <PasswordChangeForm />
          </Section>
        </div>
      </div>
    </PortalShell>
  );
}
