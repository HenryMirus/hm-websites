/**
 * /prozess (Masterplan §5.4) — Individualität beweisen.
 * Die Seite ist die große Bühne der Signalleitung: eine vertikale Leiterbahn
 * verbindet die 5 Phasen; pro Phase füllt sich das Via.
 * Schema: bewusst KEIN HowTo (deprecated) — semantisches HTML + FAQ am Ende.
 */
import SiteShell from "@/components/site/SiteShell";
import Reveal from "@/components/animations/Reveal";
import TraceDraw from "@/components/animations/TraceDraw";
import Link from "next/link";
import { PREIS_DISCLAIMER, type Lang } from "@/content/leistungen";
import { localePath } from "@/lib/i18n";

const PHASEN = [
  {
    name: { de: "Briefing & Zieldefinition", en: "Briefing & goals" },
    dauer: { de: "ca. 1 Woche", en: "approx. 1 week" },
    was: {
      de: "Wir klären, was die Website erreichen soll, wer sie besucht und woran Erfolg gemessen wird. Dazu sammeln wir Material: Ihre Leistungen, Ihre Sprache, Ihre Referenzen.",
      en: "We clarify what the website should achieve, who visits it and how success is measured. We collect material: your services, your language, your references.",
    },
    henry: {
      de: "Ein strukturiertes Briefing-Dokument und eine ehrliche Einschätzung, was in Ihrem Budget-Rahmen sinnvoll ist.",
      en: "A structured briefing document and an honest assessment of what makes sense within your budget range.",
    },
    kunde: {
      de: "Zugang zu Texten, Logos, bisherigen Auftritten; eine Stunde Gespräch; zeitnahe Rückmeldungen (Mitwirkung analog AGB).",
      en: "Access to copy, logos, existing presences; one hour of conversation; timely feedback (cooperation per T&Cs).",
    },
  },
  {
    name: { de: "Designkonzept", en: "Design concept" },
    dauer: { de: "1–2 Wochen", en: "1–2 weeks" },
    was: {
      de: "Bevor wir eine Zeile Code schreiben, beantworten wir eine Frage: Was wird ein Besucher 24 Stunden später noch von dieser Website erinnern? Wir sammeln Referenzen, treffen eine Ästhetik-Entscheidung für Ihre Branche und entwickeln ein Konzept mit Animationsspezifikation — kein generisches Template, ein Entwurf für Sie.",
      en: "Before we write a line of code, we answer one question: what will a visitor still remember about this website 24 hours later? We collect references, make an aesthetic decision for your industry and develop a concept with an animation specification — no generic template, a design for you.",
    },
    henry: {
      de: "Ein visuelles Konzept (Farben, Typografie, Layout-Richtung, Signature-Element) zur Freigabe.",
      en: "A visual concept (colours, typography, layout direction, signature element) for approval.",
    },
    kunde: {
      de: "Eine Entscheidung: Freigabe oder eine konsolidierte Korrekturrunde.",
      en: "One decision: approval or one consolidated round of corrections.",
    },
  },
  {
    name: { de: "Umsetzung", en: "Build" },
    dauer: { de: "1–4 Wochen (je nach Umfang)", en: "1–4 weeks (depending on scope)" },
    was: {
      de: "Entwicklung auf modernem Stack (Next.js), Mobile-First, mit technischem SEO und GAIO von Anfang an — llms.txt, Schema.org, KI-Crawler-Zugang sind Teil des Baus, kein Nachtrag.",
      en: "Development on a modern stack (Next.js), mobile-first, with technical SEO and GAIO from the start — llms.txt, Schema.org, AI-crawler access are part of the build, not an afterthought.",
    },
    henry: {
      de: "Eine Staging-Umgebung, auf der Sie den Fortschritt live verfolgen können.",
      en: "A staging environment where you can follow progress live.",
    },
    kunde: {
      de: "Finale Inhalte (oder Beauftragung der Texterstellung); gebündeltes Feedback.",
      en: "Final content (or commissioning of copywriting); consolidated feedback.",
    },
  },
  {
    name: { de: "Qualitätssicherung", en: "Quality assurance" },
    dauer: { de: "3–5 Werktage", en: "3–5 working days" },
    was: {
      de: "Messbare Prüfung statt Behauptung: Lighthouse-Ziel 90+ in allen vier Kategorien, Cross-Browser-Test (Chrome, Firefox, Safari, Edge), Mobile-Geräteprüfung, Tastatur- und Screenreader-Durchlauf nach WCAG 2.1 AA.",
      en: "Measurable testing instead of claims: Lighthouse target 90+ in all four categories, cross-browser testing (Chrome, Firefox, Safari, Edge), mobile device checks, keyboard and screen-reader pass per WCAG 2.1 AA.",
    },
    henry: {
      de: "Ein Prüfprotokoll mit den Messwerten Ihrer Website.",
      en: "A test protocol with your website's measured values.",
    },
    kunde: {
      de: "Die Abnahme — zwei Revisionsrunden sind inklusive.",
      en: "Acceptance — two revision rounds are included.",
    },
  },
  {
    name: { de: "Launch & Übergabe", en: "Launch & handover" },
    dauer: { de: "1–2 Werktage", en: "1–2 working days" },
    was: {
      de: "Deployment, DNS-Umstellung, letzte Prüfung unter Live-Bedingungen. Danach gehört der Code Ihnen — vollständig.",
      en: "Deployment, DNS switch, final checks under live conditions. After that, the code belongs to you — completely.",
    },
    henry: {
      de: "Einweisung, Zugänge, Dokumentation — und auf Wunsch Wartung & Hosting als laufende Betreuung.",
      en: "Onboarding, credentials, documentation — and on request maintenance & hosting as ongoing care.",
    },
    kunde: {
      de: "Einen Blick auf das Prüfprotokoll — und die Entscheidung, wie es weitergeht.",
      en: "A look at the test protocol — and the decision on how to continue.",
    },
  },
] as const;

