/**
 * HM Labs: Wizard-Datenschicht (Lead-Qualifizierung)
 *
 * Zentrale, bilinguale Inhalts-Quelle für den ProjectWizard: Kategorien,
 * Hauptschritte, optionale Unterwizards (Ebene 1 pro Kategorie, Ebene 2 pro
 * konkretem Service) und die daraus abgeleiteten Budget-Bänder.
 *
 * Preis-Zahlen in SERVICE_BUDGET_RANGE sind wörtlich aus docs/spec/preislogik.yaml
 * übernommen (nichts Neues erfunden). Leistungen ohne YAML-Kalibrierung (Gruppe C,
 * außer Wartung) bekommen bewusst KEINE €-Bänder, sondern eine qualitative Frage.
 */

import type { Lang, I18n } from "./leistungen";

export type { Lang, I18n };

export type Choice = { id: string; label: I18n };

export interface ChoiceStep {
  id: string;
  question: I18n;
  sub?: I18n;
  choices: Choice[];
}

export interface SubQuestion {
  id: string;
  question: I18n;
  /** Kurzer Hinweis unter der Frage, z. B. dass HM Labs eine Aufgabe optional übernimmt. */
  note?: I18n;
  choices: Choice[];
}

export type CategoryId = "website" | "chatbot" | "webapp" | "audit";

/* ─────────────────────────────────────────────
   Schritt 1: Leistungsinteresse (Mehrfachauswahl)
───────────────────────────────────────────── */

export const CATEGORIES: Choice[] = [
  { id: "website", label: { de: "Website", en: "Website" } },
  { id: "chatbot", label: { de: "KI-Chatbot", en: "AI chatbot" } },
  { id: "webapp", label: { de: "Software / Webapp", en: "Software / web app" } },
  { id: "audit", label: { de: "Audit & Sonstiges", en: "Audit & other" } },
];

export const CATEGORY_QUESTION: I18n = {
  de: "Welche Themen interessieren Sie?",
  en: "Which topics interest you?",
};

export const CATEGORY_QUESTION_SUB: I18n = {
  de: "Mehrfachauswahl möglich, wenn mehrere Themen infrage kommen.",
  en: "Select as many as apply.",
};

/** Framing, wenn schon eine konkrete Leistung feststeht (Tile-CTA): rein additiv, nichts Pflicht. */
export const CATEGORY_QUESTION_ADDITIONAL: I18n = {
  de: "Sind noch weitere Themen für Sie relevant?",
  en: "Are any other topics relevant to you as well?",
};

export const CATEGORY_QUESTION_ADDITIONAL_SUB: I18n = {
  de: "Optional. Falls nicht, einfach weiterklicken.",
  en: "Optional. If not, just click through.",
};

/** Welche der 13 Leistungen (lib/leistungen.ts) gehört zu welcher groben Kategorie. */
export const CATEGORY_SERVICE_IDS: Record<CategoryId, string[]> = {
  website: ["landingpage", "business-website", "corporate-website", "relaunch", "logo-branding"],
  chatbot: ["ki-chatbot"],
  webapp: ["webapps", "saas-mvp"],
  audit: ["gaio", "ki-monitoring", "barrierefreiheit", "unternehmens-ki", "wartung"],
};

/* ─────────────────────────────────────────────
   Feste Hauptschritte (immer, unabhängig von der Kategorie)
───────────────────────────────────────────── */

