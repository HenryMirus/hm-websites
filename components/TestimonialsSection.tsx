"use client";

import { motion } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";

interface TestimonialsSectionProps {
  lang: Lang;
}

export default function TestimonialsSection({ lang }: TestimonialsSectionProps) {
  const items = t.testimonials.items;

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface/0 via-surface/50 to-surface/0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="tag">{getText(t.testimonials.tag, lang)}</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-text-primary mt-3">
            <TypewriterText text={getText(t.testimonials.headline, lang)} delay={0.3} />
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative bg-surface border border-border rounded-2xl p-7 flex flex-col"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

              {/* Quote mark */}
              <div className="font-display text-5xl text-primary/20 leading-none mb-4 select-none">"</div>

              {/* Quote */}
              <p className="text-text-dim text-sm leading-relaxed flex-1 mb-6">
                {getText(item.quote, lang)}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="font-display font-bold text-sm text-primary">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm text-text-primary">{item.name}</div>
                  <div className="font-mono text-[11px] text-text-dim">{getText(item.role, lang)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
