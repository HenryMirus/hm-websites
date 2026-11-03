import type { Metadata } from "next";
import { LegalShell, LegalSections } from "@/components/legal/LegalShell";
import { agb, agbIntro, AGB_STAND } from "@/lib/legal/agb";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen | HM Labs",
  description:
    "Allgemeine Geschäftsbedingungen von HM Labs für Websites, Webanwendungen, KI-Systeme, Audits sowie Wartung und Hosting.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/agb" },
};

export default function AgbPage() {
  return (
    <LegalShell tag="// Terms" title="Allgemeine Geschäftsbedingungen" intro={agbIntro} stand={AGB_STAND} current="/agb">
      <LegalSections abschnitte={agb} />
    </LegalShell>
  );
}
