/**
 * Kundenprojekte: einzige Datenquelle für die Projekt-Kacheln auf der
 * Startseite, die Unterseiten /projekte/[slug], die Sitemap und das Logo-Band.
 *
 * Regeln (verbindlich):
 *   - Gerendert wird NUR, was `published: true` hat. Erst setzen, wenn eine
 *     schriftliche Freigabe des Kunden vorliegt.
 *   - Inhalte nur aus belegten Fakten (Vault: 10-Kunden/<kunde>/…). Keine
 *     Preise, Budgets, Kontaktdaten von Personen, internen Notizen, offenen
 *     Punkte oder Meinungsverschiedenheiten.
 *   - Fehlt ein Wert, bleibt das Feld leer und bekommt ein TODO(Henry), statt
 *     geschätzt zu werden.
 *   - Sichtbare Texte: Sie-Anrede, Ich-Perspektive, keine Gedankenstriche.
 *
 * Diese Datei wird nur von Server Components importiert (app/page.tsx,
 * app/projekte/[slug]/page.tsx, app/sitemap.ts). Client Components bekommen
 * ausschließlich die bereits gefilterten, veröffentlichten Einträge als Props,
 * damit unveröffentlichte Kunden nicht im JavaScript-Bundle landen.
 */
import type { Lang } from "@/lib/translations";

export type I18n = Record<Lang, string>;

export interface KundenLogo {
  /** Pfad unter /public */
  src: string;
  /** Natürliche Abmessungen, für reservierten Platz (kein Layout-Shift) */
  width: number;
  height: number;
  alt: I18n;
}

export interface ProjektBaustein {
  titel: I18n;
  text: I18n;
}

export interface KundenProjekt {
  slug: string;
  /** Mono-Kennung im Kartenkopf, z. B. CLIENT_01 */
  caseId: string;
  /** Kundenname, wie er öffentlich auftritt */
  kunde: string;
  /** Rechtsform/Firmenname, falls abweichend vom Auftritt */
  firma?: string;
  branche: I18n;
  logo: KundenLogo;
  /** Kurzer Teaser für Kachel und Meta-Description */
  teaser: I18n;
  /** Was der Betrieb brauchte */
  ausgangslage: I18n;
  /** Was gebaut wurde */
  gebaut: ProjektBaustein[];
  /** Bemerkenswerte Entscheidungen, laienverständlich erklärt */
  entscheidungen: ProjektBaustein[];
  /** Beteiligte Leistungen (Schlagworte) */
  leistungen: I18n[];
  jahr?: number;
  liveUrl?: string;
  published: boolean;
}

