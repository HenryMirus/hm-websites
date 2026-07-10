"use client";

import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, Lang } from "@/lib/translations";
import { EMAIL } from "@/lib/config/email";
import {
  CATEGORIES,
  CATEGORY_QUESTION,
  CATEGORY_QUESTION_SUB,
  CATEGORY_QUESTION_ADDITIONAL,
  CATEGORY_QUESTION_ADDITIONAL_SUB,
  CATEGORY_SERVICE_IDS,
  MAIN_STEPS,
  BUDGET_QUESTION,
  BUDGET_QUESTION_SUB,
  getBudgetBands,
  CATEGORY_SUBWIZARD,
  AUDIT_FOLLOWUPS,
  SERVICE_SUBWIZARD,
  type Choice,
  type ChoiceStep,
  type SubQuestion,
  type CategoryId,
  type I18n,
} from "@/lib/wizard";

type Lang_ = Lang;

/* ─────────────────────────────────────────────
   Icons (content lives in lib/wizard.ts, icons stay presentational-only here)
───────────────────────────────────────────── */

function Icon({ d, d2 }: { d: string; d2?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="currentColor" strokeWidth="1.5" />
      {d2 && <path d={d2} stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
}

// Only steps with a fixed, small set of well-known ids get a custom icon.
// Everything new (existingWebsite, budget, urgency, decisionMaker, all sub-wizard
// questions) renders as a plain text choice, deliberately icon-free.
const ICONS: Record<string, ReactNode> = {
  website: <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" />,
  chatbot: (
    <Icon
      d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4zM10 8v2M14 8v2M7 14h10M7 18h7"
      d2="M5 12H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2"
    />
  ),
  webapp: <Icon d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
  audit: <Icon d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" d2="M21 21l-4.35-4.35" />,
  trades: (
    <Icon d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  consulting: <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  "health-retail": (
    <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  "realestate-other": (
    <Icon
      d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"
      d2="M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
    />
  ),
  "no-visibility": <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" d2="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
  "weak-website": <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  "manual-work": (
    <Icon d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  ),
  "clear-project": <Icon d="M9 18h6M10 22h4M12 2l-2 6h-4l3.5 2.5L8 16l4-2.5 4 2.5-1.5-5.5L18 8h-4L12 2z" />,
  solo: <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  small: (
    <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  ),
  medium: <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10" />,
  large: <Icon d="M2 20h20M4 20V10l8-6 8 6v10M10 20v-6h4v6" />,
};

/* ─────────────────────────────────────────────
   Screen model: a linear, dynamically-assembled sequence of "screens"
───────────────────────────────────────────── */

type Screen =
  | { kind: "categories" }
  | { kind: "main"; step: ChoiceStep }
  | { kind: "subIntro" }
  | { kind: "sub"; scope: string; q: SubQuestion }
  | { kind: "contact" }
  | { kind: "success" };

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }),
};

interface ProjectWizardProps {
  open: boolean;
  onClose: () => void;
  lang: Lang_;
  /**
   * Gesetzt, wenn der Wizard über den "Anfragen"-CTA einer spezifischen
   * Leistungskachel geöffnet wurde (z. B. auf /leistungen). Die Auswahl wird
   * strukturiert an /api/contact mitgesendet und als Pin-Chip angezeigt.
   * Der Kategorie-Schritt bleibt trotzdem sichtbar (rein additiv: "sonst noch
   * etwas relevant?"), ersetzt aber durch die Ebene-2-Unterfragen des konkreten
   * Service statt der groben Kategorie-Unterfragen.
   */
  initialService?: { id: string; label: { de: string; en: string } } | null;
}

type ContactForm = {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
};

const EMPTY_CONTACT: ContactForm = { name: "", email: "", company: "", phone: "", message: "" };

export default function ProjectWizard({ open, onClose, lang, initialService = null }: ProjectWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [categorySelection, setCategorySelection] = useState<string[]>([]);
  const [mainAnswers, setMainAnswers] = useState<Record<string, Choice>>({});
  const [subAnswers, setSubAnswers] = useState<Record<string, Choice>>({});
  const [contact, setContact] = useState<ContactForm>(EMPTY_CONTACT);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  const l = (obj: I18n) => obj[lang];

  // Reset everything when the modal opens
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStepIndex(0);
      setDir(1);
      setCategorySelection([]);
      setMainAnswers({});
      setSubAnswers({});
      setContact(EMPTY_CONTACT);
      setSubmitting(false);
      setErrors({});
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* ── Assemble the dynamic screen sequence ── */
  const screens: Screen[] = useMemo(() => {
    const budgetStep: ChoiceStep = {
      id: "budget",
      question: BUDGET_QUESTION,
      sub: BUDGET_QUESTION_SUB,
      choices: getBudgetBands(categorySelection as CategoryId[], initialService?.id ?? null),
    };
    const mainStepsWithBudget: ChoiceStep[] = [
      ...MAIN_STEPS.slice(0, 4), // branche, existingWebsite, problem, companySize
      budgetStep,
      ...MAIN_STEPS.slice(4), // urgency, decisionMaker
    ];

    type Scope = { type: "service" | "category"; id: string };
    const subScopes: Scope[] = [];
    if (initialService) subScopes.push({ type: "service", id: initialService.id });
    for (const catId of categorySelection) {
      const serviceIds = CATEGORY_SERVICE_IDS[catId as CategoryId] ?? [];
      if (initialService && serviceIds.includes(initialService.id)) continue; // schon Ebene 2 abgedeckt
      subScopes.push({ type: "category", id: catId });
    }

    const subScreens: Screen[] = [];
    for (const scope of subScopes) {
      if (scope.type === "service") {
        for (const q of SERVICE_SUBWIZARD[scope.id] ?? []) {
          subScreens.push({ kind: "sub", scope: scope.id, q });
        }
      } else {
        const catId = scope.id as CategoryId;
        for (const q of CATEGORY_SUBWIZARD[catId] ?? []) {
          subScreens.push({ kind: "sub", scope: catId, q });
          if (catId === "audit" && q.id === "focus") {
            const focusAnswer = subAnswers[`${catId}:focus`];
            const followUp = focusAnswer ? AUDIT_FOLLOWUPS[focusAnswer.id] : null;
            if (followUp) subScreens.push({ kind: "sub", scope: catId, q: followUp });
          }
        }
      }
    }

    return [
      { kind: "categories" },
      ...mainStepsWithBudget.map((step): Screen => ({ kind: "main", step })),
      ...(subScreens.length > 0 ? [{ kind: "subIntro" } as Screen, ...subScreens] : []),
      { kind: "contact" },
      { kind: "success" },
    ];
  }, [initialService, categorySelection, subAnswers]);

  const contactIndex = screens.findIndex((s) => s.kind === "contact");
  const successIndex = contactIndex + 1;
  const screen = screens[Math.min(stepIndex, screens.length - 1)];

  // Focus first input on contact step
  useEffect(() => {
    if (screen.kind === "contact") {
      setTimeout(() => firstInputRef.current?.focus(), 320);
    }
  }, [screen.kind]);

  function goNext() {
    setDir(1);
    setStepIndex((s) => Math.min(s + 1, screens.length - 1));
  }

  function goBack() {
    setDir(-1);
    setStepIndex((s) => Math.max(0, s - 1));
  }

  function skipToContact() {
    setDir(1);
    setStepIndex(contactIndex);
  }

  function toggleCategory(id: string) {
    setCategorySelection((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function selectMain(stepId: string, choice: Choice) {
    setMainAnswers((prev) => ({ ...prev, [stepId]: choice }));
    setTimeout(goNext, 160);
  }

  function selectSub(scope: string, qId: string, choice: Choice) {
    setSubAnswers((prev) => ({ ...prev, [`${scope}:${qId}`]: choice }));
    setTimeout(goNext, 160);
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

    // Wizard-Antworten immer auf Deutsch gespeichert (Portal ist Henry-intern,
    // unabhängig davon in welcher Sprache der Besucher den Wizard ausgefüllt hat).
    const deEntry = (c: Choice) => ({ id: c.id, label: c.label.de });

    const wizardAnswers: Record<string, unknown> = {};
    if (initialService) wizardAnswers.service = initialService.id;
    if (categorySelection.length) {
      wizardAnswers.categories = categorySelection.map((id) => {
        const cat = CATEGORIES.find((c) => c.id === id)!;
        return deEntry(cat);
      });
    }
    for (const [stepId, choice] of Object.entries(mainAnswers)) {
      wizardAnswers[stepId] = deEntry(choice);
    }
    if (Object.keys(subAnswers).length) {
      wizardAnswers.sub = Object.fromEntries(
        Object.entries(subAnswers).map(([k, v]) => [k, deEntry(v)])
      );
    }

    const subject = [
      initialService ? l(initialService.label) : null,
      ...categorySelection.map((id) => l(CATEGORIES.find((c) => c.id === id)!.label)),
      ...Object.values(mainAnswers).map((c) => l(c.label)),
    ].filter(Boolean).join(" · ");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          company: contact.company,
          phone: contact.phone,
          message: contact.message,
          subject,
          wizard_answers: wizardAnswers,
          source: typeof window !== "undefined" ? window.location.href : null,
        }),
      });

      if (!res.ok) throw new Error("Submit failed");
      setDir(1);
      setStepIndex(successIndex);
    } catch {
      // Fallback: still show success, data may have gone through
      setDir(1);
      setStepIndex(successIndex);
    } finally {
      setSubmitting(false);
    }
  }

  const progressPct = screen.kind === "success" ? 100 : (stepIndex / successIndex) * 100;

  const summaryChips: I18n[] = [
    ...(initialService ? [initialService.label] : []),
    ...categorySelection.map((id) => CATEGORIES.find((c) => c.id === id)!.label),
    ...Object.values(mainAnswers).map((c) => c.label),
  ];

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
                <AnimatePresence>
                  {stepIndex > 0 && stepIndex <= successIndex && (
                    <motion.button
                      key="back-btn"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      onClick={goBack}
                      className="flex items-center gap-1.5 text-text-muted hover:text-text-dim transition-colors text-sm"
                      disabled={stepIndex > contactIndex}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {l(t.wizard.ui.back)}
                    </motion.button>
                  )}
                </AnimatePresence>

                {stepIndex < successIndex && (
                  <span className="font-mono text-[11px] text-text-muted tracking-wider">
                    {stepIndex < contactIndex
                      ? `${stepIndex + 1} / ${contactIndex}`
                      : l(t.wizard.ui.almostDone)}
                  </span>
                )}
              </div>

              {stepIndex < successIndex && (
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

            {/* Pin: über eine Leistungskachel vorausgewählte Leistung */}
            {initialService && screen.kind !== "success" && (
              <div className="px-6 pt-3">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/25 bg-accent/10 px-2.5 py-1 font-mono text-[11px] text-accent">
                  {l(initialService.label)}
                </span>
              </div>
            )}

            {/* Screen content */}
            <div className="overflow-hidden min-h-[380px]">
              <AnimatePresence custom={dir} mode="wait">

                {/* ── Categories (multi-select) ── */}
                {screen.kind === "categories" && (
                  <motion.div key="screen-categories" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-6">
                    <div className="mb-6">
                      <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
                        {l(initialService ? CATEGORY_QUESTION_ADDITIONAL : CATEGORY_QUESTION)}
                      </h2>
                      <p className="text-text-dim text-sm">
                        {l(initialService ? CATEGORY_QUESTION_ADDITIONAL_SUB : CATEGORY_QUESTION_SUB)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {CATEGORIES.map((choice, ci) => {
                        const selected = categorySelection.includes(choice.id);
                        return (
                          <ChoiceButton
                            key={choice.id}
                            index={ci}
                            selected={selected}
                            icon={ICONS[choice.id]}
                            label={l(choice.label)}
                            onClick={() => toggleCategory(choice.id)}
                          />
                        );
                      })}
                    </div>
                    <button
                      onClick={goNext}
                      disabled={!initialService && categorySelection.length === 0}
                      className="w-full bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white font-semibold py-3.5 rounded-xl text-sm"
                    >
                      {l(t.wizard.ui.continueBtn)}
                    </button>
                  </motion.div>
                )}

                {/* ── Main choice steps (single-select, auto-advance) ── */}
                {screen.kind === "main" && (
                  <motion.div key={`screen-main-${screen.step.id}`} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-6">
                    <div className="mb-6">
                      <h2 className="font-display font-bold text-2xl text-text-primary mb-2">{l(screen.step.question)}</h2>
                      {screen.step.sub && <p className="text-text-dim text-sm">{l(screen.step.sub)}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {screen.step.choices.map((choice, ci) => (
                        <ChoiceButton
                          key={choice.id}
                          index={ci}
                          selected={mainAnswers[screen.step.id]?.id === choice.id}
                          icon={ICONS[choice.id]}
                          label={l(choice.label)}
                          onClick={() => selectMain(screen.step.id, choice)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── Optional sub-wizard intro ── */}
                {screen.kind === "subIntro" && (
                  <motion.div key="screen-subintro" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-8 flex flex-col items-center text-center justify-center min-h-[380px]">
                    <h2 className="font-display font-bold text-2xl text-text-primary mb-2">{l(t.wizard.ui.subIntroTitle)}</h2>
                    <p className="text-text-dim text-sm max-w-xs mb-8">{l(t.wizard.ui.subIntroSub)}</p>
                    <div className="w-full space-y-3">
                      <button onClick={goNext} className="w-full bg-primary hover:bg-primary/90 transition-colors text-white font-semibold py-3.5 rounded-xl text-sm">
                        {l(t.wizard.ui.subIntroYes)}
                      </button>
                      <button onClick={skipToContact} className="w-full text-text-muted hover:text-text-dim transition-colors text-sm py-2">
                        {l(t.wizard.ui.subIntroSkip)}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Sub-wizard questions (single-select, auto-advance, skippable) ── */}
                {screen.kind === "sub" && (
                  <motion.div key={`screen-sub-${screen.scope}-${screen.q.id}`} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-6">
                    <div className="mb-6">
                      <h2 className="font-display font-bold text-2xl text-text-primary mb-2">{l(screen.q.question)}</h2>
                      {screen.q.note && <p className="text-text-dim text-sm">{l(screen.q.note)}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {screen.q.choices.map((choice, ci) => (
                        <ChoiceButton
                          key={choice.id}
                          index={ci}
                          selected={subAnswers[`${screen.scope}:${screen.q.id}`]?.id === choice.id}
                          icon={undefined}
                          label={l(choice.label)}
                          onClick={() => selectSub(screen.scope, screen.q.id, choice)}
                        />
                      ))}
                    </div>
                    <button onClick={goNext} className="text-text-muted hover:text-text-dim transition-colors text-xs">
                      {l(t.wizard.ui.skipQuestion)}
                    </button>
                  </motion.div>
                )}

                {/* ── Contact step ── */}
                {screen.kind === "contact" && (
                  <motion.div key="contact-step" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-6">
                    <div className="mb-5">
                      <h2 className="font-display font-bold text-2xl text-text-primary mb-1">{l(t.wizard.ui.contactHeadline)}</h2>
                      <p className="text-text-dim text-sm">{l(t.wizard.ui.contactSub)}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {summaryChips.map((label, i) => (
                        <span key={i} className="font-mono text-[11px] bg-primary/10 text-primary border border-primary/20 rounded-md px-2 py-0.5">
                          {l(label)}
                        </span>
                      ))}
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

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder={l(t.wizard.ui.companyPlaceholder)}
                          value={contact.company}
                          onChange={(e) => setContact((c) => ({ ...c, company: e.target.value }))}
                          className="w-full bg-bg border border-border rounded-xl px-3.5 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
                        />
                        <input
                          type="tel"
                          placeholder={l(t.wizard.ui.phonePlaceholder)}
                          value={contact.phone}
                          onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                          className="w-full bg-bg border border-border rounded-xl px-3.5 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
                        />
                      </div>

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

                      <p className="text-center text-text-muted text-[11px]">{l(t.wizard.ui.noSpam)}</p>
                    </form>
                  </motion.div>
                )}

                {/* ── Success step ── */}
                {screen.kind === "success" && (
                  <motion.div key="success-step" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-8 flex flex-col items-center text-center">
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

                    <p className="text-text-dim text-sm leading-relaxed max-w-xs mb-4">{l(t.wizard.ui.successMsg)}</p>

                    <a href={`mailto:${EMAIL.CONTACT}`} className="font-mono text-sm text-primary hover:text-primary/80 transition-colors mb-6">
                      {EMAIL.CONTACT}
                    </a>

                    <div className="w-full border-t border-border pt-6 space-y-2">
                      <p className="font-mono text-xs text-text-muted uppercase tracking-wider mb-3">{l(t.wizard.ui.yourAnswers)}</p>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {summaryChips.map((label, i) => (
                          <span key={i} className="font-mono text-[11px] bg-primary/8 text-primary border border-primary/15 rounded-md px-2 py-0.5">
                            {l(label)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button onClick={onClose} className="mt-6 text-text-muted hover:text-text-dim transition-colors text-sm">
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

/* ─────────────────────────────────────────────
   Shared choice button (icon optional, used by categories/main/sub screens)
───────────────────────────────────────────── */

function ChoiceButton({
  index,
  selected,
  icon,
  label,
  onClick,
}: {
  index: number;
  selected: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.22 }}
      onClick={onClick}
      className={`relative flex flex-col items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150 ${
        selected
          ? "border-primary bg-primary/10 text-text-primary"
          : "border-border bg-bg hover:border-primary/40 hover:bg-primary/5 text-text-dim hover:text-text-primary"
      }`}
    >
      {icon && <div className={`${selected ? "text-primary" : "text-text-dim"} transition-colors`}>{icon}</div>}
      <span className="font-medium text-sm leading-snug">{label}</span>
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
}
