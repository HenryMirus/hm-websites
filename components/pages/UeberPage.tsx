/**
 * /ueber (Masterplan §5.5) — E-E-A-T-Anker: benannte Person, Standort,
 * überprüfbare Fakten, ehrlicher Absatz zur Unternehmensphase.
 * Foto folgt (offene Entscheidung 6) — bis dahin ehrlicher Platzhalter
 * im Bestückungsdruck-Rahmen.
 */
import SiteShell from "@/components/site/SiteShell";
import Reveal from "@/components/animations/Reveal";
import Monogram from "@/components/brand/Monogram";
import Link from "next/link";
import type { Lang } from "@/content/leistungen";
import { localePath } from "@/lib/i18n";

const T = {
  eyebrow: { de: "[S0] ÜBER HM LABS", en: "[S0] ABOUT HM LABS" },
  h1: {
    de: "Ein Studio, ein Ansprechpartner, ein Anspruch.",
    en: "One studio, one point of contact, one standard.",
  },
  intro: {
    de: "HM Labs ist das Web-Studio von Henry Mirus in Buchholz im Westerwald — Einzugsgebiet Köln/Bonn, Neuwied und Koblenz, remote in ganz DACH. Hier entstehen individuelle Websites, self-hosted KI-Lösungen und Webapps: entworfen, gebaut und geprüft von derselben Person, mit der Sie sprechen.",
    en: "HM Labs is the web studio of Henry Mirus in Buchholz in the Westerwald — serving the Cologne/Bonn, Neuwied and Koblenz region, and all of DACH remotely. Individual websites, self-hosted AI solutions and web apps are designed, built and tested here by the same person you talk to.",
  },
  fotoCaption: { de: "ABB. 01 — PORTRAIT FOLGT", en: "FIG. 01 — PORTRAIT TO FOLLOW" },
  prinzipien: { de: "Arbeitsprinzipien", en: "Working principles" },
  werte: { de: "Datensouveränität als Wert", en: "Data sovereignty as a value" },
  werteText: {
    de: "Alles, was HM Labs baut, läuft auf EU-Servern — vom Hosting bis zur KI. Keine Datenweitergabe an US-Clouds, keine Tracking-Cookies, kein Vendor-Lock-in: Der Code gehört am Ende Ihnen. Das ist keine Marketing-Position, sondern die technische Grundeinstellung jedes Projekts.",
    en: "Everything HM Labs builds runs on EU servers — from hosting to AI. No data passed to US clouds, no tracking cookies, no vendor lock-in: the code belongs to you in the end. That's not a marketing position, it's the technical default of every project.",
  },
  phase: { de: "Wo wir stehen — ehrlich", en: "Where we stand — honestly" },
  phaseText: {
    de: "HM Labs ist ein junges Studio in der Referenzphase. Das heißt konkret: Die ersten Projekte entstehen zu Referenzkonditionen am unteren Rand der Preisspannen — und bekommen dafür die volle Aufmerksamkeit, die ein Studio mit zwei Dutzend Parallelprojekten nicht geben kann. Transparenz schlägt Fassade: Diese Website ist unser erstes Exponat, und jedes Qualitätsversprechen darauf ist nachprüfbar verlinkt.",
    en: "HM Labs is a young studio in its reference phase. Concretely: the first projects are built at reference conditions at the lower end of the price ranges — and in return get the full attention a studio juggling two dozen parallel projects cannot give. Transparency beats façade: this website is our first exhibit, and every quality claim on it links to verifiable proof.",
  },
  cta: { de: "Lernen Sie uns im Erstgespräch kennen", en: "Get to know us in a first call" },
} as const;

