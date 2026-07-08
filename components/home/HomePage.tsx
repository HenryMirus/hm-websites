/**
 * Startseite — geteilt zwischen / (de) und /en.
 * Sektionsfolge S0–S9 gemäß Masterplan §5.1.
 */
import SiteShell from "@/components/site/SiteShell";
import Hero from "@/components/home/Hero";
import {
  AbschlussCta,
  BeweisBand,
  Exponat,
  Faq,
  GaioKi,
  Kontrast,
  LeistungsIndex,
  ProzessTeaser,
  Risikoabbau,
} from "@/components/home/HomeSections";
import type { Lang } from "@/content/leistungen";

export default function HomePage({ lang }: { lang: Lang }) {
  return (
    <SiteShell lang={lang}>
      <Hero lang={lang} />
      <BeweisBand lang={lang} />
      <Kontrast lang={lang} />
      <LeistungsIndex lang={lang} />
      <ProzessTeaser lang={lang} />
      <GaioKi lang={lang} />
      <Exponat lang={lang} />
      <Risikoabbau lang={lang} />
      <Faq lang={lang} />
      <AbschlussCta lang={lang} />
    </SiteShell>
  );
}
