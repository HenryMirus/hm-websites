"use client";

import { motion } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";

interface AboutSectionProps {
  lang: Lang;
}

export default function AboutSection({ lang }: AboutSectionProps) {
  const values = t.about.values;

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="tag">{getText(t.about.tag, lang)}</span>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-text-primary mt-3 mb-5 leading-tight">
              <TypewriterText text={getText(t.about.headline, lang)} delay={0.3} />
            </h2>
            <p className="text-text-dim text-lg leading-relaxed mb-10">
              {getText(t.about.sub, lang)}
            </p>

            {/* Values */}
            <div className="space-y-4">
              {values.map((value, i) => (
                <div
                  key={i}
                  className="flex gap-4 bg-surface border border-border rounded-xl p-5 hover:border-primary/25 transition-colors duration-300"
                >
                  <div className="font-mono text-xs text-primary pt-0.5 shrink-0 opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-text-primary mb-1.5">
                      {getText(value.title, lang)}
                    </h3>
                    <p className="text-text-dim text-sm leading-relaxed">
                      {getText(value.desc, lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-6"
          >
            {/* Profile card */}
            <div className="relative bg-surface border border-border rounded-2xl p-7 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="flex items-start gap-5 mb-5">
                {/* Portrait photo */}
                <div className="relative shrink-0">
                  <motion.div
                    className="absolute -inset-1 rounded-2xl border border-primary/25"
                    animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-primary/25 shadow-xl shadow-primary/15">
                    <img
                      src="/henry-portrait-new.png"
                      alt="Henry M."
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-xl text-text-primary">Henry M.</h3>
                  <p className="text-text-dim text-sm mt-1">
                    {lang === "de" ? "Entwickler · KI-Experte · Unternehmer" : "Developer · AI Expert · Entrepreneur"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
                    <span className="font-mono text-[11px] text-green-400/70">
                      {lang === "de" ? "Verfügbar für neue Projekte" : "Available for new projects"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-text-dim text-sm leading-relaxed">
                {lang === "de"
                  ? "Ich kombiniere technische Expertise mit unternehmerischem Denken — und baue Lösungen, die wirklich funktionieren, nicht nur gut aussehen."
                  : "I combine technical expertise with entrepreneurial thinking — and build solutions that actually work, not just look good."}
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "10+", label: lang === "de" ? "Projekte" : "Projects" },
                { val: "14 Tage", label: lang === "de" ? "Ø Launch-Zeit" : "Avg. launch time" },
                { val: "100%", label: lang === "de" ? "Direkte Kommunikation" : "Direct communication" },
                { val: "24h", label: lang === "de" ? "Antwortzeit" : "Response time" },
              ].map((s, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl p-4 text-center">
                  <div className="font-display font-bold text-2xl text-text-primary">{s.val}</div>
                  <div className="text-text-dim text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
