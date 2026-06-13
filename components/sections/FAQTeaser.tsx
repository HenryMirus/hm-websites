'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

interface FAQTeaserProps {
  locale: 'de' | 'en';
}

const PREVIEW_INDICES = [0, 1, 3];

function FAQTeaserItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!open) {
      setOpen(true);
      if (!prefersReduced && answerRef.current) {
        gsap.from(answerRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
        });
      }
    } else {
      if (!prefersReduced && answerRef.current) {
        gsap.to(answerRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => setOpen(false),
        });
      } else {
        setOpen(false);
      }
    }
  };

  return (
    <div className="faqt-reveal border-b border-[rgba(255,255,255,0.08)]">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between gap-6 py-5 text-left group"
        aria-expanded={open}
        aria-controls={`faqt-answer-${index}`}
      >
        <p className="text-[17px] lg:text-[18px] text-[#F5F5F0] group-hover:text-[#E8FF47] transition-colors duration-200">
          {question}
        </p>
        <span
          className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#E8FF47] text-[20px] transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {open && (
        <div
          ref={answerRef}
          id={`faqt-answer-${index}`}
          className="pb-5 pr-10"
        >
          <p className="text-[#9CA3AF] leading-relaxed text-[16px] lg:text-[17px]">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQTeaser({ locale }: FAQTeaserProps) {
  const t = useTranslations('faqTeaser');
  const tFaq = useTranslations('faq');
  const sectionRef = useRef<HTMLElement>(null);

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
          {PREVIEW_INDICES.map((itemIndex, i) => (
            <FAQTeaserItem
              key={itemIndex}
              question={tFaq(`items.${itemIndex}.q`)}
              answer={tFaq(`items.${itemIndex}.a`)}
              index={i}
            />
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