export const KUNDENPROJEKTE: KundenProjekt[] = [
  // ─── SKM Brennholz ──────────────────────────────────────────────────────────
  // Freigabe: schriftlich erteilt (laut Henry).
  // Quellen: hm-vault/10-Kunden/skm-gbr/kontext.md und Projekte/HM-001/
  // (Uebersicht, Briefing, Projektplan, Entscheidungen).
  {
    slug: "skm-brennholz",
    caseId: "CLIENT_01",
    kunde: "SKM Brennholz",
    firma: "SKM GbR",
    branche: { de: "Regionaler Brennholzbetrieb", en: "Regional firewood business" },
    logo: {
      src: "/kunden/skm-logo.svg",
      width: 928,
      height: 511,
      alt: { de: "Logo von SKM Brennholz", en: "SKM Brennholz logo" },
    },
    teaser: {
      de: "Website mit Bestell-Assistent für einen regionalen Brennholzbetrieb: Holz anfragen, ohne vorher anrufen zu müssen.",
      en: "Website with an order assistant for a regional firewood business: request firewood without having to call first.",
    },
    ausgangslage: {
      de: "SKM Brennholz ist ein junger Brennholzbetrieb aus Asbach. Das Holz kommt als Stammholz von einem Forstbetrieb aus der Region, wird abgelängt, gespalten, ein bis zwei Jahre getrocknet und vor dem Verkauf auf Wunschlänge geschnitten. Anfragen kamen bisher mündlich und wurden per Messenger abgestimmt. Der Betrieb brauchte einen Auftritt, über den man ihn überhaupt findet, und eine Möglichkeit, Holz zu bestellen, ohne vorher mit jemandem sprechen zu müssen.",
      en: "SKM Brennholz is a young firewood business from Asbach, Germany. The wood arrives as logs from a regional forestry operation, is cut to length, split, dried for one to two years and cut to the requested length before sale. Until now, requests came in by word of mouth and were coordinated via messenger. The business needed a presence people can actually find, and a way to order firewood without having to talk to someone first.",
    },
    gebaut: [
      {
        titel: { de: "Onepager-Website", en: "One-page website" },
        text: {
          de: "Alle Inhalte auf einer Seite: Sortiment, der Weg vom Stammholz zum Scheit, wer hinter dem Betrieb steht, Liefergebiet und Kontakt. Impressum, Datenschutz, AGB und Widerrufsbelehrung liegen als eigene Seiten daneben.",
          en: "All content on one page: product range, the path from log to split firewood, who is behind the business, delivery area and contact. Imprint, privacy policy, terms and cancellation policy sit alongside as separate pages.",
        },
      },
      {
        titel: { de: "Bestell-Assistent", en: "Order assistant" },
        text: {
          de: "Schritt für Schritt zur Anfrage: Holzart, Menge, Scheitlänge, Wunschtermin, Lieferung oder Selbstabholung. Die Lieferkosten werden aus der Entfernung automatisch berechnet. Die Anfrage landet direkt in der Kundenverwaltung des Betriebs und wird erst mit der Bestellbestätigung per E-Mail verbindlich.",
          en: "Step by step to a request: type of wood, quantity, log length, preferred date, delivery or pickup. Delivery costs are calculated automatically from the distance. The request goes straight into the business's customer management and only becomes binding with the order confirmation by email.",
        },
      },
      {
        titel: { de: "Preisliste als PDF-Generator", en: "Price list as a PDF generator" },
        text: {
          de: "Die Preisliste zum Download entsteht automatisch aus einer Datendatei, im Design der Preisliste, die der Betrieb schon hatte. Für eine neue Auflage ändert man die Daten, nicht das Layout.",
          en: "The downloadable price list is generated automatically from a data file, in the design of the price list the business already had. A new edition means changing the data, not the layout.",
        },
      },
      {
        titel: { de: "Liefergebiet-Karte", en: "Delivery area map" },
        text: {
          de: "Eine interaktive Karte zeigt die Lieferzonen rund um den Standort. Die Zonen kommen direkt aus der Kundenverwaltung, eine Änderung dort ist sofort auf der Website sichtbar.",
          en: "An interactive map shows the delivery zones around the yard. The zones come straight from the customer management, so a change there is visible on the website right away.",
        },
      },
    ],
    entscheidungen: [
      {
        titel: { de: "Erst die Website, dann der Shop", en: "Website first, shop second" },
        text: {
          de: "Ein vollständiger Shop muss wissen, welches Holz zum Liefertermin trocken ist. Dafür braucht es eine Bestandsführung, die es noch nicht gab. Statt darauf zu warten, habe ich in zwei Stufen geplant: zuerst die Website mit allen Inhalten, danach Shop und Bestandsführung. Bis dahin nimmt der Bestell-Assistent Anfragen entgegen, und ein Mensch prüft und bestätigt sie.",
          en: "A complete shop has to know which wood will be dry by the delivery date. That requires stock management that did not exist yet. Instead of waiting for it, I planned in two stages: first the website with all content, then the shop and stock management. Until then, the order assistant takes requests, and a person checks and confirms them.",
        },
      },
      {
        titel: { de: "Eine Seite statt vieler", en: "One page instead of many" },
        text: {
          de: "Für einen jungen Betrieb gab es nicht genug Inhalt für fünf Unterseiten. Auf einer Seite liest sich alles am Stück, und keine Seite wirkt leer.",
          en: "For a young business there was not enough content for five subpages. On a single page everything reads in one go, and no page looks empty.",
        },
      },
      {
        titel: { de: "Die eigene Preisliste als Gestaltungsvorlage", en: "The business's own price list as the design template" },
        text: {
          de: "Der Betrieb hatte bereits eine Preisliste, die ihm gut gefiel. Farben und Flächen der Website sind daraus übernommen und mit dem Braun aus dem Logo kombiniert. So sehen Website und Preisliste aus einem Guss aus.",
          en: "The business already had a price list it liked. The website's colors and surfaces are taken from it and combined with the brown from the logo. That way the website and the price list look like they belong together.",
        },
      },
      {
        titel: { de: "Kartendaten erst nach Klick", en: "Map data only after a click" },
        text: {
          de: "Die Straßenkarte stammt von OpenStreetMap, also von einem externen Server. Sie lädt erst, wenn Besucher es per Klick wollen. Vorher zeigt die Karte die Lieferzonen mit Ortsnamen, ohne dass Daten an Dritte fließen.",
          en: "The street map comes from OpenStreetMap, which means an external server. It only loads when visitors choose to with a click. Before that, the map shows the delivery zones with place names, without any data going to third parties.",
        },
      },
    ],
    leistungen: [
      { de: "Onepager-Website", en: "One-page website" },
      { de: "Bestell-Assistent", en: "Order assistant" },
      { de: "PDF-Preisliste", en: "PDF price list" },
      { de: "Interaktive Karte", en: "Interactive map" },
      { de: "Rechtsseiten", en: "Legal pages" },
    ],
    // Projektstart laut Vault 01.09.2026.
    jahr: 2026,
    // TODO(Henry): Live-URL bestätigen. Im Vault ist `skm-brennholz.de` nur als
    // geplante Domain (Projektplan M5) und der Launch für den 01.11.2026 genannt,
    // nicht als erreichbare Adresse belegt.
    liveUrl: undefined,
    published: true,
  },

  // ─── TMR Unternehmensberatung ───────────────────────────────────────────────
  // Veröffentlicht nur auf dem Preview-Branch (Vorgabe Henry 28.10.2026: erst
  // Dev, nicht live). TODO(Henry): Vor dem Merge in den Live-Branch die
  // schriftliche Freigabe des Kunden bestätigen und den öffentlichen Namen
  // prüfen (Henry nannte "TMR Resource", die Website selbst nennt sich
  // "TMR Unternehmensberatung").
  // Quellen: Kunden/TMR/website (README.md, public/*.html, git log 01–04/2026).
  {
    slug: "tmr",
    caseId: "CLIENT_02",
    kunde: "TMR Unternehmensberatung",
    branche: { de: "Beratung für Abfallmanagement", en: "Waste management consultancy" },
    logo: {
      src: "/kunden/tmr-logo.webp",
      width: 640,
      height: 334,
      alt: { de: "Logo von TMR Unternehmensberatung", en: "TMR Unternehmensberatung logo" },
    },
    teaser: {
      de: "Unternehmenswebsite für einen unabhängigen Berater im Abfallmanagement: schnell, klar gegliedert und auch offline vorführbar.",
      en: "Company website for an independent waste management consultant: fast, clearly structured and presentable offline too.",
    },
    ausgangslage: {
      de: "TMR ist eine Unternehmensberatung für Abfallmanagement. Der Inhaber begleitet Unternehmen als externer Abfallbeauftragter, von der Dokumentation bis zur Einhaltung von Gewerbeabfallverordnung und Kreislaufwirtschaftsgesetz. Gebraucht wurde ein seriöser Auftritt, der die Leistungen klar erklärt und Interessenten den Weg zur Anfrage zeigt.",
      en: "TMR is a consultancy for waste management. The owner supports companies as an external waste management officer, from documentation to compliance with German commercial waste and circular economy law. The business needed a professional presence that explains the services clearly and shows prospects the way to an inquiry.",
    },
    gebaut: [
      {
        titel: { de: "Unternehmenswebsite", en: "Company website" },
        text: {
          de: "Startseite, Über mich, Leistungen, Kontakt, Impressum und Datenschutz. Kopf- und Fußbereich sind einmal angelegt und werden auf allen Seiten wiederverwendet.",
          en: "Home, about, services, contact, imprint and privacy pages. Header and footer are built once and reused on every page.",
        },
      },
      {
        titel: { de: "Suchmaschinen-Grundlagen", en: "Search engine basics" },
        text: {
          de: "Jede Seite hat eigene Titel, Beschreibungen und Vorschaubilder für Links in sozialen Netzwerken. Strukturierte Daten beschreiben das Unternehmen für Suchmaschinen, dazu kommen Sitemap und robots.txt.",
          en: "Every page has its own title, description and preview image for links on social networks. Structured data describes the business for search engines, alongside a sitemap and robots.txt.",
        },
      },
      {
        titel: { de: "Schnelle Bilder", en: "Fast images" },
        text: {
          de: "Ein Skript erzeugt aus jedem Foto moderne Bildformate in mehreren Größen. Der Browser lädt nur, was zum Bildschirm passt, und der sichtbare Bereich steht, bevor der Rest der Gestaltung geladen ist.",
          en: "A script turns every photo into modern image formats in several sizes. The browser only loads what fits the screen, and the visible area is ready before the rest of the styling has loaded.",
        },
      },
      {
        titel: { de: "Vorführversion für Windows und macOS", en: "Demo version for Windows and macOS" },
        text: {
          de: "Die Website lässt sich als Programm für Windows und als App für macOS mitgeben. Ein Doppelklick öffnet sie im Browser, ganz ohne Installation oder Internetverbindung.",
          en: "The website can be handed over as a program for Windows and an app for macOS. A double click opens it in the browser, without installation or an internet connection.",
        },
      },
    ],
    entscheidungen: [
      {
        titel: { de: "Das Sichtbare zuerst", en: "The visible part first" },
        text: {
          de: "Die Gestaltung für den ersten Bildschirm ist abgetrennt und wird vor allem anderen geladen. Besucher sehen sofort eine fertige Seite, statt auf das komplette Layout zu warten.",
          en: "The styling for the first screen is split off and loaded before everything else. Visitors see a finished page right away instead of waiting for the complete layout.",
        },
      },
      {
        titel: { de: "Statisch statt Baukasten", en: "Static instead of a site builder" },
        text: {
          de: "Für eine Beratung mit wenigen, gut gepflegten Seiten braucht es kein Redaktionssystem. Fertige Seiten aus reinem HTML sind schnell, sicher und lassen sich bei jedem Hoster betreiben.",
          en: "A consultancy with a few well-kept pages does not need a content management system. Finished pages in plain HTML are fast, secure and can run with any host.",
        },
      },
    ],
    leistungen: [
      { de: "Unternehmenswebsite", en: "Company website" },
      { de: "SEO-Grundlagen", en: "SEO basics" },
      { de: "Bildoptimierung", en: "Image optimization" },
      { de: "Rechtsseiten", en: "Legal pages" },
    ],
    jahr: 2026,
    // TODO(Henry): Live-URL. Im Projekt ist https://www.tmr-beratung.de
    // hinterlegt, die Adresse war am 28.10.2026 aber nicht erreichbar.
    liveUrl: undefined,
    published: true,
  },
];

/** Nur freigegebene Projekte. Alles, was rendert, liest hieraus. */
export const VEROEFFENTLICHTE_PROJEKTE: KundenProjekt[] = KUNDENPROJEKTE.filter(
  (p) => p.published,
);

export function getVeroeffentlichtesProjekt(slug: string): KundenProjekt | undefined {
  return VEROEFFENTLICHTE_PROJEKTE.find((p) => p.slug === slug);
}

