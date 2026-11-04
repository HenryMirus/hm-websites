// Baut die statischen Supabase-Auth-Templates in lib/email/templates/ aus
// emailShell() neu. Die Dateien werden von Hand im Supabase-Dashboard
// eingefügt (Authentication → Emails → Templates), siehe lib/email/templates/README.md.
// Bilder per https-URL, weil Supabase keine CID-Anhänge versenden kann.
//
// Aufruf im Repo-Root:
//   node --experimental-strip-types --import ./scripts/register-ts-alias.mjs \
//     scripts/build-auth-templates.ts

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { buildAuthMails } from "./auth-email-data";

const outDir = path.join(process.cwd(), "lib/email/templates");

// Nur diese Go-Platzhalter kennt Supabase für Auth-Mails und nutzt diese App.
// Alles andere in {{ }} wäre ein Tippfehler, der erst im Postfach auffällt.
const ALLOWED = [
  /^\.TokenHash$/,
  /^\.Token$/,
  /^\.Email$/,
  /^\.NewEmail$/,
  /^\.SiteURL$/,
  /^\.ConfirmationURL$/,
  /^\.Data\.name$/,
  /^if \.Data\.name$/,
  /^end$/,
];

// Supabases Template-Editor und Vorschau lesen eingefügtes HTML nicht zuverlässig
// als UTF-8 (Umlaute, ß und Gedankenstriche kommen kaputt an). Nicht-ASCII-Zeichen
// werden deshalb als numerische Entities geschrieben; die Go-Platzhalter sind ASCII.
function encodeNonAscii(html: string): string {
  let out = "";
  for (const ch of html) {
    const cp = ch.codePointAt(0)!;
    out += cp > 127 ? `&#${cp};` : ch;
  }
  return out;
}

async function main() {
  for (const mail of buildAuthMails("url")) {
    const found = Array.from(mail.html.matchAll(/\{\{\s*([^}]*?)\s*\}\}/g), (m) => m[1]);
    const unknown = found.filter((p) => !ALLOWED.some((re) => re.test(p)));
    if (unknown.length > 0) throw new Error(`${mail.file}: unbekannte Platzhalter ${unknown.join(", ")}`);

    // Ein Template, das {{ if }} und {{ end }} nicht ausgleicht, lässt Supabase
    // beim Versand scheitern.
    const opens = found.filter((p) => p.startsWith("if ")).length;
    const ends = found.filter((p) => p === "end").length;
    if (opens !== ends) throw new Error(`${mail.file}: {{ if }}/{{ end }} nicht ausgeglichen`);

    await writeFile(path.join(outDir, mail.file), encodeNonAscii(mail.html), "utf-8");
    console.log(`${mail.key.padEnd(18)} ${mail.file}${mail.used ? "" : "  (aktuell ungenutzt)"}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
