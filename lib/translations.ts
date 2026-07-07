import { EMAIL } from "@/lib/config/email";

export type Lang = "de" | "en";

// ─── Translation object ────────────────────────────────────────────────────────
// Single source of truth for all visible text on the site.
// Each leaf is { de: "...", en: "..." } — use getText(obj, lang) to resolve.
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
    line1: { de: "Mehr Kunden", en: "More Clients" },
    line2: { de: "Weniger Aufwand", en: "Less Effort" },
    line3: { de: "Durch KI die nie schläft", en: "Through AI That Never Sleeps" },
    sub: {
      de: "Kein Agentur-Overhead. Kein Stundensatz. Nur Ergebnisse — in 14 Tagen live.",
      en: "No agency overhead. No hourly rate. Just results — live in 14 days.",
    },
    cta1: { de: "Kostenlos beraten lassen", en: "Book free consultation" },
    cta2: { de: "Unsere Projekte ansehen", en: "View our work" },
    stat1val: { de: "10+", en: "10+" },
    stat1: { de: "Projekte umgesetzt", en: "Projects delivered" },
    stat2val: { de: "Ø +32%", en: "Ø +32%" },
    stat2: { de: "mehr Kundenanfragen", en: "more client inquiries" },
    stat3val: { de: "14 Tage", en: "14 days" },
    stat3: { de: "bis zum Go-live", en: "until go-live" },
    // Floating badge overlays (top-right decorative cards in hero)
    floating: {
      stat1Label: { de: "mehr Kundenanfragen", en: "more inquiries" },
      live: { de: "Projekt live", en: "Project live" },
      avgVal: { de: "14 Tage", en: "14 days" },
      avg: { de: "Ø bis zum Launch", en: "avg. to launch" },
    },
  },

  // ─── Trust Bar ───────────────────────────────────────────────────────────────
  // Scrolling marquee below hero — label + industry pills
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
      de: "Kein Template, kein Agentur-Overhead. Sie erhalten eine Lösung, die auf Ihr Unternehmen zugeschnitten ist.",
      en: "No templates, no agency overhead. You get a solution built specifically for your business.",
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
        title: { de: "High-Converting Websites", en: "High-Converting Websites" },
        desc: {
          de: "Keine Broschüre-Seiten. Ich baue Websites, die Besucher in Kunden verwandeln — mit KI-Chatbot, SEO-Optimierung und Ladezeiten unter 1 Sekunde.",
          en: "No brochure sites. I build websites that turn visitors into clients — with AI chatbot, SEO optimization, and load times under 1 second.",
        },
        features: [
          { de: "KI-Chatbot inkludiert", en: "AI chatbot included" },
          {
            de: "Mobile-first Design", en: "Mobile-first design",
            tooltip: {
              de: "Ihre Website wird zuerst für Smartphones gebaut — dort surfen 70% aller Nutzer. Auf Desktop läuft sie genauso sauber.",
              en: "Your website is built for smartphones first — where 70% of users browse. It works just as cleanly on desktop.",
            },
          },
          {
            de: "SEO & Core Web Vitals", en: "SEO & Core Web Vitals",
            tooltip: {
              de: "SEO sorgt dafür, dass Google Sie bei relevanten Suchen anzeigt. Core Web Vitals misst, wie schnell & stabil Ihre Seite lädt — beides beeinflusst Ihr Ranking direkt.",
              en: "SEO ensures Google shows you for relevant searches. Core Web Vitals measures page speed & stability — both directly affect your ranking.",
            },
          },
          { de: "Fertig in 14 Tagen", en: "Ready in 14 days" },
        ],
        metric: { de: "Ø +32% Anfragen", en: "Avg. +32% inquiries" },
        highlight: true,
      },
      {
        tag: { de: "SVC_02", en: "SVC_02" },
        title: { de: "KI-Integration", en: "AI Integration" },
        desc: {
          de: "KI in Ihre bestehenden Prozesse integrieren — Kundenkommunikation, Angebotserstellung, Terminbuchung und mehr. Automatisch, rund um die Uhr.",
          en: "Integrate AI into your existing processes — customer communication, quote generation, appointment booking and more. Automatic, 24/7.",
        },
        features: [
          { de: "Chatbots & Automatisierung", en: "Chatbots & automation" },
          {
            de: "E-Mail & CRM-Integration", en: "Email & CRM integration",
            tooltip: {
              de: "CRM = Ihre digitale Kundenverwaltung (z.B. HubSpot, Salesforce). Die KI verbindet sich damit und pflegt neue Kontakte & Anfragen automatisch ein.",
              en: "CRM = digital customer management (e.g. HubSpot, Salesforce). The AI connects to it and automatically logs new contacts & inquiries.",
            },
          },
          { de: "Angebots-Generierung", en: "Quote generation" },
          { de: "24/7 Kundenkontakt", en: "24/7 customer contact" },
        ],
        metric: { de: "Ø 3h/Tag gespart", en: "Avg. 3h/day saved" },
        highlight: false,
      },
      {
        tag: { de: "SVC_03", en: "SVC_03" },
        title: { de: "Software & SaaS", en: "Software & SaaS" },
        desc: {
          de: "Repetitive Arbeit in Software auslagern. Ich entwickle maßgeschneiderte Web-Apps, die genau das tun, was Ihr Unternehmen braucht — und mit Ihnen skalieren.",
          en: "Offload repetitive work into software. I develop custom web apps that do exactly what your business needs — and scale with you.",
        },
        features: [
          { de: "KI-gestützte Tools", en: "AI-powered tools" },
          {
            de: "Interne Prozess-Apps", en: "Internal process apps",
            tooltip: {
              de: "Software nur für Ihr Team — z.B. für Bestellverwaltung, interne Abläufe oder alles, was bisher per Excel oder auf Papier erledigt wird.",
              en: "Software only your team uses — e.g. for order management, internal workflows, or anything currently done via Excel or paper.",
            },
          },
          {
            de: "Kundenfacing-SaaS", en: "Customer-facing SaaS",
            tooltip: {
              de: "Eine Web-App, die Ihre Kunden direkt nutzen — z.B. ein Buchungsportal, ein Tracking-Tool oder ein Self-Service-Bereich für Bestellungen.",
              en: "A web app your customers use directly — e.g. a booking portal, tracking tool, or self-service area for orders.",
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
        metric: { de: "Auf Ihr Unternehmen zugeschnitten", en: "Tailored to your business" },
        highlight: false,
      },
    ],
  },

  // ─── Process Section ──────────────────────────────────────────────────────────
  // Section tag, headline, three numbered steps, and the bottom CTA button.
  process: {
    tag: { de: "// Build Protocol", en: "// Build Protocol" },
    headline: { de: "So läuft es ab — in Wochen, nicht Monaten", en: "How it works — in weeks, not months" },
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
          de: "Go-live, Optimierung und messbare Ergebnisse. Ich tracke, was funktioniert — und verbessere kontinuierlich.",
          en: "Go-live, optimization, and measurable results. I track what works — and continuously improve.",
        },
        duration: { de: "Kontinuierlich", en: "Ongoing" },
      },
    ],
  },

  // ─── Portfolio Section ────────────────────────────────────────────────────────
  // Section tag, headline, subtext, three case study cards.
  portfolio: {
    tag: { de: "// Selected Projects", en: "// Selected Projects" },
    headline: { de: "Ausgewählte Projekte", en: "Selected Projects" },
    sub: {
      de: "Echte Lösungen für echte Unternehmen — von Website bis KI-Automatisierung.",
      en: "Real solutions for real businesses — from website to AI automation.",
    },
    items: [
      {
        caseId: "CASE_01",
        client: { de: "Sanitär & Heizung GmbH", en: "Plumbing & Heating GmbH" },
        type: { de: "Website + KI-Chatbot", en: "Website + AI chatbot" },
        title: {
          de: "Mehr Anfragen durch KI-gestützte Website",
          en: "More inquiries through AI-powered website",
        },
        desc: {
          de: "Neue Website mit KI-Chatbot, der Anfragen qualifiziert und Termine bucht. Kein Sekretariat mehr nötig für Erstanfragen.",
          en: "New website with AI chatbot that qualifies inquiries and books appointments. No more receptionist needed for initial inquiries.",
        },
        tags: [
          { de: "Next.js", en: "Next.js" },
          { de: "KI-Chatbot", en: "AI Chatbot" },
          { de: "Google Ads", en: "Google Ads" },
        ],
        metric: "",
        metricLabel: { de: "", en: "" },
        timeframe: { de: "", en: "" },
      },
      {
        caseId: "CASE_02",
        client: { de: "Steuerberatungskanzlei", en: "Tax Advisory Firm" },
        type: { de: "KI-Integration", en: "AI integration" },
        title: {
          de: "Deutlich weniger Telefonaufwand durch KI",
          en: "Significantly less phone workload through AI",
        },
        desc: {
          de: "KI-System beantwortet Voranfragen, klassifiziert Mandanten und bereitet Erstgespräche vor. Das Team hat wieder Zeit für echte Arbeit.",
          en: "AI system answers initial inquiries, classifies clients, and prepares first meetings. The team has time for real work again.",
        },
        tags: [
          { de: "KI-Chatbot", en: "AI Chatbot" },
          { de: "CRM-Integration", en: "CRM Integration" },
          { de: "Automatisierung", en: "Automation" },
        ],
        metric: "",
        metricLabel: { de: "", en: "" },
        timeframe: { de: "", en: "" },
      },
      {
        caseId: "CASE_03",
        client: { de: "Logistik-Dienstleister", en: "Logistics Service Provider" },
        type: { de: "SaaS / Web-App", en: "SaaS / web app" },
        title: {
          de: "Angebotserstellung drastisch beschleunigt",
          en: "Quote generation dramatically accelerated",
        },
        desc: {
          de: "Maßgeschneidertes Tool, das Angebote aus Kundenanfragen automatisch generiert. Was früher eine halbe Stunde dauerte, geht jetzt in Minuten.",
          en: "Custom tool that automatically generates quotes from client requests. What used to take half an hour now takes minutes.",
        },
        tags: [
          { de: "Web-App", en: "Web App" },
          { de: "KI", en: "AI" },
          { de: "Automatisierung", en: "Automation" },
        ],
        metric: "",
        metricLabel: { de: "", en: "" },
        timeframe: { de: "", en: "" },
      },
    ],
  },

  // ─── Testimonials Section ─────────────────────────────────────────────────────
  // Section tag, headline, three client quote cards with result metrics.
  testimonials: {
    tag: { de: "// Client Stories", en: "// Client Stories" },
    headline: { de: "Was Kunden sagen", en: "What clients say" },
    items: [
      {
        quote: {
          de: "Seit der neuen Website kommen die Anfragen von selbst. Ich musste früher kalt akquirieren — das ist jetzt vorbei.",
          en: "Since the new website, inquiries come by themselves. I used to do cold outreach — that's over now.",
        },
        name: "Markus T.",
        role: { de: "Inhaber, Sanitär & Heizung", en: "Owner, Plumbing & Heating" },
        result: { de: "+667% Anfragen", en: "+667% inquiries" },
      },
      {
        quote: {
          de: "Henry hat nicht einfach eine Website gebaut, er hat verstanden wie unser Geschäft funktioniert. Das merkt man.",
          en: "Henry didn't just build a website, he understood how our business works. You can tell.",
        },
        name: "Dr. Sandra L.",
        role: { de: "Steuerberaterin", en: "Tax Advisor" },
        result: { de: "60% weniger Telefonaufwand", en: "60% less phone workload" },
      },
      {
        quote: {
          de: "Das Angebots-Tool hat unser ganzes Team entlastet. Jetzt erstellen wir in 2 Minuten, was früher 45 gedauert hat.",
          en: "The quote tool has relieved our whole team. Now we create in 2 minutes what used to take 45.",
        },
        name: "Stefan B.",
        role: { de: "Geschäftsführer, Logistik", en: "CEO, Logistics" },
        result: { de: "3h/Tag gespart", en: "3h/day saved" },
      },
    ],
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
  // "6 Probleme jedes KMUs" — interactive stage tabs with problem/solution cards.
  // stages[]: one entry per tab (0–5). Each has name, problemHeadline, problemDesc,
  // module, moduleDesc, metric. Visual properties (color, num) live in the component.
  // mockup: UI chrome strings used inside the animated mockup previews.
  lifecycle: {
    tag: { de: "// The Problem", en: "// The Problem" },
    headline: { de: "Jedes KMU kämpft mit denselben 6 Problemen", en: "Every SMB struggles with the same 6 problems" },
    sub: {
      de: "Ich kenne jedes davon — und baue für jedes die passende Lösung.",
      en: "I know each one — and build the right solution for each.",
    },
    cta: { de: "Modul anfragen", en: "Request module" },
    trust: [
      { de: "DSGVO-konform", en: "GDPR compliant" },
      { de: "EU-gehostet", en: "EU-hosted" },
      { de: "Festpreis", en: "Fixed price" },
      { de: "Keine Mindestlaufzeit", en: "No minimum term" },
    ],
    // UI chrome inside the content card
    mockup: {
      livePreview: { de: "Live-Vorschau", en: "Live preview" },
      yourModule: { de: "Ihr Modul", en: "Your module" },
      problem: { de: "Problem", en: "Problem" },
    },
    // The six stage entries — matches STAGE_META order in LifecycleSection.tsx
    stages: [
      {
        name: { de: "Sichtbarkeit", en: "Visibility" },
        problemHeadline: { de: "Sie werden nicht gefunden.", en: "You're not being found." },
        problemDesc: {
          de: "Konkurrenten ranken oben, Ihre Website wirkt veraltet — Interessenten springen ab, bevor sie anrufen.",
          en: "Competitors rank above you, your website looks outdated — prospects bounce before they call.",
        },
        module: { de: "High-Converting Website", en: "High-Converting Website" },
        moduleDesc: {
          de: "SEO-optimierte Website mit KI-Chatbot, Core Web Vitals <1s und Mobile-first Design. Live in 14 Tagen.",
          en: "SEO-optimized website with AI chatbot, Core Web Vitals <1s, and mobile-first design. Live in 14 days.",
        },
        metric: { de: "Live in 14 Tagen", en: "Live in 14 days" },
      },
      {
        name: { de: "Erstanfrage", en: "First Inquiry" },
        problemHeadline: { de: "Besucher kommen — und gehen.", en: "Visitors come — and leave." },
        problemDesc: {
          de: "Kein Chatbot, kein klares CTA. Interessenten gehen zur Konkurrenz, Sie erfahren es Tage später.",
          en: "No chatbot, no clear CTA. Prospects go to competitors, you find out days later.",
        },
        module: { de: "KI-Chatbot & Lead-System", en: "AI Chatbot & Lead System" },
        moduleDesc: {
          de: "24/7-Chatbot qualifiziert Anfragen, sammelt Kontaktdaten und bucht Termine — vollautomatisch.",
          en: "24/7 chatbot qualifies inquiries, collects contact data, and books appointments — fully automated.",
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
          de: "KI beantwortet Voranfragen, klassifiziert Kunden und bereitet Gesprächsgrundlagen vor — in Sekunden.",
          en: "AI answers initial inquiries, classifies clients, and prepares conversation foundations — in seconds.",
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
          de: "Von der Kundenanfrage zum fertigen Angebot in unter 2 Minuten — mit Ihren Preisen und Ihrem Layout.",
          en: "From customer inquiry to finished quote in under 2 minutes — with your prices and your layout.",
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
          de: "Automatische Follow-up-Sequenzen, Kundenpflege und Upsell-Kampagnen — Ihr stilles Verkaufsteam.",
          en: "Automatic follow-up sequences, client retention, and upsell campaigns — your silent sales team.",
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
      de: "Nur moderne, battle-tested Technologien — für maximale Performance, Sicherheit und Skalierbarkeit.",
      en: "Only modern, battle-tested technologies — for maximum performance, security, and scalability.",
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
    headline: { de: "Kein Agentur-Overhead — direkt mit dem Entwickler", en: "No agency overhead — directly with the developer" },
    sub: {
      de: "Ich bin Henry. Ich baue Websites und KI-Tools für KMUs — ohne Zwischenhändler, ohne versteckte Kosten. Sie sprechen direkt mit mir, von der ersten Idee bis zum Go-live.",
      en: "I'm Henry. I build websites and AI tools for SMBs — no middlemen, no hidden costs. You talk directly to me, from first idea to go-live.",
    },
    // Author card inside the section
    subtitle: { de: "Entwickler · KI-Experte · Unternehmer", en: "Developer · AI Expert · Entrepreneur" },
    available: { de: "Verfügbar für neue Projekte", en: "Available for new projects" },
    bioCard: {
      de: "Ich kombiniere technische Expertise mit unternehmerischem Denken — und baue Lösungen, die wirklich funktionieren, nicht nur gut aussehen.",
      en: "I combine technical expertise with entrepreneurial thinking — and build solutions that actually work, not just look good.",
    },
    // Quick stat grid (4 boxes)
    stats: [
      { val: { de: "10+",     en: "10+" },     label: { de: "Projekte",              en: "Projects"             } },
      { val: { de: "14 Tage", en: "14 days" }, label: { de: "Ø Launch-Zeit",         en: "Avg. launch time"     } },
      { val: { de: "100%",    en: "100%" },     label: { de: "Direkte Kommunikation", en: "Direct communication" } },
      { val: { de: "24h",     en: "24h" },      label: { de: "Antwortzeit",           en: "Response time"        } },
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
          de: "Jede Lösung baue ich von Grund auf für Sie. Nicht Copy-Paste, nicht angepasst — neu gedacht.",
          en: "Every solution I build from scratch for you. Not copy-paste, not adapted — rethought.",
        },
      },
      {
        title: { de: "Festpreis, kein Stundensatz", en: "Fixed price, no hourly rate" },
        desc: {
          de: "Sie wissen vorher, was es kostet. Kein Ticketsystem, keine bösen Überraschungen.",
          en: "You know the cost upfront. No ticket system, no nasty surprises.",
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
      de: "Schreiben Sie mir kurz, was Sie beschäftigt — ich melde mich innerhalb von 24 Stunden mit einem konkreten nächsten Schritt.",
      en: "Send me a brief message about your situation — I'll get back to you within 24 hours with a concrete next step.",
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
    sub: { de: "Alles, was Sie wissen müssen — bevor ich mich melde.", en: "Everything you need to know — before I get in touch." },
    items: [
      {
        q: { de: "Was kostet eine Website?", en: "How much does a website cost?" },
        a: { de: "Eine professionelle Website liegt je nach Umfang zwischen 2.500 und 8.000€ — als Festpreis, nicht Stundensatz. Sie wissen vor dem Start genau, was Sie zahlen.", en: "A professional website costs between €2,500 and €8,000 depending on scope — as a fixed price, not hourly. You know exactly what you pay before we start." },
      },
      {
        q: { de: "Wie lange dauert ein Projekt?", en: "How long does a project take?" },
        a: { de: "Eine Standard-Website ist in 14 Tagen live. Komplexere KI-Integrationen oder Web-Apps dauern 4–8 Wochen.", en: "A standard website goes live in 14 days. More complex AI integrations or web apps take 4–8 weeks." },
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
        a: { de: "Oft ist ein Neustart sinnvoller. Ich analysiere das gemeinsam mit Ihnen und empfehle, was wirklich besser ist — nicht was teurer ist.", en: "Often starting fresh makes more sense. I analyze this together with you and recommend what's actually better — not what's more expensive." },
      },
      {
        q: { de: "Bin ich nach dem Projekt an Sie gebunden?", en: "Am I locked in after the project?" },
        a: { de: "Nein. Keine Mindestlaufzeiten, keine Knebelverträge. Sie können jederzeit wechseln — aber die meisten Kunden bleiben, weil es funktioniert.", en: "No. No minimum terms, no lock-in contracts. You can switch at any time — but most clients stay because it works." },
      },
      {
        q: { de: "Wie läuft die Zusammenarbeit ab?", en: "How does the collaboration work?" },
        a: { de: "Erstgespräch → Angebot → Umsetzung in 2-Wochen-Sprints → Launch. Sie sehen Fortschritte live, bevor alles fertig ist. Direkte Kommunikation, kein Ticket-System.", en: "Initial call → quote → 2-week sprints → launch. You see live progress before everything is done. Direct communication, no ticket system." },
      },
      {
        q: { de: "Übernehmen Sie auch Marketing und SEO?", en: "Do you also handle marketing and SEO?" },
        a: { de: "SEO-Optimierung ist in jede Website eingebaut. Für laufendes Content-Marketing oder Ads empfehle ich spezialisierte Partner — ich konzentriere mich auf das was ich am besten kann.", en: "SEO optimization is built into every website. For ongoing content marketing or ads I recommend specialized partners — I focus on what I do best." },
      },
    ],
  },

  // ─── Newsletter Section ───────────────────────────────────────────────────────
  newsletter: {
    tag: { de: "// Newsletter", en: "// Newsletter" },
    headline: { de: "KI für Ihr Business — jede Woche konkret", en: "AI for your business — every week" },
    sub: { de: "Cases, Tools und Prompts — direkt in Ihr Postfach. Kein Spam. Jederzeit abmelden.", en: "Cases, tools and prompts — straight to your inbox. No spam. Unsubscribe anytime." },
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
    headline: { de: "Wie digital-ready ist Ihr Unternehmen?", en: "How digital-ready is your business?" },
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
      de: "Ich baue nicht nur schöne Websites. Ich baue **Systeme** — die neue **Kunden** anziehen, Anfragen **automatisch** bearbeiten und Ihren **Umsatz** steigern. Während Sie schlafen.",
      en: "I don't just build pretty websites. I build **systems** — that attract new **clients**, handle inquiries **automatically**, and grow your **revenue**. While you sleep.",
    },
  },

  // ─── Project Wizard ───────────────────────────────────────────────────────────
  // Multi-step modal wizard (4 choice steps + contact form + success screen).
  // steps[]: one entry per choice step (0–3). choices[] order matches the icon order
  //          defined in STEPS inside ProjectWizard.tsx.
  // answerLabels: short summary labels shown in the answer breadcrumb and success screen.
  // ui: all UI chrome strings (buttons, placeholders, error messages, etc.).
  wizard: {
    steps: [
      {
        question: { de: "Was suchen Sie?", en: "What are you looking for?" },
        sub: { de: "Wählen Sie, was am besten zu Ihrem Vorhaben passt.", en: "Choose what best fits your needs." },
        choices: [
          { de: "Neue Website, die Kunden bringt",     en: "A website that brings customers"   },
          { de: "KI-Chatbot & Automatisierung",        en: "AI chatbot & automation"           },
          { de: "Eigene Software / App",               en: "Custom software / app"             },
          { de: "Website + KI – das Komplettpaket",    en: "Website + AI – the full package"   },
        ],
      },
      {
        question: { de: "In welcher Branche sind Sie tätig?", en: "What industry are you in?" },
        choices: [
          { de: "Handwerk & lokale Dienste",            en: "Trades & local services"           },
          { de: "Beratung, Recht & Steuer",             en: "Consulting, legal & tax"           },
          { de: "Gesundheit, Handel & Gastronomie",     en: "Health, retail & hospitality"      },
          { de: "Immobilien, Bau & andere",             en: "Real estate, construction & other" },
        ],
      },
      {
        question: { de: "Was ist Ihr größtes Problem?", en: "What is your biggest problem?" },
        choices: [
          { de: "Zu wenig Anfragen & Sichtbarkeit",              en: "Too few inquiries & visibility"   },
          { de: "Meine Website ist veraltet / bringt nichts",    en: "My website is outdated / ineffective" },
          { de: "Zu viel manuelle Arbeit im Alltag",             en: "Too much repetitive manual work"  },
          { de: "Ich habe bereits eine konkrete Idee",           en: "I already have a concrete idea"   },
        ],
      },
      {
        question: { de: "Wie groß ist Ihr Unternehmen?", en: "How large is your company?" },
        sub: { de: "Damit ich das passende Angebot für Sie vorbereiten kann.", en: "So I can prepare the right proposal for you." },
        choices: [
          { de: "Nur ich (Freelancer / Gründer)", en: "Just me (freelancer / founder)" },
          { de: "2–10 Mitarbeiter",               en: "2–10 employees"                },
          { de: "11–50 Mitarbeiter",              en: "11–50 employees"               },
          { de: "50+ Mitarbeiter",                en: "50+ employees"                 },
        ],
      },
    ],
    // Short labels for the answer summary breadcrumb — keyed by choice id
    answerLabels: {
      website:           { de: "Neue Website",            en: "New website"              },
      ai:                { de: "KI & Automatisierung",    en: "AI & automation"          },
      software:          { de: "Eigene Software",         en: "Custom software"          },
      bundle:            { de: "Website + KI Paket",      en: "Website + AI bundle"      },
      trades:            { de: "Handwerk & Dienste",      en: "Trades & services"        },
      consulting:        { de: "Beratung, Recht & Steuer", en: "Consulting, legal & tax" },
      "health-retail":   { de: "Gesundheit / Handel",     en: "Health / retail"          },
      "realestate-other":{ de: "Immobilien & andere",     en: "Real estate & other"      },
      "no-visibility":   { de: "Zu wenig Sichtbarkeit",   en: "Too little visibility"    },
      "weak-website":    { de: "Schwache Website",        en: "Weak website"             },
      "manual-work":     { de: "Zu viel Handarbeit",      en: "Too much manual work"     },
      "clear-project":   { de: "Konkrete Idee vorhanden", en: "Concrete idea"            },
      solo:              { de: "Solo / Freelancer",        en: "Solo / freelancer"       },
      small:             { de: "2–10 Mitarbeiter",         en: "2–10 employees"          },
      medium:            { de: "11–50 Mitarbeiter",        en: "11–50 employees"         },
      large:             { de: "50+ Mitarbeiter",          en: "50+ employees"           },
    },
    // UI chrome: buttons, placeholders, validation messages, success screen
    ui: {
      back:               { de: "Zurück",          en: "Back"          },
      almostDone:         { de: "Fast fertig",     en: "Almost done"   },
      contactHeadline:    { de: "Fast fertig — wie erreiche ich Sie?", en: "Almost done — how can I reach out to you?" },
      contactSub:         {
        de: "Ich melde mich innerhalb von 24 Stunden mit konkreten nächsten Schritten.",
        en: "I'll get back to you within 24 hours with concrete next steps.",
      },
      namePlaceholder:    { de: "Ihr Name *",              en: "Your name *"                   },
      emailPlaceholder:   { de: "E-Mail *",                en: "Email *"                       },
      companyPlaceholder: { de: "Unternehmen (optional)",  en: "Company (optional)"            },
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
