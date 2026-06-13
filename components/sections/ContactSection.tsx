'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { submitContactForm } from '@/app/[locale]/contact/actions';

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
  locale: 'de' | 'en';
}

export default function ContactSection({ locale }: ContactSectionProps) {
  const t = useTranslations('contact');
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('.contact-reveal');
      if (els) {
        gsap.from(els, {
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string || undefined,
      message: formData.get('message') as string,
    };

    const result = await submitContactForm(data);

    if (result.success) {
      setStatus('success');
      formRef.current?.reset();
    } else {
      setStatus('error');
      setErrorMsg(result.error ?? '');
    }
  }

  const inputClass =
    'w-full bg-[#111111] border border-[rgba(255,255,255,0.12)] rounded-[4px] px-4 py-3.5 text-[#F5F5F0] text-[16px] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#E8FF47] transition-colors duration-200';

  const labelClass = 'block text-[13px] font-500 text-[#9CA3AF] mb-2 uppercase tracking-wide';

  return (
    <section ref={sectionRef} className="section-pad">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: heading */}
          <div>
            <p className="contact-reveal label-overline mb-4">{t('eyebrow')}</p>
            <h1 className="contact-reveal display-h2 mb-6">{t('h1')}</h1>
            <p className="contact-reveal text-[18px] lg:text-[20px] text-[#9CA3AF] leading-relaxed max-w-[420px]">
              {t('intro')}
            </p>

            <div className="contact-reveal mt-10 space-y-3">
              <a
                href="mailto:mrs.hrny@gmail.com"
                className="flex items-center gap-3 text-[#9CA3AF] hover:text-[#F5F5F0] transition-colors duration-200 text-[16px]"
              >
                <span className="text-[#E8FF47]">✉</span>
                mrs.hrny@gmail.com
              </a>
              <a
                href="tel:+49015750126303"
                className="flex items-center gap-3 text-[#9CA3AF] hover:text-[#F5F5F0] transition-colors duration-200 text-[16px]"
              >
                <span className="text-[#E8FF47]">☎</span>
                +49 015750126303
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="contact-reveal">
            {status === 'success' ? (
              <div className="bg-[#111111] border border-[rgba(232,255,71,0.3)] rounded-[4px] p-8">
                <p className="text-[#E8FF47] text-[18px] font-600 mb-2">✓</p>
                <p className="text-[#F5F5F0] text-[18px] leading-relaxed">
                  {t('form.success')}
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>
                    {t('form.name')}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder={t('form.namePlaceholder')}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    {t('form.email')}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={t('form.emailPlaceholder')}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-company" className={labelClass}>
                    {t('form.company')}
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder={t('form.companyPlaceholder')}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    {t('form.message')}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder={t('form.messagePlaceholder')}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-[#ff6b6b] text-[14px]">
                    {t('form.error')}
                  </p>
                )}

                <p className="text-[12px] text-[#9CA3AF]">
                  {t('form.privacyNote')}{' '}
                  <Link href={`/${locale}/datenschutz`} className="text-[#E8FF47] hover:underline">
                    Datenschutz
                  </Link>
                </p>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#E8FF47] text-[#0A0A0A] font-700 text-[16px] py-4 rounded-[4px] min-h-[52px] hover:bg-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? t('form.submitting') : t('form.submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
