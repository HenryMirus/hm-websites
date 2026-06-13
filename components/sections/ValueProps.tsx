'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

interface ValuePropsProps {
  locale: 'de' | 'en';
}

const ITEMS_DE = [
  { title: 'Individuelles Design', text: 'Ein Auftritt, den es nur einmal gibt — auf Ihre Marke zugeschnitten.' },
  { title: 'Cinematisches Motion Design', text: 'Animationen, die Geschichten erzählen statt nur zu schmücken.' },
  { title: 'Von KI-Agenten gebaut', text: 'Ein Team aus KI-Agenten entwickelt Ihre Website — schneller, konsistent, in gleichbleibender Spitzenqualität.' },
];

const ITEMS_EN = [
  { title: 'Custom design', text: 'A presence that exists only once — tailored to your brand.' },
  { title: 'Cinematic motion', text: 'Animation that tells a story instead of just decorating.' },
  { title: 'Built by AI agents', text: 'A team of AI agents builds your site — faster, consistent, at a constant top quality.' },
];

export default function ValueProps({ locale }: ValuePropsProps) {
  const t = useTranslations('valueProps');
  const sectionRef = useRef<HTMLElement>(null);
  const items = locale === 'de' ? ITEMS_DE : ITEMS_EN;

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const heading = sectionRef.current?.querySelector('.vp-heading');
      const body = sectionRef.current?.querySelector('.vp-body');
      const cards = sectionRef.current?.querySelectorAll('.vp-card');

      /* cinematic-reveal on each element */
      gsap.from([heading, body], {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power2.out',
      });

      if (cards) {
        gsap.from(cards, {
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          opacity: 0,
          y: 40,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power2.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-pad bg-[#111111]">
      <div className="container-site">
        <h2 className="vp-heading display-h2 max-w-[700px] mb-6">{t('h2')}</h2>
        <p className="vp-body text-[18px] lg:text-[20px] text-[#9CA3AF] max-w-[600px] leading-relaxed mb-16 lg:mb-20">
          {t('body')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="vp-card bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] rounded-[4px] p-8 hover:border-[rgba(232,255,71,0.2)] transition-colors duration-300"
            >
              <span className="label-overline text-[#E8FF47] mb-4 block">0{i + 1}</span>
              <h3 className="text-[20px] font-600 text-[#F5F5F0] mb-3">{item.title}</h3>
              <p className="text-[16px] text-[#9CA3AF] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
