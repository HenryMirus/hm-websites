"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";
import { useAdminRole } from "@/lib/hooks/useAdminRole";

interface ContactSectionProps {
  lang: Lang;
}

export default function ContactSection({ lang }: ContactSectionProps) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAdminRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: window.location.href }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Serverfehler");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Senden. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all duration-200";

  return (
    <section id="contact" className="py-28 relative">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-5 gap-16">

          {/* Left info — 2/5 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <span className="tag">{getText(t.contact.tag, lang)}</span>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-text-primary mt-3 mb-4">
              <TypewriterText text={getText(t.contact.headline, lang)} delay={0.3} />
            </h2>
            <p className="text-text-dim text-lg leading-relaxed mb-10">
              {getText(t.contact.sub, lang)}
            </p>

            {/* Contact details */}
            <div className="space-y-4">
              <a
                href={`mailto:${t.contact.info.email}`}
                className="flex items-center gap-3 text-text-dim hover:text-primary transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M1 4l6 4.5L13 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">{t.contact.info.email}</span>
              </a>

              <div className="flex items-center gap-3 text-text-dim">
                <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1C4.79 1 3 2.79 3 5c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.2"/>
                    <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </div>
                <span className="text-sm">{getText(t.contact.info.location, lang)}</span>
              </div>

              <div className="flex items-center gap-3 text-text-dim">
                <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-sm">{getText(t.contact.info.response, lang)}</span>
              </div>
            </div>
          </motion.div>

          {/* Right form — 3/5 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-mono text-xs text-text-dim mb-2 tracking-wider uppercase">
                          {getText(t.contact.form.name, lang)}
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputClass}
                          placeholder="Max Mustermann"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-text-dim mb-2 tracking-wider uppercase">
                          {getText(t.contact.form.email, lang)}
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={inputClass}
                          placeholder="max@firma.de"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-text-dim mb-2 tracking-wider uppercase">
                        {getText(t.contact.form.company, lang)}
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className={inputClass}
                        placeholder="Muster GmbH"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-text-dim mb-2 tracking-wider uppercase">
                        {getText(t.contact.form.message, lang)}
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className={`${inputClass} resize-none`}
                        placeholder={getText(t.contact.form.messagePlaceholder, lang)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 transition-all duration-200 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 glow-primary"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          <span>
                            {getText(t.contact.form.sending, lang)}
                          </span>
                        </>
                      ) : (
                        <>
                          {getText(t.contact.form.submit, lang)}
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </>
                      )}
                    </button>

                    {error && isAdmin && (
                      <p className="text-sm text-red-400 text-center pt-1">{error}</p>
                    )}
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="py-16 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto glow-primary">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M5 14l6.5 6.5L23 8" stroke="#4F7FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-display font-semibold text-xl text-text-primary">
                      {getText(t.contact.form.success, lang)}
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
