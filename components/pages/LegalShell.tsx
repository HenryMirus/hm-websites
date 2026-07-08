/**
 * Gemeinsamer Rahmen der Rechtsseiten (DE-only, Masterplan §5.9).
 */
import SiteShell from "@/components/site/SiteShell";
import type { ReactNode } from "react";

export function LegalShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <SiteShell lang="de">
      <article className="mx-auto max-w-prose px-6 pb-24 pt-20">
        <p className="eyebrow mb-3" style={{ color: "var(--kupfer-tief)" }}>
          {eyebrow}
        </p>
        <h1 className="h-section">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-[0.875rem]" style={{ color: "var(--text-gedimmt)" }}>
            {subtitle}
          </p>
        )}
        <div className="mt-12 space-y-10">{children}</div>
      </article>
    </SiteShell>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="border-l-2 pl-6"
      style={{ borderColor: "var(--linie)" }}
    >
      <h2 className="h-sub mb-3 text-[1.05rem]">{title}</h2>
      <div
        className="space-y-3 text-[0.9rem] leading-relaxed"
        style={{ color: "var(--text-gedimmt)" }}
      >
        {children}
      </div>
    </section>
  );
}
