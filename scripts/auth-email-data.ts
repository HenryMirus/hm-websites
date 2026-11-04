// Die Supabase-Auth-Mails (Passwort zurücksetzen, Einladung, ...) als Daten.
// Eine Quelle für build-auth-templates.ts (schreibt die HTML-Dateien für das
// Supabase-Dashboard), render-auth-email-previews und send-auth-email-previews.
//
// Gebaut wird direkt über emailShell(), nicht über renderTemplate(): deren
// interpolate() kennt nur {{ key }} ohne Punkt, die Go-Platzhalter von Supabase
// ({{ .TokenHash }}) würden dort zwar nicht getroffen, aber escapeHtml() und die
// Slot-Logik gehören zu den App-Mails und würden hier nur im Weg stehen.

import { emailShell, type EmailImageMode } from "@/lib/email/templates";
import { PORTAL_URL, SITE_URL } from "@/lib/config/site";

// Slot-Stile wie in systemTemplates.ts: Fließtext = text-dim, Labels = muted.
const P = `margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;`;
const STRONG = `color:#EEEEFF;font-weight:600;`;

const BLUE = {
  accentGradient: "linear-gradient(90deg,#4F7FFF 0%,#7B9FFF 100%)",
  iconBg: "rgba(79,127,255,0.10)",
  iconBorder: "rgba(79,127,255,0.22)",
  ctaBg: "#2A5CE8",
};
const GREEN = {
  accentGradient: "linear-gradient(90deg,#22C55E 0%,#4ADE80 100%)",
  iconBg: "rgba(34,197,94,0.10)",
  iconBorder: "rgba(34,197,94,0.22)",
  ctaBg: "#16A34A",
};

// Gültigkeit je Mailtyp. Supabase kennt nur EINEN Wert für alle (Dashboard →
// Authentication → Sign In / Providers → Email → "Email OTP Expiration") und
// erlaubt höchstens 86400 Sekunden. Dort 86400 einstellen (Entscheidung
// 04.11.2026); dieselbe Frist steht in allen Mails, sonst steht etwas Falsches drin.
const VALIDITY = {
  recovery: "24 Stunden",
  invite: "24 Stunden",
  magiclink: "24 Stunden",
  signup: "24 Stunden",
  email_change: "24 Stunden",
};

/** Callback-Link der Portal-App (Button-Seite, eingelöst wird erst per POST). */
const callbackUrl = (type: string) =>
  `${PORTAL_URL}/auth/callback?token_hash={{ .TokenHash }}&amp;type=${type}`;

/** Hinweisbox mit farbigem Seitenstreifen, wie die Zitate der App-Mails. */
const infoBox = (html: string, border = "#4F7FFF") =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr><td bgcolor="#09090F" style="background-color:#09090F;border:1px solid #1E1E2E;border-left:3px solid ${border};border-radius:8px;padding:14px 16px;"><p style="margin:0;font-size:13px;color:#8888AA;line-height:1.6;">${html}</p></td></tr></table>`;

/** Klartext-Link zum Kopieren, falls der Button im Client nicht funktioniert. */
const fallbackLink = (url: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tr><td bgcolor="#09090F" style="background-color:#09090F;border:1px solid #1E1E2E;border-radius:10px;padding:14px 16px;">` +
  `<p style="margin:0 0 8px;font-size:12px;color:#7C7CA0;line-height:1.6;">Der Button funktioniert nicht? Kopieren Sie diesen Link in die Adresszeile Ihres Browsers:</p>` +
  `<p style="margin:0;font-family:'JetBrains Mono','Courier New',Courier,monospace;font-size:11px;color:#4F7FFF;line-height:1.7;word-break:break-all;">${url}</p>` +
  `</td></tr></table>`;

/** Persönliche Anrede nur, wenn die App einen Namen als user_metadata mitgibt. */
const GREETING = `{{ if .Data.name }}Hallo {{ .Data.name }}, {{ end }}`;

export interface AuthMail {
  /** Kurzname des Mailtyps, auch Dateiname der Vorschau */
  key: string;
  /** Datei in lib/email/templates/ (die vier alten Namen bleiben erhalten) */
  file: string;
  /** Bezeichnung im Supabase-Dashboard */
  dashboardName: string;
  subject: string;
  /** false = von der App aktuell nicht ausgelöst, Datei liegt nur bereit */
  used: boolean;
  html: string;
}

