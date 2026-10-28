import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config/site";
import { VEROEFFENTLICHTE_PROJEKTE } from "@/lib/kundenprojekte";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/leistungen`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Kundenprojekte: nur veröffentlichte (published: true)
    ...VEROEFFENTLICHTE_PROJEKTE.map((p) => ({
      url: `${SITE_URL}/projekte/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/impressum`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
