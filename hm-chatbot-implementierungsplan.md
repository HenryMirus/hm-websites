# HM Websites — KI-Chatbot: Kompletter Implementierungsplan

**Version:** 1.0 · Stand: 06.07.2026
**Ziel-Infrastruktur Launch:** Hostinger KVM2 (8 GB RAM, 2 vCPU) — geteilt mit Website, Portal, Agent OS
**Upgrade-Ziel:** Hostinger KVM8 (32 GB, 8 vCPU) sobald Kundenbasis vorhanden

---

## 0. Grundsatzentscheidungen (festgezurrt)

| Entscheidung | Wahl | Begründung |
|---|---|---|
| Hosting | Self-hosted auf eigenem EU-VPS | Kein AVV mit KI-Anbieter nötig, minimaler rechtlicher Fußabdruck |
| Launch-Architektur | **Stufe 1 + 3: Retrieval-only** (kuratierte Antworten + Fallback→Lead) | Passt in KVM2, Antwortzeit <1 s, Halluzination strukturell unmöglich |
| Generative Stufe 2 | Erst mit KVM8 (Ollama, 7B–13B) | 2 vCPUs liefern keine akzeptable Inferenz-Geschwindigkeit |
| Vektorspeicher | **pgvector** auf dem bestehenden PostgreSQL | Kein zusätzlicher Container (ChromaDB entfällt), Portal-DB läuft ohnehin |
| Embedding-Modell | **multilingual-e5-small** (ONNX, via fastembed) | Deutsch-Qualität deutlich besser als nomic-embed-text (englisch-fokussiert); ~120 MB, läuft ohne Ollama direkt im Backend |
| Backend | Node.js/TypeScript (Hono oder Next.js API-Route) | Bleibt im HM-Stack, kein Python-Zweig nötig |
| Session-Speicher | Redis mit TTL (30 min Inaktivität) | "Keine Anfrage → keine Speicherung" technisch sauber |
| Lead-Persistenz | Bestehende Portal-DB (PostgreSQL) | Chatverlauf + Kontaktdaten landen im Portal, nicht in einem Extra-System |

**Wichtige Klarstellung zum Begriff "Training":** Es findet **kein Fine-Tuning** statt — das wäre bei diesem Use Case teuer, unnötig und würde das Halluzinationsrisiko sogar erhöhen. "Trainieren" bedeutet hier: (a) die kuratierte Wissensbasis aufbauen, (b) sie in Embeddings überführen, (c) sie über die Lernschleife (Phase 7) kontinuierlich mit echten Besucherfragen erweitern. Das Modell selbst bleibt unverändert; das Wissen lebt vollständig in der Wissensbasis. Vorteil: Jede Antwort ist von dir autorisiert, jederzeit änderbar, und ein Modell-Update zerstört nichts.

---

## Architektur (Launch-Stack, KVM2)

```
Website-Besucher
      ↓
Chat-Widget (Frontend, auf der HM-Website eingebunden)
      ↓
Nginx Reverse Proxy (Rate-Limiting, TLS)
      ↓
Chatbot-Backend (Node/TS)
      ├─ Embedding: multilingual-e5-small (ONNX, in-process)
      ├─ Matching: pgvector-Ähnlichkeitssuche gegen kuratierte Antworten
      ├─ Session: Redis (TTL 30 min, keine Persistenz)
      └─ Bei "Anfrage senden": Persistenz in Portal-DB (PostgreSQL)
```

RAM-Budget des gesamten Bot-Stacks: **< 1 GB** (Backend + ONNX-Modell ~400–600 MB, Redis-Anteil minimal, pgvector nutzt bestehende DB).

**Antwortlogik (2 Zweige im Launch, 3 nach Upgrade):**

```
Frage → Embedding → Top-3-Match gegen Wissensbasis
  ├─ Score ≥ 0.82  → kuratierte Antwort WÖRTLICH ausgeben        [Stufe 1]
  ├─ Score 0.70–0.82 → Rückfrage anbieten: "Meintest du …?"
  │                    (Top-3-Fragen als klickbare Chips)
  └─ Score < 0.70  → Fallback: "Das kann ich dir nicht verlässlich
                     beantworten — aber Henry kann das. Soll ich
                     deine Frage direkt weiterleiten?"             [Stufe 3]
                     + Frage wird anonymisiert geloggt (Lernschleife)
```

