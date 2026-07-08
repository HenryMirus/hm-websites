import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";

export const metadata: Metadata = {
  // Title/Description gemäß Masterplan §8.1
  title: "HM Labs — Individuelle Websites, KI & Software. Kein Baukasten.",
  description:
    "Handgefertigte Websites mit Lighthouse 90+, SEO & GAIO inklusive. DSGVO-native KI auf EU-Servern. Aus Buchholz für DACH.",
  alternates: {
    canonical: "/",
    languages: { "de-DE": "/", en: "/en" },
  },
};

export default function Page() {
  return <HomePage lang="de" />;
}
