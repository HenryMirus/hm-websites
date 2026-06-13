'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  locale: 'de' | 'en';
}

const TAGS_DE = [
  ['Next.js', 'TypeScript', 'Custom Code'],
  ['GSAP', 'ScrollTrigger', 'Awwwards-Niveau'],
  ['Lighthouse 95+', 'Schema.org', 'GAIO'],
  ['DE/EN', 'hreflang', 'KI-gebaut'],
];

const TAGS_EN = [
  ['Next.js', 'TypeScript', 'Custom Code'],
  ['GSAP', 'ScrollTrigger', 'Awwwards-level'],
  ['Lighthouse 95+', 'Schema.org', 'GAIO'],
  ['DE/EN', 'hreflang', 'AI-built'],
];

export default function ServicesSection({ locale }: ServicesSectionProps) {
  const t = useTranslations('services');
  const sectionRef = useRef<HTMLElement>(null);
  const tags = locale === 'de' ? TAGS_DE : TAGS_EN;

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector('.svc-header');
      const cards = sectionRef.current?.querySelectorAll('.svc-card');

      if (header) {
        gsap.from(header, {
          scrollTrigger: { trigger: header, start: 'top 85%' },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      if (cards) {
        cards.forEach((card) => {
          gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0,
            y: 40,
            duration: 0.6,
            ease: 'power2.out',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  const services = [0, 1, 2, 3];

  return (
    <section ref={sectionRef} className="section-pad">
      <div className="container-site">
        <div className="svc-header mb-16 lg:mb-20">
          <p className="label-overline mb-4">{t('eyebrow')}</p>
          <h1 className="display-h2 max-w-[800px] mb-6">{t('h1')}</h1>
          <p className="text-[18px] lg:text-[20px] text-[#9CA3AF] max-w-[600px] leading-relaxed">
            {t('intro')}
          </p>
        </div>

        <div className="space-y-6 lg:space-y-4">
          {services.map((i) => (
            <div
              key={i}
              className="svc-card group border border-[rgba(255,255,255,0.08)] rounded-[4px] p-8 lg:p-10 hover:border-[rgba(232,255,71,0.15)] transition-all duration-300 bg-[#111111] hover:bg-[#141414]"
            >
              <div className="flex items-start gap-6 lg:gap-10">
                <span className="text-[#E8FF47] font-700 text-[24px] leading-none flex-shrink-0 mt-1">
                  {t(`items.${i}.number`)}
                </span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="display-h3">{t(`items.${i}.title`)}</h2>
                    <span className="text-[#E8FF47] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 mt-1 text-[20px]">
                      →
                    </span>
                  </div>
                  <p className="text-[#9CA3AF] leading-relaxed text-[17px] lg:text-[18px] mb-6">
                    {t(`items.${i}.body`)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags[i].map((tag) => (
                      <span
                        key={tag}
                        className="text-[12px] font-500 text-[#9CA3AF] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech strip */}
        <div className="mt-16 pt-10 border-t border-[rgba(255,255,255,0.08)]">
          <p className="label-overline text-center text-[#9CA3AF]">{t('techStrip')}</p>
        </div>
      </div>
    </section>
  );
}
