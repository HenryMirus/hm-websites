"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-sm text-white">H</span>
          </div>
          <span className="font-display font-bold text-lg text-text-primary">
            HM <span className="text-primary">AI</span>
            <span className="text-text-muted font-normal text-sm ml-2">Portal</span>
          </span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          {!sent ? (
            <>
              <h1 className="font-display font-bold text-2xl text-text-primary mb-1">
                Anmelden
              </h1>
              <p className="text-text-dim text-sm mb-6">
                Magic Link wird an Ihre E-Mail gesendet.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="henry@hm-ai.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
                />

                {error && (
                  <p className="text-accent text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : "Magic Link senden"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 10l4 4 10-10" stroke="#4F7FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-display font-bold text-xl text-text-primary mb-2">
                E-Mail gesendet!
              </h2>
              <p className="text-text-dim text-sm">
                Klicken Sie auf den Link in Ihrer E-Mail an{" "}
                <span className="text-primary">{email}</span>.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-text-muted text-xs mt-6 font-mono">
          Nur für autorisierte Nutzer · HM AI
        </p>
      </div>
    </div>
  );
}