export const MAIN_STEPS: ChoiceStep[] = [
  {
    id: "branche",
    question: { de: "In welcher Branche sind Sie tätig?", en: "What industry are you in?" },
    choices: [
      { id: "trades", label: { de: "Handwerk & lokale Dienste", en: "Trades & local services" } },
      { id: "consulting", label: { de: "Beratung, Recht & Steuer", en: "Consulting, legal & tax" } },
      { id: "health-retail", label: { de: "Gesundheit, Handel & Gastronomie", en: "Health, retail & hospitality" } },
      { id: "realestate-other", label: { de: "Immobilien, Bau & andere", en: "Real estate, construction & other" } },
    ],
  },
  {
    id: "existingWebsite",
    question: { de: "Haben Sie schon eine Website?", en: "Do you already have a website?" },
    choices: [
      { id: "works-well", label: { de: "Ja, die funktioniert gut", en: "Yes, and it works well" } },
      { id: "outdated", label: { de: "Ja, aber veraltet oder unzufriedenstellend", en: "Yes, but outdated or unsatisfying" } },
      { id: "none", label: { de: "Nein, gibt es noch nicht", en: "No, not yet" } },
    ],
  },
  {
    id: "problem",
    question: { de: "Was ist Ihr größtes Problem?", en: "What is your biggest problem?" },
    choices: [
      { id: "no-visibility", label: { de: "Zu wenig Anfragen & Sichtbarkeit", en: "Too few inquiries & visibility" } },
      { id: "weak-website", label: { de: "Meine Website ist veraltet / bringt nichts", en: "My website is outdated / ineffective" } },
      { id: "manual-work", label: { de: "Zu viel manuelle Arbeit im Alltag", en: "Too much repetitive manual work" } },
      { id: "clear-project", label: { de: "Ich habe bereits eine konkrete Idee", en: "I already have a concrete idea" } },
    ],
  },
  {
    id: "companySize",
    question: { de: "Wie groß ist Ihr Unternehmen?", en: "How large is your company?" },
    sub: { de: "Damit ich das passende Angebot für Sie vorbereiten kann.", en: "So I can prepare the right proposal for you." },
    choices: [
      { id: "solo", label: { de: "Nur ich (Freelancer / Gründer)", en: "Just me (freelancer / founder)" } },
      { id: "small", label: { de: "2–10 Mitarbeiter", en: "2–10 employees" } },
      { id: "medium", label: { de: "11–50 Mitarbeiter", en: "11–50 employees" } },
      { id: "large", label: { de: "50+ Mitarbeiter", en: "50+ employees" } },
    ],
  },
  // "budget" wird dynamisch eingefügt (siehe getBudgetBands), abhängig von Kategorie/Service
  {
    id: "urgency",
    question: { de: "Wie dringend ist das Vorhaben?", en: "How urgent is this?" },
    choices: [
      { id: "soon", label: { de: "Es soll bald losgehen", en: "It should start soon" } },
      { id: "months", label: { de: "In den nächsten Monaten", en: "In the next few months" } },
      { id: "browsing", label: { de: "Ich schaue erstmal nur", en: "Just browsing for now" } },
    ],
  },
  {
    id: "decisionMaker",
    question: { de: "Wer entscheidet am Ende über die Beauftragung?", en: "Who ultimately decides on commissioning?" },
    choices: [
      { id: "alone", label: { de: "Ich allein", en: "Just me" } },
      { id: "together", label: { de: "Ich gemeinsam mit jemandem", en: "Me together with someone else" } },
      { id: "must-align", label: { de: "Ich muss mich noch abstimmen", en: "I still need to align with others" } },
    ],
  },
];

/* ─────────────────────────────────────────────
   Budget-Bänder (aus preislogik.yaml abgeleitet, nichts erfunden)
───────────────────────────────────────────── */

export const BUDGET_QUESTION: I18n = {
  de: "Welcher Rahmen passt ungefähr?",
  en: "What budget range fits roughly?",
};

export const BUDGET_QUESTION_SUB: I18n = {
  de: "Nur zur Orientierung, kein verbindliches Angebot. Das genaue Angebot bespreche ich persönlich mit Ihnen.",
  en: "Just for orientation, not a binding offer. I discuss the exact quote with you personally.",
};

/** Preisspannen wörtlich aus docs/spec/preislogik.yaml (nur kalibrierte Leistungen). */
const SERVICE_BUDGET_RANGE: Partial<Record<string, { min: number; max: number }>> = {
  landingpage: { min: 1500, max: 3000 },
  "business-website": { min: 3500, max: 7500 },
  "corporate-website": { min: 7500, max: 15000 },
  relaunch: { min: 3000, max: 8000 },
  "logo-branding": { min: 800, max: 2500 },
  "ki-chatbot": { min: 1500, max: 3500 },
  webapps: { min: 8000, max: 25000 },
  "saas-mvp": { min: 15000, max: 35000 },
};

