"use client";

/**
 * Width-Shift (Signature-Pattern 2, CI §5) — DAS Signature-Pattern der Marke:
 * H1/H2 animieren die variable Breitenachse von Hubot Sans
 * (font-stretch 85% → Ziel, 0,8 s, expo.out, zeilenweise Stagger 0,1 s) —
 * die Headline „spreizt sich in Position".
 *
 * Einmal pro Seite im Hero, sparsam sonst.
 * Reduced Motion: nur 0,2-s-Opacity, Breite steht sofort.
 */
import { useRef, type ElementType, type ReactNode } from "react";
import {
  gsap,
  useGSAP,
  SplitText,
  MM_CONDITIONS,
  EASE,
  DUR,
} from "@/lib/motion/gsap";

export default function WidthShift({
  as: Tag = "h1",
  children,
  className,
  /** Ziel-Breite in % (H1: 120, H2: 112) */
  target = 120,
  delay = 0,
  /** true: sofort beim Mount (Hero) · false: beim Scroll-Eintritt */
  immediate = false,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  target?: number;
  delay?: number;
  immediate?: boolean;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MM_CONDITIONS.motionOk, () => {
        const split = SplitText.create(el, { type: "lines" });
        const lines = split.lines;
        gsap.set(lines, { fontStretch: "85%", autoAlpha: 0, y: 14 });
        gsap.to(lines, {
          fontStretch: `${target}%`,
          autoAlpha: 1,
          y: 0,
          duration: DUR.hero,
          ease: EASE.signature,
          stagger: 0.1,
          delay,
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  once: true,
                },
              }),
          onComplete: () => {
            split.revert(); // sauberes DOM zurück, font-stretch kommt aus der Klasse
          },
        });
        return () => split.revert();
      });

      mm.add(MM_CONDITIONS.reduce, () => {
        gsap.set(el, { autoAlpha: 0 });
        gsap.to(el, { autoAlpha: 1, duration: 0.2, ease: "none", delay: 0 });
      });
    },
    { scope }
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
