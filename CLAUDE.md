# HM Labs — Project Memory

> This file is read by Claude Code at the start of every session.
> Do not delete sections. Update, don't replace.
> Verbindliche CI-Quelle: `docs/spec/hm-ci-leiterbahn.md` · Seitenplan: `docs/spec/hm-website-masterplan.md`
> Preise: `docs/spec/preislogik.yaml` (wörtlich) · Leistungstexte: `docs/spec/hm-leistungsportfolio.md`
> Last updated: 2026-07-07 (Session 2 — v1.0-Kernseiten im Leiterbahn-CI gebaut)

---

## Project overview
- **Client:** HM Labs (Eigenmarke, Inhaber Henry Mirus)
- **Industry:** Web-Studio — individuelle Websites, self-hosted KI-Chatbots, Webapps, GAIO- & BFSG-Audits (B2B, DACH)
- **Project type:** New website — `hm-website-2026` (Eigenprojekt, „Exponat Nummer eins")
- **Live URL:** noch nicht deployed (Domain offen — offene Entscheidung Nr. 2)
- **GitHub repo:** `hm-website-2026` (privat, geplant)
- **Deployment path:** VPS mit Docker (Pfad C) — Container hinter bestehendem Nginx auf KVM2, TLS via Certbot, Staging unter `staging.[domain]` (Basic-Auth + noindex)
- **Status:** In development — v1.0-Kernseiten im Leiterbahn-CI gebaut, Design-Review Henry ausstehend

---

## Tech stack
- **Framework:** Next.js App Router · TypeScript strikt (kein `any`)
- **Styling:** Tailwind CSS auf Basis `styles/tokens.css` (CSS-Variablen aus CI §8)
- **Animations:** GSAP + ScrollTrigger + SplitText via `useGSAP` (scoped); Hover/Feedback = CSS
- **Forms:** react-hook-form + Zod
- **Database:** Supabase / Portal-DB (Lead-Struktur wie `chatbot_leads` — ein Lead-Eingang, zwei Quellen)
- **Package manager:** npm (Bestand des Repos — Masterplan nennt pnpm; Wechsel bewusst nicht mitten im Projekt)
- **Node version:** v26 lokal; Deployment wie Portal/Chatbot-Stack (KVM2)
- **Fonts:** self-hosted via `next/font/local` — **nie** Google-CDN (hm-dev-standard). Quellen (SIL OFL, variable Fonts):
  - Hubot Sans: https://github.com/github/hubot-sans
  - Mona Sans: https://github.com/github/mona-sans
  - Spline Sans Mono: https://fonts.google.com/specimen/Spline+Sans+Mono (Quelltext: https://github.com/SorkinType/SplineSansMono)
- **Analytics:** self-hosted Umami/Plausible CE (cookielos, EU) — kein Cookie-Banner nötig

---

## Design rules — NEVER violate these

> CI-System **„Leiterbahn" v1.0** (Juli 2026) ersetzt „Spektrum" vollständig.
> Leitidee: **„Wir zeigen die Konstruktion."** Marke = handgeroutete Platine (Lack · Substrat · Kupfer).
> Was Leiterbahn NICHT ist: kein Cyberpunk, kein Matrix-Grün, keine Gaming-/Retro-Terminal-Ästhetik, kein Neon.

### Typography (self-hosted, OFL)
- **Display font:** **Hubot Sans** (Variable wght 200–900, wdth 75–125) — Headlines, Wortmarke, große Zahlen. H1/H2 in Width 110–125; Width 100 ab H3. Die Breitenachse ist Teil der Motion (Width-Shift).
- **Text font:** **Mona Sans** — Fließtext, UI, Navigation, Formulare (400 Body, 500 UI/Nav, 600 Hervorhebung). Hubot + Mona = eine Superfamilie.
- **Mono/Technik font:** **Spline Sans Mono** — Eyebrows/Sektionslabels, Preise, Maßangaben, Ticket-/Angebotsnummern, Metadaten, Code (400, 500). Jede *gemessene* Zahl steht in Mono.
- **Banned fonts:** Inter, Roboto, Arial, Helvetica, system-ui — **UND** alle Spektrum-/Alt-Fonts: **Bricolage Grotesque, Switzer, JetBrains Mono, Space Grotesk**.
- **Skala:** h1 `clamp(2.75rem, 6.5vw, 6rem)` (Hubot 800, wdth 120, lh 0.98, ls -0.03em) · h2 `clamp(1.875rem, 4vw, 3.5rem)` (Hubot 700, wdth 112) · h3 `clamp(1.25rem, 2.5vw, 1.875rem)` (Hubot 650, wdth 100) · body `clamp(1rem, 1.1vw, 1.125rem)` (Mona 400, lh 1.7) · label `0.8125rem` (Spline Mono 500, UPPERCASE, ls +0.12em).
- **Regel:** nie > 2 Schriftfamilien pro Viewport-Höhe sichtbar (Mono zählt als Annotation). Eyebrows immer mit Bestückungsdruck-Kennung, z. B. `[S2] LEISTUNGEN` (= zugleich Sprungmarken-Anker).

### Colors (`styles/tokens.css` — Kopiervorlage in CI §8)
Drei Materialien: **Lack** (Lötstopp-Grün), **Substrat** (heller Träger), **Kupfer** (einziger Akzent).
- **Background (Standard, hell):** Substrat `#F2F4F0` (kühles, minimal grünstichiges Weiß — KEIN warmes Creme)
- **Surface / Section-Alt:** Substrat-tief `#E7EBE4` · Fläche/Karten `#FFFFFF`
- **Dunkel (Hero, GAIO, Footer):** Lack `#0F211A` · Lack-Fläche `#1A3327`
- **Text primary:** `#17231D` (Near-Black mit Grünkälte) · muted `rgba(23,35,29,.62)`
- **Text invers (auf Lack):** `#F4F6F2` · invers-gedimmt `rgba(244,246,242,.64)`
- **Accent Kupfer:** `#C0752F` (Linien/Grafik/Ziffern) · `#8A501B` kupfer-tief (Links & Text auf hell, ≥4,5:1) · `#E0965B` kupfer-hell (Akzent auf Lack)
- **Linien:** `rgba(23,35,29,.14)` hell · `rgba(244,246,242,.18)` invers
- **Status (nur UI):** ok `#2E6B4F` · warnung `#9A6B15` · fehler `#A93226`
- **Banned colors:** die gesamte aktuelle Palette (`#09090F` bg, `#4F7FFF` primary, `#FF4D6A` accent) UND alle Spektrum-Farben (Ink/Paper/Stone/Brass, Cobalt).

**Farbregeln:**
1. **Ein Akzent.** Kupfer ist die einzige gesättigte Farbe. Keine zweite Akzentfarbe, keine Verläufe als Flächenfüllung. Einzige Ausnahme: subtiler Kupfer-Duotone auf Fotos.
2. **Kupfer ist Linie, nicht Fläche** (Leiterbahn/Unterstreichung/Ziffer/Via/Rahmen). Einzige zulässige Flächen­anwendung: Kupfer-Buttons.
3. **Dunkle Sektionen sind Momente, keine Norm.** Hell ist Grundzustand. `--lack` nur für 2–3 Schlüsselsektionen/Seite (Hero, GAIO/Zukunft, Footer).
4. `--kupfer` (#C0752F) auf hell nur für Grafik & Text ≥ 24 px — nie Fließtext/Links.

### Signature-Element
- **Die Signalleitung:** eine Kupfer-Leiterbahn (1,5 px), orthogonal mit 45°-Knicken, endet in **Vias** (Kreis 6 px, Kupfer-Ring, Substrat-Kern). Zeichnet sich mit dem Scroll durch die Seite (= zugleich Scroll-Progress-Indikator, kein extra Balken). Das ist das Element, das ein Besucher nach 24 h erinnert.
- **Weitere Elemente:** Testpunkte (`TP1`, `TP2` … Mono 10 px) markieren Qualitätsversprechen · Bestückungsdruck-Rahmen = feine Eckwinkel statt geschlossener Rahmen · Border-Radius global **2 px** (Pads, keine Pillen/runde Karten) · 8-px-Punktraster (3 % Deckkraft) nur auf dunklen Sektionen.
- **Logo:** Monogramm „hm" als eine durchgehende Leiterbahn (ein Linienzug, 45°-Knicke, endet in Vias; Stroke-Draw 0,9 s) · Wortmarke „HM LABS" Hubot 700 wdth 118 · das Via ist der einzige Kupfer-Punkt.

### Animation — Motion-Sprache „Signalfluss"
- **Overall feel:** ein Signal läuft durch eine präzise gebaute Struktur. Nichts hüpft, wackelt oder glüht. Präzise, ruhig.
- **Standard easing:** Entrances `power3.out`/`expo.out` · Exits `power2.in` · UI-Feedback 0,25–0,4 s
- **Standard duration:** Reveals 0,6–0,9 s · UI 0,3 s · Hero-Sequenz gesamt ~1,5 s
- **Die 5 Signature-Patterns:** ① Trace-Draw (SVG stroke-dashoffset, `scrub:1`) ② Width-Shift (Hubot wdth 85→120, `expo.out`, einmal/Seite im Hero) ③ Silkscreen-Reveal (`clip-path: inset()` von unten — ersetzt Fade-in-up) ④ Via-Hover (Kupferlinie zeichnet unter Link, Via am Ende; Karten aktivieren Eckwinkel) ⑤ Messung (Maßlinie unter fixem Wert — statt Counter).
- **Banned effects:** Fade-in-up-Einheitsbrei, `scale(1.05)`-Hover, Zähler/Counter, Parallax-Hintergrundbilder, Glassmorphism, Glow/Neon/Shimmer, Magnetic-Button, Cursor-Glow, Schlagschatten > 8 px, Stockfotos, 3D-Chip-Renderings, Binärcode/Matrix-Deko. Nie > 12 Elemente ohne Stagger; nie `width/height/margin` animieren (nur transform/opacity/clip-path, CLS < 0,1).
- **`prefers-reduced-motion: reduce` verbindlich:** Traces vollständig gezeichnet, Reveals = 0,2-s-Opacity, Signalleitung statisch. Kein Nice-to-have.

### Voice & Ton
- **Anrede:** durchgängig **Sie** (Website, Chatbot, Portal, Angebote).
- **Ton:** präzise, ruhig, konkret. Zahlen statt Adjektive („Lighthouse 94" > „blitzschnell").
- **Verboten:** Preiskampf-Rhetorik („günstiger als …"), „KI-generiert", Buzzwords ohne Beleg („innovativ/modern/professionell"), **Festpreise, Garantien, feste Lieferzusagen** (nur „Richtwert"), Vokabular „KI-Agenten" gegenüber Kunden.
- **Pflicht:** jede Preisnennung als **Spanne** + wörtlicher Disclaimer aus `preislogik.yaml` (auf Website statischer Textbaustein direkt unter der Preisnennung).

### Mood keywords
präzise · konstruiert · ruhig · wertig · ingenieurhaft (deutsches Handwerk, kein Marketing-Lack)

---

## Approved sections and features

**Gebaut am 2026-07-07 (Owner-Review/Abnahme durch Henry noch AUSSTEHEND — nichts ist „locked"):**

- [x] Fundament: `styles/tokens.css` (CI §8 exakt) · Tailwind auf Token-Variablen · Fonts self-hosted via `next/font/local` (`lib/fonts.ts`, `public/fonts/`)
- [x] Motion-Bibliothek `components/animations/`: Signalleitung (Scrub-Trace + Vias, `data-via`-Anmeldung), Reveal (Silkscreen), WidthShift (SplitText, font-stretch 85→120 %), Messung (Maßlinie statt Counter), TraceDraw — alle mit `gsap.matchMedia` + reduced-motion-Zweig
- [x] Layout-Shell `components/site/`: Header (sticky 64 px, Section-Observer-Invertierung, Leistungen-Dropdown mit Mono-Preisspannen, Mobile-Lack-Overlay mit Fokus-Trap + Resize-Close), Footer (Lack, 3 ungleiche Spalten, PageSpeed-Einladung), SkipLink, SiteShell
- [x] Startseite `/` — S0–S9 komplett nach Masterplan §5.1 (Hero-Variante **A**; S5 ohne Live-Widget-Verweis, S9 ohne Chatbot-Weg — Widget folgt)
- [x] `/leistungen` — 4 Kapitel, 13 Karten im Eckwinkel-Rahmen, Disclaimer-Box je Kapitel, „Verbindliche Grundsätze"
- [x] `/prozess` — 5 Phasen an vertikaler Leiterbahn, Werkzeuge/Qualitätsgates, Nach-Launch, FAQ (FAQPage-Markup)
- [x] `/preise` — Grundsatz + Disclaimer oben, Übersichtstafel, 6 Preistreiber, Zahlungs-Leiterbahn, § 19-UStG-Hinweis, Wartungstarife (Basis = Default), Referenzprogramm, Preis-FAQ
- [x] `/ueber` — Prinzipien (TP1–TP4), Werte, ehrliche Phase; **Portrait-Platzhalter** („ABB. 01 — PORTRAIT FOLGT")
- [x] `/kontakt` — react-hook-form + Zod, Honeypot, aria-live; API erweitert (Honeypot, budget→metadata)
- [x] Rechtsseiten neu: `/impressum` (§ 5 DDG, Adresse, § 19 UStG) · `/datenschutz` (passt zum Ist: keine Tracking-Cookies) · `/barrierefreiheit` (Erklärung mit ehrlicher Mängelliste)
- [x] 404 „Leiterbahn unterbrochen" (Monogramm mit Bruchstelle) + Error-Page
- [x] GAIO: `llms.txt` + `llms-full.txt` neu (alte Fassung hatte Festpreis/14-Tage/erfundene Referenzen — ersetzt!), robots.txt mit KI-Crawlern, sitemap mit hreflang, JSON-LD LocalBusiness+ProfessionalService+OfferCatalog (ohne Preise), Person auf /ueber, FAQPage per itemscope
- [x] EN: `/en/*`-Wrapper für alle 6 Kernseiten, Sprachumschalter im Header, `?lang=en`→301→`/en/*` (Middleware), Rechtsseiten DE-only
- [ ] `/agb` — bewusst NICHT gebaut (Entwurf erst nach Anwalt veröffentlichen; unverlinkt)
- [ ] Chatbot-Widget — eigener Track (hm-chatbot-implementierungsplan), bei Integration: S5/S9-Verweise + DSE-Chatbot-Absatz ergänzen
- [ ] OG-Images per Satori/next/og — v1.0-Rest

---

## Sourced components

Signature-Elemente (Signalleitung, Vias, Width-Shift) werden **von Hand gebaut** — sie sind die Marke, nicht sourcen.

| Component | Source | File path | Adapted colors |
|-----------|--------|-----------|----------------|
| — | — | — | — |

Zulässige Beschleuniger (hm-component-sourcing): dezentes Noise-/Grain-Overlay für dunkle Sektionen · Marquee erst ab v1.1 (Kundenlogos). Kein Magnetic-Button, kein Cursor-Glow. Farb-/Fontwerte nur aus `tokens.css`, keine Dependency > 50 kB.

---

## Do not touch (locked)

- Verbindliche CI-Quelle `docs/spec/hm-ci-leiterbahn.md` und Seitenplan `docs/spec/hm-website-masterplan.md` — nicht ohne Owner-Freigabe abweichen.
- Preis-Disclaimer bleibt wörtlich aus `preislogik.yaml` (Single Source; Pflege-Workflow Masterplan §11.4).

---

## Known issues / deferred work

**Alle CI-Deviations aus Session 1 sind BEHOBEN** (Google-CDN raus, Alt-Palette/Fonts ersetzt, ParticleNetwork/Glow/Shimmer/Typewriter gelöscht, Festpreis-/14-Tage-Voice entfernt, SPA → Multi-Route-SSG, Schema neu). Verbleibend:

- [ ] **Preise Leistungen 09–12 fehlen** (nicht in `preislogik.yaml` v1.0) → Website zeigt „auf Anfrage". Nach Kalibrierung (offene Entscheidung 5): YAML v1.1 → `content/leistungen.ts` nachziehen; GAIO-Badge darf dann „EINSTIEG AB 400 €" heißen. Auch S5-CTA und llms.txt betroffen.
- [ ] **Font-Subsetting offen:** Fonts gesamt ~366 kB (Hubot 170 + Mona 137 + Spline 59) vs. Budget 90–120 kB. `pyftsubset` (latin) einplanen — fonttools war auf dem System defekt (libexpat-Konflikt).
- [ ] **First Load JS ~156 kB** vs. Budget < 130 kB (GSAP+SplitText+ScrollTrigger). Optimierung: SplitText nur auf Seiten mit WidthShift dynamisch laden.
- [ ] Kontakt-API benötigt Supabase-Env (`contact_submissions`) — im Worktree keine `.env.local`; vor Deploy prüfen. Serverseitig fehlt noch die E-Mail-Notification (Masterplan §5.7).
- [ ] A11y-Restarbeiten: NVDA-Durchlauf (Windows), 200 %-Zoom-Test, axe-CI-Gate — Erklärung /barrierefreiheit nennt das ehrlich.
- [ ] Referenzprogramm-Text auf /preise ist öffentlich formuliert → Freigabe Henry (offene Entscheidung 10).
- [ ] Hero-Variante A ist live; Variante B („Kein Template. Kein Baukasten. Konstruiert für Sie.") liegt in `components/home/Hero.tsx`-Kommentar — Design-Review Woche 2.
- [ ] Bilder: KEINE Higgsfield-/KI-Bilder verwendet — CI §4 verbietet Stock/Fake, /ueber braucht ein **echtes** Foto (Termin = offene Entscheidung 6). Platzhalter ist ehrlich beschriftet.
- [ ] Signalleitung erst ab xl (1280 px) sichtbar — bewusst (Overlap-Vermeidung); mobile Alternative ggf. im Review diskutieren.
**Owner-Entscheidung 2026-07-07:** EN-Toggle (`?lang=en`) bleibt bestehen, abweichend vom Masterplan-Vorschlag „DE-only für v1.0". Bei Umbau auf Multi-Route-SSG den Toggle-Mechanismus mitdenken (aktuell Client-State in der SPA — pro Route neu lösen, ggf. `/en/*`-Präfix statt Query-Param für sauberes hreflang/SSG).

**Offene Owner-Entscheidungen (Masterplan §13):** Firmierung final · Domain · Hero-Variante A/B · Chatbot Du→Sie · Preiskalibrierung Leistungen 9–12 (Blocker /preise) · Foto-Termin (Blocker /ueber) · AGB zum Anwalt · Steuernummer · Analytics ja/nein v1.0 · Referenzprogramm-Formulierung.

---

## Current session task

v1.0-Kernseiten sind im Leiterbahn-CI gebaut (Fundament + Motion + Shell + 6 Kernseiten DE/EN + Rechtsseiten + GAIO-Artefakte; `next build` grün, 52 statische Seiten). **Nächster Schritt:** Design-Review durch Henry (Hero A/B, Referenzprogramm-Text, Signalleitung-Verhalten), danach: Font-Subsetting, OG-Images, Chatbot-Widget-Integration, Preiskalibrierung 09–12 → YAML v1.1.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-07-07 | CLAUDE.md angelegt (hm-project-memory), gefüllt mit Leiterbahn-CI v1.0. Ist-Analyse von app/ + components/: aktueller Code (dark-tech, Particle/Glow, Google-CDN-Fonts, Festpreis-Voice, SPA) weicht vollständig von Ziel-CI ab. Umsetzungsplan erarbeitet. |
| 2026-07-07 | Font-Quellen geklärt (Hubot Sans/Mona Sans via github/github, Spline Sans Mono via Google Fonts/SorkinType) — self-hosted via `next/font/local`. Entscheidung: EN-Toggle bleibt (abweichend vom Masterplan-DE-only-Vorschlag für v1.0) — bei SSG-Umbau Query-Param vs. `/en/*`-Präfix klären. |
| 2026-07-07 | **Session 2 — v1.0 komplett gebaut:** tokens.css + Tailwind + next/font (Fonts in public/fonts, Spline TTF→woff2 konvertiert) · Motion-Bibliothek (Signalleitung, Silkscreen, Width-Shift, Messung, TraceDraw, alle mit reduced-motion) · Header/Footer/SiteShell · Startseite S0–S9 (Hero A) · /leistungen /prozess /preise /ueber /kontakt (RHF+Zod+Honeypot) · Rechtsseiten neu (§ 5 DDG, DSE passend zum Ist, Barrierefreiheitserklärung) · 404/Error · llms.txt+llms-full.txt neu (alte Fassung mit Festpreis/Fake-Referenzen ersetzt), robots mit KI-Crawlern, sitemap+hreflang, Schema-Graph · EN-Routen /en/* + 301 von ?lang=en · 23 Alt-Komponenten + lib/consent + lib/translations gelöscht, framer-motion deinstalliert; gsap/@gsap/react/react-hook-form/zod installiert · Preview-Review (Desktop/Mobil): Header-CTA-Leak & Scroll-Lock-Bug gefixt. Build grün (52 Seiten statisch). |
