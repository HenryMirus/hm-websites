"use client";

/**
 * Silkscreen-Reveal (Signature-Pattern 3, CI §5):
 * Inhalte erscheinen per clip-path: inset() von unten — wie ein Druckvorgang.
 * Ersetzt den gebannten Fade-in-up-Einheitsbrei.
 *
 * GAIO-sicher: der Ausgangszustand wird erst per JS gesetzt (gsap.set) —
 * ohne JavaScript ist jeder Inhalt vollständig sichtbar.
 *
 * Reduced Motion: einfache 0,2-s-Opacity-Blende (CI §5, verbindlich).
 *
 * Kinder mit [data-reveal] werden gestaggert (0,08–0,12 s); ohne
 * [data-reveal]-Kinder wird der Container selbst animiert.
 */
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, MM_CONDITIONS, EASE } from "@/lib/motion/gsap";

export default function Reveal({
  as: Tag = "div",
  children,
  className,
  stagger = 0.1,
  start = "top 75%",
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  stagger?: number;
  start?: string;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const children = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      const targets = children.length > 0 ? children : [root];

      const mm = gsap.matchMedia();

      mm.add(MM_CONDITIONS.motionOk, () => {
        gsap.set(targets, {
          clipPath: "inset(100% 0% 0% 0%)",
          y: 16,
          autoAlpha: 0,
        });
        gsap.to(targets, {
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          ease: EASE.entrance,
          stagger,
          scrollTrigger: { trigger: root, start, once: true },
          clearProps: "clipPath,transform",
        });
      });

      mm.add(MM_CONDITIONS.reduce, () => {
        gsap.set(targets, { autoAlpha: 0 });
        gsap.to(targets, {
          autoAlpha: 1,
          duration: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root, start, once: true },
        });
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
