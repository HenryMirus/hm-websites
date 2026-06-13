'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

interface FAQSectionProps {
  locale: 'de' | 'en';
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
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
    <div className="border-b border-[rgba(255,255,255,0.08)]">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
        aria-expanded={open}
        aria-controls={`faq-answer-${index}`}
      >
        <h3 className="text-[17px] lg:text-[18px] font-500 text-[#F5F5F0] group-hover:text-[#E8FF47] transition-colors duration-200">
          {question}
        </h3>
        <span
          className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#E8FF47] transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {open && (
        <div
          ref={answerRef}
          id={`faq-answer-${index}`}
          className="pb-6 pr-10"
        >
          <p className="text-[#9CA3AF] leading-relaxed text-[16px] lg:text-[17px]">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection({ locale }: FAQSectionProps) {
  const t = useTranslations('faq');
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector('.faq-header');
      if (header) {
        gsap.from(header, {
          scrollTrigger: { trigger: header, start: 'top 85%' },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      const items = sectionRef.current?.querySelectorAll('.faq-item');
      if (items) {
        items.forEach((item) => {
          gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 90%' },
            opacity: 0,
            y: 16,
            duration: 0.5,
            ease: 'power2.out',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  const items = [0, 1, 2, 3, 4, 5, 6];

  return (
    <section ref={sectionRef} className="section-pad">
      <div className="container-site">
        <div className="faq-header mb-16">
          <p className="label-overline mb-4">{t('eyebrow')}</p>
          <h1 className="display-h2 max-w-[700px] mb-6">{t('h1')}</h1>
          <p className="text-[18px] lg:text-[20px] text-[#9CA3AF] max-w-[560px] leading-relaxed">
            {t('intro')}
          </p>
        </div>

        <div className="max-w-[780px]">
          {items.map((i) => (
            <div key={i} className="faq-item">
              <FAQItem
                question={t(`items.${i}.q`)}
                answer={t(`items.${i}.a`)}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
