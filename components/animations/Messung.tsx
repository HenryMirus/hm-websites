"use client";

/**
 * Messung (Signature-Pattern 5, CI §5):
 * Zahlen werden NICHT hochgezählt (Counter sind gebannt) — der Wert steht
 * fix, darunter zeichnet sich eine Maßlinie mit Endstrichen (0,5 s),
 * die den Wert als „gemessen" markiert.
 */
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MM_CONDITIONS, DUR } from "@/lib/motion/gsap";

export default function Messung({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const line = root.querySelector<SVGPathElement>(".messung-linie");
      if (!line) return;

      const mm = gsap.matchMedia();

      mm.add(MM_CONDITIONS.motionOk, () => {
        gsap.set(line, { strokeDasharray: 100, strokeDashoffset: 100 });
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: DUR.messung,
          ease: "power2.out",
          delay,
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        });
      });
      // Reduced Motion: Linie bleibt vollständig gezeichnet — nichts zu tun.
    },
    { scope }
  );

  return (
    <div ref={scope} className={className}>
      {children}
      {/* Maßlinie mit Endstrichen — dekorativ */}
      <svg
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        className="mt-2 h-2 w-full"
        aria-hidden="true"
      >
        <path
          className="messung-linie"
          d="M1 1 V7 M1 4 H99 M99 1 V7"
          pathLength={100}
          fill="none"
          stroke="var(--kupfer)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
