/**
 * /preise (Masterplan §5.6) — Preistransparenz als Vertrauensfaktor.
 * Alle Spannen WÖRTLICH aus preislogik.yaml; Disclaimer-Box prominent oben.
 * Leistungen 09–12: auf Anfrage (Kalibrierung ausstehend).
 */
import SiteShell from "@/components/site/SiteShell";
import Reveal from "@/components/animations/Reveal";
import TraceDraw from "@/components/animations/TraceDraw";
import Link from "next/link";
import {
  GRUPPEN,
  LEISTUNGEN,
  PREIS_DISCLAIMER,
  WARTUNG_TIERS,
  ZAHLUNG,
  type Gruppe,
  type Lang,
} from "@/content/leistungen";
import { localePath } from "@/lib/i18n";

const T = {
  eyebrow: { de: "[S0] PREISE & ABLAUF", en: "[S0] PRICING & PROCESS" },
  h1: {
    de: "Transparente Spannen statt Lockangebote.",
    en: "Transparent ranges instead of bait offers.",
  },
  grundsatz: {
    de: "Jedes Projekt ist individuell — deshalb nennen wir Preise als Spannen, nie als Festpreis. Was Ihr Projekt konkret kostet, hängt von Umfang, Inhalten und Funktionen ab und wird in einem kostenlosen Erstgespräch geklärt. Die Spannen unten sind ehrliche Orientierungswerte aus vergleichbaren Projekten.",
    en: "Every project is individual — which is why we quote prices as ranges, never as fixed prices. What your project actually costs depends on scope, content and features, and is clarified in a free initial consultation. The ranges below are honest orientation values from comparable projects.",
  },
  tafel: { de: "Übersicht aller Leistungen", en: "Overview of all services" },
  aufAnfrage: { de: "auf Anfrage", en: "on request" },
  treiber: { de: "Was den Preis bewegt", en: "What moves the price" },
  treiberIntro: {
    de: "Innerhalb einer Spanne entscheiden vor allem diese Faktoren:",
    en: "Within a range, these factors decide most:",
  },
  zahlung: { de: "Zahlungsstruktur", en: "Payment structure" },
  kleinunternehmer: {
    de: "Alle Preise sind Endpreise — es kommt keine Umsatzsteuer hinzu (Kleinunternehmerregelung nach § 19 UStG).",
    en: "All prices are final — no VAT is added (German small-business rule, § 19 UStG).",
  },
  referenz: { de: "Referenzprogramm", en: "Reference programme" },
  referenzText: {
    de: "Die ersten Projekte entstehen zu Referenzkonditionen am unteren Rand der Spannen — im Gegenzug vereinbaren wir schriftlich Case-Study-Rechte: Das Projekt darf mit Screenshots, Ergebnis und Kundennamen als Referenz präsentiert werden.",
    en: "The first projects are built at reference conditions at the lower end of the ranges — in return we agree case-study rights in writing: the project may be presented as a reference with screenshots, results and client name.",
  },
  wartung: { de: "Wartung & Hosting — drei Tarife", en: "Maintenance & hosting — three tiers" },
  empfohlen: { de: "DEFAULT-EMPFEHLUNG", en: "DEFAULT RECOMMENDATION" },
  cta: { de: "Unverbindliche Einschätzung anfragen", en: "Request a non-binding assessment" },
} as const;

const TREIBER = [
  {
    name: { de: "Mehrsprachigkeit", en: "Multilingual content" },
    wert: "+25–35 %",
    hint: {
      de: "jede zusätzliche Sprache vergrößert Inhalte, Pflege und QA",
      en: "each additional language increases content, upkeep and QA",
    },
  },
  {
    name: { de: "CMS-Pflegbarkeit", en: "CMS editability" },
    wert: "+800–2.000 €",
    hint: {
      de: "Inhalte selbst pflegen statt Änderungsaufträge",
      en: "maintain content yourself instead of change requests",
    },
  },
  {
    name: { de: "Zusätzliche Seiten", en: "Additional pages" },
    wert: { de: "+300–600 € pro Seite", en: "+€300–600 per page" },
    hint: {
      de: "über den Basis-Umfang der Business-Website hinaus",
      en: "beyond the base scope of the business website",
    },
  },
  {
    name: { de: "Texterstellung durch HM", en: "Copywriting by HM" },
    wert: { de: "+150–350 € pro Seite", en: "+€150–350 per page" },
    hint: {
      de: "wenn Texte nicht vorliegen, schreiben wir sie",
      en: "if copy doesn't exist, we write it",
    },
  },
  {
    name: { de: "Buchungs-/Formularsystem", en: "Booking/form system" },
    wert: "+800–2.500 €",
    hint: {
      de: "je nach Komplexität der Abläufe",
      en: "depending on process complexity",
    },
  },
  {
    name: { de: "Schnittstellen zu Drittsystemen", en: "Third-party integrations" },
    wert: { de: "+1.000–3.000 € pro Integration", en: "+€1,000–3,000 per integration" },
    hint: {
      de: "CRM, Buchhaltung, Kalender & Co.",
      en: "CRM, accounting, calendars & co.",
    },
  },
] as const;

