// ─── Email-Konfiguration ───────────────────────────────────────────────────
//
// Adressen kommen aus der Umgebung; leer gesetzte Variablen fallen auf die
// Defaults zurück (envOr), statt leere mailto:-Links zu erzeugen.
//
// Für echten Versand zusätzlich nötig (Server-Umgebung, nicht im Repo):
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS  → lib/email/send.ts
//   Hostinger: smtp.hostinger.com, Port 465
// Supabase-Auth-Mails (Einladung, Passwort-Reset) laufen getrennt davon über
// Supabase Dashboard → Authentication → SMTP Settings.

import { envOr } from "./site";

const CONTACT = envOr(process.env.NEXT_PUBLIC_EMAIL_CONTACT, "info@hm-labs.tech");

export const EMAIL = {
  /** Öffentliche Kontaktadresse — Footer, CTA, Impressum, Datenschutz */
  CONTACT,

  // ── Server-only ─────────────────────────────────────────────────────────

  /** Absender für System-Mails. Muss zum SMTP-Konto passen, sonst lehnt der Server ab. */
  FROM: envOr(
    process.env.SMTP_FROM,
    envOr(process.env.EMAIL_FROM, `HM Labs <${envOr(process.env.SMTP_USER, CONTACT)}>`)
  ),

  /** Wohin neue Website-Anfragen gemeldet werden */
  INBOX: envOr(process.env.EMAIL_INBOX, CONTACT),

  /** Support-Adresse für Kunden im Portal */
  SUPPORT: envOr(process.env.NEXT_PUBLIC_EMAIL_SUPPORT, CONTACT),
} as const;
