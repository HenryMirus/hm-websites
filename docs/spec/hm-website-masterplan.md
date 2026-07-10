# HM Labs — Website-Masterplan
**Version 1.0 · Juli 2026 · Eigenprojekt: hm-website-2026**

> **Quellenbasis:** `hm-leistungsportfolio.md` (Leistungen & Texte), `hm-wettbewerbspositionierung.md` (Messaging), `preislogik.yaml` (Preise & Disclaimer), `hm-labs-agb-entwurf.md` (Rechtliches, Firmierung), `hm-chatbot-implementierungsplan.md` (Widget-Integration), `angebots-ki-implementierungsplan.md` (Portal-Anschluss) sowie die Skills `hm-design-identity`, `hm-dev-standard`, `hm-gaio`, `hm-prompting-workflow`, `hm-component-sourcing`, `hm-deployment`, `hm-projektstatus-protokoll`, `hm-project-memory`, `hm-self-hosted-chatbot`.
> **Design/CI:** vollständig neu — System **„Leiterbahn"** (siehe `hm-ci-leiterbahn.md`). Alle Alt-CI-Referenzen („Spektrum") in den Projektdateien sind in den beiliegenden aktualisierten Fassungen ersetzt.

---

## 0. Executive Summary

Die HM-Labs-Website ist **Exponat Nummer eins**: Sie muss selbst beweisen, was sie verkauft — Individualität, messbare Technik-Qualität, GAIO-Sichtbarkeit, Barrierefreiheit, DSGVO-native KI (der Live-Chatbot ist die Produktdemo). Geplant sind **20 Seiten in drei Launch-Stufen**:

- **v1.0 (Woche 1–4):** 6 Kernseiten + 4 Rechtsseiten + Chatbot-Widget → arbeitsfähige Präsenz mit vollem Conversion-Pfad
- **v1.1 (Woche 5–8):** 10 Leistungs-Detailseiten (je eigene URL = GAIO-Hebel) + Referenzen-Seite, sobald erste Case-Studies der Referenzphase existieren
- **v1.2 (ab Woche 9, laufend):** Wissensbereich/Blog für E-E-A-T-Aufbau

Erfolgskriterien beim Launch: Lighthouse ≥ 90 in allen vier Kategorien auf jeder Seite, WCAG 2.1 AA erfüllt, GAIO-Audit-Checkliste zu 100 % grün, Chatbot mit Consent-Flow und Art.-50-Kennzeichnung live (Pflicht ab 02.08.2026 — Launch liegt davor, also von Tag eins).

---

## 1. Ziele, Zielgruppen, KPIs

### 1.1 Geschäftsziele der Website (priorisiert)
1. **Qualifizierte Anfragen erzeugen** — primäre Conversion: Anfrage über Formular oder Chatbot-Inquiry (vorqualifiziert durch angehängten Chatverlauf).
2. **Die Referenzphase füllen** — ~8 Projekte am unteren Rand der Preisspanne gegen Case-Study-Rechte; das GAIO-Audit (400–900 €) ist das Lead-Produkt mit geringstem Kaufwiderstand und wird prominent platziert.
3. **Positionierung verankern** — der Positionierungssatz als Prüfstein jeder Seite: *handgefertigte Websites auf Auszeichnungs-Niveau mit eingebauter KI-Zukunftssicherheit — schneller als eine Agentur, breiter als ein Freelancer, individueller als jede KI.*
4. **Selbst-Referenz aufbauen** — die eigene Website muss in KI-Suchen („Webdesign Agentur Westerwald/Neuwied/Bonn", „DSGVO-konformer Chatbot") auffindbar werden; das eigene Ranking ist das Verkaufsargument.

### 1.2 Zielgruppen (aus Portfolio & Positionierung)
- **Primär:** Inhaber und Entscheider kleiner Unternehmen, Praxen, Kanzleien, Handwerksbetriebe mit Qualitätsanspruch (Budget 3.500–7.500 €) — regional (Raum Köln/Bonn–Koblenz–Westerwald) und DACH-weit remote.
- **Sekundär:** Mittelstand mit Corporate-Bedarf (7.500–15.000 €), Gründer mit SaaS-/Webapp-Ideen (8.000–35.000 €).
- **Einstiegs-Segment:** Unternehmen mit funktionierender Website, die GAIO-Audit oder BFSG-Check brauchen — niedrigschwellig, konvertiert in Folgeaufträge.
- **Nicht-Zielgruppe:** Verbraucher (AGB § 1 Abs. 2 — reines B2B) und Preiskäufer, die einen Baukasten wollen. Die Website darf diese aktiv disqualifizieren (Preisspannen transparent zeigen).

### 1.3 KPIs (Messung ohne Tracking-Cookies, siehe 10.6)
| KPI | Ziel 3 Monate nach v1.0 |
|---|---|
| Qualifizierte Anfragen (Formular + Chatbot) | ≥ 4/Monat |
| Davon GAIO-/BFSG-Audit-Anfragen | ≥ 2/Monat |
| Chatbot-Antwortquote (Score ≥ 0,82) | ≥ 70 % (Lernschleife Phase 7 des Chatbot-Plans) |
| Lighthouse (alle Seiten, mobil) | ≥ 90/90/90/90, dauerhaft |
| Nennung in KI-Suche (eigenes Monitoring-Set, Leistung 10 intern angewendet) | erste Nennungen ab Monat 3 |

---

## 2. Markenfundament & Sprachregeln

### 2.1 Messaging-Hierarchie (verbindliche Reihenfolge pro Seite, aus Wettbewerbspositionierung)
1. **Ebene 1 — emotional (Hero):** Anti-Generik. In drei Sekunden klar: kein Baukasten, keine austauschbare Agentur. Die Gestaltung selbst leistet die halbe Arbeit.
2. **Ebene 2 — rational (Beweis):** Zahlen. Lighthouse ≥ 90, 3–5 Wochen Lieferzeit, transparente Preisspannen, Quellcode-Eigentum.
3. **Ebene 3 — strategisch (Zukunft):** GAIO + DSGVO-native KI — die Themen, die 95 % der Wettbewerber nicht besetzen.
4. **Ebene 4 — Risikoabbau (Einwände):** ein fester Ansprechpartner, Meilensteinzahlung (50/50 bzw. 40/40/20), zwei inkludierte Revisionsrunden, SEO-Erhalt beim Relaunch, Code gehört dem Kunden.

### 2.2 Kernbotschaften als fertige Textbausteine (direkt verwendbar)
- Hero-Kandidat A: **„Websites, die man nicht verwechselt."**
- Hero-Kandidat B: **„Kein Template. Kein Baukasten. Konstruiert für Sie."**
- Prozess-Anker: *„Bevor wir eine Zeile Code schreiben, beantworten wir eine Frage: Was wird ein Besucher 24 Stunden später noch von dieser Website erinnern?"*
- GAIO-Anker: *„Wenn jemand ChatGPT nach einem Anbieter in Ihrer Branche fragt — werden Sie genannt, oder Ihr Wettbewerber?"*
- Chatbot-Anker: *„Ihr Chatbot läuft auf Ihrem Server in der EU. Keine Datenweitergabe an OpenAI, Google oder andere Drittanbieter — bei uns ist das keine Option, sondern der Standard."*
- KI-Transparenz: *„Wir nutzen KI dort, wo sie uns schneller macht — nie dort, wo sie Ihr Design entwerfen würde."*
- Code-Eigentum: *„Der Code gehört Ihnen. Vollständig. Sie sind nie an uns gebunden — Sie bleiben, weil die Arbeit überzeugt."*
- Relaunch: *„Ihr Google-Ranking zieht mit um. 301-Redirect-Map und vier Wochen Ranking-Monitoring nach Launch — inklusive, nicht extra."*