const FAQ_PREISE = [
  {
    frage: {
      de: "Warum nennen Sie keine Festpreise?",
      en: "Why don't you quote fixed prices?",
    },
    antwort: {
      de: "Weil ein seriöser Festpreis ohne Kenntnis des Projekts nicht möglich ist. Spannen zeigen Ihnen ehrlich, wo ein Projekt landet — das verbindliche Angebot folgt nach dem Erstgespräch, wenn der Umfang klar ist.",
      en: "Because a serious fixed price is impossible without knowing the project. Ranges show you honestly where a project lands — the binding quote follows the initial consultation, once scope is clear.",
    },
  },
  {
    frage: {
      de: "Wann bezahle ich?",
      en: "When do I pay?",
    },
    antwort: {
      de: `In Meilensteinen: bis 5.000 € gilt ${ZAHLUNG.bis5000.de}; darüber ${ZAHLUNG.ueber5000.de}. Laufende Leistungen werden ${ZAHLUNG.laufend.de} abgerechnet. Nie 100 % im Voraus.`,
      en: `In milestones: up to €5,000 it's ${ZAHLUNG.bis5000.en}; above that ${ZAHLUNG.ueber5000.en}. Recurring services are billed ${ZAHLUNG.laufend.en}. Never 100% upfront.`,
    },
  },
  {
    frage: {
      de: "Gibt es versteckte Kosten?",
      en: "Are there hidden costs?",
    },
    antwort: {
      de: "Nein. Preistreiber stehen vor Projektbeginn im Angebot, zwei Revisionsrunden sind inklusive, und alle Preise sind Endpreise ohne zusätzliche Umsatzsteuer (§ 19 UStG). Laufende Kosten (z. B. Hosting) stehen separat und transparent im Angebot.",
      en: "No. Price drivers are stated in the quote before the project starts, two revision rounds are included, and all prices are final without additional VAT (§ 19 UStG). Recurring costs (e.g. hosting) are listed separately and transparently in the quote.",
    },
  },
] as const;

