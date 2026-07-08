import Link from "next/link";

/**
 * 404 — „Leiterbahn unterbrochen." (Masterplan §6.2)
 * Monogramm mit sichtbar getrennter Bahn, Link-Liste der Kernseiten.
 */
export default function NotFound() {
  return (
    <div
      className="on-lack dot-grid flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--lack)", color: "var(--text-invers)" }}
    >
      {/* Monogramm mit unterbrochener Bahn */}
      <svg width="120" height="100" viewBox="0 0 48 40" fill="none" aria-hidden="true">
        <path
          d="M5 8 V21 L9 25 H13 L17 21 V15"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Bruchstelle */}
        <path
          d="M25 11 H25.5 M29 15 V21 L33 25 H36"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.45"
        />
        <circle cx="5" cy="5.5" r="2.4" stroke="var(--kupfer-hell)" strokeWidth="1.8" />
        <circle cx="39" cy="25" r="2.4" stroke="var(--kupfer-hell)" strokeWidth="1.8" />
      </svg>

      <p className="eyebrow mt-10" style={{ color: "var(--kupfer-hell)" }}>
        [404] SIGNAL NICHT GEFUNDEN
      </p>
      <h1 className="h-section mt-3">Leiterbahn unterbrochen.</h1>
      <p className="mt-4 max-w-md" style={{ color: "var(--text-invers-ged)" }}>
        Die angeforderte Seite existiert nicht (mehr). Diese Verbindungen führen weiter:
      </p>

      <nav aria-label="Kernseiten" className="mt-10">
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {[
            { href: "/", label: "Startseite" },
            { href: "/leistungen", label: "Leistungen" },
            { href: "/prozess", label: "Prozess" },
            { href: "/preise", label: "Preise" },
            { href: "/kontakt", label: "Kontakt" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="via-link font-medium">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
