import type { Metadata } from "next";
import PreisePage from "@/components/pages/PreisePage";

export const metadata: Metadata = {
  title: "Pricing & process — transparent ranges instead of bait offers",
  description:
    "Website costs, honestly: transparent price ranges for all 13 services, milestone payment structure, no hidden costs.",
  alternates: {
    canonical: "/en/preise",
    languages: { "de-DE": "/preise", en: "/en/preise" },
  },
};

export default function Page() {
  return <PreisePage lang="en" />;
}
