"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export default function AnimatedCounter({ value, className = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayed, setDisplayed] = useState("0");

  // Extract numeric part and suffix
  const match = value.match(/^([+\-Ø\s]*)(\d+)([^\d]*)$/);
  const prefix = match?.[1] ?? "";
  const num = parseInt(match?.[2] ?? "0", 10);
  const suffix = match?.[3] ?? "";

  useEffect(() => {
    if (!isInView || !match) {
      setDisplayed(value);
      return;
    }
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * num);
      setDisplayed(`${prefix}${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView]); // eslint-disable-line

  return (
    <span ref={ref} className={className}>
      {isInView ? displayed : value}
    </span>
  );
}
