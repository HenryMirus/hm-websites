/**
 * HM Labs: typisierte Content-Schicht (Masterplan §10.3, §11.1)
 *
 * Quellen (Single Source, nichts hier erfinden):
 *   - Preise/Spannen/Disclaimer:  docs/spec/preislogik.yaml (WÖRTLICH)
 *   - Leistungstexte:             docs/spec/hm-leistungsportfolio.md §1–13
 *
 * Regeln (preislogik.yaml → verboten):
 *   - Festpreise ohne Spanne, Garantien, feste Lieferzeit-Zusagen
 *   - Preise für Leistungen, die nicht in der YAML stehen
 *     → Leistungen 09–12 (Kalibrierung ausstehend, offene Entscheidung Nr. 5)
 *       erscheinen deshalb OHNE Preisspanne (das kläre ich persönlich).
 *
 * Pflege-Workflow bei Preisänderung: siehe Masterplan §11.4.
 */

export type Lang = "de" | "en";
export type I18n = Record<Lang, string>;

export type Gruppe = "A" | "B" | "C" | "D";

export interface Leistung {
  id: string;
  /** Portfolio-Nummer 01–13, Struktur trägt Information (Masterplan S3) */
  nr: string;
  gruppe: Gruppe;
  name: I18n;
  /** Ein-Satz-Nutzen (S3-Index, Nav-Dropdown) */
  kurz: I18n;
  /** 2 Sätze „Was ist das" (Leistungsübersicht) */
  beschreibung: I18n;
  fuerWen: I18n;
  enthalten: { de: string[]; en: string[] };
  zeitrahmen: I18n | null;
  /**
   * Anzeige-Preis, WÖRTLICH aus preislogik.yaml abgeleitet.
   * null = Leistung (noch) nicht in der YAML → keine Nennung erlaubt.
   */
  preis: I18n | null;
  /** Kupfer-Markierung im Leistungs-Index */
  badge?: I18n;
}

export const GRUPPEN: Record<Gruppe, I18n> = {
  A: { de: "Websites & Design", en: "Websites & Design" },
  B: { de: "KI-Leistungen", en: "AI Services" },
  C: { de: "Sichtbarkeit & Compliance", en: "Visibility & Compliance" },
  D: { de: "Laufende Betreuung", en: "Ongoing Care" },
};

/**
 * Pflicht-Disclaimer: WÖRTLICH aus preislogik.yaml (meta.pflicht_disclaimer).
 * Steht als statischer Textbaustein unter JEDER Preisnennung (Masterplan 2.3).
 * EN = redaktionelle Übersetzung desselben Inhalts.
 */
export const PREIS_DISCLAIMER: I18n = {
  de: "Das ist eine unverbindliche Orientierung basierend auf vergleichbaren Projekten, kein Angebot. Ein konkretes, verbindliches Angebot erstelle ich erst nach einem persönlichen Gespräch, in dem die genauen Anforderungen geklärt werden.",
  en: "This is a non-binding orientation based on comparable projects, not an offer. I only prepare a specific, binding quote after a personal conversation in which the exact requirements are clarified.",
};

/**
 * Klarstellung (Session-Feedback, kein YAML-Wortlaut): Die Spanne gilt nur VOR
 * dem Angebot. Sobald das persönliche Angebot steht, ist der Preis für den
 * vereinbarten Umfang fest und "wandert" während der Umsetzung nicht mehr.
 * Ergänzt den Disclaimer, ersetzt ihn nicht.
 */
export const ANGEBOT_HINWEIS: I18n = {
  de: "Im Angebot selbst steht dann ein fester Preis für den vereinbarten Umfang, der sich während der Umsetzung nicht mehr ändert. Nur die Spanne davor ist offen, nicht der vereinbarte Preis danach.",
  en: "The quote itself then states a fixed price for the agreed scope, and that price doesn't change during the project. Only the range beforehand is open, not the agreed price afterwards.",
};

