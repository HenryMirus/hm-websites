"use client";

import { motion } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";

interface ProcessSectionProps {
  lang: Lang;
  onOpenWizard: () => void;
}

export default function ProcessSection({ lang, onOpenWizard }: ProcessSectionProps) {
  const steps = t.process.steps;

  return (
    <section id="process" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="tag">{getText(t.process.tag, lang)}</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-text-primary mt-3 max-w-2xl mx-auto">
            <TypewriterText text={getText(t.process.headline, lang)} delay={0.3} />
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line with animated dot */}
          <style>{`
            @keyframes proc-dot {
              0%   { left: -1%; opacity: 0; }
              6%   { opacity: 1; }
              94%  { opacity: 1; }
              100% { left: 101%; opacity: 0; }
            }
            .proc-dot { animation: proc-dot 8s linear infinite; }
          `}</style>
          <div className="hidden md:block absolute top-12 left-[16.7%] right-[16.7%] h-px pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-border via-primary/30 to-border" />
            <div
              className="proc-dot absolute top-0 w-3 h-3 rounded-full"
              style={{
                marginTop: "-5px",
                backgroundColor: "#4F7FFF",
                boxShadow: "0 0 10px rgba(79,127,255,0.9), 0 0 20px rgba(79,127,255,0.4)",
              }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step circle */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-surface border border-border flex flex-col items-center justify-center relative z-10 gap-0.5">
                  <span className="font-mono text-[9px] text-primary/50 tracking-widest">STEP</span>
                  <span className="font-display font-bold text-3xl text-primary opacity-80">
                    {step.num}
                  </span>
                </div>
                {i === 1 && (
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                )}
              </div>

              {/* Duration badge */}
              <span className="font-mono text-xs text-text-dim bg-bg border border-border rounded-full px-3 py-1 mb-4">
                {getText(step.duration, lang)}
              </span>

              <h3 className="font-display font-semibold text-xl text-text-primary mb-3">
                {getText(step.title, lang)}
              </h3>

              <p className="text-text-dim text-sm leading-relaxed max-w-xs mx-auto">
                {getText(step.desc, lang)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-14"
        >
          <button
            onClick={onOpenWizard}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-primary/20"
          >
            {getText(t.process.projectCta, lang)}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
