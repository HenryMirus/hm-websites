// Schickt die Supabase-Auth-Mails mit Beispielwerten über sendEmail() (echtes
// SMTP, Bilder als CID-Anhang wie bei den App-Mails) an die übergebenen
// Adressen. Betreff mit Präfix "[Vorschau] ". Versendet wirklich, nur bewusst
// starten. Die Links darin sind absichtlich unecht (Beispiel-Token).
//
// Aufruf im Repo-Root; SMTP-Variablen kommen aus .env.local:
//   node --env-file=.env.local --experimental-strip-types \
//     --import ./scripts/register-ts-alias.mjs \
//     scripts/send-auth-email-previews.ts adresse1@example.com [adresse2@example.com ...]

import { sendEmail } from "@/lib/email/send";
import { buildAuthMails, fillExamples } from "./auth-email-data";

async function main() {
  const to = process.argv.slice(2).filter((a) => a.includes("@"));
  if (to.length === 0) {
    console.error("Verwendung: send-auth-email-previews.ts adresse1@example.com [adresse2 ...]");
    process.exit(1);
  }

  for (const mail of buildAuthMails("cid")) {
    await sendEmail({ to, subject: `[Vorschau] ${mail.subject}`, html: fillExamples(mail.html) });
    console.log(`gesendet: ${mail.key} -> ${to.join(", ")}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
