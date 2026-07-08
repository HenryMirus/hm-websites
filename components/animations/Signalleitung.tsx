"use client";

/**
 * Die Signalleitung — Signature-Element der Marke (CI §4, Masterplan §3/§6.2):
 * eine Kupfer-Leiterbahn, die sich mit dem Scrollfortschritt vertikal durch
 * die Seite zeichnet (Trace-Draw, scrub: 1) und an jeder Sektion in einem
 * Via endet. Erreicht die Leitung eine Sektion, füllt sich deren Via
 * (Scale 0 → 1, 0,3 s).
 *
 * Sie ist zugleich der Scroll-Fortschrittsindikator der Seite — es gibt
 * keinen zusätzlichen Balken.
 *
 * Sektionen melden sich per `data-via` an ihrem <section>-Element an.
 * Rein dekorativ: aria-hidden, für AT unsichtbar (Masterplan §9.6).
 *
 * Sichtbar erst ab xl (1280 px) — darunter würde die Leitung den Inhalt
 * überlagern. Reduced Motion: Leitung statisch vollständig gezeichnet,
 * alle Vias gefüllt (CI §5, verbindlich).
 */
import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, MM_CONDITIONS, DUR } from "@/lib/motion/gsap";

interface ViaPos {
  id: string;
  top: number;
}

export default function Signalleitung() {
  const scope = useRef<HTMLDivElement>(null);
  const [vias, setVias] = useState<ViaPos[]>([]);

  useGSAP(
    () => {
      const wrap = scope.current;
      if (!wrap) return;

      /* Via-Positionen aus den angemeldeten Sektionen ableiten */
      const measure = () => {
        const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
        const found = gsap.utils
          .toArray<HTMLElement>("[data-via]")
          .map((el, i) => {
            const rect = el.getBoundingClientRect();
            return {
              id: el.id || `via-${i}`,
              top: rect.top + window.scrollY - wrapTop + 4,
            };
          });
        setVias(found);
      };

      measure();
      // Nach Font-Load/Resize neu messen — ScrollTrigger.refresh feuert dann ohnehin
      ScrollTrigger.addEventListener("revert", measure);
      const onResize = () => measure();
      window.addEventListener("resize", onResize);

      const mm = gsap.matchMedia();

      mm.add(MM_CONDITIONS.motionOk, () => {
        gsap.set(".signal-linie", { scaleY: 0, transformOrigin: "top center" });
        gsap.to(".signal-linie", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      });

      mm.add(MM_CONDITIONS.reduce, () => {
        gsap.set(".signal-linie", { scaleY: 1 });
      });

      return () => {
        ScrollTrigger.removeEventListener("revert", measure);
        window.removeEventListener("resize", onResize);
      };
    },
    { scope }
  );

  /* Via-Füllungen — eigener Pass, sobald Positionen bekannt sind */
  useGSAP(
    () => {
      const wrap = scope.current;
      if (!wrap || vias.length === 0) return;
      const mm = gsap.matchMedia();

      mm.add(MM_CONDITIONS.motionOk, () => {
        gsap.utils
          .toArray<HTMLElement>(".signal-via-kern", wrap)
          .forEach((kern) => {
            gsap.set(kern, { scale: 0 });
            gsap.to(kern, {
              scale: 1,
              duration: DUR.via,
              ease: "power2.out",
              scrollTrigger: {
                trigger: kern,
                start: "top 75%",
                once: true,
              },
            });
          });
      });

      mm.add(MM_CONDITIONS.reduce, () => {
        gsap.set(".signal-via-kern", { scale: 1 });
      });
    },
    { scope, dependencies: [vias], revertOnUpdate: true }
  );

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-8 z-10 hidden w-4 xl:block"
    >
      {/* Die Leiterbahn */}
      <div
        className="signal-linie absolute inset-y-0 left-[7px] w-[1.5px]"
        style={{ background: "var(--kupfer)" }}
      />
      {/* Vias an jeder angemeldeten Sektion */}
      {vias.map((v) => (
        <span
          key={v.id}
          className="absolute left-[2px] block h-3 w-3 rounded-full border-[1.5px]"
          style={{
            top: v.top,
            borderColor: "var(--kupfer)",
            background: "var(--substrat)",
          }}
        >
          <span
            className="signal-via-kern absolute inset-[2.5px] rounded-full"
            style={{ background: "var(--kupfer)" }}
          />
        </span>
      ))}
    </div>
  );
}
