/**
 * HM Labs: Lead-Scoring (serverseitig, siehe app/api/contact/route.ts)
 *
 * Berechnet aus den Wizard-Antworten einen Score 0-100 + Tier, sichtbar im
 * Portal unter /portal/leads. Bewusst NICHT clientseitig aufgerufen, damit
 * der Score nicht durch manipulierte Anfragen beeinflusst werden kann.
 *
 * Interne Priorisierungshilfe, keine automatisierte Ablehnungs- oder
 * Vertragsentscheidung (siehe app/datenschutz/page.tsx).
 */

export type AnswerEntry = { id: string; label: string };

export interface WizardAnswersPayload {
  categories?: AnswerEntry[];
  service?: string;
  branche?: AnswerEntry;
  existingWebsite?: AnswerEntry;
  problem?: AnswerEntry;
  companySize?: AnswerEntry;
  budget?: AnswerEntry;
  urgency?: AnswerEntry;
  decisionMaker?: AnswerEntry;
  sub?: Record<string, AnswerEntry>;
}

export type LeadTier = "kalt" | "warm" | "heiss";

export interface ScoreFactor {
  label: string;
  points: number;
}

export interface LeadScoreResult {
  score: number;
  tier: LeadTier;
  breakdown: ScoreFactor[];
}

function budgetPoints(id?: string): ScoreFactor | null {
  if (!id) return null;
  if (id === "budget-unsure") return { label: "Budget noch unklar", points: 4 };
  if (id === "budget-audit-small") return { label: "Budget: kleiner Testballon", points: 6 };
  if (id === "budget-audit-large") return { label: "Budget: größeres laufendes Vorhaben", points: 14 };
  const m = id.match(/^budget-(?:under|range|over)-(\d+)(?:-(\d+))?$/);
  if (!m) return null;
  const upper = m[2] ? Number(m[2]) : Number(m[1]);
  const points = Math.max(2, Math.min(20, Math.round((upper / 20000) * 20)));
  return { label: "Budgetrahmen benannt", points };
}

const URGENCY_POINTS: Record<string, number> = { soon: 15, months: 8, browsing: 2 };
const DECISION_POINTS: Record<string, number> = { alone: 15, together: 9, "must-align": 4 };
const PROBLEM_POINTS: Record<string, number> = {
  "clear-project": 15,
  "no-visibility": 10,
  "weak-website": 10,
  "manual-work": 8,
};
const EXISTING_WEBSITE_POINTS: Record<string, number> = { outdated: 8, none: 6, "works-well": 3 };
const COMPANY_SIZE_POINTS: Record<string, number> = { solo: 6, small: 10, medium: 8, large: 5 };

export function computeLeadScore(input: {
  wizardAnswers: WizardAnswersPayload | undefined | null;
  phone?: string | null;
  message?: string | null;
}): LeadScoreResult {
  const a = input.wizardAnswers ?? {};
  const breakdown: ScoreFactor[] = [];

  const budget = budgetPoints(a.budget?.id);
  if (budget) breakdown.push(budget);

  if (a.urgency?.id && URGENCY_POINTS[a.urgency.id] !== undefined) {
    breakdown.push({ label: "Dringlichkeit", points: URGENCY_POINTS[a.urgency.id] });
  }

  if (a.decisionMaker?.id && DECISION_POINTS[a.decisionMaker.id] !== undefined) {
    breakdown.push({ label: "Entscheidungskompetenz", points: DECISION_POINTS[a.decisionMaker.id] });
  }

  if (a.problem?.id && PROBLEM_POINTS[a.problem.id] !== undefined) {
    breakdown.push({ label: "Projektklarheit", points: PROBLEM_POINTS[a.problem.id] });
  }

  if (a.existingWebsite?.id && EXISTING_WEBSITE_POINTS[a.existingWebsite.id] !== undefined) {
    breakdown.push({ label: "Website-Situation", points: EXISTING_WEBSITE_POINTS[a.existingWebsite.id] });
  }

  if (a.companySize?.id && COMPANY_SIZE_POINTS[a.companySize.id] !== undefined) {
    breakdown.push({ label: "Unternehmensgröße (KMU-Fit)", points: COMPANY_SIZE_POINTS[a.companySize.id] });
  }

  if (a.service) {
    breakdown.push({ label: "Konkrete Leistung ausgewählt", points: 5 });
  } else if (a.categories && a.categories.length >= 2) {
    breakdown.push({ label: "Mehrere Themen interessant", points: 7 });
  }

  let contactPoints = 0;
  if (input.phone && input.phone.trim()) contactPoints += 5;
  if (input.message && input.message.trim().length > 40) contactPoints += 5;
  if (contactPoints > 0) breakdown.push({ label: "Kontaktangaben vollständig", points: contactPoints });

  const subCount = a.sub ? Object.keys(a.sub).length : 0;
  if (subCount > 0) {
    breakdown.push({ label: "Zusatzfragen beantwortet", points: Math.min(10, subCount * 2) });
  }

  const raw = breakdown.reduce((sum, f) => sum + f.points, 0);
  const score = Math.max(0, Math.min(100, raw));
  const tier: LeadTier = score >= 70 ? "heiss" : score >= 40 ? "warm" : "kalt";

  return { score, tier, breakdown };
}
