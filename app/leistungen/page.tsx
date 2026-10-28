import type { Metadata } from "next";
import LeistungenDetail from "@/components/LeistungenDetail";
import { SITE_URL } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Leistungen & Preisspannen | Websites, KI-Chatbots, Webapps | HM Labs",
  description:
    "Alle 13 Leistungen von HM Labs im Detail: individuelle Websites, self-hosted KI-Chatbots, Webapps, GAIO- & BFSG-Audits, Wartung, mit transparenten Preisspannen.",
  alternates: {
    canonical: `${SITE_URL}/leistungen`,
  },
};

export default function Page() {
  return <LeistungenDetail />;
}
