'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface NavProps {
  locale: 'de' | 'en';
}

export default function Nav({ locale }: NavProps) {
  const t = useTranslations('nav');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLAnchorElement[]>([]);

  const altLocale = locale === 'de' ? 'en' : 'de';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* nav entrance on load — precision-micro */
  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.2,
    });
  }, { scope: navRef });

  /* mobile menu open/close — section-wipe pattern */
  useGSAP(() => {
    if (!menuRef.current) return;
    const links = menuLinksRef.current.filter(Boolean);

    if (menuOpen) {
      gsap.set(menuRef.current, { display: 'flex' });
      gsap.fromTo(menuRef.current,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
      gsap.from(links, {
        y: 30,
        opacity: 0,
        stagger: 0.06,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.15,
      });
    } else {
      gsap.to(menuRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => gsap.set(menuRef.current!, { display: 'none' }),
      });
    }
  }, { dependencies: [menuOpen] });

  const navLinks = [
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/process`, label: t('process') },
    { href: `/${locale}/faq`, label: t('faq') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 h-[60px] lg:h-[72px] transition-[border-color,backdrop-filter] duration-300 ${
          scrolled
            ? 'bg-[rgba(10,10,10,0.9)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.08)]'
            : 'bg-transparent'
        }`}
        aria-label="Main navigation"
      >
        <div className="container-site h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="text-[#F5F5F0] font-700 text-lg tracking-tight hover:text-[#E8FF47] transition-colors duration-200"
            aria-label="HM Websites — Home"
          >
            HM
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-500 text-[#9CA3AF] hover:text-[#F5F5F0] transition-colors duration-200 tracking-[0.005em]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right: lang switcher + CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href={`/${altLocale}`}
              className="text-[13px] font-500 text-[#9CA3AF] hover:text-[#F5F5F0] transition-colors duration-200 uppercase tracking-widest"
              aria-label={`Switch to ${altLocale.toUpperCase()}`}
            >
              {altLocale.toUpperCase()}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="text-[14px] font-500 border border-[#E8FF47] text-[#E8FF47] px-5 py-2 rounded-[4px] hover:bg-[#E8FF47] hover:text-[#0A0A0A] transition-all duration-200"
            >
              {t('cta')}
            </Link>
          </div>

          {/* Mobile: lang + hamburger */}
          <div className="flex lg:hidden items-center gap-4">
            <Link
              href={`/${altLocale}`}
              className="text-[12px] font-500 text-[#9CA3AF] hover:text-[#F5F5F0] transition-colors uppercase tracking-widest"
            >
              {altLocale.toUpperCase()}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#F5F5F0] p-2 -mr-2"
              aria-label={menuOpen ? t('menuClose') : t('menuOpen')}
              aria-expanded={menuOpen}
            >
              <span className="sr-only">{menuOpen ? t('menuClose') : t('menuOpen')}</span>
              <div className="w-6 flex flex-col gap-[5px]">
                <span className={`block h-[1.5px] bg-current transition-transform duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                <span className={`block h-[1.5px] bg-current transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-[1.5px] bg-current transition-transform duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-[#0A0A0A] flex flex-col justify-center px-8"
        style={{ display: 'none' }}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col gap-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => { if (el) menuLinksRef.current[i] = el; }}
              onClick={() => setMenuOpen(false)}
              className="text-[40px] font-700 text-[#F5F5F0] hover:text-[#E8FF47] transition-colors duration-200 tracking-tight leading-none"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>
        <div className="mt-12">
          <Link
            href={`/${locale}/contact`}
            onClick={() => setMenuOpen(false)}
            className="inline-block text-[16px] font-500 border border-[#E8FF47] text-[#E8FF47] px-6 py-3 rounded-[4px] hover:bg-[#E8FF47] hover:text-[#0A0A0A] transition-all duration-200"
          >
            {t('cta')} →
          </Link>
        </div>
      </div>
    </>
  );
}