export function buildAuthMails(images: EmailImageMode): AuthMail[] {
  const recoveryUrl = callbackUrl("recovery");
  const inviteUrl = callbackUrl("invite");
  const magicUrl = callbackUrl("magiclink");
  const signupUrl = callbackUrl("signup");
  const changeUrl = callbackUrl("email_change");

  return [
    {
      key: "recovery",
      file: "password-reset.html",
      dashboardName: "Reset password",
      subject: "Passwort zurücksetzen – HM Labs",
      used: true,
      html: emailShell({
        images,
        // Automatisierte Mail: keine persönliche Signatur/Foto (Henry 04.11.2026).
        signature: "none",
        preheader: `Legen Sie ein neues Passwort für Ihr Kundenportal fest. Der Link ist ${VALIDITY.recovery} gültig.`,
        ...BLUE,
        iconChar: "&#x1F511;",
        heading: "Passwort zurücksetzen",
        body:
          `<p style="${P}">Für Ihr Konto <strong style="${STRONG}">{{ .Email }}</strong> im HM Labs Kundenportal wurde ein neues Passwort angefordert. Mit einem Klick legen Sie es fest.</p>` +
          infoBox(`Der Link ist <strong style="${STRONG}">${VALIDITY.recovery}</strong> gültig und lässt sich nur einmal verwenden.`),
        ctaHref: recoveryUrl,
        ctaLabel: "Neues Passwort festlegen",
        belowCta: fallbackLink(recoveryUrl),
        noteText:
          "Sie haben das nicht angefordert? Dann können Sie diese E-Mail ignorieren, Ihr Passwort bleibt unverändert. Wir fragen Sie nie per E-Mail nach Ihrem Passwort.",
      }),
    },
    {
      key: "invite",
      file: "invite.html",
      dashboardName: "Invite user",
      subject: "Ihr Zugang zum HM Labs Kundenportal",
      used: true,
      html: emailShell({
        images,
        preheader: "Ich habe Ihnen einen Zugang zum Kundenportal eingerichtet.",
        ...BLUE,
        iconChar: "&#x2709;",
        heading: "Ihr Zugang zum Kundenportal",
        body:
          `<p style="${P}">${GREETING}ich habe Ihnen einen Zugang zum HM Labs Kundenportal eingerichtet. Dort sehen Sie den Stand Ihres Projekts, Dateien und Nachrichten und können mir direkt schreiben.</p>` +
          `<p style="${P}">Aktivieren Sie Ihr Konto und legen Sie dabei Ihr Passwort fest.</p>` +
          infoBox(`Der Link ist <strong style="${STRONG}">${VALIDITY.invite}</strong> gültig und lässt sich nur einmal verwenden.`),
        ctaHref: inviteUrl,
        ctaLabel: "Konto aktivieren",
        belowCta: fallbackLink(inviteUrl),
        noteText: "Sie haben diese Einladung nicht erwartet? Dann können Sie die E-Mail ignorieren.",
      }),
    },
    {
      key: "magic-link",
      file: "magic-link.html",
      dashboardName: "Magic link",
      subject: "Ihr Anmelde-Link – HM Labs",
      // Die App ruft signInWithOtp nirgends auf.
      used: false,
      html: emailShell({
        images,
        signature: "none",
        preheader: `Ihr Link zur Anmeldung im Kundenportal, ${VALIDITY.magiclink} gültig.`,
        ...BLUE,
        iconChar: "&#x1F517;",
        heading: "Anmelden im Kundenportal",
        body:
          `<p style="${P}">Mit dem Button melden Sie sich ohne Passwort bei Ihrem Konto <strong style="${STRONG}">{{ .Email }}</strong> an.</p>` +
          infoBox(`Der Link ist <strong style="${STRONG}">${VALIDITY.magiclink}</strong> gültig und lässt sich nur einmal verwenden.`),
        ctaHref: magicUrl,
        ctaLabel: "Jetzt anmelden",
        belowCta: fallbackLink(magicUrl),
        noteText: "Sie haben das nicht angefordert? Dann können Sie diese E-Mail ignorieren.",
      }),
    },
    {
      key: "email-change",
      file: "email-change.html",
      dashboardName: "Change email address",
      subject: "E-Mail-Adresse bestätigen – HM Labs",
      used: true,
      html: emailShell({
        images,
        signature: "none",
        preheader: "Bestätigen Sie die neue E-Mail-Adresse für Ihr Kundenportal.",
        ...BLUE,
        iconChar: "&#x1F4EC;",
        heading: "E-Mail-Adresse bestätigen",
        body:
          `<p style="${P}">Sie möchten die E-Mail-Adresse Ihres Kundenportal-Kontos ändern, von <strong style="${STRONG}">{{ .Email }}</strong> auf <strong style="${STRONG}">{{ .NewEmail }}</strong>. Bestätigen Sie die Änderung mit einem Klick.</p>` +
          infoBox(`Der Link ist <strong style="${STRONG}">${VALIDITY.email_change}</strong> gültig und lässt sich nur einmal verwenden.`),
        ctaHref: changeUrl,
        ctaLabel: "Änderung bestätigen",
        belowCta: fallbackLink(changeUrl),
        noteText:
          "Sie haben das nicht veranlasst? Dann ignorieren Sie diese E-Mail und ändern Sie sicherheitshalber Ihr Passwort im Portal.",
      }),
    },
    {
      key: "confirmation",
      file: "confirmation.html",
      dashboardName: "Confirm sign up",
      subject: "Registrierung bestätigen – HM Labs",
      // Zugänge entstehen nur per Einladung, es gibt keine offene Registrierung.
      used: false,
      html: emailShell({
        images,
        signature: "none",
        preheader: "Bestätigen Sie Ihre E-Mail-Adresse für das Kundenportal.",
        ...GREEN,
        iconChar: "&#10003;",
        heading: "Registrierung bestätigen",
        body:
          `<p style="${P}">Bitte bestätigen Sie, dass <strong style="${STRONG}">{{ .Email }}</strong> Ihre E-Mail-Adresse ist, um Ihr Konto im HM Labs Kundenportal zu aktivieren.</p>` +
          infoBox(`Der Link ist <strong style="${STRONG}">${VALIDITY.signup}</strong> gültig und lässt sich nur einmal verwenden.`, "#22C55E"),
        ctaHref: signupUrl,
        ctaLabel: "Adresse bestätigen",
        belowCta: fallbackLink(signupUrl),
        noteText: "Sie haben sich nicht registriert? Dann können Sie diese E-Mail ignorieren.",
      }),
    },
    {
      key: "reauthentication",
      file: "reauthentication.html",
      dashboardName: "Reauthentication",
      subject: "Ihr Bestätigungscode – HM Labs",
      // Die App ruft auth.reauthenticate() nirgends auf.
      used: false,
      html: emailShell({
        images,
        signature: "none",
        preheader: "Ihr Bestätigungscode für eine sicherheitsrelevante Änderung.",
        ...BLUE,
        iconChar: "&#x1F6E1;",
        heading: "Ihr Bestätigungscode",
        body:
          `<p style="${P}">Geben Sie diesen Code ein, um die sicherheitsrelevante Änderung an Ihrem Konto zu bestätigen:</p>` +
          `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:0;"><tr><td bgcolor="#09090F" style="background-color:#09090F;border:1px solid #1E1E2E;border-radius:12px;padding:16px 28px;font-family:'JetBrains Mono','Courier New',Courier,monospace;font-size:30px;font-weight:600;letter-spacing:8px;color:#EEEEFF;">{{ .Token }}</td></tr></table>`,
        noteText:
          "Sie haben das nicht veranlasst? Dann geben Sie den Code nicht weiter und ändern Sie Ihr Passwort im Portal.",
      }),
    },
  ];
}

// Beispielwerte für Vorschau und Testversand. Der Token-Hash ist absichtlich
// erkennbar unecht: der Link führt auf die Button-Seite und schlägt beim
// Einlösen fehl, verbraucht also nichts.
const EXAMPLES: Record<string, string> = {
  ".TokenHash": "BEISPIEL-TOKEN-HASH-0123456789abcdef",
  ".Token": "482 913",
  ".Email": "anna@beispiel.example",
  ".NewEmail": "anna.neu@beispiel.example",
  ".SiteURL": SITE_URL,
  ".ConfirmationURL": `${PORTAL_URL}/auth/callback`,
  ".Data.name": "Anna Beispiel",
};

/** Ersetzt die Go-Platzhalter von Supabase durch Beispielwerte. */
export function fillExamples(html: string): string {
  return html
    .replace(/\{\{\s*if\s+\.Data\.name\s*\}\}([\s\S]*?)\{\{\s*end\s*\}\}/g, "$1")
    .replace(/\{\{\s*(\.[A-Za-z.]+)\s*\}\}/g, (m, key: string) => EXAMPLES[key] ?? m);
}
