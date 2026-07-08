/**
 * Startseite [S1]–[S9] (Masterplan §5.1) — Server-Komponenten.
 * Animation über die Client-Wrapper Reveal / Messung / TraceDraw.
 * Sektionslabels folgen der Bestückungsdruck-Konvention [Sn] und sind Anker.
 */
import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import Messung from "@/components/animations/Messung";
import TraceDraw from "@/components/animations/TraceDraw";
import {
  GRUPPEN,
  LEISTUNGEN,
  PREIS_DISCLAIMER,
  ZAHLUNG,
  type Gruppe,
  type Lang,
} from "@/content/leistungen";
import { localePath } from "@/lib/i18n";

/* ————————————————————————— [S1] Beweis-Band ————————————————————————— */

const MESSWERTE = [
  {
    tp: "TP1",
    wert: "LIGHTHOUSE ≥ 90",
    hint: {
      de: "alle vier Kategorien, messbar",
      en: "all four categories, measurable",
    },
  },
  {
    tp: "TP2",
    wert: { de: "3–5 WOCHEN", en: "3–5 WEEKS" },
    hint: {
      de: "Business-Website, Richtwert",
      en: "business website, guide value",
    },
  },
  {
    tp: "TP3",
    wert: { de: "CODE-EIGENTUM 100 %", en: "CODE OWNERSHIP 100%" },
    hint: { de: "der Code gehört Ihnen", en: "the code belongs to you" },
  },
  {
    tp: "TP4",
    wert: { de: "SEO + GAIO INKLUSIVE", en: "SEO + GAIO INCLUDED" },
    hint: { de: "kein Aufpreis", en: "no surcharge" },
  },
] as const;

export function BeweisBand({ lang }: { lang: Lang }) {
  return (
    <section
      id="s1"
      data-via
      aria-label={lang === "de" ? "Prüfprotokoll" : "Test protocol"}
      className="border-b"
      style={{ borderColor: "var(--linie)" }}
    >
      <div className="mx-auto grid max-w-content gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {MESSWERTE.map((m, i) => (
          <Messung key={m.tp} delay={i * 0.12}>
            <div className="flex items-start gap-3">
              <span className="testpunkt">{m.tp}</span>
              <div>
                <p className="messwert text-[1.05rem] font-medium">
                  {typeof m.wert === "string" ? m.wert : m.wert[lang]}
                </p>
                <p className="text-[0.8125rem]" style={{ color: "var(--text-gedimmt)" }}>
                  {m.hint[lang]}
                </p>
              </div>
            </div>
          </Messung>
        ))}
      </div>
    </section>
  );
}

/* ——————————————————— [S2] Kontrast — Drei Wege, eine Lücke ——————————————————— */

const WEGE = [
  {
    name: { de: "Baukasten", en: "Site builder" },
    satz: {
      de: "Schnell und günstig gestartet — aber jede Seite entsteht aus denselben Blöcken, und Technik, Texte und Sichtbarkeit bleiben Ihre Aufgabe.",
      en: "Fast and cheap to start — but every page is built from the same blocks, and tech, copy and visibility remain your job.",
    },
  },
  {
    name: { de: "Freelancer", en: "Freelancer" },
    satz: {
      de: "Persönlich und flexibel — aber meist auf ein Gewerk spezialisiert: Design oder Code oder SEO. Selten alles zusammen.",
      en: "Personal and flexible — but usually specialised in one trade: design or code or SEO. Rarely all of it.",
    },
  },
  {
    name: { de: "Klassische Agentur", en: "Traditional agency" },
    satz: {
      de: "Volle Leistungsbreite — aber mit Overhead: mehrere Ansprechpartner, lange Wege, entsprechende Preise.",
      en: "Full range of services — but with overhead: several contacts, long feedback loops, prices to match.",
    },
  },
] as const;

