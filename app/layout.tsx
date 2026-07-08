import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { EMAIL } from "@/lib/config/email";
import { LEISTUNGEN } from "@/content/leistungen";

const SITE_URL = "https://hm-labs.de";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HM Labs — Individuelle Websites, KI & Software. Kein Baukasten.",
    template: "%s | HM Labs",
  },
  description:
    "Handgefertigte Websites mit Lighthouse 90+, SEO & GAIO inklusive. DSGVO-native KI auf EU-Servern. Aus Buchholz für DACH.",
  keywords: [
    "Webdesign Agentur individuell",
    "Webdesign Westerwald",
    "Webdesign Raum Bonn Koblenz",
    "DSGVO-konformer KI-Chatbot",
    "GAIO Agentur",
    "individuelle Website erstellen lassen",
    "Website Relaunch SEO",
    "BFSG Barrierefreiheit Audit",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "HM Labs — Individuelle Websites, KI & Software. Kein Baukasten.",
    description:
      "Handgefertigte Websites mit Lighthouse 90+, SEO & GAIO inklusive. DSGVO-native KI auf EU-Servern.",
    siteName: "HM Labs",
    locale: "de_DE",
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
    icon: "/favicon.svg",
  },
};

/**
 * Sitewide Schema.org (Masterplan §8.4): LocalBusiness + ProfessionalService
 * mit OfferCatalog aller 13 Leistungen — bewusst OHNE Preise (Spannen +
 * Disclaimer lassen sich im Schema nicht sauber abbilden).
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `${SITE_URL}/#business`,
      name: "HM Labs",
      url: SITE_URL,
      email: EMAIL.CONTACT,
      description:
        "HM Labs entwirft und baut individuelle Websites (Lighthouse-Ziel 90+), DSGVO-native KI-Chatbots auf EU-Servern, Webapps sowie GAIO- und BFSG-Audits — handgefertigt, ohne Baukasten und Templates.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Pantaleonstraße 20",
        postalCode: "53567",
        addressLocality: "Buchholz (Westerwald)",
        addressRegion: "Rheinland-Pfalz",
        addressCountry: "DE",
      },
      areaServed: [
        { "@type": "Place", name: "Raum Köln/Bonn–Koblenz–Westerwald" },
        { "@type": "Place", name: "DACH (remote)" },
      ],
      founder: { "@id": `${SITE_URL}/#founder` },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Leistungen",
        itemListElement: LEISTUNGEN.map((l) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: l.name.de,
            description: l.kurz.de,
          },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder`,
      name: "Henry Mirus",
      givenName: "Henry",
      familyName: "Mirus",
      jobTitle: "Inhaber, Webentwickler",
      worksFor: { "@id": `${SITE_URL}/#business` },
      url: `${SITE_URL}/ueber`,
      email: EMAIL.CONTACT,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "HM Labs",
      publisher: { "@id": `${SITE_URL}/#business` },
      inLanguage: ["de-DE", "en"],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={fontVariables}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
