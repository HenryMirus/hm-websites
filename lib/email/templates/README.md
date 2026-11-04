# Supabase-Auth-Mails

Diese HTML-Dateien werden **von Hand** im Supabase-Dashboard eingefügt. Die App sendet sie nicht selbst. Nicht von Hand bearbeiten: sie entstehen aus `emailShell()` und werden überschrieben.

```
node --experimental-strip-types --import ./scripts/register-ts-alias.mjs scripts/build-auth-templates.ts
```

Inhalte und Betreffzeilen stehen in `scripts/auth-email-data.ts`. Bilder kommen per `https://hm-labs.tech/email/...`, das Portrait erst nach dem Deploy der Website.

## Zuordnung (Supabase → Authentication → Emails → Templates)

| Dashboard-Template | Betreff (dort einfügen) | Datei | Genutzt |
|---|---|---|---|
| Reset password | Passwort zurücksetzen – HM Labs | `password-reset.html` | ja |
| Invite user | Ihr Zugang zum HM Labs Kundenportal | `invite.html` | ja |
| Change email address | E-Mail-Adresse bestätigen – HM Labs | `email-change.html` | ja |
| Magic link | Ihr Anmelde-Link – HM Labs | `magic-link.html` | nein |
| Confirm sign up | Registrierung bestätigen – HM Labs | `confirmation.html` | nein |
| Reauthentication | Ihr Bestätigungscode – HM Labs | `reauthentication.html` | nein |

Die Links führen auf `{PORTAL_URL}/auth/callback?token_hash=…&type=…` (Button-Seite, eingelöst wird erst per POST). Verwendet werden nur `{{ .TokenHash }}`, `{{ .Token }}`, `{{ .Email }}`, `{{ .NewEmail }}` und `{{ .Data.name }}`.

Die genannte Gültigkeit (Reset 15 Min., Einladung 48 Std., übrige 60 Min.) muss zu **Authentication → Sign In / Providers → Email → Email OTP Expiration** passen. Das ist ein einziger Wert für alle Typen.

## SMTP (Authentication → SMTP Settings, Custom SMTP an)

| Feld | Wert |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Benutzer | `resend` |
| Passwort | Resend-API-Key |
| Absender-Adresse | `no-reply@hm-labs.tech` (Resend erlaubt jede Adresse der verifizierten Domain, ein Postfach ist nicht nötig; Antworten laufen ins Leere, die Mails sagen das) |
| Absender-Name | `HM Labs` |

Der API-Key gehört nur ins Dashboard (und nach `.env.local`/Server-Umgebung), **nie ins Repo**.

## Vorschau

`scripts/render-auth-email-previews.ts [Ordner]` rendert HTML mit Beispielwerten, `scripts/send-auth-email-previews.ts adresse@…` verschickt sie mit Präfix `[Vorschau]`.