Die Schwellwerte 0.82 / 0.70 sind Startwerte und werden in Phase 5 gegen die 20-Fragen-Testsuite kalibriert.

---

## Phase 0 — Wissensbasis erstellen (das eigentliche "Training", Teil 1)

**Owner:** Henry (Inhalte) · **Dauer:** 1–2 Arbeitssessions · **Blocker für:** alles Weitere

### Dateistruktur

```
/knowledge-base
├── leistungen.md       # Alle Service-Beschreibungen, präzise formuliert
├── preisrahmen.md      # Preisspannen pro Leistungstyp + Pflicht-Disclaimer
├── prozess.md          # Projektablauf: Phasen, Dauer, was der Kunde beisteuert
├── faq.md              # Kuratierte Frage-Antwort-Paare (Kern von Stufe 1)
├── unternehmen.md      # Über HM Websites, Arbeitsweise, Referenzen
└── _meta.md            # Ton, Duz/Siez-Regel, verbotene Aussagen, Disclaimer-Texte
```

Jede kuratierte Antwort wird als YAML-Block in `faq.md` gepflegt — eine Frage, mehrere Formulierungsvarianten (verbessern das Matching), eine autorisierte Antwort:

```yaml
- id: preis-website
  fragen:
    - "Was kostet eine Website bei euch?"
    - "Wie teuer ist eine Homepage?"
    - "Was muss ich für eine Website einplanen?"
    - "Preise?"
  antwort: |
    [Deine wörtliche, autorisierte Antwort inkl. Preisspanne + Disclaimer]
  kategorie: preise
  cta: anfrage_senden   # optional: welcher Conversion-Baustein angehängt wird
```

### Kuratierte Fragen — Struktur (Ziel: 30–40 Antworten zum Launch)

**Kategorie A — Leistungen (8–10 Antworten)**
1. Was macht HM Websites genau? / Welche Leistungen bietet ihr an?
2. Was unterscheidet euch von anderen Webagenturen / Baukasten-Anbietern (Wix, Jimdo)?
3. Macht ihr auch Online-Shops?
4. Was ist ein KI-Chatbot für meine Website und brauche ich sowas?
5. Was sind Webapps / individuelle Softwarelösungen — was wäre ein Beispiel?
6. Was bedeutet SEO-Optimierung bei euch konkret?
7. Was ist GAIO / Warum ist es wichtig, dass KI-Systeme meine Website finden?
8. Übernehmt ihr auch die Pflege/Wartung nach dem Launch?
9. Könnt ihr meine bestehende Website überarbeiten (Relaunch)?
10. Macht ihr auch Logo/Branding/Texte?

**Kategorie B — Preise (5–7 Antworten) — jede mit Pflicht-Disclaimer**
11. Was kostet eine Website? (allgemein → Spannen nach Projekttyp)
12. Was kostet ein Website-Relaunch?
13. Was kostet ein KI-Chatbot als Zusatz?
14. Was kostet eine Webapp / individuelle Software?
15. Gibt es laufende Kosten (Hosting, Wartung)?
16. Kann man in Raten zahlen? / Wie läuft die Bezahlung ab?

**Kategorie C — Prozess & Zeit (6–8 Antworten)**
17. Wie läuft ein Projekt bei euch ab? (Briefing → Design → Dev → QA → Launch)
18. Wie lange dauert eine Website?
19. Was brauche ich, bevor wir starten können? (Texte, Bilder, Logo?)
20. Wie viele Korrekturschleifen sind drin?
21. Wem gehört die Website am Ende? (Code, Domain, Zugänge)
22. Was passiert, wenn mir das Design nicht gefällt?
23. Kann ich die Website später selbst pflegen?

