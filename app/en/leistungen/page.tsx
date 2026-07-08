import type { Metadata } from "next";
import LeistungenPage from "@/components/pages/LeistungenPage";

export const metadata: Metadata = {
  title: "Services & price ranges — websites, AI chatbots, web apps",
  description:
    "HM Labs: 13 services with transparent price ranges — from landing page to private company AI.",
  alternates: {
    canonical: "/en/leistungen",
    languages: { "de-DE": "/leistungen", en: "/en/leistungen" },
  },
};

export default function Page() {
  return <LeistungenPage lang="en" />;
}
