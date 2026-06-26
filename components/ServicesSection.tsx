"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";

interface ServicesSectionProps {
  lang: Lang;
}

function SpotlightCard({
  children,
  highlight = false,
  className = "",
}: {
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
        highlight
          ? "border-primary/40 bg-gradient-to-b from-primary/8 to-surface hover:shadow-[0_0_32px_rgba(79,127,255,0.12)]"
          : "border-border bg-surface hover:border-primary/20 hover:shadow-[0_0_24px_rgba(79,127,255,0.07)]"
      } ${className}`}
    >
      {/* Spotlight radial gradient */}
      {hovered && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, rgba(79,127,255,0.07), transparent 70%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const show = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
    }
    setVisible(true);
  };

  return (
    <>
      <button
        ref={btnRef}
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        onFocus={show}
        onBlur={() => setVisible(false)}
        type="button"
        className="ml-0.5 w-3.5 h-3.5 rounded-full border border-text-muted/50 text-text-muted hover:border-primary hover:text-primary transition-colors inline-flex items-center justify-center flex-shrink-0 cursor-help"
        aria-label="Mehr Infos"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <circle cx="4" cy="4" r="3.2" stroke="currentColor" strokeWidth="0.9" />
          <path d="M4 3.5v2.2" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
          <circle cx="4" cy="2.3" r="0.45" fill="currentColor" />
        </svg>
      </button>
      {mounted && visible && createPortal(
        <div
          className="pointer-events-none fixed z-[99999] w-52 bg-surface border border-border rounded-xl px-3 py-2.5 text-xs text-text-dim shadow-[0_4px_24px_rgba(0,0,0,0.45)] leading-relaxed"
          style={{
            left: pos.x,
            top: pos.y,
            transform: "translate(-50%, calc(-100% - 6px))",
          }}
        >
          {text}
          <span className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 block w-2.5 h-2.5 bg-surface border-r border-b border-border rotate-45" />
        </div>,
        document.body
      )}
    </>
  );
}

const ServiceIcons = [
  // Globe / Website
  <svg key="web" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.4" />
    <path d="M11 2c0 0-4 3.5-4 9s4 9 4 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M11 2c0 0 4 3.5 4 9s-4 9-4 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M2 11h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M3 7h16M3 15h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>,
  // Lightning bolt / AI
  <svg key="ai" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M12 2L4.5 12.5H11L10 20L17.5 9.5H11L12 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Layers / Software
  <svg key="sw" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M2 6l9-4 9 4-9 4-9-4Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 11l9 4 9-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M2 16l9 4 9-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>,
];

export default function ServicesSection({ lang }: ServicesSectionProps) {
  const services = t.services.items;

  return (
    <section id="services" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="tag">{getText(t.services.tag, lang)}</span>
          <h2 className="font-display font-bold text-5xl lg:text-6xl text-text-primary mt-3 mb-4 max-w-2xl leading-tight">
            <TypewriterText text={getText(t.services.headline, lang)} delay={0.3} />
          </h2>
          <p className="text-text-dim text-lg max-w-xl">
            {getText(t.services.sub, lang)}
          </p>
        </motion.div>

        {/* Bento grid: first card large, two smaller */}
        <div className="grid lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={i === 0 ? "lg:col-span-1 lg:row-span-1" : ""}
            >
              <SpotlightCard highlight={service.highlight} className="h-full">
                {/* Top accent line for highlighted card */}
                {service.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                )}

                <div className="p-7 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        service.highlight
                          ? "bg-primary/15 border-primary/30 text-primary"
                          : "bg-bg border-border text-text-dim"
                      }`}>
                        {ServiceIcons[i]}
                      </div>
                      <span className="font-mono text-xs text-text-muted">
                        {getText(service.tag, lang)}
                      </span>
                    </div>
                    {service.highlight && (
                      <span className="font-mono text-[10px] bg-primary/15 text-primary border border-primary/20 rounded-full px-2 py-0.5">
                        Beliebt
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-semibold text-xl text-text-primary mb-3">
                    {getText(service.title, lang)}
                  </h3>

                  {/* Description */}
                  <p className="text-text-dim text-sm leading-relaxed mb-6">
                    {getText(service.desc, lang)}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2.5 text-sm text-text-dim">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-primary shrink-0">
                          <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="flex items-center gap-1 min-w-0">
                          {getText(f, lang)}
                          {"tooltip" in f && f.tooltip && (
                            <InfoTooltip text={getText(f.tooltip as { de: string; en: string }, lang)} />
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Metric */}
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="font-display font-bold text-lg text-accent">
                      {getText(service.metric, lang)}
                    </span>
                    <a
                      href="#contact"
                      className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${
                        service.highlight ? "text-primary hover:text-white" : "text-text-muted hover:text-primary"
                      }`}
                    >
                      {getText(t.services.inquire, lang)}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Visual showcase */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 relative rounded-2xl overflow-hidden border border-border"
        >
          <picture>
            <source srcSet="/services-visual.webp" type="image/webp" />
            <img src="/services-visual.png" alt={getText(t.services.imageAlt, lang)} width={1440} height={320} className="w-full object-cover" style={{ maxHeight: "320px" }} loading="lazy" />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/30 via-transparent to-bg/30" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-8">
            {t.services.imageLabels.map((item) => (
              <div key={item.de} className="flex items-center gap-2 bg-bg/70 backdrop-blur-md border border-border rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="font-mono text-xs text-text-dim">{getText(item, lang)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
