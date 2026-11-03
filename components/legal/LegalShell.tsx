import Link from "next/link";

/**
 * Gemeinsame Hülle der Rechtsseiten (AGB, Widerrufsbelehrung): Kopf mit Logo
 * und Rücklink, Fußzeile mit allen Rechtslinks. Optik wie /impressum und
 * /datenschutz.
 */

export interface RechtsAbschnitt {
  heading: string;
  paragraphs?: string[];
  liste?: string[];
  nachsatz?: string[];
}

const LEGAL_LINKS = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
  { href: "/widerrufsbelehrung", label: "Widerrufsbelehrung" },
];

export function LegalShell({
  tag,
  title,
  intro,
  stand,
  current,
  children,
}: {
  tag: string;
  title: string;
  intro?: string;
  stand: string;
  current: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#09090F] text-[#EEEEFF]">
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
            className="flex items-center gap-2 text-[#7C7CA0] text-sm hover:text-[#EEEEFF] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Zurück zur Startseite
          </Link>
        </div>
      </header>

      <main id="main" className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-[#4F7FFF] font-mono text-xs tracking-widest uppercase mb-3">{tag}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#EEEEFF] mb-4">{title}</h1>
          {intro && <p className="text-[#EEEEFF]/70 text-sm mb-2">{intro}</p>}
          <p className="text-[#7C7CA0] text-sm">Stand: {stand}</p>
        </div>

        <div className="space-y-10 text-[#EEEEFF]/90">{children}</div>

        <LegalFooter current={current} />
      </main>
    </div>
  );
}

export function LegalFooter({ current }: { current: string }) {
  return (
    <div className="mt-16 pt-8 border-t border-[#1E1E2E] flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-mono text-xs text-[#7C7CA0]">
        © {new Date().getFullYear()} HM Labs · Alle Rechte vorbehalten.
      </span>
      <nav aria-label="Rechtliches" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {LEGAL_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={l.href === current ? "page" : undefined}
            className={
              l.href === current
                ? "text-xs text-[#4F7FFF]"
                : "text-xs text-[#7C7CA0] hover:text-[#EEEEFF] transition-colors"
            }
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function LegalSections({ abschnitte }: { abschnitte: RechtsAbschnitt[] }) {
  return (
    <>
      {abschnitte.map((a) => (
        <section key={a.heading} className="border-l-2 border-[#1E1E2E] pl-6">
          <h2 className="text-[#EEEEFF] font-semibold text-base mb-3">{a.heading}</h2>
          <div className="space-y-3 text-sm text-[#EEEEFF]/70 leading-relaxed">
            {a.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
            {a.liste && (
              <ul className="list-disc pl-5 space-y-1">
                {a.liste.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
            {a.nachsatz?.map((p, i) => <p key={`n${i}`}>{p}</p>)}
          </div>
        </section>
      ))}
    </>
  );
}
