"use client";

/**
 * Trace-Draw (Signature-Pattern 1, CI §5):
 * SVG-Leiterbahnen zeichnen sich per stroke-dashoffset — an den Scroll
 * gekoppelt (scrub: 1) oder einmalig beim Eintritt.
 *
 * Erwartet SVG-Pfade mit der Klasse `trace-path` und pathLength={100}
 * innerhalb des Wrappers. Reduced Motion: vollständig gezeichnet.
 */
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MM_CONDITIONS } from "@/lib/motion/gsap";

export default function TraceDraw({
  children,
  className,
  /** true: an Scroll gekoppelt (scrub 1) · false: einmalig 0,9 s beim Eintritt */
  scrub = true,
  start = "top 75%",
  end = "bottom 40%",
}: {
  children: ReactNode;
  className?: string;
  scrub?: boolean;
  start?: string;
  end?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const paths = gsap.utils.toArray<SVGPathElement>(".trace-path", root);
      if (paths.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(MM_CONDITIONS.motionOk, () => {
        gsap.set(paths, { strokeDasharray: 100, strokeDashoffset: 100 });
        gsap.to(paths, {
          strokeDashoffset: 0,
          ease: scrub ? "none" : "power3.out",
          duration: scrub ? undefined : 0.9,
          stagger: scrub ? 0 : 0.15,
          scrollTrigger: scrub
            ? { trigger: root, start, end, scrub: 1 }
            : { trigger: root, start, once: true },
        });
      });
      // Reduced Motion: Pfade bleiben vollständig gezeichnet.
    },
    { scope }
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
