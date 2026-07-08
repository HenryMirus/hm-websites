import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/components/pages/LegalShell";
import { EMAIL } from "@/lib/config/email";

export const metadata: Metadata = {
  title: "Barrierefreiheitserklärung",
  description:
    "Barrierefreiheitserklärung von hm-labs.de: Konformitätsstatus WCAG 2.1 AA, bekannte Einschränkungen, Feedback-Kontakt.",
  alternates: { canonical: "/barrierefreiheit" },
};

/**
 * Barrierefreiheitserklärung (Masterplan §5.9) — zugleich Vertriebsbeweis
 * für Leistung 11. Ehrlich pflegen: Prüfdatum + bekannte Einschränkungen
 * nach jedem Release aktualisieren.
 */
export default function BarrierefreiheitPage() {
  return (
    <LegalShell
      eyebrow="[R3] BARRIEREFREIHEIT"
      title="Barrierefreiheitserklärung"
      subtitle="Stand: Juli 2026 · gilt für hm-labs.de"
    >
      <LegalSection title="Anspruch und Konformitätsstatus">
        <p>
          HM Labs bemüht sich, die eigene Website im Einklang mit den Web
          Content Accessibility Guidelines (WCAG) 2.1, Konformitätsstufe AA,
          barrierefrei zugänglich zu machen — derselbe Maßstab, den wir bei
          Kundenprojekten anlegen. Diese Website wurde bei ihrer Erstellung
          von Anfang an auf Barrierefreiheit hin entworfen: semantisches
          HTML, vollständige Tastaturbedienbarkeit, sichtbare
          Fokus-Indikatoren, geprüfte Farbkontraste, Respektierung von
          prefers-reduced-motion und aussagekräftige Alternativtexte.
        </p>
        <p>
          Status: <strong>teilweise konform mit WCAG 2.1 AA</strong> — die
          unten aufgeführten Einschränkungen sind bekannt und werden
          abgearbeitet.
        </p>
      </LegalSection>

      <LegalSection title="Prüfverfahren">
        <p>
          Die Einschätzung beruht auf einer Selbstbewertung: automatisierte
          Prüfung (axe-core), manueller Tastatur-Durchlauf aller Seiten,
          Kontrastprüfung aller Text-/Hintergrund-Kombinationen des
          Farbsystems sowie Stichproben mit Screenreadern (VoiceOver).
          Letzte Prüfung: Juli 2026. Re-Test nach jedem Release.
        </p>
      </LegalSection>

      <LegalSection title="Bekannte Einschränkungen">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Die englische Sprachversion (/en) befindet sich im Aufbau;
            einzelne Inhalte (z.&nbsp;B. Rechtsseiten) liegen nur auf
            Deutsch vor.
          </li>
          <li>
            Ein vollständiger Screenreader-Durchlauf mit NVDA (Windows)
            steht noch aus; bisher wurde mit VoiceOver (macOS) geprüft.
          </li>
          <li>
            Das Kundenportal (clients.hm-labs.de) ist ein separates System
            und von dieser Erklärung nicht umfasst.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Feedback und Kontakt">
        <p>
          Ihnen ist eine Barriere aufgefallen? Schreiben Sie uns — wir
          beheben sie:{" "}
          <a
            href={`mailto:${EMAIL.CONTACT}`}
            className="via-link"
            style={{ color: "var(--kupfer-tief)" }}
          >
            {EMAIL.CONTACT}
          </a>
          . Wir antworten in der Regel innerhalb eines Werktags.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
