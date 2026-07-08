import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/components/pages/LegalShell";
import { EMAIL } from "@/lib/config/email";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von HM Labs.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/datenschutz" },
};

/*
 * Hinweis (Masterplan §5.9): Der Chatbot-Absatz (Redis-TTL, Speicherdauer,
 * Art. 6 Abs. 1 lit. a/b) wird ergänzt, sobald das Chat-Widget live geht —
 * wörtlich nach Chatbot-Plan Phase 4 / Blueprint-Template.
 */
export default function DatenschutzPage() {
  return (
    <LegalShell
      eyebrow="[R2] RECHTLICHES"
      title="Datenschutzerklärung"
      subtitle={`Stand: ${new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}`}
    >
      <LegalSection title="1. Verantwortlicher">
        <p>
          HM Labs, Inhaber Henry Mirus
          <br />
          Pantaleonstraße 20, 53567 Buchholz (Westerwald)
          <br />
          E-Mail:{" "}
          <a href={`mailto:${EMAIL.CONTACT}`} className="via-link" style={{ color: "var(--kupfer-tief)" }}>
            {EMAIL.CONTACT}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="2. Grundsatz: keine Tracking-Cookies">
        <p>
          Diese Website kommt ohne Tracking-Cookies und ohne
          einwilligungspflichtige Analyse-Dienste aus. Es findet kein
          Tracking zu Werbezwecken statt, es werden keine Daten an
          Werbenetzwerke übermittelt. Deshalb sehen Sie hier auch keinen
          Cookie-Banner.
        </p>
      </LegalSection>

      <LegalSection title="3. Hosting und Server-Logfiles">
        <p>
          Diese Website wird auf Servern in der Europäischen Union betrieben
          (Hostinger; Auftragsverarbeitung nach Art. 28 DSGVO). Beim Aufruf
          der Website verarbeitet der Server technisch notwendige Daten
          (IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite,
          User-Agent) in Logfiles. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
          DSGVO — unser berechtigtes Interesse am sicheren und stabilen
          Betrieb. Logfiles werden automatisch nach kurzer Zeit gelöscht.
        </p>
      </LegalSection>

      <LegalSection title="4. Kontaktformular und E-Mail-Anfragen">
        <p>
          Wenn Sie das Kontaktformular nutzen oder uns per E-Mail schreiben,
          verarbeiten wir die von Ihnen angegebenen Daten (Name,
          E-Mail-Adresse, optional Unternehmen, Interesse,
          Budget-Orientierung sowie Ihre Nachricht) ausschließlich zur
          Bearbeitung Ihrer Anfrage und für Anschlussfragen. Rechtsgrundlage
          ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Ihre
          Anfrage).
        </p>
        <p>
          Die Daten werden in unserer Anfragen-Datenbank (Supabase, Server in
          der EU) gespeichert und per E-Mail-Benachrichtigung an uns
          zugestellt. Sie werden gelöscht, sobald sie für die Bearbeitung
          nicht mehr erforderlich sind und keine gesetzlichen
          Aufbewahrungspflichten entgegenstehen.
        </p>
      </LegalSection>

      <LegalSection title="5. Schriftarten und externe Dienste">
        <p>
          Alle Schriftarten sind lokal auf unserem Server eingebunden
          (self-hosted). Beim Besuch dieser Website wird keine Verbindung zu
          Google Fonts oder anderen Font-Diensten aufgebaut. Inhalte werden
          grundsätzlich ohne Einbindung externer Dienste ausgeliefert.
        </p>
      </LegalSection>

      <LegalSection title="6. Ihre Rechte">
        <p>
          Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie
          betreffenden personenbezogenen Daten: Recht auf Auskunft (Art. 15
          DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung
          der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie
          Widerspruch gegen die Verarbeitung (Art. 21). Wenden Sie sich dazu
          formlos an die oben genannte E-Mail-Adresse.
        </p>
        <p>
          Sie haben zudem das Recht, sich bei einer
          Datenschutz-Aufsichtsbehörde zu beschweren — zuständig für uns:
          Der Landesbeauftragte für den Datenschutz und die
          Informationsfreiheit Rheinland-Pfalz.
        </p>
      </LegalSection>

      <LegalSection title="7. Datensicherheit">
        <p>
          Diese Website nutzt TLS-Verschlüsselung (HTTPS). Wir treffen
          angemessene technische und organisatorische Maßnahmen, um Ihre
          Daten gegen Verlust, Missbrauch und unbefugten Zugriff zu
          schützen.
        </p>
      </LegalSection>

      <LegalSection title="8. Änderungen dieser Datenschutzerklärung">
        <p>
          Wir passen diese Datenschutzerklärung an, sobald sich Funktionen
          der Website ändern — etwa bei Einführung des KI-Assistenten
          (Chat-Widget) oder einer cookielosen Reichweitenmessung. Es gilt
          die jeweils hier veröffentlichte Fassung.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