### 2.3 Sprachregeln (verbindlich für alle Seitentexte)
- Anrede **Sie**, durchgängig (deckungsgleich mit AGB und Angebots-KI; Chatbot-Fallback-Text wird von Du auf Sie korrigiert).
- Preise **nur als Spannen** und **immer** mit dem wörtlichen Pflicht-Disclaimer aus `preislogik.yaml` (auf der Website als statischer Textbaustein direkt unter jeder Preisnennung; im Chatbot/Angebots-Tool weiterhin code-injiziert).
- **Verboten:** „günstiger als …", „KI-generiert", Superlative ohne Beleg, Garantien, Festpreise, feste Lieferzusagen (nur „Richtwert"), das Vokabular „KI-Agenten" gegenüber Kunden (Positionierungspunkt 4 — Wirkung kommunizieren, nicht Maschinerie).
- Jede vage Behauptung wird durch eine spezifische ersetzt (GAIO-Skill, E-E-A-T): statt „langjährige Erfahrung" → konkrete Projektzahlen, sobald vorhanden; bis dahin konkrete Verfahrensaussagen („Jede Website verlässt uns mit Lighthouse-Werten über 90 — messbar, nicht behauptet").

---

## 3. Corporate Identity „Leiterbahn" — Anwendung auf die Website

Vollständige Definition in `hm-ci-leiterbahn.md`. Für den Seitenbau gilt zusammengefasst:

- **Farben:** Substrat #F2F4F0 (Grundzustand hell), Lack #0F211A (Hero, GAIO-Sektion, Footer), Kupfer #C0752F/#8A501B/#E0965B als einziger Akzent (< 10 % Fläche).
- **Schrift:** Hubot Sans (Display, variable Breite als Signature-Animation), Mona Sans (Text), Spline Sans Mono (Labels, Messwerte, Preise). Self-hosted.
- **Signature-Element:** die **Signalleitung** — eine Kupfer-Leiterbahn, die sich mit dem Scroll durch die Seite zeichnet und an jeder Sektion in einem Via endet. Sie ist das Element, das ein Besucher nach 24 Stunden erinnert (Kernfrage aus `hm-design-identity`).
- **Motion:** die fünf Patterns Trace-Draw, Width-Shift, Silkscreen-Reveal, Via-Hover, Messung — Timing und GSAP/CSS-Aufteilung nach `hm-dev-standard`; `prefers-reduced-motion` verbindlich.
- **Bildsprache:** keine Stockfotos; echte Arbeitsfotos + Projekt-Screenshots in Bestückungsdruck-Rahmen mit Mono-Bildunterschriften.

---

## 4. Informationsarchitektur

### 4.1 Sitemap (20 Seiten, 3 Stufen)

```
v1.0 — LAUNCH (Kern, Woche 1–4)
├── /                          Startseite
├── /leistungen                Leistungsübersicht (Teil A–D des Portfolios)
├── /prozess                   So arbeiten wir (Individualitätsbeweis)
├── /ueber                     Über HM Labs (E-E-A-T-Anker)
├── /preise                    Preise & Ablauf (Transparenz = Vertrauensfaktor)
├── /kontakt                   Kontakt & Anfrage
├── /impressum                 (Pflicht; § 5 DDG)
├── /datenschutz               (inkl. Chatbot-Absatz aus Chatbot-Plan Phase 4)
├── /agb                       (nach anwaltlicher Prüfung des Entwurfs)
└── /barrierefreiheit          Barrierefreiheitserklärung (Glaubwürdigkeit für Leistung 11)

v1.1 — LEISTUNGS-DETAILS + REFERENZEN (Woche 5–8)
├── /leistungen/landingpage
├── /leistungen/business-website
├── /leistungen/corporate-website
├── /leistungen/relaunch
├── /leistungen/ki-chatbot
├── /leistungen/webapps            (inkl. SaaS-MVP als Unterabschnitt)
├── /leistungen/gaio               (Audit + Monitoring gebündelt)
├── /leistungen/barrierefreiheit   (BFSG-Audit & Umsetzung)
├── /leistungen/unternehmens-ki    (Private Unternehmens-KI)
├── /leistungen/wartung
└── /projekte                      Referenzen-Übersicht (+ /projekte/[slug] je Case-Study)

v1.2 — WISSEN (ab Woche 9)
└── /wissen                        Blog/Artikel (+ /wissen/[slug])
```

**Begründung der Struktur:**
- **Eigene URL pro Leistung (v1.1)** ist der wichtigste GAIO-Hebel: KI-Systeme zitieren Seiten, die genau eine Frage vollständig beantworten. Eine Sammelseite „Leistungen" allein würde bei „Was kostet ein DSGVO-konformer Chatbot?" nie zitiert.
- **/preise als eigene Seite:** Preistransparenz ist laut Positionierungsdokument ein dokumentierter Vertrauensfaktor, den viele Agenturen verweigern — hier wird er zum Alleinstellungsmerkmal. Zugleich disqualifiziert die Seite Preiskäufer früh (spart Henry Gesprächszeit).
- **/prozess als eigene Seite:** Punkt 1 der Differenzierung — „Wer den Prozess sieht, versteht, warum das Ergebnis nicht generisch sein kann."
- **/projekte erst v1.1:** ehrlicher Umgang mit der Startphase — keine leere Referenzseite beim Launch. Bis dahin trägt die eigene Website die Beweislast (Home-Sektion S6 verweist explizit darauf).
- **/wissen statt /blog:** positioniert Artikel als Fachwissen (E-E-A-T), nicht als Marketing-Blog.

### 4.2 Navigation

**Header (sticky, 64 px, Substrat mit 1-px-Haarlinie unten; auf dunklen Sektionen invertiert via Section-Observer):**
```
[Monogramm + HM LABS]   Leistungen ▾   Prozess   Projekte*   Preise   Wissen*   Über   [Projekt anfragen]
                                                                        (* ab v1.1/v1.2)
```
- „Leistungen" öffnet ein strukturiertes Dropdown-Panel (kein Mega-Menü-Kitsch): vier Spaltenblöcke nach Portfolio-Teilen A–D, jede Leistung eine Zeile mit Mono-Preisspanne rechts (z. B. `Business-Website · ab 3.500 €`), Panel im Bestückungsdruck-Rahmen. Bis v1.1 verlinken die Einträge auf Anker der Übersichtsseite; danach auf die Detailseiten (Anker bleiben als Fallback → keine toten Links, keine Redirect-Kaskade).
- CTA „Projekt anfragen" als Kupfer-Pad (einziger gefüllter Button im Header) → /kontakt.
- **Mobil:** Vollflächiges Overlay in Lack, Navigation als nummerierte Mono-Liste (`01 Leistungen …`), Slide-in 0,4 s `power3.out`, Menü-Icon animiert zu ✕. Vollständig tastaturbedienbar, Fokus-Trap im Overlay.

