"use client";

import { motion } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";

interface PortfolioSectionProps {
  lang: Lang;
}

const CASE_ICONS = [
  // Globe / Web
  <svg key="web" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 1.5C8 1.5 5.5 4.5 5.5 8s2.5 6.5 2.5 6.5M8 1.5C8 1.5 10.5 4.5 10.5 8S8 14.5 8 14.5M1.5 8h13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>,
  // Bot
  <svg key="bot" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="5" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M6 2.5h4M8 2.5V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="5.5" cy="9.5" r="1" fill="currentColor" />
    <circle cx="10.5" cy="9.5" r="1" fill="currentColor" />
    <path d="M5.5 11.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>,
  // Zap
  <svg key="zap" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M9 1.5L3 9.5H8L7 14.5L13 6.5H8L9 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

export default function PortfolioSection({ lang }: PortfolioSectionProps) {
  const cases = t.portfolio.items;

  return (
    <section id="portfolio" className="py-28 relative">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="tag">{getText(t.portfolio.tag, lang)}</span>
          <h2 className="font-display font-bold text-5xl lg:text-6xl text-text-primary mt-3 mb-3 leading-tight">
            <TypewriterText text={getText(t.portfolio.headline, lang)} delay={0.3} />
          </h2>
          <p className="text-text-dim text-lg max-w-lg">
            {getText(t.portfolio.sub, lang)}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {cases.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="group bg-surface border border-border/70 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-[0_0_32px_rgba(79,127,255,0.12)] transition-all duration-300 flex flex-col"
            >
              {/* Card header */}
              <div className="bg-bg border-b border-border px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] text-primary/50 tracking-widest mb-1">{item.caseId}</div>
                  <div className="font-mono text-xs text-text-dim">{getText(item.client, lang)}</div>
                  <div className="font-mono text-[11px] text-primary/60 mt-0.5">{getText(item.type, lang)}</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  {CASE_ICONS[i]}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display font-semibold text-lg text-text-primary mb-3 leading-snug">
                  {getText(item.title, lang)}
                </h3>
                <p className="text-text-dim text-sm leading-relaxed mb-5 flex-1">
                  {getText(item.desc, lang)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] text-text-dim bg-bg border border-border rounded-md px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom progress bar on hover */}
              <div className="h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-accent/40 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