function formatEUR(n: number, lang: Lang): string {
  return lang === "de"
    ? `${n.toLocaleString("de-DE")} €`
    : `€${n.toLocaleString("en-US")}`;
}

function buildBudgetBands(min: number, max: number): Choice[] {
  return [
    {
      id: `budget-under-${min}`,
      label: { de: `unter ${formatEUR(min, "de")}`, en: `under ${formatEUR(min, "en")}` },
    },
    {
      id: `budget-range-${min}-${max}`,
      label: { de: `${formatEUR(min, "de")}–${formatEUR(max, "de")}`, en: `${formatEUR(min, "en")}–${formatEUR(max, "en")}` },
    },
    {
      id: `budget-over-${max}`,
      label: { de: `über ${formatEUR(max, "de")}`, en: `over ${formatEUR(max, "en")}` },
    },
    { id: "budget-unsure", label: { de: "Weiß ich noch nicht", en: "Not sure yet" } },
  ];
}

/** Qualitative Bänder für die Kategorie "Audit & Sonstiges" (größtenteils YAML-unkalibriert). */
export const AUDIT_QUALITATIVE_BANDS: Choice[] = [
  { id: "budget-audit-small", label: { de: "Eher ein kleiner, einmaliger Testballon", en: "More of a small, one-off trial" } },
  { id: "budget-audit-large", label: { de: "Ein größeres, laufendes Vorhaben", en: "A bigger, ongoing initiative" } },
  { id: "budget-unsure", label: { de: "Weiß ich noch nicht", en: "Not sure yet" } },
];

/**
 * Budget-Bänder je nach Kontext:
 * - konkreter Service bekannt (Tile-CTA) + kalibriert → enge Bänder um dessen YAML-Spanne
 * - eine oder mehrere Kategorien gewählt → Bänder über die kombinierte Spanne der
 *   kalibrierten Services darin (min der günstigsten, max der teuersten)
 * - nur unkalibrierte Services betroffen (z. B. nur "Audit & Sonstiges") → qualitativ
 */
export function getBudgetBands(categories: CategoryId[], initialServiceId?: string | null): Choice[] {
  if (initialServiceId && SERVICE_BUDGET_RANGE[initialServiceId]) {
    const { min, max } = SERVICE_BUDGET_RANGE[initialServiceId]!;
    return buildBudgetBands(min, max);
  }
  const serviceIds = categories.flatMap((c) => CATEGORY_SERVICE_IDS[c] ?? []);
  const ranges = serviceIds
    .map((id) => SERVICE_BUDGET_RANGE[id])
    .filter((r): r is { min: number; max: number } => !!r);
  if (ranges.length === 0) return AUDIT_QUALITATIVE_BANDS;
  const min = Math.min(...ranges.map((r) => r.min));
  const max = Math.max(...ranges.map((r) => r.max));
  return buildBudgetBands(min, max);
}

/* ─────────────────────────────────────────────
   Ebene 1: Unterwizard pro Kategorie (optional, überspringbar)
───────────────────────────────────────────── */

const SELF_EDIT_NOTE: I18n = {
  de: "Falls nicht: Das übernehme ich gerne im Rahmen der Wartung.",
  en: "If not: I'm happy to take care of that for you as part of maintenance.",
};

