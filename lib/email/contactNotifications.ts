import { EMAIL } from "@/lib/config/email";
import { PORTAL_URL, SITE_URL } from "@/lib/config/site";
import { sendEmail } from "./send";
import { renderTemplate } from "./templates";
import { loadSystemTemplate } from "./systemTemplates";

export interface ContactSubmission {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  leadScore: number;
  leadTier: string;
}

/**
 * Meldet eine Website-Anfrage an HM Labs und bestätigt dem Absender den
 * Eingang. Wirft nie: die Anfrage ist zu diesem Zeitpunkt bereits gespeichert.
 */
export async function notifyContactSubmission(s: ContactSubmission): Promise<void> {
  const dash = "–";
  const adminVars = {
    name: s.name,
    email: s.email,
    company: s.company || dash,
    phone: s.phone || dash,
    subject: s.subject || dash,
    message: s.message || dash,
    lead_score: String(s.leadScore),
    lead_tier: s.leadTier,
    portal_url: PORTAL_URL,
    site_url: SITE_URL,
  };
  // Bewusst ohne den Freitext der Anfrage: sonst ließe sich das Formular
  // nutzen, um beliebige Inhalte über unsere Domain an fremde Adressen zu schicken.
  const clientVars = {
    name: s.name.slice(0, 80),
    portal_url: PORTAL_URL,
    site_url: SITE_URL,
  };

  const [adminTpl, clientTpl] = await Promise.all([
    loadSystemTemplate("contact_received_admin"),
    loadSystemTemplate("contact_confirmation_client"),
  ]);

  const results = await Promise.allSettled([
    sendEmail({ to: EMAIL.INBOX, replyTo: s.email, ...renderTemplate(adminTpl, adminVars) }),
    sendEmail({ to: s.email, replyTo: EMAIL.INBOX, ...renderTemplate(clientTpl, clientVars) }),
  ]);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[Contact] ${i === 0 ? "Admin-Benachrichtigung" : "Eingangsbestätigung"} fehlgeschlagen:`, r.reason);
    }
  });
}
