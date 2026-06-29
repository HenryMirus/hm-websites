import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

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
    return;
  }

  const transporter = createTransport();
  await transporter.sendMail({ from: FROM, to, subject, html, replyTo });
}