export const CATEGORY_SUBWIZARD: Record<CategoryId, SubQuestion[]> = {
  website: [
    {
      id: "pages",
      question: { de: "Wie viele Unterseiten stellen Sie sich ungefähr vor?", en: "How many subpages do you roughly imagine?" },
      choices: [
        { id: "one", label: { de: "Nur eine Seite", en: "Just one page" } },
        { id: "few", label: { de: "2–6 Seiten", en: "2–6 pages" } },
        { id: "many", label: { de: "10 oder mehr", en: "10 or more" } },
        { id: "unsure", label: { de: "Weiß ich noch nicht", en: "Not sure yet" } },
      ],
    },
    {
      id: "selfEdit",
      question: { de: "Möchten Sie die Inhalte später selbst ändern können?", en: "Would you like to be able to edit the content yourself later?" },
      note: SELF_EDIT_NOTE,
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
        { id: "unsure", label: { de: "Unsicher", en: "Not sure" } },
      ],
    },
    {
      id: "portal",
      question: { de: "Brauchen Sie einen Login-Bereich für Kunden oder Partner?", en: "Do you need a login area for customers or partners?" },
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
        { id: "unsure", label: { de: "Unsicher", en: "Not sure" } },
      ],
    },
  ],
  chatbot: [
    {
      id: "topic",
      question: { de: "Worum geht es bei den meisten Besucherfragen?", en: "What are most visitor questions about?" },
      choices: [
        { id: "prices", label: { de: "Preise & Leistungen", en: "Prices & services" } },
        { id: "appointments", label: { de: "Terminvereinbarung", en: "Scheduling appointments" } },
        { id: "hours", label: { de: "Standort & Öffnungszeiten", en: "Location & opening hours" } },
        { id: "other", label: { de: "Sonstiges", en: "Other" } },
      ],
    },
    {
      id: "depth",
      question: { de: "Soll der Chatbot nur antworten, oder auch Anfragen aktiv weiterleiten?", en: "Should the chatbot just answer, or also actively forward inquiries?" },
      choices: [
        { id: "answer-only", label: { de: "Nur antworten", en: "Just answer" } },
        { id: "also-forward", label: { de: "Auch weiterleiten und qualifizieren", en: "Also forward and qualify" } },
      ],
    },
    {
      id: "integration",
      question: { de: "Soll er an ein bestehendes System angebunden werden (z. B. Kalender, Kundenverwaltung)?", en: "Should it connect to an existing system (e.g. calendar, CRM)?" },
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
        { id: "unsure", label: { de: "Unsicher", en: "Not sure" } },
      ],
    },
  ],
  webapp: [
    {
      id: "purpose",
      question: { de: "Was soll die Anwendung im Kern lösen?", en: "What should the application solve at its core?" },
      choices: [
        { id: "internal-workflow", label: { de: "Einen internen Arbeitsablauf automatisieren", en: "Automate an internal workflow" } },
        { id: "customer-portal", label: { de: "Ein Portal für meine Kunden", en: "A portal for my customers" } },
        { id: "product-idea", label: { de: "Eine Produktidee testen, die ich verkaufen will", en: "Test a product idea I want to sell" } },
        { id: "other", label: { de: "Etwas anderes", en: "Something else" } },
      ],
    },
    {
      id: "users",
      question: { de: "Für wie viele Personen ungefähr, die sich einloggen können?", en: "For roughly how many people who can log in?" },
      choices: [
        { id: "team-only", label: { de: "Nur mein Team", en: "Just my team" } },
        { id: "few-customers", label: { de: "Meine Kunden, überschaubare Zahl", en: "My customers, a manageable number" } },
        { id: "many-public", label: { de: "Öffentlich, viele unbekannte Nutzer", en: "Public, many unknown users" } },
      ],
    },
    {
      id: "integration",
      question: { de: "Muss die Software mit Programmen sprechen, die Sie schon nutzen?", en: "Does the software need to talk to tools you already use?" },
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
        { id: "unsure", label: { de: "Unsicher", en: "Not sure" } },
      ],
    },
  ],
  audit: [
    {
      id: "focus",
      question: { de: "Was beschäftigt Sie hier am meisten?", en: "What concerns you most here?" },
      choices: [
        { id: "visibility", label: { de: "Wir werden bei ChatGPT & Co. nicht gefunden", en: "We're not found on ChatGPT & co." } },
        { id: "accessibility", label: { de: "Wir müssen wegen des neuen Gesetzes barrierefrei sein", en: "We need to be accessible due to the new law" } },
        { id: "private-ai", label: { de: "Wir hätten gerne eine eigene, private KI nur für uns intern", en: "We'd like our own private AI, just for internal use" } },
        { id: "maintenance", label: { de: "Wir brauchen laufende Betreuung für unsere bestehende Website", en: "We need ongoing care for our existing website" } },
      ],
    },
  ],
};

