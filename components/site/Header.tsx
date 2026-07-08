"use client";

/**
 * Header (Masterplan §4.2): sticky, 64 px, Substrat mit 1-px-Haarlinie unten;
 * über dunklen Sektionen invertiert (Section-Observer auf [data-theme="lack"]).
 *
 * „Leistungen" öffnet ein strukturiertes Dropdown-Panel: vier Spaltenblöcke
 * nach Portfolio-Teilen A–D, jede Leistung eine Zeile mit Mono-Preisspanne
 * rechts, Panel im Bestückungsdruck-Rahmen. Links auf /leistungen#anker
 * (v1.0 — Detailseiten folgen in v1.1, Anker bleiben gültig).
 *
 * Mobil: vollflächiges Overlay in Lack, nummerierte Mono-Liste, Slide-in
 * 0,4 s power3.out, Fokus-Trap, ESC schließt.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Monogram from "@/components/brand/Monogram";
import {
  GRUPPEN,
  LEISTUNGEN,
  leistungenByGruppe,
  type Gruppe,
  type Lang,
} from "@/content/leistungen";
import { localePath, switchLangPath } from "@/lib/i18n";
import { gsap, useGSAP, MM_CONDITIONS } from "@/lib/motion/gsap";

const NAV = [
  { href: "/prozess", label: { de: "Prozess", en: "Process" } },
  { href: "/preise", label: { de: "Preise", en: "Pricing" } },
  { href: "/ueber", label: { de: "Über", en: "About" } },
] as const;

const T = {
  cta: { de: "Projekt anfragen", en: "Start a project" },
  leistungen: { de: "Leistungen", en: "Services" },
  aufAnfrage: { de: "auf Anfrage", en: "on request" },
  menue: { de: "Menü öffnen", en: "Open menu" },
  menueZu: { de: "Menü schließen", en: "Close menu" },
  home: { de: "HM Labs — Startseite", en: "HM Labs — home" },
} as const;

export default function Header({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  /* ——— Section-Observer: Header invertiert über Lack-Sektionen ——— */
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(
      '[data-theme="lack"]'
    );
    if (sections.length === 0) {
      setDark(false);
      return;
    }
    const check = () => {
      const y = 32; // Header-Mitte
      let isDark = false;
      sections.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) isDark = true;
      });
      setDark(isDark);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname]);

  /* ——— Dropdown: außenklick + ESC ——— */
  useEffect(() => {
    if (!dropOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!dropRef.current?.contains(e.target as Node)) setDropOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropOpen]);

  /* ——— Mobile-Overlay: Slide-in, Fokus-Trap, ESC, Scroll-Lock ——— */
  const { contextSafe } = useGSAP({ scope: overlayRef });

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!mobileOpen || !overlay) return;

    document.body.style.overflow = "hidden";

    const mm = gsap.matchMedia();
    mm.add(MM_CONDITIONS.motionOk, () => {
      const tl = gsap.timeline();
      tl.fromTo(
        overlay,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.4, ease: "power3.out" }
      ).fromTo(
        overlay.querySelectorAll("[data-mobile-item]"),
        { autoAlpha: 0, x: 24 },
        { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power3.out" },
        "-=0.15"
      );
    });
    mm.add(MM_CONDITIONS.reduce, () => {
      gsap.set(overlay, { xPercent: 0 });
      gsap.set(overlay.querySelectorAll("[data-mobile-item]"), {
        autoAlpha: 1,
        x: 0,
      });
    });

    // Fokus-Trap
    const focusables = overlay.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        burgerRef.current?.focus();
      }
      if (e.key === "Tab" && focusables.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      mm.revert();
    };
  }, [mobileOpen, contextSafe]);

  /* Route-Wechsel schließt alles */
  useEffect(() => {
    setDropOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  /* Resize auf Desktop schließt das Mobile-Overlay (sonst bleibt der
     body-Scroll-Lock aktiv, während das Overlay lg:hidden ist) */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const inv = dark && !mobileOpen;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300 ${
        inv ? "on-lack" : ""
      }`}
      style={{
        background: inv ? "var(--lack)" : "var(--substrat)",
        borderBottom: `1px solid ${inv ? "var(--linie-invers)" : "var(--linie)"}`,
        color: inv ? "var(--text-invers)" : "var(--text)",
      }}
    >
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-6">
        {/* Wortmarke */}
        <Link
          href={localePath("/", lang)}
          aria-label={T.home[lang]}
          className="flex items-center gap-3"
        >
          <Monogram size={26} />
          <span
            className="whitespace-nowrap font-display text-[1.05rem] font-bold tracking-tight"
            style={{ fontStretch: "118%" }}
          >
            HM LABS
          </span>
        </Link>

        {/* Desktop-Navigation */}
        <nav
          aria-label={lang === "de" ? "Hauptnavigation" : "Main navigation"}
          className="hidden items-center gap-8 lg:flex"
        >
          {/* Leistungen-Dropdown */}
          <div ref={dropRef} className="relative">
            <button
              type="button"
              aria-expanded={dropOpen}
              aria-haspopup="true"
              onClick={() => setDropOpen((o) => !o)}
              className="via-link flex items-center gap-1.5 text-[0.9375rem] font-medium"
            >
              {T.leistungen[lang]}
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                aria-hidden="true"
                className={`transition-transform duration-300 ${dropOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M1 1 L5 5 L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </button>

            {dropOpen && (
              <div
                className="corner-frame absolute left-1/2 top-[calc(100%+12px)] w-[720px] -translate-x-1/2 p-8"
                style={{
                  background: "var(--flaeche)",
                  color: "var(--text)",
                  boxShadow: "0 4px 8px rgba(23,35,29,0.06)",
                  border: "1px solid var(--linie)",
                  borderRadius: "var(--radius)",
                }}
              >
                <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                  {(["A", "B", "C", "D"] as Gruppe[]).map((g) => (
                    <div key={g}>
                      <p className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
                        [{g}] {GRUPPEN[g][lang]}
                      </p>
                      <ul className="space-y-1">
                        {leistungenByGruppe(g).map((l) => (
                          <li key={l.id}>
                            <Link
                              href={localePath(`/leistungen#${l.id}`, lang)}
                              onClick={() => setDropOpen(false)}
                              className="group flex items-baseline justify-between gap-4 rounded-pad px-2 py-1.5 transition-colors hover:bg-substrat"
                            >
                              <span className="text-[0.875rem] font-medium">
                                {l.name[lang]}
                              </span>
                              <span
                                className="messwert whitespace-nowrap text-[0.72rem]"
                                style={{ color: "var(--text-gedimmt)" }}
                              >
                                {l.preis ? l.preis[lang] : T.aufAnfrage[lang]}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {NAV.map((item) => (
            <Link
              key={item.href}
              href={localePath(item.href, lang)}
              className="via-link text-[0.9375rem] font-medium"
              aria-current={
                pathname === localePath(item.href, lang) ? "page" : undefined
              }
            >
              {item.label[lang]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {/* Sprachumschalter */}
          <Link
            href={switchLangPath(pathname, lang === "de" ? "en" : "de")}
            className="via-link messwert text-[0.78rem] uppercase tracking-widest"
            aria-label={
              lang === "de" ? "Switch to English" : "Zu Deutsch wechseln"
            }
            hrefLang={lang === "de" ? "en" : "de"}
          >
            {lang === "de" ? "EN" : "DE"}
          </Link>

          {/* CTA — der einzige gefüllte Button im Header.
              Wrapper nötig: .btn-pad setzt display und würde Tailwinds
              .hidden per Quellreihenfolge überschreiben. */}
          <span className="hidden lg:block">
            <Link href={localePath("/kontakt", lang)} className="btn-pad">
              {T.cta[lang]}
            </Link>
          </span>

          {/* Mobile-Burger */}
          <button
            ref={burgerRef}
            type="button"
            className="relative flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? T.menueZu[lang] : T.menue[lang]}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">
              {mobileOpen ? T.menueZu[lang] : T.menue[lang]}
            </span>
            <span aria-hidden="true" className="block h-4 w-6">
              <span
                className="absolute block h-[1.5px] w-6 bg-current transition-transform duration-300"
                style={{
                  transform: mobileOpen
                    ? "translateY(0) rotate(45deg)"
                    : "translateY(-5px)",
                }}
              />
              <span
                className="absolute block h-[1.5px] w-6 bg-current transition-transform duration-300"
                style={{
                  transform: mobileOpen
                    ? "translateY(0) rotate(-45deg)"
                    : "translateY(5px)",
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* ——— Mobile-Overlay (Lack) ——— */}
      {mobileOpen && (
        <div
          ref={overlayRef}
          className="on-lack fixed inset-0 top-16 z-40 overflow-y-auto lg:hidden"
          style={{ background: "var(--lack)", color: "var(--text-invers)" }}
          role="dialog"
          aria-modal="true"
          aria-label={lang === "de" ? "Navigation" : "Navigation"}
        >
          <nav className="dot-grid flex min-h-full flex-col justify-between px-6 py-10">
            <ul className="space-y-2">
              {[
                { href: "/leistungen", label: T.leistungen[lang] },
                ...NAV.map((n) => ({ href: n.href, label: n.label[lang] })),
                {
                  href: "/kontakt",
                  label: lang === "de" ? "Kontakt" : "Contact",
                },
              ].map((item, i) => (
                <li key={item.href} data-mobile-item>
                  <Link
                    href={localePath(item.href, lang)}
                    className="flex items-baseline gap-4 py-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span
                      className="messwert text-[0.78rem]"
                      style={{ color: "var(--kupfer-hell)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-display text-3xl font-bold"
                      style={{ fontStretch: "112%" }}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div data-mobile-item className="mt-10">
              <Link
                href={localePath("/kontakt", lang)}
                className="btn-pad w-full"
                onClick={() => setMobileOpen(false)}
              >
                {T.cta[lang]}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
