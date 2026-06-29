"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#";

function useGlitch(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }
    let frame = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (i < frame / 3) return char;
            return char === " "
              ? " "
              : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );
      frame++;
      if (frame > text.length * 3) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [active, text]);

  return display;
}

export default function NotFound() {
  const [glitching, setGlitching] = useState(false);
  const heading = useGlitch("Seite nicht gefunden", glitching);

  useEffect(() => {
    const t = setTimeout(() => setGlitching(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-bg grid-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Noise overlay */}
      <div className="noise-overlay pointer-events-none" />

      <motion.div
        className="relative z-10 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Tag */}
        <motion.p
          className="tag mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          // status_code: 404
        </motion.p>

        {/* Large 404 */}
        <motion.div
          className="relative select-none mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        >
          <span
            className="font-display font-bold text-[clamp(7rem,22vw,14rem)] leading-none hero-gradient-text"
            aria-hidden
          >
            404
          </span>
          {/* Glitch shadow layers */}
          <span className="absolute inset-0 font-display font-bold text-[clamp(7rem,22vw,14rem)] leading-none text-accent/20 blur-[2px] translate-x-1 -translate-y-px select-none pointer-events-none">
            404
          </span>
          <span className="absolute inset-0 font-display font-bold text-[clamp(7rem,22vw,14rem)] leading-none text-primary/15 blur-[3px] -translate-x-1 translate-y-px select-none pointer-events-none">
            404
          </span>
        </motion.div>

        {/* Glitch heading */}
        <motion.h1
          className="font-display font-bold text-2xl sm:text-3xl text-text-primary mb-4 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {heading}
        </motion.h1>

        {/* Terminal box */}
        <motion.div
          className="bg-surface border border-border rounded-xl p-4 mb-8 text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
            <span className="w-3 h-3 rounded-full bg-accent/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-primary/60" />
            <span className="font-mono text-xs text-text-muted ml-2">terminal</span>
          </div>
          <div className="font-mono text-sm space-y-1">
            <p>
              <span className="text-primary">→</span>{" "}
              <span className="text-text-dim">GET</span>{" "}
              <span className="text-text-primary">{typeof window !== "undefined" ? window.location.pathname : "/..."}</span>
            </p>
            <p>
              <span className="text-accent">✗</span>{" "}
              <span className="text-text-dim">404 Not Found</span>
            </p>
            <p className="text-text-muted text-xs mt-2">
              Diese Seite existiert nicht oder wurde verschoben.
            </p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-display font-semibold text-sm hover:bg-primary-dark transition-colors duration-200 glow-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12L12 3l9 9" />
              <path d="M9 21V12h6v9" />
            </svg>
            Zurück zur Startseite
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-text-dim font-display font-semibold text-sm hover:border-primary/40 hover:text-text-primary transition-colors duration-200"
          >
            Kontakt aufnehmen
          </Link>
        </motion.div>

        {/* Logo bottom */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-2 opacity-40"
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
    </div>
  );
}