/** Gezielte Folgefrage nach der Weichen-Frage der Kategorie "Audit & Sonstiges". */
export const AUDIT_FOLLOWUPS: Record<string, SubQuestion> = {
  visibility: {
    id: "visibilityCheck",
    question: { de: "Haben Sie das schon mal selbst ausprobiert, oder ist das eine Vermutung?", en: "Have you actually tried this yourself, or is it a guess?" },
    choices: [
      { id: "tried", label: { de: "Ja, selbst ausprobiert (z. B. ChatGPT gefragt)", en: "Yes, tried it myself (e.g. asked ChatGPT)" } },
      { id: "assumption", label: { de: "Eher eine Vermutung", en: "More of an assumption" } },
    ],
  },
  accessibility: {
    id: "b2c",
    question: { de: "Verkaufen Sie Produkte oder Dienstleistungen direkt online an Privatkunden?", en: "Do you sell products or services directly online to private customers?" },
    choices: [
      { id: "yes", label: { de: "Ja", en: "Yes" } },
      { id: "no", label: { de: "Nein", en: "No" } },
      { id: "partly", label: { de: "Teilweise", en: "Partly" } },
    ],
  },
  "private-ai": {
    id: "documents",
    question: { de: "Mit welchen Unterlagen soll die KI hauptsächlich arbeiten?", en: "What documents should the AI mainly work with?" },
    choices: [
      { id: "contracts", label: { de: "Verträge", en: "Contracts" } },
      { id: "customer-data", label: { de: "Kundendaten", en: "Customer data" } },
      { id: "internal-knowledge", label: { de: "Internes Wissen & Anleitungen", en: "Internal knowledge & guides" } },
      { id: "other", label: { de: "Sonstiges", en: "Other" } },
    ],
  },
  maintenance: {
    id: "builtByUs",
    question: { de: "Ist das eine Website, die wir gebaut haben, oder von woanders?", en: "Is that a website we built, or from elsewhere?" },
    choices: [
      { id: "by-us", label: { de: "Von HM Labs", en: "By HM Labs" } },
      { id: "elsewhere", label: { de: "Von woanders", en: "From elsewhere" } },
    ],
  },
};

/* ─────────────────────────────────────────────
   Ebene 2: Unterwizard pro konkretem Service (Tile-CTA, optional)
   Schlüssel = Leistungs-ID aus lib/leistungen.ts
───────────────────────────────────────────── */

