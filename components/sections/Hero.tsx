"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/site.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scaffold hero with the two mandatory HM animation patterns:
 *  1. Hero entrance timeline on load (staggered fade/slide-in).
 *  2. A ScrollTrigger reveal on the content block below the fold.
 * Replaced with the real design during the v2 build phases.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });
      tl.from(".hero-eyebrow", { y: 24, opacity: 0 })
        .from(".hero-title", { y: 60, opacity: 0 }, "-=0.6")
        .from(".hero-subtitle", { y: 40, opacity: 0 }, "-=0.7")
        .from(".hero-cta", { y: 24, opacity: 0 }, "-=0.7");

      gsap.from(".scroll-reveal", {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".scroll-reveal",
          start: "top 80%",
        },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p className="hero-eyebrow mb-4 text-sm font-medium uppercase tracking-[0.2em] text-brand-accent">
        {siteConfig.shortName}
      </p>
      <h1 className="hero-title max-w-3xl text-5xl font-bold leading-tight text-brand-primary md:text-7xl">
        Clean-sheet redesign in progress
      </h1>
      <p className="hero-subtitle mt-6 max-w-xl text-lg text-brand-secondary">
        Next.js 14 · TypeScript · Tailwind v3 · GSAP ScrollTrigger · Framer
        Motion. The scaffold is live — design and content land in the next
        phases.
      </p>
      <div className="hero-cta mt-10">
        <a
          href="#more"
          className="inline-flex items-center rounded-full bg-brand-accent px-8 py-3 font-medium text-white transition-transform duration-300 hover:scale-105"
        >
          Scroll to explore
        </a>
      </div>

      <div
        id="more"
        className="scroll-reveal mt-[40vh] max-w-md text-balance text-brand-secondary"
      >
        <p>
          This block fades in on scroll via GSAP ScrollTrigger — proof the
          animation pipeline is wired end to end.
        </p>
      </div>
    </section>
  );
}