/** Zahlungsstruktur, deckungsgleich preislogik.yaml / AGB §4 */
export const ZAHLUNG = {
  bis5000: {
    de: "50 % bei Auftragserteilung, 50 % bei Abnahme",
    en: "50% on commissioning, 50% on acceptance",
  },
  ueber5000: {
    de: "40 % bei Auftragserteilung, 40 % bei MVP-Abnahme, 20 % bei Launch",
    en: "40% on commissioning, 40% on MVP acceptance, 20% at launch",
  },
  laufend: {
    de: "monatlich im Voraus (Wartung, Chatbot-Betrieb)",
    en: "monthly in advance (maintenance, chatbot operation)",
  },
} as const;

/** Revisionsrunden: preislogik.yaml */
export const REVISIONEN = {
  inklusive: 2,
  weitere: {
    de: "weitere nach Aufwand, Richtwert 80–110 €/h",
    en: "additional rounds billed by effort, guide rate €80–110/h",
  },
} as const;

export const LEISTUNGEN: Leistung[] = [
  /* TEIL A: WEBSITES & DESIGN */
  {
    id: "landingpage",
    nr: "01",
    gruppe: "A",
    name: { de: "Landingpage / Onepager", en: "Landing page / One-pager" },
    kurz: {
      de: "Eine einzelne, dafür umso stärkere Seite mit klarer Handlungsaufforderung.",
      en: "A single, all-the-stronger page with one clear call to action.",
    },
    beschreibung: {
      de: "Eine einzelne, dafür umso stärkere Seite: ideal für ein Produkt, eine Dienstleistung, eine Kampagne oder einen fokussierten Unternehmensauftritt. Alles, was der Besucher wissen muss, auf einer Seite mit klarer Handlungsaufforderung.",
      en: "A single, all-the-stronger page: ideal for a product, a service, a campaign or a focused company presence. Everything a visitor needs to know, on one page with a clear call to action.",
    },
    fuerWen: {
      de: "Selbstständige und kleine Unternehmen mit einem klaren Angebot; Kampagnen und Produktlaunches; Gründer, die schnell professionell sichtbar sein wollen.",
      en: "Self-employed professionals and small businesses with one clear offer; campaigns and product launches; founders who want to be professionally visible fast.",
    },
    enthalten: {
      de: [
        "Individuelles Design, kein Template, entworfen für Sie",
        "Scroll-Animationen und Bewegungskonzept",
        "Vollständig responsive (Mobile-First)",
        "SEO-Grundoptimierung",
        "Kontakt-/Anfrage-Sektion, DSGVO-Basics",
      ],
      en: [
        "Individual design, no template, designed for you",
        "Scroll animations and motion concept",
        "Fully responsive (mobile-first)",
        "Baseline SEO",
        "Contact/inquiry section, GDPR basics",
      ],
    },
    zeitrahmen: { de: "1–2 Wochen", en: "1–2 weeks" },
    preis: { de: "1.500–3.000 €", en: "€1,500–3,000" },
  },
  {
    id: "business-website",
    nr: "02",
    gruppe: "A",
    name: {
      de: "Individuelle Business-Website",
      en: "Individual business website",
    },
    kurz: {
      de: "Der vollständige Unternehmensauftritt, gefunden bei Google und in KI-Suchen.",
      en: "The complete company presence, found on Google and in AI search.",
    },
    beschreibung: {
      de: "Der vollständige Unternehmensauftritt: bis zu 6 Unterseiten, komplett individuell gestaltet, mit durchdachtem Animationskonzept und technischem Fundament, das bei Google und in KI-Suchen gefunden wird.",
      en: "The complete company presence: up to 6 subpages, fully individually designed, with a considered animation concept and a technical foundation that gets found on Google and in AI search.",
    },
    fuerWen: {
      de: "Etablierte kleine und mittlere Unternehmen, Praxen, Kanzleien, Dienstleister, Handwerksbetriebe mit Qualitätsanspruch.",
      en: "Established small and mid-sized companies, medical practices, law firms, service providers and trade businesses with high standards.",
    },
    enthalten: {
      de: [
        "Bis 6 Unterseiten, vollständig individuelles Design",
        "GSAP-Animationen mit Signature-Momenten",
        "Technisches SEO und GAIO im Standard, kein Aufpreis",
        "Lighthouse-Ziel 90+ in allen vier Kategorien",
        "Mobile-First, DSGVO-konforme Basics",
      ],
      en: [
        "Up to 6 subpages, fully individual design",
        "GSAP animations with signature moments",
        "Technical SEO and GAIO as standard, no surcharge",
        "Lighthouse target 90+ in all four categories",
        "Mobile-first, GDPR-compliant basics",
      ],
    },
    zeitrahmen: { de: "3–5 Wochen", en: "3–5 weeks" },
    preis: { de: "3.500–7.500 €", en: "€3,500–7,500" },
  },
  {
    id: "corporate-website",
    nr: "03",
    gruppe: "A",
    name: { de: "Corporate-Website", en: "Corporate website" },
    kurz: {
      de: "10+ Unterseiten auf einem eigenen Design-System, konsistent und skalierbar.",
      en: "10+ subpages on a dedicated design system, consistent and scalable.",
    },
    beschreibung: {
      de: "Der große Auftritt: 10+ Unterseiten, ein eigenes Design-System mit mehreren Seitentypen, erweiterte Animationskonzepte und bei Bedarf Datenbankanbindung.",
      en: "The big presence: 10+ subpages, a dedicated design system with multiple page types, advanced animation concepts and database integration where needed.",
    },
    fuerWen: {
      de: "Mittelständische Unternehmen, Organisationen mit mehreren Leistungsbereichen oder Standorten, Marken mit hohem Anspruch an Konsistenz.",
      en: "Mid-sized companies, organisations with several service areas or locations, brands with high consistency requirements.",
    },
    enthalten: {
      de: [
        "10+ Unterseiten auf Basis eines Design-Systems",
        "Erweiterte Animationskonzepte",
        "Vollständiges SEO/GAIO-Paket",
        "CMS-Anbindung, Inhalte selbst pflegbar",
        "Bei Bedarf Datenbank-Integration (Supabase)",
      ],
      en: [
        "10+ subpages built on a design system",
        "Advanced animation concepts",
        "Complete SEO/GAIO package",
        "CMS integration, maintain content yourself",
        "Database integration (Supabase) where needed",
      ],
    },
    zeitrahmen: { de: "6–10 Wochen", en: "6–10 weeks" },
    preis: { de: "7.500–15.000 €", en: "€7,500–15,000" },
  },
  {
    id: "relaunch",
    nr: "04",
    gruppe: "A",
    name: { de: "Website-Relaunch", en: "Website relaunch" },
    kurz: {
      de: "Komplett neu, ohne dass Ihr Google-Ranking verloren geht.",
      en: "Completely rebuilt, without losing your Google rankings.",
    },
    beschreibung: {
      de: "Die bestehende Website wird analysiert und komplett neu aufgebaut: Design, Technik und Struktur, ohne dass Google-Rankings verloren gehen. 301-Redirect-Map und vier Wochen Ranking-Monitoring nach Launch sind inklusive.",
      en: "Your existing website is analysed and completely rebuilt: design, technology and structure, without losing Google rankings. A 301 redirect map and four weeks of rank monitoring after launch are included.",
    },
    fuerWen: {
      de: "Unternehmen mit veralteter, langsamer oder optisch nicht mehr zeitgemäßer Website; Auftritte, die nicht mehr zur Positionierung passen.",
      en: "Companies with an outdated, slow or visually dated website; presences that no longer match the positioning.",
    },
    enthalten: {
      de: [
        "Analyse der Alt-Website (Technik, Inhalte, Rankings)",
        "Neues, individuelles Design",
        "Technischer Neuaufbau auf modernem Stack",
        "Content-Migration",
        "301-Redirect-Map + 4 Wochen Ranking-Monitoring",
      ],
      en: [
        "Analysis of the old site (tech, content, rankings)",
        "New, individual design",
        "Technical rebuild on a modern stack",
        "Content migration",
        "301 redirect map + 4 weeks rank monitoring",
      ],
    },
    zeitrahmen: { de: "3–6 Wochen", en: "3–6 weeks" },
    preis: { de: "3.000–8.000 €", en: "€3,000–8,000" },
  },
  {
    id: "logo-branding",
    nr: "05",
    gruppe: "A",
    name: { de: "Logo & Basis-Branding", en: "Logo & basic branding" },
    kurz: {
      de: "Logo, Farbsystem, Typografie und Mini-Styleguide als Ergänzung zum Website-Projekt.",
      en: "Logo, colour system, typography and mini style guide as an add-on to a website project.",
    },
    beschreibung: {
      de: "Logo, Farbsystem, Typografie-Definition und Mini-Styleguide als Ergänzung zu einem Website-Projekt, wenn die visuelle Grundlage fehlt oder erneuert werden soll. Kein eigenständiges Branding-Großprojekt.",
      en: "Logo, colour system, typography definition and mini style guide as an add-on to a website project when the visual foundation is missing or due for renewal. Not a standalone large-scale branding project.",
    },
    fuerWen: {
      de: "Website-Kunden ohne belastbare visuelle Grundlage.",
      en: "Website clients without a solid visual foundation.",
    },
    enthalten: {
      de: ["Logo", "Farbsystem", "Typografie-Definition", "Mini-Styleguide"],
      en: ["Logo", "Colour system", "Typography definition", "Mini style guide"],
    },
    zeitrahmen: null,
    preis: { de: "800–2.500 €", en: "€800–2,500" },
  },

  /* TEIL B: KI-LEISTUNGEN */
  {
    id: "ki-chatbot",
    nr: "06",
    gruppe: "B",
    name: {
      de: "KI-Chatbot (self-hosted, DSGVO-konform)",
      en: "AI chatbot (self-hosted, GDPR-native)",
    },
    kurz: {
      de: "Beantwortet Besucherfragen und leitet qualifizierte Anfragen weiter, auf EU-Servern und ohne Drittanbieter.",
      en: "Answers visitor questions and forwards qualified leads, on EU servers and with no third parties.",
    },
    beschreibung: {
      de: "Ein KI-Assistent auf Ihrer Website, der Besucherfragen beantwortet, Preisorientierung gibt und qualifizierte Anfragen weiterleitet. Er läuft vollständig auf EU-Servern, ohne Datenweitergabe an OpenAI, Google oder andere Drittanbieter.",
      en: "An AI assistant on your website that answers visitor questions, gives price orientation and forwards qualified inquiries. It runs entirely on EU servers, with no data passed to OpenAI, Google or any other third party.",
    },
    fuerWen: {
      de: "Jedes Unternehmen, dessen Besucher wiederkehrende Fragen stellen, vom Handwerksbetrieb bis zur Beratung.",
      en: "Any company whose visitors ask recurring questions, from trade businesses to consultancies.",
    },
    enthalten: {
      de: [
        "Self-hosted auf EU-Server, keine Datenweitergabe",
        "Kuratierte Wissensbasis (30–40 Antworten) aus Ihrem Material",
        "Chat-Widget in Ihrem Corporate Design",
        "Consent-Flow + KI-Kennzeichnung nach EU AI Act Art. 50",
        "Lead-Weiterleitung und Einweisung",
      ],
      en: [
        "Self-hosted on EU servers, no data sharing",
        "Curated knowledge base (30–40 answers) from your material",
        "Chat widget in your corporate design",
        "Consent flow + AI disclosure per EU AI Act Art. 50",
        "Lead forwarding and onboarding",
      ],
    },
    zeitrahmen: {
      de: "1–2 Wochen (parallel zur Website möglich)",
      en: "1–2 weeks (possible in parallel with the website)",
    },
    preis: {
      de: "1.500–3.500 € Setup + 50–150 €/Monat",
      en: "€1,500–3,500 setup + €50–150/month",
    },
  },
  {
    id: "webapps",
    nr: "07",
    gruppe: "B",
    name: {
      de: "Webapp / Software mit KI-Automatisierung",
      en: "Web app / software with AI automation",
    },
    kurz: {
      de: "Maßgeschneiderte Web-Anwendungen mit KI dort, wo sie Aufwand spart, und menschlicher Kontrolle, wo Entscheidungen fallen.",
      en: "Tailor-made web applications with AI where it saves effort, and human control where decisions are made.",
    },
    beschreibung: {
      de: "Maßgeschneiderte Web-Anwendungen, die Geschäftsprozesse digitalisieren, mit KI-Automatisierungen dort, wo sie echten Aufwand sparen, und menschlicher Kontrolle dort, wo Entscheidungen fallen (Human-in-the-loop).",
      en: "Tailor-made web applications that digitalise business processes, with AI automation where it saves real effort, and human control where decisions are made (human-in-the-loop).",
    },
    fuerWen: {
      de: "Unternehmen mit wiederkehrenden manuellen Prozessen, die eine eigene Lösung statt zwanzig SaaS-Abos wollen.",
      en: "Companies with recurring manual processes that want one owned solution instead of twenty SaaS subscriptions.",
    },
    enthalten: {
      de: [
        "Anforderungsanalyse + Datenfluss-Konzept inkl. DSGVO-Check",
        "Individuelle Web-App (Next.js/Supabase)",
        "Authentifizierung + Rollenkonzept",
        "1–2 KI-Automatisierungen mit Human-in-the-loop",
        "Testing, Deployment, Betriebs-Dokumentation",
      ],
      en: [
        "Requirements analysis + data-flow concept incl. GDPR check",
        "Individual web app (Next.js/Supabase)",
        "Authentication + role concept",
        "1–2 AI automations with human-in-the-loop",
        "Testing, deployment, operations documentation",
      ],
    },
    zeitrahmen: { de: "4–10 Wochen", en: "4–10 weeks" },
    preis: { de: "8.000–25.000 €", en: "€8,000–25,000" },
  },
  {
    id: "saas-mvp",
    nr: "08",
    gruppe: "B",
    name: { de: "SaaS-MVP", en: "SaaS MVP" },
    kurz: {
      de: "Die erste marktreife Version Ihres Software-Produkts, fokussiert auf maximal 3 Kern-Features.",
      en: "The first market-ready version of your software product, focused on a maximum of 3 core features.",
    },
    beschreibung: {
      de: "Die erste marktreife Version eines Software-Produkts, fokussiert auf maximal 3 Kern-Features, damit der Markt-Test schnell und bezahlbar bleibt.",
      en: "The first market-ready version of a software product, focused on a maximum of 3 core features so the market test stays fast and affordable.",
    },
    fuerWen: {
      de: "Gründer und Unternehmen, die eine Produktidee validieren wollen, bevor sie groß investieren.",
      en: "Founders and companies that want to validate a product idea before investing big.",
    },
    enthalten: {
      de: [
        "Max. 3 Kern-Features",
        "Auth + Multi-Tenancy (Supabase RLS)",
        "Stripe-Billing",
        "Staging/Prod-Trennung, Security-Baseline-Check",
        "Betriebs-Runbook, Launch-Begleitung",
      ],
      en: [
        "Max. 3 core features",
        "Auth + multi-tenancy (Supabase RLS)",
        "Stripe billing",
        "Staging/prod separation, security baseline check",
        "Operations runbook, launch support",
      ],
    },
    zeitrahmen: { de: "8–14 Wochen", en: "8–14 weeks" },
    preis: { de: "15.000–35.000 €", en: "€15,000–35,000" },
  },

  /* TEIL C: SICHTBARKEIT & COMPLIANCE */
  {
    id: "gaio",
    nr: "09",
    gruppe: "C",
    name: {
      de: "GAIO-Audit & KI-Sichtbarkeit",
      en: "GAIO audit & AI visibility",
    },
    kurz: {
      de: "Wird Ihre Website von ChatGPT, Perplexity & Co. gefunden und zitiert? Das Audit prüft es und rüstet nach.",
      en: "Is your website found and cited by ChatGPT, Perplexity & co.? The audit checks and retrofits.",
    },
    beschreibung: {
      de: "Immer mehr Menschen fragen ChatGPT, Perplexity oder Google AI Overviews nach Empfehlungen, statt klassisch zu googeln. Dieses Audit prüft, ob Ihre bestehende Website von KI-Systemen gefunden, verstanden und zitiert wird, und rüstet sie nach, ohne dass ein Relaunch nötig ist.",
      en: "More and more people ask ChatGPT, Perplexity or Google AI Overviews for recommendations instead of googling. This audit checks whether your existing website is found, understood and cited by AI systems, and retrofits it, no relaunch required.",
    },
    fuerWen: {
      de: "Unternehmen mit funktionierender Website, die keinen Neubau brauchen, aber in KI-Suchen unsichtbar sind. Der niedrigschwellige Einstieg.",
      en: "Companies with a working website that don't need a rebuild but are invisible in AI search. The low-threshold entry point.",
    },
    enthalten: {
      de: [
        "Prüfung der KI-Crawler-Zugänglichkeit",
        "Analyse: Werden Sie in ChatGPT/Perplexity genannt, und Ihre Wettbewerber?",
        "Schema.org-/Strukturdaten-Check",
        "Content-Struktur-Bewertung (Zitierfähigkeit, E-E-A-T)",
        "Priorisierter Maßnahmenbericht, verständlich für Nicht-Techniker",
      ],
      en: [
        "AI-crawler accessibility check",
        "Analysis: are you mentioned in ChatGPT/Perplexity, and are your competitors?",
        "Schema.org/structured-data check",
        "Content structure assessment (citability, E-E-A-T)",
        "Prioritised action report, readable for non-technicians",
      ],
    },
    zeitrahmen: {
      de: "Audit 3–5 Werktage; Optimierung 1–2 Wochen",
      en: "Audit 3–5 working days; optimisation 1–2 weeks",
    },
    preis: null, // Kalibrierung ausstehend, nicht in preislogik.yaml v1.0
    badge: { de: "DER EINSTIEG", en: "THE ENTRY POINT" },
  },
  {
    id: "ki-monitoring",
    nr: "10",
    gruppe: "C",
    name: {
      de: "KI-Sichtbarkeits-Monitoring",
      en: "AI visibility monitoring",
    },
    kurz: {
      de: "Monatliche Überwachung: Wird Ihre Marke in KI-Systemen genannt, und in welchem Kontext?",
      en: "Monthly monitoring: is your brand mentioned in AI systems, and in what context?",
    },
    beschreibung: {
      de: "Fortlaufende monatliche Überwachung: Wird Ihre Marke in ChatGPT, Perplexity und Google AI Overviews genannt? In welchem Kontext? Was sagen die KI-Systeme über Wettbewerber? Mit monatlichem Kurzbericht und Handlungsempfehlungen.",
      en: "Ongoing monthly monitoring: is your brand mentioned in ChatGPT, Perplexity and Google AI Overviews? In what context? What do AI systems say about competitors? With a monthly one-page report and recommendations.",
    },
    fuerWen: {
      de: "Kunden nach GAIO-Optimierung; Unternehmen in wettbewerbsintensiven lokalen Märkten; Wartungskunden als Upgrade.",
      en: "Clients after GAIO optimisation; companies in competitive local markets; maintenance clients as an upgrade.",
    },
    enthalten: {
      de: [
        "Monatliche Abfrage-Sets gegen die relevanten KI-Systeme",
        "Nennung-Tracking: empfohlen, neutral erwähnt, gar nicht genannt?",
        "Wettbewerber-Vergleich",
        "Monatlicher 1-Seiten-Bericht mit Trend und Empfehlungen",
        "Alarm bei negativen oder falschen KI-Aussagen",
      ],
      en: [
        "Monthly query sets against the relevant AI systems",
        "Mention tracking: recommended, neutral, absent?",
        "Competitor comparison",
        "Monthly one-page report with trend and recommendations",
        "Alert on negative or false AI statements",
      ],
    },
    zeitrahmen: null,
    preis: null, // Kalibrierung ausstehend
  },
  {
    id: "barrierefreiheit",
    nr: "11",
    gruppe: "C",
    name: {
      de: "BFSG-Barrierefreiheits-Audit & Umsetzung",
      en: "Accessibility audit & remediation (BFSG)",
    },
    kurz: {
      de: "Prüft ehrlich, ob Sie betroffen sind, und setzt sauber im Code um. Keine Overlay-Tools.",
      en: "Honestly checks whether you're affected, and remediates cleanly in code. No overlay tools.",
    },
    beschreibung: {
      de: "Das Barrierefreiheitsstärkungsgesetz (BFSG) verpflichtet viele Unternehmen im B2C-Bereich zu barrierefreien digitalen Angeboten. Dieses Audit prüft ehrlich, ob Sie überhaupt betroffen sind, wo Ihre Website steht, und setzt die nötigen Maßnahmen sauber im Code um, keine Overlay-Tools.",
      en: "Germany's Accessibility Strengthening Act (BFSG) obliges many B2C companies to provide accessible digital offerings. This audit honestly checks whether you're affected at all, where your website stands, and remediates cleanly in code, no overlay tools.",
    },
    fuerWen: {
      de: "Online-Shops, Buchungssysteme, Kundenportale im B2C. Ehrliche Einordnung: Kleinstunternehmen sind bei Dienstleistungen ausgenommen, das sagen wir Ihnen zuerst.",
      en: "Online shops, booking systems, customer portals in B2C. Honest classification: micro-enterprises are exempt for services, and we tell you that first.",
    },
    enthalten: {
      de: [
        "Betroffenheits-Check, transparente Antwort, auch wenn sie „nein“ lautet",
        "Technische Prüfung gegen WCAG 2.1 AA / EN 301 549",
        "Priorisierter Mängelbericht mit Aufwandsschätzung",
        "Optional: Behebung im Code + Barrierefreiheitserklärung",
        "Abschlussprüfung mit Testprotokoll",
      ],
      en: [
        "Applicability check, transparent answer, even if it is 'no'",
        "Technical audit against WCAG 2.1 AA / EN 301 549",
        "Prioritised defect report with effort estimate",
        "Optional: remediation in code + accessibility statement",
        "Final audit with test protocol",
      ],
    },
    zeitrahmen: {
      de: "Audit 3–5 Werktage; Umsetzung 1–3 Wochen",
      en: "Audit 3–5 working days; remediation 1–3 weeks",
    },
    preis: null, // Kalibrierung ausstehend
  },
  {
    id: "unternehmens-ki",
    nr: "12",
    gruppe: "C",
    name: {
      de: "Private Unternehmens-KI (self-hosted)",
      en: "Private company AI (self-hosted)",
    },
    kurz: {
      de: "Wie ChatGPT, nur dass kein einziges Byte Ihr Unternehmen verlässt.",
      en: "Like ChatGPT, except not a single byte leaves your company.",
    },
    beschreibung: {
      de: "Eine eigene, private KI-Umgebung auf Ihrem Server, wie ChatGPT, nur dass kein einziges Byte das Unternehmen verlässt. Mitarbeiter fassen Verträge zusammen, entwerfen E-Mails und durchsuchen interne Dokumente, DSGVO-konform und ohne US-Anbieter.",
      en: "Your own private AI environment on your server, like ChatGPT, except not a single byte leaves the company. Staff summarise contracts, draft emails and search internal documents, GDPR-compliant and without US providers.",
    },
    fuerWen: {
      de: "Unternehmen mit sensiblen Daten: Kanzleien, Steuerberater, Arztpraxen, Personalabteilungen, Beratungen.",
      en: "Companies with sensitive data: law firms, tax advisors, medical practices, HR departments, consultancies.",
    },
    enthalten: {
      de: [
        "Bedarfsanalyse, ehrliche Beratung zu Modell und Hardware",
        "KI-Umgebung auf Ihrem Server oder gemanagtem EU-VPS",
        "Optional: Dokumenten-Anbindung (RAG)",
        "Benutzerverwaltung, DSGVO-Basisdokumentation",
        "Team-Einweisung (KI-Kompetenz nach Art. 4 EU AI Act)",
      ],
      en: [
        "Needs analysis, honest advice on model and hardware",
        "AI environment on your server or a managed EU VPS",
        "Optional: document integration (RAG)",
        "User management, GDPR base documentation",
        "Team onboarding (AI literacy per Art. 4 EU AI Act)",
      ],
    },
    zeitrahmen: {
      de: "Basis-Setup 1 Woche; mit Dokumenten-Anbindung 2–3 Wochen",
      en: "Base setup 1 week; with document integration 2–3 weeks",
    },
    preis: null, // Kalibrierung ausstehend
  },

  /* TEIL D: LAUFENDE BETREUUNG */
  {
    id: "wartung",
    nr: "13",
    gruppe: "D",
    name: { de: "Wartung & Hosting", en: "Maintenance & hosting" },
    kurz: {
      de: "EU-Hosting, Updates, Backups und Monitoring, planbar in drei Tarifen.",
      en: "EU hosting, updates, backups and monitoring, predictable in three tiers.",
    },
    beschreibung: {
      de: "Laufende Betreuung in drei Tarifen: von Hosting auf EU-Servern mit SSL, Updates, Backups und Uptime-Monitoring (Basis) über kleine Inhaltsänderungen und Prioritäts-Support (Komfort) bis zum monatlichen Performance/SEO-Check mit Chatbot-Pflege (Premium).",
      en: "Ongoing care in three tiers: from EU hosting with SSL, updates, backups and uptime monitoring (Basis) through small content changes and priority support (Komfort) to a monthly performance/SEO check with chatbot maintenance (Premium).",
    },
    fuerWen: {
      de: "Alle Projektkunden, der Basis-Tarif ist die Default-Empfehlung in jedem Angebot.",
      en: "All project clients, the Basis tier is the default recommendation in every quote.",
    },
    enthalten: {
      de: [
        "Basis: Hosting (EU), SSL, Updates, Backups, Uptime-Monitoring",
        "Komfort: + Inhaltsänderungen (bis 1 h/Monat), Prioritäts-Support",
        "Premium: + Performance/SEO-Check, bis 3 h Änderungen, Chatbot-Pflege",
      ],
      en: [
        "Basis: hosting (EU), SSL, updates, backups, uptime monitoring",
        "Komfort: + content changes (up to 1 h/month), priority support",
        "Premium: + performance/SEO check, up to 3 h changes, chatbot care",
      ],
    },
    zeitrahmen: null,
    preis: {
      de: "49–299 €/Monat (drei Tarife)",
      en: "€49–299/month (three tiers)",
    },
  },
];

