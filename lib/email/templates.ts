// ─── Email-Template-Rendering ───────────────────────────────────────────────
//
// emailShell() ist der gemeinsame HTML-Rahmen (Logo, Card, CTA, Footer) — aus
// notify.ts extrahiert, damit Engine UND Portal aus einer Quelle rendern.
// Templates liegen in der DB-Tabelle `email_templates`; ihre Felder füllen die
// Slots des Shells. Platzhalter wie {{client_name}} werden interpoliert.

const FONT = `'Helvetica Neue',Helvetica,Arial,sans-serif`;

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
}: {
  preheader: string;
  accentGradient: string;
  iconChar: string;
  iconBg: string;
  iconBorder: string;
  heading: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  ctaBg: string;
  noteText?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background-color:#09090F;font-family:${FONT};-webkit-font-smoothing:antialiased;">
<span style="display:none;font-size:1px;color:#09090F;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#09090F;">
<tr><td align="center" style="padding:48px 16px 40px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;">

  <!-- Logo -->
  <tr><td align="center" style="padding-bottom:36px;">
    <a href="https://hm-labs.de" target="_blank" style="text-decoration:none;">
      <table cellpadding="0" cellspacing="0" border="0" align="center"><tr>
        <td style="vertical-align:middle;padding-right:10px;">
          <img src="cid:hm-labs-logo" alt="HM Labs" width="36" height="36" style="display:block;border:0;border-radius:8px;"/>
        </td>
        <td style="vertical-align:middle;font-family:${FONT};font-size:19px;font-weight:700;color:#EEEEFF;letter-spacing:-0.3px;">
          HM&nbsp;<span style="color:#4F7FFF;">Labs</span>
        </td>
      </tr></table>
    </a>
  </td></tr>

  <!-- Card -->
  <tr><td style="background-color:#111118;border:1px solid #1E1E2E;border-radius:16px;overflow:hidden;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="height:3px;background:${accentGradient};">&nbsp;</td></tr>
      <tr><td style="padding:36px 36px 32px;">

        <!-- Icon -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
          <tr><td style="background-color:${iconBg};border:1px solid ${iconBorder};border-radius:12px;width:48px;height:48px;text-align:center;vertical-align:middle;font-size:22px;line-height:48px;">${iconChar}</td></tr>
        </table>

        <!-- Heading -->
        <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#EEEEFF;letter-spacing:-0.4px;line-height:1.3;">${heading}</h1>

        <!-- Body -->
        ${body}

        <!-- Divider -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
          <tr><td style="height:1px;background-color:#1E1E2E;">&nbsp;</td></tr>
        </table>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:${noteText ? "0" : "4px"};">
          <tr><td style="border-radius:10px;background-color:${ctaBg};">
            <a href="${ctaHref}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;letter-spacing:0.1px;border-radius:10px;">${ctaLabel} &rarr;</a>
          </td></tr>
        </table>

      </td></tr>

      ${noteText ? `
      <!-- Note -->
      <tr><td style="padding:0 24px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background-color:rgba(255,77,106,0.06);border:1px solid rgba(255,77,106,0.18);border-radius:10px;padding:14px 16px;">
            <p style="margin:0;font-size:12px;color:#8888AA;line-height:1.6;">&#9888;&nbsp; ${noteText}</p>
          </td></tr>
        </table>
      </td></tr>` : ""}

    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding-top:28px;">
    <p style="margin:0;font-size:12px;color:#5A5A7A;line-height:2.0;">
      <strong style="color:#8888AA;">HM Labs</strong> &mdash; KI-Integration &amp; Softwareentwicklung<br/>
      <a href="https://hm-labs.de" style="color:#4F7FFF;text-decoration:none;">hm-labs.de</a>
      &nbsp;&middot;&nbsp;
      <a href="https://hm-labs.de/impressum" style="color:#5A5A7A;text-decoration:none;">Impressum</a>
      &nbsp;&middot;&nbsp;
      <a href="https://hm-labs.de/datenschutz" style="color:#5A5A7A;text-decoration:none;">Datenschutz</a>
    </p>
  </td></tr>

</table>
</td></tr></table>
</body>
</html>`;
}

/** Rendert ein DB-Template mit Variablen zu fertigem { subject, html }. */
export function renderTemplate(
  template: EmailTemplateRow,
  vars: Record<string, string>
): { subject: string; html: string } {
  const subject = interpolate(template.subject, vars);
  const html = emailShell({
    preheader: interpolate(template.preheader, vars),
    accentGradient: template.accent,
    iconChar: template.icon_char,
    iconBg: template.icon_bg,
    iconBorder: template.icon_border,
    heading: interpolate(template.heading, vars),
    body: interpolate(template.body_html, vars),
    ctaHref: interpolate(template.cta_href, vars),
    ctaLabel: interpolate(template.cta_label, vars),
    ctaBg: template.cta_bg,
    noteText: template.note_text ? interpolate(template.note_text, vars) : undefined,
  });
  return { subject, html };
}
