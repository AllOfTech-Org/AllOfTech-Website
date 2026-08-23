import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { getMailConfig, type MailConfig } from "@/lib/mail/config";

let transporter: Transporter | null = null;
let signature = "";

function transportSignature(config: MailConfig): string {
  return [config.host, config.port, config.secure, config.user, config.pass].join("|");
}

export function getTransporter(): Transporter {
  const config = getMailConfig();
  const nextSignature = transportSignature(config);
  if (transporter && signature === nextSignature) {
    return transporter;
  }

  signature = nextSignature;
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return transporter;
}
