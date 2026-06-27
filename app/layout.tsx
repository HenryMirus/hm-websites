import type { Metadata } from "next";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import TrackingScripts from "@/components/TrackingScripts";
import { ConsentProvider } from "@/lib/consent";

const SITE_URL = "https://hm-labs.de";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HM Labs — KI-Integration & Websites für KMU | Deutschland",
  description:
    "Mehr Kunden, weniger Aufwand — durch KI die nie schläft. Websites, KI-Chatbots und Automatisierungen für KMU. Festpreis. Fertig in 14 Tagen. DSGVO-konform.",
  keywords: [
    "KI Integration KMU",
    "KI Chatbot",
    "Website KMU",
    "Automatisierung Mittelstand",
    "KI Agentur Deutschland",
    "Next.js Agentur",
    "KI Beratung",
    "Web App Entwicklung",
  ],
  alternates: {
    canonical: SITE_URL,
    languages: {
      "de-DE": SITE_URL,
      "en-US": `${SITE_URL}?lang=en`,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "HM Labs — Mehr Kunden durch KI, die nie schläft",
    description:
      "Websites, KI-Chatbots & Automatisierungen für KMU. Kein Agentur-Overhead. Festpreis. Fertig in 14 Tagen.",
    siteName: "HM Labs",
    images: [
      {
        url: "/hm-labs-logo-v3.png",
        width: 512,
        height: 512,
        alt: "HM Labs — KI & Software für KMU",
      },
    ],
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "HM Labs — Mehr Kunden durch KI, die nie schläft",
    description:
      "Websites, KI-Chatbots & Automatisierungen für KMU. Festpreis. 14 Tage bis zum Go-live.",
    images: ["/hm-labs-logo-v3.png"],
    creator: "@hmlabs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  icons: {
    icon: "/hm-labs-logo-v3.png",
    apple: "/hm-labs-logo-v3.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "HM Labs",
      url: SITE_URL,
      email: "mrs.hnry@gmail.com",
      description:
        "KI-Integration, Websites und Softwareentwicklung für KMU in Deutschland. Festpreis, DSGVO-konform, fertig in 14 Tagen.",
      areaServed: {
        "@type": "Country",
        name: "Germany",
      },
      serviceType: [
        "Webentwicklung",
        "KI-Integration",
        "Chatbot-Entwicklung",
        "Prozessautomatisierung",
        "SaaS-Entwicklung",
      ],
      priceRange: "€€",
      knowsAbout: [
        "Künstliche Intelligenz",
        "Next.js",
        "React",
        "TypeScript",
        "Supabase",
        "Claude API",
        "n8n",
        "Webentwicklung",
        "KMU-Digitalisierung",
      ],
      founder: { "@id": `${SITE_URL}/#founder` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder`,
      name: "Henry Mirus",
      givenName: "Henry",
      familyName: "Mirus",
      alternateName: "Henry M.",
      jobTitle: "KI-Entwickler & Unternehmer",
      worksFor: { "@id": `${SITE_URL}/#business` },
      url: SITE_URL,
      email: "mrs.hnry@gmail.com",
      knowsAbout: [
        "Künstliche Intelligenz",
        "Webentwicklung",
        "KI-Integration",
        "KMU-Digitalisierung",
        "Next.js",
        "React",
        "TypeScript",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "HM Labs",
      publisher: { "@id": `${SITE_URL}/#business` },
      inLanguage: ["de-DE", "en-US"],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Was kostet eine Website?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Eine professionelle Website liegt je nach Umfang zwischen 2.500 und 8.000€ — als Festpreis, nicht Stundensatz. Du weißt vor dem Start genau, was du zahlst.",
          },
        },
        {
          "@type": "Question",
          name: "Wie lange dauert ein Projekt?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Eine Standard-Website ist in 14 Tagen live. Komplexere KI-Integrationen oder Web-Apps dauern 4–8 Wochen.",
          },
        },
        {
          "@type": "Question",
          name: "Brauche ich technisches Vorwissen?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nein. Ich erkläre alles verständlich und du triffst informierte Entscheidungen. Kein Fachjargon, keine versteckten Komplexitäten.",
          },
        },
        {
          "@type": "Question",
          name: "Was passiert nach dem Launch?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ich begleite dich über den Launch hinaus: Hosting, Updates, Monitoring und Optimierungen. Du wirst nie allein gelassen.",
          },
        },
        {
          "@type": "Question",
          name: "Bin ich nach dem Projekt an dich gebunden?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nein. Keine Mindestlaufzeiten, keine Knebelverträge. Du kannst jederzeit wechseln — aber die meisten Kunden bleiben, weil's funktioniert.",
          },
        },
        {
          "@type": "Question",
          name: "Übernimmst du auch Marketing und SEO?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SEO-Optimierung ist in jede Website eingebaut. Für laufendes Content-Marketing oder Ads empfehle ich spezialisierte Partner — ich konzentriere mich auf das was ich am besten kann.",
          },
        },
        {
          "@type": "Question",
          name: "Kann ich meine bestehende Website behalten?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oft ist ein Neustart sinnvoller. Ich analysiere das gemeinsam mit dir und empfehle, was wirklich besser ist — nicht was teurer ist.",
          },
        },
        {
          "@type": "Question",
          name: "Wie läuft die Zusammenarbeit ab?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Erstgespräch → Angebot → Umsetzung in 2-Wochen-Sprints → Launch. Du siehst Fortschritte live, bevor alles fertig ist. Direkte Kommunikation, kein Ticket-System.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ConsentProvider>
          {children}
          <CookieBanner />
          <TrackingScripts />
        </ConsentProvider>
      </body>
    </html>
  );
}
