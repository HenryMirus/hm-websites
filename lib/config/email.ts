// ─── Email-Konfiguration ───────────────────────────────────────────────────
//
// Eine einzige Variable ändern → alle Emails auf der Website wechseln:
//   NEXT_PUBLIC_EMAIL_CONTACT in .env.local
//
// ⚠️  Was sonst noch angepasst werden muss, wenn du die Domain wechselst:
//
//  1. SUPABASE SMTP (für Invite-Mails, Password-Reset, Magic Links):
//     → Supabase Dashboard → Authentication → SMTP Settings
//     → Sender Name, From Email, Host (z.B. smtp.resend.com), Port, User, Password
//
//  2. CONTACT-FORMULAR EMAILS (momentan nur DB-Speicherung, kein Versand):
//     → /app/api/contact/route.ts erweitern mit z.B. Resend oder Nodemailer
//     → EMAIL_FROM (Absender-Adresse, z.B. no-reply@hm-labs.de)
//     → EMAIL_INBOX (deine private Inbox, wohin Formular-Submissions gehen)
//     → Beide sind Server-only (kein NEXT_PUBLIC_ Prefix nötig)
//
//  3. DNS-RECORDS beim Domain-Anbieter:
//     → SPF-Record:  "v=spf1 include:_spf.resend.com ~all"
//     → DKIM-Record: vom Email-Anbieter (Resend, Postmark, etc.) generiert
//     → DMARC-Record: "v=DMARC1; p=none; rua=mailto:dmarc@hm-labs.de"
//     (verhindert, dass Emails als Spam markiert werden)
//
//  4. SUPABASE AUTH → URL Configuration:
//     → Site URL: https://hm-labs.de
//     → Redirect URLs: https://hm-labs.de/**, https://portal.hm-labs.de/**
//
//  Sinnvolle Sub-Email-Rollen:
//    no-reply@hm-labs.de   → Supabase SMTP (Invites, Passwort-Reset)
//    hello@hm-labs.de      → Haupt-Kontakt (Website, öffentlich)
//    support@hm-labs.de    → Kunden-Support im Portal (optional)
//    henry@hm-labs.de      → Persönliche Email für Rechnungen, etc.

export const EMAIL = {
  /** Haupt-Kontakt-Email – auf der Website angezeigt (Footer, CTA, Impressum, Datenschutz) */
  CONTACT: process.env.NEXT_PUBLIC_EMAIL_CONTACT ?? "mrs.hnry@gmail.com",

  // ── Server-only (nicht im Browser verfügbar) ────────────────────────────
  // Erst relevant, wenn ein Email-Provider (Resend etc.) eingebaut wird.

  /** Absender für System-Emails → Supabase SMTP / Email-Provider */
  FROM: process.env.EMAIL_FROM ?? `HM Labs <${process.env.NEXT_PUBLIC_EMAIL_CONTACT ?? "mrs.hnry@gmail.com"}>`,

  /** Deine private Inbox – wohin Contact-Formular-Submissions weitergeleitet werden */
  INBOX: process.env.EMAIL_INBOX ?? process.env.NEXT_PUBLIC_EMAIL_CONTACT ?? "mrs.hnry@gmail.com",

  /** Support-Adresse für Kunden (optional, für Portal-Nutzung) */
  SUPPORT: process.env.NEXT_PUBLIC_EMAIL_SUPPORT ?? process.env.NEXT_PUBLIC_EMAIL_CONTACT ?? "mrs.hnry@gmail.com",
} as const;
