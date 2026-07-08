import type { Metadata } from "next";
import KontaktPage from "@/components/pages/KontaktPage";

export const metadata: Metadata = {
  title: "Start a project — reply within one business day",
  description:
    "Tell us what you want to build: personal reply usually within one business day, free initial consultation, non-binding assessment with a price range.",
  alternates: {
    canonical: "/en/kontakt",
    languages: { "de-DE": "/kontakt", en: "/en/kontakt" },
  },
};

export default function Page() {
  return <KontaktPage lang="en" />;
}