/** Wartungs-Tarife im Detail (preislogik.yaml wartung.tiers) */
export const WARTUNG_TIERS = [
  {
    name: "Basis",
    range: { de: "49–79 €/Monat", en: "€49–79/month" },
    umfang: {
      de: "Hosting (EU), SSL, Updates, Backups, Uptime-Monitoring",
      en: "Hosting (EU), SSL, updates, backups, uptime monitoring",
    },
    default: true,
  },
  {
    name: "Komfort",
    range: { de: "99–149 €/Monat", en: "€99–149/month" },
    umfang: {
      de: "Basis + kleine Inhaltsänderungen (bis 1 h/Monat), Prioritäts-Support",
      en: "Basis + small content changes (up to 1 h/month), priority support",
    },
    default: false,
  },
  {
    name: "Premium",
    range: { de: "199–299 €/Monat", en: "€199–299/month" },
    umfang: {
      de: "Komfort + monatlicher Performance/SEO-Check, bis 3 h Änderungen, Chatbot-Pflege",
      en: "Komfort + monthly performance/SEO check, up to 3 h changes, chatbot care",
    },
    default: false,
  },
] as const;

export const leistungById = (id: string) =>
  LEISTUNGEN.find((l) => l.id === id);

export const leistungenByGruppe = (g: Gruppe) =>
  LEISTUNGEN.filter((l) => l.gruppe === g);
