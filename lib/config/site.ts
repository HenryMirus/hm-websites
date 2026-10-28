// Eine Quelle für alle Domains der App. Live läuft hm-labs.tech; hm-labs.de
// existiert nicht (löst nicht auf) und darf nirgends mehr als Default stehen.

// Leere Strings zählen als "nicht gesetzt": `?? fallback` greift dort nicht,
// und genau das hat leere mailto:-Links und Portal-URLs erzeugt.
export function envOr(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function stripSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export const SITE_URL = stripSlash(envOr(process.env.NEXT_PUBLIC_SITE_URL, "https://hm-labs.tech"));
export const PORTAL_URL = stripSlash(envOr(process.env.NEXT_PUBLIC_PORTAL_URL, "https://clients.hm-labs.tech"));

export const MAIN_DOMAIN = new URL(SITE_URL).hostname.replace(/^www\./, "");
export const PORTAL_HOST = new URL(PORTAL_URL).hostname;
