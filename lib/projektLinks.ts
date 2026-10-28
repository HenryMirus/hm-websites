import type { Lang } from "@/lib/translations";

/**
 * Link auf eine Projekt-Unterseite, mit ?lang=en wie im Rest der Site.
 * Eigene Datei, damit Client Components den Link bauen können, ohne
 * lib/kundenprojekte.ts (inkl. unveröffentlichter Einträge) zu importieren.
 */
export function projektHref(slug: string, lang: Lang): string {
  return `/projekte/${slug}${lang === "en" ? "?lang=en" : ""}`;
}
