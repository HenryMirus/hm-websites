import type { RechtsAbschnitt } from "@/components/legal/LegalShell";
import { EMAIL } from "@/lib/config/email";

/* Widerrufsbelehrung HM Labs — ENTWURF (Henry, 30.10.2026).
 *
 * Aufbau und Muster-Widerrufsformular wie bei der mit dem Anwalt
 * abgestimmten SKM-Fassung (Kunden/SKM/website/content/pages/widerruf.ts).
 * Inhaltlich aber nicht die Waren-Variante von SKM (Frist ab Erhalt der
 * Ware, Rücksendung), sondern die Variante für Dienstleistungen nach dem
 * gesetzlichen Muster (Anlage 1 zu Art. 246a § 1 Abs. 2 EGBGB): Frist ab
 * Vertragsschluss, Wertersatz bei Beginn während der Widerrufsfrist.
 *
 * VOR DER FREIGABE MIT DEM ANWALT ZU KLÄREN:
 * - Ob für einzelne Leistungen (z. B. nach Kundenvorgaben gestaltete
 *   Arbeitsergebnisse) ein Ausschluss nach § 312g Abs. 2 BGB greift.
 * - Der Hinweis zum vorzeitigen Erlöschen (§ 356 Abs. 4 BGB) setzt voraus,
 *   dass Verbraucher vor Beginn ausdrücklich zustimmen und ihre Kenntnis
 *   bestätigen. Das muss im Angebots-/Annahmeprozess abgefragt werden.
 * - Die meisten Kunden sind Unternehmer; der Hinweis, dass für sie kein
 *   Widerrufsrecht besteht, ist ergänzt und nicht Teil des Musters.
 */

export const WIDERRUF_STAND = "Oktober 2026";

const ANSCHRIFT = "HM Labs, Inhaber Henry Mirus, Pantaleonstraße 20, 53567 Buchholz (Westerwald)";

export const widerrufHinweis =
  "Das Widerrufsrecht steht nur Verbrauchern zu (§ 13 BGB). Unternehmer, die einen Vertrag in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit schließen, haben kein gesetzliches Widerrufsrecht.";

export const widerruf: RechtsAbschnitt[] = [
  {
    heading: "Widerrufsrecht",
    paragraphs: [
      "Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.",
      "Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.",
      `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (${ANSCHRIFT}, E-Mail ${EMAIL.CONTACT}) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.`,
      "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.",
    ],
  },
  {
    heading: "Folgen des Widerrufs",
    paragraphs: [
      "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.",
      "Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen sollen, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.",
    ],
  },
  {
    heading: "Vorzeitiges Erlöschen des Widerrufsrechts",
    paragraphs: [
      "Das Widerrufsrecht erlischt bei einem Vertrag zur Erbringung von Dienstleistungen auch dann, wenn wir die Dienstleistung vollständig erbracht haben und mit der Ausführung erst begonnen haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren.",
    ],
  },
];

export const widerrufFormular = {
  heading: "Muster-Widerrufsformular",
  hinweis:
    "(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)",
  empfaenger: [ANSCHRIFT, `E-Mail: ${EMAIL.CONTACT}`],
  felder: [
    "Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung (*)/den Kauf der folgenden Waren (*):",
    "Bestellt am (*)/erhalten am (*):",
    "Name des/der Verbraucher(s):",
    "Anschrift des/der Verbraucher(s):",
    "Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):",
    "Datum:",
  ],
  fussnote: "(*) Unzutreffendes streichen.",
};
