"use client";

/**
 * [S0] Hero — dunkel (Lack), 100 svh (Masterplan §5.1).
 * Kein Bild, kein Stockfoto: die Typografie und die Leitung SIND der Hero.
 *
 * Animationssequenz (GSAP-Timeline, gesamt ~1,5 s):
 * ① Raster blendet ein (0,4 s) → ② Eyebrow Silkscreen (0,4 s, Delay 0,2 s)
 * → ③ H1 Width-Shift wdth 85→120 zeilenweise (0,8 s, Stagger 0,1 s)
 * → ④ Subline Silkscreen (0,5 s) → ⑤ CTAs Opacity+Y 12 px (0,4 s)
 * → ⑥ Monogramm-Trace (0,9 s, parallel ab ③, via CSS-Keyframes).
 * Scroll-Hinweis: kleines Via pulsiert 1× (CSS).
 *
 * Hero-Variante A („Websites, die man nicht verwechselt.") —
 * Variante B liegt bereit, Entscheidung im Design-Review (offene Entscheidung 3).
 */
import Link from "next/link";
import { useRef } from "react";
import Monogram from "@/components/brand/Monogram";
import {
  gsap,
  useGSAP,
  SplitText,
  MM_CONDITIONS,
  EASE,
} from "@/lib/motion/gsap";
import { localePath } from "@/lib/i18n";
import type { Lang } from "@/content/leistungen";

const T = {
  eyebrow: {
    de: "[S0] HM LABS — BUCHHOLZ / REMOTE",
    en: "[S0] HM LABS — BUCHHOLZ / REMOTE",
  },
  h1: {
    de: "Websites, die man nicht verwechselt.",
    en: "Websites you won't mistake for anyone else's.",
  },
  subline: {
    de: "Individuell entworfen, von Hand gebaut, messbar schnell — mit Sichtbarkeit in Google und in KI-Suchen. Ein Ansprechpartner, die Leistungsbreite einer Agentur.",
    en: "Individually designed, hand-built, measurably fast — visible on Google and in AI search. One point of contact, the range of an agency.",
  },
  ctaPrimary: { de: "Projekt anfragen", en: "Start a project" },
  ctaSecondary: { de: "Ablauf ansehen", en: "See the process" },
} as const;

export default function Hero({ lang }: { lang: Lang }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(MM_CONDITIONS.motionOk, () => {
        const h1 = root.querySelector<HTMLElement>(".hero-h1");
        const split = h1 ? SplitText.create(h1, { type: "lines" }) : null;

        const tl = gsap.timeline({ defaults: { ease: EASE.entrance } });

        // ① Raster
        tl.fromTo(
          ".hero-raster",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4 }
        );
        // ② Eyebrow — Silkscreen
        tl.fromTo(
          ".hero-eyebrow",
          { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 0, y: 10 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
          },
          0.2
        );
        // ③ H1 — Width-Shift zeilenweise (Signature)
        if (split) {
          tl.fromTo(
            split.lines,
            { fontStretch: "85%", autoAlpha: 0, y: 16 },
            {
              fontStretch: "120%",
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: EASE.signature,
              stagger: 0.1,
              onComplete: () => split.revert(),
            },
            0.45
          );
        }
        // ④ Subline — Silkscreen
        tl.fromTo(
          ".hero-subline",
          { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 0, y: 12 },
          { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, y: 0, duration: 0.5 },
          "-=0.35"
        );
        // ⑤ CTAs
        tl.fromTo(
          ".hero-cta",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 },
          "-=0.2"
        );
        // ⑥ Monogramm-Trace läuft parallel per CSS (.monogram-trace, 0,9 s)

        return () => split?.revert();
      });

      mm.add(MM_CONDITIONS.reduce, () => {
        gsap.set(
          [".hero-raster", ".hero-eyebrow", ".hero-subline", ".hero-cta"],
          { autoAlpha: 1, clearProps: "clipPath,transform" }
        );
        gsap.fromTo(
          root,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.2, ease: "none" }
        );
      });
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      id="s0"
      data-theme="lack"
      data-via
      className="on-lack relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
      style={{ background: "var(--lack)", color: "var(--text-invers)" }}
      aria-label={lang === "de" ? "Einstieg" : "Intro"}
    >
      {/* ① 8-px-Lochraster (nur dunkle Sektionen, CI §4) */}
      <div className="hero-raster dot-grid absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-content px-6 py-24">
        <p
          className="hero-eyebrow eyebrow mb-6"
          style={{ color: "var(--kupfer-hell)" }}
        >
          {T.eyebrow[lang]}
        </p>

        <h1 className="hero-h1 h-display max-w-5xl">{T.h1[lang]}</h1>

        <p
          className="hero-subline mt-8 max-w-2xl text-lg"
          style={{ color: "var(--text-invers-ged)" }}
        >
          {T.subline[lang]}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href={localePath("/kontakt", lang)}
            className="hero-cta btn-pad"
          >
            {T.ctaPrimary[lang]}
          </Link>
          <Link
            href={localePath("/prozess", lang)}
            className="hero-cta btn-ghost via-link"
          >
            {T.ctaSecondary[lang]}
          </Link>
        </div>

        {/* ⑥ Monogramm — zeichnet sich, die Signalleitung beginnt hier */}
        <div className="mt-16 hidden md:block" aria-hidden="true">
          <Monogram size={56} animate />
        </div>
      </div>

      {/* Scroll-Hinweis: Via pulsiert 1× */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <span
          className="via-pulse block h-3 w-3 rounded-full border-[1.5px]"
          style={{ borderColor: "var(--kupfer-hell)" }}
        />
      </div>
    </section>
  );
}
