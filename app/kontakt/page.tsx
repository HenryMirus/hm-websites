import type { Metadata } from "next";
import KontaktPage from "@/components/pages/KontaktPage";

export const metadata: Metadata = {
  title: "Projekt anfragen — Antwort innerhalb eines Werktags",
  description:
    "Erzählen Sie uns, was Sie bauen wollen: persönliche Antwort in der Regel innerhalb eines Werktags, kostenloses Erstgespräch, unverbindliche Einschätzung mit Preisspanne.",
  alternates: {
    canonical: "/kontakt",
    languages: { "de-DE": "/kontakt", en: "/en/kontakt" },
  },
};

export default function Page() {
  return <KontaktPage lang="de" />;
}
