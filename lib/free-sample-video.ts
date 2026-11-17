import { breadcrumbList, webPageNode } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const FREE_SAMPLE_VIDEO_PATH = "/free-sample-video";
export const FREE_SAMPLE_VIDEO_TITLE = "Get a Free 3D Product Animation Sample | AllOfTech";
export const FREE_SAMPLE_VIDEO_DESCRIPTION =
  "Share one product page and request a free tailored concept sample from AllOfTech's 3D product-animation team.";
export const FREE_SAMPLE_VIDEO_KEYWORDS = [
  "free 3D product animation sample",
  "3D product animation concept",
  "product visualization sample",
  "CGI product video sample",
  "product animation studio",
];

export const SAMPLE_PLATFORMS = [
  { value: "shopify", label: "Shopify store" },
  { value: "amazon", label: "Amazon listing" },
  { value: "website", label: "Brand website" },
  { value: "other", label: "Another sales channel" },
] as const;

export const SAMPLE_DELIVERABLES = [
  {
    title: "A product-first concept",
    body: "We study the public listing and choose one feature, material, or use case that motion can make clearer.",
  },
  {
    title: "A tailored sample direction",
    body: "The sample is shaped around your product and channel, not pulled from a stock template.",
  },
  {
    title: "A practical production recommendation",
    body: "You get the recommended format, length, and next production step in plain English.",
  },
] as const;

export const SAMPLE_STEPS = [
  { n: "01", title: "Share one product page", body: "Send a public Amazon, Shopify, or brand-page URL and tell us what buyers should notice." },
  { n: "02", title: "We check the fit", body: "We review the product, available assets, and the channel where the video will be used." },
  { n: "03", title: "We send the sample direction", body: "If the product is a fit, our animation team prepares a short tailored concept sample and recommended next step." },
] as const;

export const SAMPLE_FAQS = [
  {
    question: "Is the sample a finished commercial?",
    answer: "No. It is a short concept sample that shows the creative direction. A finished listing video is scoped separately in USD.",
  },
  {
    question: "What products are the best fit?",
    answer: "Physical products with materials, movement, assembly, internal details, or features that benefit from a visual explanation are usually the best fit.",
  },
  {
    question: "What do you need from me?",
    answer: "A public product URL, a work email, and one sentence about what buyers should understand. We will ask before using any private files.",
  },
] as const;

export function freeSampleVideoSchemas() {
  return [
    webPageNode({
      path: FREE_SAMPLE_VIDEO_PATH,
      name: "Get a free 3D product animation sample",
      description: FREE_SAMPLE_VIDEO_DESCRIPTION,
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: `${SITE_URL}${FREE_SAMPLE_VIDEO_PATH}`,
      mainEntity: SAMPLE_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Free 3D Product Animation Sample", path: FREE_SAMPLE_VIDEO_PATH },
    ]),
  ];
}
