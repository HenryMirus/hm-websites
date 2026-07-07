import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyRecoveryToken } from "@/lib/auth/recoveryToken";
import UpdatePasswordForm from "./_components/UpdatePasswordForm";

export default async function UpdatePasswordPage() {
  // Session prüfen
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Recovery-Cookie prüfen — ohne gültigen signierten Token wird die Seite verweigert
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("sb_recovery")?.value;
  const isValidRecovery = !!rawToken && verifyRecoveryToken(rawToken, user.id);

  if (!isValidRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-10 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-sm text-white">H</span>
            </div>
            <span className="font-display font-bold text-lg text-text-primary">
              HM <span className="text-primary">Labs</span>
              <span className="text-text-muted font-normal text-sm ml-2">Portal</span>
            </span>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L2 17h16L10 2z" stroke="#FF4D6A" strokeWidth="1.5" strokeLinejoin="round" />
                <line x1="10" y1="8" x2="10" y2="12" stroke="#FF4D6A" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="14.5" r="0.75" fill="#FF4D6A" />
              </svg>
            </div>
            <h1 className="font-display font-bold text-xl text-text-primary mb-2">
              Link ungültig oder abgelaufen
            </h1>
            <p className="text-text-dim text-sm mb-6">
              Der Reset-Link ist entweder abgelaufen (15 Minuten) oder wurde bereits
              verwendet. Bitte fordere einen neuen an.
            </p>
            <a
              href="/login"
              className="inline-block w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Zurück zum Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-sm text-white">H</span>
          </div>
          <span className="font-display font-bold text-lg text-text-primary">
            HM <span className="text-primary">Labs</span>
            <span className="text-text-muted font-normal text-sm ml-2">Portal</span>
          </span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8.5l3.5 3.5 8-8" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-text-primary leading-tight">
                Neues Passwort festlegen
              </h1>
              <p className="text-text-dim text-xs mt-0.5">
                Verifiziert als <span className="text-primary font-mono">{user.email}</span>
              </p>
            </div>
          </div>

          <UpdatePasswordForm userEmail={user.email ?? ""} />
        </div>

        <p className="text-center text-text-muted text-xs mt-6 font-mono">
          Dieser Link ist 15 Minuten gültig · Einmalig verwendbar
        </p>
      </div>
    </div>
  );
}
