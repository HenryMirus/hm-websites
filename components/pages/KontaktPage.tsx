/**
 * /kontakt (Masterplan §5.7) — Conversion mit minimaler Hürde.
 * Zweispaltig asymmetrisch: links Formular, rechts Kontextblock.
 */
import SiteShell from "@/components/site/SiteShell";
import ContactForm from "@/components/pages/ContactForm";
import { EMAIL } from "@/lib/config/email";
import type { Lang } from "@/content/leistungen";

const T = {
  eyebrow: { de: "[S0] KONTAKT & ANFRAGE", en: "[S0] CONTACT & INQUIRY" },
  h1: {
    de: "Erzählen Sie uns, was Sie bauen wollen.",
    en: "Tell us what you want to build.",
  },
  danach: { de: "Was nach dem Absenden passiert", en: "What happens after you send" },
  schritte: {
    de: [
      "Sie erhalten in der Regel innerhalb eines Werktags eine persönliche Antwort — von Henry, nicht von einem Autoresponder.",
      "Wir vereinbaren ein kostenloses Erstgespräch (30–45 Minuten, remote).",
      "Sie bekommen eine unverbindliche Einschätzung mit Preisspanne — und entscheiden dann in Ruhe.",
    ],
    en: [
      "You usually receive a personal reply within one business day — from Henry, not an autoresponder.",
      "We arrange a free initial consultation (30–45 minutes, remote).",
      "You get a non-binding assessment with a price range — and then decide at your own pace.",
    ],
  },
  alternativ: { de: "Lieber direkt?", en: "Prefer directly?" },
} as const;

export default function KontaktPage({ lang }: { lang: Lang }) {
  return (
    <SiteShell lang={lang}>
      <section className="mx-auto max-w-content px-6 pb-24 pt-20" data-via id="anfrage">
        <p className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
          {T.eyebrow[lang]}
        </p>
        <h1 className="h-display max-w-3xl" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}>
          {T.h1[lang]}
        </h1>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          {/* links: Formular */}
          <div>
            <ContactForm lang={lang} />
          </div>

          {/* rechts: Kontextblock */}
          <aside className="space-y-10 self-start">
            <div className="corner-frame p-7">
              <p className="eyebrow mb-4" style={{ color: "var(--kupfer-tief)" }}>
                {T.danach[lang]}
              </p>
              <ol className="space-y-4">
                {T.schritte[lang].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="testpunkt">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[0.875rem]" style={{ color: "var(--text-gedimmt)" }}>
                      {s}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
                {T.alternativ[lang]}
              </p>
              <p>
                <a href={`mailto:${EMAIL.CONTACT}`} className="via-link font-medium">
                  {EMAIL.CONTACT}
                </a>
              </p>
              <address className="mt-4 text-[0.875rem] not-italic" style={{ color: "var(--text-gedimmt)" }}>
                HM Labs
                <br />
                Pantaleonstraße 20
                <br />
                53567 Buchholz (Westerwald)
              </address>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
