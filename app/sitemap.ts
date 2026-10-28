import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config/site";
import { VEROEFFENTLICHTE_PROJEKTE } from "@/lib/kundenprojekte";

// Feste Änderungsdaten statt new Date(): sonst meldet jede Neuauslieferung
// allen Suchmaschinen eine Änderung. Bei inhaltlichen Änderungen anpassen.
// Impressum und Datenschutz fehlen bewusst, sie sind noindex.
const UPDATED = new Date("2026-10-28");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}`,
      lastModified: UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/leistungen`,
      lastModified: UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Kundenprojekte: nur veröffentlichte (published: true)
    ...VEROEFFENTLICHTE_PROJEKTE.map((p) => ({
      url: `${SITE_URL}/projekte/${p.slug}`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
