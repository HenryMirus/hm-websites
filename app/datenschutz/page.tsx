import Link from "next/link";
import type { Metadata } from "next";
import { EMAIL } from "@/lib/config/email";
import { MAIN_DOMAIN } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | HM Labs",
  description: "Datenschutzerklärung und Informationen zur Datenverarbeitung von HM Labs.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#09090F] text-[#EEEEFF]">
      {/* Header */}
      <header className="border-b border-[#1E1E2E] bg-[#09090F]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
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
            className="flex items-center gap-2 text-[#7C7CA0] text-sm hover:text-[#EEEEFF] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Zurück zur Startseite
          </Link>
        </div>
      </header>

      {/* Content */}
      <main id="main" className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-[#4F7FFF] font-mono text-xs tracking-widest uppercase mb-3">// Privacy</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#EEEEFF] mb-4">Datenschutzerklärung</h1>
          <p className="text-[#7C7CA0] text-sm">
            Stand: Oktober 2026
          </p>
        </div>

        <div className="space-y-10 text-[#EEEEFF]/90">

          <Section title="1. Verantwortlicher">
            <p className="text-sm leading-relaxed text-[#EEEEFF]/70">
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
            </p>
            <div className="mt-3 text-sm space-y-1">
              <p className="font-medium">Henry Mirus, HM Labs</p>
              <p className="text-[#7C7CA0]">Pantaleonstraße 20, 53567 Buchholz (Westerwald)</p>
              <p className="text-[#7C7CA0]">E-Mail:{" "}
                <a href={`mailto:${EMAIL.CONTACT}`} className="text-[#4F7FFF] hover:underline">{EMAIL.CONTACT}</a>
              </p>
              <p className="text-[#7C7CA0]">Website: {MAIN_DOMAIN}</p>
            </div>
          </Section>

          <Section title="2. Erhebung und Verarbeitung personenbezogener Daten">
            <Subsection title="2.1 Server-Logs">
              <p>
                Beim Besuch dieser Website werden durch den Hosting-Anbieter automatisch Informationen in sogenannten Server-Log-Dateien gespeichert,
                die Ihr Browser an uns übermittelt. Dazu gehören: IP-Adresse (anonymisiert), Browsertyp, Betriebssystem, Referrer-URL, Datum und Uhrzeit des Zugriffs.
                Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und nach spätestens 7 Tagen gelöscht.
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Sicherheit und Stabilität des Angebots).
              </p>
            </Subsection>
            <Subsection title="2.2 Kontaktformular">
              <p>
                Wenn Sie das Kontaktformular oder den Projekt-Wizard nutzen, werden die von Ihnen eingegebenen Daten (Name, E-Mail-Adresse,
                Unternehmen, optional Telefonnummer, Nachricht sowie Ihre Antworten im Wizard) zur Bearbeitung Ihrer Anfrage verarbeitet.
                Diese Daten werden nicht ohne Ihre Einwilligung weitergegeben und nach Abschluss der Anfrage gelöscht, sofern keine
                gesetzlichen Aufbewahrungspflichten bestehen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung / vorvertragliche Maßnahmen).
              </p>
              <p className="mt-3">
                Aus Ihren Wizard-Antworten wird intern automatisiert ein Orientierungswert berechnet, der mir hilft, eingehende Anfragen
                zu priorisieren und mich schneller auf relevante Details vorzubereiten. Dieser Wert dient ausschließlich der internen
                Einordnung, ist für niemanden außer mir sichtbar und hat keine automatisierte Ablehnung oder sonstige rechtliche Wirkung
                zur Folge. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an effizienter Anfragebearbeitung).
              </p>
              <p className="mt-3">
                Nach dem Absenden erhalten Sie an die angegebene E-Mail-Adresse eine automatische Eingangsbestätigung, und ich
                werde per E-Mail über die Anfrage benachrichtigt. Beide E-Mails werden über das E-Mail-Postfach von HM Labs bei
                Hostinger (siehe Abschnitt 4) versendet und dort gespeichert, bis die Anfrage abgeschlossen ist und keine
                Aufbewahrungspflichten mehr bestehen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
              </p>
            </Subsection>
            <Subsection title="2.3 E-Mail-Kontakt">
              <p>
                Wenn Sie uns per E-Mail kontaktieren, werden die übermittelten Daten zum Zweck der Bearbeitung Ihrer Anfrage verarbeitet
                und gespeichert. Eine Weitergabe an Dritte erfolgt nicht. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
              </p>
            </Subsection>
          </Section>

          <Section title="3. Cookies">
            <p className="text-sm leading-relaxed text-[#EEEEFF]/70 mb-4">
              Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden.
              Wir unterscheiden folgende Kategorien:
            </p>
            <div className="space-y-4">
              <CookieCategory
                name="Notwendige Cookies"
                basis="Art. 6 Abs. 1 lit. f DSGVO"
                description="Diese Cookies sind für den Betrieb der Website unbedingt erforderlich. Sie ermöglichen grundlegende Funktionen wie Seitennavigation und den Zugang zu sicheren Bereichen. Ohne diese Cookies kann die Website nicht ordnungsgemäß funktionieren."
                examples={["Session-ID", "Spracheinstellung", "Cookie-Einwilligung"]}
                retention="Sitzung oder bis zu 1 Jahr"
                optional={false}
              />
              <CookieCategory
                name="Analyse-Cookies"
                basis="Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)"
                description="Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren. Wir nutzen Google Analytics 4 (Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland). Die IP-Adresse wird anonymisiert (IP-Anonymisierung aktiviert). Mit Google wurde ein Auftragsverarbeitungsvertrag (AV-Vertrag) gem. Art. 28 DSGVO abgeschlossen."
                examples={["Seitenaufrufe", "Verweildauer", "Einstiegs-/Ausstiegsseiten", "_ga", "_ga_XXXXXXX"]}
                retention="Bis zu 2 Jahre"
                optional
              />
              <CookieCategory
                name="Marketing-Cookies"
                basis="Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)"
                description="Diese Cookies werden verwendet, um Besuchern relevante Werbung zu zeigen und Werbekampagnen auszuwerten. Folgende Anbieter werden eingesetzt: Meta Pixel (Meta Platforms Ireland Ltd., 4 Grand Canal Square, Dublin 2, Irland) für Facebook/Instagram-Werbung; Google Ads (Google Ireland Ltd.) für Google-Suchanzeigen und Remarketing; LinkedIn Insight Tag (LinkedIn Ireland Unlimited Company, Wilton Place, Dublin 2, Irland) für B2B-Werbung auf LinkedIn."
                examples={["_fbp", "_fbc", "fr", "Google Ads ID", "li_sugr"]}
                retention="Bis zu 1 Jahr"
                optional
              />
            </div>
            <p className="text-sm text-[#7C7CA0] mt-4">
              Sie können Ihre Cookie-Einwilligung jederzeit über das Cookie-Icon rechts unten auf der Seite ändern oder widerrufen.
            </p>
          </Section>

          <Section title="4. Hosting & Drittanbieter">
            <Subsection title="Hostinger (Server und E-Mail)">
              <p>
                Diese Website läuft auf einem eigenen Server bei der Hostinger International Ltd. (61 Lordou Vironos Street,
                6023 Larnaca, Zypern). Über Hostinger laufen außerdem die E-Mail-Postfächer von HM Labs, also auch E-Mails, die
                Sie mir schreiben oder die das Kontaktformular auslöst. Hostinger verarbeitet dabei Verbindungs- und
                Inhaltsdaten in meinem Auftrag (Art. 28 DSGVO). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (sicherer und
                zuverlässiger Betrieb). Weitere Informationen:{" "}
                <a href="https://www.hostinger.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#4F7FFF] hover:underline">
                  hostinger.com/legal/privacy-policy
                </a>
              </p>
            </Subsection>
            <Subsection title="Supabase">
              <p>
                Für Datenbankdienste nutzen wir Supabase (Supabase Inc., San Francisco, CA, USA) mit EU-Hosting (Frankfurt).
                Supabase verarbeitet Kontaktformulardaten gemäß DSGVO. Weitere Informationen:{" "}
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#4F7FFF] hover:underline">
                  supabase.com/privacy
                </a>
              </p>
            </Subsection>
            <Subsection title="Schriftarten">
              <p>
                Die verwendeten Schriftarten liegen auf dem Server dieser Website. Beim Laden der Seite wird keine Verbindung
                zu Google oder anderen Schriftanbietern hergestellt.
              </p>
            </Subsection>
            <Subsection title="Google Analytics 4 (nur mit Einwilligung)">
              <p>
                Mit Ihrer Einwilligung setzen wir Google Analytics 4 ein, einen Webanalysedienst der Google Ireland Ltd.
                (Gordon House, Barrow Street, Dublin 4, Irland). Google Analytics verwendet Cookies, um die Nutzung der
                Website zu analysieren. Die dabei erzeugten Informationen (inkl. anonymisierter IP-Adresse) werden an
                Google-Server übertragen. Wir haben IP-Anonymisierung aktiviert und einen AV-Vertrag gem. Art. 28 DSGVO
                abgeschlossen. Widerspruch: Sie können die Erfassung jederzeit durch Abwahl der Analyse-Cookies verhindern.
                Weitere Informationen:{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#4F7FFF] hover:underline">
                  policies.google.com/privacy
                </a>
              </p>
            </Subsection>
            <Subsection title="Google Ads (nur mit Einwilligung)">
              <p>
                Mit Ihrer Einwilligung nutzen wir Google Ads-Conversion-Tracking (Google Ireland Ltd.). Dabei wird ein
                Cookie gesetzt, wenn Sie auf eine unserer Anzeigen klicken. So können wir nachvollziehen, ob nach einem
                Anzeigenklick eine Anfrage auf unserer Website eingegangen ist. Die erhobenen Daten werden pseudonymisiert
                verarbeitet. Widerspruch: Abwahl der Marketing-Cookies im Cookie-Banner.
              </p>
            </Subsection>
            <Subsection title="Meta Pixel (nur mit Einwilligung)">
              <p>
                Mit Ihrer Einwilligung verwenden wir den Meta Pixel der Meta Platforms Ireland Ltd.
                (4 Grand Canal Square, Dublin 2, Irland). Der Meta Pixel ermöglicht es uns, die Wirksamkeit von
                Facebook- und Instagram-Werbeanzeigen zu messen und Besuchern dieser Website auf Meta-Plattformen
                relevante Inhalte zu zeigen (Retargeting). Die Daten werden gemäß den Standardvertragsklauseln der
                EU verarbeitet. Widerspruch: Abwahl der Marketing-Cookies im Cookie-Banner oder unter{" "}
                <a href="https://www.facebook.com/settings/?tab=ads" target="_blank" rel="noopener noreferrer" className="text-[#4F7FFF] hover:underline">
                  facebook.com/settings/?tab=ads
                </a>.
              </p>
            </Subsection>
            <Subsection title="LinkedIn Insight Tag (nur mit Einwilligung)">
              <p>
                Mit Ihrer Einwilligung nutzen wir den LinkedIn Insight Tag der LinkedIn Ireland Unlimited Company
                (Wilton Place, Dublin 2, Irland). Dieser ermöglicht die Erfolgsmessung von LinkedIn-Kampagnen und
                Retargeting gegenüber Besuchern dieser Website auf LinkedIn. Widerspruch: Abwahl der Marketing-Cookies
                im Cookie-Banner oder unter{" "}
                <a href="https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out" target="_blank" rel="noopener noreferrer" className="text-[#4F7FFF] hover:underline">
                  LinkedIn Opt-out
                </a>.
              </p>
            </Subsection>
          </Section>

          <Section title="5. Ihre Rechte">
            <p className="text-sm text-[#EEEEFF]/70 mb-4">
              Sie haben folgende Rechte bezüglich Ihrer bei uns gespeicherten personenbezogenen Daten:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { right: "Auskunftsrecht", desc: "Art. 15 DSGVO: Auskunft über verarbeitete Daten" },
                { right: "Berichtigungsrecht", desc: "Art. 16 DSGVO: Korrektur unrichtiger Daten" },
                { right: "Löschungsrecht", desc: "Art. 17 DSGVO: Löschung Ihrer Daten" },
                { right: "Einschränkung", desc: "Art. 18 DSGVO: Einschränkung der Verarbeitung" },
                { right: "Datenübertragbarkeit", desc: "Art. 20 DSGVO: Daten in maschinenlesbarem Format" },
                { right: "Widerspruchsrecht", desc: "Art. 21 DSGVO: Widerspruch gegen Verarbeitung" },
              ].map(({ right, desc }) => (
                <div key={right} className="rounded-lg border border-[#1E1E2E] p-3 bg-[#111118]">
                  <p className="text-xs font-semibold text-[#EEEEFF] mb-1">{right}</p>
                  <p className="text-[10px] text-[#7C7CA0] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#7C7CA0] mt-4">
              Zur Ausübung Ihrer Rechte wenden Sie sich an:{" "}
              <a href={`mailto:${EMAIL.CONTACT}`} className="text-[#4F7FFF] hover:underline">{EMAIL.CONTACT}</a>.
              Sie haben außerdem das Recht, bei der zuständigen Datenschutzaufsichtsbehörde Beschwerde einzulegen.
            </p>
          </Section>

          <Section title="6. Datensicherheit">
            <p className="text-sm leading-relaxed text-[#EEEEFF]/70">
              Diese Website nutzt SSL-Verschlüsselung (HTTPS) für die Übertragung Ihrer Daten. Wir ergreifen technische und
              organisatorische Maßnahmen gemäß Art. 32 DSGVO, um Ihre Daten zu schützen. Die Website läuft auf einem eigenen
              Server bei Hostinger, die Datenbank bei Supabase in der EU (Frankfurt).
            </p>
          </Section>

          <Section title="7. Widerspruch gegen Werbe-Mails">
            <p className="text-sm leading-relaxed text-[#EEEEFF]/70">
              Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich
              angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Der Betreiber dieser Website behält sich
              ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen vor.
            </p>
          </Section>

          <Section title="8. Änderungen dieser Datenschutzerklärung">
            <p className="text-sm leading-relaxed text-[#EEEEFF]/70">
              Wir behalten uns das Recht vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder bei
              Änderungen des Dienstes und der Datenverarbeitung anzupassen. Die aktuelle Version ist stets auf dieser Seite abrufbar.
            </p>
          </Section>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[#1E1E2E] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-[#7C7CA0]">
            © {new Date().getFullYear()} HM Labs · Alle Rechte vorbehalten.
          </span>
          <div className="flex gap-6">
            <Link href="/impressum" className="text-xs text-[#7C7CA0] hover:text-[#EEEEFF] transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-xs text-[#4F7FFF]">Datenschutz</Link>
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
      <div className="text-sm text-[#EEEEFF]/70 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-[#EEEEFF]/90 font-medium text-xs uppercase tracking-wider mb-2">{title}</h3>
      <div className="text-sm text-[#EEEEFF]/70 leading-relaxed">{children}</div>
    </div>
  );
}

function CookieCategory({
  name,
  basis,
  description,
  examples,
  retention,
  optional,
}: {
  name: string;
  basis: string;
  description: string;
  examples: string[];
  retention: string;
  optional: boolean;
}) {
  return (
    <div className="rounded-lg border border-[#1E1E2E] bg-[#111118] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E2E]">
        <p className="text-[#EEEEFF] text-sm font-medium">{name}</p>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
            optional
              ? "bg-[#1E1E2E] text-[#7C7CA0]"
              : "bg-[#4F7FFF]/15 text-[#4F7FFF]"
          }`}
        >
          {optional ? "optional" : "erforderlich"}
        </span>
      </div>
      <div className="px-4 py-3 space-y-2">
        <p className="text-xs text-[#7C7CA0]">
          <span className="text-[#EEEEFF]/50">Rechtsgrundlage:</span> {basis}
        </p>
        <p className="text-xs text-[#EEEEFF]/60 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {examples.map((ex) => (
            <span key={ex} className="text-[10px] px-2 py-0.5 rounded bg-[#1E1E2E] text-[#7C7CA0] font-mono">
              {ex}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-[#7C7CA0]">
          <span className="text-[#EEEEFF]/40">Speicherdauer:</span> {retention}
        </p>
      </div>
    </div>
  );
}
