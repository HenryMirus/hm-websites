/**
 * /leistungen (Masterplan §5.2) — vollständiger Katalog.
 * v1.0 trägt diese Seite den gesamten Leistungscontent; ab v1.1 wird sie
 * Verteiler auf Detailseiten (Anker bleiben gültig — keine toten Links).
 *
 * Preise: nur Spannen aus preislogik.yaml; Pflicht-Disclaimer einmal pro
 * Kapitel als Box mit Kupfer-Linksborder. Leistungen 09–12 ohne Spanne
 * (Kalibrierung ausstehend — YAML-Regel).
 */
import SiteShell from "@/components/site/SiteShell";
import Reveal from "@/components/animations/Reveal";
import Link from "next/link";
import {
  GRUPPEN,
  LEISTUNGEN,
  PREIS_DISCLAIMER,
  REVISIONEN,
  ZAHLUNG,
  type Gruppe,
  type Lang,
} from "@/content/leistungen";
import { localePath } from "@/lib/i18n";

const T = {
  eyebrow: { de: "[S0] LEISTUNGEN & PREISSPANNEN", en: "[S0] SERVICES & PRICE RANGES" },
  h1: { de: "Dreizehn Leistungen, ein Anspruch.", en: "Thirteen services, one standard." },
  intro: {
    de: "HM Labs baut individuelle, handgefertigte Websites und digitale Lösungen — kein Baukasten, keine Templates, keine austauschbaren Designs. Jedes Projekt wird für den Kunden entworfen, mit eigenem Animationskonzept, technischer Qualität auf Messniveau (Lighthouse 90+) und eingebauter Zukunftssicherheit: Sichtbarkeit in KI-Suchsystemen (GAIO) und DSGVO-native KI-Funktionen auf EU-Servern. Ein fester Ansprechpartner, die Leistungsbreite einer Agentur, Preise zwischen Freelancer und klassischer Agentur.",
    en: "HM Labs builds individual, hand-crafted websites and digital solutions — no site builders, no templates, no interchangeable designs. Every project is designed for the client, with its own animation concept, technical quality at measurable level (Lighthouse 90+) and built-in future-proofing: visibility in AI search systems (GAIO) and GDPR-native AI features on EU servers. One fixed point of contact, the range of an agency, prices between freelancer and traditional agency.",
  },
  wasIst: { de: "Was ist das?", en: "What is it?" },
  fuerWen: { de: "Für wen?", en: "For whom?" },
  enthalten: { de: "Enthalten", en: "Included" },
  zeitrahmen: { de: "ZEITRAHMEN (RICHTWERT)", en: "TIMEFRAME (GUIDE)" },
  preisrahmen: { de: "PREISRAHMEN", en: "PRICE RANGE" },
  aufAnfrage: {
    de: "auf Anfrage — das klärt Henry persönlich",
    en: "on request — Henry clarifies this personally",
  },
  grundsaetze: { de: "Verbindliche Grundsätze", en: "Binding principles" },
  cta: { de: "Projekt anfragen", en: "Start a project" },
} as const;

const GRUNDSAETZE = (lang: Lang) => [
  lang === "de"
    ? "Preise nennen wir nur als Spannen, nie als Festpreis — jedes Projekt ist individuell."
    : "We only quote prices as ranges, never as fixed prices — every project is individual.",
  lang === "de"
    ? "Keine Garantien, keine Zusicherungen, keine festen Lieferzeiten — Zeitangaben sind Richtwerte."
    : "No guarantees, no assurances, no fixed delivery dates — time indications are guide values.",
  lang === "de"
    ? `Zahlungsstruktur: bis 5.000 €: ${ZAHLUNG.bis5000.de}. Über 5.000 €: ${ZAHLUNG.ueber5000.de}. Laufende Leistungen ${ZAHLUNG.laufend.de}.`
    : `Payment structure: up to €5,000: ${ZAHLUNG.bis5000.en}. Above €5,000: ${ZAHLUNG.ueber5000.en}. Recurring services ${ZAHLUNG.laufend.en}.`,
  lang === "de"
    ? `${REVISIONEN.inklusive} Revisionsrunden sind in jedem Projekt inklusive; ${REVISIONEN.weitere.de}.`
    : `${REVISIONEN.inklusive} revision rounds are included in every project; ${REVISIONEN.weitere.en}.`,
];

function DisclaimerBox({ lang }: { lang: Lang }) {
  return (
    <aside
      className="border-l-2 py-3 pl-5 text-[0.8125rem]"
      style={{ borderColor: "var(--kupfer)", color: "var(--text-gedimmt)" }}
    >
    {PREIS_DISCLAIMER[lang]}
    </aside>
  );
}

