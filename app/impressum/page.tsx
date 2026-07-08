import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/components/pages/LegalShell";
import { EMAIL } from "@/lib/config/email";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung von HM Labs.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <LegalShell
      eyebrow="[R1] RECHTLICHES"
      title="Impressum"
      subtitle="Angaben gemäß § 5 DDG"
    >
      <LegalSection title="Anbieter">
        <p>
          HM Labs
          <br />
          Inhaber: Henry Mirus
          <br />
          Pantaleonstraße 20
          <br />
          53567 Buchholz (Westerwald)
        </p>
        <p>(Einzelunternehmen)</p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          E-Mail:{" "}
          <a href={`mailto:${EMAIL.CONTACT}`} className="via-link" style={{ color: "var(--kupfer-tief)" }}>
            {EMAIL.CONTACT}
          </a>
          <br />
          Website:{" "}
          <a href="https://hm-labs.de" className="via-link" style={{ color: "var(--kupfer-tief)" }}>
            hm-labs.de
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Umsatzsteuer">
        <p>
          Gemäß § 19 UStG (Kleinunternehmerregelung) wird keine Umsatzsteuer
          berechnet und ausgewiesen. Eine Umsatzsteuer-Identifikationsnummer
          liegt derzeit nicht vor.
          {/* Steuernummer nachtragen, sobald vergeben (offene Entscheidung 8) */}
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>Henry Mirus (Anschrift wie oben)</p>
      </LegalSection>

      <LegalSection title="Haftung für Inhalte">
        <p>
          Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine
          rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung
          oder Sperrung der Nutzung von Informationen nach den allgemeinen
          Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist
          jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
          Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
          Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Links">
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
          der Seiten verantwortlich. Die verlinkten Seiten wurden zum
          Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
          Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
          erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
          derartige Links umgehend entfernen.
        </p>
      </LegalSection>

      <LegalSection title="Urheberrecht">
        <p>
          Die durch den Seitenbetreiber erstellten Inhalte und Werke auf
          diesen Seiten unterliegen dem deutschen Urheberrecht. Die
          Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
          Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
          schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          Downloads und Kopien dieser Seite sind nur für den privaten, nicht
          kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser
          Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte
          Dritter beachtet. Bei Bekanntwerden von Rechtsverletzungen werden
          wir derartige Inhalte umgehend entfernen.
        </p>
      </LegalSection>

      <LegalSection title="Streitschlichtung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="via-link"
            style={{ color: "var(--kupfer-tief)" }}
          >
            https://ec.europa.eu/consumers/odr
          </a>
          . Wir sind nicht bereit oder verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen. Unser Angebot richtet sich ausschließlich an
          Unternehmer im Sinne des § 14 BGB.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
