export type Lang = "de" | "en";

export const t = {
  nav: {
    services: { de: "Leistungen", en: "Services" },
    process: { de: "Ablauf", en: "Process" },
    portfolio: { de: "Projekte", en: "Projects" },
    about: { de: "Über uns", en: "About" },
    contact: { de: "Kontakt", en: "Contact" },
    cta: { de: "Kostenlos beraten", en: "Free consultation" },
  },
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
  },
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
  services: {
    tag: { de: "// Service Protocol", en: "// Service Protocol" },
    headline: { de: "Drei Dinge die ich baue", en: "Three things I build" },
    sub: {
      de: "Kein Template, kein Agentur-Overhead. Du bekommst eine Lösung die auf dein Unternehmen zugeschnitten ist.",
      en: "No templates, no agency overhead. You get a solution built specifically for your business.",
    },
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
          { de: "Mobile-first Design", en: "Mobile-first design" },
          { de: "SEO & Core Web Vitals", en: "SEO & Core Web Vitals" },
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
          { de: "E-Mail & CRM-Integration", en: "Email & CRM integration" },
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
          de: "Repetitive Arbeit in Software auslagern. Ich entwickle maßgeschneiderte Web-Apps, die genau das tun, was dein Unternehmen braucht — und mit dir skalieren.",
          en: "Offload repetitive work into software. I develop custom web apps that do exactly what your business needs — and scale with you.",
        },
        features: [
          { de: "KI-gestützte Tools", en: "AI-powered tools" },
          { de: "Interne Prozess-Apps", en: "Internal process apps" },
          { de: "Kundenfacing-SaaS", en: "Customer-facing SaaS" },
          { de: "API-Integrationen", en: "API integrations" },
        ],
        metric: { de: "Auf Ihr Unternehmen zugeschnitten", en: "Tailored to your business" },
        highlight: false,
      },
    ],
  },
  process: {
    tag: { de: "// Build Protocol", en: "// Build Protocol" },
    headline: { de: "So läuft's ab — in Wochen, nicht Monaten", en: "How it works — in weeks, not months" },
    steps: [
      {
        num: "01",
        title: { de: "Kostenlose Analyse", en: "Free analysis" },
        desc: {
          de: "Ich verstehe dein Unternehmen, deine Kunden und deine größten Wachstumshebel. Keine Verpflichtung, keine Agentur-Phrasen.",
          en: "I understand your business, your clients, and your biggest growth levers. No commitment, no agency jargon.",
        },
        duration: { de: "30 Min.", en: "30 min." },
      },
      {
        num: "02",
        title: { de: "Umsetzung", en: "Implementation" },
        desc: {
          de: "Design, Entwicklung und KI-Integration in einem agilen Prozess. Du siehst Fortschritte, bevor ich fertig bin.",
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
        tags: ["Next.js", "KI-Chatbot", "Google Ads"],
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
        tags: ["KI-Chatbot", "CRM-Integration", "Automatisierung"],
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
        tags: ["Web-App", "KI", "Automatisierung"],
        metric: "",
        metricLabel: { de: "", en: "" },
        timeframe: { de: "", en: "" },
      },
    ],
  },
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
  cta: {
    tag: { de: "// Get Started", en: "// Get Started" },
    headline: { de: "Klingt das nach dem was du brauchst?", en: "Does this sound like what you need?" },
    sub: {
      de: "30 Minuten reichen um herauszufinden ob ich zu dir passe. Kein Pitch, kein Druck.",
      en: "30 minutes is enough to find out if I'm the right fit for you. No pitch, no pressure.",
    },
    cta1: { de: "Jetzt unverbindlich beraten lassen", en: "Book a free call" },
    cta2: { de: "hello@hm-ai.de", en: "hello@hm-ai.de" },
  },
  lifecycle: {
    tag: { de: "// The Problem", en: "// The Problem" },
    headline: { de: "Jedes KMU kämpft mit denselben 6 Problemen", en: "Every SMB struggles with the same 6 problems" },
    sub: {
      de: "Ich kenne jeden davon — und habe für jeden die passende Lösung gebaut.",
      en: "I know each one — and have built the right solution for each.",
    },
    cta: { de: "Modul anfragen", en: "Request module" },
    trust: [
      { de: "DSGVO-konform", en: "GDPR compliant" },
      { de: "EU-gehostet", en: "EU-hosted" },
      { de: "Festpreis", en: "Fixed price" },
      { de: "Keine Mindestlaufzeit", en: "No minimum term" },
    ],
  },
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
        tools: ["Supabase", "PostgreSQL", "pgvector", "Drizzle ORM", "Stripe", "Resend"],
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
        tools: ["Posthog", "Plausible", "Sanity.io", "Google Tag Manager"],
      },
    ],
  },
  about: {
    tag: { de: "// About Henry", en: "// About Henry" },
    headline: { de: "Kein Agentur-Overhead — direkt mit dem Entwickler", en: "No agency overhead — directly with the developer" },
    sub: {
      de: "Ich bin Henry. Ich baue Websites und KI-Tools für KMUs — ohne Zwischenhändler, ohne versteckte Kosten. Du redest direkt mit mir, von der ersten Idee bis zum Go-live.",
      en: "I'm Henry. I build websites and AI tools for SMBs — no middlemen, no hidden costs. You talk directly to me, from first idea to go-live.",
    },
    values: [
      {
        title: { de: "Du redest direkt mit mir", en: "You talk directly to me" },
        desc: {
          de: "Kein Projektmanager dazwischen, kein Team das Infos verdünnt. Was du sagst, kommt genau so bei mir an.",
          en: "No project manager in between, no team diluting information. What you say reaches me exactly as stated.",
        },
      },
      {
        title: { de: "Keine Templates", en: "No templates" },
        desc: {
          de: "Jede Lösung bau ich von Grund auf für dich. Nicht Copy-Paste, nicht angepasst — neu gedacht.",
          en: "Every solution I build from scratch for you. Not copy-paste, not adapted — rethought.",
        },
      },
      {
        title: { de: "Festpreis, kein Stundensatz", en: "Fixed price, no hourly rate" },
        desc: {
          de: "Du weißt vorher was es kostet. Kein Ticketsystem, keine bösen Überraschungen.",
          en: "You know the cost upfront. No ticket system, no nasty surprises.",
        },
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "Claude API", "Supabase", "n8n", "Vercel", "Cloudflare"],
  },
  contact: {
    tag: { de: "// Contact", en: "// Contact" },
    headline: { de: "Lass uns reden", en: "Let's talk" },
    sub: {
      de: "Schreib mir kurz was dich beschäftigt — ich melde mich innerhalb von 24 Stunden mit einem konkreten nächsten Schritt.",
      en: "Drop me a quick message about what's on your mind — I'll get back to you within 24 hours with a concrete next step.",
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
      success: { de: "Danke! Ich melde mich bald.", en: "Thanks! I'll be in touch soon." },
    },
    info: {
      email: "hello@hm-ai.de",
      location: { de: "Deutschland", en: "Germany" },
      response: { de: "Antwort innerhalb 24h", en: "Response within 24h" },
    },
  },
  footer: {
    copy: { de: "Alle Rechte vorbehalten.", en: "All rights reserved." },
    tagline: {
      de: "Websites & KI für den Mittelstand.",
      en: "Websites & AI for the mid-market.",
    },
  },
  faq: {
    tag: { de: "// FAQ", en: "// FAQ" },
    headline: { de: "Häufige Fragen", en: "Frequently Asked Questions" },
    sub: { de: "Alles, was du wissen musst — bevor ich mich melde.", en: "Everything you need to know — before I get in touch." },
    items: [
      {
        q: { de: "Was kostet eine Website?", en: "How much does a website cost?" },
        a: { de: "Eine professionelle Website liegt je nach Umfang zwischen 2.500 und 8.000€ — als Festpreis, nicht Stundensatz. Du weißt vor dem Start genau, was du zahlst.", en: "A professional website costs between €2,500 and €8,000 depending on scope — as a fixed price, not hourly. You know exactly what you pay before we start." },
      },
      {
        q: { de: "Wie lange dauert ein Projekt?", en: "How long does a project take?" },
        a: { de: "Eine Standard-Website ist in 14 Tagen live. Komplexere KI-Integrationen oder Web-Apps dauern 4–8 Wochen.", en: "A standard website goes live in 14 days. More complex AI integrations or web apps take 4–8 weeks." },
      },
      {
        q: { de: "Brauche ich technisches Vorwissen?", en: "Do I need technical knowledge?" },
        a: { de: "Nein. Ich erkläre alles verständlich und du triffst informierte Entscheidungen. Kein Fachjargon, keine versteckten Komplexitäten.", en: "No. I explain everything clearly so you can make informed decisions. No jargon, no hidden complexity." },
      },
      {
        q: { de: "Was passiert nach dem Launch?", en: "What happens after launch?" },
        a: { de: "Ich begleite dich über den Launch hinaus: Hosting, Updates, Monitoring und Optimierungen. Du wirst nie allein gelassen.", en: "I support you beyond launch: hosting, updates, monitoring and optimizations. You'll never be left alone." },
      },
      {
        q: { de: "Kann ich meine bestehende Website behalten?", en: "Can I keep my existing website?" },
        a: { de: "Oft ist ein Neustart sinnvoller. Ich analysiere das gemeinsam mit dir und empfehle, was wirklich besser ist — nicht was teurer ist.", en: "Often starting fresh makes more sense. I analyze this together with you and recommend what's actually better — not what's more expensive." },
      },
      {
        q: { de: "Bin ich nach dem Projekt an dich gebunden?", en: "Am I locked in after the project?" },
        a: { de: "Nein. Keine Mindestlaufzeiten, keine Knebelverträge. Du kannst jederzeit wechseln — aber die meisten Kunden bleiben, weil's funktioniert.", en: "No. No minimum terms, no lock-in contracts. You can switch at any time — but most clients stay because it works." },
      },
      {
        q: { de: "Wie läuft die Zusammenarbeit ab?", en: "How does the collaboration work?" },
        a: { de: "Erstgespräch → Angebot → Umsetzung in 2-Wochen-Sprints → Launch. Du siehst Fortschritte live, bevor alles fertig ist. Direkte Kommunikation, kein Ticket-System.", en: "Initial call → quote → 2-week sprints → launch. You see live progress before everything is done. Direct communication, no ticket system." },
      },
      {
        q: { de: "Übernimmst du auch Marketing und SEO?", en: "Do you also handle marketing and SEO?" },
        a: { de: "SEO-Optimierung ist in jede Website eingebaut. Für laufendes Content-Marketing oder Ads empfehle ich spezialisierte Partner — ich konzentriere mich auf das was ich am besten kann.", en: "SEO optimization is built into every website. For ongoing content marketing or ads I recommend specialized partners — I focus on what I do best." },
      },
    ],
  },
  newsletter: {
    tag: { de: "// Newsletter", en: "// Newsletter" },
    headline: { de: "KI für dein Business — jede Woche konkret", en: "AI for your business — every week" },
    sub: { de: "Cases, Tools und Prompts — direkt in dein Postfach. Kein Spam. Jederzeit abmelden.", en: "Cases, tools and prompts — straight to your inbox. No spam. Unsubscribe anytime." },
    placeholder: { de: "deine@email.de", en: "your@email.com" },
    cta: { de: "Anmelden →", en: "Subscribe →" },
    note: { de: "DSGVO-konform · Jederzeit abmeldbar", en: "GDPR-compliant · Unsubscribe anytime" },
  },
  readinessCheck: {
    tag: { de: "// Kostenloser Check", en: "// Free Check" },
    headline: { de: "Wie digital-ready ist dein Unternehmen?", en: "How digital-ready is your business?" },
    sub: { de: "5 Fragen. 2 Minuten. Sofortiges Ergebnis.", en: "5 questions. 2 minutes. Instant result." },
    questions: [
      {
        q: { de: "Wie beantwortest du Kundenanfragen heute?", en: "How do you handle customer inquiries today?" },
        options: [
          { label: { de: "Alles manuell per Telefon/E-Mail", en: "All manual via phone/email" }, score: 0 },
          { label: { de: "Teilweise mit Formularen oder Templates", en: "Partly with forms or templates" }, score: 1 },
          { label: { de: "Großteils automatisiert", en: "Mostly automated" }, score: 2 },
        ],
      },
      {
        q: { de: "Wie viel Zeit verbringt dein Team täglich mit Routineaufgaben?", en: "How much time does your team spend on routine tasks daily?" },
        options: [
          { label: { de: "Mehr als 3 Stunden", en: "More than 3 hours" }, score: 0 },
          { label: { de: "1–3 Stunden", en: "1–3 hours" }, score: 1 },
          { label: { de: "Weniger als 1 Stunde", en: "Less than 1 hour" }, score: 2 },
        ],
      },
      {
        q: { de: "Wie aktuell und mobiloptimiert ist deine Website?", en: "How current and mobile-optimized is your website?" },
        options: [
          { label: { de: "Veraltet oder keine Website", en: "Outdated or no website" }, score: 0 },
          { label: { de: "Vorhanden aber nicht optimal", en: "Exists but not optimal" }, score: 1 },
          { label: { de: "Modern, schnell und mobiloptimiert", en: "Modern, fast and mobile-optimized" }, score: 2 },
        ],
      },
      {
        q: { de: "Nutzt du KI-Tools in deinem Arbeitsalltag?", en: "Do you use AI tools in your daily work?" },
        options: [
          { label: { de: "Noch gar nicht", en: "Not yet" }, score: 0 },
          { label: { de: "Gelegentlich (ChatGPT etc.)", en: "Occasionally (ChatGPT etc.)" }, score: 1 },
          { label: { de: "Täglich und strukturiert", en: "Daily and structured" }, score: 2 },
        ],
      },
      {
        q: { de: "Wie hoch ist dein Aufwand für Verwaltung & Kommunikation pro Monat?", en: "How much time do you spend on admin & communication monthly?" },
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
        title: { de: "Du lässt viel Potenzial liegen", en: "You're leaving a lot of potential on the table" },
        desc: { de: "Die gute Nachricht: Kleine Änderungen hätten sofort große Wirkung. Ich zeige dir wo du ansetzen solltest.", en: "The good news: small changes would have immediate big impact. I'll show you exactly where to start." },
        color: "#FF4D6A",
      },
      {
        min: 4, max: 7,
        level: { de: "Growing", en: "Growing" },
        title: { de: "Du bist auf dem richtigen Weg", en: "You're on the right track" },
        desc: { de: "Du hast erste Schritte gemacht. Mit gezielten KI-Integrationen kannst du jetzt deutlich schneller skalieren.", en: "You've already taken first steps. With targeted AI integrations you can now scale much faster." },
        color: "#F59E0B",
      },
      {
        min: 8, max: 10,
        level: { de: "Ready", en: "Ready" },
        title: { de: "Du bist bereit für den nächsten Level", en: "You're ready for the next level" },
        desc: { de: "Deine Basis ist stark. Jetzt geht's darum, KI strategisch einzusetzen und echte Wettbewerbsvorteile aufzubauen.", en: "Your foundation is strong. Now it's about strategically deploying AI and building real competitive advantages." },
        color: "#10B981",
      },
    ],
    ctaText: { de: "Kostenlos beraten lassen →", en: "Book a free call →" },
  },
};

export function getText(obj: { de: string; en: string }, lang: Lang): string {
  return obj[lang];
}
