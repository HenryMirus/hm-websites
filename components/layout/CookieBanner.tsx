'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function CookieBanner() {
  const t = useTranslations('cookies');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('hm-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('hm-cookie-consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:max-w-md z-50 bg-[#111111] border border-[rgba(255,255,255,0.12)] rounded-[4px] p-5 shadow-2xl"
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-[13px] text-[#9CA3AF] leading-relaxed mb-4">
        {t('text')}{' '}
        <Link
          href={`/${locale}/datenschutz`}
          className="text-[#E8FF47] hover:underline"
        >
          Datenschutz
        </Link>
      </p>
      <div className="flex gap-3">
        <button
          onClick={accept}
          className="flex-1 bg-[#E8FF47] text-[#0A0A0A] text-[13px] font-600 px-4 py-2.5 rounded-[4px] hover:bg-white transition-colors duration-200"
        >
          {t('accept')}
        </button>
        <button
          onClick={() => setVisible(false)}
          className="flex-1 border border-[rgba(255,255,255,0.12)] text-[#9CA3AF] text-[13px] px-4 py-2.5 rounded-[4px] hover:border-[rgba(255,255,255,0.3)] transition-colors duration-200"
        >
          {t('settings')}
        </button>
      </div>
    </div>
  );
}