export default function PreisePage({ lang }: { lang: Lang }) {
  return (
    <SiteShell lang={lang}>
      {/* ① Grundsatz + Disclaimer prominent */}
      <section className="mx-auto max-w-content px-6 pb-14 pt-20" data-via id="grundsatz">
        <p className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
          {T.eyebrow[lang]}
        </p>
        <h1 className="h-display max-w-4xl" style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}>
          {T.h1[lang]}
        </h1>
        <p className="mt-8 max-w-3xl" style={{ color: "var(--text-gedimmt)" }}>
          {T.grundsatz[lang]}
        </p>
        <aside
          className="mt-8 max-w-3xl border-l-2 py-3 pl-5 text-[0.875rem]"
          style={{ borderColor: "var(--kupfer)", color: "var(--text-gedimmt)" }}
        >
          {PREIS_DISCLAIMER[lang]}
        </aside>
      </section>

      {/* ② Übersichtstafel */}
      <section data-via id="tafel" aria-labelledby="tafel-h" style={{ background: "var(--substrat-tief)" }}>
        <div className="mx-auto max-w-content px-6 py-20">
          <Reveal>
            <h2 data-reveal id="tafel-h" className="h-section">
              {T.tafel[lang]}
            </h2>
          </Reveal>
          <div className="mt-10 space-y-10">
            {(["A", "B", "C", "D"] as Gruppe[]).map((g) => (
              <div key={g}>
                <p className="eyebrow mb-3" style={{ color: "var(--text-gedimmt)" }}>
                  {lang === "de" ? "TEIL" : "PART"} {g} — {GRUPPEN[g][lang].toUpperCase()}
                </p>
                <ul className="divide-y border-y" style={{ borderColor: "var(--linie)" }}>
                  {LEISTUNGEN.filter((l) => l.gruppe === g).map((l) => (
                    <li
                      key={l.id}
                      className="grid items-baseline gap-x-6 py-3.5 sm:grid-cols-[3rem_1fr_auto]"
                      style={{ borderColor: "var(--linie)" }}
                    >
                      <span className="messwert text-[0.8rem]" style={{ color: "var(--kupfer-tief)" }}>
                        {l.nr}
                      </span>
                      <Link
                        href={localePath(`/leistungen#${l.id}`, lang)}
                        className="via-link font-medium"
                      >
                        {l.name[lang]}
                      </Link>
                      <span className="messwert text-[0.85rem]">
                        {l.preis ? `${l.preis[lang]} *` : T.aufAnfrage[lang]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-[0.8125rem]" style={{ color: "var(--text-gedimmt)" }}>
            *&nbsp;{PREIS_DISCLAIMER[lang]}
          </p>
        </div>
      </section>

      {/* ③ Preistreiber */}
      <section data-via id="treiber" aria-labelledby="treiber-h" className="mx-auto max-w-content px-6 py-20">
        <Reveal>
          <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
            [S2] {lang === "de" ? "PREISTREIBER" : "PRICE DRIVERS"}
          </p>
          <h2 data-reveal id="treiber-h" className="h-section">
            {T.treiber[lang]}
          </h2>
          <p data-reveal className="mt-4 max-w-2xl" style={{ color: "var(--text-gedimmt)" }}>
            {T.treiberIntro[lang]}
          </p>
        </Reveal>
        <Reveal className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {TREIBER.map((t) => (
            <div key={t.name.de} data-reveal className="corner-frame p-6">
              <p className="font-medium">{t.name[lang]}</p>
              <p className="messwert mt-1 text-[0.9rem]" style={{ color: "var(--kupfer-tief)" }}>
                {typeof t.wert === "string" ? t.wert : t.wert[lang]}
              </p>
              <p className="mt-2 text-[0.8125rem]" style={{ color: "var(--text-gedimmt)" }}>
                {t.hint[lang]}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ④ Zahlungsstruktur als Leiterbahn */}
      <section data-via id="zahlung" aria-labelledby="zahlung-h" style={{ background: "var(--substrat-tief)" }}>
        <div className="mx-auto max-w-content px-6 py-20">
          <Reveal>
            <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
              [S3] {lang === "de" ? "ZAHLUNG" : "PAYMENT"}
            </p>
            <h2 data-reveal id="zahlung-h" className="h-section">
              {T.zahlung[lang]}
            </h2>
          </Reveal>

          <TraceDraw className="mt-12" start="top 80%" end="bottom 60%">
            <div className="relative">
              <svg
                viewBox="0 0 1000 12"
                preserveAspectRatio="none"
                className="absolute left-0 top-[5px] hidden h-3 w-full md:block"
                aria-hidden="true"
              >
                <path
                  className="trace-path"
                  d="M0 6 H1000"
                  pathLength={100}
                  fill="none"
                  stroke="var(--kupfer)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="relative grid gap-8 md:grid-cols-3">
                {[
                  {
                    label: { de: "BIS 5.000 €", en: "UP TO €5,000" },
                    text: ZAHLUNG.bis5000,
                  },
                  {
                    label: { de: "ÜBER 5.000 €", en: "ABOVE €5,000" },
                    text: ZAHLUNG.ueber5000,
                  },
                  {
                    label: { de: "LAUFENDE LEISTUNGEN", en: "RECURRING SERVICES" },
                    text: ZAHLUNG.laufend,
                  },
                ].map((z) => (
                  <div key={z.label.de} className="md:pt-8">
                    <span
                      className="absolute top-0 hidden h-3.5 w-3.5 rounded-full border-[1.5px] md:block"
                      style={{ borderColor: "var(--kupfer)", background: "var(--substrat-tief)" }}
                      aria-hidden="true"
                    />
                    <p className="eyebrow text-[0.7rem]" style={{ color: "var(--kupfer-tief)" }}>
                      {z.label[lang]}
                    </p>
                    <p className="mt-2 text-[0.9375rem]" style={{ color: "var(--text-gedimmt)" }}>
                      {z.text[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TraceDraw>

          {/* ⑤ Kleinunternehmer-Hinweis */}
          <p className="mt-12 max-w-3xl border-l-2 pl-5 text-[0.9375rem] font-medium"
            style={{ borderColor: "var(--kupfer)" }}>
            {T.kleinunternehmer[lang]}
          </p>
        </div>
      </section>

      {/* Wartungstarife — ungleiche Vergleichstafel */}
      <section data-via id="wartung-tarife" aria-labelledby="wartung-h" className="mx-auto max-w-content px-6 py-20">
        <Reveal>
          <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
            [S4] {lang === "de" ? "BETREUUNG" : "CARE"}
          </p>
          <h2 data-reveal id="wartung-h" className="h-section">
            {T.wartung[lang]}
          </h2>
        </Reveal>
        <Reveal className="mt-10 grid gap-6 md:grid-cols-[1.25fr_1fr_1fr]" stagger={0.1}>
          {WARTUNG_TIERS.map((tier) => (
            <div
              key={tier.name}
              data-reveal
              className="corner-frame flex flex-col p-7"
              style={tier.default ? { background: "var(--flaeche)" } : undefined}
            >
              {tier.default && (
                <p className="messwert mb-3 text-[0.65rem] uppercase tracking-widest"
                  style={{ color: "var(--kupfer-tief)" }}>
                  {T.empfohlen[lang]}
                </p>
              )}
              <h3 className="h-sub text-[1.1rem]">{tier.name}</h3>
              <p className="messwert mt-1" style={{ color: "var(--kupfer-tief)" }}>
                {tier.range[lang]} *
              </p>
              <p className="mt-3 text-[0.875rem]" style={{ color: "var(--text-gedimmt)" }}>
                {tier.umfang[lang]}
              </p>
            </div>
          ))}
        </Reveal>
        <p className="mt-6 max-w-3xl text-[0.8125rem]" style={{ color: "var(--text-gedimmt)" }}>
          *&nbsp;{PREIS_DISCLAIMER[lang]}
        </p>
      </section>

      {/* ⑥ Referenzprogramm */}
      <section data-via id="referenzprogramm" aria-labelledby="referenz-h" style={{ background: "var(--substrat-tief)" }}>
        <div className="mx-auto max-w-content px-6 py-20">
          <Reveal>
            <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
              [S5] {lang === "de" ? "REFERENZPHASE" : "REFERENCE PHASE"}
            </p>
            <h2 data-reveal id="referenz-h" className="h-section">
              {T.referenz[lang]}
            </h2>
            <p data-reveal className="mt-5 max-w-3xl" style={{ color: "var(--text-gedimmt)" }}>
              {T.referenzText[lang]}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ⑦ FAQ Preise + CTA */}
      <section
        data-via
        id="faq"
        aria-labelledby="preise-faq-h"
        className="mx-auto max-w-content px-6 py-20"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <Reveal>
          <h2 data-reveal id="preise-faq-h" className="h-sub">
            {lang === "de" ? "Häufige Fragen zu Preisen" : "Frequent pricing questions"}
          </h2>
        </Reveal>
        <div className="mt-6 max-w-3xl divide-y border-y" style={{ borderColor: "var(--linie)" }}>
          {FAQ_PREISE.map((f) => (
            <details
              key={f.frage.de}
              className="faq-item py-2"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <summary className="flex items-center justify-between gap-4 py-3">
                <span itemProp="name" className="h-sub text-[1.02rem]">
                  {f.frage[lang]}
                </span>
                <span className="faq-via" aria-hidden="true" />
              </summary>
              <div className="faq-body" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div>
                  <p itemProp="text" className="pb-4 pr-8 text-[0.9375rem]"
                    style={{ color: "var(--text-gedimmt)" }}>
                    {f.antwort[lang]}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-[0.8125rem]" style={{ color: "var(--text-gedimmt)" }}>
          {PREIS_DISCLAIMER[lang]}
        </p>
        <div className="mt-10">
          <Link href={localePath("/kontakt", lang)} className="btn-pad">
            {T.cta[lang]}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
