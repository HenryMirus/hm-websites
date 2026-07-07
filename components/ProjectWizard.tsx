"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, Lang } from "@/lib/translations";
import { EMAIL } from "@/lib/config/email";

type Lang_ = Lang;

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

type Choice = {
  id: string;
  label: { de: string; en: string };
  icon: React.ReactNode;
};

type Step = {
  id: string;
  question: { de: string; en: string };
  sub?: { de: string; en: string };
  choices: Choice[];
};

function Icon({ d, d2 }: { d: string; d2?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="currentColor" strokeWidth="1.5" />
      {d2 && <path d={d2} stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
}

// Icons are defined locally — text labels come from t.wizard.steps
const STEPS: Step[] = [
  {
    id: "service",
    question: t.wizard.steps[0].question,
    sub: t.wizard.steps[0].sub,
    choices: [
      { id: "website",  label: t.wizard.steps[0].choices[0], icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" /> },
      { id: "ai",       label: t.wizard.steps[0].choices[1], icon: <Icon d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4zM10 8v2M14 8v2M7 14h10M7 18h7" d2="M5 12H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2" /> },
      { id: "software", label: t.wizard.steps[0].choices[2], icon: <Icon d="M16 18l6-6-6-6M8 6l-6 6 6 6" /> },
      { id: "bundle",   label: t.wizard.steps[0].choices[3], icon: <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /> },
    ],
  },
  {
    id: "industry",
    question: t.wizard.steps[1].question,
    choices: [
      { id: "trades",           label: t.wizard.steps[1].choices[0], icon: <Icon d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /> },
      { id: "consulting",       label: t.wizard.steps[1].choices[1], icon: <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
      { id: "health-retail",    label: t.wizard.steps[1].choices[2], icon: <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /> },
      { id: "realestate-other", label: t.wizard.steps[1].choices[3], icon: <Icon d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" d2="M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" /> },
    ],
  },
  {
    id: "problem",
    question: t.wizard.steps[2].question,
    choices: [
      { id: "no-visibility", label: t.wizard.steps[2].choices[0], icon: <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" d2="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /> },
      { id: "weak-website",  label: t.wizard.steps[2].choices[1], icon: <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
      { id: "manual-work",   label: t.wizard.steps[2].choices[2], icon: <Icon d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /> },
      { id: "clear-project", label: t.wizard.steps[2].choices[3], icon: <Icon d="M9 18h6M10 22h4M12 2l-2 6h-4l3.5 2.5L8 16l4-2.5 4 2.5-1.5-5.5L18 8h-4L12 2z" /> },
    ],
  },
  {
    id: "size",
    question: t.wizard.steps[3].question,
    sub: t.wizard.steps[3].sub,
    choices: [
      { id: "solo",   label: t.wizard.steps[3].choices[0], icon: <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /> },
      { id: "small",  label: t.wizard.steps[3].choices[1], icon: <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /> },
      { id: "medium", label: t.wizard.steps[3].choices[2], icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10" /> },
      { id: "large",  label: t.wizard.steps[3].choices[3], icon: <Icon d="M2 20h20M4 20V10l8-6 8 6v10M10 20v-6h4v6" /> },
    ],
  },
];

/* ─────────────────────────────────────────────
   Animation variants
───────────────────────────────────────────── */

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }),
};

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

interface ProjectWizardProps {
  open: boolean;
  onClose: () => void;
  lang: Lang_;
}

type ContactForm = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const EMPTY_CONTACT: ContactForm = { name: "", email: "", company: "", message: "" };

export default function ProjectWizard({ open, onClose, lang }: ProjectWizardProps) {
  const [step, setStep] = useState(0); // 0–3 = choice steps, 4 = contact, 5 = success
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [contact, setContact] = useState<ContactForm>(EMPTY_CONTACT);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = STEPS.length; // 4 choice steps

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStep(0);
      setDir(1);
      setAnswers({});
      setContact(EMPTY_CONTACT);
      setSubmitting(false);
      setErrors({});
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Focus first input on contact step
  useEffect(() => {
    if (step === totalSteps) {
      setTimeout(() => firstInputRef.current?.focus(), 320);
    }
  }, [step, totalSteps]);

  const l = (obj: { de: string; en: string }) => obj[lang];

  function selectChoice(choiceId: string) {
    const next = { ...answers, [step]: choiceId };
    setAnswers(next);
    // Brief pause so user sees selection before advancing
    setTimeout(() => {
      setDir(1);
      setStep((s) => s + 1);
    }, 160);
  }

  function goBack() {
    setDir(-1);
    setStep((s) => s - 1);
  }

  function validate(): boolean {
    const e: Partial<ContactForm> = {};
    if (!contact.name.trim()) e.name = l(t.wizard.ui.validationName);
    if (!contact.email.trim() || !/\S+@\S+\.\S+/.test(contact.email))
      e.email = l(t.wizard.ui.validationEmail);
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const wizardAnswers: Record<string, string> = {};
    STEPS.forEach((s, i) => {
      const id = answers[i];
      if (id) wizardAnswers[s.id] = id;
    });

    const subject = STEPS.map((_s, i) => {
      const id = answers[i];
      return id ? l(t.wizard.answerLabels[id as keyof typeof t.wizard.answerLabels] ?? { de: id, en: id }) : null;
    }).filter(Boolean).join(" · ");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          company: contact.company,
          message: contact.message,
          subject,
          wizard_answers: wizardAnswers,
          source: typeof window !== "undefined" ? window.location.href : null,
        }),
      });

      if (!res.ok) throw new Error("Submit failed");

      setDir(1);
      setStep(totalSteps + 1);
    } catch {
      // Fallback: still show success — data may have gone through
      setDir(1);
      setStep(totalSteps + 1);
    } finally {
      setSubmitting(false);
    }
  }

  const progressPct = step >= totalSteps + 1 ? 100 : (step / (totalSteps + 1)) * 100;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="wizard-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            key="wizard-card"
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
          >
            {/* Progress bar */}
            <div className="h-0.5 bg-border relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                {/* Back button */}
                <AnimatePresence>
                  {step > 0 && step <= totalSteps + 1 && (
                    <motion.button
                      key="back-btn"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      onClick={goBack}
                      className="flex items-center gap-1.5 text-text-muted hover:text-text-dim transition-colors text-sm"
                      disabled={step > totalSteps}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {l(t.wizard.ui.back)}
                    </motion.button>
                  )}
                </AnimatePresence>

                {step < totalSteps + 1 && (
                  <span className="font-mono text-[11px] text-text-muted tracking-wider">
                    {step < totalSteps
                      ? `${step + 1} / ${totalSteps}`
                      : l(t.wizard.ui.almostDone)}
                  </span>
                )}
              </div>

              {/* Close */}
              {step < totalSteps + 1 && (
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-dim hover:bg-bg transition-colors"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* Step content */}
            <div className="overflow-hidden min-h-[380px]">
              <AnimatePresence custom={dir} mode="wait">

                {/* ── Choice steps ── */}
                {step < totalSteps && (
                  <motion.div
                    key={`step-${step}`}
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-6"
                  >
                    <div className="mb-6">
                      <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
                        {l(STEPS[step].question)}
                      </h2>
                      {STEPS[step].sub && (
                        <p className="text-text-dim text-sm">{l(STEPS[step].sub!)}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {STEPS[step].choices.map((choice, ci) => {
                        const selected = answers[step] === choice.id;
                        return (
                          <motion.button
                            key={choice.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: ci * 0.06, duration: 0.22 }}
                            onClick={() => selectChoice(choice.id)}
                            className={`relative flex flex-col items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150 ${
                              selected
                                ? "border-primary bg-primary/10 text-text-primary"
                                : "border-border bg-bg hover:border-primary/40 hover:bg-primary/5 text-text-dim hover:text-text-primary"
                            }`}
                          >
                            <div className={`${selected ? "text-primary" : "text-text-dim"} transition-colors`}>
                              {choice.icon}
                            </div>
                            <span className="font-medium text-sm leading-snug">
                              {l(choice.label)}
                            </span>
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-3 right-3 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                              >
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                  <path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ── Contact step ── */}
                {step === totalSteps && (
                  <motion.div
                    key="contact-step"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-6"
                  >
                    <div className="mb-5">
                      <h2 className="font-display font-bold text-2xl text-text-primary mb-1">
                        {l(t.wizard.ui.contactHeadline)}
                      </h2>
                      <p className="text-text-dim text-sm">
                        {l(t.wizard.ui.contactSub)}
                      </p>
                    </div>

                    {/* Answer summary */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {STEPS.map((_, i) => {
                        const id = answers[i];
                        if (!id) return null;
                        const label = t.wizard.answerLabels[id as keyof typeof t.wizard.answerLabels];
                        return (
                          <span key={i} className="font-mono text-[11px] bg-primary/10 text-primary border border-primary/20 rounded-md px-2 py-0.5">
                            {label ? l(label) : id}
                          </span>
                        );
                      })}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            ref={firstInputRef}
                            type="text"
                            placeholder={l(t.wizard.ui.namePlaceholder)}
                            value={contact.name}
                            onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                            className={`w-full bg-bg border rounded-xl px-3.5 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors ${
                              errors.name ? "border-accent" : "border-border"
                            }`}
                          />
                          {errors.name && <p className="text-accent text-[11px] mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <input
                            type="email"
                            placeholder={l(t.wizard.ui.emailPlaceholder)}
                            value={contact.email}
                            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                            className={`w-full bg-bg border rounded-xl px-3.5 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors ${
                              errors.email ? "border-accent" : "border-border"
                            }`}
                          />
                          {errors.email && <p className="text-accent text-[11px] mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder={l(t.wizard.ui.companyPlaceholder)}
                        value={contact.company}
                        onChange={(e) => setContact((c) => ({ ...c, company: e.target.value }))}
                        className="w-full bg-bg border border-border rounded-xl px-3.5 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
                      />

                      <textarea
                        rows={3}
                        placeholder={l(t.wizard.ui.messagePlaceholder)}
                        value={contact.message}
                        onChange={(e) => setContact((c) => ({ ...c, message: e.target.value }))}
                        className="w-full bg-bg border border-border rounded-xl px-3.5 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors resize-none"
                      />

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 transition-colors text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-sm"
                      >
                        {submitting ? (
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            {l(t.wizard.ui.submitBtn)}
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </>
                        )}
                      </button>

                      <p className="text-center text-text-muted text-[11px]">
                        {l(t.wizard.ui.noSpam)}
                      </p>
                    </form>
                  </motion.div>
                )}

                {/* ── Success step ── */}
                {step === totalSteps + 1 && (
                  <motion.div
                    key="success-step"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-8 flex flex-col items-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 20 }}
                      className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-5"
                    >
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M5 14l6 6L23 8" stroke="#4F7FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>

                    <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
                      {l(t.wizard.ui.successTitle)}
                      {contact.name.split(" ")[0]}!
                    </h2>

                    <p className="text-text-dim text-sm leading-relaxed max-w-xs mb-4">
                      {l(t.wizard.ui.successMsg)}
                    </p>

                    <a
                      href={`mailto:${EMAIL.CONTACT}`}
                      className="font-mono text-sm text-primary hover:text-primary/80 transition-colors mb-6"
                    >
                      {EMAIL.CONTACT}
                    </a>

                    <div className="w-full border-t border-border pt-6 space-y-2">
                      <p className="font-mono text-xs text-text-muted uppercase tracking-wider mb-3">
                        {l(t.wizard.ui.yourAnswers)}
                      </p>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {STEPS.map((_s, i) => {
                          const id = answers[i];
                          if (!id) return null;
                          const label = t.wizard.answerLabels[id as keyof typeof t.wizard.answerLabels];
                          return (
                            <span key={i} className="font-mono text-[11px] bg-primary/8 text-primary border border-primary/15 rounded-md px-2 py-0.5">
                              {label ? l(label) : id}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="mt-6 text-text-muted hover:text-text-dim transition-colors text-sm"
                    >
                      {l(t.wizard.ui.close)}
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