**Kategorie D — Technik & Vertrauen (6–8 Antworten)**
24. Welche Technologien nutzt ihr? (Next.js, individuelle Entwicklung statt Baukasten)
25. Ist die Website DSGVO-konform?
26. Wird die Website auch auf dem Handy gut aussehen?
27. Wie schnell wird meine Website sein? (Lighthouse 90+)
28. Wo wird gehostet? (EU, Hostinger)
29. Habt ihr Referenzen / Beispiele?
30. Wer steckt hinter HM Websites?

**Kategorie E — Chatbot-Meta & Einstieg (4–5 Antworten)**
31. Bist du ein Mensch? → ehrliche KI-Antwort (AI-Act-Pflicht)
32. Was kannst du beantworten? / Wobei kannst du helfen?
33. Wie erreiche ich Henry direkt? (E-Mail, Anfrage-Flow)
34. Werden meine Chat-Eingaben gespeichert? → wörtliche Antwort aus Consent-Logik
35. Hallo / Hi / Guten Tag → Begrüßung mit 3 Einstiegs-Chips ("Leistungen", "Preise", "Projekt anfragen")

### Regeln für `preisrahmen.md` (Haftungsschutz)

- Preise **immer als Spanne**, nie als Festpreis
- Pflicht-Satz bei **jeder** Preisnennung: *"Das ist eine unverbindliche Orientierung basierend auf vergleichbaren Projekten — kein Angebot. Ein konkretes, verbindliches Angebot erstellt Henry erst nach einem persönlichen Gespräch, in dem die genauen Anforderungen geklärt werden."*
- Verboten in der Wissensbasis: Festpreise ohne Spanne, Garantien/Zusicherungen, feste Lieferzeit-Zusagen (nur Richtwerte)

**Akzeptanzkriterium Phase 0:** 30+ Antworten geschrieben, jede Preisantwort enthält den Disclaimer, `_meta.md` definiert Ton (Duzen, HM-Brand-Voice) und verbotene Aussagen.

---

## Phase 1 — RAG-Pipeline & Backend

**Owner:** Claude Code · **Dauer:** 1–2 Tage · **Repo:** `hm-chatbot-2026` (privat, Namenskonvention)

