import localFont from "next/font/local";

/**
 * HM Labs — Leiterbahn-Typografie (CI §3)
 * Drei Schriften, drei Rollen — alle OFL, self-hosted (nie Google-CDN).
 *
 * Hubot Sans:  Display. Variable wght 200–900, wdth 75–125 (als font-stretch
 *              deklariert → die Breitenachse ist per CSS/GSAP animierbar =
 *              Signature-Pattern "Width-Shift").
 * Mona Sans:   Text/UI. Variable wght (Superfamilie zu Hubot).
 * Spline Sans Mono: Technik — Labels, Messwerte, Preise, Metadaten.
 */

export const hubotSans = localFont({
  src: "../public/fonts/HubotSans-Variable.woff2",
  variable: "--font-hubot",
  display: "swap",
  weight: "200 900",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "sans-serif"],
});

export const monaSans = localFont({
  src: "../public/fonts/MonaSans-Variable.woff2",
  variable: "--font-mona",
  display: "swap",
  weight: "200 900",
  fallback: ["Segoe UI", "sans-serif"],
});

export const splineSansMono = localFont({
  src: "../public/fonts/SplineSansMono-Variable.woff2",
  variable: "--font-spline",
  display: "swap",
  weight: "300 700",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

/** Alle Font-Variablen für das <html>-Element */
export const fontVariables = `${hubotSans.variable} ${monaSans.variable} ${splineSansMono.variable}`;
