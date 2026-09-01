import { breadcrumbList, webPageNode } from "@/lib/seo";
import {
  absoluteUrl,
  BOOK_A_CALL_URL,
  PUBLISHED_STATS,
  SITE_URL,
} from "@/lib/site";

/**
 * Monthly free PDF — this is the only copy file to edit when you swap topics.
 *
 * File: replace public/downloads/current.pdf (keep that exact filename).
 * Then update CURRENT_PDF below: heading, headingAccent, lede, body,
 * downloadLabel, downloadName, pageTitle, description, keywords,
 * ctaKicker, ctaHeading, ctaBody, ctaPoints, and cacheBust (use YYYY-MM).
 */
export const FREE_PDF_PATH = "/free-guide";

export const CURRENT_PDF = {
  fileName: "current.pdf",
  publicDir: "public/downloads",
  cacheBust: "2026-09",
  downloadName: "AllOfTech-How-to-Choose-a-Tech-Agency.pdf",

  pageTitle: "How to Choose a Tech Agency | Free PDF | AllOfTech",
  description:
    "Free AllOfTech PDF on how to choose a tech agency. Download the briefing on requirements, proof, process, and value — no login.",
  keywords: [
    "how to choose a tech agency",
    "tech agency guide PDF",
    "hire a technology agency",
    "AllOfTech free PDF",
    "select a tech agency",
  ],

  badge: "Free PDF",
  heading: "How to choose a tech agency",
  headingAccent: "tech agency",
  lede: "A short briefing you can download and take into the next vendor call — including ours.",
  body: [
    "Hiring the wrong studio burns the brief, the budget, and a quarter. This PDF is a practical scorecard: what to lock before you talk to anyone, what proof to ask for, and which process signals separate a real team from a pitch.",
    "It walks through requirements, portfolio checks, technical fit, communication, pricing versus value, and the support you should expect after launch. Use it as a checklist on the next call.",
    "No account. No form. Open this page and download the file.",
  ],
  downloadLabel: "Download the agency selection PDF",
  fileNote: "PDF · one file · free",

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

export function pdfPublicPath() {
  return `/downloads/${CURRENT_PDF.fileName}`;
}

export function pdfDownloadHref() {
  return `${pdfPublicPath()}?v=${CURRENT_PDF.cacheBust}`;
}

export function freePdfSchemas() {
  const pageUrl = absoluteUrl(FREE_PDF_PATH);
  const fileUrl = `${SITE_URL}${pdfPublicPath()}`;

  return [
    webPageNode({
      path: FREE_PDF_PATH,
      name: CURRENT_PDF.heading,
      description: CURRENT_PDF.description,
    }),
    {
      "@context": "https://schema.org",
      "@type": "DigitalDocument",
      name: CURRENT_PDF.downloadName.replace(/\.pdf$/i, ""),
      description: CURRENT_PDF.description,
      encodingFormat: "application/pdf",
      url: fileUrl,
      isPartOf: { "@id": `${pageUrl}#webpage` },
    },
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Free guide", path: FREE_PDF_PATH },
    ]),
  ];
}
