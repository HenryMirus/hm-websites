"use client";

/**
 * Zentrales GSAP-Setup — Motion-Sprache „Signalfluss" (CI §5, Masterplan §7).
 *
 * Regeln (hm-dev-standard):
 *  - Scroll-Animationen: GSAP + ScrollTrigger · Hover/Feedback: CSS
 *  - Entrances power3.out/expo.out 0,6–0,9 s · Exits power2.in · UI 0,25–0,4 s
 *  - Kein elastic, kein bounce · nur transform/opacity/clip-path (CLS < 0,1)
 *  - prefers-reduced-motion verbindlich → überall gsap.matchMedia mit REDUCE
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** matchMedia-Bedingungen — in jedem useGSAP verwenden */
export const MM_CONDITIONS = {
  reduce: "(prefers-reduced-motion: reduce)",
  motionOk: "(prefers-reduced-motion: no-preference)",
} as const;

export const EASE = {
  entrance: "power3.out",
  signature: "expo.out",
  exit: "power2.in",
} as const;

export const DUR = {
  ui: 0.3,
  reveal: 0.7,
  hero: 0.8,
  via: 0.3,
  messung: 0.5,
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
