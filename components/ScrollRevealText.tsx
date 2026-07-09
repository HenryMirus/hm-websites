"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { t, Lang } from "@/lib/translations";

interface ScrollRevealTextProps {
  lang: Lang;
}

type WordToken = { text: string; highlight: boolean };

function parseWords(text: string): WordToken[] {
  return text.split(/\s+/).map((word) => {
    const clean = word.replace(/\*\*/g, "");
    const highlight = word.startsWith("**") && word.endsWith("**");
    return { text: clean, highlight };
  });
}

function Word({
  token,
  progress,
  start,
  end,
}: {
  token: WordToken;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.07, 1]);
  const color = token.highlight ? "#4F7FFF" : "#EEEEFF";
  const scale = useTransform(progress, [start, end], [0.97, 1]);

  return (
    <motion.span
      style={{ opacity, color, scale, display: "inline-block", marginRight: "0.26em" }}
    >
      {token.text}
    </motion.span>
  );
}

export default function ScrollRevealText({ lang }: ScrollRevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "end 0.7"],
  });

  const words = parseWords(t.scrollReveal.text[lang]);

  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="py-40 relative overflow-hidden">
      {/* Subtle background glows */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-accent/4 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Animated top line */}
        <div className="relative h-px bg-border mb-16 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/80 to-accent/60"
            style={{ scaleX: lineScaleX, transformOrigin: "left" }}
          />
        </div>

        <p className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-[72px] leading-[1.08] tracking-tight">
          {words.map((token, i) => (
            <Word
              key={i}
              token={token}
              progress={scrollYProgress}
              start={i / words.length}
              end={Math.min((i + 1.4) / words.length, 1)}
            />
          ))}
        </p>

        {/* Animated bottom line */}
        <div className="relative h-px bg-border mt-16 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/60 to-primary/80"
            style={{ scaleX: lineScaleX, transformOrigin: "left" }}
          />
        </div>
      </div>
    </section>
  );
}
