# HM Labs — Todo

## 1. KI-Chatbot
- Was ist möglich / Konzept ausarbeiten

## 2. Tracking-IDs eintragen & Scripts testen
Sobald die Accounts erstellt sind, IDs in `.env.local` eintragen:

- **Google Analytics 4** → analytics.google.com → Property erstellen → Measurement ID (`G-XXXXXXX`) → `NEXT_PUBLIC_GA4_ID=`
  Danach: Admin → Datenverarbeitungsbedingungen → AV-Vertrag akzeptieren (2 Min, 1 Klick)
- **Meta Pixel** → business.facebook.com → Events Manager → Pixel erstellen → `NEXT_PUBLIC_META_PIXEL_ID=`
- **Google Ads** → ads.google.com → Conversion-Tracking → Tag-ID (`AW-XXXXXXX`) → `NEXT_PUBLIC_GOOGLE_ADS_ID=`
- **LinkedIn** → linkedin.com/campaignmanager → Account Assets → Insight Tag → `NEXT_PUBLIC_LINKEDIN_PARTNER_ID=`

Nach dem Eintragen testen: DevTools → Network → auf Requests zu `google-analytics.com`, `facebook.net`, `snap.licdn.com` prüfen.


## 3. Portal CRM — Offene Punkte

- [ ] **E-Mail-Benachrichtigungen auf Resend umstellen**
  - Account auf resend.com anlegen (kostenlos bis 3.000 E-Mails/Monat)
  - API Key generieren → als `RESEND_API_KEY` in `.env.local` eintragen
  - Domain verifizieren: `portal@hm-labs.de` als Absender (DNS TXT-Eintrag beim Hoster)
  - `lib/email/notify.ts` implementieren mit Resend SDK (`npm install resend`)
  - Aktuell: Nur Console-Logs als Platzhalter
- [ ] **Workflows und Hooks (Admin-Only)**
  - Sobald ein Meilenstein erreicht ist, soll der Kunde per email und chat-nachricht automatisch benachrichtigt werden.
  - Sobald eine Nachricht gesendet wurde soll die andere Person/Unternehmen eine Email-Benachrichtigung erhalten.
  - 1 Monat nach Fertigstellung eines Projekts soll die Feedback-Email an den Kunden gesendet werden.
  - jeweils am Jahrestag des starts des ersten Projekts eines Kunden soll die jährliche Email gesendet werden.
  - Projektstart Workflow
    - Ein KI Agent soll den Chat und von mir bereitgestelltem Email-Verlauf und Videocall-Aufzeichnung mit dem Kunden analysieren, die notwendigen Kundenspezifischen Dateien und projektbezogenen Aufgaben, Meilensteine, Notizen etc. anlegen.
    - KI Agenten sollen sich bei start eines neuen Projekts erst die Informationen aus dem Portal bzw. der Datenbank ziehen.
    - Es sollen Recherchen von KI Agenten angestellt werden, die Konkurrenz-Produkte/-Websites ausfindig machen und dort informationen jeglicher art sammeln. Außerdem sollen genauere Informationen zu der Niche des Kunden in Erfahrung gebracht werden, um den Kunden besser zu verstehen und vertreten zu können.
    - KI Agenten sollen intern eine Evaluierung des Aufwands gemäß des vereinbarten Budgets erarbeiten, in der bspw. steht wie aufwendig die Website gestaltet sein soll, oder wie umfänglich gewisse Software sein soll
    - Daraus soll ein Plan zur Umsetzung erstellt werden, der bereits existierende Templates integriert, um das Aufsetzen der Grundstruktur zu vereinfachen.
    - Danach folgt die Implementierung des ersten Prototypen, Testing und Verbesserungen durch mich
    - Ersten Protoypen mit Kunden besprechen (Zoom)
    - Weitere Iterationen bis zur Abnahme oder Ausschöpfung des Budgets
    - Fertigstellung des Projekts
    - Nachbearbeitung, Lessons-Learned, neue Skills, neue Templates usw. von KI Agenten anlegen lassen, damit weitere Projekte noch einfacher und schneller bearbeitet werden können
  - Ein KI Agent soll die Möglichkeit haben per Chat mit den Kunden zu kommunizieren, um fragen zu klären und den Kontext zu erweitern.
  - 