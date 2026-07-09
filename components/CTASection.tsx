"use client";

import { motion } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";

interface CTASectionProps {
  lang: Lang;
  onOpenWizard: () => void;
}

export default function CTASection({ lang, onOpenWizard }: CTASectionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 via-surface to-accent/5 p-12 lg:p-16 overflow-hidden text-center"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-accent/5 rounded-full blur-[60px] pointer-events-none" />

          {/* Top line */}
          <div className="absolute top-0 left-16 right-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative z-10">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="tag mb-4 block"
            >
              {getText(t.cta.tag, lang)}
            </motion.span>

            <h2 className="font-display font-bold text-4xl lg:text-5xl xl:text-6xl text-text-primary mb-5 max-w-3xl mx-auto leading-tight">
              <TypewriterText text={getText(t.cta.headline, lang)} delay={0.3} />
            </h2>

            <p className="text-text-dim text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {getText(t.cta.sub, lang)}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenWizard}
                className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary/90 transition-all duration-200 text-white font-semibold px-8 py-4 rounded-xl shadow-xl shadow-primary/25 text-lg"
              >
                {getText(t.cta.cta1, lang)}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a
                href={`mailto:${t.cta.cta2.de}`}
                className="inline-flex items-center gap-2 text-text-dim hover:text-primary transition-colors font-medium"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                {t.cta.cta2.de}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
