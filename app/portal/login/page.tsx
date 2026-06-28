"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "./_actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pw") === "changed") {
      setSuccessMsg("Passwort erfolgreich geändert. Du kannst Dich jetzt einloggen.");
    }
    if (params.get("error") === "exchange_failed") {
      setError("Der Reset-Link ist abgelaufen oder wurde bereits verwendet. Bitte fordere einen neuen an.");
      setForgotMode(true);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (err) {
      setError("E-Mail oder Passwort falsch.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const result = await requestPasswordReset(email);

    if (result.error) {
      setError(result.error);
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
            HM <span className="text-primary">Labs</span>
            <span className="text-text-muted font-normal text-sm ml-2">Portal</span>
          </span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 10l4 4 10-10" stroke="#4F7FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-display font-bold text-xl text-text-primary mb-2">E-Mail gesendet!</h2>
              <p className="text-text-dim text-sm">
                Klicke auf den Link in Deiner E-Mail an{" "}
                <span className="text-primary">{email}</span>, um ein neues Passwort zu setzen.
              </p>
              <button
                onClick={() => { setSent(false); setForgotMode(false); }}
                className="mt-5 text-sm text-primary hover:underline"
              >
                Zurück zum Login
              </button>
            </div>
          ) : forgotMode ? (
            <>
              <h1 className="font-display font-bold text-2xl text-text-primary mb-1">
                Passwort zurücksetzen
              </h1>
              <p className="text-text-dim text-sm mb-6">
                Gib Deine E-Mail ein — wir schicken Dir einen Reset-Link.
              </p>
              <form onSubmit={handleForgot} className="space-y-4">
                <input
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
                />
                {error && (
                  <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : "Reset-Link senden"}
                </button>
                <button
                  type="button"
                  onClick={() => { setForgotMode(false); setError(""); }}
                  className="w-full text-sm text-text-muted hover:text-text-dim transition-colors"
                >
                  Zurück zum Login
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-display font-bold text-2xl text-text-primary mb-1">
                Anmelden
              </h1>
              <p className="text-text-dim text-sm mb-6">
                Melde Dich mit Deiner E-Mail und Deinem Passwort an.
              </p>

              {successMsg && (
                <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-2">
                  {successMsg}
                </p>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
                />
                <input
                  type="password"
                  placeholder="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
                />

                {error && (
                  <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim() || !password}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : "Anmelden"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setForgotMode(true); setError(""); }}
                    className="text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    Passwort vergessen?
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-text-muted text-xs mt-6 font-mono">
          Nur für autorisierte Nutzer · HM Labs
        </p>
      </div>
    </div>
  );
}
