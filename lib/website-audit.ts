import { breadcrumbList, webPageNode } from "@/lib/seo";
import { PUBLISHED_STATS, SITE_URL } from "@/lib/site";

export const WEBSITE_AUDIT_PATH = "/free-website-audit";

export const WEBSITE_AUDIT_TITLE = "Free Website Audit | AllOfTech";
export const WEBSITE_AUDIT_DESCRIPTION =
  "Request a free AllOfTech website audit. Send your live URL and get written notes on speed, SEO, trust, and conversions — usually within 48 hours.";

export const WEBSITE_AUDIT_KEYWORDS = [
  "free website audit",
  "website audit",
  "website review",
  "AllOfTech website audit",
  "SEO audit",
  "website conversion review",
];

export const AUDIT_FOCUS_OPTIONS = [
  { value: "whole-site", label: "The whole site" },
  { value: "speed", label: "Speed and loading" },
  { value: "seo", label: "Search and findability" },
  { value: "design", label: "Design and first impression" },
  { value: "conversion", label: "Enquiries and conversions" },
  { value: "specific", label: "Something specific" },
] as const;

export type AuditFocusValue = (typeof AUDIT_FOCUS_OPTIONS)[number]["value"];

export type WebsiteAuditInput = {
  fullName: string;
  email: string;
  websiteUrl: string;
  company?: string;
  focus?: string;
  phone?: string;
  notes?: string;
  honeypot?: string;
  timezone?: string;
  referrer?: string;
  landingUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  userId?: string;
  sessionId?: string;
};

export type WebsiteAuditRecord = {
  fullName: string;
  email: string;
  websiteUrl: string;
  company: string;
  focus: string;
  focusLabel: string;
  phone: string;
  notes: string;
  timezone: string;
  referrer: string;
  landingUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  userId: string;
  sessionId: string;
};

export const AUDIT_DELIVERABLES = [
  {
    title: "The few issues that matter",
    body: "Speed, trust, SEO, and the pages that lose people — ranked, not a 40-page dump.",
  },
  {
    title: "What to leave alone",
    body: "What is already doing its job, so you do not rebuild the wrong parts.",
  },
  {
    title: "One next step",
    body: "Keep it, fix it, or rebuild it. A clear recommendation, not a pitch deck.",
  },
] as const;

export const AUDIT_STEPS = [
  { n: "01", title: "Share the live URL", body: "The public site is enough. No logins, no access." },
  { n: "02", title: "We review it", body: "We look at the real pages — not a screenshot, not a template score." },
  { n: "03", title: "We write back", body: "A written audit, usually within 48 hours." },
] as const;

export const AUDIT_FAQS = [
  {
    question: "What do you need from me?",
    answer: "The live website URL and a work email. Company name and a note about what to look at first help, but they are optional.",
  },
  {
    question: "How long does the audit take?",
    answer: "You should have written notes within 48 hours. Complex sites can take a little longer — we will say so if they will.",
  },
  {
    question: "Is this a sales call?",
    answer: "No. You get the notes first. If you want help after that, we can talk. There is no obligation and no newsletter.",
  },
] as const;

export const AUDIT_PROOF = [
  `${PUBLISHED_STATS.projectsDelivered} projects delivered`,
  `${PUBLISHED_STATS.ratingValue} from published reviews`,
  "Notes within 48 hours",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\d\s.-]{7,24}$/;

export function auditFocusLabel(value: string) {
  return AUDIT_FOCUS_OPTIONS.find((option) => option.value === value)?.label ?? "";
}

export function normalizeWebsiteUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidWebsiteUrl(raw: string) {
  try {
    const url = new URL(normalizeWebsiteUrl(raw));
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (!url.hostname.includes(".")) return false;
    if (url.hostname === "localhost" || url.hostname.endsWith(".local")) return false;
    return true;
  } catch {
    return false;
  }
}

function clip(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function parseWebsiteAudit(input: WebsiteAuditInput): WebsiteAuditRecord | { error: string } {
  if (clip(input.honeypot, 80)) {
    return { error: "spam" };
  }

  const fullName = clip(input.fullName, 120);
  const email = clip(input.email, 200).toLowerCase();
  const websiteUrl = normalizeWebsiteUrl(clip(input.websiteUrl, 500));
  const company = clip(input.company, 120);
  const focus = clip(input.focus, 40);
  const phone = clip(input.phone, 40);
  const notes = String(input.notes ?? "").trim().slice(0, 2000);

  if (!fullName || !email || !websiteUrl) {
    return { error: "Please add your name, email, and website URL." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Please use a valid email address." };
  }
  if (!isValidWebsiteUrl(websiteUrl)) {
    return { error: "Please use a full website URL, such as yoursite.com." };
  }
  if (phone && !PHONE_PATTERN.test(phone)) {
    return { error: "Please use a valid phone or WhatsApp number, or leave it blank." };
  }

  const focusLabel = auditFocusLabel(focus) || "The whole site";

  return {
    fullName,
    email,
    websiteUrl,
    company,
    focus: focus || "whole-site",
    focusLabel,
    phone,
    notes,
    timezone: clip(input.timezone, 80),
    referrer: clip(input.referrer, 500),
    landingUrl: clip(input.landingUrl, 500) || `${SITE_URL}${WEBSITE_AUDIT_PATH}`,
    utmSource: clip(input.utmSource, 80),
    utmMedium: clip(input.utmMedium, 80),
    utmCampaign: clip(input.utmCampaign, 120),
    userId: clip(input.userId, 120),
    sessionId: clip(input.sessionId, 120),
  };
}

export function websiteAuditSchemas() {
  return [
    webPageNode({
      path: WEBSITE_AUDIT_PATH,
      name: "Free website audit",
      description: WEBSITE_AUDIT_DESCRIPTION,
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: `${SITE_URL}${WEBSITE_AUDIT_PATH}`,
      mainEntity: AUDIT_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Free Website Audit", path: WEBSITE_AUDIT_PATH },
    ]),
  ];
}