const FAQ_PROZESS = [
  {
    frage: {
      de: "Wie viele Korrekturschleifen sind drin?",
      en: "How many revision rounds are included?",
    },
    antwort: {
      de: "Zwei Revisionsrunden sind in jedem Projekt inklusive. Weitere Runden sind möglich und werden nach Aufwand berechnet (Richtwert 80–110 €/h) — das steht transparent in jedem Angebot.",
      en: "Two revision rounds are included in every project. Further rounds are possible and billed by effort (guide rate €80–110/h) — stated transparently in every quote.",
    },
  },
  {
    frage: {
      de: "Was passiert, wenn mir das Design nicht gefällt?",
      en: "What if I don't like the design?",
    },
    antwort: {
      de: "Das Designkonzept wird freigegeben, bevor die Umsetzung beginnt — Sie sehen die Richtung, solange Änderungen noch günstig sind. Innerhalb des Konzepts sind zwei Revisionsrunden inklusive; ein kompletter Richtungswechsel nach Freigabe wird als neuer Scope besprochen.",
      en: "The design concept is approved before the build starts — you see the direction while changes are still cheap. Within the concept, two revision rounds are included; a complete change of direction after approval is discussed as new scope.",
    },
  },
] as const;

const T = {
  eyebrow: { de: "[S0] SO ARBEITEN WIR", en: "[S0] HOW WE WORK" },
  h1: {
    de: "„Was wird ein Besucher 24 Stunden später noch von dieser Website erinnern?",
    en: "“What will a visitor still remember about this website 24 hours later?",
  },
  intro: {
    de: "Diese Frage steht am Anfang jedes Projekts — und der Prozess dahinter ist der Grund, warum das Ergebnis nicht generisch sein kann. Fünf Phasen, klare Zuständigkeiten, messbare Gates.",
    en: "This question stands at the start of every project — and the process behind it is why the result cannot be generic. Five phases, clear responsibilities, measurable gates.",
  },
  liefert: { de: "Was Sie bekommen", en: "What you get" },
  beisteuern: { de: "Was Sie beisteuern", en: "What you contribute" },
  dauer: { de: "DAUER (RICHTWERT)", en: "DURATION (GUIDE)" },
  werkzeuge: {
    de: "Womit wir arbeiten — und womit nicht",
    en: "What we work with — and what we don't",
  },
  werkzeugeText: {
    de: "Wir nutzen KI dort, wo sie uns schneller macht — nie dort, wo sie Ihr Design entwerfen würde. Werkzeuge sind Mittel; jede Design-Entscheidung trifft ein Mensch. Geprüft wird maschinell und von Hand: automatisierte Qualitäts-Gates, Cross-Browser-Tests, Lighthouse-Messung vor jedem Release.",
    en: "We use AI where it makes us faster — never where it would design your website. Tools are means; every design decision is made by a human. Testing is done by machine and by hand: automated quality gates, cross-browser tests, Lighthouse measurement before every release.",
  },
  nachLaunch: { de: "Nach dem Launch", en: "After launch" },
  nachLaunchText: {
    de: "Einweisung in die Pflege, Zugänge und Dokumentation gehören zur Übergabe. Wer laufende Betreuung möchte: Wartung & Hosting gibt es in drei Tarifen — inklusive EU-Hosting, Updates, Backups und Uptime-Monitoring. Nach 30 Tagen prüfen wir gemeinsam, ob alles läuft wie geplant.",
    en: "Handover includes onboarding, credentials and documentation. If you want ongoing care: maintenance & hosting comes in three tiers — including EU hosting, updates, backups and uptime monitoring. After 30 days we jointly check that everything runs as planned.",
  },
  cta: { de: "Projekt anfragen", en: "Start a project" },
} as const;

