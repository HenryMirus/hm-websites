import type { Metadata } from "next";
import ProzessPage from "@/components/pages/ProzessPage";

export const metadata: Metadata = {
  title: "How we work — from briefing to launch",
  description:
    "The HM process in 5 phases: design concept with references, development, measurable QA, launch.",
  alternates: {
    canonical: "/en/prozess",
    languages: { "de-DE": "/prozess", en: "/en/prozess" },
  },
};

export default function Page() {
  return <ProzessPage lang="en" />;
}
