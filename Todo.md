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
  - Lead-Analyse und -Priorisierung
    - Eine KI soll die eingehenden Leads analysieren, indem es erstmal die Anfrage selbst liest und einordnet. Dann sollen recherchen zu dem Kunden bzw. dessen Firma angestellt werden, die Branche, Nische, aktuellen Stand der Website, Mitarbeiterzahl, ggf. Jahresumsatz usw. rausfindet.
    - Danach soll die KI diesen Lead Priorisieren.
    - Zum Schluss soll die KI eine antwort-email verfassen und unter den Wizard-Antworten hinterlegen, sodass ich sie kopieren und abschicken kann. (Hierfür muss noch ein Feld unterhalb der Wizard-Antworten der Leads eingefügt werden)
  - [ ] **Angebotserstellung (Admin-only)**
    - Ich möchte eine KI-gestützte Angebotserstellung einbauen. Es soll so funktionieren, dass ich pro Projekt einen Button "Angebot erstellen" habe und dann die Daten des Kunden und des Projekts geladen und an ein KI-System übergeben werden. Dieses erstellt mir dann ein Angebot im bearbeitbaren PDF-Format mit Preview, welches ich anschließend direkt akzeptieren kann, sodass es dem Kunden im Chat und unter seinem Projekt zur verfügung gestellt wird, ich es exportieren und selbst bearbeiten kann oder ich dem KI-System Feedback geben kann und dieses das Angebot dann entsprechend überarbeitet. 
    - Das Angebot muss, genau wie Rechnungen, Formal gestaltet sein und soll neben allem anderen, was rechtlich enthalten sein muss, auch mein Logo enthalten
    - Nachdem ich "Angebot erstellen" gedrückt habe soll ein Pop-Up-Fenster erscheinen, in dem mir die Preview des Angebots angezeigt wird und ich die o.g. Aktionen ausführen kann. 
    - Das Feedback an das KI-System soll per Chat erfolgen, wenn ich also etwas anders haben will schreibe ich das einfach in den Chat und das System überarbeitet das Angebot. Über diesen Chat soll das KI-System Rückfragen stellen, wenn wichtige Informationen für die Angebotserstellung fehlen bevor die Angebots-PDF erstellt wird.


## 4. Website Feinschliff
  - Tech-Stack anpassen
