# HM Labs — Todo

## 1. KI-Chatbot
- Was ist möglich / Konzept ausarbeiten

## 2. ✅ Cookies technisch einbinden
- ✅ Notwendige Cookies (Supabase Auth) — bereits aktiv
- ✅ Analyse-Cookies (Google Analytics 4) — vorbereitet
- ✅ Marketing-Cookies (Meta, Google Ads, LinkedIn) — vorbereitet
- ✅ Einstellungen-Button funktioniert korrekt

## 3. Tracking-IDs eintragen & Scripts testen
Sobald die Accounts erstellt sind, IDs in `.env.local` eintragen:

- **Google Analytics 4** → analytics.google.com → Property erstellen → Measurement ID (`G-XXXXXXX`) → `NEXT_PUBLIC_GA4_ID=`
  Danach: Admin → Datenverarbeitungsbedingungen → AV-Vertrag akzeptieren (2 Min, 1 Klick)
- **Meta Pixel** → business.facebook.com → Events Manager → Pixel erstellen → `NEXT_PUBLIC_META_PIXEL_ID=`
- **Google Ads** → ads.google.com → Conversion-Tracking → Tag-ID (`AW-XXXXXXX`) → `NEXT_PUBLIC_GOOGLE_ADS_ID=`
- **LinkedIn** → linkedin.com/campaignmanager → Account Assets → Insight Tag → `NEXT_PUBLIC_LINKEDIN_PARTNER_ID=`

Nach dem Eintragen testen: DevTools → Network → auf Requests zu `google-analytics.com`, `facebook.net`, `snap.licdn.com` prüfen.
