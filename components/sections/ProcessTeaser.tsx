'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

interface ProcessTeaserProps {
  locale: 'de' | 'en';
}

export default function ProcessTeaser({ locale }: ProcessTeaserProps) {
  const t = useTranslations('processTeaser');
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('.pt-reveal');
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
    <section ref={sectionRef} className="section-pad">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <h2 className="pt-reveal display-h2 mb-6">{t('h2')}</h2>
            <p className="pt-reveal text-[18px] lg:text-[20px] text-[#9CA3AF] leading-relaxed mb-8">
              {t('body')}
            </p>
            <Link
              href={`/${locale}/process`}
              className="pt-reveal inline-flex items-center gap-2 text-[#E8FF47] font-600 text-[16px] hover:gap-4 transition-all duration-200"
            >
              {t('cta')} →
            </Link>
          </div>

          {/* Steps mini-preview */}
          <div className="space-y-4">
            {['01', '02', '03', '04'].map((num, i) => (
              <div
                key={num}
                className="pt-reveal flex items-center gap-6 border border-[rgba(255,255,255,0.08)] rounded-[4px] px-6 py-4"
              >
                <span className="text-[#E8FF47] font-700 text-[20px] leading-none">{num}</span>
                <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.06)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
