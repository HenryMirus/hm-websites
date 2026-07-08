import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "HM Labs — Individual websites, AI & software. No site builders.",
  description:
    "Hand-crafted websites with Lighthouse 90+, SEO & GAIO included. GDPR-native AI on EU servers. From Buchholz for the DACH region.",
  alternates: {
    canonical: "/en",
    languages: { "de-DE": "/", en: "/en" },
  },
};

export default function Page() {
  return <HomePage lang="en" />;
}
