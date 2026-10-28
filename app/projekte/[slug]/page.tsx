import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjektDetail from "@/components/ProjektDetail";
import {
  VEROEFFENTLICHTE_PROJEKTE,
  getVeroeffentlichtesProjekt,
} from "@/lib/kundenprojekte";

import { SITE_URL } from "@/lib/config/site";

interface PageProps {
  params: { slug: string };
}

// Nur freigegebene Projekte werden gebaut; jeder andere Slug (auch der eines
// unveröffentlichten Projekts) ist eine 404.
export const dynamicParams = false;

export function generateStaticParams(): PageProps["params"][] {
  return VEROEFFENTLICHTE_PROJEKTE.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const projekt = getVeroeffentlichtesProjekt(params.slug);
  if (!projekt) return {};

  const url = `${SITE_URL}/projekte/${projekt.slug}`;
  const title = `${projekt.kunde}: Kundenprojekt | HM Labs`;
  const description = projekt.teaser.de;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      // Kein hreflang: Englisch gibt es nur clientseitig unter derselben URL
      // (siehe app/layout.tsx).
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "HM Labs",
      locale: "de_DE",
    },
    twitter: {
      title,
      description,
    },
  };
}

export default function Page({ params }: PageProps) {
  const projekt = getVeroeffentlichtesProjekt(params.slug);
  if (!projekt) notFound();

  const weitere = VEROEFFENTLICHTE_PROJEKTE.filter((p) => p.slug !== projekt.slug);

  return <ProjektDetail projekt={projekt} weitere={weitere} />;
}
