"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";

interface FAQSectionProps {
  lang: Lang;
}

export default function FAQSection({ lang }: FAQSectionProps) {
  const [open, setOpen] = useState<number | null>(null);
  const items = t.faq.items;

  return (
    <section id="faq" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="tag">{getText(t.faq.tag, lang)}</span>
          <h2 className="font-display font-bold text-5xl lg:text-6xl text-text-primary mt-3 mb-4 max-w-2xl leading-tight">
            <TypewriterText text={getText(t.faq.headline, lang)} delay={0.3} />
          </h2>
          <p className="text-text-dim text-lg max-w-xl">
            {getText(t.faq.sub, lang)}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-x-12 gap-y-0">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.07 }}
              className="border-b border-border"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 py-5 text-left group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="font-mono text-[10px] text-primary/40 mt-1 shrink-0 tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display font-semibold text-text-primary group-hover:text-primary/90 transition-colors duration-200 leading-snug">
                    {getText(item.q, lang)}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 mt-0.5 w-5 h-5 rounded-full border border-border flex items-center justify-center text-text-muted group-hover:border-primary/30 group-hover:text-primary transition-colors duration-200"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-text-dim text-sm leading-relaxed pb-5 pl-8">
                      {getText(item.a, lang)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