const HM_PUNKTE = [
  { de: "Individuelles Design — immer", en: "Individual design — always" },
  { de: "SEO und GAIO inklusive", en: "SEO and GAIO included" },
  {
    de: "DSGVO-native KI, self-hosted in der EU",
    en: "GDPR-native AI, self-hosted in the EU",
  },
  { de: "Ein fester Ansprechpartner", en: "One fixed point of contact" },
  {
    de: "Preis zwischen Freelancer und Agentur",
    en: "Priced between freelancer and agency",
  },
] as const;

export function Kontrast({ lang }: { lang: Lang }) {
  return (
    <section
      id="s2"
      data-via
      aria-labelledby="s2-h"
      className="mx-auto max-w-content px-6 py-24"
    >
      <Reveal>
        <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
          [S2] {lang === "de" ? "DREI WEGE, EINE LÜCKE" : "THREE PATHS, ONE GAP"}
        </p>
        <h2 data-reveal id="s2-h" className="h-section max-w-3xl">
          {lang === "de"
            ? "Der Markt lässt Ihnen drei Wege — und eine Lücke."
            : "The market gives you three paths — and one gap."}
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        {/* links: die drei Wege */}
        <Reveal className="space-y-8" stagger={0.12}>
          {WEGE.map((w) => (
            <div
              key={w.name.de}
              data-reveal
              className="border-l-2 pl-5"
              style={{ borderColor: "var(--linie)" }}
            >
              <h3 className="h-sub mb-1 text-[1.1rem]">{w.name[lang]}</h3>
              <p className="text-[0.9375rem]" style={{ color: "var(--text-gedimmt)" }}>
                {w.satz[lang]}
              </p>
            </div>
          ))}
        </Reveal>

        {/* rechts: HM Labs — durch die Leiterbahn „angeschlossen" */}
        <div className="relative">
          <TraceDraw
            className="absolute -left-10 top-0 hidden h-full w-10 lg:block"
            start="top 70%"
          >
            <svg
              viewBox="0 0 40 200"
              preserveAspectRatio="none"
              className="h-full w-full"
              aria-hidden="true"
            >
              <path
                className="trace-path"
                d="M0 100 H14 L26 88 V20 H40 M26 88 V180 H40"
                pathLength={100}
                fill="none"
                stroke="var(--kupfer)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </TraceDraw>

          <Reveal
            className="corner-frame h-full p-8 md:p-10"
            stagger={0.08}
          >
            <p
              data-reveal
              className="eyebrow mb-6"
              style={{ color: "var(--kupfer-tief)" }}
            >
              HM LABS
            </p>
            <ul className="space-y-4">
              {HM_PUNKTE.map((p, i) => (
                <li key={p.de} data-reveal className="flex items-center gap-4">
                  <span
                    className="block h-2.5 w-2.5 flex-shrink-0 rounded-full border-[1.5px]"
                    style={{
                      borderColor: "var(--kupfer)",
                      background: i === 0 ? "var(--kupfer)" : "transparent",
                    }}
                    aria-hidden="true"
                  />
                  <span className="text-[1.05rem] font-medium">{p[lang]}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ————————————————————— [S3] Leistungs-Index ————————————————————— */

export function LeistungsIndex({ lang }: { lang: Lang }) {
  return (
    <section
      id="s3"
      data-via
      aria-labelledby="s3-h"
      style={{ background: "var(--substrat-tief)" }}
    >
      <div className="mx-auto max-w-content px-6 py-24">
        <Reveal>
          <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
            [S3] {lang === "de" ? "LEISTUNGEN" : "SERVICES"}
          </p>
          <h2 data-reveal id="s3-h" className="h-section max-w-3xl">
            {lang === "de"
              ? "Dreizehn Leistungen. Eine Werkbank."
              : "Thirteen services. One workbench."}
          </h2>
        </Reveal>

        <div className="mt-14 space-y-12">
          {(["A", "B", "C", "D"] as Gruppe[]).map((g) => (
            <div key={g}>
              <p className="eyebrow mb-4" style={{ color: "var(--text-gedimmt)" }}>
                {lang === "de" ? "TEIL" : "PART"} {g} — {GRUPPEN[g][lang].toUpperCase()}
              </p>
              <ul
                className="divide-y border-y"
                style={{ borderColor: "var(--linie)" }}
              >
                {LEISTUNGEN.filter((l) => l.gruppe === g).map((l) => (
                  <li key={l.id} style={{ borderColor: "var(--linie)" }}>
                    <Link
                      href={localePath(`/leistungen#${l.id}`, lang)}
                      className="group grid items-baseline gap-x-6 gap-y-1 py-5 transition-transform duration-300 ease-leiter-out sm:grid-cols-[3rem_1fr_auto] sm:group-hover:translate-x-2 hover:translate-x-2"
                    >
                      <span
                        className="messwert text-[0.85rem]"
                        style={{ color: "var(--kupfer-tief)" }}
                      >
                        {l.nr}
                      </span>
                      <span>
                        <span className="h-sub via-link text-[1.15rem]">
                          {l.name[lang]}
                        </span>
                        {l.badge && (
                          <span
                            className="messwert ml-3 rounded-pad border px-2 py-0.5 text-[0.65rem] uppercase tracking-widest"
                            style={{
                              borderColor: "var(--kupfer)",
                              color: "var(--kupfer-tief)",
                            }}
                          >
                            {l.badge[lang]}
                          </span>
                        )}
                        <span
                          className="mt-1 block text-[0.875rem]"
                          style={{ color: "var(--text-gedimmt)" }}
                        >
                          {l.kurz[lang]}
                        </span>
                      </span>
                      <span
                        className="messwert whitespace-nowrap text-[0.8rem]"
                        style={{ color: "var(--text-gedimmt)" }}
                      >
                        {l.preis
                          ? `${l.preis[lang]} *`
                          : lang === "de"
                            ? "auf Anfrage"
                            : "on request"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pflicht-Disclaimer — wörtlich aus preislogik.yaml, direkt unter der Preisnennung */}
        <p
          className="mt-8 max-w-3xl text-[0.8125rem]"
          style={{ color: "var(--text-gedimmt)" }}
        >
          *&nbsp;{PREIS_DISCLAIMER[lang]}
        </p>
      </div>
    </section>
  );
}

/* ————————————————————— [S4] Prozess-Teaser ————————————————————— */

const SCHRITTE = [
  { de: "Briefing", en: "Briefing" },
  { de: "Designkonzept", en: "Design concept" },
  { de: "Umsetzung", en: "Build" },
  { de: "QA", en: "QA" },
  { de: "Launch", en: "Launch" },
] as const;

export function ProzessTeaser({ lang }: { lang: Lang }) {
  return (
    <section
      id="s4"
      data-via
      aria-labelledby="s4-h"
      className="mx-auto max-w-content px-6 py-24"
    >
      <Reveal>
        <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
          [S4] {lang === "de" ? "PROZESS" : "PROCESS"}
        </p>
        <blockquote data-reveal>
          <p id="s4-h" className="h-section max-w-4xl">
            {lang === "de"
              ? "„Was wird ein Besucher 24 Stunden später noch von dieser Website erinnern?"
              : "“What will a visitor still remember about this website 24 hours later?"}
            &ldquo;
          </p>
        </blockquote>
        <p data-reveal className="mt-4 max-w-2xl" style={{ color: "var(--text-gedimmt)" }}>
          {lang === "de"
            ? "Diese Frage beantworten wir, bevor wir eine Zeile Code schreiben. Der Weg dorthin hat fünf Stationen:"
            : "We answer that question before we write a single line of code. The route has five stations:"}
        </p>
      </Reveal>

      {/* Horizontale Leiterbahn mit 5 Vias */}
      <TraceDraw className="mt-14" start="top 75%" end="bottom 55%">
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
          <ol className="relative grid gap-8 md:grid-cols-5">
            {SCHRITTE.map((s, i) => (
              <li key={s.de} className="md:pt-8">
                <span
                  className="absolute top-0 hidden h-3.5 w-3.5 rounded-full border-[1.5px] md:block"
                  style={{
                    borderColor: "var(--kupfer)",
                    background: "var(--substrat)",
                  }}
                  aria-hidden="true"
                />
                <p className="messwert text-[0.72rem] uppercase tracking-widest"
                  style={{ color: "var(--kupfer-tief)" }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 font-medium">{s[lang]}</p>
              </li>
            ))}
          </ol>
        </div>
      </TraceDraw>

      <div className="mt-12">
        <Link href={localePath("/prozess", lang)} className="via-link font-medium"
          style={{ color: "var(--kupfer-tief)" }}>
          {lang === "de" ? "Den ganzen Prozess ansehen →" : "See the full process →"}
        </Link>
      </div>
    </section>
  );
}

/* ———————————————— [S5] GAIO & KI — dunkel (Ebene 3) ———————————————— */

export function GaioKi({ lang }: { lang: Lang }) {
  return (
    <section
      id="s5"
      data-via
      data-theme="lack"
      aria-labelledby="s5-h"
      className="on-lack dot-grid"
      style={{ background: "var(--lack)", color: "var(--text-invers)" }}
    >
      <div className="mx-auto max-w-content px-6 py-24">
        <Reveal>
          <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-hell)" }}>
            [S5] {lang === "de" ? "GAIO & KI" : "GAIO & AI"}
          </p>
          <h2 data-reveal id="s5-h" className="h-section max-w-3xl">
            {lang === "de"
              ? "Gefunden werden, wenn niemand mehr googelt."
              : "Get found when nobody googles anymore."}
          </h2>
          <p data-reveal className="mt-5 max-w-2xl text-lg"
            style={{ color: "var(--text-invers-ged)" }}>
            {lang === "de"
              ? "Wenn jemand ChatGPT nach einem Anbieter in Ihrer Branche fragt — werden Sie genannt, oder Ihr Wettbewerber?"
              : "When someone asks ChatGPT for a provider in your industry — are you mentioned, or your competitor?"}
          </p>
        </Reveal>

        {/* Zwei ungleiche Blöcke */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="corner-frame p-8 md:p-10" stagger={0.08}>
            <h3 data-reveal className="h-sub mb-4">
              {lang === "de" ? "GAIO — KI-Sichtbarkeit" : "GAIO — AI visibility"}
            </h3>
            <p data-reveal style={{ color: "var(--text-invers-ged)" }}>
              {lang === "de"
                ? "llms.txt, Schema.org-Strukturdaten, zitierfähige Inhaltsstrukturen, KI-Crawler-Zugang: Wir rüsten Websites so aus, dass KI-Systeme sie finden, verstehen und zitieren — die Ihre eingeschlossen, ohne Relaunch."
                : "llms.txt, Schema.org structured data, citable content structures, AI-crawler access: we equip websites so AI systems find, understand and cite them — including yours, no relaunch required."}
            </p>
            <p data-reveal className="mt-6">
              <Link
                href={localePath("/leistungen#gaio", lang)}
                className="btn-pad"
              >
                {lang === "de"
                  ? "KI-Sichtbarkeit prüfen lassen"
                  : "Get your AI visibility audited"}
              </Link>
            </p>
          </Reveal>

          <Reveal className="corner-frame p-8 md:p-10" stagger={0.08}>
            <h3 data-reveal className="h-sub mb-4">
              {lang === "de" ? "DSGVO-native KI" : "GDPR-native AI"}
            </h3>
            <p data-reveal style={{ color: "var(--text-invers-ged)" }}>
              {lang === "de"
                ? "Ihr Chatbot läuft auf Ihrem Server in der EU. Keine Datenweitergabe an OpenAI, Google oder andere Drittanbieter — bei uns ist das keine Option, sondern der Standard."
                : "Your chatbot runs on your server in the EU. No data passed to OpenAI, Google or any other third party — with us that's not an option, it's the standard."}
            </p>
            <p data-reveal className="mt-6">
              <Link
                href={localePath("/leistungen#ki-chatbot", lang)}
                className="btn-ghost"
              >
                {lang === "de" ? "Zum KI-Chatbot" : "About the AI chatbot"}
              </Link>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ———————————— [S6] Individualitätsbeweis (v1.0-Fassung) ———————————— */

export function Exponat({ lang }: { lang: Lang }) {
  const belege = [
    {
      label: {
        de: "PageSpeed-Ergebnis dieser Seite",
        en: "PageSpeed result of this site",
      },
      href: "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fhm-labs.de",
      extern: true,
    },
    {
      label: {
        de: "llms.txt dieser Domain — GAIO in der Praxis",
        en: "This domain's llms.txt — GAIO in practice",
      },
      href: "/llms.txt",
      extern: true,
    },
    {
      label: {
        de: "Barrierefreiheitserklärung",
        en: "Accessibility statement",
      },
      href: "/barrierefreiheit",
      extern: false,
    },
  ] as const;

  return (
    <section
      id="s6"
      data-via
      aria-labelledby="s6-h"
      className="mx-auto max-w-content px-6 py-24"
    >
      <Reveal>
        <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
          [S6] {lang === "de" ? "EXPONAT 01" : "EXHIBIT 01"}
        </p>
        <h2 data-reveal id="s6-h" className="h-section max-w-3xl">
          {lang === "de"
            ? "Diese Website ist unser erstes Exponat."
            : "This website is our first exhibit."}
        </h2>
        <p data-reveal className="mt-5 max-w-2xl" style={{ color: "var(--text-gedimmt)" }}>
          {lang === "de"
            ? "Entworfen ohne Template, gebaut mit demselben Qualitätsprozess, den jedes Kundenprojekt durchläuft. Prüfen Sie es nach — drei Belege:"
            : "Designed without a template, built with the same quality process every client project goes through. Verify it yourself — three pieces of evidence:"}
        </p>
      </Reveal>

      <Reveal className="mt-10 grid gap-4 md:grid-cols-3" stagger={0.1}>
        {belege.map((b, i) => (
          <a
            key={b.href}
            data-reveal
            href={b.href}
            {...(b.extern
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="corner-frame flex items-start gap-3 p-6"
          >
            <span className="testpunkt">{`TP${i + 5}`}</span>
            <span className="text-[0.9375rem] font-medium">{b.label[lang]}</span>
          </a>
        ))}
      </Reveal>

      <Reveal>
        <p data-reveal className="mt-10 max-w-2xl border-l-2 pl-5 text-[0.9375rem] italic"
          style={{ borderColor: "var(--kupfer)", color: "var(--text-gedimmt)" }}>
          {lang === "de"
            ? "Wir nutzen KI dort, wo sie uns schneller macht — nie dort, wo sie Ihr Design entwerfen würde."
            : "We use AI where it makes us faster — never where it would design your website."}
        </p>
      </Reveal>
    </section>
  );
}

/* ————————————————— [S7] Risikoabbau (Ebene 4) ————————————————— */

export function Risikoabbau({ lang }: { lang: Lang }) {
  const punkte = [
    {
      tp: "TP9",
      titel: { de: "Der Code gehört Ihnen", en: "The code belongs to you" },
      text: {
        de: "Vollständig. Sie sind nie an uns gebunden — Sie bleiben, weil die Arbeit überzeugt.",
        en: "Completely. You are never tied to us — you stay because the work convinces you.",
      },
    },
    {
      tp: "TP10",
      titel: {
        de: "Ein fester Ansprechpartner",
        en: "One fixed point of contact",
      },
      text: {
        de: "Vom ersten Gespräch bis zum Launch sprechen Sie mit derselben Person — kein Projektmanagement-Stille-Post.",
        en: "From the first conversation to launch you talk to the same person — no project-management telephone game.",
      },
    },
    {
      tp: "TP11",
      titel: { de: "Meilensteinzahlung", en: "Milestone payments" },
      text: {
        de: `${ZAHLUNG.bis5000.de} — bei größeren Projekten ${ZAHLUNG.ueber5000.de}. Nie 100 % im Voraus.`,
        en: `${ZAHLUNG.bis5000.en} — for larger projects ${ZAHLUNG.ueber5000.en}. Never 100% upfront.`,
      },
    },
    {
      tp: "TP12",
      titel: {
        de: "Zwei Revisionsrunden inklusive",
        en: "Two revision rounds included",
      },
      text: {
        de: "In jedem Projekt enthalten; weitere Runden nach Aufwand — transparent im Angebot ausgewiesen.",
        en: "Included in every project; further rounds billed by effort — transparently stated in the quote.",
      },
    },
  ] as const;

  return (
    <section
      id="s7"
      data-via
      aria-labelledby="s7-h"
      style={{ background: "var(--substrat-tief)" }}
    >
      <div className="mx-auto max-w-content px-6 py-24">
        <Reveal>
          <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
            [S7] {lang === "de" ? "RISIKOABBAU" : "RISK REDUCTION"}
          </p>
          <h2 data-reveal id="s7-h" className="h-section max-w-3xl">
            {lang === "de"
              ? "Was Sie nicht riskieren."
              : "What you are not risking."}
          </h2>
        </Reveal>

        <Reveal className="mt-12 space-y-8" stagger={0.1}>
          {punkte.map((p) => (
            <div key={p.tp} data-reveal className="flex max-w-3xl items-start gap-4">
              <span className="testpunkt">{p.tp}</span>
              <div>
                <h3 className="h-sub text-[1.1rem]">{p.titel[lang]}</h3>
                <p className="mt-1 text-[0.9375rem]" style={{ color: "var(--text-gedimmt)" }}>
                  {p.text[lang]}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ———————————————————————— [S8] FAQ ———————————————————————— */

interface FaqItem {
  frage: Record<Lang, string>;
  antwort: Record<Lang, string>;
  disclaimer?: boolean;
}

const FAQ: FaqItem[] = [
  {
    frage: { de: "Was kostet eine Website?", en: "What does a website cost?" },
    antwort: {
      de: "Als Orientierung: Eine Landingpage liegt bei 1.500–3.000 €, eine individuelle Business-Website bei 3.500–7.500 €, eine größere Corporate-Website bei 7.500–15.000 €. Was Ihr Projekt konkret braucht, klärt ein kostenloses Erstgespräch.",
      en: "As orientation: a landing page is €1,500–3,000, an individual business website €3,500–7,500, a larger corporate website €7,500–15,000. What your project actually needs is clarified in a free initial consultation.",
    },
    disclaimer: true,
  },
  {
    frage: { de: "Wie läuft ein Projekt ab?", en: "How does a project run?" },
    antwort: {
      de: "In fünf Phasen: Briefing → Designkonzept → Umsetzung → QA → Launch. Sie zahlen in Meilensteinen (nie alles im Voraus), zwei Revisionsrunden sind in jedem Projekt enthalten, und Sie sprechen durchgehend mit derselben Person.",
      en: "In five phases: briefing → design concept → build → QA → launch. You pay in milestones (never everything upfront), two revision rounds are included in every project, and you talk to the same person throughout.",
    },
  },
  {
    frage: {
      de: "Wem gehört die Website am Ende?",
      en: "Who owns the website in the end?",
    },
    antwort: {
      de: "Ihnen. Der Code gehört Ihnen vollständig — Sie sind nie an uns gebunden und können jederzeit mit einem anderen Dienstleister weiterarbeiten.",
      en: "You. The code belongs to you completely — you are never tied to us and can continue with another provider at any time.",
    },
  },
  {
    frage: {
      de: "Ist die Website DSGVO-konform?",
      en: "Is the website GDPR-compliant?",
    },
    antwort: {
      de: "DSGVO-konforme Basics gehören zum Standardumfang jedes Projekts: Impressums- und Datenschutz-Einbindung, EU-Hosting, Consent nur dort, wo er nötig ist. Diese Website selbst kommt ohne Tracking-Cookies aus — dasselbe Prinzip gilt für Kundenprojekte.",
      en: "GDPR-compliant basics are part of every project's standard scope: legal-notice and privacy integration, EU hosting, consent only where required. This website itself works without tracking cookies — the same principle applies to client projects.",
    },
  },
  {
    frage: { de: "Was ist GAIO?", en: "What is GAIO?" },
    antwort: {
      de: "GAIO (Generative AI Optimization) macht Websites für KI-Systeme wie ChatGPT, Perplexity oder Google AI Overviews auffindbar und zitierfähig — über llms.txt, Schema.org-Strukturdaten, KI-Crawler-Zugang und zitierfähige Inhaltsstrukturen. Bei HM Labs ist GAIO in jedem Website-Projekt enthalten.",
      en: "GAIO (Generative AI Optimization) makes websites findable and citable for AI systems like ChatGPT, Perplexity or Google AI Overviews — via llms.txt, Schema.org structured data, AI-crawler access and citable content structures. At HM Labs, GAIO is included in every website project.",
    },
  },
  {
    frage: {
      de: "Kann ich die Website später selbst pflegen?",
      en: "Can I maintain the website myself later?",
    },
    antwort: {
      de: "Ja — auf Wunsch binden wir ein CMS an, mit dem Sie Inhalte selbst pflegen. Alternativ übernimmt das der Wartungstarif: kleine Änderungen sind ab dem Komfort-Tarif enthalten.",
      en: "Yes — on request we integrate a CMS so you can maintain content yourself. Alternatively the maintenance plan covers it: small changes are included from the Komfort tier upwards.",
    },
  },
];

export function Faq({ lang }: { lang: Lang }) {
  return (
    <section
      id="s8"
      data-via
      aria-labelledby="s8-h"
      className="mx-auto max-w-content px-6 py-24"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <Reveal>
        <p data-reveal className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
          [S8] FAQ
        </p>
        <h2 data-reveal id="s8-h" className="h-section max-w-3xl">
          {lang === "de" ? "Häufige Fragen." : "Frequent questions."}
        </h2>
      </Reveal>

      <div className="mt-12 max-w-3xl divide-y border-y" style={{ borderColor: "var(--linie)" }}>
        {FAQ.map((item) => (
          <details
            key={item.frage.de}
            className="faq-item py-2"
            style={{ borderColor: "var(--linie)" }}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary className="flex items-center justify-between gap-4 py-3">
              <span itemProp="name" className="h-sub text-[1.05rem]">
                {item.frage[lang]}
              </span>
              <span className="faq-via" aria-hidden="true" />
            </summary>
            <div
              className="faq-body"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div>
                <p itemProp="text" className="pb-4 pr-8 text-[0.9375rem]"
                  style={{ color: "var(--text-gedimmt)" }}>
                  {item.antwort[lang]}
                </p>
                {item.disclaimer && (
                  <p className="pb-4 pr-8 text-[0.8125rem]"
                    style={{ color: "var(--text-gedimmt)" }}>
                    {PREIS_DISCLAIMER[lang]}
                  </p>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ————————————————— [S9] Abschluss-CTA ————————————————— */

export function AbschlussCta({ lang }: { lang: Lang }) {
  return (
    <section
      id="s9"
      data-via
      aria-labelledby="s9-h"
      className="mx-auto max-w-content px-6 pb-28 pt-8"
    >
      <Reveal className="corner-frame p-10 md:p-14">
        <h2 data-reveal id="s9-h" className="h-section max-w-3xl">
          {lang === "de"
            ? "Erzählen Sie uns, was Sie bauen wollen."
            : "Tell us what you want to build."}
        </h2>
        <div data-reveal className="mt-8 flex flex-wrap items-center gap-4">
          <Link href={localePath("/kontakt", lang)} className="btn-pad">
            {lang === "de" ? "Projekt anfragen" : "Start a project"}
          </Link>
          <Link href={localePath("/preise", lang)} className="btn-ghost">
            {lang === "de" ? "Erst die Preise ansehen" : "See pricing first"}
          </Link>
        </div>
        <p data-reveal className="messwert mt-6 text-[0.72rem] uppercase tracking-[0.14em]"
          style={{ color: "var(--text-gedimmt)" }}>
          {lang === "de"
            ? "ANTWORT IN DER REGEL INNERHALB EINES WERKTAGS"
            : "REPLY USUALLY WITHIN ONE BUSINESS DAY"}
        </p>
      </Reveal>
    </section>
  );
}