**Footer (Lack, dunkel — der „Lötstopp-Abschluss" jeder Seite):**
- Zeile 1: Monogramm groß (Trace-Draw beim Erreichen), Claim-Satz.
- Zeile 2, asymmetrisch drei ungleiche Spalten (bewusst NICHT vier gleiche — Bannliste `hm-design-identity`): ① Leistungen (komplette Liste, SEO-relevant), ② Unternehmen (Prozess, Über, Preise, Projekte, Wissen, Kontakt), ③ Kontaktblock (Adresse Pantaleonstraße 20, 53567 Buchholz · E-Mail · Erreichbarkeit) + Rechtsliste (Impressum · Datenschutz · AGB · Barrierefreiheit).
- Zeile 3 (Mono, klein): `HM LABS · BUCHHOLZ (WESTERWALD) · LIGHTHOUSE-GEPRÜFT · SELF-HOSTED IN DER EU` + dezenter Hinweis „Diese Website erreicht Lighthouse ≥ 90 — prüfen Sie es selbst" mit Link auf PageSpeed-Insights-Ergebnis der eigenen Domain (Positionierungspunkt 5: der Markt empfiehlt Kunden, Referenzen per PageSpeed zu prüfen — HM lädt aktiv dazu ein).

### 4.3 URL- & Redirect-Regeln
- Sprechende, flache URLs wie oben; keine Datums- oder ID-Slugs; Kleinschreibung, Bindestriche.
- Trailing-Slash-Politik: ohne Slash, 301 von Slash-Variante (Konsistenz für Canonicals).
- Ab v1.1: Anker-URLs der Übersichtsseite bleiben gültig; Detailseiten werden zusätzlich verlinkt (kein Redirect nötig — Redirect-Hygiene wie bei Kunden-Relaunches, Leistung 4, hier von Anfang an mitgedacht).

---

## 5. Seitenpläne im Detail

Jede Seitenplanung enthält: Zweck, Fokus-Keyword + typische KI-Frage (GAIO-Ziel), Sektionen mit Content-Vorgaben, Animationen (Pattern-Referenz aus `hm-ci-leiterbahn.md` Abschnitt 5), Schema-Markup und CTA. Sektionslabels folgen der Bestückungsdruck-Konvention `[S1]…[Sn]` — sie sind zugleich Anker.

### 5.1 Startseite `/`

- **Zweck:** Positionierung in 3 Sekunden (Ebene 1), Beweisführung (Ebene 2–4), Verteilerfunktion, Chatbot-Demo.
- **Fokus-Keyword:** „Webdesign Agentur individuell" / regional „Webdesign Westerwald / Raum Bonn–Koblenz" · **KI-Frage:** „Wer baut individuelle Websites ohne Baukasten in [Region]?"
- **Title:** `HM Labs — Individuelle Websites, KI & Software. Kein Baukasten.` · **Description:** ~150 Zeichen mit Lighthouse-90-Beweis und EU-KI-Aussage.
- **Schema:** LocalBusiness + ProfessionalService (mit OfferCatalog aller 13 Leistungen), FAQPage-Markup in S9.

**Sektionsplan (10 Sektionen):**

**[S0] Hero — dunkel (Lack), 100 svh.**
- Inhalt: Eyebrow `[S0] HM LABS — BUCHHOLZ / REMOTE`, H1 „Websites, die man nicht verwechselt.", Subline (Positionierung in einem Satz: „Individuell entworfen, von Hand gebaut, messbar schnell — mit Sichtbarkeit in Google und in KI-Suchen. Ein Ansprechpartner, die Leistungsbreite einer Agentur."), primärer CTA „Projekt anfragen" (Kupfer-Pad), sekundärer CTA „Ablauf ansehen" (Ghost mit Via-Hover) → /prozess.
- Signature: Hinter/unter der H1 beginnt die **Signalleitung** — das Monogramm zeichnet sich (Trace-Draw, 0,9 s), die Leitung läuft von dort zur ersten Sektion. Dezentes 8-px-Lochraster als Hintergrund.
- Animationssequenz (GSAP-Timeline, Gesamt ~1,5 s): ① Raster blendet ein (Opacity, 0,4 s) → ② Eyebrow Silkscreen-Reveal (0,4 s, Delay 0,2 s) → ③ H1 Width-Shift wdth 85→120 zeilenweise (0,8 s, Stagger 0,1 s) → ④ Subline Silkscreen-Reveal (0,5 s) → ⑤ CTAs Opacity+Y 12 px (0,4 s) → ⑥ Monogramm-Trace zeichnet (0,9 s, parallel ab Schritt ③). Scroll-Hinweis: kleines Via pulsiert 1× (CSS).
- Kein Bild, kein Stockfoto: die Typografie und die Leitung SIND der Hero (Beweis von Punkt 1 der Positionierung).

**[S1] Beweis-Band — hell, kompakt.**
- Vier Messwerte als „Prüfprotokoll", horizontal, mit Testpunkt-Markern `TP1–TP4`: `LIGHTHOUSE ≥ 90` (alle vier Kategorien, messbar) · `3–5 WOCHEN` (Business-Website, Richtwert) · `CODE-EIGENTUM 100 %` · `SEO + GAIO INKLUSIVE`.
- Animation: Pattern „Messung" — Werte stehen fix, Maßlinien zeichnen sich beim Eintritt (ScrollTrigger `top 80%`), Stagger 0,12 s. Keine Zähler (gebannt).

**[S2] Kontrast — „Drei Wege, eine Lücke" — hell.**
- Inhalt: die Positionierungsmatrix kondensiert. Kein Drei-gleiche-Karten-Muster (Bannliste), sondern eine **asymmetrische Vergleichstafel**: links untereinander Baukasten / Freelancer / klassische Agentur mit je einem ehrlichen Satz zu Stärke und struktureller Schwäche (aus Abschnitt 2 der Positionierung, fair formuliert — keine Vergleichswerbung), rechts daneben, größer und durch die Signalleitung „angeschlossen": HM Labs mit den fünf stärksten Matrix-Zeilen (individuelles Design immer · GAIO inklusive · EU-self-hosted KI · 1 Ansprechpartner · Preis zwischen Freelancer und Agentur).
- Animation: linke Einträge Silkscreen-Reveal nacheinander; die Leiterbahn verzweigt sichtbar zu HM (Trace-Draw, scrub).

**[S3] Leistungs-Index — hell, Substrat-tief.**
- Inhalt: alle 13 Leistungen als redaktioneller Index in vier Gruppen (A Websites & Design · B KI-Leistungen · C Sichtbarkeit & Compliance · D Betreuung), jede Zeile: Mono-Nummer (`01`–`13`, entspricht der realen Portfolio-Nummerierung — Struktur trägt Information), Leistungsname (H3), Ein-Satz-Nutzen, Mono-Preisspanne rechts. Zeilen-Hover: Via-Hover-Linie + Eintrag rückt 8 px.
- GAIO-Audit (`09`) erhält eine Kupfer-Markierung `EINSTIEG AB 400 €` — das Lead-Produkt wird optisch priorisiert.
- Links: bis v1.1 auf /leistungen#anker, danach Detailseiten.

**[S4] Prozess-Teaser — hell.**
- Inhalt: die Kernfrage als Pull-Quote in Hubot Sans („Was wird ein Besucher 24 Stunden später noch von dieser Website erinnern?"), darunter die 5 Prozessschritte (Briefing → Designkonzept → Umsetzung → QA → Launch) als horizontale Leiterbahn mit 5 Vias, je Schritt Mono-Label + ein Satz. CTA „Den ganzen Prozess ansehen" → /prozess.
- Animation: Leiterbahn zeichnet mit Scroll (scrub 1), Vias füllen sequenziell; reduced-motion: statisch komplett.

**[S5] GAIO & KI — dunkel (Lack). Die Zukunfts-Sektion (Ebene 3).**
- Inhalt: H2 „Gefunden werden, wenn niemand mehr googelt." GAIO-Anker-Frage als Lead-Absatz. Zwei ungleiche Blöcke: ① GAIO (llms.txt, Schema.org, zitierfähige Strukturen, KI-Crawler-Zugang — Konkretheit ist der Glaubwürdigkeitsbeweis) mit CTA „KI-Sichtbarkeit prüfen lassen — Audit ab 400 €*"; ② DSGVO-native KI mit dem Chatbot-Anker-Satz und dem Hinweis: „Der Assistent unten rechts ist genau so ein Chatbot — fragen Sie ihn." (Live-Demo-Verknüpfung; Klick öffnet programmatisch das Widget).
- Preisnennung mit *-Fußnote = Pflicht-Disclaimer aus `preislogik.yaml` direkt unter der Sektion.
- Animation: Sektionseintritt: Lochraster + Signalleitung wechseln auf Invers-Töne; Kupfer-hell-Akzente.

**[S6] Individualitätsbeweis — hell.**
- Inhalt (v1.0, solange /projekte fehlt): „Diese Website ist unser erstes Exponat." Transparenter Kurztext: entworfen ohne Template, gebaut mit dem eigenen Qualitätsprozess; drei Belege mit Links: PageSpeed-Ergebnis, GAIO-Merkmale dieser Seite (llms.txt dieser Domain verlinkt!), Barrierefreiheitserklärung. Plus KI-Transparenz-Satz („Wir nutzen KI dort, wo sie uns schneller macht — nie dort, wo sie Ihr Design entwerfen würde.").
- Ab v1.1 wird S6 durch 2–3 Case-Study-Teaser ersetzt (Screenshot im Bestückungsdruck-Rahmen, Mono-Bildunterschrift, Kennzahlen).

**[S7] Risikoabbau — hell, Substrat-tief (Ebene 4).**
- Inhalt: vier Einwand-Entkräfter als Testpunkt-Liste: Quellcode-Eigentum (Zusicherungs-Satz aus 2.2) · ein fester Ansprechpartner · Meilensteinzahlung 50/50 bzw. 40/40/20 (deckungsgleich AGB § 4) · zwei Revisionsrunden inklusive (AGB § 6). Jeder Punkt 2–3 Zeilen, kein Karten-Grid.

