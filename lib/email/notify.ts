import { sendEmail } from "./send";

// ─── Shared HTML Bausteine ──────────────────────────────────────────────────

const FONT = `'Helvetica Neue',Helvetica,Arial,sans-serif`;

function emailShell({
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

// ─── Neue Nachricht → Kunde ─────────────────────────────────────────────────

export async function notifyClientNewMessage(
  clientEmail: string,
  preview: string,
  portalUrl: string
): Promise<void> {
  const safePreview = preview.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;">
      Sie haben eine neue Nachricht von <strong style="color:#EEEEFF;">HM Labs</strong> erhalten.
      Melden Sie sich im Portal an, um sie zu lesen und zu antworten.
    </p>
    <!-- Preview box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr><td style="background-color:#09090F;border:1px solid #1E1E2E;border-left:3px solid #4F7FFF;border-radius:8px;padding:14px 16px;">
        <p style="margin:0;font-size:13px;color:#8888AA;font-style:italic;line-height:1.6;">&ldquo;${safePreview}&rdquo;</p>
      </td></tr>
    </table>
  `;

  const html = emailShell({
    preheader: "Sie haben eine neue Nachricht von HM Labs erhalten.",
    accentGradient: "linear-gradient(90deg,#4F7FFF 0%,#7B9FFF 100%)",
    iconChar: "&#x2709;",
    iconBg: "rgba(79,127,255,0.10)",
    iconBorder: "rgba(79,127,255,0.22)",
    heading: "Neue Nachricht von HM Labs",
    body,
    ctaHref: portalUrl,
    ctaLabel: "Nachricht öffnen",
    ctaBg: "#4F7FFF",
  });

  await sendEmail({
    to: clientEmail,
    subject: "Neue Nachricht von HM Labs",
    html,
  });
}

// ─── Neue Nachricht → Admin(s) ──────────────────────────────────────────────

export async function notifyAdminsNewMessage(
  adminEmails: string[],
  clientName: string,
  preview: string
): Promise<void> {
  const portalUrl =
    process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";
  const safePreview = preview.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeName = clientName.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;">
      <strong style="color:#EEEEFF;">${safeName}</strong> hat eine neue Nachricht im Portal gesendet.
    </p>
    <!-- Preview box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr><td style="background-color:#09090F;border:1px solid #1E1E2E;border-left:3px solid #FF4D6A;border-radius:8px;padding:14px 16px;">
        <p style="margin:0;font-size:13px;color:#8888AA;font-style:italic;line-height:1.6;">&ldquo;${safePreview}&rdquo;</p>
      </td></tr>
    </table>
  `;

  const html = emailShell({
    preheader: `${clientName} hat eine neue Nachricht gesendet.`,
    accentGradient: "linear-gradient(90deg,#FF4D6A 0%,#FF7A8A 100%)",
    iconChar: "&#x1F514;",
    iconBg: "rgba(255,77,106,0.10)",
    iconBorder: "rgba(255,77,106,0.22)",
    heading: `Nachricht von ${safeName}`,
    body,
    ctaHref: `${portalUrl}/messages`,
    ctaLabel: "Im Portal öffnen",
    ctaBg: "#FF4D6A",
  });

  await sendEmail({
    to: adminEmails,
    subject: `Neue Nachricht von ${clientName}`,
    html,
  });
}

// ─── Meilenstein erreicht → Kunde ───────────────────────────────────────────

export async function notifyClientMilestoneReached(
  clientEmail: string,
  clientName: string,
  projectName: string,
  milestoneName: string,
  projectUrl: string
): Promise<void> {
  const safeName = clientName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeProject = projectName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeMilestone = milestoneName.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;">
      Hallo ${safeName}, wir haben gerade einen wichtigen Schritt in Ihrem Projekt abgeschlossen!
    </p>
    <!-- Milestone box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr><td style="background-color:#09090F;border:1px solid #1E1E2E;border-radius:12px;padding:20px 20px;">
        <p style="margin:0 0 4px;font-size:11px;font-family:'Courier New',monospace;color:#5A5A7A;text-transform:uppercase;letter-spacing:0.08em;">Projekt</p>
        <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#EEEEFF;">${safeProject}</p>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background-color:rgba(34,197,94,0.10);border:1px solid rgba(34,197,94,0.25);border-radius:8px;padding:10px 14px;">
              <p style="margin:0;font-size:13px;color:#4ADE80;font-weight:600;">&#10003;&nbsp; ${safeMilestone}</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
    <p style="margin:0 0 28px;font-size:14px;color:#8888AA;line-height:1.7;">
      Im Portal sehen Sie den aktuellen Stand aller Meilensteine und Aufgaben.
    </p>
  `;

  const html = emailShell({
    preheader: `Meilenstein erreicht: ${milestoneName} in ${projectName}`,
    accentGradient: "linear-gradient(90deg,#22C55E 0%,#4ADE80 100%)",
    iconChar: "&#10003;",
    iconBg: "rgba(34,197,94,0.10)",
    iconBorder: "rgba(34,197,94,0.25)",
    heading: "Meilenstein erreicht!",
    body,
    ctaHref: projectUrl,
    ctaLabel: "Projekt ansehen",
    ctaBg: "#16A34A",
  });

  await sendEmail({
    to: clientEmail,
    subject: `✓ ${milestoneName} — ${projectName}`,
    html,
  });
}
