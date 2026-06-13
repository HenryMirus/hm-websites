'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

interface ProcessSectionProps {
  locale: 'de' | 'en';
}

export default function ProcessSection({ locale }: ProcessSectionProps) {
  const t = useTranslations('process');
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector('.proc-header');
      if (header) {
        gsap.from(header, {
          scrollTrigger: { trigger: header, start: 'top 85%' },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      const steps = sectionRef.current?.querySelectorAll('.proc-step');
      if (steps) {
        steps.forEach((step) => {
          gsap.from(step, {
            scrollTrigger: { trigger: step, start: 'top 88%' },
            opacity: 0,
            x: -30,
            duration: 0.6,
            ease: 'power2.out',
          });
        });
      }

      /* sticky scroll reveal line — section-wipe */
      const line = sectionRef.current?.querySelector('.proc-line-fill');
      if (line) {
        gsap.from(line, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: 0.5,
          },
          scaleY: 0,
          transformOrigin: 'top center',
          ease: 'none',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  const steps = [0, 1, 2, 3];

  return (
    <section ref={sectionRef} className="section-pad">
      <div className="container-site">
        <div className="proc-header mb-16 lg:mb-20">
          <p className="label-overline mb-4">{t('eyebrow')}</p>
          <h1 className="display-h2 max-w-[700px] mb-6">{t('h1')}</h1>
          <p className="text-[18px] lg:text-[20px] text-[#9CA3AF] max-w-[560px] leading-relaxed">
            {t('intro')}
          </p>
        </div>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[26px] top-8 bottom-8 w-[1px] bg-[rgba(255,255,255,0.06)] hidden lg:block">
            <div className="proc-line-fill absolute inset-0 bg-gradient-to-b from-[#E8FF47] to-transparent" />
          </div>

          <div className="space-y-0">
            {steps.map((i) => (
              <div
                key={i}
                className="proc-step relative flex gap-8 lg:gap-12 py-10 lg:py-12 border-b border-[rgba(255,255,255,0.06)] last:border-0"
              >
                {/* Number circle */}
                <div className="flex-shrink-0 w-[52px] h-[52px] border border-[rgba(232,255,71,0.3)] rounded-full flex items-center justify-center relative z-10 bg-[#0A0A0A]">
                  <span className="text-[#E8FF47] font-700 text-[14px]">{t(`steps.${i}.number`)}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h2 className="display-h3 mb-4">{t(`steps.${i}.title`)}</h2>
                  <p className="text-[17px] lg:text-[18px] text-[#9CA3AF] leading-relaxed max-w-[600px]">
                    {t(`steps.${i}.body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
