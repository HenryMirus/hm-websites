import type { Metadata } from "next";
import PreisePage from "@/components/pages/PreisePage";

export const metadata: Metadata = {
  title: "Preise & Ablauf — transparente Spannen statt Lockangebote",
  description:
    "Website-Kosten ehrlich: transparente Preisspannen für alle 13 Leistungen, Zahlungsstruktur in Meilensteinen, keine versteckten Kosten.",
  alternates: {
    canonical: "/preise",
    languages: { "de-DE": "/preise", en: "/en/preise" },
  },
};

export default function Page() {
  return <PreisePage lang="de" />;
}
