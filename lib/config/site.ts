// Eine Quelle für alle Domains der App. Hauptdomain ist hm-labs.de (seit 04.11.2026);
// hm-labs.de leitet per 301 weiter und bleibt vorerst Mail-Domain.

// Leere Strings zählen als "nicht gesetzt": `?? fallback` greift dort nicht,
// und genau das hat leere mailto:-Links und Portal-URLs erzeugt.
export function envOr(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function stripSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export const SITE_URL = stripSlash(envOr(process.env.NEXT_PUBLIC_SITE_URL, "https://hm-labs.de"));
export const PORTAL_URL = stripSlash(envOr(process.env.NEXT_PUBLIC_PORTAL_URL, "https://clients.hm-labs.de"));

export const MAIN_DOMAIN = new URL(SITE_URL).hostname.replace(/^www\./, "");
export const PORTAL_HOST = new URL(PORTAL_URL).hostname;
