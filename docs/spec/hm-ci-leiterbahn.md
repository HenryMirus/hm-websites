# HM Labs — Corporate Identity „Leiterbahn"
**Version 1.0 · Juli 2026 · Ersetzt das bisherige CI-System „Spektrum" vollständig**

> Dieses Dokument ist die verbindliche Quelle für alle visuellen Entscheidungen der Eigenmarke: Website, Chat-Widget, Kundenportal, Agent-OS-Dashboard, Angebots-PDFs, Social-Grafiken. Es ersetzt `Spektrum-CI.md` im Vault. Kundenprojekte folgen weiterhin `hm-design-identity` (fünf Ästhetik-Richtungen) — dieses System hier gilt ausschließlich für HM Labs selbst.

---

## 1. Leitidee

HM Labs verkauft Präzision, die man sonst nicht sieht: sauberen Code, messbare Performance, durchdachte Struktur. Die Marke macht genau das sichtbar — sie inszeniert sich als **handgeroutete Platine**.

Eine Leiterplatte ist die perfekte Metapher für das, was HM Labs von Baukästen und Template-Agenturen unterscheidet:

- **Jede Leiterbahn ist bewusst gelegt.** Nichts ist Zufall, nichts ist Dekoration. Genau wie jede Designentscheidung bei HM.
- **Qualität ist messbar.** Eine Platine wird geprüft, nicht behauptet — Testpunkte, Prüfprotokolle. Genau wie Lighthouse 90+, CLS < 0,1, WCAG 2.1 AA.
- **Die Schönheit liegt in der Funktion.** Eine gut geroutete Platine ist ästhetisch, weil sie richtig ist. Deutsches Ingenieurshandwerk, kein Marketing-Lack.
- **Unter der Oberfläche entscheidet sich alles.** Der Besucher sieht die Website; HM zeigt ihm die Konstruktion darunter.

Der Markensatz, gegen den jede Gestaltungsentscheidung geprüft wird:

> **„Wir zeigen die Konstruktion."** — Wenn ein Element nichts über Präzision, Struktur oder Verbindung aussagt, fliegt es raus.

**Was „Leiterbahn" bewusst NICHT ist:** kein Cyberpunk, kein Matrix-Grün auf Schwarz, keine Gaming-Ästhetik, kein Retro-Terminal. Die Referenz ist die reale, physische Elektronik-Fertigung: mattgrüner Lötstopplack, Kupfer, weißer Bestückungsdruck — ruhig, wertig, präzise.

---

## 2. Farbsystem

Die Palette entlehnt der Leiterplatte ihre drei Materialien: **Lack** (Lötstopplack, tiefes Grün), **Substrat** (das helle Trägermaterial) und **Kupfer** (die Leiterbahnen — der einzige Akzent).

```css
:root {
  /* Basis hell (Standard-Modus) */
  --substrat:        #F2F4F0;   /* Seitenhintergrund — kühles, minimal grünstichiges Weiß. KEIN warmes Creme. */
  --substrat-tief:   #E7EBE4;   /* Section-Alternation, Zebra-Flächen */
  --flaeche:         #FFFFFF;   /* Karten, Formularfelder, erhabene Elemente */

  /* Basis dunkel (Hero, Signature-Sektionen, Footer) */
  --lack:            #0F211A;   /* tiefes Lötstopp-Grün, fast schwarz */
  --lack-flaeche:    #1A3327;   /* Flächen/Karten auf dunklem Grund */

  /* Text */
  --text:            #17231D;   /* Primärtext — Near-Black mit Grünkälte */
  --text-gedimmt:    rgba(23, 35, 29, 0.62);
  --text-invers:     #F4F6F2;   /* Text auf --lack */
  --text-invers-ged: rgba(244, 246, 242, 0.64);

  /* Akzent: Kupfer — max. 10 % der Seitenfläche (hm-dev-standard, Kriterium 2) */
  --kupfer:          #C0752F;   /* Linien, große Ziffern, Grafikelemente */
  --kupfer-tief:     #8A501B;   /* Textlinks & kleine Akzente auf hellem Grund (Kontrast ≥ 4,5:1) */
  --kupfer-hell:     #E0965B;   /* Akzent auf dunklem Grund (Kontrast ≥ 4,5:1 auf --lack) */

  /* Linien */
  --linie:           rgba(23, 35, 29, 0.14);   /* Haarlinien hell */
  --linie-invers:    rgba(244, 246, 242, 0.18);

  /* Status (nur UI: Portal, Dashboard, Formulare) */
  --ok:              #2E6B4F;
  --warnung:         #9A6B15;
  --fehler:          #A93226;
}
```

