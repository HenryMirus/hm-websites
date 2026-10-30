import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import CookieBanner from "@/components/CookieBanner";
import TrackingScripts from "@/components/TrackingScripts";
import { ConsentProvider } from "@/lib/consent";
import { EMAIL } from "@/lib/config/email";

import { SITE_URL } from "@/lib/config/site";

// Schriften werden beim Build heruntergeladen und von hm-labs.tech selbst
// ausgeliefert: kein Aufruf von fonts.googleapis.com beim Besucher.
const fontDisplay = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display", display: "swap" });
const fontBody = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body", display: "swap" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HM Labs | KI-Integration & Websites für KMU in Deutschland",
  description:
    "Mehr Kunden, weniger Aufwand, durch KI, die nie schläft. Individuelle Websites, self-hosted KI-Chatbots und Automatisierungen für KMU. Transparente Preisspannen. DSGVO-konform.",
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
  // Kein hreflang: Englisch gibt es nur clientseitig unter derselben URL, ein
  // Sprachpaar ohne eigene, serverseitig englische URL ignoriert Google.
  // Unterseiten setzen ihre eigene Canonical.
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "HM Labs: Mehr Kunden durch KI, die nie schläft",
    description:
      "Individuelle Websites, self-hosted KI-Chatbots & Automatisierungen für KMU. Kein Agentur-Overhead, transparente Preisspannen.",
    siteName: "HM Labs",
    images: [
      {
        url: "/hm-labs-logo-v3.png",
        width: 1024,
        height: 1024,
        alt: "HM Labs: KI & Software für KMU",
      },
    ],
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "HM Labs: Mehr Kunden durch KI, die nie schläft",
    description:
      "Individuelle Websites, self-hosted KI-Chatbots & Automatisierungen für KMU. Transparente Preisspannen statt Lockangebote.",
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
  // Google zeigt in den Suchergebnissen nur Favicons mit Seitenlänge als
  // Vielfaches von 48 px; /favicon.ico ist der Fallback, den Crawler abfragen.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
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
      email: EMAIL.CONTACT,
      description:
        "Individuelle Websites, self-hosted KI-Chatbots und Softwareentwicklung für KMU in Deutschland. Transparente Preisspannen, DSGVO-konform, EU-gehostet.",
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
      email: EMAIL.CONTACT,
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
      // Deliberately German-only: language toggling is client-side state, but this
      // JSON-LD is rendered in the root layout (no access to searchParams), and
      // German is the canonical/primary market. Revisit if URL-based locale routing
      // (e.g. /en) is ever added.
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Was kostet eine Website?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Als Orientierung: Eine Landingpage liegt bei 1.500–3.000 €, eine individuelle Business-Website bei 3.500–7.500 €, eine größere Corporate-Website bei 7.500–15.000 €. Das ist eine unverbindliche Orientierung basierend auf vergleichbaren Projekten, kein Angebot. Ein konkretes, verbindliches Angebot erstelle ich erst nach einem persönlichen Gespräch, in dem die genauen Anforderungen geklärt werden. Im Angebot selbst steht dann ein fester Preis für den vereinbarten Umfang, der sich während der Umsetzung nicht mehr ändert.",
          },
        },
        {
          "@type": "Question",
          name: "Wie lange dauert ein Projekt?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Als Richtwert: Eine Landingpage dauert 1–2 Wochen, eine Business-Website 3–5 Wochen, ein KI-Chatbot 1–2 Wochen, Web-Apps 4–10 Wochen. Zeitangaben sind Richtwerte, keine festen Zusagen.",
          },
        },
        {
          "@type": "Question",
          name: "Brauche ich technisches Vorwissen?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nein. Ich erkläre alles verständlich, sodass Sie informierte Entscheidungen treffen können. Kein Fachjargon, keine versteckten Komplexitäten.",
          },
        },
        {
          "@type": "Question",
          name: "Was passiert nach dem Launch?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ich begleite Sie über den Launch hinaus: Hosting, Updates, Monitoring und Optimierungen. Sie werden nie allein gelassen.",
          },
        },
        {
          "@type": "Question",
          name: "Bin ich nach dem Projekt an Sie gebunden?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nein. Der Code gehört am Ende vollständig Ihnen, keine Mindestlaufzeiten, keine Knebelverträge. Sie können jederzeit mit einem anderen Dienstleister weiterarbeiten.",
          },
        },
        {
          "@type": "Question",
          name: "Übernehmen Sie auch Marketing und SEO?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SEO-Optimierung ist in jede Website eingebaut. Für laufendes Content-Marketing oder Ads empfehle ich spezialisierte Partner, ich konzentriere mich auf das, was ich am besten kann.",
          },
        },
        {
          "@type": "Question",
          name: "Kann ich meine bestehende Website behalten?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oft ist ein Neustart sinnvoller. Ich analysiere das gemeinsam mit Ihnen und empfehle, was wirklich besser ist, nicht was teurer ist.",
          },
        },
        {
          "@type": "Question",
          name: "Wie läuft die Zusammenarbeit ab?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Erstgespräch → Angebot → Umsetzung → Launch. Sie zahlen in Meilensteinen (nie alles im Voraus), zwei Revisionsrunden sind inklusive, und Sie sehen Fortschritte live, bevor alles fertig ist.",
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
    <html lang="de" className={`scroll-smooth ${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-dark focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Zum Inhalt springen
        </a>
        <ConsentProvider>
          <MotionProvider>{children}</MotionProvider>
          <CookieBanner />
          <TrackingScripts />
        </ConsentProvider>
      </body>
    </html>
  );
}
