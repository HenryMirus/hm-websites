import { MetadataRoute } from "next";
import { VEROEFFENTLICHTE_PROJEKTE } from "@/lib/kundenprojekte";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://hm-labs.de",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://hm-labs.de/leistungen",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Kundenprojekte: nur veröffentlichte (published: true)
    ...VEROEFFENTLICHTE_PROJEKTE.map((p) => ({
      url: `https://hm-labs.de/projekte/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: "https://hm-labs.de/impressum",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: "https://hm-labs.de/datenschutz",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
