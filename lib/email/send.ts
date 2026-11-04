import nodemailer from "nodemailer";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { EMAIL } from "@/lib/config/email";
import { LOGO_CID, PORTRAIT_CID } from "./templates";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

// Bilder hängen als Inline-Anhang (cid:) an der Mail, statt von der Website
// geladen zu werden: Clients blockieren externe Bilder oft, CID-Anhänge nicht.
// Das Portrait ist ein eigener Ausschnitt in Mail-Größe (JPEG statt WebP, das
// Outlook/Gmail nicht durchgängig darstellen).
const INLINE_IMAGES = [
  {
    label: "Logo",
    cid: LOGO_CID,
    filename: "hm-labs-logo.png",
    mime: "image/png",
    path: path.join(process.cwd(), "public/email/hm-labs-logo-email.png"),
  },
  {
    label: "Portrait",
    cid: PORTRAIT_CID,
    filename: "henry-mirus.jpg",
    mime: "image/jpeg",
    path: path.join(process.cwd(), "public/email/henry-portrait-email.jpg"),
  },
] as const;

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "[Email] SMTP nicht konfiguriert. Bitte SMTP_HOST, SMTP_USER und SMTP_PASS in .env.local setzen."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    // Ohne Grenzen hängt ein nicht erreichbarer SMTP-Server die Anfrage des
    // Formulars oder das Senden einer Portal-Nachricht minutenlang auf.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

const FROM = EMAIL.FROM;

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions): Promise<void> {
  if (process.env.NODE_ENV === "development" && !process.env.SMTP_HOST) {
    console.log(`[Email DEV] To: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`[Email DEV] Subject: ${subject}`);

    // Vorschau als Datei: cid-Bilder durch Data-URIs ersetzen, sonst zeigt der
    // Browser sie nicht an.
    let previewHtml = html;
    for (const img of INLINE_IMAGES) {
      if (!html.includes(`cid:${img.cid}`)) continue;
      const buffer = await readFile(img.path);
      previewHtml = previewHtml.replaceAll(
        `cid:${img.cid}`,
        `data:${img.mime};base64,${buffer.toString("base64")}`
      );
    }

    const dir = path.join(process.cwd(), ".dev-emails");
    await mkdir(dir, { recursive: true });
    const filename = `${Date.now()}-${subject.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 60)}.html`;
    const filePath = path.join(dir, filename);
    await writeFile(filePath, previewHtml, "utf-8");
    console.log(`[Email DEV] Vorschau: file://${filePath}`);
    return;
  }

  const transporter = createTransport();
  // Fehlt ein Bild im Deployment, lieber ohne das Bild senden als gar nicht.
  const attachments = [];
  for (const img of INLINE_IMAGES) {
    if (!html.includes(`cid:${img.cid}`)) continue;
    if (existsSync(img.path)) {
      attachments.push({ filename: img.filename, path: img.path, cid: img.cid });
    } else {
      console.warn(`[Email] ${img.label} fehlt (${img.path}), Mail geht ohne ${img.label} raus.`);
    }
  }
  await transporter.sendMail({
    from: FROM,
    to,
    subject,
    html,
    replyTo,
    attachments: attachments.length > 0 ? attachments : undefined,
  });
}
