# HM Labs — Project Memory

> This file is read by Claude Code at the start of every session.
> Do not delete sections. Update, don't replace.
> **Owner-Entscheidung 2026-07-07: Das CI-System „Leiterbahn" ist VERWORFEN.**
> Verbindlich ist das ursprüngliche Dark-Tech-Design (siehe Design rules) mit dem erneuerten Content.
> Content-Quellen bleiben verbindlich: Preise `docs/spec/preislogik.yaml` (wörtlich) · Leistungstexte `docs/spec/hm-leistungsportfolio.md`
> Last updated: 2026-07-15 (Session 6 — Hero-Klarheit: „Was mache ich?" sofort erkennbar, Sektionsreihenfolge)

---

## Project overview
- **Client:** HM Labs (Eigenmarke, Inhaber Henry Mirus)
- **Industry:** Web-Studio — individuelle Websites, self-hosted KI-Chatbots, Webapps, GAIO- & BFSG-Audits (B2B, DACH)
- **Project type:** Redesign des Contents auf bestehender Website (Single-Page-App + Rechtsseiten)
- **Live URL:** hm-labs.de (Code referenziert diese Domain)
- **GitHub repo:** HenryMirus/hm-websites
- **Deployment path:** bisher Vercel (laut DSE); langfristig VPS mit Docker (KVM2) geplant
- **Status:** In development — Original-Design mit erneuertem Content, Review Henry ausstehend
- **Claude Design project:** `HM Labs — Design System` auf claude.ai/design (geseeded aus dem `HM Websites — Design System`-Master — siehe `hm-design-sync`)

---

## Tech stack
- **Framework:** Next.js 14 App Router · TypeScript
- **Styling:** Tailwind CSS (Farben/Fonts direkt in `tailwind.config.ts`)
- **Animations:** framer-motion (+ Canvas-ParticleNetwork im Hero-Hintergrund)
- **Forms:** kontrollierte Komponenten (ContactSection, ProjectWizard) → `/api/contact` (Supabase `contact_submissions`, Honeypot, Rate-Limit)
- **Wizard-Datenschicht:** `lib/wizard.ts` (Kategorien, Hauptschritte, Budget-Bänder aus preislogik.yaml, optionale Unterwizards Ebene 1/2) + `lib/leadScoring.ts` (serverseitige Score-Berechnung, siehe unten)
- **Database:** Supabase (auch Portal unter `app/portal` — eigener Track, nicht anfassen). Das alte, selbstgebaute "Agent OS"-Dashboard (`app/os`, `lib/os`) wurde am 2026-08-31 entfernt, überholt durch das neue hm-agent-os-Projekt (eigenes Repo, dockt auf Paperclip-Fork). Die Subdomain `os.hm-labs.de` bleibt für dieses neue Projekt reserviert (Phase 7), wird künftig aber direkt per DNS/Reverse-Proxy dorthin gezeigt, nicht mehr über diese Next.js-App. Das Supabase-Schema `agent_os` (Tabellen `pipeline_runs`/`pipeline_steps`/`pipeline_approvals`) besteht als Daten weiter, wird aber von keinem Code hier mehr gelesen.
- **Package manager:** npm
- **i18n:** Client-State DE/EN via `lib/translations.ts` (`?lang=en` als hreflang-Alternate)
- **Consent/Tracking:** CookieBanner + TrackingScripts (GA4 etc., einwilligungsbasiert) via `lib/consent.tsx`
- **Env:** `.env.local` nötig (Supabase) — im Worktree aus dem Hauptordner kopieren, sonst crasht der Client (useAdminRole in error.tsx). **Keine Kommentare hinter einen Wert schreiben** (`FOO=bar # später: baz`): Next.js schneidet sie beim Lesen ab, Dockers `--env-file` nicht — im Container landet der Kommentar dann im Wert. Das traf bis 2026-09-07 `NEXT_PUBLIC_PORTAL_URL` und `NEXT_PUBLIC_OS_URL` und machte die Portal-Links in Automations-Mails kaputt. Kommentar gehört auf eine eigene Zeile darüber.

---

## Design rules — NEVER violate these

> **Das Original-Design ist verbindlich (Owner-Entscheidung 2026-07-07).**
> Das CI-System „Leiterbahn" (docs/spec/hm-ci-leiterbahn.md) wurde gebaut, im Review verworfen
> und ist auf GitHub archiviert (Branch-History, PR #2 geschlossen). NICHT wieder einführen,
> solange Henry es nicht ausdrücklich verlangt.

### Typography
- **Display font:** Space Grotesk (400–800)
- **Body font:** Inter (300–600)
- **Mono font:** JetBrains Mono (400, 500)
- Laden per Google-Fonts-Import in `app/globals.css` (Bestand; Umstellung auf self-hosted wäre eine separate, kleine Verbesserung — nur nach Absprache)

### Colors (`tailwind.config.ts`)
- **Background:** `#09090F` (bg) · Surface `#111118` · Border `#1E1E2E`
- **Primary:** `#4F7FFF` (Blau) · primary-dark `#2A5CE8`
- **Accent:** `#FF4D6A` (Pink/Rot)
- **Text:** `#EEEEFF` primary · `#5A5A7A` muted · `#8888AA` dim
- Diese drei Text-Tokens laufen seit 2026-09-07 über CSS-Variablen
  (`--color-text-*` in `app/globals.css`), damit **das Portal** eigene, weiße
  Werte setzen kann. Für die Marketing-Seite ändert sich nichts, die Defaults
  sind exakt die Hexwerte oben. Portal-Werte nicht auf die Marketing-Seite
  ziehen und umgekehrt.

### Signature-Elemente
- ParticleNetwork-Canvas als Seitenhintergrund
- Typewriter-Hero (drei Zeilen, tippt sich)
- Gradient-Text („hero-gradient-text" mit Shimmer), Glow-Schatten, grid-bg, noise-overlay
- Sektions-Tags im Mono-Stil: `// Service Protocol`, `// Lab Projects` …
- Struktur: Single-Page (`app/page.tsx`) mit Sektionen + SectionNav + ProjectWizard-Modal

### Voice & Ton — BLEIBT VERBINDLICH (unabhängig vom Design)
- **Anrede:** Sie
- **Preise NUR als Spannen** aus `preislogik.yaml`, jede konkrete Spannen-Nennung mit wörtlichem Disclaimer („Das ist eine unverbindliche Orientierung …")
- **Verboten:** Festpreis-Versprechen, feste Lieferzusagen („in 14 Tagen live" — nur „Richtwert"), Garantien, unbelegte Metriken (+32 %, +667 % …), **erfundene Referenzen/Testimonials/Case-Studies**
- Zeitangaben immer als Richtwert kennzeichnen
- TestimonialsSection bleibt deaktiviert, bis echte, schriftlich freigegebene Kundenstimmen existieren
- Portfolio zeigt ehrliche Eigenprojekte („Aus dem eigenen Labor") bis echte Case-Studies existieren
- **Keine Gedankenstriche („—") in sichtbaren Website-Texten** (Owner-Feedback 2026-07-08: wirkt „KI-generiert"). Sätze stattdessen umformulieren (Punkt, Komma, Doppelpunkt). Betrifft nur gerenderten Text (Titles, Meta-Descriptions, JSON-LD, UI-Strings) — Zahlen-Ranges mit „–" (En-Dash ohne Leerzeichen, z. B. „3.500–7.500 €") sind KEIN Gedankenstrich und bleiben unangetastet. Code-Kommentare sind nicht in Scope.
- **Ich-Perspektive, nicht dritte Person.** Henry spricht auf der eigenen Website nie über sich in der dritten Person außerhalb der About-Sektion (z. B. „das kläre ich persönlich", nicht „das klärt Henry persönlich"). Namensnennungen in Impressum/Datenschutz/Schema.org (rechtliche Identifikation, strukturierte Daten) sind KEINE Ausnahme-Verletzung — dort ist der Name Pflichtangabe, kein Fließtext-Ich-Verstoß.

---

## Approved sections and features

**Stand 2026-07-07 (Original-Design + erneuerter Content; Review Henry ausstehend):**

- [x] Startseite als SPA (Reihenfolge seit Session 6): Hero (Typewriter, „Ich integriere KI-Systeme in Unternehmen") · Services (3 Karten, neue Texte + Spannen — jetzt direkt nach Hero) · TrustBar · ReadinessCheck („Wie bereit ist Ihr Unternehmen für den Einsatz von KI?") · ScrollReveal · Lifecycle (6 Probleme) · Process · Portfolio („Aus dem eigenen Labor" — 3 echte Eigenprojekte) · CTA · About (ehrliche Stats) · TechStack · FAQ (YAML-Spannen + Disclaimer) · Contact · Footer · SectionNav · ProjectWizard
- [x] TestimonialsSection deaktiviert (erfundene Zitate entfernt)
- [x] Rechtsseiten: /impressum (auf § 5 DDG / § 18 MStV aktualisiert) · /datenschutz (Bestand, passt zum Consent-Setup)
- [x] llms.txt (ehrlich, YAML-Preise, Single-Page-Anker) · llms-full.txt (13 Leistungen) · robots.txt mit KI-Crawlern
- [x] Kontakt-API mit Honeypot + budget→metadata
- [x] JSON-LD: LocalBusiness/Person/WebSite/FAQPage — Festpreis/14-Tage-Claims entfernt
- [x] **/leistungen** (Unterseite im Original-Design): alle 13 Leistungen im Detail, 4 Gruppen A–D, Zeitrahmen/Preisspannen in Mono, Disclaimer je Kapitel, Wartungs-Tarifkarten, „Verbindliche Grundsätze", Wizard-CTA; Anker je Leistung (#landingpage …); Datenquelle `lib/leistungen.ts` (aus preislogik.yaml/Portfolio, bilingual, ?lang=en unterstützt)
- [x] Navbar gefixt: Logo → `/`, „Leistungen" → `/leistungen`, übrige Links als `/#anker` (funktionieren jetzt auch von Unterseiten), „Kontakt"-Link ergänzt
- [x] Preis-Klarstellung: neuer Baustein `ANGEBOT_HINWEIS` (lib/leistungen.ts) ergänzt den YAML-Disclaimer überall (DisclaimerBox je Kapitel, Start-FAQ, JSON-LD) — macht explizit, dass die Spanne nur vor dem Angebot gilt und das Angebot selbst einen für den Umfang festen Preis nennt. Grundsatz 1 in /leistungen entsprechend präzisiert.
- [x] Jede der 13 Leistungskacheln hat einen „Diese Leistung anfragen"-CTA → öffnet ProjectWizard mit vorausgewählter Leistung (Pin-Chip in der UI, Schritt „Was suchen Sie?" entfällt dann). Die Wahl fließt strukturiert als `wizard_answers.service` sowie lesbar im `subject` in die Anfrage (`/api/contact` → `contact_submissions.metadata`) — analog zu den normalen Wizard-Antworten.
- [x] **Lead-Qualifizierungs-Wizard v2 (Session 4):** kompletter Umbau von `components/ProjectWizard.tsx` auf einen dynamisch zusammengesetzten Schritt-Ablauf. Schritt 1 „Welche Themen interessieren Sie?" ist jetzt Mehrfachauswahl (Website/KI-Chatbot/Software-Webapp/Audit & Sonstiges) statt Einzelauswahl; neue Hauptschritte „Haben Sie schon eine Website?", Budgetrahmen (Bänder aus `preislogik.yaml` abgeleitet, an gewählte Kategorie/Service angepasst), Dringlichkeit, Entscheidungskompetenz; optionales Telefonfeld im Kontaktschritt. Danach optionaler, überspringbarer Unterwizard mit zwei Ebenen: Ebene 1 (`CATEGORY_SUBWIZARD` in `lib/wizard.ts`) pro grober Kategorie, Ebene 2 (`SERVICE_SUBWIZARD`) pro konkretem Service, wenn der Wizard über eine Leistungskachel geöffnet wurde (dann zusätzlich weiterhin die Option „sonst noch etwas relevant?" für weitere Kategorien). Kategorie „Audit & Sonstiges" hat eine Weichen-Frage mit dynamischer Folgefrage (`AUDIT_FOLLOWUPS`, z. B. B2C-Check für BFSG). Alle neuen Fragen bilingual (DE/EN), laienverständlich, ohne technische Begriffe.
- [x] **Lead-Score im Portal (Session 4):** `lib/leadScoring.ts` berechnet serverseitig (in `/api/contact`, nie clientseitig) aus den Wizard-Antworten einen Score 0–100 + Tier (kalt/warm/heiß) + Faktor-Breakdown, gespeichert in neuen Spalten `contact_submissions.lead_score`/`lead_tier` (Migration `add_lead_score_to_contact_submissions`) plus `metadata.score_breakdown`. `/portal/leads` (`LeadsClient.tsx`) zeigt Score-Badge, aufklappbare Faktor-Liste, Tier-Filter und Sortierung nach Score; Antwort-Anzeige nutzt zentral `ANSWER_LABELS`/`SUB_QUESTION_TEXT` aus `lib/wizard.ts` (mit Fallback für alte, flache Wizard-Antworten aus der Zeit vor diesem Umbau). Datenschutzerklärung (§2.2) um einen Satz zur internen, nicht-automatisierten Priorisierung ergänzt.

---

## Sourced components

| Component | Source | File path | Adapted colors |
|-----------|--------|-----------|----------------|
| — (alles Bestand/eigen) | — | — | — |

---

## Do not touch (locked)

- **Design-Richtung:** Original-Design bleibt — kein erneuter CI-Umbau ohne ausdrückliche Owner-Anweisung.
- Preis-Disclaimer wörtlich aus `preislogik.yaml`; Leistungen 09–12 ohne Spanne, bis YAML v1.1 kalibriert ist.
- `app/portal/*` bleibt eigener Track: nicht nebenbei anfassen, sondern nur auf
  ausdrücklichen Auftrag (so am 2026-09-06 für die Datei-Uploads und am
  2026-09-07 für das Bearbeiten der Dateien geschehen).
  `app/os/*` entfernt (2026-08-31, siehe Tech-Stack-Notiz oben).
- Keine erfundenen Referenzen, Testimonials oder Metriken — nie wieder einführen.

---

## Known issues / deferred work

- [ ] Impressum: Anschrift ist drin (§ 5 DDG ✓); Steuernummer nachtragen, sobald vergeben.
- [ ] Alte OG-/Twitter-Description in `app/layout.tsx` aktualisiert, aber OG-Bild ist weiter das Logo-PNG.
- [ ] `?lang=en`-Middleware-Redirect wurde mit dem Leiterbahn-Rückbau entfernt; EN läuft wieder rein clientseitig (Bestand).
- [ ] DSE nennt Vercel/GA4/Meta/LinkedIn — muss bei Deployment-/Tracking-Änderungen nachgezogen werden.
- [ ] `docs/spec/*` (Leiterbahn-CI, Masterplan) bleiben im Repo als Referenz; Leistungsportfolio + preislogik.yaml sind weiterhin die Content-Quellen.
- [ ] Chatbot-Widget: eigener Track (hm-chatbot-implementierungsplan) — bei Integration DSE-Absatz ergänzen.
- [ ] Preiskalibrierung Leistungen 09–12 → preislogik.yaml v1.1 (dann ggf. GAIO-/BFSG-Preise auf der Website nennen).
- [ ] **Geplant:** Henry richtet später auf dem VPS einen eigenen E-Mail-Server ein, damit Portal-Mails (Einladungen, Benachrichtigungen) über seine eigene Domain statt über den aktuellen Anbieter laufen. Betrifft `SMTP_*`/`EMAIL_FROM`-Variablen (aktuell in `.env.local` nicht gesetzt) und die Supabase-Auth-Mail-Konfiguration (`inviteUserByEmail` in `app/portal/clients/_actions.ts` und `app/portal/leads/_actions.ts`). Noch nicht umgesetzt, nur vorgemerkt.

**Offene Owner-Entscheidungen:** Foto /ueber-Inhalte (About nutzt vorhandenes Portrait ✓) · Steuernummer · Referenz-/Case-Study-Programm · Analytics-Setup langfristig (Umami vs. GA4).

---

## Current session task

Owner-Feedback von Testnutzern (Freunde): Besucher verstehen aus der alten Hero-Headline nicht, was Henry eigentlich macht. Headline umgeschrieben auf direkten „Ich integriere KI-Systeme in Unternehmen"-Satz (Benefit „Mehr Kunden, weniger Aufwand" bleibt als Gradient-Akzentzeile), Services-Sektion direkt hinter den Hero gezogen (vorher 5. Sektion), TrustBar dafür einen Schritt nach hinten, ReadinessCheck-Headline von vagem „Wie digital-ready ist Ihr Unternehmen?" auf konkretes „Wie bereit ist Ihr Unternehmen für den Einsatz von KI?" präzisiert. Visuell auf Desktop (1280px) und Mobile (375px) verifiziert: kein Overflow, kein Layout-Shift, keine Console-Errors; Reihenfolge zusätzlich per DOM-Text bestätigt. Lehre als „The Clarity Test" dauerhaft in `hm-design-identity` verankert (neue Regel: Hero-Headline muss ohne Zusatzkontext beantworten, was das Geschäft konkret macht, bevor Memorability optimiert wird), damit das bei künftigen Projekten nicht wieder passiert. **Nächster Schritt:** Henry prüft die neue Headline/Reihenfolge live, dann ggf. Feedback zur Sub-Zeile und zum Services-Card-Ranking (SVC_01 „Individuelle Websites" trägt noch das „Beliebt"-Badge und steht zuerst, obwohl der Fokus jetzt auf KI-Systemen liegt — bewusst nicht angetastet, da nicht Teil des heutigen Auftrags).

---

## Changelog

| Date | Change |
|------|--------|
| 2026-09-07 | **db-gate: Freigabepfad statt Sackgasse.** Beim Einspielen der Realtime-Migration fiel auf, dass der Gate-Hook (`~/Code/HM_Labs/.claude/hooks/db-gate.sh`) eine reine Allowlist mit zwei Ausgängen war: `apply_migration` landete im deny, auch nach ausdrücklicher Freigabe, also wanderte jede geprüfte Migration von Hand in den SQL-Editor. Der Hook kennt jetzt einen dritten Ausgang und legt vor, statt abzuweisen — für Migrationen, für Schreibvorgänge in den Portal-Fachdaten (`projects`, `tasks`, `project_milestones`, `contact_submissions`) und für Mailversand. Hart gesperrt bleibt, was Daten vernichtet oder Anwendungslogik überspringt; für dieses Repo heißt das konkret: **Schreiben auf `messages` und `clients` sowie das Setzen des Meilenstein-Status geht nicht per SQL**, weil die Benachrichtigung an den Kunden, die Einladung und `milestone.completed` in den Server Actions hängen und nicht in der Datenbank (geprüft: auf den Portal-Tabellen sitzen nur `updated_at`-Trigger, keine Database Webhooks). Solche Vorgänge gehören ins Portal-UI oder in eine API-Route wie die bestehende `POST /api/v1/clients`, die die Einladung mitschickt. Die vollständige Aufstellung steht in `~/Code/HM_Labs/CLAUDE.md` unter „Das eine Gate“ und wird hier bewusst nicht kopiert. |
| 2026-09-07 | **Portal — automatische Aktualisierung:** Das Portal aktualisiert sich jetzt von selbst, ereignisgesteuert statt getaktet. Neue Client-Komponente `app/portal/_components/RealtimeRefresh.tsx` hört per Supabase Realtime auf Änderungen an den Tabellen, die das Portal anzeigt, und holt daraufhin nur die Server-Daten nach (`router.refresh()`); React gleicht ab, ohne Flackern, Scroll-Sprung oder Verlust von lokalem State wie dem Chat-Entwurf. Eingehängt in `PortalShell`, gilt damit für jede Portal-Seite auf einmal, mit rollenabhängiger Tabellenliste (Kunden abonnieren `contact_submissions` und `clients` gar nicht erst; RLS filtert ohnehin, das spart nur unnötige Prüfungen). Drei Sparmaßnahmen: Änderungen kurz hintereinander lösen einen Refresh aus (400 ms Debounce), im Hintergrund-Tab wird nichts aktualisiert sondern beim Zurückkehren nachgeholt, und der 60-Sekunden-Takt greift ausschließlich als Sicherheitsnetz, solange Realtime nicht verbunden ist. Der Chat hatte sein eigenes Realtime-Abo bereits; das bleibt und kollidiert nicht (eigener Channel, eigener State). Die Ungelesen-Zählung als Endlosschleife war geprüft und ist keine: `markMessagesReadAction` filtert auf `is_read = false`, ein zweiter Durchlauf trifft null Zeilen und erzeugt kein WAL-Ereignis mehr. Migration `db/migrations/2026-09-07_portal_realtime.sql` **ist angewendet** (7 Tabellen in die Publication `supabase_realtime`, `replica identity full` auf projects/project_milestones/tasks/client_files); danach gegen `pg_publication_tables`/`pg_class` gegengeprüft: alle 9 Portal-Tabellen stehen in der Publication, die vier replica identities sitzen. Dabei fiel auf, dass `db-gate.sh` `apply_migration` als reine Allowlist hart sperrte und Migrationen deshalb von Hand im SQL-Editor landeten; der Hook hat jetzt einen Freigabepfad (siehe Eintrag unten). Build grün, TypeScript grün. **Im Browser verifiziert** (07.09.2026, lokal auf `clients.localhost:3001` mit einem Testkunden): ein `update projects set status` in Supabase ließ das Status-Badge im offenen Portal umspringen, ohne Reload und ohne Klick; dasselbe für einen Aufgaben-Status, was zusätzlich die zweite RLS-Variante abdeckt (Aufgaben filtern über `project_id`, Projekte über `client_id`). Anmerkung fürs nächste Mal: Port 3000 ist lokal vom Docker-Container `HM-Labs-public` belegt, der Dev-Server läuft deshalb auf 3001 (`.claude/launch.json` im HM_Labs-Ordner). |
| 2026-09-07 | **Portal — Lesbarkeit bei Sonnenlicht:** Owner-Meldung, dass die Portal-Schrift bei hellem Umgebungslicht oder gedrosselter Bildschirmhelligkeit kaum lesbar ist. Ursache waren die geerbten Grautöne der Marketing-Seite: `#5A5A7A` auf `#09090F` sind 3,0:1, also unter der WCAG-AA-Schwelle. Die drei Text-Tokens laufen jetzt über CSS-Variablen; `.portal-contrast` (in `app/portal/layout.tsx`, umschließt jede Portal-Route inkl. Login) hebt sie im Portal auf Weiß an: primary `#FFFFFF`, dim `#EEEEF8`, muted `#DCDCEC` — 14,7:1 bis 19,9:1, Unterschied nur noch im Weißton, Hierarchie über Größe. Symbole erben es über `currentColor`. Kleinste Schriftgrade im Portal von 9/10 px auf einheitlich 11 px angehoben (132 Stellen). Weiße Schrift auf gefülltem `bg-primary` war mit 3,6:1 ebenfalls zu schwach: die 25 betroffenen Buttons und die eigene Chat-Blase nutzen jetzt `bg-primary-dark` (5,5:1), Hover entsprechend `bg-primary-dark/90`. Abgeblendete Weißtöne im Chat (`opacity-60`, `text-white/60`) auf `opacity-90` bzw. `text-white/85` angehoben. Einzige bewusste Ausnahme von „immer weiß": Platzhalter in Eingabefeldern stehen auf 55 % Weiß (6,2:1), sonst sähe ein leeres Feld ausgefüllt aus. Marketing-Seite unverändert, im Browser gegengeprüft (`text-text-muted` rendert dort weiterhin `rgb(90, 90, 122)`). |
| 2026-09-07 | **Portal — Dateien bearbeiten:** Neue Route `PATCH /api/portal/files/[id]` für Umbenennen, Kategoriewechsel und (nur Admin) Verschieben der Zuordnung zwischen Kundenprofil, Projekt und Chat. Kunden dürfen genau ihre eigenen Uploads bearbeiten, dieselbe Schranke wie beim Löschen; die Zuordnung ändert nur HM Labs. Ein Anhang, der im Chat schon an einer Nachricht hängt, wird nicht herausgezogen: beim Verschieben entsteht am Ziel eine Kopie (`source_file_id`), damit der Verlauf vollständig bleibt. Umgekehrt kann nichts in den Chat hineingeschoben werden. Der Storage-Pfad bleibt beim Bearbeiten unangetastet, er ist ein Schlüssel, kein Name; deshalb trägt ein Download weiterhin den technischen Dateinamen. Neue Komponente `FileEditPanel` (klappt unter der Dateizeile auf), `FileList` um `canEdit`/`onUpdated`/`allowScopeChange`/`projects` erweitert, `FilesSection` sortiert bearbeitete Dateien zwischen den drei Reitern um, `ProjectFilesSection` bekommt die Projektliste des Kunden als Verschiebeziel. `DELETE` zusätzlich abgesichert: eine Datei im Kundenprofil löscht der Kunde nicht mehr, auch wenn sie ursprünglich von ihm kam. Migration `db/migrations/2026-09-07_client_files_update_policy.sql` (Update-Policy plus scope-Schranke in der Delete-Policy) **ist angewendet** (am 2026-09-07 gegen `pg_policies` gegengeprüft: `client_files_client_update` existiert, `client_files_client_delete` trägt die scope-Schranke). |
| 2026-09-06 | **Portal — Dateien für Kunden und Projekte:** Kunden können jetzt selbst hochladen, im Projekt (`app/portal/projects/[id]`) und im Chat, jeweils per Drag & Drop. `client_files` bekam `scope` (client/project/chat), `message_id`, `uploaded_by_role`, `source_file_id` (Migration `db/migrations/2026-09-06_client_project_chat_files.sql`, Projekt zoyvsobztyqdaqdffrbo) plus zwei RLS-Policies, die dem Kunden Insert in Projekt/Chat und Delete eigener Uploads erlauben. Uploads laufen über neue Route Handler `POST /api/portal/files` / `DELETE /api/portal/files/[id]` statt über Server Actions (1-MB-Body-Limit von Next 14 hätte jede größere Datei blockiert); Auth dort per Session, HM-API-Key oder Supabase-Token. Neue Komponenten `FileDropzone`, `FileList`, `ProjectFilesSection`; `FilesSection` im Kundenprofil zeigt jetzt drei Gruppen (Profil/Projekte/Chat) und kann eine Projekt- oder Chat-Datei dauerhaft ins Profil übernehmen (`promoteFileToClientProfileAction`, Storage-Copy plus neue Zeile). Chat-Eingabe wächst mit dem Text bis maximal 50 % der Chathöhe, Verlauf bleibt scrollbar. CSP um die Supabase-Storage-Domain in `img-src`/`media-src` erweitert, damit Bild- und Video-Anhänge rendern. |
| 2026-07-10 | **Session 5b — Typografie-Audit gegen Anti-Generic-Checkliste:** Hero-H1 (`components/HeroSection.tsx`) nutzte `uppercase` auf Zeile 1+2, Zeile 3 nicht — Verstoß gegen „All caps nur für Labels/Eyebrows, nie für Headlines" plus interne Inkonsistenz. `uppercase` entfernt, alle 3 Zeilen jetzt einheitlich normal gesetzt; visuell auf Desktop + 375px verifiziert (kein Layout-Shift, keine Overflow, keine Console-Errors). Restliche `uppercase`-Stellen im Code (Formular-Labels, `.tag`-Eyebrows, Mono-Badges) geprüft — alle regelkonform. Weitere Beobachtungen, nicht verändert (Owner-Entscheidung nötig): `hero-gradient-text` (Blau→Lila→Pink) enthält einen Lila-Ton, der der „Purple gradient"-Regel nahekommt, ist aber als Signature-Element bereits genehmigt/gelockt; Navigation nutzt `<a>` statt `next/link` für interne Links (`/leistungen`), gegen `hm-dev-standard`. |
| 2026-07-10 | **Session 5 — Claude Design Sync:** claude.ai/design Master (`HM Websites — Design System`) und projekteigenes Projekt (`HM Labs — Design System`) angelegt, geseeded mit Typografie-Skala, 8-Rollen-Farbsystem, Animation-Timing-Templates, den 5 ästhetischen Richtungen, der Anti-Generic-Checkliste sowie den echten Live-Tokens aus `tailwind.config.ts`. Neues Skill `hm-design-sync` dokumentiert den Ablauf für künftige Projekte (in `hm-prompting-workflow` verlinkt). Dabei Case-Kollision zwischen einer versehentlich neu angelegten `claude.md` und dieser (bereits bestehenden) `CLAUDE.md` auf dem case-insensitiven macOS-Dateisystem entdeckt und bereinigt (`git rm --cached claude.md`) — dieses Fundament bleibt die einzige Projekt-Memory-Datei. master (Leiterbahn-Verwerfen + Lead-Wizard v2, Commits cfdd197/c2a557e/48ac62a) nach hm-businessgroup gemerged, bevor die Design-Überarbeitung beginnt. |
| 2026-07-09 | **Session 4 — Lead-Qualifizierungs-Wizard + Lead-Score:** Auf Wunsch (bessere Lead-Einschätzung ohne Erstgespräch) komplettes Redesign des ProjectWizard-Konzepts, mit Henry abgestimmt (AskUserQuestion zu Service-Auswahl-Form, Budget-Frage, Telefonnummer, Score-Darstellung, danach optionale Unterwizard-Fragen final abgenommen). Neu: `lib/wizard.ts` (zentrale Wizard-Datenschicht: Kategorien, Hauptschritte, Budget-Bänder aus preislogik.yaml, `CATEGORY_SUBWIZARD`/`SERVICE_SUBWIZARD`/`AUDIT_FOLLOWUPS`), `lib/leadScoring.ts` (Scoring-Funktion), Migration `add_lead_score_to_contact_submissions` (Spalten `lead_score`/`lead_tier` auf `contact_submissions`, Projekt `zoyvsobztyqdaqdffrbo`). `components/ProjectWizard.tsx` komplett umgebaut auf dynamische Screen-Sequenz (categories/main/subIntro/sub/contact/success). `app/api/contact/route.ts` berechnet Score serverseitig, speichert `phone` (Spalte existierte bereits). `app/portal/leads/_components/LeadsClient.tsx` zeigt Score-Badge/Breakdown/Tier-Filter/Sortierung. `app/datenschutz/page.tsx` §2.2 um Lead-Scoring-Satz ergänzt. Build grün (41 Seiten). Verifikation: direkter `/api/contact`-Testrequest → Score 94/heiß korrekt berechnet und in DB gelandet (danach gelöscht), Tile-CTA-Pfad (Ebene-2-Unterwizard, additive „weitere Themen"-Frage) und EN-Übersetzung visuell bestätigt. Learnings: AnimatePresence-Übergänge frieren ein, wenn der Preview-Tab `document.hidden=true` ist (rAF-Throttling) — betrifft nur automatisiertes Testen in unfokussierten Headless-Tabs, nicht echte Nutzer; State-Machine-Korrektheit deshalb über ein temporäres `window.__wizardDebug` statt über Screenshots verifiziert. Portal-Login war in der Session nicht möglich (keine Zugangsdaten) — visuelle Portal-Prüfung steht noch aus. |
| 2026-07-07 | CLAUDE.md angelegt (hm-project-memory), gefüllt mit Leiterbahn-CI v1.0. Ist-Analyse: alter Code weicht vollständig vom Ziel-CI ab. Umsetzungsplan erarbeitet. |
| 2026-07-08 | **Session 3d — Voice-Cleanup:** Alle Gedankenstriche („—") aus sichtbarem Website-Text entfernt (Sätze umformuliert, DE+EN) in `lib/translations.ts`, `lib/leistungen.ts`, `components/LeistungenDetail.tsx`, `components/ProjectWizard.tsx` (Kommentare), `app/layout.tsx` (Titles/Meta/JSON-LD), `app/error.tsx`, `app/leistungen/page.tsx`, `app/impressum/page.tsx`, `app/datenschutz/page.tsx`; `docs/spec/preislogik.yaml`-Disclaimer zur Konsistenz mitgezogen. Zahlen-Ranges („3.500–7.500 €") bewusst unangetastet (kein Gedankenstrich). Dritte-Person-Referenzen auf Henry außerhalb der About-Sektion auf Ich-Perspektive umgestellt (z. B. „das kläre ich persönlich" statt „das klärt Henry persönlich") — betraf Preis-Disclaimer/FAQ/Leistungs-Anfrage-Text an mehreren Stellen. Neue Voice-Regeln in „Design rules" verankert. Build grün (41 Seiten), Preview DE+EN verifiziert (keine Gedankenstriche, keine Drittperson-Henry-Reste außerhalb Impressum/Schema.org). |
| 2026-07-07 | Session 2 — Leiterbahn v1.0 komplett gebaut (Tokens, Fonts self-hosted, Motion-Bibliothek, Multi-Route-SSG, 6 Kernseiten DE/EN, Rechtsseiten, GAIO-Artefakte). Build grün, 52 Seiten. Commit c2a557e, PR #2. |
| 2026-07-08 | **Session 3c — Preis-Klarstellung + Kachel-CTA:** `ANGEBOT_HINWEIS` ergänzt Disclaimer überall (Spanne gilt nur vor dem Angebot, danach fester Preis für den Umfang); Grundsatz 1 präzisiert. Jede Leistungskachel hat jetzt einen "Anfragen"-CTA → `ProjectWizard` bekommt optionale `initialService`-Prop, überspringt dann Schritt "Was suchen Sie?", zeigt Pin-Chip mit der gewählten Leistung, sendet sie strukturiert (`wizard_answers.service`) und lesbar (`subject`) mit. Debugging: `npm run build` parallel zum laufenden Dev-Server korrumpiert `.next` (`__webpack_modules__ is not a function`) — künftig Dev-Server vor jedem Build stoppen, danach `.next` löschen und neu starten. Build grün (41 Seiten). |
| 2026-07-07 | **Session 3b — /leistungen + Navbar:** Detailseite für alle 13 Leistungen im Original-Design (`components/LeistungenDetail.tsx`, Daten aus `lib/leistungen.ts` — aus Git-History c2a557e wiederhergestellt, YAML-konform). Navbar-Anker auf `/#…` umgestellt (funktionieren von Unterseiten), Logo → `/`, Leistungen → `/leistungen`, Kontakt-Link neu. Sitemap + llms.txt ergänzt. Debugging: verwaister next-dev-Prozess im Worktree lieferte korruptes CSS (rm -rf .next bei laufendem Server) — Prozess gekillt, sauber neu gestartet. Build grün (41 Seiten). |
| 2026-07-07 | **Session 3 — Owner-Entscheidung: Leiterbahn verworfen.** PR #2 geschlossen (Branch/History archiviert). Original-Design aus master restauriert (SPA, dark-tech, framer-motion, ParticleNetwork). Erneuerten Content eingepflegt: Hero/Services/About ohne Festpreis/14-Tage/Fake-Metriken; FAQ + JSON-LD mit YAML-Spannen + wörtlichem Disclaimer; erfundene Referenzen → ehrliche Lab-Projekte; Testimonials deaktiviert; Impressum auf DDG/MStV; llms.txt ehrlich mit Single-Page-Ankern. Leiterbahn-Dateien entfernt (in Git-History erhalten). Build grün (40 Seiten), Preview verifiziert. Learnings: Worktree braucht .env.local-Kopie (Supabase-Client crasht sonst via error.tsx→useAdminRole). |
