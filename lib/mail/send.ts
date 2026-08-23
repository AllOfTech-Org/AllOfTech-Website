import path from "node:path";
import { getMailConfig } from "@/lib/mail/config";
import {
  LOGO_CID,
  contactAutoReplyEmail,
  contactInternalEmail,
  reviewInternalEmail,
} from "@/lib/mail/templates";
import { getTransporter } from "@/lib/mail/transporter";
import type { ContactSubmission, ReviewSubmission } from "@/lib/mail/validate";
import { LOGO_ICON_PATH } from "@/lib/site";

function logoAttachment() {
  return {
    filename: "alloftech-logo.png",
    path: path.join(process.cwd(), "public", LOGO_ICON_PATH.replace(/^\//, "")),
    cid: LOGO_CID,
  };
}

const SAFE_SEND_ERROR = "Unable to send right now.";

function logMailError(context: string, error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown mail error";
  console.error(`[mail] ${context}: ${message}`);
}

export async function sendContactMails(data: ContactSubmission): Promise<void> {
  const config = getMailConfig();
  const transporter = getTransporter();
  const internal = contactInternalEmail(data);
  const autoReply = contactAutoReplyEmail(data);

  try {
    await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: `${data.name} <${data.email}>`,
      subject: internal.subject,
      text: internal.text,
      html: internal.html,
      attachments: [logoAttachment()],
    });
  } catch (error) {
    logMailError("contact-internal", error);
    throw new Error(SAFE_SEND_ERROR);
  }

  try {
    await transporter.sendMail({
      from: config.from,
      to: data.email,
      replyTo: config.to,
      subject: autoReply.subject,
      text: autoReply.text,
      html: autoReply.html,
      attachments: [logoAttachment()],
    });
  } catch (error) {
    logMailError("contact-auto-reply", error);
  }
}

export async function sendReviewMail(data: ReviewSubmission): Promise<void> {
  const config = getMailConfig();
  const transporter = getTransporter();
  const internal = reviewInternalEmail(data);

  try {
    await transporter.sendMail({
      from: config.from,
      to: config.to,
      subject: internal.subject,
      text: internal.text,
      html: internal.html,
      attachments: [logoAttachment()],
    });
  } catch (error) {
    logMailError("review-internal", error);
    throw new Error(SAFE_SEND_ERROR);
  }
}
