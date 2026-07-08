import type { Metadata } from "next";
import UeberPage from "@/components/pages/UeberPage";

export const metadata: Metadata = {
  title: "Über HM Labs — Websites aus Buchholz im Westerwald",
  description:
    "HM Labs ist das Web-Studio von Henry Mirus: individuelle Websites, self-hosted KI und Webapps — aus Buchholz für Köln/Bonn, Koblenz und ganz DACH.",
  alternates: {
    canonical: "/ueber",
    languages: { "de-DE": "/ueber", en: "/en/ueber" },
  },
};

/** Person-Schema (Masterplan §8.4) — E-E-A-T-Anker der Über-Seite */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://hm-labs.de/#founder",
  name: "Henry Mirus",
  jobTitle: "Inhaber, Webentwickler",
  worksFor: { "@id": "https://hm-labs.de/#business" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Buchholz (Westerwald)",
    addressRegion: "Rheinland-Pfalz",
    addressCountry: "DE",
  },
  knowsAbout: [
    "Webentwicklung",
    "Next.js",
    "GSAP",
    "GAIO (Generative AI Optimization)",
    "DSGVO-konforme KI-Systeme",
    "Barrierefreiheit (WCAG 2.1)",
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <UeberPage lang="de" />
    </>
  );
}
