import { SERVICES } from "@/lib/services";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import type { ContactServiceSlug, ContactSubmission, ReviewSubmission } from "@/lib/mail/validate";

export const LOGO_CID = "alloftech-logo";

export type MailContent = {
  subject: string;
  text: string;
  html: string;
};

const SERVICE_LABELS: Record<ContactServiceSlug, string> = {
  ...Object.fromEntries(SERVICES.map((service) => [service.slug, service.shortName])),
  other: "Something else",
} as Record<ContactServiceSlug, string>;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function firstName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0];
  return first || fullName;
}

function formatTimestamp(date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

function stars(rating: number): string {
  return `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;
}

function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#0b1220;color:#e8eef8;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b1220;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111a2b;border:1px solid #24324a;border-radius:16px;">
            <tr>
              <td style="padding:28px 32px 16px;border-bottom:1px solid #24324a;">
                <a href="${SITE_URL}" style="display:inline-block;text-decoration:none;">
                  <img src="cid:${LOGO_CID}" alt="${SITE_NAME}" width="180" style="display:block;border:0;width:180px;height:auto;max-width:180px;" />
                </a>
                <h1 style="margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:#f8fafc;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;font-size:16px;line-height:1.7;color:#d7e2f2;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#93a4bb;">
                <p style="margin:0;">
                <a href="${SITE_URL}" style="color:#7dd3fc;text-decoration:none;">www.alloftech.site</a><br />
                <a href="mailto:${CONTACT_EMAIL}" style="color:#7dd3fc;text-decoration:none;">${CONTACT_EMAIL}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function fieldRow(label: string, value: string): string {
  return `<p style="margin:0 0 16px;"><strong style="display:block;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#93a4bb;">${escapeHtml(label)}</strong><span style="white-space:pre-wrap;">${escapeHtml(value)}</span></p>`;
}

export function serviceLabel(service: ContactServiceSlug | ""): string {
  if (!service) return "Not selected";
  return SERVICE_LABELS[service];
}

type AutoReplyCopy = {
  subject: string;
  paragraphs: string[];
};

const CONTACT_AUTO_REPLIES: Record<ContactServiceSlug | "general", AutoReplyCopy> = {
  "ai-development": {
    subject: "Your AI inquiry is with AllOfTech",
    paragraphs: [
      "Thank you for contacting AllOfTech about AI/ML development. We received your message and the team is reviewing the problem you want the system to take on.",
      "We build AI that does a job on the floor — prediction, automation, support — not a science project. We will follow up within 24 hours with the first useful next step.",
    ],
  },
  "web-development": {
    subject: "Your website project is on our desk",
    paragraphs: [
      "Thank you for contacting AllOfTech about web development. We received your message about the site or web app you have in mind.",
      "We build fast, conversion-focused websites that work on every screen and can grow with the business. The team will follow up within 24 hours to sketch the right build.",
    ],
  },
  animation: {
    subject: "Your animation brief reached AllOfTech",
    paragraphs: [
      "Thank you for contacting AllOfTech about animation. We received your brief, and the motion team is reviewing the story, product, or process you want people to understand.",
      "We make professional films and loops with a job — product visualization, explainers, brand intros, and UI motion. We will follow up within 24 hours with the format that matches the goal.",
    ],
  },
  branding: {
    subject: "Your branding inquiry is in motion",
    paragraphs: [
      "Thank you for contacting AllOfTech about graphics and brand identity. We received your message and are reviewing how you want the business to be recognized.",
      "We design logos, systems, and marketing graphics that read in five seconds — on a card, a site, a shelf, or a feed. The team will follow up within 24 hours to outline an identity the business can actually wear.",
    ],
  },
  "ux-ui-design": {
    subject: "Your UX/UI request is with the AllOfTech team",
    paragraphs: [
      "Thank you for contacting AllOfTech about UX/UI design. We received your request and are reviewing the product, site, or flow you want people to finish without guessing.",
      "We design from research and prototypes so customers know what to do the first time they land. We will follow up within 24 hours to map the first screens they should see.",
    ],
  },
  "mobile-app-development": {
    subject: "Your mobile app inquiry is received",
    paragraphs: [
      "Thank you for contacting AllOfTech about mobile app development. We received your message about putting the business in customers' pockets.",
      "We build iPhone and Android apps that make buying, booking, and staying connected effortless — fast, secure, and ready for the store. The team will follow up within 24 hours to outline the first version people will actually use.",
    ],
  },
  other: {
    subject: "AllOfTech received your message",
    paragraphs: [
      "Thank you for contacting AllOfTech. We received your message and will confirm the right next step from what you sent — whether that is a current service or a different brief.",
      "The team will follow up within 24 hours. If a call is the faster path, we can set that when we reply.",
    ],
  },
  general: {
    subject: "AllOfTech received your message — we'll follow up",
    paragraphs: [
      "Thank you for contacting AllOfTech. Your message is with the team.",
      "We will follow up within 24 hours with a clear next step. If you already know the service you need, you can mention it when we write back — or book a call and we will map it together.",
    ],
  },
};

function autoReplyFor(service: ContactServiceSlug | ""): AutoReplyCopy {
  return service ? CONTACT_AUTO_REPLIES[service] : CONTACT_AUTO_REPLIES.general;
}

export function contactInternalEmail(data: ContactSubmission): MailContent {
  const label = serviceLabel(data.service);
  const submittedAt = formatTimestamp();
  const subject = `New inquiry: ${label} — ${data.name}`;
  const text = [
    `New contact inquiry from the AllOfTech website.`,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Service: ${label}`,
    `Submitted: ${submittedAt} UTC`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  const html = wrapHtml(
    "New contact inquiry",
    [
      fieldRow("Name", data.name),
      fieldRow("Email", data.email),
      fieldRow("Service", label),
      fieldRow("Submitted", `${submittedAt} UTC`),
      fieldRow("Message", data.message),
    ].join(""),
  );

  return { subject, text, html };
}

export function contactAutoReplyEmail(data: ContactSubmission): MailContent {
  const copy = autoReplyFor(data.service);
  const greeting = `Hello ${firstName(data.name)},`;
  const closing = [
    "With care,",
    `The ${SITE_NAME} team`,
  ];

  const text = [greeting, "", ...copy.paragraphs, "", ...closing].join("\n\n");
  const html = wrapHtml(
    copy.subject,
    [
      `<p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>`,
      ...copy.paragraphs.map(
        (paragraph) => `<p style="margin:0 0 16px;">${escapeHtml(paragraph)}</p>`,
      ),
      `<p style="margin:24px 0 0;">With care,<br />The ${SITE_NAME} team</p>`,
    ].join(""),
  );

  return { subject: copy.subject, text, html };
}

export function reviewInternalEmail(data: ReviewSubmission): MailContent {
  const submittedAt = formatTimestamp();
  const occupation = data.occupation || "Not provided";
  const ratingLabel = `${data.rating} ${data.rating === 1 ? "star" : "stars"} (${stars(data.rating)})`;
  const subject = `New review: ${data.rating} stars — ${data.name}`;
  const text = [
    `New review submitted on the AllOfTech website.`,
    "",
    `Name: ${data.name}`,
    `Occupation: ${occupation}`,
    `Rating: ${ratingLabel}`,
    `Submitted: ${submittedAt} UTC`,
    "",
    "Review:",
    data.message,
  ].join("\n");

  const html = wrapHtml(
    "New review submitted",
    [
      fieldRow("Name", data.name),
      fieldRow("Occupation", occupation),
      fieldRow("Rating", ratingLabel),
      fieldRow("Submitted", `${submittedAt} UTC`),
      fieldRow("Review", data.message),
    ].join(""),
  );

  return { subject, text, html };
}
