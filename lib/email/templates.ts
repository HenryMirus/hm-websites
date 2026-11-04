// ─── Email-Template-Rendering ───────────────────────────────────────────────
//
// emailShell() ist der gemeinsame HTML-Rahmen (Logo, Card, CTA, Signatur,
// Footer) — aus notify.ts extrahiert, damit Engine UND Portal aus einer Quelle
// rendern. Templates liegen in der DB-Tabelle `email_templates`; ihre Felder
// füllen die Slots des Shells. Platzhalter wie {{client_name}} werden
// interpoliert.
//
// Design = Website (tailwind.config.ts, app/globals.css), immer dunkel. Mail-
// Clients kennen weder CSS-Variablen noch Flex/Grid: Tabellen-Layout, Inline-
// Styles, Farben als Hex. Ändert sich ein Token der Website, hier nachziehen.

import { SITE_URL, MAIN_DOMAIN } from "@/lib/config/site";
import { EMAIL } from "@/lib/config/email";

// Website-Tokens als Hex.
const C = {
  bg: "#09090F",
  surface: "#111118",
  border: "#1E1E2E",
  primary: "#4F7FFF",
  text: "#EEEEFF",
  dim: "#8888AA",
  // Muted ist auf der Website seit 28.10.2026 #7C7CA0 (WCAG AA); das alte
  // #5A5A7A hat auf #111118 nur 3,0:1.
  muted: "#7C7CA0",
  // Portraitrahmen: primary mit 25 % Deckkraft auf surface, vorgemischt, weil
  // Outlook rgba() bei Rahmen nicht kennt.
  portraitBorder: "#202D53",
} as const;

// Website: Space Grotesk für Überschriften, Inter für Fließtext. Die meisten
// Clients laden keine Webfonts und fallen auf den Rest des Stacks zurück; der
// muss für sich gut aussehen.
const FONT_DISPLAY = `'Space Grotesk','Helvetica Neue',Arial,sans-serif`;
const FONT_BODY = `'Inter','Helvetica Neue',Arial,sans-serif`;

// Webfonts per <link> lösen beim Öffnen der Mail eine Anfrage an Google aus. Die
// Website liefert ihre Schriften bewusst selbst aus (kein Aufruf von
// fonts.googleapis.com), deshalb bleibt das aus, bis Henry es ausdrücklich will.
const LOAD_WEBFONTS = false;

// Content-IDs der Inline-Anhänge, siehe lib/email/send.ts.
export const LOGO_CID = "hm-labs-logo";
export const PORTRAIT_CID = "hm-labs-portrait";

/**
 * Woher die Bilder kommen. "cid": Inline-Anhang (send.ts), der Normalfall.
 * "url": absolute https-Adresse auf der Website, für die Supabase-Auth-Mails,
 * weil Supabase keine Anhänge versendet. Das Portrait ist dort erst nach dem
 * Deploy der Website erreichbar, und Clients können externe Bilder blockieren.
 */
export type EmailImageMode = "cid" | "url";
const imageSrc = (mode: EmailImageMode, cid: string, file: string) =>
  mode === "url" ? `${SITE_URL}/email/${file}` : `cid:${cid}`;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface EmailTemplateRow {
  key: string;
  name: string;
  subject: string;
  heading: string;
  body_html: string;
  preheader: string;
  accent: string;
  icon_char: string;
  icon_bg: string;
  icon_border: string;
  cta_label: string;
  cta_href: string;
  cta_bg: string;
  note_text: string | null;
}

/** Ersetzt {{key}} durch vars[key] (unbekannte Platzhalter → leerer String). */
export function interpolate(input: string, vars: Record<string, string>): string {
  return input.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (_m, key: string) =>
    vars[key] != null ? vars[key] : ""
  );
}