const PRINZIPIEN = [
  {
    titel: { de: "Bewusste Typografie", en: "Deliberate typography" },
    text: {
      de: "Schrift ist die halbe Gestaltung. Jedes Projekt bekommt eine eigene, begründete Schriftwahl — nie die Systemschrift, nie den Baukasten-Standard.",
      en: "Type is half the design. Every project gets its own, reasoned typeface choice — never the system font, never the site-builder default.",
    },
  },
  {
    titel: { de: "Gezielte Bewegung", en: "Purposeful motion" },
    text: {
      de: "Animation erzählt etwas oder sie fliegt raus. Ein Signature-Moment, den Besucher erinnern — statt zwanzig Effekten, die ablenken.",
      en: "Animation tells a story or it gets cut. One signature moment visitors remember — instead of twenty effects that distract.",
    },
  },
  {
    titel: { de: "Substanz statt Floskeln", en: "Substance over phrases" },
    text: {
      de: "Jede Aussage belegbar: Zahlen statt Adjektive, Prüfprotokolle statt Versprechen. „Lighthouse 94“ schlägt „blitzschnell“.",
      en: "Every claim verifiable: numbers instead of adjectives, test protocols instead of promises. 'Lighthouse 94' beats 'blazing fast'.",
    },
  },
  {
    titel: { de: "Messbare Qualität", en: "Measurable quality" },
    text: {
      de: "Lighthouse-Ziel 90+, WCAG 2.1 AA, Cross-Browser-QA — jede Website verlässt das Studio mit einem Prüfprotokoll, nicht mit einer Behauptung.",
      en: "Lighthouse target 90+, WCAG 2.1 AA, cross-browser QA — every website leaves the studio with a test protocol, not a claim.",
    },
  },
] as const;

export default function UeberPage({ lang }: { lang: Lang }) {
  return (
    <SiteShell lang={lang}>
      <section className="mx-auto max-w-content px-6 pb-16 pt-20" data-via id="intro">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
              {T.eyebrow[lang]}
            </p>
            <h1 className="h-display max-w-3xl" style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}>
              {T.h1[lang]}
            </h1>
            <p className="mt-8 max-w-2xl" style={{ color: "var(--text-gedimmt)" }}>
              {T.intro[lang]}
            </p>
          </div>

          {/* Portrait-Platzhalter im Bestückungsdruck-Rahmen */}
          <figure className="corner-frame flex aspect-[4/5] flex-col items-center justify-center gap-6 self-start p-8"
            style={{ background: "var(--substrat-tief)" }}>
            <Monogram size={72} className="opacity-40" />
            <figcaption className="messwert text-[0.7rem] uppercase tracking-[0.14em]"
              style={{ color: "var(--text-gedimmt)" }}>
              {T.fotoCaption[lang]}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Arbeitsprinzipien */}
      <section data-via id="prinzipien" aria-labelledby="prinzipien-h" style={{ background: "var(--substrat-tief)" }}>
        <div className="mx-auto max-w-content px-6 py-20">
          <Reveal>
            <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
              [S1] {lang === "de" ? "PRINZIPIEN" : "PRINCIPLES"}
            </p>
            <h2 data-reveal id="prinzipien-h" className="h-section">
              {T.prinzipien[lang]}
            </h2>
          </Reveal>
          <Reveal className="mt-10 grid gap-6 sm:grid-cols-2" stagger={0.1}>
            {PRINZIPIEN.map((p, i) => (
              <div key={p.titel.de} data-reveal className="corner-frame p-7">
                <div className="flex items-start gap-3">
                  <span className="testpunkt">{`TP${i + 1}`}</span>
                  <div>
                    <h3 className="h-sub text-[1.1rem]">{p.titel[lang]}</h3>
                    <p className="mt-2 text-[0.9375rem]" style={{ color: "var(--text-gedimmt)" }}>
                      {p.text[lang]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Werte */}
      <section data-via id="werte" aria-labelledby="werte-h" className="mx-auto max-w-content px-6 py-20">
        <Reveal>
          <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
            [S2] {lang === "de" ? "WERTE" : "VALUES"}
          </p>
          <h2 data-reveal id="werte-h" className="h-section max-w-3xl">
            {T.werte[lang]}
          </h2>
          <p data-reveal className="mt-5 max-w-3xl" style={{ color: "var(--text-gedimmt)" }}>
            {T.werteText[lang]}
          </p>
        </Reveal>
      </section>

      {/* Ehrliche Unternehmensphase */}
      <section data-via id="phase" aria-labelledby="phase-h" style={{ background: "var(--substrat-tief)" }}>
        <div className="mx-auto max-w-content px-6 py-20">
          <Reveal>
            <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
              [S3] {lang === "de" ? "STANDORT-BESTIMMUNG" : "WHERE WE ARE"}
            </p>
            <h2 data-reveal id="phase-h" className="h-section max-w-3xl">
              {T.phase[lang]}
            </h2>
            <p data-reveal className="mt-5 max-w-3xl" style={{ color: "var(--text-gedimmt)" }}>
              {T.phaseText[lang]}
            </p>
            <p data-reveal className="mt-10">
              <Link href={localePath("/kontakt", lang)} className="btn-pad">
                {T.cta[lang]}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
