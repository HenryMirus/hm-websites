"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";

interface HeroProps {
  lang: Lang;
  onOpenWizard: () => void;
}

export default function HeroSection({ lang, onOpenWizard }: HeroProps) {
  const [line2Active, setLine2Active] = useState(false);
  const [line3Active, setLine3Active] = useState(false);

  // Mouse glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 120 });
  const glow = useMotionTemplate`radial-gradient(650px circle at ${springX}px ${springY}px, rgba(79,127,255,0.07), transparent 55%)`;

  // Parallax blobs
  const { scrollY } = useScroll();
  const blob1Y = useTransform(scrollY, [0, 700], [0, -100]);
  const blob2Y = useTransform(scrollY, [0, 700], [0, 70]);
  const blob3Y = useTransform(scrollY, [0, 700], [0, -50]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const stats = [
    {
      val: getText(t.hero.stat1val, lang),
      label: getText(t.hero.stat1, lang),
    },
    {
      val: getText(t.hero.stat2val, lang),
      label: getText(t.hero.stat2, lang),
    },
    {
      val: getText(t.hero.stat3val, lang),
      label: getText(t.hero.stat3, lang),
    },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-bg"
      onMouseMove={handleMouseMove}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg" />

      {/* Mouse-tracking glow */}
      <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: glow }} />

      {/* ── Right-half full-bleed image (absolute, behind content) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.1 }}
        className="absolute top-0 right-0 bottom-0 w-[52%] hidden lg:block pointer-events-none"
        style={{ y: blob1Y }}
      >
        <picture className="absolute inset-0">
          <source srcSet="/hero-bg.webp" type="image/webp" />
          <img src="/hero-bg.jpg" alt="" aria-hidden className="w-full h-full object-cover object-center" />
        </picture>
        {/* Left gradient fade — blends image into page bg */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent" />
        {/* Top & bottom fades */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-bg to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg to-transparent" />
        {/* Primary colour tint */}
        <div className="absolute inset-0 bg-primary/8 mix-blend-multiply" />
      </motion.div>

      {/* Parallax gradient blobs (stay on top of image) */}
      <motion.div style={{ y: blob2Y }} className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <motion.div style={{ y: blob3Y }} className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Floating metric badges — positioned over image area */}
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute top-32 right-8 hidden lg:block bg-bg/75 backdrop-blur-md border border-border rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/60 z-10"
      >
        <div className="font-display font-bold text-3xl text-accent">+32%</div>
        <div className="font-mono text-[11px] text-text-dim mt-0.5">
          {getText(t.hero.floating.stat1Label, lang)}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.45 }}
        className="absolute bottom-24 right-16 hidden lg:block bg-bg/75 backdrop-blur-md border border-border rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/60 z-10"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
          <span className="font-mono text-[10px] text-green-400/80">
            {getText(t.hero.floating.live, lang)}
          </span>
        </div>
        <div className="font-display font-bold text-xl text-primary">{getText(t.hero.floating.avgVal, lang)}</div>
        <div className="font-mono text-[11px] text-text-muted">
          {getText(t.hero.floating.avg, lang)}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1.65 }}
        className="absolute top-1/2 -translate-y-1/2 right-6 hidden xl:block bg-bg/65 backdrop-blur-md border border-primary/20 rounded-xl px-3.5 py-3 shadow-xl shadow-black/40 z-10"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
          <span className="font-mono text-[10px] text-primary/70 tracking-wider">KI HUB</span>
        </div>
        {[{ label: "CRM", on: true }, { label: "Chatbot", on: true }, { label: "Analytics", on: false }].map(({ label, on }) => (
          <div key={label} className="flex items-center gap-2 mt-1">
            <span className={`w-1 h-1 rounded-full ${on ? "bg-green-400" : "bg-text-muted/40"}`} />
            <span className="font-mono text-[10px] text-text-dim">{label}</span>
          </div>
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 w-full py-24 relative z-10">
        <div className="flex items-center">

          {/* ── Left copy ── */}
          <div className="space-y-8">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="tag inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
                {getText(t.hero.tag, lang)}
              </span>
            </motion.div>

            {/* Headline — typewriter per line */}
            <h1 className="font-display font-bold leading-[1.0] text-text-primary">
              <div className="text-6xl lg:text-7xl xl:text-[84px] uppercase tracking-tight">
                <TypewriterText
                  text={getText(t.hero.line1, lang)}
                  startWhen={true}
                  delay={0.5}
                  speed={65}
                  onComplete={() => setLine2Active(true)}
                />
              </div>
              <div className="text-6xl lg:text-7xl xl:text-[84px] mt-1 uppercase tracking-tight">
                <TypewriterText
                  text={getText(t.hero.line2, lang)}
                  startWhen={line2Active}
                  speed={65}
                  onComplete={() => setLine3Active(true)}
                />
              </div>
              <div className="text-5xl lg:text-6xl xl:text-[68px] mt-2">
                <TypewriterText
                  text={getText(t.hero.line3, lang)}
                  startWhen={line3Active}
                  speed={60}
                  className="hero-gradient-text"
                />
              </div>
            </h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
              className="text-text-dim text-lg leading-relaxed max-w-xl"
            >
              {getText(t.hero.sub, lang)}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.78, ease: "easeOut" }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={onOpenWizard}
                className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary/90 transition-all duration-200 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-primary/20"
              >
                {getText(t.hero.cta1, lang)}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 border border-border hover:border-primary/40 text-text-dim hover:text-text-primary transition-all duration-200 font-medium px-6 py-3.5 rounded-xl"
              >
                {getText(t.hero.cta2, lang)}
              </a>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex flex-wrap gap-x-5 gap-y-2"
            >
              {(lang === "de"
                ? ["DSGVO-konform", "EU-gehostet", "Festpreis", "Keine Bindung"]
                : ["GDPR compliant", "EU-hosted", "Fixed price", "No commitment"]
              ).map((label) => (
                <div key={label} className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5 5-5" stroke="#10B981" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-mono text-[11px] text-text-muted">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.05 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-border"
            >
              {stats.map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="font-display font-bold text-2xl lg:text-3xl text-text-primary">
                    {s.val}
                  </div>
                  <div className="text-text-muted text-xs leading-snug">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-border to-transparent"
        />
      </motion.div>
    </section>
  );
}