**Regeln:**
1. **Ein Akzent.** Kupfer ist die einzige gesättigte Farbe. Keine zweite Akzentfarbe, keine Verläufe als Flächenfüllung. Erlaubt ist ausschließlich ein subtiler Kupfer-Duotone auf Fotos/Illustrationen (siehe Bildsprache).
2. **Kupfer ist Linie, nicht Fläche.** Kupfer erscheint als Leiterbahn, Unterstreichung, Ziffer, Via-Punkt, Rahmen — großflächige Kupfer-Buttons sind die einzige zulässige Flächenanwendung.
3. **Dunkle Sektionen sind Momente, keine Norm.** Hell ist der Grundzustand (Zielgruppe: Kanzleien, Praxen, Mittelstand). `--lack` markiert die zwei bis drei wichtigsten Sektionen pro Seite (Hero, GAIO/Zukunft, Footer).
4. **Geprüfte Kontraste (WCAG 2.1 AA):** `--text` auf `--substrat` ≈ 14:1 ✓ · `--kupfer-tief` auf `--substrat` ≈ 5,0:1 ✓ · `--text-invers` auf `--lack` ≈ 15:1 ✓ · `--kupfer-hell` auf `--lack` ≈ 6:1 ✓. `--kupfer` (#C0752F) ist auf hellem Grund **nur** für Grafik und Text ≥ 24 px zugelassen (≈ 3,2:1 — AA Large), nie für Fließtext oder Links.

---

## 3. Typografie

Drei Schriften, drei Rollen, alle frei lizenziert (OFL) und self-hosted (`next/font`, nie Google-CDN — hm-dev-standard):

| Rolle | Schrift | Einsatz | Schnitte |
|---|---|---|---|
| **Display** | **Hubot Sans** (Variable: wght 200–900, wdth 75–125) | Headlines, Wortmarke, große Zahlen | 700–800, Width 110–125 („SemiExpanded/Expanded") für H1/H2; Width 100 ab H3 |
| **Text** | **Mona Sans** | Fließtext, UI, Navigation, Formulare | 400 (Body), 500 (UI/Nav), 600 (Hervorhebung) |
| **Technik** | **Spline Sans Mono** | Eyebrows/Sektionslabels, Preise, Maßangaben, Ticket-/Angebotsnummern, Metadaten, Code | 400, 500 |

Hubot Sans und Mona Sans sind eine Superfamilie (gemeinsame Konstruktion, zwei Stimmen) — die Paarung wirkt gebaut, nicht gemischt. Die variable Breitenachse von Hubot Sans ist Teil der Motion-Sprache (siehe Abschnitt 5).

**Skala** (übernimmt die bewährte Struktur aus `hm-design-identity`):
```
h1:    clamp(2.75rem, 6.5vw, 6rem)     · Hubot Sans 800, wdth 120, lh 0.98, ls -0.03em
h2:    clamp(1.875rem, 4vw, 3.5rem)    · Hubot Sans 700, wdth 112, lh 1.08, ls -0.02em
h3:    clamp(1.25rem, 2.5vw, 1.875rem) · Hubot Sans 650, wdth 100, lh 1.2
body:  clamp(1rem, 1.1vw, 1.125rem)    · Mona Sans 400, lh 1.7
label: 0.8125rem                        · Spline Sans Mono 500, UPPERCASE, ls +0.12em
```

**Verwendungsregeln:**
- Eyebrows/Sektionslabels immer in Spline Sans Mono, Uppercase, mit vorangestellter Bestückungsdruck-Kennung: `[S2] LEISTUNGEN` — die Kennung ist zugleich Sprungmarken-Anker.
- Jede Zahl, die eine Messung ist (Lighthouse-Score, Wochen, Preisspannen, Prozent), steht in Spline Sans Mono — Zahlen sind bei HM Labs Messwerte, keine Dekoration.
- Nie mehr als zwei Schriftfamilien sichtbar pro Viewport-Höhe (Mono zählt als Annotation, nicht als dritte Stimme — sparsam einsetzen).

---

## 4. Grafiksprache & Gestaltungselemente

**Das Leiterbahn-Motiv** ist das Signature-Element: eine Linie (1,5 px, `--kupfer`), die orthogonal mit 45°-Knicken verläuft — wie eine handgeroutete Kupferbahn — und in einem **Via** endet (Kreis 6 px, Kupfer-Ring, Substrat-Kern). Einsatz:
- Als vertikale Führungslinie, die Sektionen einer Seite verbindet (die „Signalleitung" der Seite)
- Als Verbindungslinie in Prozess-Darstellungen und Diagrammen
- Als Hover-Unterstreichung von Links (zeichnet sich von links, endet mit Via-Punkt)
- Im Logo (siehe unten)

**Weitere Elemente:**
- **Testpunkte:** kleine beschriftete Kreise (`TP1`, `TP2` … in Spline Sans Mono 10 px) markieren Qualitätsversprechen — z. B. neben „Lighthouse ≥ 90". Das Prüfprotokoll als Gestaltungselement.
- **Bestückungsdruck-Rahmen:** feine weiße (auf dunkel) bzw. graphitgrüne (auf hell) Eckwinkel statt geschlossener Rahmen um Karten — wie Silkscreen-Markierungen auf einer Platine. Border-Radius global: **2 px** (Pads sind eckig; keine Pillen-Buttons, keine runden Karten).
- **Raster:** ein subtiles 8-px-Punktraster (`--linie`, 3 % Deckkraft) darf auf dunklen Sektionen als Hintergrundtextur liegen — Lochraster-Anmutung, nie auf hellen Sektionen.
- **Verboten:** Stockfotos, 3D-Chip-Renderings, Binärcode-/Matrix-Deko, Glüh-/Neon-Effekte, Schlagschatten > 8 px Weichheit, Glassmorphism.

**Logo-Richtung:**
- **Bildmarke:** Monogramm „hm" als eine einzige durchgehende Leiterbahn gezeichnet (ein Linienzug, 45°-Knicke, beginnt und endet in je einem Via). Funktioniert als Favicon, animierbar (Stroke-Draw-on, 0,9 s beim Seitenladen).
- **Wortmarke:** „HM LABS" in Hubot Sans 700, wdth 118, dazu optional die Mono-Unterzeile `[ WEBSITES · KI · SOFTWARE ]`.
- Einfarbig: Text-Farbe der jeweiligen Fläche; das Via im Monogramm ist der einzige Kupfer-Punkt.

**Bildsprache:** echte Arbeitsfotos (Schreibtisch, Skizzen, Code auf Bildschirm, Henry) statt Stock; Behandlung wahlweise nativ oder als Kupfer-Duotone (`--lack` → `--kupfer-hell`). Screenshots von Projekten immer in einem Bestückungsdruck-Rahmen mit Mono-Bildunterschrift (`ABB. 03 — KUNDENPORTAL, DASHBOARD`).

---

## 5. Motion-Sprache „Signalfluss"

Bewegung erzählt bei HM Labs immer dasselbe: **ein Signal läuft durch eine präzise gebaute Struktur.** Nichts hüpft, nichts wackelt, nichts glüht.

**Grundwerte** (konform zu hm-dev-standard):
- Entrances: `power3.out` bzw. `expo.out`, 0,6–0,9 s · UI-Feedback: 0,25–0,4 s · Exits: `power2.in`
- Kein `elastic`, kein `bounce` — HM Labs ist eine professionelle Marke
- Scroll-Animationen immer GSAP + ScrollTrigger; Hover/Feedback immer CSS (Entscheidungsbaum hm-dev-standard)
- Nie mehr als 12 Elemente gleichzeitig ohne Stagger; nie `width/height/margin` animieren

**Die fünf Signature-Patterns:**

1. **Trace-Draw:** SVG-Leiterbahnen zeichnen sich per `stroke-dashoffset`, an Scroll gekoppelt (`scrub: 1`). Die vertikale Signalleitung der Seite wächst mit dem Scrollfortschritt; erreicht sie eine Sektion, füllt sich deren Via (Scale 0 → 1, 0,3 s) und das Sektionslabel blendet ein.
2. **Width-Shift:** H1/H2 animieren beim Reveal die variable Breitenachse von Hubot Sans (wdth 85 → 120, 0,8 s, `expo.out`) — die Headline „spreizt sich in Position". Das Signature-Pattern der Marke; einmal pro Seite im Hero, sparsam sonst.
3. **Silkscreen-Reveal:** Textblöcke erscheinen per `clip-path: inset()` von unten (0,6 s), wie ein Druckvorgang — statt des verbotenen Allerwelts-Fade-in-up (hm-design-identity-Bannliste).
4. **Via-Hover:** Links und Buttons: Kupferlinie zeichnet sich in 0,25 s von links unter dem Element, am Ende erscheint der Via-Punkt. Karten heben nicht ab und skalieren nicht (`scale(1.05)` ist gebannt) — stattdessen aktiviert sich der Eckwinkel-Rahmen (Kupfer, 0,3 s).
5. **Messung:** Zahlen-Werte werden nicht hochgezählt (Counter sind gebannt) — stattdessen zeichnet sich unter dem fixen Wert eine Maßlinie mit Endstrichen (0,5 s), die den Wert als „gemessen" markiert.

**Reduced Motion:** Bei `prefers-reduced-motion: reduce` sind alle Traces vollständig gezeichnet, alle Reveals durch einfache Opacity-Blenden (0,2 s) ersetzt, die Signalleitung statisch. Verbindlich, kein Nice-to-have.

---

## 6. Stimme & Ton (Kurzfassung)

- **Anrede:** durchgängig **Sie** — auf Website, im Chatbot, im Portal, in Angeboten. (Achtung: der Chatbot-Fallback-Text im Implementierungsplan duzt noch — bei Umsetzung korrigieren.)
- **Ton:** präzise, ruhig, konkret. Jede Aussage belegbar — Zahlen statt Adjektive. „Lighthouse 94" schlägt „blitzschnell".
- **Verboten** (aus Wettbewerbspositionierung): Preiskampf-Rhetorik („günstiger als …"), das Wort „KI-generiert", Buzzwords ohne Beleg („innovativ", „modern", „professionell"), Festpreise, Garantien, feste Lieferzusagen.
- **Pflicht:** jede Preisnennung als Spanne + wörtlicher Disclaimer aus `preislogik.yaml`.

---

## 7. Anwendung auf bestehende Systeme

| System | Anpassung |
|---|---|
| **Website** | Vollanwendung — siehe `hm-website-masterplan.md` |
| **Chat-Widget** | Header/Buttons in `--lack`/`--kupfer`, Schrift Mona Sans + Spline Sans Mono (Metazeile), Chips als Pads (2 px Radius, Eckwinkel-Hover). CI-Zeile im Chatbot-Plan aktualisiert. |
| **Angebots-PDF** | Kopf: Monogramm + Wortmarke; Headlines Hubot Sans, Fließtext Mona Sans, Angebotsnummer/Metadaten Spline Sans Mono; Positionsblöcke mit Haarlinien + Via-Aufzählungspunkten; Disclaimer-Box mit Kupfer-Linksborder (Disclaimer bleibt Code-injiziert). |
| **Kundenportal & Agent-OS-Dashboard** | Tokens 1:1 als CSS-Variablen übernehmen (Branding bleibt austauschbar, wie im Umsetzungsplan gefordert). Statusfarben aus Abschnitt 2. |
| **Skills** | `hm-design-identity` erhält einen Eigenmarken-Abschnitt (aktualisierte Fassung liegt bei). |

---

## 8. Token-Datei (Kopiervorlage `styles/tokens.css`)

```css
/* HM Labs — Leiterbahn v1.0 */
:root {
  --substrat: #F2F4F0; --substrat-tief: #E7EBE4; --flaeche: #FFFFFF;
  --lack: #0F211A; --lack-flaeche: #1A3327;
  --text: #17231D; --text-gedimmt: rgba(23,35,29,.62);
  --text-invers: #F4F6F2; --text-invers-ged: rgba(244,246,242,.64);
  --kupfer: #C0752F; --kupfer-tief: #8A501B; --kupfer-hell: #E0965B;
  --linie: rgba(23,35,29,.14); --linie-invers: rgba(244,246,242,.18);
  --ok: #2E6B4F; --warnung: #9A6B15; --fehler: #A93226;

  --font-display: 'Hubot Sans', sans-serif;
  --font-text: 'Mona Sans', sans-serif;
  --font-mono: 'Spline Sans Mono', monospace;

  --radius: 2px;
  --space-unit: 8px;               /* Raster: alle Abstände Vielfache von 8 */
  --ease-in: cubic-bezier(.55,.06,.68,.19);
  --ease-out: cubic-bezier(.22,1,.36,1);
  --dur-ui: .3s; --dur-reveal: .7s;
}
```

---

*Änderungshistorie: v1.0 (Juli 2026) — Erstfassung. Ersetzt „Spektrum" (Bricolage Grotesque/Switzer/JetBrains Mono, Ink/Paper/Stone/Brass, Cobalt) vollständig. Namensbasis „HM Labs" gemäß AGB-Entwurf; funktioniert unverändert, falls die Namensfindung anders ausgeht (Monogramm anpassen).*