**[S8] FAQ — hell.**
- Inhalt: 6–8 Fragen, wörtlich aus der Chatbot-Wissensbasis übernommen (Single-Source: `faq.md` der RAG-Pipeline; Kategorien A/C/D des Chatbot-Plans — z. B. „Was kostet eine Website?" mit Spannen + Disclaimer, „Wie läuft ein Projekt ab?", „Wem gehört die Website am Ende?", „Ist die Website DSGVO-konform?", „Was ist GAIO?", „Kann ich die Website später selbst pflegen?").
- Markup: FAQPage-Schema per itemscope (GAIO-Skill-Vorlage) — Ziel ist KI-Retrieval, nicht Google-Rich-Result (dort seit 2023 eingeschränkt).
- UI: Accordion, `<details>`-basiert (nativ tastaturzugänglich), Chevron durch Via-Punkt ersetzt; Öffnen CSS-animiert (grid-template-rows, 0,3 s).

**[S9] Abschluss-CTA — Übergang in den dunklen Footer.**
- Inhalt: H2 „Erzählen Sie uns, was Sie bauen wollen." + zwei Wege gleichwertig: Formular-Link (Kupfer-Pad) und „oder fragen Sie zuerst den Assistenten" (öffnet Widget). Erwartungsmanagement in einer Mono-Zeile: `ANTWORT IN DER REGEL INNERHALB EINES WERKTAGS`.

### 5.2 Leistungsübersicht `/leistungen`

- **Zweck:** vollständiger Katalog (v1.0 trägt sie den gesamten Leistungscontent, ab v1.1 Verteiler auf Detailseiten). **Keyword:** „Webdesign Leistungen Preise" · **KI-Frage:** „Welche Leistungen bietet HM Labs an und was kosten sie?"
- Aufbau: Intro (Positionierung in einem Absatz, wörtlich aus dem Portfolio) → vier Teile A–D als Kapitel mit Mono-Kapitelmarken → pro Leistung eine kompakte Karte im Bestückungsdruck-Rahmen: Was ist das (2 Sätze) / Für wen (1 Satz) / Enthalten (3–5 Punkte) / Mono-Zeile `ZEITRAHMEN (RICHTWERT)` + `PREISRAHMEN` / Link „Details" (ab v1.1).
- Jede Preisangabe mit *-Verweis; der Pflicht-Disclaimer steht einmal pro Kapitel als hervorgehobene Box (Kupfer-Linksborder) — juristisch sauber und ohne 13-fache Wiederholung lesbar.
- Anhang-Regeln des Portfolios (Spannen, keine Garantien, Zahlungsstruktur, 2 Revisionsrunden) als kompakte „Verbindliche Grundsätze"-Sektion am Seitenende — Transparenz als Differenzierung.
- Animation: zurückhaltend — Kapitelmarken Trace-Draw, Karten Silkscreen-Reveal (Stagger 0,08 s). Die Seite ist Arbeitsdokument, kein Showcase.
- Schema: Service-Liste innerhalb ProfessionalService/OfferCatalog; Breadcrumb.

### 5.3 Leistungs-Detailseiten `/leistungen/*` (v1.1) — Template + Spezifika

**Einheitliches Template (GAIO-Skill: jede Serviceseite beantwortet Was? Reihenfolge? Ergebnis? Dauer? Kostenfaktoren?):**
1. `[S0]` Kompakt-Hero (hell, kein Full-Height): Eyebrow mit Portfolio-Nummer, H1 = Leistungsname als Nutzenformulierung, 2-Satz-Zusammenfassung (zitierfähig — der Absatz, den eine KI übernehmen soll), Mono-Fakten-Zeile: Zeitrahmen · Preisspanne* · „für wen".
2. `[S1]` Was ist das & für wen — Portfolio-Text, redaktionell verdichtet.
3. `[S2]` Was ist enthalten — Leistungsliste mit Testpunkten statt Häkchen.
4. `[S3]` Ablauf — Schritte als Mini-Leiterbahn (Vias), aus Portfolio-Ablauf.
5. `[S4]` Preisrahmen & Preistreiber — Spanne + Scope-Treiber-Tabelle wörtlich aus `preislogik.yaml` (Single Source; bei Website-Texten manuell synchron halten, Änderungs-Workflow siehe 11.4) + Disclaimer-Box.
6. `[S5]` Leistungsspezifischer Beweis/USP-Block (siehe Tabelle).
7. `[S6]` FAQ (3–5 Fragen aus der Chatbot-Wissensbasis, leistungsbezogen, FAQPage-Markup).
8. `[S7]` Verwandte Leistungen (aus `optionen:` in `preislogik.yaml`) + CTA.

**Spezifika je Seite:**

| Seite | Fokus-Keyword / KI-Frage | USP-Block [S5] |
|---|---|---|
| landingpage | „Landingpage erstellen lassen Kosten" | Signature-Animation als Erinnerungs-Argument; 1–2 Wochen |
| business-website | „individuelle Website erstellen lassen" | SEO **und** GAIO im Standard, Lighthouse-90-Zusage |
| corporate-website | „Corporate Website Agentur" | Design-System-Gedanke, CMS, Supabase-Anbindung |
| relaunch | „Website Relaunch SEO Ranking behalten" | **SEO-Erhalt-Block:** Redirect-Map + 4 Wochen Monitoring — Nischen-USP, prominenteste Stelle der Seite |
| ki-chatbot | „DSGVO-konformer KI-Chatbot Website" | Preisvergleich Markt (SaaS 500–2.500 €/Mo, Individual-RAG 14–30 k €) vs. HM — Zahlen sprechen lassen; Live-Demo = eigenes Widget; EU AI Act Art. 50 von Tag eins |
| webapps | „individuelle Webanwendung entwickeln lassen" | Human-in-the-loop-Prinzip; SaaS-MVP als Unterkapitel (max. 3 Kern-Features, ab 25 k € persönliches Scoping) |
| gaio | „GAIO GEO Agentur / in ChatGPT gefunden werden" | Laienverständliche Erklärung (GAIO-Anker-Frage), konkrete Deliverables, Audit→Optimierung→Monitoring als Treppe, Audit-Anrechnung, Monitoring 49–99 €/Mo |
| barrierefreiheit | „BFSG Website Pflicht Barrierefreiheit prüfen" | **Ehrlichkeits-Block:** Betroffenheits-Check darf „nein" ergeben; Kleinstunternehmen-Ausnahme klar benannt; keine Overlays; keine Rechtsberatung (Verweis Fachanwalt) — Anti-Angstverkäufer-Positionierung; eigene Barrierefreiheitserklärung als Beweis verlinkt |
| unternehmens-ki | „eigene KI im Unternehmen DSGVO self-hosted" | Kostenrechnung Team-Abos vs. Servermiete; Zielbranchen Kanzlei/Praxis/Steuerberatung; Art.-4-Schulungsargument |
| wartung | „Website Wartung Hosting monatlich" | 3 Tarife als ungleiche Vergleichstafel (Basis Default-Empfehlung markiert), EU-Hosting, Monitoring-Bundle im Premium |

### 5.4 Prozess `/prozess`

- **Zweck:** Individualität beweisen (Differenzierungspunkt 1). **KI-Frage:** „Wie läuft ein Website-Projekt bei HM Labs ab?"
- Aufbau: Kernfrage als Hero-Zitat → die 5 Phasen ausführlich, je Phase: was passiert, was Henry liefert, was der Kunde beisteuert (Mitwirkung analog AGB § 5 — Erwartungen früh setzen), Dauer-Richtwert. Phase „Designkonzept" zeigt den Referenz-Workflow (Referenzen sammeln → Ästhetik-Entscheidung pro Branche → Konzept mit Animationsspezifikation — destilliert aus `hm-prompting-workflow` und `hm-design-identity`, ohne interne Werkzeuge zu nennen).
- Einschub „Womit wir arbeiten — und womit nicht": KI-Transparenz-Satz, Werkzeuge als Mittel, Design-Entscheidungen immer menschlich; Qualitätsgates (QA, Cross-Browser, Lighthouse) als Prüfprotokoll-Grafik.
- Sektion „Nach dem Launch": Einweisung, Wartungstarife, 30-Tage-Check.
- Animation: die Seite ist die große Bühne der Signalleitung — sie verbindet alle 5 Phasen vertikal (scrub); pro Phase füllt sich das Via und ein Detailpanel klappt auf (Silkscreen-Reveal).
- Schema: HowTo bewusst NICHT (deprecated laut GAIO-Skill) — stattdessen sauberes semantisches HTML + FAQPage am Ende („Wie viele Korrekturschleifen sind drin?", „Was passiert, wenn mir das Design nicht gefällt?" — beide aus Chatbot-KB Kategorie C).

