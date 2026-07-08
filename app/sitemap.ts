import { MetadataRoute } from "next";

const BASE = "https://hm-labs.de";

/** v1.0-Routen (Masterplan §4.1) — Detailseiten folgen in v1.1 */
const ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  en?: boolean;
}> = [
  { path: "/", priority: 1, changeFrequency: "weekly", en: true },
  { path: "/leistungen", priority: 0.9, changeFrequency: "monthly", en: true },
  { path: "/preise", priority: 0.9, changeFrequency: "monthly", en: true },
  { path: "/prozess", priority: 0.8, changeFrequency: "monthly", en: true },
  { path: "/ueber", priority: 0.7, changeFrequency: "monthly", en: true },
  { path: "/kontakt", priority: 0.8, changeFrequency: "yearly", en: true },
  { path: "/barrierefreiheit", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.flatMap((r) => {
    const dePath = r.path === "/" ? "" : r.path;
    const entries: MetadataRoute.Sitemap = [
      {
        url: `${BASE}${dePath}` || BASE,
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
        alternates: r.en
          ? {
              languages: {
                "de-DE": `${BASE}${dePath}` || BASE,
                en: `${BASE}/en${dePath}`,
              },
            }
          : undefined,
      },
    ];
    if (r.en) {
      entries.push({
        url: `${BASE}/en${dePath}`,
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: Math.max(0.1, r.priority - 0.2),
      });
    }
    return entries;
  });
}
