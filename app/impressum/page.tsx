import Link from "next/link";
import type { Metadata } from "next";
import { EMAIL } from "@/lib/config/email";

export const metadata: Metadata = {
  title: "Impressum — HM Labs",
  description: "Impressum und Anbieterkennzeichnung von HM Labs.",
  robots: { index: false, follow: false },
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#09090F] text-[#EEEEFF]">
      {/* Header */}
      <header className="border-b border-[#1E1E2E] bg-[#09090F]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <picture>
              <source srcSet="/hm-labs-logo-v3.webp" type="image/webp" />
              <img src="/hm-labs-logo-v3.png" alt="HM Labs" width={24} height={24} className="rounded-md" />
            </picture>
            <span className="font-bold text-[#EEEEFF] text-sm">
              HM <span className="text-[#4F7FFF]">Labs</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-[#5A5A7A] text-sm hover:text-[#EEEEFF] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Zurück zur Startseite
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-[#4F7FFF] font-mono text-xs tracking-widest uppercase mb-3">// Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#EEEEFF] mb-4">Impressum</h1>
          <p className="text-[#5A5A7A] text-sm">
            Angaben gemäß § 5 TMG und § 55 RStV
          </p>
        </div>

        <div className="space-y-10 text-[#EEEEFF]/90">

          <Section title="Anbieter">
            <p>Henry Mirus</p>
            <p className="text-[#5A5A7A] text-sm mt-1">
              (Einzelunternehmen / Freiberufler)
            </p>
          </Section>

          <Section title="Kontakt">
            <InfoRow label="E-Mail" value={<a href={`mailto:${EMAIL.CONTACT}`} className="text-[#4F7FFF] hover:underline">{EMAIL.CONTACT}</a>} />
            <InfoRow label="Website" value={<a href="https://hm-labs.de" className="text-[#4F7FFF] hover:underline">hm-labs.de</a>} />
          </Section>

          <Section title="Umsatzsteuer-Identifikationsnummer">
            <p className="text-[#5A5A7A] text-sm">
              Eine Umsatzsteuer-Identifikationsnummer liegt gemäß § 19 UStG derzeit nicht vor (Kleinunternehmerregelung).
            </p>
          </Section>

          <Section title="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
            <p>Henry Mirus</p>
            <p className="text-[#5A5A7A] text-sm mt-1">
              (Anschrift wie oben)
            </p>
          </Section>

          <Section title="Haftung für Inhalte">
            <p className="text-sm text-[#EEEEFF]/70 leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
              Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen
              oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis
              einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </Section>

          <Section title="Haftung für Links">
            <p className="text-sm text-[#EEEEFF]/70 leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte
              auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung
              nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </Section>

          <Section title="Urheberrecht">
            <p className="text-sm text-[#EEEEFF]/70 leading-relaxed">
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
              Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
              Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte
              auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
              gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis.
              Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </Section>

          <Section title="Streitschlichtung">
            <p className="text-sm text-[#EEEEFF]/70 leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4F7FFF] hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet,
              an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </Section>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[#1E1E2E] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-[#5A5A7A]">
            © {new Date().getFullYear()} HM Labs · Alle Rechte vorbehalten.
          </span>
          <div className="flex gap-6">
            <Link href="/impressum" className="text-xs text-[#4F7FFF]">Impressum</Link>
            <Link href="/datenschutz" className="text-xs text-[#5A5A7A] hover:text-[#EEEEFF] transition-colors">Datenschutz</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-[#1E1E2E] pl-6">
      <h2 className="text-[#EEEEFF] font-semibold text-base mb-3">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 text-sm">
      <span className="text-[#5A5A7A] w-32 shrink-0">{label}</span>
      <span>{value}</span>
    </div>
  );
}
