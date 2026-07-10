"use client";

/**
 * /leistungen: alle 13 Leistungen im Detail, im Original-Design der Site.
 *
 * Content-Quellen (verbindlich): lib/leistungen.ts ← preislogik.yaml (wörtlich)
 * + hm-leistungsportfolio.md. Leistungen 09–12 ohne Spanne (das kläre ich
 * persönlich), jede Preisnennung mit Pflicht-Disclaimer je Kapitel.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProjectWizard from "@/components/ProjectWizard";
import ParticleNetwork from "@/components/ParticleNetwork";
import {
  ANGEBOT_HINWEIS,
  GRUPPEN,
  LEISTUNGEN,
  PREIS_DISCLAIMER,
  REVISIONEN,
  WARTUNG_TIERS,
  ZAHLUNG,
  type Gruppe,
  type I18n,
  type Lang,
  type Leistung,
} from "@/lib/leistungen";

const T = {
  tag: { de: "// Service Catalog", en: "// Service Catalog" },
  h1: { de: "Alle Leistungen im Detail", en: "All services in detail" },
  intro: {
    de: "HM Labs baut individuelle, handgefertigte Websites und digitale Lösungen, kein Baukasten, keine Templates. Jedes Projekt wird für Sie entworfen, mit technischer Qualität auf Messniveau und eingebauter Zukunftssicherheit: Sichtbarkeit in KI-Suchsystemen (GAIO) und DSGVO-native KI auf EU-Servern. Dreizehn Leistungen, vier Bereiche, ein Ansprechpartner.",
    en: "HM Labs builds individual, hand-crafted websites and digital solutions, no site builders, no templates. Every project is designed for you, with measurable technical quality and built-in future-proofing: visibility in AI search systems (GAIO) and GDPR-native AI on EU servers. Thirteen services, four areas, one point of contact.",
  },
  teil: { de: "Teil", en: "Part" },
  fuerWen: { de: "Für wen?", en: "For whom?" },
  enthalten: { de: "Enthalten", en: "Included" },
  zeitrahmen: { de: "Zeitrahmen (Richtwert)", en: "Timeframe (guide)" },
  preisrahmen: { de: "Preisrahmen", en: "Price range" },
  aufAnfrage: {
    de: "auf Anfrage, das kläre ich persönlich",
    en: "on request, I'll clarify that personally",
  },
  wartung: { de: "Die drei Tarife", en: "The three tiers" },
  empfohlen: { de: "Default-Empfehlung", en: "Default recommendation" },
  grundsaetzeTag: { de: "// Ground Rules", en: "// Ground Rules" },
  grundsaetze: { de: "Verbindliche Grundsätze", en: "Binding principles" },
  ctaTag: { de: "// Get Started", en: "// Get Started" },
  ctaHeadline: {
    de: "Unsicher, welche Leistung passt?",
    en: "Not sure which service fits?",
  },
  ctaSub: {
    de: "30 Minuten reichen aus, um das herauszufinden. Kein Pitch, kein Druck. Sie bekommen eine unverbindliche Einschätzung mit Preisspanne.",
    en: "30 minutes is enough to find out. No pitch, no pressure. You get a non-binding assessment with a price range.",
  },
  cta1: { de: "Kostenlos beraten lassen", en: "Book a free call" },
  cta2: { de: "Zur Startseite", en: "Back to home" },
  anfragen: { de: "Diese Leistung anfragen", en: "Request this service" },
} as const;

const GRUNDSAETZE = (lang: Lang) => [
  lang === "de"
    ? "Auf der Website nenne ich nur Spannen, nie einen Festpreis vorab. Erst das persönliche Angebot nach dem Erstgespräch enthält einen für den vereinbarten Umfang festen Preis."
    : "On the website I only quote ranges, never a fixed price upfront. Only the personal quote after the initial conversation states a price that is fixed for the agreed scope.",
  lang === "de"
    ? "Keine Garantien, keine Zusicherungen, keine festen Lieferzeiten: Zeitangaben sind Richtwerte."
    : "No guarantees, no assurances, no fixed delivery dates: time indications are guide values.",
  lang === "de"
    ? `Zahlungsstruktur: bis 5.000 €: ${ZAHLUNG.bis5000.de}. Über 5.000 €: ${ZAHLUNG.ueber5000.de}. Laufende Leistungen ${ZAHLUNG.laufend.de}.`
    : `Payment structure: up to €5,000: ${ZAHLUNG.bis5000.en}. Above €5,000: ${ZAHLUNG.ueber5000.en}. Recurring services ${ZAHLUNG.laufend.en}.`,
  lang === "de"
    ? `${REVISIONEN.inklusive} Revisionsrunden sind in jedem Projekt inklusive; ${REVISIONEN.weitere.de}.`
    : `${REVISIONEN.inklusive} revision rounds are included in every project; ${REVISIONEN.weitere.en}.`,
];

function DisclaimerBox({ lang }: { lang: Lang }) {
  return (
    <div className="mt-6 border-l-2 border-primary/40 pl-4">
      <p className="text-[13px] leading-relaxed text-text-muted">
        {PREIS_DISCLAIMER[lang]}
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted/80">
        {ANGEBOT_HINWEIS[lang]}
      </p>
    </div>
  );
}

function LeistungCard({
  l,
  lang,
  index,
  onAnfragen,
}: {
  l: Leistung;
  lang: Lang;
  index: number;
  onAnfragen: (l: Leistung) => void;
}) {
  return (
    <motion.article
      id={l.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08, ease: "easeOut" }}
      className="scroll-mt-28 flex flex-col rounded-2xl border border-border bg-surface/50 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-primary/30 md:p-8"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest text-primary">
            SVC_{l.nr}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold text-text-primary md:text-2xl">
            {l.name[lang]}
          </h3>
        </div>
        {l.badge && (
          <span className="whitespace-nowrap rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
            {l.badge[lang]}
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-text-muted">
        {l.beschreibung[lang]}
      </p>

      <p className="mt-4 text-sm leading-relaxed">
        <span className="font-semibold text-text-primary">
          {T.fuerWen[lang]}
        </span>{" "}
        <span className="text-text-muted">{l.fuerWen[lang]}</span>
      </p>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-text-primary">
          {T.enthalten[lang]}:
        </p>
        <ul className="space-y-1.5">
          {l.enthalten[lang].map((e) => (
            <li key={e} className="flex items-start gap-2.5 text-sm text-text-muted">
              <svg
                width="14"
                height="14"
                viewBox="0 0 12 12"
                fill="none"
                className="mt-1 flex-shrink-0"
                aria-hidden
              >
                <path
                  d="M2.5 6l2.5 2.5 5-5"
                  stroke="#4F7FFF"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {e}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-6">
        <div className="grid gap-1.5 border-t border-border pt-4 font-mono text-xs">
          {l.zeitrahmen && (
            <p className="text-text-dim">
              {T.zeitrahmen[lang]}:{" "}
              <span className="text-text-primary">{l.zeitrahmen[lang]}</span>
            </p>
          )}
          <p className="text-text-dim">
            {T.preisrahmen[lang]}:{" "}
            <span className="text-primary">
              {l.preis ? `${l.preis[lang]} *` : T.aufAnfrage[lang]}
            </span>
          </p>
        </div>

        {/* Wartung: die drei Tarife im Detail */}
        {l.id === "wartung" && (
          <div className="mt-5 grid gap-3">
            <p className="text-sm font-semibold text-text-primary">
              {T.wartung[lang]}:
            </p>
            {WARTUNG_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-4 ${
                  tier.default
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-bg/40"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-sm font-bold text-text-primary">
                    {tier.name}
                    {tier.default && (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                        {T.empfohlen[lang]}
                      </span>
                    )}
                  </p>
                  <p className="whitespace-nowrap font-mono text-xs text-primary">
                    {tier.range[lang]} *
                  </p>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">
                  {tier.umfang[lang]}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => onAnfragen(l)}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-colors duration-200 hover:border-primary/50 hover:bg-primary/10"
        >
          {T.anfragen[lang]}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </motion.article>
  );
}

export default function LeistungenDetail() {
  const [lang, setLang] = useState<Lang>("de");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardService, setWizardService] = useState<{ id: string; label: I18n } | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("lang") === "en") {
      setLang("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "de";
  }, [lang]);

  // Generischer Öffner (Nav-CTA, Abschluss-CTA), ohne vorausgewählte Leistung.
  const openWizard = () => {
    setWizardService(null);
    setWizardOpen(true);
  };

  // Kachel-CTA: die angeklickte Leistung wird als Kontext mitgegeben und
  // fließt in die Anfrage ein (siehe ProjectWizard.initialService).
  const openWizardFor = (l: Leistung) => {
    setWizardService({ id: l.id, label: l.name });
    setWizardOpen(true);
  };

  return (
    <div className="min-h-screen">
      <ParticleNetwork />
      <div className="relative z-[1]">
        <Navigation
          lang={lang}
          setLang={setLang}
          onOpenWizard={openWizard}
        />

        <main className="mx-auto max-w-7xl px-6 pb-24 pt-36">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="tag mb-4">{T.tag[lang]}</p>
            <h1 className="font-display text-4xl font-bold text-text-primary md:text-5xl">
              {T.h1[lang]}
            </h1>
            <p className="mt-6 leading-relaxed text-text-muted">
              {T.intro[lang]}
            </p>
          </motion.header>

          {/* Gruppen A–D */}
          {(["A", "B", "C", "D"] as Gruppe[]).map((g) => (
            <section
              key={g}
              id={`teil-${g.toLowerCase()}`}
              aria-label={`${T.teil[lang]} ${g}: ${GRUPPEN[g][lang]}`}
              className="scroll-mt-28 pt-16"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-8 flex items-baseline gap-4"
              >
                <span className="font-mono text-xs tracking-widest text-primary">
                  {`// ${T.teil[lang].toUpperCase()}_${g}`}
                </span>
                <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                  {GRUPPEN[g][lang]}
                </h2>
              </motion.div>

              <div className="grid gap-6 lg:grid-cols-2">
                {LEISTUNGEN.filter((l) => l.gruppe === g).map((l, i) => (
                  <LeistungCard key={l.id} l={l} lang={lang} index={i} onAnfragen={openWizardFor} />
                ))}
              </div>

              {/* Pflicht-Disclaimer: einmal pro Kapitel, wörtlich aus preislogik.yaml */}
              <DisclaimerBox lang={lang} />
            </section>
          ))}

          {/* Verbindliche Grundsätze */}
          <section id="grundsaetze" className="scroll-mt-28 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="tag mb-4">{T.grundsaetzeTag[lang]}</p>
              <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                {T.grundsaetze[lang]}
              </h2>
            </motion.div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {GRUNDSAETZE(lang).map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-surface/50 p-5"
                >
                  <span className="font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-text-muted">{text}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Abschluss-CTA */}
          <section className="pt-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-surface/60 p-8 text-center backdrop-blur-sm md:p-12"
            >
              <p className="tag mb-4">{T.ctaTag[lang]}</p>
              <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                {T.ctaHeadline[lang]}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
                {T.ctaSub[lang]}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={openWizard}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-colors duration-200 hover:bg-primary/90"
                >
                  {T.cta1[lang]}
                </button>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text-muted transition-colors duration-200 hover:border-primary/30 hover:text-text-primary"
                >
                  {T.cta2[lang]}
                </a>
              </div>
            </motion.div>
          </section>
        </main>

        <Footer lang={lang} />
        <ProjectWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          lang={lang}
          initialService={wizardService}
        />
      </div>
    </div>
  );
}
