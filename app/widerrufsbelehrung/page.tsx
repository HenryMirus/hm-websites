import type { Metadata } from "next";
import { LegalShell, LegalSections } from "@/components/legal/LegalShell";
import { widerruf, widerrufFormular, widerrufHinweis, WIDERRUF_STAND } from "@/lib/legal/widerruf";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung | HM Labs",
  description: "Widerrufsbelehrung und Muster-Widerrufsformular für Verbraucher bei HM Labs.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/widerrufsbelehrung" },
};

export default function WiderrufPage() {
  return (
    <LegalShell
      tag="// Withdrawal"
      title="Widerrufsbelehrung"
      intro={widerrufHinweis}
      stand={WIDERRUF_STAND}
      current="/widerrufsbelehrung"
    >
      <LegalSections abschnitte={widerruf} />

      <section className="rounded-xl border border-[#1E1E2E] bg-[#111118] p-6">
        <h2 className="text-[#EEEEFF] font-semibold text-base mb-2">{widerrufFormular.heading}</h2>
        <p className="text-sm text-[#EEEEFF]/70 mb-4">{widerrufFormular.hinweis}</p>
        <p className="text-sm text-[#EEEEFF]/70 mb-1">An:</p>
        {widerrufFormular.empfaenger.map((z) => (
          <p key={z} className="text-sm text-[#EEEEFF]/90">{z}</p>
        ))}
        <ul className="mt-5 space-y-4">
          {widerrufFormular.felder.map((f) => (
            <li key={f} className="text-sm text-[#EEEEFF]/70">
              {f}
              <span aria-hidden className="mt-2 block h-px bg-[#1E1E2E]" />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[#7C7CA0]">{widerrufFormular.fussnote}</p>
      </section>
    </LegalShell>
  );
}
