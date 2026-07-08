import type { Lang } from "@/content/leistungen";

export type { Lang };

/** /pfad ↔ /en/pfad — Rechtsseiten bleiben DE-only */
export function switchLangPath(pathname: string, to: Lang): string {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  if (to === "en") {
    if (isEn) return pathname;
    return pathname === "/" ? "/en" : `/en${pathname}`;
  }
  if (!isEn) return pathname;
  const stripped = pathname.replace(/^\/en/, "");
  return stripped === "" ? "/" : stripped;
}

export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "de";
}

/** Interner Link im aktuellen Sprachkontext */
export function localePath(path: string, lang: Lang): string {
  if (lang === "de") return path;
  return path === "/" ? "/en" : `/en${path}`;
}
