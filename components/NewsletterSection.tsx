"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";

interface NewsletterSectionProps {
  lang: Lang;
}

export default function NewsletterSection({ lang }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section id="newsletter" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-surface border border-border rounded-2xl px-8 py-12 overflow-hidden">
          {/* Accent line top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {/* Glow blobs */}
          <div className="absolute -top-20 left-1/4 w-64 h-64 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
            {/* Left copy */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <span className="tag">{getText(t.newsletter.tag, lang)}</span>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-text-primary mt-3 mb-3 leading-tight">
                {getText(t.newsletter.headline, lang)}
              </h2>
              <p className="text-text-dim text-base leading-relaxed">
                {getText(t.newsletter.sub, lang)}
              </p>
            </motion.div>

            {/* Right form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 bg-bg border border-border rounded-xl px-5 py-4"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3 3 6-6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-text-primary font-medium">
                    {lang === "de" ? "Du bist dabei. Bis zur nächsten Ausgabe!" : "You're in. See you next week!"}
                  </span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  {/* Honeypot */}
                  <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={getText(t.newsletter.placeholder, lang)}
                    required
                    className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="shrink-0 bg-primary hover:bg-primary/90 transition-colors text-white font-semibold px-6 py-3 rounded-xl text-sm"
                  >
                    {getText(t.newsletter.cta, lang)}
                  </button>
                </form>
              )}
              <p className="font-mono text-[11px] text-text-muted mt-3">
                {getText(t.newsletter.note, lang)}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
