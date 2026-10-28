"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import type { KundenLogo } from "@/lib/kundenprojekte";
import { projektHref } from "@/lib/projektLinks";

export interface LogoMarqueeItem {
  slug: string;
  kunde: string;
  logo: KundenLogo;
}

interface LogoMarqueeProps {
  lang: Lang;
  /** Bereits gefiltert: nur veröffentlichte Kunden (siehe app/page.tsx) */
  items: LogoMarqueeItem[];
}

/** Lauftempo in px/s, wie beim TechStack-Band aus der echten Breite abgeleitet */
const SPEED = 30;
/** Abstand zwischen den Logo-Kacheln in px (entspricht gap-4) */
const GAP = 16;

/**
 * Laufband mit Kundenlogos, im Stil des TechStack-Bands.
 *
 * Läuft immer durch, auch bei wenigen Kunden (Vorgabe Henry 28.10.2026): Die
 * Logo-Reihe wird so oft wiederholt, dass eine Hälfte des Bands mindestens die
 * sichtbare Breite füllt, die zweite Hälfte ist die Kopie für den nahtlosen
 * Loop. Bei prefers-reduced-motion steht eine ruhige, mittige Reihe da.
 *
 * Tastatur: Nur die allererste Reihe ist fokussierbar, alle Wiederholungen
 * sind aria-hidden und aus der Tab-Reihenfolge genommen. Kein Fokus-Trap.
 */
export default function LogoMarquee({ lang, items }: LogoMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  /** Wie oft die Reihe pro Bandhälfte vorkommt */
  const [copies, setCopies] = useState(1);
  const reduceMotion = useReducedMotion();

  const scrolling = !reduceMotion;

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const list = listRef.current;
    if (!viewport || !list) return;

    const measure = () => {
      // Summe der Kachelbreiten statt scrollWidth: funktioniert in beiden
      // Modi gleich (statisch umbrechend oder als Laufband).
      const tiles = Array.from(list.children) as HTMLElement[];
      const rowWidth =
        tiles.reduce((w, el) => w + el.getBoundingClientRect().width, 0) +
        GAP * tiles.length; // pr-4 der Reihe zählt als Abstand zur nächsten
      if (rowWidth <= 0) return;
      const n = Math.max(1, Math.ceil(viewport.clientWidth / rowWidth));
      setCopies(n);
      const track = trackRef.current;
      if (track) track.style.setProperty("--lm-dur", `${(n * rowWidth) / SPEED}s`);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [items.length]);

  if (items.length === 0) return null;

  const renderList = (index: number) => {
    const clone = index > 0;
    return (
      <ul
        key={index}
        ref={clone ? undefined : listRef}
        aria-hidden={clone || undefined}
        className={`flex items-center gap-4 ${scrolling ? "shrink-0 pr-4" : "flex-wrap justify-center"}`}
      >
        {items.map((item) => (
          <li key={item.slug} className="shrink-0">
            <Link
              href={projektHref(item.slug, lang)}
              tabIndex={clone ? -1 : undefined}
              aria-label={`${getText(t.clientLogos.linkPrefix, lang)} ${item.kunde}`}
              className="flex h-20 w-48 items-center justify-center rounded-xl bg-text-primary px-5 py-3 opacity-90 transition-[opacity,transform] duration-200 hover:opacity-100 hover:-translate-y-0.5 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Image
                src={item.logo.src}
                alt={clone ? "" : getText(item.logo.alt, lang)}
                width={item.logo.width}
                height={item.logo.height}
                unoptimized={item.logo.src.endsWith(".svg")}
                className="max-h-full w-auto h-auto max-w-full object-contain"
              />
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  // Zwei gleich lange Hälften aus je `copies` Reihen; die Animation verschiebt
  // um genau eine Hälfte (-50 %), dadurch ist der Übergang unsichtbar.
  const rows = scrolling ? Array.from({ length: copies * 2 }, (_, i) => renderList(i)) : [renderList(0)];

  return (
    <div className="border-b border-border bg-surface/30 py-6">
      <style>{`
        @keyframes lm-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .lm-track-run { animation: lm-scroll var(--lm-dur, 40s) linear infinite; will-change: transform; }
        .lm-viewport:hover .lm-track-run,
        .lm-viewport:focus-within .lm-track-run { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .lm-track-run { animation: none; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-widest text-text-muted">
          {getText(t.clientLogos.label, lang)}
        </p>
        <div
          ref={viewportRef}
          className={`lm-viewport py-2 ${
            scrolling
              ? "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
              : ""
          }`}
        >
          <div ref={trackRef} className={scrolling ? "lm-track-run flex w-max" : "flex justify-center"}>
            {rows}
          </div>
        </div>
      </div>
    </div>
  );
}
