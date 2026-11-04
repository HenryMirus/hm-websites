// Gemeinsame Beispieldaten für render-email-previews.ts und send-email-previews.ts.
// Beide rendern über renderTemplate(), also exakt den Weg der echten Mails.

import { SYSTEM_TEMPLATE_DEFAULTS } from "@/lib/email/systemTemplates";
import { renderTemplate, type EmailTemplateRow } from "@/lib/email/templates";
import { SITE_URL, PORTAL_URL } from "@/lib/config/site";

// annual und feedback liegen nur in der DB (email_templates), nicht im Code.
// Betreff, Überschrift, CTA und Akzent stammen aus den DB-Zeilen; die Fließ-
// texte sind Beispiele nur für die Vorschau und entsprechen nicht zwingend der
// DB-Fassung. Slot-Stile wie in systemTemplates.ts.
const P = `margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;`;

const EXTRA_TEMPLATES: Record<string, EmailTemplateRow> = {
  annual: {
    key: "annual",
    name: "Jährlicher Website-Checkup (Beispiel)",
    subject: "Ihr jährlicher Website-Checkup",
    heading: "Zeit für Ihren Checkup &#9745;",
    preheader: "Ein kurzer Blick auf Technik, Sicherheit und Inhalte Ihrer Website.",
    body_html:
      `<p style="${P}">Hallo {{client_name}}, Ihre Website ist jetzt ein Jahr online. Das ist ein guter Zeitpunkt für einen kurzen Checkup: Technik, Sicherheit und Inhalte.</p>` +
      `<p style="${P}">Wenn Sie möchten, vereinbaren wir ein kurzes Gespräch und besprechen, was sich lohnt.</p>`,
    accent: "linear-gradient(90deg,#A855F7 0%,#4F7FFF 100%)",
    icon_char: "&#x1F50D;",
    icon_bg: "rgba(168,85,247,0.10)",
    icon_border: "rgba(168,85,247,0.22)",
    cta_label: "Checkup vereinbaren",
    cta_href: "{{site_url}}/#contact",
    cta_bg: "#2A5CE8",
    note_text: null,
  },
  feedback: {
    key: "feedback",
    name: "Feedback nach Projektabschluss (Beispiel)",
    subject: "Wie war Ihre Erfahrung mit HM Labs?",
    heading: "Ihr Projekt ist gelandet &#x1F680;",
    preheader: "Ihre Rückmeldung hilft mir, die Zusammenarbeit weiter zu verbessern.",
    body_html:
      `<p style="${P}">Hallo {{client_name}}, Ihr Projekt ist abgeschlossen. Mich interessiert, wie die Zusammenarbeit für Sie war.</p>` +
      `<p style="${P}">Zwei Minuten reichen. Ihre Rückmeldung hilft mir, es beim nächsten Mal besser zu machen.</p>`,
    accent: "linear-gradient(90deg,#4F7FFF 0%,#22D3EE 100%)",
    icon_char: "&#x1F4AC;",
    icon_bg: "rgba(34,211,238,0.10)",
    icon_border: "rgba(34,211,238,0.22)",
    cta_label: "Feedback geben",
    cta_href: "{{portal_url}}/messages",
    cta_bg: "#2A5CE8",
    note_text: null,
  },
};

const SAMPLE_VARS: Record<string, Record<string, string>> = {
  annual: { client_name: "Muster GmbH", site_url: SITE_URL, portal_url: PORTAL_URL },
  contact_confirmation_client: { name: "Anna Beispiel", site_url: SITE_URL },
  contact_received_admin: {
    name: "Anna Beispiel",
    email: "anna@beispiel.example",
    company: "Beispiel GmbH",
    phone: "+49 000 0000000",
    subject: "Website mit Chatbot",
    lead_score: "82",
    lead_tier: "heiß",
    message: "Guten Tag,\nwir suchen eine neue Website mit integriertem Chatbot.\nKönnen wir nächste Woche telefonieren?",
    portal_url: PORTAL_URL,
  },
  feedback: { client_name: "Muster GmbH", portal_url: PORTAL_URL },
  milestone_reached: {
    client_name: "Muster GmbH",
    project_name: "Neue Unternehmenswebsite",
    milestone_name: "Design freigegeben",
    project_url: `${PORTAL_URL}/projects`,
  },
  new_message_admin: {
    client_name: "Muster GmbH",
    client_id: "00000000-0000-0000-0000-000000000000",
    preview: "Hallo Henry, kurze Frage zur Startseite: Können wir das Hero-Bild noch tauschen?",
    portal_url: PORTAL_URL,
  },
  new_message_client: {
    client_name: "Muster GmbH",
    preview: "Hallo, das Hero-Bild tausche ich gerne. Ich melde mich, sobald die neue Fassung online ist.",
    portal_url: PORTAL_URL,
  },
};

export interface PreviewMail {
  key: string;
  subject: string;
  html: string;
}

export function renderPreviewMails(): PreviewMail[] {
  const templates = { ...SYSTEM_TEMPLATE_DEFAULTS, ...EXTRA_TEMPLATES };
  return Object.keys(SAMPLE_VARS)
    .sort()
    .map((key) => ({ key, ...renderTemplate(templates[key], SAMPLE_VARS[key]) }));
}
