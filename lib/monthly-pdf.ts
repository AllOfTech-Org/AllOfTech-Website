import { breadcrumbList, webPageNode } from "@/lib/seo";
import {
  absoluteUrl,
  BOOK_A_CALL_URL,
  PUBLISHED_STATS,
  SITE_URL,
} from "@/lib/site";

/**
 * Gated monthly PDF page (/free-pdf) — edit this file when you swap topics.
 *
 * File: replace public/downloads/current.pdf (keep that exact filename).
 * Then update MONTHLY_PDF below: heading, headingAccent, lede, body,
 * downloadLabel, downloadName, pageTitle, description, keywords,
 * ctaKicker, ctaHeading, ctaBody, ctaPoints, and cacheBust (use YYYY-MM).
 *
 * This is a separate page from /free-guide. /free-guide downloads immediately.
 * This page asks for name and email first, then starts the download.
 */
export const MONTHLY_PDF_PATH = "/free-pdf";
export const MONTHLY_PDF_ACTION = "free_pdf_download";
export const MONTHLY_PDF_SHEET = "PdfDownloads";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MONTHLY_PDF = {
  fileName: "current.pdf",
  publicDir: "public/downloads",
  cacheBust: "2026-09",
  downloadName: "AllOfTech-How-to-Choose-a-Tech-Agency.pdf",

  pageTitle: "How to Choose a Tech Agency | Free PDF | AllOfTech",
  description:
    "Free AllOfTech PDF on how to choose a tech agency. Leave your name and email to download the briefing on requirements, proof, process, and value.",
  keywords: [
    "how to choose a tech agency",
    "tech agency guide PDF",
    "hire a technology agency",
    "AllOfTech free PDF",
    "select a tech agency",
  ],

  badge: "Monthly PDF",
  heading: "How to choose a tech agency",
  headingAccent: "tech agency",
  lede: "A short briefing you can take into the next vendor call — including ours.",
  body: [
    "Hiring the wrong studio burns the brief, the budget, and a quarter. This PDF is a practical scorecard: what to lock before you talk to anyone, what proof to ask for, and which process signals separate a real team from a pitch.",
    "It walks through requirements, portfolio checks, technical fit, communication, pricing versus value, and the support you should expect after launch. Use it as a checklist on the next call.",
    "Click download, add your name and email, and the file starts. No account. No payment.",
  ],
  downloadLabel: "Download the agency selection PDF",
  fileNote: "PDF · name and email · then it downloads",
  formKicker: "Two fields, then the file",
  formTitle: "Get the agency selection PDF",
  formBody: "Name and email only. The briefing downloads as soon as you submit.",
  formSubmitLabel: "Send and download",
  formDoneTitle: "The briefing is on its way.",
  formDoneBody: "Your download should start now. If it did not, use the link below.",
  formLegal: "Used only for this download. No newsletter.",

  ctaKicker: "Use the same scorecard on us",
  ctaHeading: "If this is how you hire, this is how AllOfTech works.",
  ctaBody:
    "We start with business clarity, not code. If the guide is your filter, here is what you can check against AllOfTech before you book a call.",
  ctaPoints: [
    {
      title: "Diagnosis before a stack",
      body: "Every engagement starts with the real bottleneck, then a solution that fits outcome, budget, and timeline.",
    },
    {
      title: "One team for the whole build",
      body: "AI/ML, web, mobile, UX/UI, branding, and animation — engineered end to end, not passed between vendors.",
    },
    {
      title: "Delivery you can verify",
      body: `${PUBLISHED_STATS.projectsDelivered} projects delivered, ${PUBLISHED_STATS.onTimeDeliveryPercent}% on time, ${PUBLISHED_STATS.ratingValue} from published reviews. Case studies are on the site, not a private deck.`,
    },
  ],
  ctaButtonLabel: "Book a call to test the fit",
  ctaButtonHref: BOOK_A_CALL_URL,
} as const;

export function monthlyPdfPublicPath() {
  return `/downloads/${MONTHLY_PDF.fileName}`;
}

export function monthlyPdfDownloadHref() {
  return `${monthlyPdfPublicPath()}?v=${MONTHLY_PDF.cacheBust}`;
}

export type MonthlyPdfLeadInput = {
  name: string;
  email: string;
};

export type MonthlyPdfLead = {
  name: string;
  email: string;
};

function clip(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function parseMonthlyPdfLead(
  input: MonthlyPdfLeadInput,
): MonthlyPdfLead | { error: string; field?: "name" | "email" } {
  const name = clip(input.name, 120);
  const email = clip(input.email, 200).toLowerCase();

  if (!name) {
    return { error: "Please enter your name.", field: "name" };
  }
  if (!email) {
    return { error: "Please enter your email.", field: "email" };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Please use a valid email address.", field: "email" };
  }

  return { name, email };
}

export function monthlyPdfSchemas() {
  const pageUrl = absoluteUrl(MONTHLY_PDF_PATH);
  const fileUrl = `${SITE_URL}${monthlyPdfPublicPath()}`;

  return [
    webPageNode({
      path: MONTHLY_PDF_PATH,
      name: MONTHLY_PDF.heading,
      description: MONTHLY_PDF.description,
    }),
    {
      "@context": "https://schema.org",
      "@type": "DigitalDocument",
      name: MONTHLY_PDF.downloadName.replace(/\.pdf$/i, ""),
      description: MONTHLY_PDF.description,
      encodingFormat: "application/pdf",
      url: fileUrl,
      isPartOf: { "@id": `${pageUrl}#webpage` },
    },
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Free PDF", path: MONTHLY_PDF_PATH },
    ]),
  ];
}
