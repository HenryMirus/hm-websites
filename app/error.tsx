"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Globale Error-Boundary — Leiterbahn-CI, bewusst schlicht. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="on-lack dot-grid flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--lack)", color: "var(--text-invers)" }}
    >
      <p className="eyebrow" style={{ color: "var(--kupfer-hell)" }}>
        [500] SIGNALFEHLER
      </p>
      <h1 className="h-section mt-3">Da ist etwas schiefgelaufen.</h1>
      <p className="mt-4 max-w-md" style={{ color: "var(--text-invers-ged)" }}>
        Ein unerwarteter Fehler ist aufgetreten. Versuchen Sie es erneut —
        oder kehren Sie zur Startseite zurück.
      </p>
      <div className="mt-8 flex gap-4">
        <button type="button" onClick={reset} className="btn-pad">
          Erneut versuchen
        </button>
        <Link href="/" className="btn-ghost">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
