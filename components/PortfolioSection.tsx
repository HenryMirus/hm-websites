"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import type { KundenProjekt } from "@/lib/kundenprojekte";
import { projektHref } from "@/lib/projektLinks";
import TypewriterText from "./TypewriterText";

interface PortfolioSectionProps {
  lang: Lang;
  /** Bereits gefiltert: nur published: true (siehe app/page.tsx) */
  projekte: KundenProjekt[];
}

/** Anzeigedauer je Projekt beim automatischen Wechsel */
const AUTO_ADVANCE_MS = 7000;
/** Mindestweg in px, ab dem eine Wischgeste als Blättern zählt */
const SWIPE_THRESHOLD = 50;

// ─── Kachel ──────────────────────────────────────────────────────────────────

interface ProjectTileProps {
  projekt: KundenProjekt;
  lang: Lang;
  /** Inaktive Kacheln im Karussell: nicht fokussierbar */
  inactive?: boolean;
}

function ProjectTile({ projekt, lang, inactive = false }: ProjectTileProps) {
  return (
    <article className="group relative bg-surface border border-border/70 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-[0_0_32px_rgba(79,127,255,0.12)] focus-within:border-primary/40 transition-all duration-300 flex flex-col lg:flex-row h-full">
      {/* Logo: auf heller Kachel, weil beide Kundenlogos dunkel auf hell angelegt sind */}
      <div className="bg-bg border-b lg:border-b-0 lg:border-r border-border p-8 lg:p-10 flex items-center justify-center lg:w-2/5 shrink-0">
        <div className="bg-text-primary rounded-2xl px-8 py-6 w-full max-w-xs h-36 flex items-center justify-center">
          <Image
            src={projekt.logo.src}
            alt={getText(projekt.logo.alt, lang)}
            width={projekt.logo.width}
            height={projekt.logo.height}
            unoptimized={projekt.logo.src.endsWith(".svg")}
            className="max-h-full w-auto h-auto max-w-full object-contain"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {/* Card header */}
        <div className="bg-bg border-b border-border px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] text-primary/50 tracking-widest mb-1">{projekt.caseId}</div>
            <div className="font-mono text-xs text-text-dim">{projekt.kunde}</div>
            <div className="font-mono text-[11px] text-primary/60 mt-0.5">{getText(projekt.branche, lang)}</div>
          </div>
          {projekt.jahr !== undefined && (
            <div className="font-mono text-[11px] text-text-dim shrink-0">
              <span className="sr-only">{getText(t.portfolio.year, lang)}: </span>
              {projekt.jahr}
            </div>
          )}
        </div>

        <div className="p-6 lg:p-8 flex flex-col flex-1">
          <h3 className="font-display font-semibold text-xl lg:text-2xl text-text-primary mb-5 leading-snug">
            {getText(projekt.teaser, lang)}
          </h3>
          <ul className="flex flex-wrap gap-2 mb-6">
            {projekt.leistungen.map((l) => (
              <li
                key={l.de}
                className="font-mono text-[11px] text-text-dim bg-bg border border-border rounded-md px-2 py-0.5"
              >
                {getText(l, lang)}
              </li>
            ))}
          </ul>

          {/* Stretched link: die ganze Kachel ist klickbar, im Fokus aber nur ein Tab-Stopp */}
          <Link
            href={projektHref(projekt.slug, lang)}
            tabIndex={inactive ? -1 : undefined}
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
          >
            {getText(t.portfolio.viewProject, lang)}
            <span className="sr-only">: {projekt.kunde}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Bottom progress bar on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-accent/40 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
    </article>
  );
}

// ─── Karussell (ab zwei Projekten) ───────────────────────────────────────────

interface ProjectCarouselProps {
  projekte: KundenProjekt[];
  lang: Lang;
}

