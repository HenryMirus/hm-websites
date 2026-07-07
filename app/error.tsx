"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAdminRole } from "@/lib/hooks/useAdminRole";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const { isAdmin, checked } = useAdminRole();

  useEffect(() => {
    if (isAdmin) console.error("[HM Labs] Runtime error:", error);
  }, [error, isAdmin]);

  return (
    <div className="min-h-screen bg-bg grid-bg flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="noise-overlay pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">

        {/* ── Left: public error message ── */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.p
            className="tag mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            // status_code: 500
          </motion.p>

          <motion.div
            className="relative select-none mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          >
            <span
              className="font-display font-bold text-[clamp(6rem,18vw,11rem)] leading-none text-accent/80"
              aria-hidden
            >
              500
            </span>
            <span className="absolute inset-0 font-display font-bold text-[clamp(6rem,18vw,11rem)] leading-none text-accent/15 blur-[3px] translate-x-1 select-none pointer-events-none">
              500
            </span>
          </motion.div>

          <motion.h1
            className="font-display font-bold text-2xl sm:text-3xl text-text-primary mb-4 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Etwas ist schiefgelaufen
          </motion.h1>

          <motion.p
            className="text-text-dim text-base mb-8 max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            Ein unerwarteter Fehler ist aufgetreten. Das passiert selten — meist hilft ein einfaches Neuladen.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-display font-semibold text-sm hover:bg-accent/80 transition-colors duration-200"
              style={{ boxShadow: "0 0 40px rgba(255,77,106,0.2)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Erneut versuchen
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-text-dim font-display font-semibold text-sm hover:border-primary/40 hover:text-text-primary transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12L12 3l9 9" />
                <path d="M9 21V12h6v9" />
              </svg>
              Startseite
            </Link>
          </motion.div>

          <motion.div
            className="mt-16 flex items-center justify-center lg:justify-start gap-2 opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.8 }}
          >
            <picture>
              <source srcSet="/hm-labs-logo-v3.webp" type="image/webp" />
              <img src="/hm-labs-logo-v3.png" alt="HM Labs" width={24} height={24} className="rounded-md" />
            </picture>
            <span className="font-display font-bold text-text-primary text-sm">
              HM <span className="text-primary">Labs</span>
            </span>
          </motion.div>
        </motion.div>

        {/* ── Right: admin-only error details ── */}
        <AnimatePresence>
          {checked && isAdmin && (
            <motion.aside
              key="admin-panel"
              className="w-full lg:w-[420px] shrink-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            >
              <div className="bg-surface border border-accent/25 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-accent/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                    <span className="font-mono text-xs text-accent font-medium tracking-widest uppercase">
                      Admin — Error Details
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4 font-mono text-xs max-h-[70vh] overflow-y-auto">
                  {/* Error name + message */}
                  <div>
                    <p className="text-text-muted mb-1 uppercase tracking-widest text-[10px]">Error</p>
                    <p className="text-accent font-medium">{error.name}</p>
                    <p className="text-text-primary mt-1 leading-relaxed whitespace-pre-wrap break-all">
                      {error.message}
                    </p>
                  </div>

                  {/* Digest */}
                  {error.digest && (
                    <div className="border-t border-border pt-4">
                      <p className="text-text-muted mb-1 uppercase tracking-widest text-[10px]">Digest</p>
                      <p className="text-primary">{error.digest}</p>
                    </div>
                  )}

                  {/* Stack trace */}
                  {error.stack && (
                    <div className="border-t border-border pt-4">
                      <p className="text-text-muted mb-2 uppercase tracking-widest text-[10px]">Stack Trace</p>
                      <pre className="text-text-dim leading-relaxed whitespace-pre-wrap break-all text-[10px] bg-bg/60 rounded-lg p-3 border border-border">
                        {error.stack}
                      </pre>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="border-t border-border pt-4">
                    <p className="text-text-muted mb-1 uppercase tracking-widest text-[10px]">Timestamp</p>
                    <p className="text-text-dim">{new Date().toISOString()}</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
