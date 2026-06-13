'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

interface CtaBandProps {
  locale: 'de' | 'en';
}

export default function CtaBand({ locale }: CtaBandProps) {
  const t = useTranslations('cta');
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('.cta-reveal');
      if (els) {
        gsap.from(els, {
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power2.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-pad border-t border-[rgba(255,255,255,0.08)]">
      <div className="container-site text-center">
        <h2 className="cta-reveal display-h2 mb-6 max-w-[700px] mx-auto">{t('h2')}</h2>
        <p className="cta-reveal text-[18px] lg:text-[20px] text-[#9CA3AF] mb-10 max-w-[480px] mx-auto leading-relaxed">
          {t('body')}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="cta-reveal inline-flex items-center gap-2 bg-[#E8FF47] text-[#0A0A0A] font-700 text-[16px] px-10 py-4 rounded-[4px] min-h-[52px] hover:bg-white transition-colors duration-200"
        >
          {t('button')} →
        </Link>
      </div>
    </section>
  );
}
