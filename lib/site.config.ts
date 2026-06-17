/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the single adaptation point for this scaffold.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  This scaffold is HM Websites' reusable, adaptable starter. To spin up a new
 *  client project from it, edit THIS FILE (and swap the font import in
 *  `app/layout.tsx`) — nothing else identity- or brand-related is hard-coded
 *  elsewhere. See TEMPLATE.md for the full new-project checklist.
 *
 *  Everything here is intentionally data, not logic, so it stays easy to swap.
 */

export type BrandTokens = {
  /** Primary brand colour (headings, key accents). */
  primary: string;
  /** Secondary text / muted foreground. */
  secondary: string;
  /** Call-to-action / interactive accent. */
  accent: string;
  /** Default body text colour. */
  ink: string;
  /** Page background. */
  surface: string;
};

export type SiteConfig = {
  /** Full name used in metadata + titles. */
  name: string;
  /** Short label for eyebrows / compact UI. */
  shortName: string;
  /** Default <html lang>. de for German-market clients, en otherwise. */
  locale: string;
  /** One-line description for SEO metadata. */
  description: string;
  /** Canonical site URL (env-overridable). */
  url: string;
  /** Brand colour tokens — injected as CSS custom properties at runtime. */
  brand: BrandTokens;
};

export const siteConfig: SiteConfig = {
  name: "HM Websites — v2",
  shortName: "HM Websites · v2",
  locale: "de",
  description:
    "HM Websites v2 — premium, animation-first websites built with Next.js, GSAP and Tailwind.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // Placeholder palette for the scaffold. Replace per project from the
  // approved design tokens — these map 1:1 to Tailwind `brand.*` utilities.
  brand: {
    primary: "#0f172a",
    secondary: "#1e293b",
    accent: "#6366f1",
    ink: "#0b1120",
    surface: "#f8fafc",
  },
};

/**
 * Brand tokens as a CSS-custom-property map, ready to spread onto an element's
 * `style`. Keeps `styles/globals.css` generic so a new project never edits CSS
 * for colour — it edits `siteConfig.brand` only.
 */
export function brandCssVars(
  brand: BrandTokens = siteConfig.brand
): Record<string, string> {
  return {
    "--color-primary": brand.primary,
    "--color-secondary": brand.secondary,
    "--color-accent": brand.accent,
    "--color-ink": brand.ink,
    "--color-surface": brand.surface,
  };
}
