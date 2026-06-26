"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";
import TypewriterText from "./TypewriterText";

// ── Custom SVG Icons ──────────────────────────────────────────────────────────

function IconFree() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 1.5L11 6.5H16L12 9.5L13.5 15L9 12L4.5 15L6 9.5L2 6.5H7L9 1.5Z" stroke="#4F7FFF" strokeWidth="1.2" strokeLinejoin="round" fill="#4F7FFF" fillOpacity="0.12"/>
    </svg>
  );
}
function IconInstant() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="#4F7FFF" strokeWidth="1.2"/>
      <circle cx="9" cy="9" r="4" stroke="#4F7FFF" strokeWidth="1.2"/>
      <circle cx="9" cy="9" r="1.5" fill="#4F7FFF"/>
      <line x1="9" y1="2" x2="9" y2="4" stroke="#4F7FFF" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="9" y1="14" x2="9" y2="16" stroke="#4F7FFF" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function IconRecommend() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="2" width="12" height="14" rx="2" stroke="#4F7FFF" strokeWidth="1.2"/>
      <line x1="6" y1="6" x2="12" y2="6" stroke="#4F7FFF" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="6" y1="9" x2="12" y2="9" stroke="#4F7FFF" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M6 12.5l1.5 1.5L12 10" stroke="#4F7FFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
const QUESTION_ICONS = [
  <svg key="q1" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 3V4z" stroke="#4F7FFF" strokeWidth="1.3" strokeLinejoin="round" fill="#4F7FFF" fillOpacity="0.08"/>
    <line x1="7" y1="7" x2="13" y2="7" stroke="#4F7FFF" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="7" y1="10" x2="11" y2="10" stroke="#4F7FFF" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>,
  <svg key="q2" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7" stroke="#FF4D6A" strokeWidth="1.3"/>
    <path d="M10 6v4l2.5 2.5" stroke="#FF4D6A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  <svg key="q3" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="3" width="16" height="11" rx="2" stroke="#10B981" strokeWidth="1.3"/>
    <line x1="7" y1="17" x2="13" y2="17" stroke="#10B981" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="10" y1="14" x2="10" y2="17" stroke="#10B981" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="5" y1="10" x2="8" y2="7" stroke="#10B981" strokeWidth="1.1" strokeLinecap="round"/>
    <line x1="8" y1="7" x2="11" y2="9" stroke="#10B981" strokeWidth="1.1" strokeLinecap="round"/>
    <line x1="11" y1="9" x2="15" y2="6" stroke="#10B981" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>,
  <svg key="q4" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="3" stroke="#8B5CF6" strokeWidth="1.3"/>
    <circle cx="10" cy="4" r="1.2" fill="#8B5CF6" fillOpacity="0.7"/>
    <circle cx="10" cy="16" r="1.2" fill="#8B5CF6" fillOpacity="0.7"/>
    <circle cx="4" cy="10" r="1.2" fill="#8B5CF6" fillOpacity="0.7"/>
    <circle cx="16" cy="10" r="1.2" fill="#8B5CF6" fillOpacity="0.7"/>
    <line x1="10" y1="5.2" x2="10" y2="7" stroke="#8B5CF6" strokeWidth="1.1"/>
    <line x1="10" y1="13" x2="10" y2="14.8" stroke="#8B5CF6" strokeWidth="1.1"/>
    <line x1="5.2" y1="10" x2="7" y2="10" stroke="#8B5CF6" strokeWidth="1.1"/>
    <line x1="13" y1="10" x2="14.8" y2="10" stroke="#8B5CF6" strokeWidth="1.1"/>
  </svg>,
  <svg key="q5" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5 3h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="#F59E0B" strokeWidth="1.3" strokeLinejoin="round" fill="#F59E0B" fillOpacity="0.08"/>
    <path d="M12 3v4h4" stroke="#F59E0B" strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="7" y1="10" x2="13" y2="10" stroke="#F59E0B" strokeWidth="1.1" strokeLinecap="round"/>
    <line x1="7" y1="13" x2="11" y2="13" stroke="#F59E0B" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>,
];

interface ReadinessCheckSectionProps {
  lang: Lang;
  onOpenWizard: () => void;
}

type Phase = "intro" | "questions" | "result";

