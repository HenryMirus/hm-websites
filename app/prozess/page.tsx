import type { Metadata } from "next";
import ProzessPage from "@/components/pages/ProzessPage";

export const metadata: Metadata = {
  title: "So arbeiten wir — vom Briefing zum Launch",
  description:
    "Der HM-Prozess in 5 Phasen: Designkonzept mit Referenzen, Entwicklung, messbare QA, Launch.",
  alternates: {
    canonical: "/prozess",
    languages: { "de-DE": "/prozess", en: "/en/prozess" },
  },
};

export default function Page() {
  return <ProzessPage lang="de" />;
}
