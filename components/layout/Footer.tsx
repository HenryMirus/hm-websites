'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const navLinks = [
    { href: `/${locale}/services`, label: t('nav.services') },
    { href: `/${locale}/process`, label: t('nav.process') },
    { href: `/${locale}/faq`, label: t('nav.faq') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ];

  const legalLinks = [
    { href: `/${locale}/impressum`, label: t('nav.impressum') },
    { href: `/${locale}/datenschutz`, label: t('nav.datenschutz') },
  ];

  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] py-16 mt-auto">
      <div className="container-site">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-0 lg:justify-between">
          {/* Brand */}
          <div className="flex-shrink-0">
            <div className="text-xl font-700 tracking-tight text-[#F5F5F0] mb-3">HM Websites</div>
            <p className="text-[13px] text-[#9CA3AF] max-w-[220px] leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-3" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] text-[#9CA3AF] hover:text-[#F5F5F0] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Legal links */}
          <nav className="flex flex-col gap-3" aria-label="Legal navigation">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] text-[#9CA3AF] hover:text-[#F5F5F0] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.05)] flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-[12px] text-[#9CA3AF]">{t('copyright')}</p>
          <p className="text-[12px] text-[#9CA3AF] opacity-50">
            Built by AI agents.
          </p>
        </div>
      </div>
    </footer>
  );
}
