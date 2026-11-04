// Schickt alle sieben Mail-Templates mit Beispieldaten über sendEmail() (also mit
// echtem SMTP und CID-Anhängen) an die übergebenen Adressen. Betreff mit
// Präfix "[Vorschau] ". Versendet wirklich, nur bewusst starten.
//
// Aufruf im Repo-Root; SMTP-Variablen kommen aus .env.local:
//   node --env-file=.env.local --experimental-strip-types \
//     --import ./scripts/register-ts-alias.mjs \
//     scripts/send-email-previews.ts adresse1@example.com [adresse2@example.com ...]

import { sendEmail } from "@/lib/email/send";
import { renderPreviewMails } from "./email-preview-data";

async function main() {
  const to = process.argv.slice(2).filter((a) => a.includes("@"));
  if (to.length === 0) {
    console.error("Verwendung: send-email-previews.ts adresse1@example.com [adresse2 ...]");
    process.exit(1);
  }

  for (const mail of renderPreviewMails()) {
    await sendEmail({ to, subject: `[Vorschau] ${mail.subject}`, html: mail.html });
    console.log(`gesendet: ${mail.key} -> ${to.join(", ")}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
