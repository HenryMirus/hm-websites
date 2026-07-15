import { EMAIL } from "@/lib/config/email";

export type Lang = "de" | "en";

// ─── Translation object ────────────────────────────────────────────────────────
// Single source of truth for all visible text on the site.
// Each leaf is { de: "...", en: "..." }; use getText(obj, lang) to resolve.
// Sections mirror the component names they belong to.

export const t = {

  // ─── Navigation ──────────────────────────────────────────────────────────────
  // Navigation links + top-right CTA button
  nav: {
    services: { de: "Leistungen", en: "Services" },
    process: { de: "Ablauf", en: "Process" },
    portfolio: { de: "Projekte", en: "Projects" },
    about: { de: "Über mich", en: "About me" },
    contact: { de: "Kontakt", en: "Contact" },
    cta: { de: "Kostenlos beraten", en: "Free consultation" },
  },

  // ─── Hero Section ─────────────────────────────────────────────────────────────
  // Main headline (3 lines), subtext, two CTA buttons, stats row,
  // and the three floating badge overlays on the right side.
  hero: {
    tag: { de: "Für den Mittelstand · Für KMUs", en: "For SMBs · For mid-market" },
    line1: { de: "Ich integriere KI-Systeme", en: "I Integrate AI Systems" },
    line2: { de: "in Unternehmen", en: "Into Businesses" },
    line3: { de: "Mehr Kunden, weniger Aufwand", en: "More Clients, Less Effort" },
    sub: {
      de: "Kein Agentur-Overhead, ein fester Ansprechpartner. KI-Systeme und Software für Ihren Betrieb, dazu bei Bedarf die passende Website, mit transparenten Preisspannen statt Lockangeboten.",
      en: "No agency overhead, one fixed point of contact. AI systems and software for your business, plus a fitting website if you need one, with transparent price ranges instead of bait offers.",
    },
    cta1: { de: "Kostenlos beraten lassen", en: "Book free consultation" },
    cta2: { de: "Unsere Projekte ansehen", en: "View our work" },
    stat1val: { de: "13", en: "13" },
    stat1: { de: "Leistungen, ein Ansprechpartner", en: "services, one contact" },
    stat2val: { de: "SEO + GAIO", en: "SEO + GAIO" },
    stat2: { de: "in jeder Website inklusive", en: "included in every website" },
    stat3val: { de: "≤ 1 Werktag", en: "≤ 1 business day" },
    stat3: { de: "bis zur persönlichen Antwort", en: "until a personal reply" },
    // Floating badge overlays (top-right decorative cards in hero)
    floating: {
      stat1Label: { de: "Lighthouse-Ziel, messbar", en: "Lighthouse target, measured" },
      live: { de: "Projekt live", en: "Project live" },
      avgVal: { de: "1–5 Wochen", en: "1–5 weeks" },
      avg: { de: "Richtwert je nach Umfang", en: "guide value by scope" },
    },
  },

  // ─── Trust Bar ───────────────────────────────────────────────────────────────
  // Scrolling marquee below hero: label + industry pills
  trust: {
    label: { de: "Vertrauen von Unternehmen aus", en: "Trusted by businesses in" },
    industries: [
      { de: "Handwerk", en: "Trades" },
      { de: "Recht & Steuer", en: "Legal & Tax" },
      { de: "Logistik", en: "Logistics" },
      { de: "Gastronomie", en: "Hospitality" },
      { de: "Gesundheit", en: "Healthcare" },
      { de: "Immobilien", en: "Real Estate" },
      { de: "Handel", en: "Retail" },
      { de: "Beratung", en: "Consulting" },
      { de: "Bildung", en: "Education" },
      { de: "Produktion", en: "Manufacturing" },
    ],
  },

  // ─── Services Section ─────────────────────────────────────────────────────────
  // Section tag, headline, subtext, three service cards.
  // Also: "Anfragen" link on each card and the visual showcase image labels.
  services: {
    tag: { de: "// Service Protocol", en: "// Service Protocol" },
    headline: { de: "Drei Dinge die ich baue", en: "Three things I build" },
    sub: {
      de: "Kein Baukasten, kein Template, kein Agentur-Overhead. Jedes Projekt wird individuell für Ihr Unternehmen entworfen, mit transparenten Preisspannen.",
      en: "No site builders, no templates, no agency overhead. Every project is individually designed for your business, with transparent price ranges.",
    },
    // "Anfragen" / "Inquire" link at the bottom of each service card
    inquire: { de: "Anfragen", en: "Inquire" },
    // Highlight badge on the featured card, and the info-tooltip button's a11y label
    popularBadge: { de: "Beliebt", en: "Popular" },
    moreInfo: { de: "Mehr Infos", en: "More info" },
    // Alt text and pill labels for the visual showcase image
    imageAlt: { de: "Website, KI & Software Visualisierung", en: "Website, AI & Software visualization" },
    imageLabels: [
      { de: "Website & SEO", en: "Website & SEO" },
      { de: "KI & Chatbot", en: "AI & Chatbot" },
      { de: "Custom Software", en: "Custom Software" },
    ],
    items: [
      {
        tag: { de: "SVC_01", en: "SVC_01" },
        title: { de: "Individuelle Websites", en: "Individual Websites" },
        desc: {
          de: "Keine Broschüre-Seiten, kein Baukasten. Ich entwerfe und baue Websites von Hand, mit eigenem Designkonzept, technischem SEO und Sichtbarkeit in KI-Suchen (GAIO) im Standardumfang.",
          en: "No brochure sites, no site builders. I design and hand-build websites, with an individual design concept, technical SEO and AI-search visibility (GAIO) as standard.",
        },
        features: [
          {
            de: "SEO & GAIO inklusive", en: "SEO & GAIO included",
            tooltip: {
              de: "GAIO (Generative AI Optimization) macht Ihre Website für KI-Systeme wie ChatGPT oder Perplexity auffindbar und zitierfähig: llms.txt, Schema.org, KI-Crawler-Zugang.",
              en: "GAIO (Generative AI Optimization) makes your website findable and citable for AI systems like ChatGPT or Perplexity: llms.txt, Schema.org, AI-crawler access.",
            },
          },
          {
            de: "Mobile-first Design", en: "Mobile-first design",
            tooltip: {
              de: "Ihre Website wird zuerst für Smartphones gebaut, denn dort surfen die meisten Nutzer. Auf Desktop läuft sie genauso sauber.",
              en: "Your website is built for smartphones first, since that's where most users browse. It works just as cleanly on desktop.",
            },
          },
          {
            de: "Lighthouse-Ziel 90+", en: "Lighthouse target 90+",
            tooltip: {
              de: "Lighthouse ist Googles Qualitätsmessung für Ladezeit, Barrierefreiheit, Best Practices und SEO. Jede Website verlässt das Studio mit einem Prüfprotokoll: messbar, nicht behauptet.",
              en: "Lighthouse is Google's quality measurement for speed, accessibility, best practices and SEO. Every website leaves the studio with a test protocol: measured, not claimed.",
            },
          },
          { de: "3–5 Wochen (Richtwert)", en: "3–5 weeks (guide value)" },
        ],
        metric: { de: "ab 1.500 € (Spanne, unverbindlich)", en: "from €1,500 (non-binding range)" },
        highlight: true,
      },
      {
        tag: { de: "SVC_02", en: "SVC_02" },
        title: { de: "DSGVO-native KI", en: "GDPR-native AI" },
        desc: {
          de: "KI-Chatbots und private Unternehmens-KI, vollständig self-hosted auf EU-Servern. Keine Datenweitergabe an OpenAI, Google oder andere Drittanbieter: bei uns keine Option, sondern der Standard.",
          en: "AI chatbots and private company AI, fully self-hosted on EU servers. No data passed to OpenAI, Google or other third parties: with us that's not an option, it's the standard.",
        },
        features: [
          {
            de: "Self-hosted auf EU-Servern", en: "Self-hosted on EU servers",
            tooltip: {
              de: "Ihr Chatbot läuft auf Ihrem Server in der EU: kein US-Cloud-Risiko, kein Auftragsverarbeitungsvertrag mit Drittanbietern nötig.",
              en: "Your chatbot runs on your server in the EU: no US-cloud risk, no data-processing agreement with third parties required.",
            },
          },
          { de: "Kuratierte Wissensbasis aus Ihrem Material", en: "Curated knowledge base from your material" },
          {
            de: "EU AI Act Art. 50 von Tag eins", en: "EU AI Act Art. 50 from day one",
            tooltip: {
              de: "KI-Kennzeichnung und Consent-Flow nach EU AI Act Art. 50, Pflicht ab August 2026 und bei HM von Anfang an Standard.",
              en: "AI disclosure and consent flow per EU AI Act Art. 50, mandatory from August 2026 and standard at HM from the start.",
            },
          },
          { de: "Lead-Weiterleitung & Einweisung", en: "Lead forwarding & onboarding" },
        ],
        metric: { de: "ab 1.500 € Setup (Spanne, unverbindlich)", en: "from €1,500 setup (non-binding range)" },
        highlight: false,
      },
      {
        tag: { de: "SVC_03", en: "SVC_03" },
        title: { de: "Software & SaaS", en: "Software & SaaS" },
        desc: {
          de: "Repetitive Arbeit in Software auslagern. Ich entwickle maßgeschneiderte Web-Apps mit KI-Automatisierung dort, wo sie Aufwand spart, und menschlicher Kontrolle dort, wo Entscheidungen fallen.",
          en: "Offload repetitive work into software. I develop custom web apps with AI automation where it saves effort, and human control where decisions are made.",
        },
        features: [
          { de: "KI mit Human-in-the-loop", en: "AI with human-in-the-loop" },
          {
            de: "Interne Prozess-Apps", en: "Internal process apps",
            tooltip: {
              de: "Software nur für Ihr Team, zum Beispiel für Bestellverwaltung, interne Abläufe oder alles, was bisher per Excel oder auf Papier erledigt wird.",
              en: "Software only your team uses, for example for order management, internal workflows, or anything currently done via Excel or paper.",
            },
          },
          {
            de: "Kundenfacing-SaaS", en: "Customer-facing SaaS",
            tooltip: {
              de: "Eine Web-App, die Ihre Kunden direkt nutzen, zum Beispiel ein Buchungsportal, ein Tracking-Tool oder ein Self-Service-Bereich für Bestellungen.",
              en: "A web app your customers use directly, for example a booking portal, tracking tool, or self-service area for orders.",
            },
          },
          {
            de: "API-Integrationen", en: "API integrations",
            tooltip: {
              de: "APIs sind digitale Verbindungen zwischen Programmen. Damit verbinden wir Ihre App mit Buchhaltungs-Software, Zahlungsanbietern oder Logistik-Tools.",
              en: "APIs are digital connectors between programs. They link your app to accounting software, payment providers, or logistics tools.",
            },
          },
        ],
        metric: { de: "ab 8.000 € (Spanne, unverbindlich)", en: "from €8,000 (non-binding range)" },
        highlight: false,
      },
    ],
  },

  // ─── Process Section ──────────────────────────────────────────────────────────
  // Section tag, headline, three numbered steps, and the bottom CTA button.
  process: {
    tag: { de: "// Build Protocol", en: "// Build Protocol" },
    headline: { de: "So läuft es ab: in Wochen, nicht Monaten", en: "How it works: in weeks, not months" },
    // Bottom CTA button that opens the project wizard
    projectCta: { de: "Jetzt Projekt anfragen →", en: "Start your project →" },
    steps: [
      {
        num: "01",
        title: { de: "Kostenlose Analyse", en: "Free analysis" },
        desc: {
          de: "Ich verstehe Ihr Unternehmen, Ihre Kunden und Ihre größten Wachstumshebel. Keine Verpflichtung, keine Agentur-Phrasen.",
          en: "I understand your business, your clients, and your biggest growth levers. No commitment, no agency jargon.",
        },
        duration: { de: "30 Min.", en: "30 min." },
      },
      {
        num: "02",
        title: { de: "Umsetzung", en: "Implementation" },
        desc: {
          de: "Design, Entwicklung und KI-Integration in einem agilen Prozess. Sie sehen Fortschritte, bevor ich fertig bin.",
          en: "Design, development, and AI integration in one agile process. You see progress before I'm done.",
        },
        duration: { de: "1–4 Wochen", en: "1–4 weeks" },
      },
      {
        num: "03",
        title: { de: "Launch & Wachstum", en: "Launch & growth" },
        desc: {
          de: "Go-live, Optimierung und messbare Ergebnisse. Ich tracke, was funktioniert, und verbessere kontinuierlich.",
          en: "Go-live, optimization, and measurable results. I track what works and continuously improve.",
        },
        duration: { de: "Kontinuierlich", en: "Ongoing" },
      },
    ],
  },

  // ─── Portfolio Section ────────────────────────────────────────────────────────
  // Section tag, headline, subtext, three case study cards.
  portfolio: {
    tag: { de: "// Lab Projects", en: "// Lab Projects" },
    headline: { de: "Aus dem eigenen Labor", en: "From our own lab" },
    sub: {
      de: "HM Labs ist ein junges Studio in der Referenzphase, Kunden-Case-Studies folgen. Bis dahin gilt: Diese Systeme haben wir für uns selbst gebaut, und sie laufen produktiv.",
      en: "HM Labs is a young studio in its reference phase, client case studies will follow. Until then: these systems were built for ourselves, and they run in production.",
    },
    items: [
      {
        caseId: "LAB_01",
        client: { de: "HM Labs (Eigenprojekt)", en: "HM Labs (own project)" },
        type: { de: "Web-App / Kundenportal", en: "Web app / client portal" },
        title: {
          de: "Kundenportal mit CRM und Projektstatus",
          en: "Client portal with CRM and project status",
        },
        desc: {
          de: "Eigenes Portal für Kunden und Leads: Projekte, Nachrichten, Dateien und Automatisierungen an einem Ort, dieselbe Architektur, die Kundenprojekte bekommen.",
          en: "Our own portal for clients and leads: projects, messages, files and automations in one place, the same architecture client projects get.",
        },
        tags: [
          { de: "Next.js", en: "Next.js" },
          { de: "Supabase", en: "Supabase" },
          { de: "Auth & Rollen", en: "Auth & roles" },
        ],
        metric: "",
        metricLabel: { de: "", en: "" },
        timeframe: { de: "", en: "" },
      },
      {
        caseId: "LAB_02",
        client: { de: "HM Labs (Eigenprojekt)", en: "HM Labs (own project)" },
        type: { de: "KI-Automatisierung", en: "AI automation" },
        title: {
          de: "Automations-Engine mit Human-in-the-loop",
          en: "Automation engine with human-in-the-loop",
        },
        desc: {
          de: "Interne Engine für wiederkehrende Abläufe: KI erledigt die Routine, Freigaben bleiben beim Menschen. Genau das Prinzip, das wir in Kundenprojekte einbauen.",
          en: "Internal engine for recurring workflows: AI handles the routine, approvals stay with a human. Exactly the principle we build into client projects.",
        },
        tags: [
          { de: "Claude API", en: "Claude API" },
          { de: "Workflows", en: "Workflows" },
          { de: "Human-in-the-loop", en: "Human-in-the-loop" },
        ],
        metric: "",
        metricLabel: { de: "", en: "" },
        timeframe: { de: "", en: "" },
      },
      {
        caseId: "LAB_03",
        client: { de: "hm-labs.de", en: "hm-labs.de" },
        type: { de: "Website in eigener Sache", en: "Our own website" },
        title: {
          de: "Diese Website: Exponat Nummer eins",
          en: "This website: exhibit number one",
        },
        desc: {
          de: "Individuell entworfen und von Hand gebaut, mit technischem SEO und GAIO: llms.txt, Schema.org und KI-Crawler-Zugang. Prüfen Sie es nach, die Belege sind verlinkt.",
          en: "Individually designed and hand-built, with technical SEO and GAIO: llms.txt, Schema.org and AI-crawler access. Verify it yourself, the evidence is linked.",
        },
        tags: [
          { de: "Next.js", en: "Next.js" },
          { de: "SEO + GAIO", en: "SEO + GAIO" },
          { de: "llms.txt", en: "llms.txt" },
        ],
        metric: "",
        metricLabel: { de: "", en: "" },
        timeframe: { de: "", en: "" },
      },
    ],
  },

  // ─── Testimonials Section ─────────────────────────────────────────────────────
  // Referenzphase: Die Sektion ist von der Startseite genommen, bis echte,
  // schriftlich freigegebene Kundenstimmen vorliegen (Referenzprogramm).
  // KEINE erfundenen Testimonials eintragen: Ehrlichkeits-Grundsatz.
  testimonials: {
    tag: { de: "// Client Stories", en: "// Client Stories" },
    headline: { de: "Was Kunden sagen", en: "What clients say" },
    items: [] as {
      quote: { de: string; en: string };
      name: string;
      role: { de: string; en: string };
      result: { de: string; en: string };
    }[],
  },

  // ─── CTA Section ─────────────────────────────────────────────────────────────
  // Mid-page call-to-action block with headline, sub, two action buttons.
  cta: {
    tag: { de: "// Get Started", en: "// Get Started" },
    headline: { de: "Klingt das nach dem, was Sie brauchen?", en: "Does this sound like what you need?" },
    sub: {
      de: "30 Minuten reichen aus, um herauszufinden, ob ich zu Ihnen passe. Kein Pitch, kein Druck.",
      en: "30 minutes is enough to find out if I'm the right fit for you. No pitch, no pressure.",
    },
    cta1: { de: "Jetzt unverbindlich beraten lassen", en: "Book a free call" },
    cta2: { de: EMAIL.CONTACT, en: EMAIL.CONTACT },
  },

  // ─── Lifecycle Section ────────────────────────────────────────────────────────
  // "6 Probleme jedes KMUs": interactive stage tabs with problem/solution cards.
  // stages[]: one entry per tab (0–5). Each has name, problemHeadline, problemDesc,
  // module, moduleDesc, metric. Visual properties (color, num) live in the component.
  // mockup: UI chrome strings used inside the animated mockup previews.
  lifecycle: {
    tag: { de: "// The Problem", en: "// The Problem" },
    headline: { de: "Jedes KMU kämpft mit denselben 6 Problemen", en: "Every SMB struggles with the same 6 problems" },
    sub: {
      de: "Ich kenne jedes davon und baue für jedes die passende Lösung.",
      en: "I know each one and build the right solution for each.",
    },
    cta: { de: "Modul anfragen", en: "Request module" },
    trust: [
      { de: "DSGVO-konform", en: "GDPR compliant" },
      { de: "EU-gehostet", en: "EU-hosted" },
      { de: "Transparente Preisspannen", en: "Transparent price ranges" },
      { de: "Der Code gehört Ihnen", en: "You own the code" },
    ],
    // UI chrome inside the content card
    mockup: {
      livePreview: { de: "Live-Vorschau", en: "Live preview" },
      yourModule: { de: "Ihr Modul", en: "Your module" },
      problem: { de: "Problem", en: "Problem" },
    },
    // The six stage entries match STAGE_META order in LifecycleSection.tsx
    stages: [
      {
        name: { de: "Sichtbarkeit", en: "Visibility" },
        problemHeadline: { de: "Sie werden nicht gefunden.", en: "You're not being found." },
        problemDesc: {
          de: "Konkurrenten ranken oben, Ihre Website wirkt veraltet, Interessenten springen ab, bevor sie anrufen.",
          en: "Competitors rank above you, your website looks outdated, prospects bounce before they call.",
        },
        module: { de: "Individuelle Website", en: "Individual Website" },
        moduleDesc: {
          de: "Individuell entworfene Website mit technischem SEO, GAIO (Sichtbarkeit in KI-Suchen), Mobile-first Design und Lighthouse-Ziel 90+.",
          en: "Individually designed website with technical SEO, GAIO (AI-search visibility), mobile-first design and Lighthouse target 90+.",
        },
        metric: { de: "SEO + GAIO inklusive", en: "SEO + GAIO included" },
      },
      {
        name: { de: "Erstanfrage", en: "First Inquiry" },
        problemHeadline: { de: "Besucher kommen und gehen gleich wieder.", en: "Visitors arrive and leave again right away." },
        problemDesc: {
          de: "Kein Chatbot, kein klares CTA. Interessenten gehen zur Konkurrenz, Sie erfahren es Tage später.",
          en: "No chatbot, no clear CTA. Prospects go to competitors, you find out days later.",
        },
        module: { de: "KI-Chatbot & Lead-System", en: "AI Chatbot & Lead System" },
        moduleDesc: {
          de: "24/7-Chatbot qualifiziert Anfragen, sammelt Kontaktdaten und bucht Termine, vollautomatisch.",
          en: "24/7 chatbot qualifies inquiries, collects contact data, and books appointments, fully automated.",
        },
        metric: { de: "24/7 Erreichbarkeit", en: "24/7 availability" },
      },
      {
        name: { de: "Kommunikation", en: "Communication" },
        problemHeadline: { de: "Mails stapeln sich, Anfragen gehen unter.", en: "Emails pile up, inquiries get lost." },
        problemDesc: {
          de: "Lange Antwortzeiten frustrieren Kunden. Das Team verbringt Stunden mit Copy-Paste statt echter Arbeit.",
          en: "Long response times frustrate clients. The team spends hours on copy-paste instead of real work.",
        },
        module: { de: "Kommunikations-Automatisierung", en: "Communication Automation" },
        moduleDesc: {
          de: "KI beantwortet Voranfragen, klassifiziert Kunden und bereitet Gesprächsgrundlagen vor, in Sekunden.",
          en: "AI answers initial inquiries, classifies clients, and prepares conversation foundations, in seconds.",
        },
        metric: { de: "Antwortzeit < 2 Min.", en: "Response time < 2 min." },
      },
      {
        name: { de: "Angebot & Abschluss", en: "Offer & Close" },
        problemHeadline: { de: "Angebote erstellen dauert Stunden.", en: "Creating quotes takes hours." },
        problemDesc: {
          de: "Jedes Mal von vorne: Preise recherchieren, formatieren, versenden. Fehler passieren, Aufträge gehen verloren.",
          en: "Start from scratch every time: research prices, format, send. Errors happen, orders get lost.",
        },
        module: { de: "KI-Angebotsgenerator", en: "AI Quote Generator" },
        moduleDesc: {
          de: "Von der Kundenanfrage zum fertigen Angebot in unter 2 Minuten, mit Ihren Preisen und Ihrem Layout.",
          en: "From customer inquiry to finished quote in under 2 minutes, with your prices and your layout.",
        },
        metric: { de: "30 Min → 2 Min", en: "30 min → 2 min" },
      },
      {
        name: { de: "Lieferung", en: "Delivery" },
        problemHeadline: { de: "Kunden fragen ständig nach dem Status.", en: "Clients constantly ask about status." },
        problemDesc: {
          de: "Projekt-Tracking per Excel und E-Mail. Das Team verliert den Überblick, Kunden werden ungeduldig.",
          en: "Project tracking via Excel and email. The team loses overview, clients get impatient.",
        },
        module: { de: "Kunden-Portal & Projekt-App", en: "Client Portal & Project App" },
        moduleDesc: {
          de: "Maßgeschneiderte Web-App: Kunden sehen Echtzeit-Status, das Team koordiniert alles an einem Ort.",
          en: "Custom web app: clients see real-time status, the team coordinates everything in one place.",
        },
        metric: { de: "Keine Status-Mails mehr", en: "No more status emails" },
      },
      {
        name: { de: "Wiederkehr", en: "Recurrence" },
        problemHeadline: { de: "Einmal-Kunden, die nie wiederkommen.", en: "One-time clients who never return." },
        problemDesc: {
          de: "Kein Follow-up-System, keine Kundenpflege. Teure Neukundenakquise statt günstiger Wiederholungsaufträge.",
          en: "No follow-up system, no client retention. Expensive new client acquisition instead of cheap repeat orders.",
        },
        module: { de: "Wiederkehr-Automatisierung", en: "Recurrence Automation" },
        moduleDesc: {
          de: "Automatische Follow-up-Sequenzen, Kundenpflege und Upsell-Kampagnen: Ihr stilles Verkaufsteam.",
          en: "Automatic follow-up sequences, client retention, and upsell campaigns: your silent sales team.",
        },
        metric: { de: "Mehr Folgeaufträge", en: "More repeat orders" },
      },
    ],
  },

  // ─── Tech Stack Section ───────────────────────────────────────────────────────
  // Section tag, headline, subtext, six technology category groups.
  techStack: {
    tag: { de: "// The Stack", en: "// The Stack" },
    headline: { de: "Gebaut mit den besten Tools", en: "Built with the best tools" },
    sub: {
      de: "Nur moderne, battle-tested Technologien, für maximale Performance, Sicherheit und Skalierbarkeit.",
      en: "Only modern, battle-tested technologies, for maximum performance, security, and scalability.",
    },
    categories: [
      {
        name: { de: "Frontend & Web", en: "Frontend & Web" },
        tools: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
      },
      {
        name: { de: "Backend & Daten", en: "Backend & Data" },
        tools: ["Supabase", "PostgreSQL", "pgvector", "Drizzle ORM", "Stripe", "Resend", "Nodemailer"],
      },
      {
        name: { de: "KI & Agenten", en: "AI & Agents" },
        tools: ["Claude API", "Vercel AI SDK", "LangGraph", "OpenAI Embeddings", "RAG / pgvector"],
      },
      {
        name: { de: "Automatisierung", en: "Automation" },
        tools: ["n8n", "Trigger.dev", "GitHub Actions", "Claude Agent SDK"],
      },
      {
        name: { de: "Infrastruktur", en: "Infrastructure" },
        tools: ["Vercel", "Hetzner VPS", "Cloudflare", "Docker", "Coolify"],
      },
      {
        name: { de: "Analytics & CMS", en: "Analytics & CMS" },
        tools: ["Posthog", "Plausible", "Sanity.io", "Google Analytics 4", "Google Ads", "Meta Pixel", "LinkedIn Insight Tag"],
      },
    ],
  },

  // ─── About Section ────────────────────────────────────────────────────────────
  // Section tag, headline, main sub paragraph, author card texts, quick stats.
  // subtitle/available/bioCard are used in the portrait card inside the section.
  about: {
    tag: { de: "// About Henry", en: "// About Henry" },
    headline: { de: "Kein Agentur-Overhead, direkt mit dem Entwickler", en: "No agency overhead, directly with the developer" },
    sub: {
      de: "Ich bin Henry. Ich baue Websites und KI-Tools für KMUs, ohne Zwischenhändler und ohne versteckte Kosten. Sie sprechen direkt mit mir, von der ersten Idee bis zum Go-live.",
      en: "I'm Henry. I build websites and AI tools for SMBs, no middlemen and no hidden costs. You talk directly to me, from first idea to go-live.",
    },
    // Author card inside the section
    subtitle: { de: "Entwickler · KI-Experte · Unternehmer", en: "Developer · AI Expert · Entrepreneur" },
    available: { de: "Verfügbar für neue Projekte", en: "Available for new projects" },
    bioCard: {
      de: "Ich kombiniere technische Expertise mit unternehmerischem Denken und baue Lösungen, die wirklich funktionieren, nicht nur gut aussehen.",
      en: "I combine technical expertise with entrepreneurial thinking and build solutions that actually work, not just look good.",
    },
    // Quick stat grid (4 boxes): nur belegbare Aussagen (keine erfundenen Metriken)
    stats: [
      { val: { de: "13",        en: "13" },        label: { de: "Leistungen im Portfolio", en: "Services in the portfolio" } },
      { val: { de: "2",         en: "2" },          label: { de: "Revisionsrunden inklusive", en: "Revision rounds included" } },
      { val: { de: "100%",      en: "100%" },       label: { de: "Direkte Kommunikation",  en: "Direct communication" } },
      { val: { de: "≤ 1 Werktag", en: "≤ 1 day" },  label: { de: "Antwortzeit (i. d. R.)",  en: "Response time (usually)" } },
    ],
    values: [
      {
        title: { de: "Sie sprechen direkt mit mir", en: "You talk directly to me" },
        desc: {
          de: "Kein Projektmanager dazwischen, kein Team, das Infos verdünnt. Was Sie sagen, kommt genau so bei mir an.",
          en: "No project manager in between, no team diluting information. What you say reaches me exactly as stated.",
        },
      },
      {
        title: { de: "Keine Templates", en: "No templates" },
        desc: {
          de: "Jede Lösung baue ich von Grund auf für Sie. Nicht Copy-Paste, nicht angepasst, sondern neu gedacht.",
          en: "Every solution I build from scratch for you. Not copy-paste, not adapted, but rethought.",
        },
      },
      {
        title: { de: "Transparente Preisspannen", en: "Transparent price ranges" },
        desc: {
          de: "Ehrliche Spannen statt Lockangebote, Zahlung in Meilensteinen, nie alles im Voraus. Und der Code gehört am Ende Ihnen.",
          en: "Honest ranges instead of bait offers, milestone payments, never everything upfront. And the code belongs to you in the end.",
        },
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "Claude API", "Supabase", "n8n", "Vercel", "Cloudflare"],
  },

  // ─── Contact Section ──────────────────────────────────────────────────────────
  // Section tag, headline, subtext, form field labels/placeholders, success message.
  // form.sending is shown while the API call is in-flight.
  contact: {
    tag: { de: "// Contact", en: "// Contact" },
    headline: { de: "Lassen Sie uns sprechen", en: "Let's talk" },
    sub: {
      de: "Schreiben Sie mir kurz, was Sie beschäftigt: Ich melde mich innerhalb von 24 Stunden mit einem konkreten nächsten Schritt.",
      en: "Send me a brief message about your situation: I'll get back to you within 24 hours with a concrete next step.",
    },
    form: {
      name: { de: "Name", en: "Name" },
      email: { de: "E-Mail", en: "Email" },
      company: { de: "Unternehmen (optional)", en: "Company (optional)" },
      message: { de: "Ihre Situation", en: "Your situation" },
      messagePlaceholder: {
        de: "Was ist Ihre größte Herausforderung gerade? Was möchten Sie erreichen?",
        en: "What is your biggest challenge right now? What do you want to achieve?",
      },
      submit: { de: "Nachricht senden", en: "Send message" },
      // Shown while the POST /api/contact request is in-flight
      sending: { de: "Wird gesendet...", en: "Sending..." },
      success: { de: "Danke! Ich melde mich bald.", en: "Thanks! I'll be in touch soon." },
    },
    info: {
      email: EMAIL.CONTACT,
      location: { de: "Deutschland", en: "Germany" },
      response: { de: "Antwort innerhalb 24h", en: "Response within 24h" },
    },
  },

  // ─── Footer ───────────────────────────────────────────────────────────────────
  footer: {
    copy: { de: "Alle Rechte vorbehalten.", en: "All rights reserved." },
    tagline: {
      de: "Websites & KI für den Mittelstand.",
      en: "Websites & AI for the mid-market.",
    },
    impressum: { de: "Impressum", en: "Imprint" },
    datenschutz: { de: "Datenschutz", en: "Privacy Policy" },
  },

  // ─── FAQ Section ─────────────────────────────────────────────────────────────
  // Section tag, headline, subtext, accordion Q&A items.
  faq: {
    tag: { de: "// FAQ", en: "// FAQ" },
    headline: { de: "Häufige Fragen", en: "Frequently Asked Questions" },
    sub: { de: "Alles, was Sie wissen müssen, bevor ich mich melde.", en: "Everything you need to know, before I get in touch." },
    items: [
      {
        q: { de: "Was kostet eine Website?", en: "How much does a website cost?" },
        a: {
          de: "Als Orientierung: Eine Landingpage liegt bei 1.500–3.000 €, eine individuelle Business-Website bei 3.500–7.500 €, eine größere Corporate-Website bei 7.500–15.000 €. Das ist eine unverbindliche Orientierung basierend auf vergleichbaren Projekten, kein Angebot. Ein konkretes, verbindliches Angebot erstelle ich erst nach einem persönlichen Gespräch, in dem die genauen Anforderungen geklärt werden. Im Angebot selbst steht dann ein fester Preis für den vereinbarten Umfang, der sich während der Umsetzung nicht mehr ändert.",
          en: "As orientation: a landing page is €1,500–3,000, an individual business website €3,500–7,500, a larger corporate website €7,500–15,000. This is a non-binding orientation based on comparable projects, not an offer. I only prepare a specific, binding quote after a personal conversation in which the exact requirements are clarified. The quote itself then states a fixed price for the agreed scope, and that price doesn't change during the project.",
        },
      },
      {
        q: { de: "Wie lange dauert ein Projekt?", en: "How long does a project take?" },
        a: {
          de: "Als Richtwert: Eine Landingpage dauert 1–2 Wochen, eine Business-Website 3–5 Wochen, ein KI-Chatbot 1–2 Wochen (parallel zur Website möglich), Web-Apps 4–10 Wochen. Zeitangaben sind Richtwerte, keine festen Zusagen.",
          en: "As guide values: a landing page takes 1–2 weeks, a business website 3–5 weeks, an AI chatbot 1–2 weeks (possible in parallel with the website), web apps 4–10 weeks. Time indications are guide values, not fixed commitments.",
        },
      },
      {
        q: { de: "Brauche ich technisches Vorwissen?", en: "Do I need technical knowledge?" },
        a: { de: "Nein. Ich erkläre alles verständlich, sodass Sie informierte Entscheidungen treffen können. Kein Fachjargon, keine versteckten Komplexitäten.", en: "No. I explain everything clearly so you can make informed decisions. No jargon, no hidden complexity." },
      },
      {
        q: { de: "Was passiert nach dem Launch?", en: "What happens after launch?" },
        a: { de: "Ich begleite Sie über den Launch hinaus: Hosting, Updates, Monitoring und Optimierungen. Sie werden nie allein gelassen.", en: "I support you beyond launch: hosting, updates, monitoring and optimizations. You'll never be left alone." },
      },
      {
        q: { de: "Kann ich meine bestehende Website behalten?", en: "Can I keep my existing website?" },
        a: { de: "Oft ist ein Neustart sinnvoller. Ich analysiere das gemeinsam mit Ihnen und empfehle, was wirklich besser ist, nicht was teurer ist.", en: "Often starting fresh makes more sense. I analyze this together with you and recommend what's actually better, not what's more expensive." },
      },
      {
        q: { de: "Bin ich nach dem Projekt an Sie gebunden?", en: "Am I locked in after the project?" },
        a: { de: "Nein. Der Code gehört am Ende vollständig Ihnen, keine Mindestlaufzeiten, keine Knebelverträge. Sie können jederzeit mit einem anderen Dienstleister weiterarbeiten.", en: "No. The code belongs entirely to you in the end, no minimum terms, no lock-in contracts. You can continue with another provider at any time." },
      },
      {
        q: { de: "Wie läuft die Zusammenarbeit ab?", en: "How does the collaboration work?" },
        a: { de: "Erstgespräch → Angebot → Umsetzung → Launch. Sie zahlen in Meilensteinen (nie alles im Voraus), zwei Revisionsrunden sind inklusive, und Sie sehen Fortschritte live, bevor alles fertig ist. Direkte Kommunikation, kein Ticket-System.", en: "Initial call → quote → build → launch. You pay in milestones (never everything upfront), two revision rounds are included, and you see live progress before everything is done. Direct communication, no ticket system." },
      },
      {
        q: { de: "Übernehmen Sie auch Marketing und SEO?", en: "Do you also handle marketing and SEO?" },
        a: { de: "SEO-Optimierung ist in jede Website eingebaut. Für laufendes Content-Marketing oder Ads empfehle ich spezialisierte Partner, ich konzentriere mich auf das, was ich am besten kann.", en: "SEO optimization is built into every website. For ongoing content marketing or ads I recommend specialized partners, I focus on what I do best." },
      },
    ],
  },

  // ─── Newsletter Section ───────────────────────────────────────────────────────
  newsletter: {
    tag: { de: "// Newsletter", en: "// Newsletter" },
    headline: { de: "KI für Ihr Business, jede Woche konkret", en: "AI for your business, every week" },
    sub: { de: "Cases, Tools und Prompts, direkt in Ihr Postfach. Kein Spam. Jederzeit abmelden.", en: "Cases, tools and prompts, straight to your inbox. No spam. Unsubscribe anytime." },
    placeholder: { de: "ihre@email.de", en: "your@email.com" },
    cta: { de: "Anmelden →", en: "Subscribe →" },
    note: { de: "DSGVO-konform · Jederzeit abmeldbar", en: "GDPR-compliant · Unsubscribe anytime" },
  },

  // ─── Readiness Check Section ──────────────────────────────────────────────────
  // Interactive 5-question quiz. questions/results come from the main data below.
  // features: the three bullet points shown on the left side panel.
  // intro*: the "start" card before the user begins the quiz.
  // restart / tryAgain: reset buttons shown during and after the quiz.
  readinessCheck: {
    tag: { de: "// Kostenloser Check", en: "// Free Check" },
    headline: { de: "Wie bereit ist Ihr Unternehmen für den Einsatz von KI?", en: "How ready is your business for using AI?" },
    sub: { de: "5 Fragen. 2 Minuten. Sofortiges Ergebnis.", en: "5 questions. 2 minutes. Instant result." },
    // Three benefit bullets on the left panel
    features: [
      { de: "Kostenlos & ohne Anmeldung",      en: "Free & no signup needed"         },
      { de: "Sofortiges, persönliches Ergebnis", en: "Instant, personalized result"  },
      { de: "Konkrete Handlungsempfehlungen",  en: "Concrete recommendations"        },
    ],
    // Intro card (before quiz starts)
    introLabel: { de: "5 FRAGEN · 2 MINUTEN", en: "5 QUESTIONS · 2 MINUTES" },
    introTitle: { de: "Bereit loszulegen?", en: "Ready to start?" },
    introDesc: {
      de: "Beantworten Sie 5 kurze Fragen und finden Sie heraus, wie gut Ihr Unternehmen für die KI-Ära aufgestellt ist.",
      en: "Answer 5 quick questions and find out how well your business is positioned for the AI era.",
    },
    startBtn:  { de: "Check starten",    en: "Start check"   },
    restart:   { de: "Neu starten",      en: "Restart"       },
    tryAgain:  { de: "Nochmal versuchen", en: "Try again"    },
    questions: [
      {
        q: { de: "Wie beantworten Sie Kundenanfragen heute?", en: "How do you handle customer inquiries today?" },
        options: [
          { label: { de: "Alles manuell per Telefon/E-Mail", en: "All manual via phone/email" }, score: 0 },
          { label: { de: "Teilweise mit Formularen oder Templates", en: "Partly with forms or templates" }, score: 1 },
          { label: { de: "Großteils automatisiert", en: "Mostly automated" }, score: 2 },
        ],
      },
      {
        q: { de: "Wie viel Zeit verbringt Ihr Team täglich mit Routineaufgaben?", en: "How much time does your team spend on routine tasks daily?" },
        options: [
          { label: { de: "Mehr als 3 Stunden", en: "More than 3 hours" }, score: 0 },
          { label: { de: "1–3 Stunden", en: "1–3 hours" }, score: 1 },
          { label: { de: "Weniger als 1 Stunde", en: "Less than 1 hour" }, score: 2 },
        ],
      },
      {
        q: { de: "Wie aktuell und mobiloptimiert ist Ihre Website?", en: "How current and mobile-optimized is your website?" },
        options: [
          { label: { de: "Veraltet oder keine Website", en: "Outdated or no website" }, score: 0 },
          { label: { de: "Vorhanden aber nicht optimal", en: "Exists but not optimal" }, score: 1 },
          { label: { de: "Modern, schnell und mobiloptimiert", en: "Modern, fast and mobile-optimized" }, score: 2 },
        ],
      },
      {
        q: { de: "Nutzen Sie KI-Tools in Ihrem Arbeitsalltag?", en: "Do you use AI tools in your daily work?" },
        options: [
          { label: { de: "Noch gar nicht", en: "Not yet" }, score: 0 },
          { label: { de: "Gelegentlich (ChatGPT etc.)", en: "Occasionally (ChatGPT etc.)" }, score: 1 },
          { label: { de: "Täglich und strukturiert", en: "Daily and structured" }, score: 2 },
        ],
      },
      {
        q: { de: "Wie hoch ist Ihr Aufwand für Verwaltung & Kommunikation pro Monat?", en: "How much time do you spend on admin & communication monthly?" },
        options: [
          { label: { de: "Mehr als 20 Stunden", en: "More than 20 hours" }, score: 0 },
          { label: { de: "10–20 Stunden", en: "10–20 hours" }, score: 1 },
          { label: { de: "Unter 10 Stunden", en: "Under 10 hours" }, score: 2 },
        ],
      },
    ],
    results: [
      {
        min: 0, max: 3,
        level: { de: "Starter", en: "Starter" },
        title: { de: "Sie lassen viel Potenzial liegen", en: "You're leaving a lot of potential on the table" },
        desc: { de: "Die gute Nachricht: Kleine Änderungen hätten sofort große Wirkung. Ich zeige Ihnen, wo Sie ansetzen sollten.", en: "The good news: small changes would have immediate big impact. I'll show you exactly where to start." },
        color: "#FF4D6A",
      },
      {
        min: 4, max: 7,
        level: { de: "Growing", en: "Growing" },
        title: { de: "Sie sind auf dem richtigen Weg", en: "You're on the right track" },
        desc: { de: "Sie haben erste Schritte gemacht. Mit gezielten KI-Integrationen können Sie jetzt deutlich schneller skalieren.", en: "You've already taken first steps. With targeted AI integrations you can now scale much faster." },
        color: "#F59E0B",
      },
      {
        min: 8, max: 10,
        level: { de: "Ready", en: "Ready" },
        title: { de: "Sie sind bereit für den nächsten Level", en: "You're ready for the next level" },
        desc: { de: "Ihre Basis ist stark. Jetzt geht es darum, KI strategisch einzusetzen und echte Wettbewerbsvorteile aufzubauen.", en: "Your foundation is strong. Now it's about strategically deploying AI and building real competitive advantages." },
        color: "#10B981",
      },
    ],
    ctaText: { de: "Kostenlos beraten lassen →", en: "Book a free call →" },
  },

  // ─── Scroll Reveal Text ───────────────────────────────────────────────────────
  // Large word-by-word scroll animation between hero and services.
  // Words wrapped in **double asterisks** are highlighted in primary color.
  scrollReveal: {
    text: {
      de: "Ich baue nicht nur schöne Websites. Ich baue **Systeme**, die neue **Kunden** anziehen, Anfragen **automatisch** bearbeiten und Ihren **Umsatz** steigern. Während Sie schlafen.",
      en: "I don't just build pretty websites. I build **systems** that attract new **clients**, handle inquiries **automatically**, and grow your **revenue**. While you sleep.",
    },
  },

  // ─── Project Wizard ───────────────────────────────────────────────────────────
  // Multi-step lead-qualification wizard (dynamic choice steps + optional sub-wizards
  // + contact form + success screen). Question/choice content lives in lib/wizard.ts
  // (MAIN_STEPS, CATEGORIES, CATEGORY_SUBWIZARD, SERVICE_SUBWIZARD); this section only
  // holds UI chrome strings (buttons, placeholders, error messages, etc.).
  wizard: {
    // UI chrome: buttons, placeholders, validation messages, success screen
    ui: {
      back:               { de: "Zurück",          en: "Back"          },
      almostDone:         { de: "Fast fertig",     en: "Almost done"   },
      contactHeadline:    { de: "Fast fertig, wie erreiche ich Sie?", en: "Almost done, how can I reach out to you?" },
      contactSub:         {
        de: "Ich melde mich innerhalb von 24 Stunden mit konkreten nächsten Schritten.",
        en: "I'll get back to you within 24 hours with concrete next steps.",
      },
      namePlaceholder:    { de: "Ihr Name *",              en: "Your name *"                   },
      emailPlaceholder:   { de: "E-Mail *",                en: "Email *"                       },
      companyPlaceholder: { de: "Unternehmen (optional)",  en: "Company (optional)"            },
      phonePlaceholder:   { de: "Telefon (optional)",      en: "Phone (optional)"              },
      continueBtn:        { de: "Weiter",                  en: "Continue"                      },
      skipQuestion:       { de: "Überspringen",             en: "Skip"                          },
      subIntroTitle:      { de: "Ein paar Details mehr?",   en: "A few more details?"           },
      subIntroSub:        {
        de: "Damit ich mich noch besser vorbereiten kann. Dauert etwa eine Minute, ist aber optional.",
        en: "So I can prepare even better. Takes about a minute, and it's optional.",
      },
      subIntroYes:        { de: "Ja, gerne",                en: "Yes, sure"                     },
      subIntroSkip:       { de: "Nein, direkt weiter",       en: "No, skip ahead"                },
      messagePlaceholder: {
        de: "Was ist Ihre größte Herausforderung gerade? (optional)",
        en: "What's your biggest challenge right now? (optional)",
      },
      submitBtn:    { de: "Jetzt kostenloses Gespräch anfragen", en: "Request free consultation"         },
      noSpam:       { de: "Kein Spam. Keine Verpflichtung. Antwort innerhalb 24h.", en: "No spam. No commitment. Response within 24h." },
      successTitle: { de: "Danke, ",           en: "Thanks, "          },
      successMsg:   {
        de: "Ihre Anfrage ist eingegangen. Ich melde mich innerhalb von 24 Stunden mit einem konkreten nächsten Schritt.",
        en: "Your inquiry has been received. I'll get back to you within 24 hours with a concrete next step.",
      },
      yourAnswers:       { de: "Ihre Angaben",              en: "Your answers"              },
      close:             { de: "Schließen",                 en: "Close"                     },
      validationName:    { de: "Bitte Name eingeben",       en: "Please enter your name"    },
      validationEmail:   { de: "Bitte gültige E-Mail eingeben", en: "Please enter a valid email" },
    },
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────
export function getText(obj: { de: string; en: string }, lang: Lang): string {
  return obj[lang];
}
