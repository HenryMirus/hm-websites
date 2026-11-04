// Rendert die Supabase-Auth-Mails mit Beispielwerten als HTML-Dateien, ohne zu
// senden. Logo und Portrait als Data-URI aus public/email, damit die Vorschau
// ohne Deploy funktioniert.
//
// Aufruf im Repo-Root:
//   node --experimental-strip-types --import ./scripts/register-ts-alias.mjs \
//     scripts/render-auth-email-previews.ts [Zielordner]

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { buildAuthMails, fillExamples } from "./auth-email-data";
import { LOGO_CID, PORTRAIT_CID } from "@/lib/email/templates";

const outDir = path.resolve(process.argv[2] ?? ".dev-emails/auth-previews");

const images = [
  { cid: LOGO_CID, file: "public/email/hm-labs-logo-email.png", mime: "image/png" },
  { cid: PORTRAIT_CID, file: "public/email/henry-portrait-email.jpg", mime: "image/jpeg" },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  const uris: Record<string, string> = {};
  for (const img of images) {
    const buf = await readFile(path.join(process.cwd(), img.file));
    uris[img.cid] = `data:${img.mime};base64,${buf.toString("base64")}`;
  }

  for (const mail of buildAuthMails("cid")) {
    let html = fillExamples(mail.html);
    for (const [cid, uri] of Object.entries(uris)) html = html.replaceAll(`cid:${cid}`, uri);
    const file = path.join(outDir, `${mail.key}.html`);
    await writeFile(file, html, "utf-8");
    console.log(`${mail.key.padEnd(18)} ${file}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
