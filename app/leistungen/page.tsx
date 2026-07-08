import type { Metadata } from "next";
import LeistungenPage from "@/components/pages/LeistungenPage";

export const metadata: Metadata = {
  title: "Leistungen & Preisspannen — Websites, KI-Chatbots, Webapps",
  description:
    "HM Labs: 13 Leistungen mit transparenten Preisspannen — von der Landingpage bis zur Unternehmens-KI.",
  alternates: {
    canonical: "/leistungen",
    languages: { "de-DE": "/leistungen", en: "/en/leistungen" },
  },
};

export default function Page() {
  return <LeistungenPage lang="de" />;
}
