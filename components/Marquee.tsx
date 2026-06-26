"use client";

import { useRef } from "react";

interface MarqueeProps {
  items: string[];
  speed?: number;
  className?: string;
}

export default function Marquee({ items, speed = 40, className = "" }: MarqueeProps) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items, ...items];
  const duration = (items.length * 120) / speed;

  return (
    <div className={`overflow-hidden ${className}`}>
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .marquee-track {
          animation: marquee-scroll ${duration}s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
      <div className="marquee-track flex gap-0 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-8 text-sm font-medium text-text-muted"
          >
            <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
