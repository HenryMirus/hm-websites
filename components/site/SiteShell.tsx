/**
 * SiteShell — Rahmen aller Marketing-Seiten:
 * Skip-Link → Header → <main> (mit Signalleitung) → Footer.
 * Portal/OS nutzen eigene Shells und bleiben unberührt.
 */
import type { ReactNode } from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Signalleitung from "@/components/animations/Signalleitung";
import type { Lang } from "@/content/leistungen";

export default function SiteShell({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  return (
    <>
      <a href="#inhalt" className="skip-link btn-pad">
        {lang === "de" ? "Zum Inhalt springen" : "Skip to content"}
      </a>
      <Header lang={lang} />
      <div className="relative">
        <Signalleitung />
        <main id="inhalt" className="pt-16">
          {children}
        </main>
      </div>
      <Footer lang={lang} />
    </>
  );
}
