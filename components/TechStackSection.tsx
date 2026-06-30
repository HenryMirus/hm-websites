"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";

interface TechStackSectionProps {
  lang: Lang;
}

const CAT_COLORS = ["#4F7FFF", "#10B981", "#8B5CF6", "#F59E0B", "#06B6D4", "#FF4D6A"];

const ALL_TOOLS = t.techStack.categories.flatMap((cat, ci) =>
  cat.tools.map((tool) => ({ tool, color: CAT_COLORS[ci] }))
);

// Two copies — animation moves exactly -50% (no floating-point drift, seamless reset)
const ALL_REV = [...ALL_TOOLS].reverse();
const ROW1 = [...ALL_TOOLS, ...ALL_TOOLS];
const ROW2 = [...ALL_REV, ...ALL_REV];

// Speed in px/s — duration is derived from actual rendered width, so it stays
// constant even if tools are added/removed (a fixed-seconds duration would not).
const SPEED_L = 45;
const SPEED_R = 37;

export default function TechStackSection({ lang }: TechStackSectionProps) {
  const rowLRef = useRef<HTMLDivElement>(null);
  const rowRRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const setDuration = (el: HTMLDivElement | null, speed: number) => {
      if (!el) return;
      const singleListWidth = el.scrollWidth / 2; // ROW is two copies back-to-back
      el.style.setProperty("--ts-dur", `${singleListWidth / speed}s`);
    };
    setDuration(rowLRef.current, SPEED_L);
    setDuration(rowRRef.current, SPEED_R);
  }, []);

  return (
    <section id="tech-stack" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="tag">{getText(t.techStack.tag, lang)}</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-text-primary mt-3 mb-4 max-w-2xl">
            <TypewriterText text={getText(t.techStack.headline, lang)} delay={0.3} />
          </h2>
          <p className="text-text-dim text-lg max-w-xl">
            {getText(t.techStack.sub, lang)}
          </p>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <style>{`
        @keyframes ts-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes ts-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .ts-row-l { animation: ts-left  var(--ts-dur, 80s) linear infinite; will-change: transform; }
        .ts-row-r { animation: ts-right var(--ts-dur, 95s) linear infinite; will-change: transform; }
        .ts-row-l:hover, .ts-row-r:hover { animation-play-state: paused; }
      `}</style>

      <div className="space-y-3">
        {/* Row 1 — left */}
        <div className="overflow-hidden border-y border-border/50 py-3 bg-surface/20">
          <div className="ts-row-l flex w-max" ref={rowLRef}>
            {ROW1.map(({ tool, color }, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2.5 font-mono text-xs bg-bg border border-border rounded-lg px-4 py-2 mx-2 whitespace-nowrap hover:border-primary/30 transition-colors duration-200"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}99` }}
                />
                <span className="text-text-dim">{tool}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — right */}
        <div className="overflow-hidden border-b border-border/50 py-3 bg-surface/20">
          <div className="ts-row-r flex w-max" ref={rowRRef}>
            {ROW2.map(({ tool, color }, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2.5 font-mono text-xs bg-bg border border-border rounded-lg px-4 py-2 mx-2 whitespace-nowrap hover:border-primary/30 transition-colors duration-200"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}99` }}
                />
                <span className="text-text-dim">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category legend */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-x-8 gap-y-3 justify-center"
        >
          {t.techStack.categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CAT_COLORS[i], boxShadow: `0 0 5px ${CAT_COLORS[i]}80` }}
              />
              <span className="font-mono text-[11px] text-text-dim">{getText(cat.name, lang)}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
