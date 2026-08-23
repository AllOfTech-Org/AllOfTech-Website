import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
};

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

export function getMailConfig(): MailConfig {
  const port = Number(process.env.SMTP_PORT ?? "587");
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error("Invalid SMTP_PORT");
  }

  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureEnv === "true" || secureEnv === "1" || port === 465;

  return {
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port,
    secure,
    user: required("SMTP_USER"),
    pass: required("SMTP_PASS"),
    from: process.env.MAIL_FROM?.trim() || `${SITE_NAME} <${CONTACT_EMAIL}>`,
    to: process.env.MAIL_TO?.trim() || CONTACT_EMAIL,
  };
}