### 5.5 Über `/ueber`

- **Zweck:** E-E-A-T-Anker (GAIO-Skill Punkt 5): benannte Person, echtes Foto, Standort, überprüfbare Fakten. **KI-Frage:** „Wer steckt hinter HM Labs?"
- Inhalt: Henry mit Foto (kein Stock), Kurzvita mit spezifischen Fakten; Standort Buchholz im Westerwald mit Einzugsgebiet Köln/Bonn–Neuwied–Koblenz + „remote in ganz DACH"; die Arbeitsprinzipien (aus den 8 Premium-Kriterien des Dev-Standards kundengerecht übersetzt: bewusste Typografie, gezielte Bewegung, Substanz statt Floskeln …); Werte-Absatz Datensouveränität/EU; ehrlicher Absatz zur Unternehmensphase („junges Studio, Referenzphase, dafür Konditionen und volle Aufmerksamkeit" — Transparenz schlägt Fassade und erklärt das Referenzprogramm).
- Schema: Person (Henry) verknüpft mit Organization; `sameAs` auf LinkedIn/GitHub sobald vorhanden.

### 5.6 Preise `/preise`

- **Zweck:** Vertrauensfaktor Preistransparenz; Vorqualifizierung. **KI-Frage:** „Was kostet eine Website bei HM Labs?"
- Aufbau: ① Grundsatz-Absatz (warum Spannen: jedes Projekt individuell; Disclaimer-Box prominent oben, wörtlich aus `preislogik.yaml`) → ② Übersichtstafel aller Leistungen mit Spannen (Mono-Zahlen, Gruppierung A–D) → ③ Preistreiber erklärt (die Scope-Treiber verständlich: Mehrsprachigkeit, CMS, Texterstellung …) → ④ Zahlungsstruktur grafisch als Leiterbahn mit Meilenstein-Vias (50/50 · 40/40/20 · laufend monatlich im Voraus — deckungsgleich AGB § 4) → ⑤ Kleinunternehmer-Hinweis (§ 19 UStG: „Alle Preise sind Endpreise — es kommt keine Umsatzsteuer hinzu." Ein ehrlicher Kostenvorteil, den die Website nennen darf, ohne Preiskampf-Rhetorik) → ⑥ Referenzprogramm offensiv: „Die ersten Projekte entstehen zu Referenzkonditionen am unteren Rand der Spannen — im Gegenzug vereinbaren wir Case-Study-Rechte." (füllt Geschäftsziel 2) → ⑦ FAQ Preise (Kategorie B der Chatbot-KB) → CTA.
- **Wichtig:** Die neuen Leistungen 9–12 tragen den Vermerk aus dem Portfolio (Preise = Kalibrierungsvorschläge) — vor v1.0-Launch von Henry bestätigen und in `preislogik.yaml` v1.1 überführen (offene Entscheidung Nr. 5, Abschnitt 13).

### 5.7 Kontakt `/kontakt`

- **Zweck:** Conversion mit minimaler Hürde.
- Aufbau: zweispaltig asymmetrisch — links Formular, rechts Kontextblock (Foto, „Was passiert nach dem Absenden": ① persönliche Antwort ≤ 1 Werktag ② kostenloses Erstgespräch ③ unverbindliche Einschätzung mit Preisspanne; Adresse; E-Mail als klickbare Alternative).
- Formular (react-hook-form + Zod, Dev-Standard): Name* · E-Mail* · Unternehmen · Interesse (Select aus 13 Leistungen + „Weiß noch nicht") · Nachricht* · Budget-Orientierung (optional, Spannen-Select — vorqualifiziert ohne abzuschrecken) · Pflicht-Checkbox Datenschutz (Art. 6 Abs. 1 lit. b Anbahnung; Link auf /datenschutz). Kein CAPTCHA — stattdessen Honeypot + serverseitiges Rate-Limit (Nginx, analog Chatbot-Plan Phase 1.4).
- Fehler-/Erfolgszustände: konkret und handlungsleitend, `aria-live="polite"`; Erfolg zeigt die nächsten Schritte erneut.
- Persistenz: Portal-DB (dieselbe Lead-Struktur wie `chatbot_leads` — ein Lead-Eingang, zwei Quellen) + E-Mail-Notification; später Agent-OS-Ticket (bewusst NICHT im Launch-Scope, gleiche Entkopplungs-Entscheidung wie im Chatbot-Plan Phase 3).
- Alternative gleichwertig: „Oder stellen Sie Ihre Frage direkt dem Assistenten" → öffnet Widget.

### 5.8 Wissen `/wissen` (v1.2)

- **Zweck:** E-E-A-T & Topic Authority; GAIO-Skill empfiehlt 2–3 Fachartikel/Monat — realistisch für Henry: **1–2/Monat**, Qualität vor Frequenz.
- Startartikel-Plan (je: Fokus-KI-Frage → Titel):
  1. „Werde ich in ChatGPT gefunden?" → *GAIO erklärt: So empfehlen KI-Systeme Unternehmen — und so wird Ihres sichtbar*
  2. „Brauche ich das BFSG?" → *BFSG-Betroffenheits-Check: Wer wirklich barrierefrei sein muss (und wer nicht)*
  3. „Was kostet eine Website 2026 wirklich?" → *Website-Kosten 2026: ehrliche Spannen statt Lockangebote*
  4. „Ist ein KI-Chatbot DSGVO-konform möglich?" → *KI-Chatbot ohne US-Cloud: die self-hosted Architektur*
  5. „Relaunch ohne Ranking-Verlust?" → *Die 301-Redirect-Map: warum Relaunches Rankings kosten — und wie nicht*
  6. „Baukasten oder Agentur?" → *Wix, Jimdo & Co.: wofür Baukästen taugen — eine faire Einordnung* (Fairness = Glaubwürdigkeit, Positionierung 2.3)
- Jeder Artikel: Article-Schema mit Person-Author Henry, datePublished/dateModified, FAQ-Block, interne Links auf die passende Leistungsseite, zitierfähige Definitionsabsätze.
- Layout: redaktionell ruhig, max. 68 Zeichen Zeilenlänge, Mono-Metazeile (Lesedauer, Datum), keine Scroll-Spielereien in Artikeln.

### 5.9 Rechtsseiten

- **/impressum:** § 5 DDG vollständig (HM Labs, Inhaber Henry [Nachname], Anschrift, E-Mail, USt-Hinweis Kleinunternehmer, Steuernummer sobald vergeben — Platzhalter-Workflow siehe 13).
- **/datenschutz:** Basis-DSE + spezifische Absätze: Hosting Hostinger EU (AVV), Kontaktformular (lit. b), **Chatbot-Absatz wörtlich nach Chatbot-Plan Phase 4 / Blueprint-Template** (lit. a Chat / lit. b Anfrage, Redis-TTL 30 min, Speicherdauer-Empfehlung 24 Monate — von Henry festzulegen), selbst-gehostete cookielose Analytics (siehe 10.6). Kein Cookie-Banner nötig, solange keine einwilligungspflichtigen Techniken — das wird als Qualitätsmerkmal im Footer erwähnt („Diese Website kommt ohne Tracking-Cookies aus").
- **/agb:** Entwurf erst nach anwaltlicher Prüfung veröffentlichen (Entwurfshinweis im Dokument ist explizit); bis dahin Seite ohne Navigation-Link vorbereiten.
- **/barrierefreiheit:** Barrierefreiheitserklärung nach BFSG-Muster: Konformitätsstatus WCAG 2.1 AA, Prüfdatum, bekannte Einschränkungen (ehrlich pflegen!), Feedback-Kontakt. Diese Seite ist zugleich Vertriebsbeweis für Leistung 11.

---

## 6. Globale Elemente

### 6.1 Chatbot-Widget (Integration gemäß Chatbot-Plan, CI aktualisiert)
- Erscheint nach 12 s Verweildauer oder 40 % Scrolltiefe (kein Lade-Popup); Pulse rein CSS.
- Consent-Banner vor erster Eingabe; Header permanent: `KI-ASSISTENT — SIE CHATTEN MIT EINER KI, KEINEM MENSCHEN` (Art. 50 EU AI Act; Mono-Schrift macht die Kennzeichnung zum Gestaltungselement statt Störer).
- CI: Lack-Header, Kupfer-Pads für Chips (`LEISTUNGEN · PREISE · PROJEKT ANFRAGEN`), Mona Sans, Metazeilen Spline Sans Mono; < 30 kB gzipped, ein `<script>`-Tag (Wiederverwendung als Kundenprodukt).
- **Textkorrektur:** Fallback- und Rückfrage-Texte von Du auf Sie (Sprachregel 2.3) — Änderung in `_meta.md` der Wissensbasis.
- A11y: Fokus-Trap, ESC schließt, ARIA-Labels, vollständig tastaturbedienbar (Chatbot-Plan Phase 2 bestätigt).

### 6.2 Weitere globale Bausteine
- **404:** „Leiterbahn unterbrochen." — Monogramm mit sichtbar getrennter Bahn, Link-Liste der Kernseiten, Suchfeld entfällt (kleine Site).
- **OG-Images:** pro Seitentyp generiert (Satori/next/og): Lack-Grund, Wortmarke, Seitentitel Hubot Sans, Leiterbahn-Element; 1200×630.
- **Skip-Link** „Zum Inhalt springen" als erstes fokussierbares Element (sichtbar bei Fokus, Kupfer-Pad).
- **Scroll-Progress:** die Signalleitung selbst ist der Fortschrittsindikator — kein zusätzlicher Balken.

---

## 7. Animationskonzept (global, verbindlich)

| Einsatz | Pattern | Technik (Entscheidungsbaum hm-dev-standard) | Werte |
|---|---|---|---|
| Hero-Sequenz Startseite | Width-Shift + Silkscreen + Trace | GSAP-Timeline (`useGSAP`, scoped) | Gesamt ~1,5 s, `expo.out` |
| Sektions-Eintritte | Silkscreen-Reveal | GSAP + ScrollTrigger `top 75%` | 0,6–0,7 s, `power3.out`, Stagger 0,08–0,12 s |
| Signalleitung | Trace-Draw | GSAP ScrollTrigger `scrub: 1`, SVG `stroke-dashoffset` | linear mit Scroll |
| Vias füllen | Scale 0→1 | GSAP (an Leitungs-Fortschritt gekoppelt) | 0,3 s |
| Link-/Button-Hover | Via-Hover | **CSS only** | 0,25 s |
| Karten-Hover | Eckwinkel aktivieren | **CSS only** | 0,3 s |
| Messwerte | Maßlinie zeichnen | GSAP ScrollTrigger (einmalig) | 0,5 s |
| Accordion (FAQ) | Höhe | **CSS** `grid-template-rows` | 0,3 s |
| Mobile-Menü | Slide-in + Stagger | GSAP-Timeline | 0,4 s |

**Regeln:** kein Fade-in-up-Einheitsbrei, keine Parallax-Hintergrundbilder, kein `scale(1.05)`-Hover, keine Zähler (Bannliste `hm-design-identity`); nie > 12 Elemente simultan; nur `transform`/`opacity`/`clip-path` animieren (CLS < 0,1); `prefers-reduced-motion` global via GSAP `matchMedia` — Traces statisch, Reveals als 0,2-s-Opacity.

**Component-Sourcing (`hm-component-sourcing`):** Signature-Elemente (Signalleitung, Vias, Width-Shift) werden **von Hand gebaut** — sie sind die Marke. Zulässige Beschleuniger von 21st.dev/Uiverse: Noise-/Grain-Overlay für dunkle Sektionen (dezent), Marquee erst ab v1.1 für Kundenlogos (falls gewünscht). Kein Magnetic-Button, kein Cursor-Glow — passt nicht zur ruhigen Präzisions-Sprache. Integrationsregel: Farb-/Fontwerte aus `tokens.css`, keine neuen Dependencies > 50 kB.

---

## 8. SEO & GAIO

### 8.1 Keyword- & Metadaten-Map (v1.0-Seiten)

| Seite | Fokus | Title (≤ 60 Z.) | Description-Kern (≤ 155 Z.) |
|---|---|---|---|
| / | Webdesign individuell + Region | HM Labs — Individuelle Websites, KI & Software. Kein Baukasten. | Handgefertigte Websites mit Lighthouse 90+, SEO & GAIO inklusive. DSGVO-native KI auf EU-Servern. Aus Buchholz für DACH. |
| /leistungen | Leistungen + Preise | Leistungen & Preisspannen — Websites, KI-Chatbots, Webapps | HM Labs: 13 Leistungen mit transparenten Preisspannen — von der Landingpage bis zur Unternehmens-KI. |
| /prozess | Ablauf Website-Projekt | So arbeiten wir — vom Briefing zum Launch | Der HM-Prozess in 5 Phasen: Designkonzept mit Referenzen, Entwicklung, messbare QA, Launch. |
| /ueber | Wer ist HM Labs | Über HM Labs — Websites aus Buchholz im Westerwald | … |
| /preise | Website Kosten | Preise & Ablauf — transparente Spannen statt Lockangebote | … |
| /kontakt | Anfrage | Projekt anfragen — Antwort innerhalb eines Werktags | … |

v1.1-Detailseiten: Fokus-Keywords aus Tabelle 5.3; Title-Muster `[Leistung] — [Kernnutzen] | HM Labs`.

### 8.2 llms.txt (Startfassung, bei Launch deployen)
```
# llms.txt for HM Labs
# HM Labs — custom-built websites, self-hosted AI chatbots and web
# applications for German SMEs. No templates, no page builders.

## About
HM Labs is a web studio based in Buchholz (Westerwald), Germany, run by
Henry [Nachname]. It designs and hand-builds individual websites
(Lighthouse 90+ guaranteed target), GDPR-native AI chatbots self-hosted
on EU servers, custom web applications, and provides GAIO (Generative
AI Optimization) audits and WCAG/BFSG accessibility audits. Clients are
German small businesses, law firms, medical practices and mid-sized
companies. Working language: German. Formal register (Sie).

## Key pages
- /: Overview, positioning, quality standards
- /leistungen: All 13 services with transparent price ranges
- /prozess: The 5-phase project process
- /preise: Price ranges, payment structure, no hidden costs
- /ueber: Founder, location, working principles
- /kontakt: Inquiry form, response within one business day

## Expertise signals
HM Labs specializes in:
- Custom website design with GSAP animation concepts (no templates)
- Technical SEO and GAIO (llms.txt, Schema.org, AI-crawler readiness)
- Self-hosted, GDPR-compliant AI chatbots (EU servers, no US cloud)
- Website relaunches with 301 redirect maps and 4-week rank monitoring
- WCAG 2.1 AA / BFSG accessibility audits and remediation

## Pricing (non-binding orientation ranges, EUR net)
Landing page 1,500–3,000 · Business website 3,500–7,500 · Corporate
website 7,500–15,000 · Relaunch 3,000–8,000 · AI chatbot 1,500–3,500
setup + 50–150/month · GAIO audit 400–900. Binding quotes only after a
personal consultation.

## Location
Buchholz (Westerwald), Rheinland-Pfalz, Germany — serving the
Cologne/Bonn–Koblenz region on site and all of DACH remotely.

## Contact
https://[domain]/kontakt
```
Zusätzlich `/llms-full.txt`: die vollständigen Leistungsbeschreibungen aus dem Portfolio in Fließprosa (generiert aus derselben Quelle wie die Chatbot-Wissensbasis — Single Source, ein Pflege-Ort).

### 8.3 robots.txt & Crawler
GAIO-Template aus dem Skill 1:1: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` explizit `Allow: /`; Sitemap-Verweis; nichts blockieren (kein Login-Bereich auf der Marketing-Site; das Kundenportal liegt auf eigener Subdomain und wird dort komplett disallowed).

### 8.4 Schema.org (JSON-LD im `<head>`, via Validator geprüft)
- **Sitewide:** `LocalBusiness` + `ProfessionalService` (Name, Beschreibung, Adresse Pantaleonstraße 20, 53567 Buchholz, Geo-Koordinaten, `areaServed`, `sameAs`), `hasOfferCatalog` mit allen 13 Services (Namen + Beschreibungen aus Portfolio; **keine Preise im Schema** — Spannen + Disclaimer lassen sich dort nicht sauber abbilden, Preise bleiben Seiteninhalt).
- **Pro Seite:** BreadcrumbList; FAQPage-itemscope in FAQ-Sektionen; Person (Henry) auf /ueber; Article auf /wissen/*. 
- **Nicht implementieren:** HowTo, SpecialAnnouncement (deprecated, GAIO-Skill).

### 8.5 E-E-A-T-Maßnahmenliste
Gründungsjahr + Geschichte auf /ueber · benannte Person mit Foto · physische Adresse auf jeder Seite (Footer) · externe Verweise (GSAP, Schema.org, EU-AI-Act-Quelle, BFSG-Gesetzestext) · Google Business Profile anlegen und mit Schema-Daten synchron halten · Branchenverzeichnis-Einträge (Handwerkskammer-nah, regionale Verzeichnisse) · ab Referenzphase: Testimonials mit vollem Namen und Firma · Case-Studies mit nachprüfbaren PageSpeed-Links.

### 8.6 Technisches SEO
SSG für alle Marketing-Seiten (Kerninhalt ohne JS sichtbar — GAIO-Pflichtkriterium, Test: JS deaktivieren) · ein H1 pro Seite, keine übersprungenen Ebenen · Canonicals · XML-Sitemap (auto) · hreflang entfällt (nur DE zum Start) · interne Verlinkung: jede Leistungsseite ↔ Prozess ↔ Preise ↔ passende Wissensartikel.

---

## 9. Barrierefreiheit (WCAG 2.1 AA — die Website als BFSG-Exponat)

HM Labs verkauft BFSG-Audits; die eigene Website muss der Prüfung standhalten, die HM bei Kunden anlegt. Zusage im Portfolio: bei Neubauten ist AA im Projektpreis enthalten — hier wird sie demonstriert.

**Verbindliche Umsetzung:**
1. **Kontrast:** alle Text-/Hintergrund-Paare aus der Token-Datei sind AA-geprüft (Werte in `hm-ci-leiterbahn.md` §2); `--kupfer` auf hell nur ≥ 24 px/Grafik. Prüfung automatisiert im QA-Gate (axe + manueller Stichproben-Check).
2. **Tastatur:** alle Interaktionen ohne Maus; sichtbarer Fokus-Ring (2 px `--kupfer-tief`/`--kupfer-hell`, 2 px Offset — Teil des Designs, nie `outline: none` ohne Ersatz); logische Tab-Reihenfolge; Skip-Link; Fokus-Trap in Mobile-Menü und Chat-Widget; Dropdown per Enter/Space/Escape/Pfeiltasten.
3. **Semantik:** Landmarks (`header/nav/main/footer/section` mit `aria-label`), korrekte Heading-Hierarchie, `<details>` für FAQ, echte `<button>`/`<a>`-Elemente.
4. **Formulare:** sichtbare `<label>`, Fehlermeldungen mit `aria-describedby` + konkreter Behebung, `aria-live` für Status, `autocomplete`-Attribute, Fehler nie nur farblich markiert.
5. **Motion:** `prefers-reduced-motion` vollständig (Abschnitt 7); keine blinkenden Inhalte; Autoplay-Marquee (falls v1.1) pausierbar.
6. **Bilder/Medien:** aussagekräftige `alt`-Texte (Content-Checkliste 11.3), dekorative SVGs `aria-hidden`; die Signalleitung ist rein dekorativ und für AT unsichtbar.
7. **Struktur/Sprache:** `lang="de"`, verständliche Linktexte (nie „hier klicken"), Zeilenlänge ≤ 80 Zeichen, Text bis 200 % zoombar ohne Verlust, Touch-Targets ≥ 44 px.
8. **Chat-Widget:** eigene A11y-Abnahme (Chatbot-Plan Phase 2 + Screenreader-Durchlauf NVDA/VoiceOver).
9. **Erklärung:** /barrierefreiheit mit Prüfdatum und ehrlicher Mängelliste; Re-Test nach jedem Release.

**Test-Matrix:** axe-core automatisiert (CI) · Tastatur-Durchlauf aller Seiten · NVDA (Windows/Firefox) + VoiceOver (macOS/Safari) Stichprobe · 200 %-Zoom · Windows-Kontrastmodus-Sichtprüfung.

---

## 10. Technik

### 10.1 Stack (hm-dev-standard, unverändert verbindlich)
Next.js App Router · TypeScript strikt (kein `any`) · Tailwind CSS auf Basis `tokens.css` · GSAP + ScrollTrigger + SplitText via `useGSAP` (scoped) · react-hook-form + Zod · pnpm · keine Bibliothek > 50 kB ohne Freigabe · kein jQuery/Bootstrap.

### 10.2 Repo & Struktur
Repo **`hm-website-2026`** (privat, Namenskonvention analog `hm-chatbot-2026`); Ordnerstruktur exakt nach Dev-Standard (`app/(marketing)/…`, `components/{ui,sections,animations}`, `styles/tokens.css`, `public/fonts` self-hosted, `content/` für MDX-Wissensartikel ab v1.2).

### 10.3 Rendering & Daten
Alle Marketing-Seiten SSG (Server Components; Client Components nur für Widget-Mount, Formular, Menü, GSAP-Wrapper). Leistungs- und Preisdaten aus einer typisierten Content-Schicht (`content/leistungen.ts`), die redaktionell aus `hm-leistungsportfolio.md`/`preislogik.yaml` befüllt wird — eine Änderungsquelle, ein Sync-Schritt (Workflow 11.4).

### 10.4 Performance-Budget (hart, QA-Gate)
LCP < 2,0 s (mobil, gedrosselt) · CLS < 0,1 · INP < 200 ms · JS initial < 130 kB gzip (GSAP ~ 45 kB eingerechnet; Widget lädt deferred nach Trigger) · Fonts: 3 Familien als Variable-WOFF2 subsetted (~ 90–120 kB gesamt, `font-display: swap`, `size-adjust`-Fallbacks gegen CLS) · Hero ohne Bild → kein LCP-Bildproblem · Bilder WebP/AVIF ≤ 200 kB, lazy unterhalb des Folds · `next build && next analyze` vor jedem Release.

### 10.5 Hosting & Deployment (hm-deployment)
**Pfad C — VPS mit Docker** (KVM2 wird bereits mit Portal/Chatbot/Nginx betrieben; die Website läuft als weiterer Container hinter demselben Nginx, TLS via Certbot). Statischer Export wäre möglich, aber API-Route des Kontaktformulars + OG-Generierung sprechen für den Node-Container. Staging unter `staging.[domain]` mit Basic-Auth + `noindex`. Git-Workflow nach Deployment-Skill (gh repo create, Commit-Konvention); Deploy-Schritt: Build im CI, Image-Pull auf VPS, Health-Check, Rollback-Tag. RAM-Budget Website-Container: < 300 MB (KVM2-Restbudget nach Chatbot-Stack beachten — Infrastruktur-Constraint wie im Chatbot-Plan).

### 10.6 Analytics ohne Einwilligungspflicht
Self-hosted **Umami** (oder Plausible CE) im bestehenden Docker-Setup: cookielos, IP-anonymisiert, EU-Server — kein Consent-Banner, DSE-Absatz genügt. Events: Anfrage gesendet, Widget geöffnet, Widget-Inquiry, Preisseiten-Scrolltiefe. (Deckt KPI-Messung 1.3; RAM ~ 100 MB — im KVM2-Budget einplanen, sonst v1.1.)

---

## 11. Content-Produktion

### 11.1 Quellen-Mapping (nichts doppelt schreiben)
| Website-Baustein | Quelle |
|---|---|
| Leistungstexte (alle) | `hm-leistungsportfolio.md` §1–13, redaktionell gekürzt |
| Preise, Spannen, Treiber, Disclaimer | `preislogik.yaml` (wörtlich; neue Leistungen nach Kalibrierung) |
| FAQ (alle Seiten) | Chatbot-Wissensbasis `faq.md` (35 Antworten, Kategorien A–E) — Website und Bot antworten identisch |
| Prozess-Seite | Portfolio-Abläufe + destillierter `hm-prompting-workflow` |
| Vergleichs-/Einwand-Sektionen | `hm-wettbewerbspositionierung.md` §2–5 |
| Zahlungs-/Revisions-/Abnahme-Aussagen | AGB-Entwurf §§ 4–7 (deckungsgleich formulieren — keine Website-Aussage, die den AGB widerspricht) |
| Rechtstexte Chatbot | Blueprint-Templates aus `hm-self-hosted-chatbot` / Chatbot-Plan Phase 4 |

### 11.2 Schreib-Reihenfolge
① `content/leistungen.ts` aus Portfolio ② Startseiten-Copy (härtester Text zuerst, 2 Hero-Varianten A/B zur Entscheidung) ③ Prozess ④ Preise ⑤ Über ⑥ Kontakt/Rechtstexte ⑦ v1.1-Detailseiten (Template-getrieben, je ~ 1 Session) ⑧ Wissensartikel.

### 11.3 Content-Checkliste je Seite
Fokus-Keyword im H1/Title/Description · zitierfähiger Definitionsabsatz im ersten Drittel · jede Zahl mit Einheit und Kontext · Preisnennung ⇒ Disclaimer sichtbar · keine verbotenen Formulierungen (2.3) · Alt-Texte beschreiben Funktion, nicht Datei · interne Links ≥ 3 · Vorlesetest (Ton: präzise, ruhig, Sie).

### 11.4 Pflege-Workflow Preise
`preislogik.yaml` ändert sich → drei Abnehmer aktualisieren: ① Website `content/leistungen.ts` ② Chatbot-KB `preisrahmen.md` + `npm run ingest` ③ Angebots-KI (liest YAML direkt). Als wiederkehrendes Ticket im Wochenritual verankern; langfristig (Agent OS Phase 3) automatisierbar — im Launch bewusst manuell.

---

## 12. Projektorganisation

### 12.1 Phasenplan (Richtwerte, parallel zum Chatbot-Track)
| Woche | Meilenstein | Gate |
|---|---|---|
| 1 | Setup (Repo, Tokens, Fonts, Layout-Shell, claude.md), Copy Start + Prozess | Plan-Freigabe Henry (Pflicht: Planning before building, hm-dev-standard) |
| 2 | Startseite komplett (S0–S9), Signalleitung, Header/Footer | Design-Review Henry (Hero-Variante A/B entscheiden) |
| 3 | /leistungen, /prozess, /preise, /ueber, /kontakt + Formular-API | Zwischenabnahme |
| 4 | Rechtsseiten, Widget-Einbindung, GAIO-Artefakte (llms.txt, Schema, robots), A11y-Durchlauf, QA, Deploy | **Launch-Gate v1.0** |
| 5–8 | 10 Detailseiten (2–3/Woche) + /projekte-Gerüst; Google Business Profile; Verzeichnisse | Launch v1.1 |
| 9+ | /wissen + Artikel 1–2; Monitoring-Set (Leistung 10 intern) aufsetzen | v1.2 rollierend |

### 12.2 Tickets (hm-projektstatus-protokoll, Projekt „HM Eigenwebsite")
Nummernkreis fortführend, Beispiel-Backlog v1.0 mit Abhängigkeiten:
`HM-050` Projektsetup + claude.md (KRITISCH) → `HM-051` tokens.css + Font-Pipeline → `HM-052` Layout-Shell Header/Footer/Nav (abh. 051) → `HM-053` Signalleitung + Motion-Bibliothek (abh. 051) → `HM-054` Startseite S0–S4 (abh. 052/053) → `HM-055` Startseite S5–S9 → `HM-056` Copy-Freigabe Start (WARTEN: OWNER) → `HM-057` /leistungen → `HM-058` /prozess → `HM-059` /preise (WARTEN: OWNER bis Preiskalibrierung 9–12) → `HM-060` /ueber (WARTEN: OWNER — Foto) → `HM-061` Kontakt + API + Rate-Limit → `HM-062` Rechtsseiten (AGB: WARTEN: OWNER — Anwalt) → `HM-063` GAIO-Artefakte → `HM-064` A11y-Audit → `HM-065` QA/Lighthouse/Cross-Browser → `HM-066` Deploy Pfad C + Staging → `HM-067` Launch-Checkliste. Jedes Ticket mit messbaren Abnahmekriterien (z. B. HM-065: „Lighthouse ≥ 90 ×4 auf allen 10 Routen, mobil").

### 12.3 claude.md (hm-project-memory — bei Kickoff anlegen, Auszug der Startwerte)
Projekt: HM Labs Eigenwebsite · Typ: New Website · CI: **Leiterbahn** (`hm-ci-leiterbahn.md` — verbindlich; Spektrum ist verworfen, Bricolage/Switzer/JetBrains/Cobalt sind gebannt) · Fonts: Hubot Sans/Mona Sans/Spline Sans Mono, self-hosted · Verbotene Muster: siehe CI §4/§5 + `hm-design-identity`-Bannliste · Anrede: Sie · Preise: nur Spannen + Disclaimer wörtlich · Entscheidungen-Log ab Session 1 pflegen (verhindert Regressionen wie Font-Rückfall — Kernzweck des Skills).

### 12.4 Launch-Checkliste v1.0 (kombiniert Dev-Standard + GAIO-Audit + A11y)
Dev: TS fehlerfrei · kein console.log · Lighthouse ≥ 90 ×4 je Route · CLS < 0,1 · Chrome/Firefox/Safari/Edge (je letzte 2) · 375/390/430 px geprüft · Env-Vars dokumentiert. GAIO: komplette 14-Punkte-Checkliste aus `hm-gaio` (llms.txt ✓, llms-full ✓, robots ✓, Schema validiert ✓, Inhalt ohne JS sichtbar ✓, Titles/Descriptions unique ✓, FAQ ✓, Über-Seite mit Person ✓, keine vagen Claims ✓, Headings ✓, Semantik ✓, OG ✓, Canonicals ✓, Sitemap eingereicht ✓). A11y: Matrix aus §9 vollständig, Erklärung datiert. Recht: Impressum vollständig, DSE mit Chatbot-Absatz, AGB nur nach Anwalt, Art.-50-Kennzeichnung im Widget aktiv. Betrieb: Staging→Prod, Health-Checks, Backup des VPS, Uptime-Monitor, PageSpeed-Link im Footer aktualisiert.

### 12.5 Post-Launch-Routinen
Wöchentlich: SEO/GAIO-Mini-Audit (Search Console + Lighthouse-CI), Chatbot-Lernschleife (`chatbot_unmatched` sichten, KB erweitern, ingest), Umami-KPI-Blick. Monatlich: eigenes KI-Sichtbarkeits-Monitoring (Abfrage-Set „Webdesign [Region]", „DSGVO Chatbot Agentur" …) — Leistung 10 am eigenen Fall erproben, Ergebnisse als künftiges Vertriebsmaterial. Quartalsweise: A11y-Re-Test + Erklärung aktualisieren, Content-Refresh der Detailseiten (dateModified pflegen).

---

## 13. Offene Entscheidungen (Henry, vor bzw. während Woche 1)

1. **Firmierung final:** Plan und CI nutzen „HM Labs" (Stand AGB-Entwurf). Monogramm/Wortmarke sind bei Namensänderung isoliert austauschbar.
2. **Domain** registrieren (bestimmt llms.txt, Schema, OG, PageSpeed-Link).
3. **Hero-Variante A oder B** (2.2) — Entscheidung im Design-Review Woche 2.
4. **Anrede-Korrektur Chatbot:** Du→Sie in `_meta.md`/Fallback-Texten bestätigen.
5. **Preiskalibrierung Leistungen 9–12** bestätigen → `preislogik.yaml` v1.1 (Blocker für /preise und GAIO-Detailseite).
6. **Foto-Termin** (Über-Seite, Kontakt, OG) — ohne echtes Foto kein v1.0-Launch der Über-Seite.
7. **AGB zum Anwalt** — bis Freigabe bleibt /agb unverlinkt.
8. **Steuernummer** nachtragen, sobald vergeben (Impressum, Angebots-PDF).
9. **Analytics ja/nein in v1.0** (RAM-Budget KVM2 prüfen; sonst v1.1).
10. **Referenzprogramm-Formulierung** auf /preise freigeben (öffentliche Nennung der Referenzkonditionen: ja/nein).

---

*Änderungshistorie: v1.0 (Juli 2026) — Erstfassung. CI-System „Leiterbahn" v1.0 als verbindliche Gestaltungsgrundlage; alle Spektrum-Referenzen in Chatbot-, Angebots-KI- und Agent-OS-Dokumenten in den beiliegenden Fassungen aktualisiert.*