export default function ReadinessCheckSection({ lang, onOpenWizard }: ReadinessCheckSectionProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const { questions, results } = t.readinessCheck;

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const result = results.find((r) => totalScore >= r.min && totalScore <= r.max) ?? results[0];

  const progress = phase === "questions" ? ((step) / questions.length) * 100 : phase === "result" ? 100 : 0;

  function selectOption(score: number) {
    const next = [...answers, score];
    setAnswers(next);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setPhase("result");
    }
  }

  function reset() {
    setPhase("intro");
    setStep(0);
    setAnswers([]);
  }

  return (
    <section id="readiness-check" className="py-28 relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — static copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="tag">{getText(t.readinessCheck.tag, lang)}</span>
            <h2 className="font-display font-bold text-5xl lg:text-6xl text-text-primary mt-3 mb-4 leading-tight">
              <TypewriterText text={getText(t.readinessCheck.headline, lang)} delay={0.3} />
            </h2>
            <p className="text-text-dim text-lg leading-relaxed mb-8">
              {getText(t.readinessCheck.sub, lang)}
            </p>

            <div className="space-y-3">
              {[<IconFree />, <IconInstant />, <IconRecommend />].map((icon, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <span className="text-text-dim text-sm">{getText(t.readinessCheck.features[i], lang)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — interactive card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative bg-surface border border-border rounded-2xl overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              {/* Progress bar */}
              <div className="h-0.5 bg-border">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  {phase === "intro" && (
                    <motion.div
                      key="intro"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="font-mono text-xs text-primary/60 tracking-widest mb-4">
                        {getText(t.readinessCheck.introLabel, lang)}
                      </div>
                      <h3 className="font-display font-bold text-2xl text-text-primary mb-3">
                        {getText(t.readinessCheck.introTitle, lang)}
                      </h3>
                      <p className="text-text-dim text-sm mb-8 leading-relaxed">
                        {getText(t.readinessCheck.introDesc, lang)}
                      </p>
                      <button
                        onClick={() => setPhase("questions")}
                        className="w-full bg-primary hover:bg-primary/90 transition-colors text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2"
                      >
                        {getText(t.readinessCheck.startBtn, lang)}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </motion.div>
                  )}

                  {phase === "questions" && (
                    <motion.div
                      key={`q-${step}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-mono text-xs text-text-muted">
                          {step + 1} / {questions.length}
                        </span>
                        <button
                          onClick={reset}
                          className="font-mono text-xs text-text-muted hover:text-text-dim transition-colors"
                        >
                          {getText(t.readinessCheck.restart, lang)}
                        </button>
                      </div>

                      <div className="flex items-start gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 mt-0.5">
                          {QUESTION_ICONS[step]}
                        </div>
                        <h3 className="font-display font-semibold text-xl text-text-primary leading-snug">
                          {getText(questions[step].q, lang)}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {questions[step].options.map((opt, oi) => (
                          <button
                            key={oi}
                            onClick={() => selectOption(opt.score)}
                            className="w-full text-left px-4 py-3.5 rounded-xl border border-border bg-bg hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full border border-border group-hover:border-primary/40 flex items-center justify-center shrink-0 font-mono text-[10px] text-text-muted group-hover:text-primary transition-colors">
                                {String.fromCharCode(65 + oi)}
                              </span>
                              <span className="text-sm text-text-dim group-hover:text-text-primary transition-colors">
                                {getText(opt.label, lang)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {phase === "result" && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <div className="text-center mb-6">
                        <div
                          className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full border mb-4"
                          style={{ color: result.color, borderColor: `${result.color}30`, backgroundColor: `${result.color}10` }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: result.color }} />
                          {getText(result.level, lang)}
                        </div>
                        <h3 className="font-display font-bold text-2xl text-text-primary mb-2">
                          {getText(result.title, lang)}
                        </h3>
                        <p className="text-text-dim text-sm leading-relaxed">
                          {getText(result.desc, lang)}
                        </p>
                      </div>

                      {/* Score bar */}
                      <div className="mb-6">
                        <div className="flex justify-between mb-1.5">
                          <span className="font-mono text-[10px] text-text-muted">Score</span>
                          <span className="font-mono text-[10px] text-text-muted">{totalScore} / 10</span>
                        </div>
                        <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: result.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(totalScore / 10) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={onOpenWizard}
                        className="w-full bg-primary hover:bg-primary/90 transition-colors text-white font-semibold py-3.5 rounded-xl mb-3"
                      >
                        {getText(t.readinessCheck.ctaText, lang)}
                      </button>
                      <button
                        onClick={reset}
                        className="w-full text-text-muted hover:text-text-dim text-sm transition-colors py-2"
                      >
                        {getText(t.readinessCheck.tryAgain, lang)}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
