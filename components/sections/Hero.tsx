'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  locale: 'de' | 'en';
}

export default function Hero({ locale }: HeroProps) {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const lines = headlineRef.current?.querySelectorAll('.hero-line') ?? [];

      /* cinematic-reveal: background scale-in */
      gsap.from(bgRef.current, {
        scale: 1.08,
        duration: 1.4,
        ease: 'power3.out',
      });

      /* narrative-scroll: headline lines slide up from clip mask */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(lines, {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.08,
      })
        .from(subRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.7,
        }, '-=0.4')
        .from(ctaRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.5,
        }, '-=0.4')
        .from(scrollHintRef.current, {
          opacity: 0,
          duration: 0.5,
        }, '-=0.2');

      /* depth-parallax on scroll */
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          if (bgRef.current) {
            gsap.set(bgRef.current, { yPercent: -20 * self.progress });
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden"
    >
      {/* 3D hero background — BRAND-KIT-OPEN: replace with brand 3D asset */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0"
        aria-hidden="true"
      >
        {/* Abstract geometric placeholder — will be replaced by brand 3D asset */}
        <svg
          className="w-full h-full opacity-20"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Abstract 3D render as the HM Websites hero visual"
        >
          <defs>
            <radialGradient id="rg1" cx="70%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#E8FF47" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rg2" cx="20%" cy="70%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1440" height="900" fill="url(#rg1)" />
          <rect width="1440" height="900" fill="url(#rg2)" />
          {/* Grid lines */}
          {[...Array(12)].map((_, i) => (
            <line
              key={`v${i}`}
              x1={120 * i}
              y1="0"
              x2={120 * i}
              y2="900"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={112.5 * i}
              x2="1440"
              y2={112.5 * i}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          ))}
          {/* Accent geometric shapes */}
          <polygon
            points="1200,100 1380,200 1300,380 1100,320 1080,150"
            fill="none"
            stroke="rgba(232,255,71,0.08)"
            strokeWidth="1"
          />
          <circle
            cx="900"
            cy="500"
            r="200"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Hero content */}
      <div className="container-site relative z-10 pt-32 pb-24 lg:pt-0 lg:pb-0 lg:flex lg:flex-col lg:justify-center">
        <p className="label-overline mb-6 lg:mb-8">{t('eyebrow')}</p>

        <h1
          ref={headlineRef}
          className="display-hero overflow-hidden"
          aria-label={`${t('h1Line1')} ${t('h1Line2')} ${t('h1Line3')}`}
        >
          <span className="block overflow-hidden">
            <span className="hero-line block">{t('h1Line1')}</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line block">{t('h1Line2')}</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line block text-accent">{t('h1Line3')}</span>
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-8 text-[18px] lg:text-[20px] text-[#9CA3AF] max-w-[520px] leading-relaxed"
        >
          {t('subline')}
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center gap-2 bg-[#E8FF47] text-[#0A0A0A] font-600 text-[16px] px-8 py-4 rounded-[4px] min-h-[48px] hover:bg-white transition-colors duration-200"
          >
            {t('ctaPrimary')} →
          </Link>
          <Link
            href={`/${locale}/process`}
            className="inline-flex items-center justify-center gap-2 border border-[rgba(255,255,255,0.2)] text-[#F5F5F0] font-500 text-[16px] px-8 py-4 rounded-[4px] min-h-[48px] hover:border-[rgba(255,255,255,0.5)] transition-colors duration-200"
          >
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="label-overline text-[10px]">{t('scrollHint')}</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[rgba(255,255,255,0.3)] to-transparent animate-pulse" />
      </div>
    </section>
  );
}