export default function LeistungenPage({ lang }: { lang: Lang }) {
  return (
    <SiteShell lang={lang}>
      {/* Kompakt-Hero, hell */}
      <section className="mx-auto max-w-content px-6 pb-16 pt-20" data-via id="intro">
        <p className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
          {T.eyebrow[lang]}
        </p>
        <h1 className="h-display max-w-4xl" style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}>
          {T.h1[lang]}
        </h1>
        <p className="mt-8 max-w-3xl" style={{ color: "var(--text-gedimmt)" }}>
          {T.intro[lang]}
        </p>
      </section>

      {/* Kapitel A–D */}
      {(["A", "B", "C", "D"] as Gruppe[]).map((g, gi) => (
        <section
          key={g}
          id={`teil-${g.toLowerCase()}`}
          data-via
          aria-label={`${lang === "de" ? "Teil" : "Part"} ${g} — ${GRUPPEN[g][lang]}`}
          className={gi % 2 === 1 ? "" : undefined}
          style={gi % 2 === 1 ? { background: "var(--substrat-tief)" } : undefined}
        >
          <div className="mx-auto max-w-content px-6 py-16">
            <Reveal>
              <p data-reveal className="eyebrow mb-8" style={{ color: "var(--kupfer-tief)" }}>
                [S{gi + 1}] {lang === "de" ? "TEIL" : "PART"} {g} — {GRUPPEN[g][lang].toUpperCase()}
              </p>
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-2">
              {LEISTUNGEN.filter((l) => l.gruppe === g).map((l) => (
                <Reveal
                  key={l.id}
                  as="article"
                  className="corner-frame flex flex-col p-7 md:p-8"
                  stagger={0.08}
                >
                  <div data-reveal id={l.id} className="scroll-mt-24">
                    <p className="messwert text-[0.72rem]" style={{ color: "var(--kupfer-tief)" }}>
                      {l.nr}
                    </p>
                    <h2 className="h-sub mt-1">{l.name[lang]}</h2>
                    {l.badge && (
                      <span
                        className="messwert mt-2 inline-block rounded-pad border px-2 py-0.5 text-[0.65rem] uppercase tracking-widest"
                        style={{ borderColor: "var(--kupfer)", color: "var(--kupfer-tief)" }}
                      >
                        {l.badge[lang]}
                      </span>
                    )}
                  </div>

                  <div data-reveal className="mt-4 space-y-4 text-[0.9375rem]">
                    <p style={{ color: "var(--text-gedimmt)" }}>{l.beschreibung[lang]}</p>
                    <p>
                      <strong className="font-semibold">{T.fuerWen[lang]}</strong>{" "}
                      <span style={{ color: "var(--text-gedimmt)" }}>{l.fuerWen[lang]}</span>
                    </p>
                    <div>
                      <p className="mb-2 font-semibold">{T.enthalten[lang]}:</p>
                      <ul className="space-y-1.5">
                        {l.enthalten[lang].map((e) => (
                          <li key={e} className="flex items-start gap-2.5">
                            <span
                              className="mt-[7px] block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                              style={{ background: "var(--kupfer)" }}
                              aria-hidden="true"
                            />
                            <span style={{ color: "var(--text-gedimmt)" }}>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div
                    data-reveal
                    className="messwert mt-auto grid gap-1 border-t pt-4 text-[0.75rem] uppercase tracking-wider"
                    style={{ borderColor: "var(--linie)", marginTop: "auto", paddingTop: "1rem" }}
                  >
                    {l.zeitrahmen && (
                      <p>
                        <span style={{ color: "var(--text-gedimmt)" }}>{T.zeitrahmen[lang]}: </span>
                        {l.zeitrahmen[lang]}
                      </p>
                    )}
                    <p>
                      <span style={{ color: "var(--text-gedimmt)" }}>{T.preisrahmen[lang]}: </span>
                      {l.preis ? l.preis[lang] : T.aufAnfrage[lang]}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Pflicht-Disclaimer — einmal pro Kapitel */}
            <div className="mt-8 max-w-3xl">
              <DisclaimerBox lang={lang} />
            </div>
          </div>
        </section>
      ))}

      {/* Verbindliche Grundsätze */}
      <section
        id="grundsaetze"
        data-via
        aria-labelledby="grundsaetze-h"
        className="mx-auto max-w-content px-6 py-20"
      >
        <Reveal>
          <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
            [S5] {lang === "de" ? "GRUNDSÄTZE" : "PRINCIPLES"}
          </p>
          <h2 data-reveal id="grundsaetze-h" className="h-section">
            {T.grundsaetze[lang]}
          </h2>
        </Reveal>
        <Reveal className="mt-10 max-w-3xl space-y-6" stagger={0.1}>
          {GRUNDSAETZE(lang).map((g, i) => (
            <div key={i} data-reveal className="flex items-start gap-4">
              <span className="testpunkt">{`TP${i + 1}`}</span>
              <p className="text-[0.9375rem]" style={{ color: "var(--text-gedimmt)" }}>
                {g}
              </p>
            </div>
          ))}
        </Reveal>
        <div className="mt-12">
          <Link href={localePath("/kontakt", lang)} className="btn-pad">
            {T.cta[lang]}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
