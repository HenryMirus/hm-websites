import HtmlLang from "@/components/site/HtmlLang";

/**
 * /en-Segment: setzt <html lang="en"> clientseitig (das Root-Layout rendert
 * lang="de" — ein eigenes Root-Layout pro Sprache ist in App-Router-Struktur
 * ohne [lang]-Segment nicht möglich; DE bleibt kanonisch).
 */
export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HtmlLang lang="en" />
      {children}
    </>
  );
}