export const SERVICE_SUBWIZARD: Record<string, SubQuestion[]> = {
  landingpage: [
    {
      id: "purpose",
      question: { de: "Wofür genau wirbt die Seite?", en: "What exactly is the page promoting?" },
      choices: [
        { id: "product", label: { de: "Ein Produkt", en: "A product" } },
        { id: "service", label: { de: "Eine Dienstleistung", en: "A service" } },
        { id: "campaign", label: { de: "Eine Kampagne oder ein Event", en: "A campaign or event" } },
        { id: "company-general", label: { de: "Mein Unternehmen allgemein", en: "My company in general" } },
      ],
    },
    {
      id: "materials",
      question: { de: "Gibt es schon Texte und Fotos, oder brauchen Sie dabei Unterstützung?", en: "Do you already have text and photos, or do you need support with that?" },
      choices: [
        { id: "all-ready", label: { de: "Alles vorhanden", en: "Everything ready" } },
        { id: "partly", label: { de: "Teilweise", en: "Partly" } },
        { id: "need-help", label: { de: "Brauche Unterstützung", en: "Need support" } },
      ],
    },
  ],
  "business-website": [
    {
      id: "pages",
      question: { de: "Bis 3 oder 4–6 Unterseiten?", en: "Up to 3, or 4–6 subpages?" },
      choices: [
        { id: "up-to-3", label: { de: "Bis 3 Seiten", en: "Up to 3 pages" } },
        { id: "four-to-six", label: { de: "4–6 Seiten", en: "4–6 pages" } },
        { id: "unsure", label: { de: "Weiß ich noch nicht", en: "Not sure yet" } },
      ],
    },
    {
      id: "booking",
      question: { de: "Sollen Besucher online direkt einen Termin buchen oder ein mehrstufiges Formular ausfüllen können?", en: "Should visitors be able to book an appointment or fill out a multi-step form online?" },
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
        { id: "unsure", label: { de: "Unsicher", en: "Not sure" } },
      ],
    },
    {
      id: "selfEdit",
      question: { de: "Möchten Sie die Inhalte später selbst ändern können?", en: "Would you like to be able to edit the content yourself later?" },
      note: SELF_EDIT_NOTE,
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
        { id: "unsure", label: { de: "Unsicher", en: "Not sure" } },
      ],
    },
  ],
  "corporate-website": [
    {
      id: "locations",
      question: { de: "Mehrere Standorte, Marken oder Geschäftsbereiche mit jeweils eigenen Bereichen?", en: "Multiple locations, brands or business units, each needing their own area?" },
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
      ],
    },
    {
      id: "portal",
      question: { de: "Login-Bereich für Kunden oder Partner?", en: "Login area for customers or partners?" },
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
        { id: "unsure", label: { de: "Unsicher", en: "Not sure" } },
      ],
    },
    {
      id: "integration",
      question: { de: "Sollen andere Systeme (z. B. CRM, Warenwirtschaft) angebunden werden?", en: "Should other systems (e.g. CRM, inventory) be connected?" },
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
        { id: "unsure", label: { de: "Unsicher", en: "Not sure" } },
      ],
    },
  ],
  relaunch: [
    {
      id: "painPoint",
      question: { de: "Was stört an der aktuellen Website am meisten?", en: "What bothers you most about the current website?" },
      choices: [
        { id: "design-outdated", label: { de: "Design wirkt veraltet", en: "Design looks outdated" } },
        { id: "too-slow", label: { de: "Zu langsam", en: "Too slow" } },
        { id: "hard-to-maintain", label: { de: "Schwer zu pflegen", en: "Hard to maintain" } },
        { id: "ranks-badly", label: { de: "Rankt schlecht bei Google", en: "Ranks badly on Google" } },
      ],
    },
    {
      id: "size",
      question: { de: "Wie viele Unterseiten hat die aktuelle Website ungefähr?", en: "Roughly how many subpages does the current website have?" },
      choices: [
        { id: "up-to-10", label: { de: "Bis 10", en: "Up to 10" } },
        { id: "ten-to-twenty", label: { de: "10–20", en: "10–20" } },
        { id: "more-than-20", label: { de: "Mehr als 20", en: "More than 20" } },
      ],
    },
    {
      id: "rankings",
      question: { de: "Ist Ihnen wichtig, dass alte Google-Rankings erhalten bleiben?", en: "Is it important to you that old Google rankings are preserved?" },
      choices: [
        { id: "very-important", label: { de: "Sehr wichtig", en: "Very important" } },
        { id: "less-important", label: { de: "Eher nebensächlich", en: "Rather secondary" } },
      ],
    },
  ],
  "logo-branding": [
    {
      id: "scope",
      question: { de: "Überarbeitung eines bestehenden Logos, oder muss alles neu entstehen?", en: "Revising an existing logo, or does everything need to be created from scratch?" },
      choices: [
        { id: "revise", label: { de: "Überarbeitung", en: "Revision" } },
        { id: "from-scratch", label: { de: "Komplett neu", en: "From scratch" } },
      ],
    },
    {
      id: "context",
      question: { de: "Im Rahmen eines Website-Projekts bei mir, oder eigenständig?", en: "As part of a website project with me, or standalone?" },
      choices: [
        { id: "with-website-project", label: { de: "Im Rahmen eines Website-Projekts", en: "As part of a website project" } },
        { id: "standalone", label: { de: "Eigenständig", en: "Standalone" } },
      ],
    },
  ],
  "ki-chatbot": [
    ...CATEGORY_SUBWIZARD.chatbot,
    {
      id: "volume",
      question: { de: "Ungefähr wie viele unterschiedliche wiederkehrende Fragen könnten Sie sich vorstellen?", en: "Roughly how many different recurring questions could you imagine?" },
      choices: [
        { id: "ten-to-twenty", label: { de: "10–20", en: "10–20" } },
        { id: "thirty-to-forty", label: { de: "30–40", en: "30–40" } },
        { id: "more-than-forty", label: { de: "Mehr als 40", en: "More than 40" } },
      ],
    },
  ],
  webapps: [
    ...CATEGORY_SUBWIZARD.webapp,
    {
      id: "automations",
      question: { de: "Wie viele einzelne Automatisierungen/Abläufe stellen Sie sich vor?", en: "How many individual automations/workflows do you envision?" },
      choices: [
        { id: "one", label: { de: "Eine", en: "One" } },
        { id: "two-to-three", label: { de: "2–3", en: "2–3" } },
        { id: "more", label: { de: "Mehr", en: "More" } },
      ],
    },
  ],
  "saas-mvp": [
    {
      id: "validation",
      question: { de: "Ist die Idee schon irgendwo getestet (Umfrage, Warteliste), oder ganz am Anfang?", en: "Has the idea already been tested somewhere (survey, waitlist), or is it very early?" },
      choices: [
        { id: "tested-interest", label: { de: "Schon Interesse gezeigt", en: "Interest already shown" } },
        { id: "very-early", label: { de: "Ganz am Anfang", en: "Very early" } },
      ],
    },
    {
      id: "payments",
      question: { de: "Sollen Kunden direkt online bezahlen (z. B. Abo)?", en: "Should customers pay directly online (e.g. subscription)?" },
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
      ],
    },
    {
      id: "mobile",
      question: { de: "Native App nötig, oder reicht eine Web-Version, die auch am Handy funktioniert?", en: "Native app needed, or is a web version that also works on mobile enough?" },
      choices: [
        { id: "web-enough", label: { de: "Web-Version reicht", en: "Web version is enough" } },
        { id: "native-wanted", label: { de: "Native App gewünscht", en: "Native app wanted" } },
      ],
    },
  ],
  gaio: [
    {
      id: "depth",
      question: { de: "Einmalige Prüfung und Umsetzung, oder auch laufende Beobachtung interessant?", en: "One-off audit and remediation, or also interested in ongoing monitoring?" },
      choices: [
        { id: "one-time", label: { de: "Einmalig reicht", en: "One-off is enough" } },
        { id: "ongoing-too", label: { de: "Laufende Beobachtung auch interessant", en: "Ongoing monitoring also interesting" } },
      ],
    },
  ],
  "ki-monitoring": [
    {
      id: "competitors",
      question: { de: "Wie wichtig ist Ihnen ein Vergleich mit der Konkurrenz?", en: "How important is a comparison with competitors to you?" },
      choices: [
        { id: "very-important", label: { de: "Sehr wichtig", en: "Very important" } },
        { id: "nice-to-have", label: { de: "Nice to have", en: "Nice to have" } },
      ],
    },
  ],
  barrierefreiheit: [
    {
      id: "b2c",
      question: { de: "Verkaufen Sie Produkte oder Dienstleistungen direkt online an Privatkunden?", en: "Do you sell products or services directly online to private customers?" },
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
        { id: "partly", label: { de: "Teilweise", en: "Partly" } },
      ],
    },
    {
      id: "feedback",
      question: { de: "Haben Sie schon Rückmeldungen von Nutzern zu Zugänglichkeitsproblemen bekommen?", en: "Have you already received user feedback about accessibility issues?" },
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
        { id: "unsure", label: { de: "Weiß ich nicht", en: "Not sure" } },
      ],
    },
  ],
  "unternehmens-ki": [
    {
      id: "documents",
      question: { de: "Mit welchen Unterlagen soll die KI hauptsächlich arbeiten?", en: "What documents should the AI mainly work with?" },
      choices: [
        { id: "contracts", label: { de: "Verträge", en: "Contracts" } },
        { id: "customer-data", label: { de: "Kundendaten", en: "Customer data" } },
        { id: "internal-knowledge", label: { de: "Internes Wissen & Anleitungen", en: "Internal knowledge & guides" } },
        { id: "other", label: { de: "Sonstiges", en: "Other" } },
      ],
    },
    {
      id: "teamSize",
      question: { de: "Wie viele Mitarbeiter würden das nutzen?", en: "How many employees would use this?" },
      choices: [
        { id: "only-me", label: { de: "Nur ich", en: "Just me" } },
        { id: "small-team", label: { de: "Kleines Team", en: "Small team" } },
        { id: "whole-dept", label: { de: "Ganze Abteilung(en)", en: "Whole department(s)" } },
      ],
    },
    {
      id: "existingAI",
      question: { de: "Läuft aktuell schon eine KI-Lösung im Einsatz, die ersetzt werden soll?", en: "Is there already an AI solution in use that should be replaced?" },
      choices: [
        { id: "yes", label: { de: "Ja", en: "Yes" } },
        { id: "no", label: { de: "Nein", en: "No" } },
      ],
    },
  ],
  wartung: [
    {
      id: "frequency",
      question: { de: "Wie oft ändern sich die Inhalte ungefähr?", en: "Roughly how often does the content change?" },
      choices: [
        { id: "rarely", label: { de: "Selten", en: "Rarely" } },
        { id: "monthly", label: { de: "Monatlich", en: "Monthly" } },
        { id: "weekly", label: { de: "Wöchentlich", en: "Weekly" } },
      ],
    },
    {
      id: "builtByUs",
      question: { de: "Ist das eine Website, die wir gebaut haben, oder von woanders?", en: "Is that a website we built, or from elsewhere?" },
      choices: [
        { id: "by-us", label: { de: "Von HM Labs", en: "By HM Labs" } },
        { id: "elsewhere", label: { de: "Von woanders", en: "From elsewhere" } },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
   Aggregierte Antwort-Labels (für Portal-Fallback-Anzeige alter/flacher Werte)
───────────────────────────────────────────── */

function collect(labels: Record<string, I18n>, choices: Choice[]) {
  for (const c of choices) if (!labels[c.id]) labels[c.id] = c.label;
}

export const ANSWER_LABELS: Record<string, I18n> = (() => {
  const labels: Record<string, I18n> = {};
  collect(labels, CATEGORIES);
  for (const step of MAIN_STEPS) collect(labels, step.choices);
  collect(labels, AUDIT_QUALITATIVE_BANDS);
  for (const qs of Object.values(CATEGORY_SUBWIZARD)) for (const q of qs) collect(labels, q.choices);
  for (const q of Object.values(AUDIT_FOLLOWUPS)) collect(labels, q.choices);
  for (const qs of Object.values(SERVICE_SUBWIZARD)) for (const q of qs) collect(labels, q.choices);
  return labels;
})();

/**
 * Fragetext je Unterwizard-Frage, geschlüsselt wie subAnswers im Portal:
 * `${scope}:${questionId}` (scope = Kategorie- oder Service-ID). Ermöglicht,
 * im Portal neben der Antwort auch die gestellte Frage anzuzeigen.
 */
export const SUB_QUESTION_TEXT: Record<string, I18n> = (() => {
  const map: Record<string, I18n> = {};
  for (const [catId, qs] of Object.entries(CATEGORY_SUBWIZARD)) {
    for (const q of qs) map[`${catId}:${q.id}`] = q.question;
  }
  for (const q of Object.values(AUDIT_FOLLOWUPS)) map[`audit:${q.id}`] = q.question;
  for (const [serviceId, qs] of Object.entries(SERVICE_SUBWIZARD)) {
    for (const q of qs) map[`${serviceId}:${q.id}`] = q.question;
  }
  return map;
})();