function ProjectCarousel({ projekte, lang }: ProjectCarouselProps) {
  const count = projekte.length;
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const autoplayEnabled = !reduceMotion && !userPaused;
  const running = autoplayEnabled && !hovered && !focused && inView && !docHidden;

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Automatischer Wechsel. Abhängig von `index`, damit jedes manuelle Blättern
  // die volle Anzeigedauer neu startet.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(next, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [running, index, next]);

  // Nur rotieren, solange die Sektion sichtbar ist (sonst verpasst man den Anfang).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Im Hintergrund-Tab anhalten.
  useEffect(() => {
    const onVis = () => setDocHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const p = e.touches[0];
    if (p) touchStart.current = { x: p.clientX, y: p.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    const p = e.changedTouches[0];
    touchStart.current = null;
    if (!start || !p) return;
    const dx = p.clientX - start.x;
    const dy = p.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  };

  const btnClass =
    "w-10 h-10 rounded-lg border border-border bg-surface text-text-dim hover:text-text-primary hover:border-primary/40 transition-colors duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={getText(t.portfolio.carouselLabel, lang)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={onKeyDown}
    >
      {/* Alle Kacheln liegen im selben Grid-Feld: die Höhe ist die der höchsten
          Kachel, der Wechsel verschiebt also nichts (kein Layout-Shift). */}
      <div
        className="grid touch-pan-y"
        aria-live={running ? "off" : "polite"}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {projekte.map((p, i) => {
          const active = i === index;
          return (
            <div
              key={p.slug}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} ${getText(t.portfolio.slideOf, lang)} ${count}: ${p.kunde}`}
              aria-hidden={!active}
              className={`[grid-area:1/1] transition-[opacity,transform,visibility] duration-500 ease-out ${
                active ? "opacity-100 translate-x-0 visible" : "opacity-0 translate-x-4 invisible pointer-events-none"
              }`}
            >
              <ProjectTile projekt={p} lang={lang} inactive={!active} />
            </div>
          );
        })}
      </div>

      {/* Steuerung */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {projekte.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${getText(t.portfolio.goTo, lang)} ${p.kunde}`}
              aria-current={i === index ? "true" : undefined}
              className="p-2 -m-1 group/dot focus-visible:outline-none"
            >
              <span
                className={`block h-2 rounded-full transition-[background-color,transform] duration-300 group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-primary group-focus-visible/dot:ring-offset-2 group-focus-visible/dot:ring-offset-bg ${
                  i === index ? "w-6 bg-primary" : "w-2 bg-border group-hover/dot:bg-text-muted"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!reduceMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((v) => !v)}
              aria-label={getText(userPaused ? t.portfolio.play : t.portfolio.pause, lang)}
              className={btnClass}
            >
              {userPaused ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M4 2.5v9l7.5-4.5L4 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M4.5 2.5v9M9.5 2.5v9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              )}
            </button>
          )}
          <button type="button" onClick={prev} aria-label={getText(t.portfolio.prev, lang)} className={btnClass}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M11 7H3M7 11L3 7l4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" onClick={next} aria-label={getText(t.portfolio.next, lang)} className={btnClass}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sektion ─────────────────────────────────────────────────────────────────

export default function PortfolioSection({ lang, projekte }: PortfolioSectionProps) {
  if (projekte.length === 0) return null;

  return (
    <section id="portfolio" className="py-28 relative">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="tag">{getText(t.portfolio.tag, lang)}</span>
          <h2 className="font-display font-bold text-5xl lg:text-6xl text-text-primary mt-3 mb-3 leading-tight">
            <TypewriterText text={getText(t.portfolio.headline, lang)} delay={0.3} />
          </h2>
          <p className="text-text-dim text-lg max-w-xl">
            {getText(t.portfolio.sub, lang)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Ein Projekt: einfach die Kachel, ohne Rotation, Punkte oder Pfeile. */}
          {projekte.length === 1 ? (
            <ProjectTile projekt={projekte[0]} lang={lang} />
          ) : (
            <ProjectCarousel projekte={projekte} lang={lang} />
          )}
        </motion.div>
      </div>
    </section>
  );
}
