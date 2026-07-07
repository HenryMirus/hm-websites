import nodemailer from "nodemailer";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

const LOGO_CID = "hm-labs-logo";
const LOGO_PATH = path.join(process.cwd(), "public/email/hm-labs-logo-email.png");

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
  });
}

const FROM =
  process.env.SMTP_FROM ?? `HM Labs <no-reply@hm-labs.de>`;

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions): Promise<void> {
  if (process.env.NODE_ENV === "development" && !process.env.SMTP_HOST) {
    console.log(`[Email DEV] To: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`[Email DEV] Subject: ${subject}`);

    let previewHtml = html;
    if (html.includes(`cid:${LOGO_CID}`)) {
      const logoBuffer = await readFile(LOGO_PATH);
      const dataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;
      previewHtml = html.replaceAll(`cid:${LOGO_CID}`, dataUri);
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
  const attachments = html.includes(`cid:${LOGO_CID}`)
    ? [{ filename: "hm-labs-logo.png", path: LOGO_PATH, cid: LOGO_CID }]
    : undefined;
  await transporter.sendMail({ from: FROM, to, subject, html, replyTo, attachments });
}
