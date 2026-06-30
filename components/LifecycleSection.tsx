"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";

interface LifecycleSectionProps {
  lang: Lang;
}

// Non-translatable stage metadata (color, number) — text lives in t.lifecycle.stages
const STAGE_META = [
  { num: "01", color: "#4F7FFF" },
  { num: "02", color: "#FF4D6A" },
  { num: "03", color: "#10B981" },
  { num: "04", color: "#F59E0B" },
  { num: "05", color: "#8B5CF6" },
  { num: "06", color: "#06B6D4" },
] as const;

const STAGES = STAGE_META.map((meta, i) => ({ ...meta, ...t.lifecycle.stages[i] }));

// ── Stage UI Mockups ──────────────────────────────────────────────────────────

function MockupWebsite() {
  return (
    <div className="rounded-xl border border-[#1E1E2E] bg-[#09090F] overflow-hidden text-[11px] font-mono">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#1E1E2E] bg-[#111118]">
        <span className="w-2 h-2 rounded-full bg-[#FF4D6A]/60" />
        <span className="w-2 h-2 rounded-full bg-[#F59E0B]/40" />
        <span className="w-2 h-2 rounded-full bg-[#10B981]/40" />
        <span className="text-[#5A5A7A] ml-2 flex-1 text-center">hm-sanitaer.de</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="w-16 h-2 rounded bg-[#4F7FFF]/30" />
          <div className="flex gap-2">
            {["Leistungen", "Über uns", "Kontakt"].map(l => (
              <div key={l} className="w-10 h-1.5 rounded bg-[#1E1E2E]" />
            ))}
          </div>
        </div>
        <div className="py-4 space-y-1.5">
          <div className="text-[#EEEEFF] text-base font-bold font-sans leading-tight">Mehr Kunden.</div>
          <div className="text-[#EEEEFF] text-base font-bold font-sans leading-tight">Weniger Aufwand.</div>
          <div className="text-[#4F7FFF] text-base font-bold font-sans leading-tight">Durch KI.</div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-[#4F7FFF] text-white rounded-lg px-3 py-1.5 text-[10px] font-sans font-semibold">
            Jetzt anfragen →
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          {["SEO ✓", "Mobile ✓", "<1s ✓"].map(b => (
            <span key={b} className="text-[#10B981] text-[10px]">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockupChatbot({ lang }: { lang: Lang }) {
  const messages = lang === "de"
    ? [
        { bot: true, text: "Hallo! Womit kann ich heute helfen? 👋" },
        { bot: false, text: "Ich brauche ein Angebot für Heizung" },
        { bot: true, text: "Super! Wann soll jemand vorbeikommen?" },
      ]
    : [
        { bot: true, text: "Hello! How can I help today? 👋" },
        { bot: false, text: "I need a quote for heating" },
        { bot: true, text: "Great! When should someone come by?" },
      ];

  return (
    <div className="rounded-xl border border-[#1E1E2E] bg-[#09090F] overflow-hidden text-[11px] font-mono">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E1E2E] bg-[#111118]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#FF4D6A]/20 border border-[#FF4D6A]/30 flex items-center justify-center">
            <span className="text-[8px]">🤖</span>
          </div>
          <span className="text-[#EEEEFF] font-sans text-[10px] font-semibold">{lang === "de" ? "KI-Assistent" : "AI Assistant"}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400/70 text-[9px]">24/7</span>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.bot ? "justify-start" : "justify-end"}`}>
            <div
              className={`rounded-xl px-2.5 py-1.5 text-[10px] font-sans max-w-[75%] leading-relaxed ${
                m.bot
                  ? "bg-[#111118] border border-[#1E1E2E] text-[#EEEEFF]"
                  : "bg-[#FF4D6A]/15 border border-[#FF4D6A]/25 text-[#EEEEFF]"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div className="pt-1">
          <div className="bg-[#FF4D6A]/10 border border-[#FF4D6A]/25 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-[#FF4D6A] text-[10px] font-sans">
              📅 {lang === "de" ? "Termin auswählen" : "Select appointment"}
            </span>
            <span className="text-[#FF4D6A]">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockupCommunication({ lang }: { lang: Lang }) {
  const rows = lang === "de"
    ? [
        { name: "Markus T.", subject: "Anfrage Heizungsanlage", status: "KI antwortet in 90 Sek.", active: true },
        { name: "Sandra L.", subject: "Rückfrage zu Angebot", status: "Beantwortet", active: false },
        { name: "Stefan B.", subject: "Neues Projekt?", status: "Weitergeleitet", active: false },
      ]
    : [
        { name: "Markus T.", subject: "Heating inquiry", status: "AI responds in 90 sec.", active: true },
        { name: "Sandra L.", subject: "Question about quote", status: "Answered", active: false },
        { name: "Stefan B.", subject: "New project?", status: "Forwarded", active: false },
      ];

  return (
    <div className="rounded-xl border border-[#1E1E2E] bg-[#09090F] overflow-hidden text-[10px] font-mono">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E1E2E] bg-[#111118]">
        <span className="text-[#EEEEFF] font-sans font-semibold text-[11px]">
          {lang === "de" ? "Posteingang" : "Inbox"}
        </span>
        <span className="text-[#10B981] text-[9px]">KI aktiv</span>
      </div>
      {rows.map((row, i) => (
        <div key={i} className={`px-3 py-2.5 border-b border-[#1E1E2E] ${row.active ? "bg-[#10B981]/5" : ""}`}>
          <div className="flex items-start gap-2">
            <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${row.active ? "bg-[#10B981]" : "bg-[#1E1E2E]"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="text-[#EEEEFF] font-sans font-medium text-[10px]">{row.name}</span>
              </div>
              <div className="text-[#5A5A7A] truncate">{row.subject}</div>
              <div className={`text-[9px] mt-0.5 ${row.active ? "text-[#10B981]" : "text-[#5A5A7A]"}`}>{row.status}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MockupQuote({ lang }: { lang: Lang }) {
  return (
    <div className="rounded-xl border border-[#1E1E2E] bg-[#09090F] overflow-hidden text-[10px] font-mono">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E1E2E] bg-[#111118]">
        <span className="text-[#EEEEFF] font-sans font-semibold text-[11px]">
          {lang === "de" ? "Angebot #0042" : "Quote #0042"}
        </span>
        <span className="bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] rounded px-1.5 py-0.5 text-[9px]">
          KI · 95 Sek.
        </span>
      </div>
      <div className="p-3 space-y-2">
        <div className="text-[#8888AA] text-[9px]">Müller GmbH · Sanitär & Heizung</div>
        <div className="space-y-1 py-1">
          {[
            { label: lang === "de" ? "Heizungsanlage tauschen" : "Replace heating system", price: "2.400€" },
            { label: lang === "de" ? "Montage (2 Tage)" : "Assembly (2 days)", price: "800€" },
            { label: lang === "de" ? "Material & Dichtungen" : "Material & seals", price: "340€" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center border-b border-[#1E1E2E] pb-1">
              <span className="text-[#EEEEFF] text-[9px] font-sans">{item.label}</span>
              <span className="text-[#F59E0B]">{item.price}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-[#EEEEFF] font-sans font-semibold text-[10px]">
            {lang === "de" ? "Gesamt" : "Total"}
          </span>
          <span className="text-[#F59E0B] font-bold text-[13px]">3.540€</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="bg-[#F59E0B]/15 border border-[#F59E0B]/30 rounded-lg px-2.5 py-1.5 text-[9px] font-sans text-[#F59E0B]">
            PDF {lang === "de" ? "senden" : "send"} →
          </div>
          <span className="text-[#10B981] text-[9px]">✓ {lang === "de" ? "Versendet" : "Sent"}</span>
        </div>
      </div>
    </div>
  );
}

function MockupProject({ lang }: { lang: Lang }) {
  const steps = lang === "de"
    ? ["Planung", "Demontage", "Fliesen", "Fertig"]
    : ["Planning", "Removal", "Tiling", "Done"];
  const doneCount = 2;

  return (
    <div className="rounded-xl border border-[#1E1E2E] bg-[#09090F] overflow-hidden text-[10px] font-mono">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E1E2E] bg-[#111118]">
        <span className="text-[#EEEEFF] font-sans font-semibold text-[11px]">
          {lang === "de" ? "Kunden-Portal" : "Client Portal"}
        </span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400/70 text-[9px]">live</span>
        </div>
      </div>
      <div className="p-3 space-y-3">
        <div className="text-[#EEEEFF] font-sans font-medium text-[10px]">
          {lang === "de" ? "Badezimmer-Renovierung" : "Bathroom Renovation"}
        </div>
        <div>
          <div className="flex justify-between text-[9px] text-[#5A5A7A] mb-1">
            <span>{lang === "de" ? "Fortschritt" : "Progress"}</span>
            <span className="text-[#8B5CF6]">75%</span>
          </div>
          <div className="h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
            <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: "75%" }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {steps.map((step, i) => (
            <div key={i} className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 ${
              i < doneCount
                ? "border-[#8B5CF6]/30 bg-[#8B5CF6]/8"
                : i === doneCount
                ? "border-[#8B5CF6]/50 bg-[#8B5CF6]/15"
                : "border-[#1E1E2E] bg-transparent"
            }`}>
              <span className={`text-[10px] ${i < doneCount ? "text-[#8B5CF6]" : i === doneCount ? "text-[#8B5CF6]" : "text-[#5A5A7A]"}`}>
                {i < doneCount ? "✓" : i === doneCount ? "◉" : "○"}
              </span>
              <span className={`font-sans text-[9px] ${i <= doneCount ? "text-[#EEEEFF]" : "text-[#5A5A7A]"}`}>{step}</span>
            </div>
          ))}
        </div>
        <div className="text-[#5A5A7A] text-[9px]">
          {lang === "de" ? "Nächster Schritt: Freitag, 14:00" : "Next step: Friday, 2pm"}
        </div>
      </div>
    </div>
  );
}

function MockupRecurrence({ lang }: { lang: Lang }) {
  const steps = lang === "de"
    ? [
        { day: "Tag 1", label: "Willkommensmail", done: true },
        { day: "Tag 7", label: "Feedback-Anfrage", done: true },
        { day: "Tag 30", label: "Folge-Angebot", live: true },
        { day: "Tag 90", label: "Jahres-Check", done: false },
      ]
    : [
        { day: "Day 1", label: "Welcome email", done: true },
        { day: "Day 7", label: "Feedback request", done: true },
        { day: "Day 30", label: "Follow-up offer", live: true },
        { day: "Day 90", label: "Annual check", done: false },
      ];

  return (
    <div className="rounded-xl border border-[#1E1E2E] bg-[#09090F] overflow-hidden text-[10px] font-mono">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E1E2E] bg-[#111118]">
        <span className="text-[#EEEEFF] font-sans font-semibold text-[11px]">
          {lang === "de" ? "Follow-up Sequenz" : "Follow-up Sequence"}
        </span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
          <span className="text-[#06B6D4] text-[9px]">{lang === "de" ? "Aktiv" : "Active"}</span>
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-2 ${
            s.live ? "border-[#06B6D4]/40 bg-[#06B6D4]/8" : "border-[#1E1E2E]"
          }`}>
            <span className={`text-[11px] ${s.done ? "text-[#10B981]" : s.live ? "text-[#06B6D4]" : "text-[#5A5A7A]"}`}>
              {s.done ? "✓" : s.live ? "◉" : "○"}
            </span>
            <span className="text-[#5A5A7A] w-10 shrink-0 text-[9px]">{s.day}</span>
            <span className={`font-sans text-[10px] flex-1 ${s.live ? "text-[#06B6D4]" : s.done ? "text-[#EEEEFF]" : "text-[#5A5A7A]"}`}>
              {s.label}
            </span>
            {s.live && (
              <span className="bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4] rounded px-1 py-0.5 text-[8px]">
                live
              </span>
            )}
          </div>
        ))}
        <div className="text-[#5A5A7A] text-[9px] pt-1">
          12 {lang === "de" ? "aktive Sequenzen · vollautomatisch" : "active sequences · fully automated"}
        </div>
      </div>
    </div>
  );
}

const MOCKUPS = [MockupWebsite, MockupChatbot, MockupCommunication, MockupQuote, MockupProject, MockupRecurrence];

// ── Stage Tab Button ──────────────────────────────────────────────────────────

function StageTab({
  stage,
  active,
  lang,
  onClick,
  tabRef,
  hasStarted,
  progressKey,
}: {
  stage: (typeof STAGES)[0];
  active: boolean;
  lang: Lang;
  onClick: () => void;
  tabRef?: (el: HTMLButtonElement | null) => void;
  hasStarted: boolean;
  progressKey: number;
}) {
  return (
    <button
      ref={tabRef}
      onClick={onClick}
      className="flex-shrink-0 text-left rounded-xl border transition-all duration-200 p-4 w-48 relative overflow-hidden"
      style={{
        borderColor: active ? `${stage.color}60` : "#2A2A3E",
        backgroundColor: active ? `${stage.color}12` : "#141420",
      }}
    >
      {/* Number + pulse dot */}
      <div className="font-mono text-xs mb-2 flex items-center gap-2">
        <span className="font-bold" style={{ color: stage.color }}>{stage.num}</span>
        {active && (
          <motion.span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: stage.color }}
            animate={{ scale: [1, 1.7, 1], opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      <div className="font-display font-semibold text-sm text-text-primary leading-snug">
        {getText(stage.name, lang)}
      </div>
      <div
        className="font-mono text-[10px] mt-2 leading-snug truncate"
        style={{ color: stage.color, opacity: 0.75 }}
      >
        {getText(stage.module, lang)}
      </div>

      {/* Auto-cycle progress bar — only runs after section enters viewport */}
      {active && hasStarted && (
        <motion.div
          key={`progress-${stage.num}-${progressKey}`}
          className="absolute bottom-0 left-0 h-0.5"
          style={{ backgroundColor: stage.color }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 15, ease: "linear" }}
        />
      )}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function LifecycleSection({ lang }: LifecycleSectionProps) {
  const [active, setActive] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabEls = useRef<(HTMLButtonElement | null)[]>([]);

  const stage = STAGES[active];
  const MockupComponent = MOCKUPS[active];

  // Start cycling only once the section enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasStarted(true); },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % STAGES.length);
      setTimerKey((k) => k + 1);
    }, 15000);
    return () => clearInterval(timer);
  }, [hasStarted, timerKey]);

  // Scroll active tab into horizontal center when it changes
  useEffect(() => {
    const container = tabsRef.current;
    const tab = tabEls.current[active];
    if (!container || !tab) return;
    const scrollTo = tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
    container.scrollTo({ left: scrollTo, behavior: "smooth" });
  }, [active]);

  return (
    <section ref={sectionRef} id="lifecycle" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/[0.015] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="tag">{getText(t.lifecycle.tag, lang)}</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-text-primary mt-3 mb-4 max-w-2xl">
            <TypewriterText text={getText(t.lifecycle.headline, lang)} delay={0.3} />
          </h2>
          <p className="text-text-dim text-lg max-w-xl">
            {getText(t.lifecycle.sub, lang)}
          </p>
        </motion.div>

        {/* Stage Tabs — horizontal scroll */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          ref={tabsRef}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {STAGES.map((s, i) => (
            <StageTab
              key={i}
              stage={s}
              active={active === i}
              lang={lang}
              onClick={() => { setActive(i); setTimerKey((k) => k + 1); }}
              tabRef={(el) => { tabEls.current[i] = el; }}
              hasStarted={hasStarted}
              progressKey={timerKey}
            />
          ))}
        </motion.div>

        {/* Horizontal dot pagination */}
        <div className="flex items-center justify-center gap-2.5 mt-4 mb-6">
          {STAGES.map((s, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setTimerKey((k) => k + 1); }}
              aria-label={`Stage ${i + 1}`}
              className="flex items-center justify-center p-1"
            >
              <motion.span
                animate={{
                  width: active === i ? 8 : 5,
                  height: active === i ? 8 : 5,
                  backgroundColor: active === i ? "#4F7FFF" : "#1E1E2E",
                }}
                transition={{ duration: 0.2 }}
                className="rounded-full border border-[#2A2A3E] block"
              />
            </button>
          ))}
        </div>

        {/* Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative rounded-2xl border overflow-hidden"
            style={{ borderColor: `${stage.color}25`, backgroundColor: "#111118" }}
          >
            {/* Animated sweep line on stage change */}
            <motion.div
              key={`sweep-${active}`}
              className="absolute top-0 left-0 h-0.5 z-10"
              style={{ backgroundColor: stage.color }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
            />

            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left — Problem + Solution */}
              <div className="p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1E1E2E]">
                <div>
                  {/* Stage label — animated on switch */}
                  <div className="flex items-center gap-2 mb-6">
                    <motion.span
                      key={`badge-${active}`}
                      initial={{ opacity: 0, y: -6, scale: 0.88 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="font-mono text-[11px] px-2.5 py-1 rounded-full border"
                      style={{ color: stage.color, borderColor: `${stage.color}40`, backgroundColor: `${stage.color}12` }}
                    >
                      {getText(t.lifecycle.mockup.problem, lang)} {stage.num}
                    </motion.span>
                  </div>

                  {/* Problem headline — slides in from left */}
                  <motion.h3
                    key={`headline-${active}`}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.32, delay: 0.06, ease: "easeOut" }}
                    className="font-display font-bold text-2xl lg:text-3xl text-text-primary mb-3 leading-tight"
                  >
                    {getText(stage.problemHeadline, lang)}
                  </motion.h3>
                  <p className="text-text-dim text-base leading-relaxed mb-8">
                    {getText(stage.problemDesc, lang)}
                  </p>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-[#1E1E2E]" />
                    <span className="font-mono text-xs text-text-muted">
                      {getText(t.lifecycle.mockup.yourModule, lang)}
                    </span>
                    <div className="flex-1 h-px bg-[#1E1E2E]" />
                  </div>

                  {/* Module */}
                  <div>
                    <motion.div
                      key={`module-${active}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.12 }}
                      className="font-display font-bold text-xl mb-2"
                      style={{ color: stage.color }}
                    >
                      {getText(stage.module, lang)}
                    </motion.div>
                    <p className="text-text-dim text-sm leading-relaxed">
                      {getText(stage.moduleDesc, lang)}
                    </p>
                  </div>
                </div>

                {/* Metric + CTA */}
                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <div
                      className="font-display font-bold text-2xl"
                      style={{ color: stage.color }}
                    >
                      {getText(stage.metric, lang)}
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-3 rounded-xl border transition-all duration-200 hover:opacity-90"
                    style={{
                      color: stage.color,
                      borderColor: `${stage.color}40`,
                      backgroundColor: `${stage.color}12`,
                    }}
                  >
                    {getText(t.lifecycle.cta, lang)}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Right — Mockup */}
              <div className="p-8 lg:p-10 flex items-center justify-center">
                <div className="w-full max-w-sm">
                  <div className="font-mono text-[10px] text-text-muted mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: stage.color }} />
                    {getText(t.lifecycle.mockup.livePreview, lang)}
                  </div>
                  <MockupComponent lang={lang} />
                  {/* Trust signals */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4">
                    {t.lifecycle.trust.map((item, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-mono text-[9px] text-text-muted">{getText(item, lang)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
