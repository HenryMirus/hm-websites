'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

interface FAQTeaserProps {
  locale: 'de' | 'en';
}

const FAQ_PREVIEW_DE = [
  'Was macht HM Websites?',
  'Werden die Websites wirklich von KI-Agenten gebaut?',
  'Welche Technologie nutzt ihr?',
];

const FAQ_PREVIEW_EN = [
  'What does HM Websites do?',
  'Are the websites really built by AI agents?',
  'What technology do you use?',
];

export default function FAQTeaser({ locale }: FAQTeaserProps) {
  const t = useTranslations('faqTeaser');
  const sectionRef = useRef<HTMLElement>(null);
  const questions = locale === 'de' ? FAQ_PREVIEW_DE : FAQ_PREVIEW_EN;

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('.faqt-reveal');
      if (els) {
        gsap.from(els, {
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          opacity: 0,
          y: 24,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-pad bg-[#111111]">
      <div className="container-site">
        <h2 className="faqt-reveal display-h2 mb-12">{t('h2')}</h2>

        <div className="space-y-0 mb-12">
          {questions.map((q, i) => (
            <div
              key={i}
              className="faqt-reveal border-b border-[rgba(255,255,255,0.08)] py-5 flex items-center justify-between gap-4"
            >
              <p className="text-[17px] lg:text-[18px] text-[#F5F5F0]">{q}</p>
              <span className="text-[#E8FF47] flex-shrink-0 text-[20px]">+</span>
            </div>
          ))}
        </div>

        <Link
          href={`/${locale}/faq`}
          className="faqt-reveal inline-flex items-center gap-2 text-[#E8FF47] font-600 text-[16px] hover:gap-4 transition-all duration-200"
        >
          {t('cta')} →
        </Link>
      </div>
    </section>
  );
}
