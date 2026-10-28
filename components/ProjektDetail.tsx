"use client";

/**
 * /projekte/[slug]: Detailseite eines veröffentlichten Kundenprojekts, im
 * Original-Design der Site (Aufbau wie /leistungen: Navigation, Header,
 * Abschnitte mit Mono-Tags, Abschluss-CTA, Footer, ProjectWizard).
 *
 * Daten: lib/kundenprojekte.ts, gefiltert in app/projekte/[slug]/page.tsx.
 */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProjectWizard from "@/components/ProjectWizard";
import ParticleNetwork from "@/components/ParticleNetwork";
import { t, getText, type Lang } from "@/lib/translations";
import type { KundenProjekt } from "@/lib/kundenprojekte";
import { projektHref } from "@/lib/projektLinks";

interface ProjektDetailProps {
  projekt: KundenProjekt;
  weitere: KundenProjekt[];
}

const T = t.projektDetail;

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" },
} as const;

function LogoTile({ projekt, lang, size }: { projekt: KundenProjekt; lang: Lang; size: "lg" | "sm" }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-text-primary ${
        size === "lg" ? "h-40 w-full max-w-sm px-10 py-8" : "h-20 w-40 px-5 py-3"
      }`}
    >
      <Image
        src={projekt.logo.src}
        alt={getText(projekt.logo.alt, lang)}
        width={projekt.logo.width}
        height={projekt.logo.height}
        unoptimized={projekt.logo.src.endsWith(".svg")}
        priority={size === "lg"}
        className="max-h-full w-auto h-auto max-w-full object-contain"
      />
    </div>
  );
}

export default function ProjektDetail({ projekt, weitere }: ProjektDetailProps) {
  const [lang, setLang] = useState<Lang>("de");
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("lang") === "en") {
      setLang("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "de";
  }, [lang]);

  const openWizard = () => setWizardOpen(true);
  const homeHref = lang === "en" ? "/?lang=en" : "/";

  return (
    <div className="min-h-screen">
      {/* Skip-Link kommt global aus app/layout.tsx und springt auf #main */}
      <ParticleNetwork />
      <div className="relative z-[1]">
        <Navigation lang={lang} setLang={setLang} onOpenWizard={openWizard} />

        <main id="main" tabIndex={-1} className="mx-auto max-w-7xl px-6 pb-24 pt-36 focus:outline-none">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid items-center gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
          >
            <div>
              <Link
                href={`${homeHref}#portfolio`}
                className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-text-dim transition-colors duration-200 hover:text-primary"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M11 7H3M7 11L3 7l4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {getText(T.back, lang)}
              </Link>
              <p className="tag mb-4">{getText(T.tag, lang)}</p>
              <h1 className="font-display text-4xl font-bold text-text-primary md:text-5xl">
                {projekt.kunde}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-dim">
                {getText(projekt.teaser, lang)}
              </p>

              <dl className="mt-8 grid gap-x-8 gap-y-3 font-mono text-xs sm:flex sm:flex-wrap">
                <div className="flex gap-2">
                  <dt className="text-text-muted">{getText(T.client, lang)}:</dt>
                  <dd className="text-text-primary">{projekt.firma ?? projekt.kunde}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-text-muted">{getText(T.industry, lang)}:</dt>
                  <dd className="text-text-primary">{getText(projekt.branche, lang)}</dd>
                </div>
                {projekt.jahr !== undefined && (
                  <div className="flex gap-2">
                    <dt className="text-text-muted">{getText(T.year, lang)}:</dt>
                    <dd className="text-text-primary">{projekt.jahr}</dd>
                  </div>
                )}
              </dl>

              {projekt.liveUrl && (
                <a
                  href={projekt.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-colors duration-200 hover:border-primary/50 hover:bg-primary/10"
                >
                  {getText(T.live, lang)}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M5 3h6v6M11 3L3.5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
            </div>

            <div className="flex justify-center rounded-2xl border border-border bg-surface/50 p-8 backdrop-blur-sm lg:justify-end lg:p-10">
              <LogoTile projekt={projekt} lang={lang} size="lg" />
            </div>
          </motion.header>

          {/* Ausgangslage */}
          <section aria-labelledby="ausgangslage" className="pt-20">
            <motion.div {...reveal} className="max-w-3xl">
              <p className="tag mb-4">{getText(T.needTag, lang)}</p>
              <h2 id="ausgangslage" className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                {getText(T.needHeadline, lang)}
              </h2>
              <p className="mt-6 leading-relaxed text-text-dim">{getText(projekt.ausgangslage, lang)}</p>
            </motion.div>
          </section>

          {/* Was gebaut wurde */}
          <section aria-labelledby="gebaut" className="pt-20">
            <motion.div {...reveal} className="mb-8">
              <p className="tag mb-4">{getText(T.builtTag, lang)}</p>
              <h2 id="gebaut" className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                {getText(T.builtHeadline, lang)}
              </h2>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2">
              {projekt.gebaut.map((b, i) => (
                <motion.article
                  key={b.titel.de}
                  {...reveal}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: "easeOut" }}
                  className="rounded-2xl border border-border bg-surface/50 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-primary/30"
                >
                  <p className="font-mono text-xs tracking-widest text-primary">
                    {`BUILD_${String(i + 1).padStart(2, "0")}`}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-text-primary">{getText(b.titel, lang)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">{getText(b.text, lang)}</p>
                </motion.article>
              ))}
            </div>

            {projekt.leistungen.length > 0 && (
              <motion.div {...reveal} className="mt-8">
                <p className="mb-3 text-sm font-semibold text-text-primary">{getText(T.servicesLabel, lang)}:</p>
                <ul className="flex flex-wrap gap-2">
                  {projekt.leistungen.map((l) => (
                    <li
                      key={l.de}
                      className="rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[11px] text-text-dim"
                    >
                      {getText(l, lang)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </section>

          {/* Entscheidungen */}
          {projekt.entscheidungen.length > 0 && (
            <section aria-labelledby="entscheidungen" className="pt-20">
              <motion.div {...reveal} className="mb-8">
                <p className="tag mb-4">{getText(T.decisionsTag, lang)}</p>
                <h2 id="entscheidungen" className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                  {getText(T.decisionsHeadline, lang)}
                </h2>
              </motion.div>
              <div className="grid gap-4 md:grid-cols-2">
                {projekt.entscheidungen.map((e, i) => (
                  <motion.div
                    key={e.titel.de}
                    {...reveal}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-surface/50 p-5"
                  >
                    <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-text-primary">{getText(e.titel, lang)}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">{getText(e.text, lang)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Weitere Projekte (nur, wenn es welche gibt) */}
          {weitere.length > 0 && (
            <section aria-labelledby="weitere" className="pt-20">
              <motion.div {...reveal} className="mb-8">
                <p className="tag mb-4">{getText(T.moreTag, lang)}</p>
                <h2 id="weitere" className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                  {getText(T.moreHeadline, lang)}
                </h2>
              </motion.div>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {weitere.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={projektHref(p.slug, lang)}
                      className="flex h-full items-center gap-5 rounded-2xl border border-border bg-surface/50 p-5 transition-colors duration-300 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <LogoTile projekt={p} lang={lang} size="sm" />
                      <span>
                        <span className="block font-display font-semibold text-text-primary">{p.kunde}</span>
                        <span className="mt-1 block text-sm text-text-muted">{getText(p.branche, lang)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Abschluss-CTA */}
          <section className="pt-20">
            <motion.div
              {...reveal}
              className="rounded-2xl border border-border bg-surface/60 p-8 text-center backdrop-blur-sm md:p-12"
            >
              <p className="tag mb-4">{getText(T.ctaTag, lang)}</p>
              <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                {getText(T.ctaHeadline, lang)}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
                {getText(T.ctaSub, lang)}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={openWizard}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-colors duration-200 hover:bg-primary/90"
                >
                  {getText(T.ctaPrimary, lang)}
                </button>
                <Link
                  href={lang === "en" ? "/leistungen?lang=en" : "/leistungen"}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text-muted transition-colors duration-200 hover:border-primary/30 hover:text-text-primary"
                >
                  {getText(T.ctaSecondary, lang)}
                </Link>
              </div>
            </motion.div>
          </section>
        </main>

        <Footer lang={lang} />
        <ProjectWizard open={wizardOpen} onClose={() => setWizardOpen(false)} lang={lang} />
      </div>
    </div>
  );
}