/** Erste Hex-Farbe eines Verlaufs: Outlook und manche Clients kennen keine Gradients. */
function firstColor(gradient: string): string {
  return gradient.match(/#[0-9a-f]{3,8}/i)?.[0] ?? C.primary;
}

// Rahmenfarben mit Deckkraft (rgba) kennt Outlook nicht. Für das Icon und die
// Notiz bleibt rgba stehen (Fallback ist dort ein dunkler Rahmen), die tragenden
// Flächen haben immer ein festes Hex.

/**
 * Signatur am Ende jeder Mail. Foto, Name, Tagline und Links stehen fest hier,
 * nicht in den Templates: so tragen alle Mails (auch Admin-Benachrichtigungen
 * und künftige Templates) dieselbe Signatur.
 */
function signature(images: EmailImageMode): string {
  const font = `font-family:${FONT_BODY};`;
  return `
      <!-- Signatur -->
      <tr><td bgcolor="${C.surface}" style="background-color:${C.surface};padding:0 36px 36px;" class="card-pad">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
          <tr><td height="1" bgcolor="${C.border}" style="height:1px;line-height:1px;font-size:1px;background-color:${C.border};">&nbsp;</td></tr>
        </table>
        <p style="margin:0 0 16px;${font}font-size:15px;color:${C.dim};line-height:1.6;">Liebe Grüße</p>
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:middle;padding-right:16px;" width="72">
            <img src="${imageSrc(images, PORTRAIT_CID, "henry-portrait-email.jpg")}" alt="Henry Mirus" width="72" height="72" style="display:block;width:72px;height:72px;border:1px solid ${C.portraitBorder};border-radius:14px;"/>
          </td>
          <td style="vertical-align:middle;${font}">
            <p style="margin:0 0 3px;font-family:${FONT_DISPLAY};font-size:18px;font-weight:600;color:${C.text};line-height:1.3;">Henry Mirus</p>
            <p style="margin:0 0 6px;${font}font-size:13px;color:${C.dim};line-height:1.5;"><strong style="color:${C.text};font-weight:600;">HM Labs</strong> &middot; KI-Integration &amp; Softwareentwicklung</p>
            <p style="margin:0;${font}font-size:13px;line-height:1.5;">
              <a href="${SITE_URL}" target="_blank" style="color:${C.primary};text-decoration:none;">${MAIN_DOMAIN}</a>
              <span style="color:${C.muted};">&nbsp;&middot;&nbsp;</span>
              <a href="mailto:${EMAIL.CONTACT}" style="color:${C.primary};text-decoration:none;">${EMAIL.CONTACT}</a>
            </p>
          </td>
        </tr></table>
      </td></tr>`;
}

/**
 * Ersatz für die persönliche Signatur bei automatisierten Mails (Passwort-Reset,
 * Bestätigungs-Codes): kein Foto, kein „Liebe Grüße", sondern ein neutraler
 * Hinweis, dass die Mail automatisch kam und nicht beantwortet werden muss.
 */
function automatedFooter(): string {
  const font = `font-family:${FONT_BODY};`;
  return `
      <!-- Automatisch versendet -->
      <tr><td bgcolor="${C.surface}" style="background-color:${C.surface};padding:0 36px 32px;" class="card-pad">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
          <tr><td height="1" bgcolor="${C.border}" style="height:1px;line-height:1px;font-size:1px;background-color:${C.border};">&nbsp;</td></tr>
        </table>
        <p style="margin:0 0 6px;${font}font-size:13px;color:${C.dim};line-height:1.6;">Diese E-Mail wurde automatisch versendet. Bitte antworten Sie nicht darauf.</p>
        <p style="margin:0;${font}font-size:13px;line-height:1.6;color:${C.dim};"><strong style="color:${C.text};font-weight:600;">HM Labs</strong> &middot; <a href="${SITE_URL}" target="_blank" style="color:${C.primary};text-decoration:none;">${MAIN_DOMAIN}</a></p>
      </td></tr>`;
}

export function emailShell({
  preheader,
  accentGradient,
  iconChar,
  iconBg,
  iconBorder,
  heading,
  body,
  ctaHref,
  ctaLabel,
  ctaBg,
  noteText,
  belowCta,
  images = "cid",
  signature: signatureMode = "personal",
}: {
  preheader: string;
  accentGradient: string;
  iconChar: string;
  iconBg: string;
  iconBorder: string;
  heading: string;
  body: string;
  /** Ohne ctaHref/ctaLabel entfällt der Button (z. B. Mail mit reinem Code). */
  ctaHref?: string;
  ctaLabel?: string;
  ctaBg?: string;
  noteText?: string;
  /** Freier HTML-Slot direkt unter dem Button, z. B. Klartext-Link zum Kopieren. */
  belowCta?: string;
  images?: EmailImageMode;
  /** "personal" = Henrys Signatur mit Foto (Standard), "none" = automatisierte Mail ohne Persönliches. */
  signature?: "personal" | "none";
}): string {
  const hasCta = Boolean(ctaHref && ctaLabel);
  const accentFallback = firstColor(accentGradient);
  return `<!DOCTYPE html>
<html lang="de" style="background-color:${C.bg};color-scheme:dark;supported-color-schemes:dark;">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="color-scheme" content="dark"/>
<meta name="supported-color-schemes" content="dark"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>HM Labs</title>${
    LOAD_WEBFONTS
      ? `
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Space+Grotesk:wght@500;600;700&amp;display=swap" rel="stylesheet"/>`
      : ""
  }
<style>
  :root { color-scheme: dark; supported-color-schemes: dark; }
  body { background-color: ${C.bg}; }
  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table { border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0; }
  img { -ms-interpolation-mode: bicubic; }
  /* Outlook.com setzt data-ogsb/data-ogsc, wenn es selbst umfärbt; diese Regeln halten die Website-Farben dagegen. */
  [data-ogsb] .bg-page { background-color: ${C.bg} !important; }
  [data-ogsb] .bg-card { background-color: ${C.surface} !important; }
  [data-ogsc] .t-main { color: ${C.text} !important; }
  [data-ogsc] .t-dim { color: ${C.dim} !important; }
  @media only screen and (max-width: 480px) {
    .outer-pad { padding: 28px 12px 24px !important; }
    .card-pad { padding-left: 22px !important; padding-right: 22px !important; }
    .h1 { font-size: 21px !important; }
  }
</style>
<!--[if mso]>
<style>td, p, a, h1, span { font-family: 'Helvetica Neue', Arial, sans-serif !important; }</style>
<![endif]-->
</head>
<body class="bg-page" bgcolor="${C.bg}" style="margin:0;padding:0;background-color:${C.bg};color:${C.text};font-family:${FONT_BODY};-webkit-font-smoothing:antialiased;">
<div style="display:none;font-size:1px;line-height:1px;color:${C.bg};max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${preheader}${"&nbsp;&zwnj;".repeat(40)}</div>
<table class="bg-page" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background-color:${C.bg};">
<tr><td class="bg-page outer-pad" align="center" bgcolor="${C.bg}" style="background-color:${C.bg};padding:48px 16px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

  <!-- Logo -->
  <tr><td class="bg-page" align="center" bgcolor="${C.bg}" style="background-color:${C.bg};padding-bottom:32px;">
    <a href="${SITE_URL}" target="_blank" style="text-decoration:none;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
        <td style="vertical-align:middle;padding-right:10px;">
          <img src="${imageSrc(images, LOGO_CID, "hm-labs-logo-email.png")}" alt="" width="36" height="36" style="display:block;border:0;border-radius:8px;"/>
        </td>
        <td class="t-main" style="vertical-align:middle;font-family:${FONT_DISPLAY};font-size:20px;font-weight:700;color:${C.text};letter-spacing:-0.3px;">
          HM&nbsp;<span style="color:${C.primary};">Labs</span>
        </td>
      </tr></table>
    </a>
  </td></tr>

  <!-- Card -->
  <tr><td class="bg-card" bgcolor="${C.surface}" style="background-color:${C.surface};border:1px solid ${C.border};border-radius:16px;overflow:hidden;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td height="3" bgcolor="${accentFallback}" style="height:3px;line-height:3px;font-size:3px;background-color:${accentFallback};background-image:${accentGradient};">&nbsp;</td></tr>
      <tr><td class="bg-card card-pad" bgcolor="${C.surface}" style="background-color:${C.surface};padding:36px 36px 32px;font-family:${FONT_BODY};">

        <!-- Icon -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
          <tr><td bgcolor="${C.bg}" style="background-color:${iconBg};border:1px solid ${iconBorder};border-radius:12px;width:48px;height:48px;text-align:center;vertical-align:middle;font-size:22px;line-height:48px;color:${C.text};">${iconChar}</td></tr>
        </table>

        <!-- Heading -->
        <h1 class="h1 t-main" style="margin:0 0 14px;font-family:${FONT_DISPLAY};font-size:24px;font-weight:700;color:${C.text};letter-spacing:-0.4px;line-height:1.25;">${heading}</h1>

        <!-- Body -->
        ${body}

${hasCta ? `        <!-- Divider -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 28px;">
          <tr><td height="1" bgcolor="${C.border}" style="height:1px;line-height:1px;font-size:1px;background-color:${C.border};">&nbsp;</td></tr>
        </table>

        <!-- CTA (Website-Button: font-semibold, rounded-xl) -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:${noteText || belowCta ? "0" : "4px"};">
          <tr><td bgcolor="${ctaBg}" style="border-radius:12px;background-color:${ctaBg};">
            <a href="${ctaHref}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${FONT_BODY};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;letter-spacing:0.1px;border-radius:12px;">${ctaLabel} &rarr;</a>
          </td></tr>
        </table>` : ""}
${belowCta ?? ""}

      </td></tr>

      ${noteText ? `
      <!-- Note -->
      <tr><td class="bg-card card-pad" bgcolor="${C.surface}" style="background-color:${C.surface};padding:0 36px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td bgcolor="#1F151D" style="background-color:#1F151D;border:1px solid rgba(255,77,106,0.18);border-radius:10px;padding:14px 16px;">
            <p style="margin:0;font-family:${FONT_BODY};font-size:12px;color:${C.dim};line-height:1.6;">&#9888;&nbsp; ${noteText}</p>
          </td></tr>
        </table>
      </td></tr>` : ""}
${signatureMode === "none" ? automatedFooter() : signature(images)}

    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td class="bg-page" align="center" bgcolor="${C.bg}" style="background-color:${C.bg};padding-top:28px;">
    <p style="margin:0;font-family:${FONT_BODY};font-size:12px;color:${C.muted};line-height:2.0;">
      <a href="${SITE_URL}/impressum" style="color:${C.muted};text-decoration:none;">Impressum</a>
      &nbsp;&middot;&nbsp;
      <a href="${SITE_URL}/datenschutz" style="color:${C.muted};text-decoration:none;">Datenschutz</a>
    </p>
  </td></tr>

</table>
</td></tr></table>
</body>
</html>`;
}

/**
 * Rendert ein DB-Template mit Variablen zu fertigem { subject, html }.
 * Variablen werden für die HTML-Teile maskiert, außer den in `rawHtmlKeys`
 * genannten (z. B. von ai_generate erzeugtes HTML). Der Betreff ist Klartext
 * und bekommt die Werte unmaskiert.
 */
export function renderTemplate(
  template: EmailTemplateRow,
  vars: Record<string, string>,
  rawHtmlKeys: string[] = []
): { subject: string; html: string } {
  const htmlVars = Object.fromEntries(
    Object.entries(vars).map(([k, v]) => [k, rawHtmlKeys.includes(k) ? v : escapeHtml(v)])
  );
  const subject = interpolate(template.subject, vars).replace(/[\r\n]+/g, " ");
  const html = emailShell({
    preheader: interpolate(template.preheader, htmlVars),
    accentGradient: template.accent,
    iconChar: template.icon_char,
    iconBg: template.icon_bg,
    iconBorder: template.icon_border,
    heading: interpolate(template.heading, htmlVars),
    body: interpolate(template.body_html, htmlVars),
    ctaHref: interpolate(template.cta_href, htmlVars),
    ctaLabel: interpolate(template.cta_label, htmlVars),
    ctaBg: template.cta_bg,
    noteText: template.note_text ? interpolate(template.note_text, htmlVars) : undefined,
  });
  return { subject, html };
}
