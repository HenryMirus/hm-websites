import type { Metadata } from "next";
import UeberPage from "@/components/pages/UeberPage";

export const metadata: Metadata = {
  title: "About HM Labs — websites from Buchholz im Westerwald",
  description:
    "HM Labs is Henry Mirus's web studio: individual websites, self-hosted AI and web apps — from Buchholz for Cologne/Bonn, Koblenz and all of DACH.",
  alternates: {
    canonical: "/en/ueber",
    languages: { "de-DE": "/ueber", en: "/en/ueber" },
  },
};

export default function Page() {
  return <UeberPage lang="en" />;
}