### 1.1 Datenbank (pgvector auf bestehendem PostgreSQL)

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chatbot_knowledge (
  id            TEXT PRIMARY KEY,          -- z.B. 'preis-website'
  frage         TEXT NOT NULL,             -- eine Formulierungsvariante
  antwort       TEXT NOT NULL,             -- autorisierte Antwort (bei Varianten identisch)
  kategorie     TEXT NOT NULL,
  cta           TEXT,
  embedding     vector(384),               -- multilingual-e5-small = 384 Dimensionen
  aktiv         BOOLEAN DEFAULT true,
  aktualisiert  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON chatbot_knowledge USING hnsw (embedding vector_cosine_ops);

CREATE TABLE chatbot_unmatched (           -- Lernschleife (Phase 7)
  id         BIGSERIAL PRIMARY KEY,
  frage      TEXT NOT NULL,                -- anonymisiert, keine Session-Zuordnung
  best_score REAL,
  erstellt   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE chatbot_leads (               -- nur bei "Anfrage senden"
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  telefon       TEXT,
  chat_verlauf  JSONB NOT NULL,
  consent       BOOLEAN NOT NULL DEFAULT true,
  hinweis       TEXT DEFAULT 'Speicherung solange aktive Geschäftsbeziehung',
  erstellt      TIMESTAMPTZ DEFAULT now()
);
```

### 1.2 Ingest-Pipeline ("Training", Teil 2)

Skript `npm run ingest`:
1. Liest alle `/knowledge-base/*.md`-Dateien
2. `faq.md`: parst YAML-Blöcke → **jede Formulierungsvariante wird eine eigene Zeile** mit identischer Antwort (mehr Matching-Oberfläche)
3. Übrige Dateien (`leistungen.md` etc.): semantisches Chunking nach Markdown-Überschriften — **nicht** nach Zeichenzahl. Diese Chunks dienen im Launch als Rückfrage-Kandidaten und werden ab Stufe 2 der generative Kontext.
4. Embeddings via fastembed (`multilingual-e5-small`, Prefix-Konvention `query:` / `passage:` beachten — e5-Modelle brauchen das für gute Scores)
5. Upsert in `chatbot_knowledge` (idempotent — erneuter Lauf aktualisiert nur Geändertes)

Jede Wissensbasis-Änderung = Markdown editieren → `npm run ingest` → live. Kein Deployment nötig.

### 1.3 API-Endpunkte

| Endpunkt | Funktion |
|---|---|
| `POST /api/chat` | Frage → Embedding → pgvector-Suche → Antwortlogik (Schwellwerte s.o.) → Antwort + ggf. Chips/CTA. Session-Verlauf nur in Redis (TTL 30 min). |
| `POST /api/inquiry` | Kontaktdaten + Session-ID → Chatverlauf aus Redis lesen → in `chatbot_leads` persistieren → E-Mail-Notification an Henry → Redis-Session löschen |
| `GET /api/health` | Uptime-Check |

**Speicherlogik (kritisch, wird in Phase 5 explizit getestet):**
- Während des Chats: Nachrichten **nur** in Redis, TTL 30 min ab letzter Aktivität
- Kein Inquiry → Session verfällt, es existiert nie ein DB-Eintrag
- Inquiry → erst jetzt Persistenz, mit Consent-Flag und Zeitstempel
- `chatbot_unmatched` speichert **nur den Fragetext**, keine Session-ID, keine IP — dadurch anonym und unproblematisch

### 1.4 Nginx & Sicherheit

- Rate-Limiting: 10 req/min pro IP auf `/api/chat`, 3 req/min auf `/api/inquiry`
- Max. Eingabelänge 500 Zeichen (serverseitig erzwungen)
- CORS nur für die eigene Domain
- Backend nur im internen Docker-Netz, ausschließlich Nginx öffentlich (Muster aus dem Blueprint)

**Akzeptanzkriterium Phase 1:** Ingest läuft idempotent durch; `POST /api/chat` liefert bei einer Testfrage aus der FAQ die wörtliche Antwort in < 1 s auf der KVM2.

---

## Phase 2 — Chat-Widget (Frontend)

**Owner:** Claude Code · **Dauer:** 1–2 Tage · Standards: `hm-dev-standard`, `hm-design-identity`

### Verhalten
- Icon erscheint nach **12 s Verweildauer oder 40 % Scrolltiefe** — kein Popup beim Laden, dezente Pulse-Animation (CSS reicht, kein GSAP nötig — Entscheidungsregel aus dem Dev-Standard)
- Erster Klick → **Consent-Banner** (Template Phase 4) → erst nach "Verstanden" ist Eingabe möglich
- Chat-Header permanent: `🤖 KI-Assistent — Sie chatten mit einer KI, keinem Menschen`
- Begrüßung mit 3 Einstiegs-Chips: *Leistungen* · *Preise* · *Projekt anfragen*
- Rückfrage-Zweig (Score 0.70–0.82): Top-3-Fragen als klickbare Chips
- Fallback-Zweig: Weiterleiten-Button → Inline-Anfrageformular (Name, E-Mail, optional Telefon) direkt im Chat, kein Seitenwechsel
- Nach jeder Preis-Antwort: dezenter CTA-Button *"Unverbindliches Gespräch anfragen"*

### Technik
- Eigenständiges, leichtgewichtiges Widget (Vanilla TS oder Preact, < 30 kB gzipped), als ein `<script>`-Tag einbindbar — dadurch später 1:1 als Produkt für Kundenprojekte wiederverwendbar
- CI gemäß Brand-Grundlage: Bricolage Grotesque/Switzer, Ink/Paper-Neutrals, Cobalt-Akzent
- Accessibility: Fokus-Management, ARIA-Labels, ESC schließt, vollständig tastaturbedienbar

**Akzeptanzkriterium Phase 2:** Widget läuft auf der Website, Consent-Flow greift vor der ersten Antwort, mobile Darstellung ab 375 px sauber.

---

## Phase 3 — Conversion-Flow & Lead-Handling

- **Inquiry-Formular im Chat:** minimal (Name, E-Mail, Telefon optional). Beim Absenden wird der Chatverlauf automatisch angehängt → vorqualifizierter Lead statt leerem Kontaktformular.
- **Lead-Ziel:** `chatbot_leads` in der Portal-DB + sofortige E-Mail an Henry. Später (Agent OS Phase 2+): automatisches Ticket via `hm-projektstatus-protokoll` (Status OFFEN, HM-Nummer) — im Launch bewusst noch nicht, um keine Abhängigkeit zum Agent-OS-Zeitplan zu schaffen.
- **CTA-Strategie:** Jede Antwort der Kategorien Preise/Leistungen endet mit einem kontextuellen, nicht drängenden CTA. Der Bot fragt **nie** von sich aus nach Kontaktdaten — Kontaktdaten gibt der Besucher nur aktiv über das Formular (Blueprint-Regel, senkt Absprung und hält den Consent-Text ehrlich).

---

## Phase 4 — Rechtliche Bausteine (alle drei, mehr nicht)

1. **Consent-Banner** vor dem ersten Chat — Template aus dem Blueprint übernehmen (Kernaussage: KI auf eigenem Server, keine Übermittlung an Dritte, keine Speicherung außer bei Anfrage).
2. **KI-Kennzeichnung** permanent im Widget-Header — **Pflicht ab 02.08.2026 (EU AI Act Art. 50)**, Launch also von Tag eins damit.
3. **Datenschutzerklärungs-Absatz** — Template aus dem Blueprint, konkretisiert mit: Hosting EU (Hostinger), Rechtsgrundlagen Art. 6 Abs. 1 lit. a (Chat) / lit. b (Anfrage), Speicherdauer-Zahl von Henry festlegen (Empfehlung: 24 Monate nach letztem Kontakt).

Nicht nötig bei diesem Setup: AVV mit KI-Anbieter (keiner beteiligt), DSFA (kein Hochrisiko-System), Cookie-Consent-Erweiterung (Widget setzt keine Tracking-Cookies; Session-ID als technisch notwendiges sessionStorage-Item).

---

## Phase 5 — Test & Qualitätsgate ("Training", Teil 3: Kalibrierung)

**Testsuite (vor Launch, Go/No-Go-Gate):**

1. **20+ echte Testfragen** in natürlichem Deutsch, bewusst umgangssprachlich formuliert ("was kostet der spaß", "macht ihr auch shops", "wie lang dauerts") → Erwartung: richtige kuratierte Antwort oder sauberer Rückfrage-/Fallback-Zweig. **Keine einzige falsche Zuordnung bei Preisfragen erlaubt.**
2. **10 Off-Topic-Fragen** ("Wie wird das Wetter?", "Schreib mir ein Gedicht") → Erwartung: immer Fallback, nie eine erfundene Antwort
3. **Schwellwert-Kalibrierung:** Falls Testfragen falsch matchen → Schwellwerte justieren und/oder Formulierungsvarianten in `faq.md` ergänzen → `npm run ingest` → erneut testen
4. **Speicherlogik-Beweis:** Chat ohne Anfrage → `chatbot_leads` leer (DB-Query als Nachweis); Chat mit Anfrage → korrekter Eintrag mit Verlauf + Zeitstempel
5. **Last-Sanity-Check auf der KVM2:** 5 parallele Chat-Sessions während Portal + Agent OS laufen → Antwortzeit bleibt < 2 s

**Go-Kriterium:** 100 % der Preisfragen korrekt, ≥ 90 % der übrigen Testfragen korrekt oder sauber im Rückfrage-Zweig, 0 erfundene Antworten (strukturell garantiert), Speicherlogik nachgewiesen.

---

## Phase 6 — Deployment (KVM2)

Nach `hm-deployment`, Pfad C (VPS + Docker):

1. Claude Code: Dockerfile + Service-Eintrag in die bestehende `docker-compose.yml` des VPS (Backend im internen Netz, Redis-Service falls nicht vorhanden), `.dockerignore`, lokaler Build-Test
2. Git → GitHub (privates Repo `hm-chatbot-2026`) → auf VPS `git pull && docker compose up -d --build`
3. pgvector-Extension + Tabellen via Migration auf der Portal-DB
4. `npm run ingest` auf dem Server ausführen
5. Nginx-Location `/api/chat|inquiry` mit Rate-Limits ergänzen, TLS läuft über bestehendes Certbot-Setup
6. Widget-Snippet auf der Website einbinden
7. Post-Deployment-Checkliste aus `hm-deployment` + Launch-Checkliste aus dem Chatbot-Blueprint abarbeiten (insb.: Backend nicht direkt erreichbar, Consent vor erster Antwort, KI-Badge sichtbar)

---

## Phase 7 — Betrieb & Lernschleife ("Training", Teil 4: der Dauerbetrieb)

Das ist der Mechanismus, der den Bot über Zeit wirklich gut macht:

- **Wöchentliche Routine** (manuell; später Agent-OS-Routine, Kandidat: Content Agent): `chatbot_unmatched` sichten → häufige unbeantwortete Fragen identifizieren → neue kuratierte Antworten schreiben → `npm run ingest`
- **Faustregel:** Taucht eine Frage 3× auf, bekommt sie eine kuratierte Antwort
- **Monatlich:** Lead-Qualität prüfen — welche Chat-Verläufe wurden zu Anfragen? Welche CTAs funktionieren? Preisantworten ggf. nachschärfen
- **Erwartung:** Start mit ~80 % Abdeckung, nach 4–6 Wochen echter Besucherfragen → 90 %+. Jede Lücke ist bis dahin kein Fehler, sondern ein Lead (Stufe 3) plus ein Datenpunkt

---

## Phase 8 — Upgrade-Pfad: Stufe 2 (generativ, ab KVM8)

Ausgelöst durch: Umzug auf KVM8 **oder** Nachweis, dass > 20 % der Fragen im Fallback landen trotz gepflegter Wissensbasis.

1. Ollama-Container ins bestehende Compose (internes Netz, Blueprint-Muster), Modell: 7B–13B mit guter Deutsch-Qualität — Auswahl zum Upgrade-Zeitpunkt neu evaluieren, Kandidaten dann benchmarken statt jetzt festlegen
2. Antwortlogik um den mittleren Zweig erweitern: Score 0.55–0.82 → generative Antwort, strikt gebunden an die Top-Chunks aus `leistungen.md`/`prozess.md`/`unternehmen.md`, System-Prompt aus dem Blueprint ("Antworte NUR aus der Wissensbasis", Preisregel, KI-Ehrlichkeit)
3. **Preisfragen bleiben dauerhaft Stufe 1** — generative Preisauskünfte sind auch mit RAG tabu (Haftung)
4. Qualitätsgate wie Phase 5, zusätzlich: 20 Paraphrasier-Tests (generative Antwort darf inhaltlich nicht von der Wissensbasis abweichen)
5. Wissensbasis, Widget, Consent-Texte, Speicherlogik: **unverändert** — es kommt nur ein Container und ein Logik-Zweig dazu

---

## Zeitplan-Übersicht

| Phase | Inhalt | Aufwand | Abhängigkeit |
|---|---|---|---|
| 0 | Wissensbasis (30–40 Antworten) | 1–2 Sessions (Henry) | — |
| 1 | Backend + RAG-Pipeline | 1–2 Tage (Claude Code) | Phase 0 |
| 2 | Chat-Widget | 1–2 Tage (Claude Code) | parallel zu 1 möglich |
| 3 | Conversion-Flow | 0,5 Tag | 1 + 2 |
| 4 | Rechtstexte einbauen | 0,5 Tag | 2 |
| 5 | Test & Kalibrierung | 0,5–1 Tag | 1–4 |
| 6 | Deployment KVM2 | 0,5 Tag | 5 (Go) |
| 7 | Lernschleife | laufend | Launch |
| 8 | Stufe 2 generativ | später | KVM8 |

**Realistischer Gesamtaufwand bis Launch: ~1 Woche**, davon der größte Henry-Anteil in Phase 0 — die Wissensbasis ist der einzige Teil, den niemand außer dir schreiben kann, und gleichzeitig der Teil, der über die Qualität des gesamten Bots entscheidet.