export default function ProzessPage({ lang }: { lang: Lang }) {
  return (
    <SiteShell lang={lang}>
      {/* Hero-Zitat */}
      <section className="mx-auto max-w-content px-6 pb-16 pt-20" data-via id="intro">
        <p className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
          {T.eyebrow[lang]}
        </p>
        <h1 className="h-display max-w-4xl" style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}>
          {T.h1[lang]}&ldquo;
        </h1>
        <p className="mt-8 max-w-2xl" style={{ color: "var(--text-gedimmt)" }}>
          {T.intro[lang]}
        </p>
      </section>

      {/* Die 5 Phasen — vertikale Leiterbahn */}
      <section
        aria-label={lang === "de" ? "Die fünf Phasen" : "The five phases"}
        className="mx-auto max-w-content px-6 pb-20"
        data-via
        id="phasen"
      >
        <TraceDraw className="relative" start="top 70%" end="bottom 70%">
          {/* Leiterbahn links der Phasen */}
          <svg
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
            className="absolute bottom-6 left-[10px] top-2 hidden w-[2px] md:block"
            aria-hidden="true"
          >
            <path
              className="trace-path"
              d="M1 0 V100"
              pathLength={100}
              fill="none"
              stroke="var(--kupfer)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className="space-y-14 md:pl-14">
            {PHASEN.map((p, i) => (
              <li key={p.name.de} className="relative">
                <span
                  className="absolute -left-14 top-1.5 hidden h-3.5 w-3.5 rounded-full border-[1.5px] md:block"
                  style={{
                    borderColor: "var(--kupfer)",
                    background: "var(--substrat)",
                    transform: "translateX(4px)",
                  }}
                  aria-hidden="true"
                />
                <Reveal stagger={0.08}>
                  <p data-reveal className="eyebrow" style={{ color: "var(--kupfer-tief)" }}>
                    {lang === "de" ? "PHASE" : "PHASE"} {String(i + 1).padStart(2, "0")}
                    <span className="ml-4" style={{ color: "var(--text-gedimmt)" }}>
                      {T.dauer[lang]}: {p.dauer[lang]}
                    </span>
                  </p>
                  <h2 data-reveal className="h-sub mt-2">
                    {p.name[lang]}
                  </h2>
                  <p data-reveal className="mt-3 max-w-3xl text-[0.9375rem]"
                    style={{ color: "var(--text-gedimmt)" }}>
                    {p.was[lang]}
                  </p>
                  <div data-reveal className="mt-5 grid max-w-3xl gap-5 sm:grid-cols-2">
                    <div className="corner-frame p-5">
                      <p className="eyebrow mb-2 text-[0.7rem]" style={{ color: "var(--kupfer-tief)" }}>
                        {T.liefert[lang]}
                      </p>
                      <p className="text-[0.875rem]" style={{ color: "var(--text-gedimmt)" }}>
                        {p.henry[lang]}
                      </p>
                    </div>
                    <div className="corner-frame p-5">
                      <p className="eyebrow mb-2 text-[0.7rem]" style={{ color: "var(--kupfer-tief)" }}>
                        {T.beisteuern[lang]}
                      </p>
                      <p className="text-[0.875rem]" style={{ color: "var(--text-gedimmt)" }}>
                        {p.kunde[lang]}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </TraceDraw>
      </section>

      {/* Werkzeuge & Qualitätsgates */}
      <section
        data-via
        id="werkzeuge"
        aria-labelledby="werkzeuge-h"
        style={{ background: "var(--substrat-tief)" }}
      >
        <div className="mx-auto max-w-content px-6 py-20">
          <Reveal>
            <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
              [S2] {lang === "de" ? "WERKZEUGE" : "TOOLS"}
            </p>
            <h2 data-reveal id="werkzeuge-h" className="h-section max-w-3xl">
              {T.werkzeuge[lang]}
            </h2>
            <p data-reveal className="mt-5 max-w-3xl" style={{ color: "var(--text-gedimmt)" }}>
              {T.werkzeugeText[lang]}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Nach dem Launch */}
      <section
        data-via
        id="nach-launch"
        aria-labelledby="nachlaunch-h"
        className="mx-auto max-w-content px-6 py-20"
      >
        <Reveal>
          <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
            [S3] {lang === "de" ? "BETRIEB" : "OPERATIONS"}
          </p>
          <h2 data-reveal id="nachlaunch-h" className="h-section max-w-3xl">
            {T.nachLaunch[lang]}
          </h2>
          <p data-reveal className="mt-5 max-w-3xl" style={{ color: "var(--text-gedimmt)" }}>
            {T.nachLaunchText[lang]}
          </p>
        </Reveal>
      </section>

      {/* FAQ mit FAQPage-Markup */}
      <section
        data-via
        id="faq"
        aria-labelledby="prozess-faq-h"
        className="mx-auto max-w-content px-6 pb-24"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <Reveal>
          <h2 data-reveal id="prozess-faq-h" className="h-sub">
            {lang === "de" ? "Häufige Fragen zum Ablauf" : "Frequent questions about the process"}
          </h2>
        </Reveal>
        <div className="mt-6 max-w-3xl divide-y border-y" style={{ borderColor: "var(--linie)" }}>
          {FAQ_PROZESS.map((f) => (
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
