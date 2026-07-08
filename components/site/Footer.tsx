/**
 * Footer (Masterplan §4.2) — der „Lötstopp-Abschluss" jeder Seite: Lack, dunkel.
 * Zeile 1: Monogramm groß (Trace-Draw beim Erreichen), Claim.
 * Zeile 2: DREI UNGLEICHE Spalten (bewusst nicht vier gleiche — Bannliste).
 * Zeile 3: Mono-Zeile + PageSpeed-Einladung + Cookie-Hinweis.
 * /agb bleibt unverlinkt bis zur anwaltlichen Freigabe (offene Entscheidung 7).
 */
import Link from "next/link";
import Monogram from "@/components/brand/Monogram";
import TraceDraw from "@/components/animations/TraceDraw";
import { LEISTUNGEN, type Lang } from "@/content/leistungen";
import { localePath } from "@/lib/i18n";
import { EMAIL } from "@/lib/config/email";

const T = {
  claim: {
    de: "Wir zeigen die Konstruktion.",
    en: "We show the construction.",
  },
  leistungen: { de: "Leistungen", en: "Services" },
  unternehmen: { de: "Unternehmen", en: "Company" },
  kontakt: { de: "Kontakt", en: "Contact" },
  erreichbar: {
    de: "Antwort in der Regel innerhalb eines Werktags",
    en: "Reply usually within one business day",
  },
  recht: { de: "Rechtliches", en: "Legal" },
  impressum: { de: "Impressum", en: "Legal notice" },
  datenschutz: { de: "Datenschutz", en: "Privacy" },
  barrierefreiheit: { de: "Barrierefreiheit", en: "Accessibility" },
  pagespeed: {
    de: "Diese Website erreicht Lighthouse ≥ 90 — prüfen Sie es selbst.",
    en: "This website scores Lighthouse ≥ 90 — check for yourself.",
  },
  cookies: {
    de: "Diese Website kommt ohne Tracking-Cookies aus.",
    en: "This website works without tracking cookies.",
  },
} as const;

const UNTERNEHMEN_LINKS = [
  { href: "/prozess", label: { de: "Prozess", en: "Process" } },
  { href: "/ueber", label: { de: "Über HM Labs", en: "About HM Labs" } },
  { href: "/preise", label: { de: "Preise", en: "Pricing" } },
  { href: "/kontakt", label: { de: "Kontakt", en: "Contact" } },
] as const;

export default function Footer({ lang }: { lang: Lang }) {
  return (
    <footer
      className="on-lack dot-grid"
      data-theme="lack"
      style={{ background: "var(--lack)", color: "var(--text-invers)" }}
      aria-label={lang === "de" ? "Fußzeile" : "Footer"}
    >
      <div className="mx-auto max-w-content px-6 py-16 md:py-20">
        {/* Zeile 1 — Monogramm + Claim */}
        <div className="mb-14 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <TraceDraw scrub={false} start="top 90%">
            <Monogram size={72} pathClassName="trace-path" />
          </TraceDraw>
          <p
            className="font-display text-2xl font-bold md:text-3xl"
            style={{ fontStretch: "112%" }}
          >
            {T.claim[lang]}
          </p>
        </div>

        {/* Zeile 2 — drei ungleiche Spalten */}
        <div className="grid gap-12 border-t pt-12 md:grid-cols-[2fr_1fr_1.4fr]"
          style={{ borderColor: "var(--linie-invers)" }}
        >
          {/* ① Leistungen — komplette Liste (SEO-relevant) */}
          <nav aria-label={T.leistungen[lang]}>
            <p className="eyebrow mb-4" style={{ color: "var(--kupfer-hell)" }}>
              {T.leistungen[lang]}
            </p>
            <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {LEISTUNGEN.map((l) => (
                <li key={l.id}>
                  <Link
                    href={localePath(`/leistungen#${l.id}`, lang)}
                    className="via-link text-[0.875rem]"
                    style={{ color: "var(--text-invers-ged)" }}
                  >
                    {l.name[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ② Unternehmen */}
          <nav aria-label={T.unternehmen[lang]}>
            <p className="eyebrow mb-4" style={{ color: "var(--kupfer-hell)" }}>
              {T.unternehmen[lang]}
            </p>
            <ul className="space-y-2">
              {UNTERNEHMEN_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localePath(item.href, lang)}
                    className="via-link text-[0.875rem]"
                    style={{ color: "var(--text-invers-ged)" }}
                  >
                    {item.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ③ Kontaktblock + Rechtsliste */}
          <div>
            <p className="eyebrow mb-4" style={{ color: "var(--kupfer-hell)" }}>
              {T.kontakt[lang]}
            </p>
            <address className="not-italic">
              <p className="text-[0.875rem]" style={{ color: "var(--text-invers-ged)" }}>
                HM Labs
                <br />
                Pantaleonstraße 20
                <br />
                53567 Buchholz (Westerwald)
              </p>
              <p className="mt-3">
                <a
                  href={`mailto:${EMAIL.CONTACT}`}
                  className="via-link text-[0.875rem]"
                  style={{ color: "var(--text-invers)" }}
                >
                  {EMAIL.CONTACT}
                </a>
              </p>
              <p
                className="messwert mt-2 text-[0.72rem] uppercase tracking-widest"
                style={{ color: "var(--text-invers-ged)" }}
              >
                {T.erreichbar[lang]}
              </p>
            </address>

            <nav aria-label={T.recht[lang]} className="mt-8">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {/* /agb folgt nach anwaltlicher Prüfung */}
                <li>
                  <Link href="/impressum" className="via-link text-[0.8125rem]"
                    style={{ color: "var(--text-invers-ged)" }}>
                    {T.impressum[lang]}
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="via-link text-[0.8125rem]"
                    style={{ color: "var(--text-invers-ged)" }}>
                    {T.datenschutz[lang]}
                  </Link>
                </li>
                <li>
                  <Link href="/barrierefreiheit" className="via-link text-[0.8125rem]"
                    style={{ color: "var(--text-invers-ged)" }}>
                    {T.barrierefreiheit[lang]}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Zeile 3 — Mono-Abschluss */}
        <div
          className="mt-14 flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "var(--linie-invers)" }}
        >
          <p
            className="messwert text-[0.7rem] uppercase tracking-[0.14em]"
            style={{ color: "var(--text-invers-ged)" }}
          >
            HM LABS · BUCHHOLZ (WESTERWALD) · LIGHTHOUSE-GEPRÜFT · SELF-HOSTED
            IN DER EU
          </p>
          <p className="text-[0.78rem]" style={{ color: "var(--text-invers-ged)" }}>
            <a
              href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fhm-labs.de"
              target="_blank"
              rel="noopener noreferrer"
              className="via-link"
              style={{ color: "var(--text-invers-ged)" }}
            >
              {T.pagespeed[lang]}
            </a>
            {" · "}
            {T.cookies[lang]}
          </p>
        </div>
      </div>
    </footer>
  );
}
