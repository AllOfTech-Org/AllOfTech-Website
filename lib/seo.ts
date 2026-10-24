import type { Metadata } from "next";
import type { BlogPost } from "@/lib/blog";
import { PUBLISHED_FAQS } from "@/lib/published-faq";
import { PUBLISHED_REVIEWS } from "@/lib/published-reviews";
import { SEO_VIDEOS, videoContentUrl, videoThumbnailUrl } from "@/lib/seo-media";
import type { ServicePageContent } from "@/lib/services";
import { SERVICES } from "@/lib/services";
import {
  absoluteAsset,
  absoluteUrl,
  BOOK_A_CALL_URL,
  COMPANY_ADDRESS,
  COMPANY_ADDRESS_PARTS,
  COMPANY_REGISTRATION,
  CONTACT_EMAIL,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  LOGO_PATH,
  PUBLISHED_STATS,
  SAME_AS,
  SITE_LANGUAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
} from "@/lib/site";
import { TEAM_LEADERSHIP } from "@/lib/team";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;

type ShareMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  ogTitle?: string;
  ogDescription?: string;
};

export function organizationRef() {
  return { "@id": ORGANIZATION_ID };
}

export function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: COMPANY_ADDRESS_PARTS.streetAddress,
    addressLocality: COMPANY_ADDRESS_PARTS.addressLocality,
    addressRegion: COMPANY_ADDRESS_PARTS.addressRegion,
    addressCountry: COMPANY_ADDRESS_PARTS.addressCountryName,
  };
}

export function logoImage() {
  return {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: absoluteAsset(LOGO_PATH),
    contentUrl: absoluteAsset(LOGO_PATH),
    caption: SITE_NAME,
  };
}

export function founderPersons() {
  return TEAM_LEADERSHIP.map((member) => ({
    "@type": "Person",
    "@id": `${SITE_URL}/#${member.id}`,
    name: member.name,
    jobTitle: member.role,
    image: absoluteAsset(member.image),
    email: member.email,
    worksFor: organizationRef(),
    sameAs: member.socials?.map((social) => social.url) ?? [],
    knowsAbout: member.signals,
  }));
}

export function aggregateRating() {
  return {
    "@type": "AggregateRating",
    ratingValue: PUBLISHED_STATS.ratingValue,
    bestRating: PUBLISHED_STATS.ratingBest,
    ratingCount: PUBLISHED_STATS.reviewCount,
    reviewCount: PUBLISHED_STATS.reviewCount,
  };
}

export function reviewNodes() {
  return PUBLISHED_REVIEWS.map((review) => ({
    "@type": "Review",
    author: { "@type": "Person", name: review.author },
    reviewBody: review.body,
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
    },
    itemReviewed: organizationRef(),
    name: `${review.client} · ${review.service}`,
  }));
}

export function organizationNode() {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: SITE_NAME,
    alternateName: "AllOfTech Agency",
    url: `${SITE_URL}/`,
    logo: logoImage(),
    image: absoluteAsset(LOGO_PATH),
    description: `${SITE_NAME} is a tech and AI agency delivering AI/ML systems, web platforms, mobile apps, UX/UI design, branding, and animation. ${SITE_TAGLINE}.`,
    email: CONTACT_EMAIL,
    telephone: WHATSAPP_NUMBER,
    identifier: COMPANY_REGISTRATION,
    slogan: SITE_TAGLINE,
    foundingLocation: {
      "@type": "Place",
      name: `${COMPANY_ADDRESS_PARTS.addressLocality}, ${COMPANY_ADDRESS_PARTS.addressCountryName}`,
      address: postalAddress(),
    },
    address: postalAddress(),
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Bangladesh" },
      "Worldwide",
    ],
    knowsAbout: [
      "AI/ML development",
      "Web development",
      "Mobile app development",
      "UX/UI design",
      "Graphics and branding",
      "3D animation",
      "Digital transformation",
    ],
    sameAs: [...SAME_AS],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: CONTACT_EMAIL,
        telephone: WHATSAPP_NUMBER,
        contactType: "customer service",
        availableLanguage: ["English"],
        url: `${SITE_URL}/contact`,
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        url: BOOK_A_CALL_URL,
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: WHATSAPP_URL,
        telephone: WHATSAPP_NUMBER,
        availableLanguage: ["English"],
      },
    ],
    founder: founderPersons(),
    employee: founderPersons(),
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 8,
    },
    aggregateRating: aggregateRating(),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${SITE_NAME} services`,
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": `${absoluteUrl(service.route)}#service`,
          name: service.schema.name,
          url: absoluteUrl(service.route),
        },
      })),
    },
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: "AllOfTech Agency",
    description: SITE_TAGLINE,
    inLanguage: SITE_LANGUAGE,
    publisher: organizationRef(),
  };
}

export function localBusinessNode() {
  return {
    "@type": "ProfessionalService",
    "@id": LOCAL_BUSINESS_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    image: absoluteAsset(LOGO_PATH),
    logo: absoluteAsset(LOGO_PATH),
    email: CONTACT_EMAIL,
    telephone: WHATSAPP_NUMBER,
    address: postalAddress(),
    areaServed: [
      { "@type": "City", name: "Dhaka" },
      { "@type": "Country", name: "Bangladesh" },
      { "@type": "Country", name: "United States" },
      "Worldwide",
    ],
    parentOrganization: organizationRef(),
    sameAs: [...SAME_AS],
    aggregateRating: aggregateRating(),
  };
}

export function breadcrumbList(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageNode(url = `${SITE_URL}/`) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url,
    mainEntity: PUBLISHED_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function videoObjectNode(video: (typeof SEO_VIDEOS)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    contentUrl: videoContentUrl(video),
    thumbnailUrl: videoThumbnailUrl(video),
    publisher: organizationRef(),
    inLanguage: SITE_LANGUAGE,
  };
}

export function videosForPath(path: string) {
  return SEO_VIDEOS.filter((video) => video.pagePath === path).map(videoObjectNode);
}

export function webPageNode(input: {
  path: string;
  name: string;
  description: string;
  type?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebPage",
    "@id": `${absoluteUrl(input.path)}#webpage`,
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: organizationRef(),
    publisher: organizationRef(),
    inLanguage: SITE_LANGUAGE,
  };
}

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), websiteNode(), localBusinessNode(), logoImage()],
  };
}

export function shareMetadata({
  title,
  description,
  path,
  keywords,
  image = DEFAULT_OG_IMAGE_PATH,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  type = "website",
  publishedTime,
  modifiedTime,
  ogTitle,
  ogDescription,
}: ShareMetaInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteAsset(image);
  const socialTitle = ogTitle ?? title;
  const socialDescription = ogDescription ?? description;

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: path },
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: socialTitle,
      description: socialDescription,
      locale: SITE_LOCALE,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function serviceOfferCatalog(service: ServicePageContent) {
  return {
    "@type": "OfferCatalog",
    name: `${service.shortName} capabilities`,
    itemListElement: service.features.map((feature, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: feature.title,
        description: feature.body,
      },
    })),
  };
}

export function articleNode(post: BlogPost & { datePublished?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: absoluteUrl(post.route),
    mainEntityOfPage: absoluteUrl(post.route),
    author: organizationRef(),
    publisher: organizationRef(),
    inLanguage: SITE_LANGUAGE,
    ...(post.datePublished ? { datePublished: post.datePublished } : {}),
  };
}

export const CASE_STUDY_WORKS = [
  {
    name: "PB(973) — Play The Code",
    description: "Website transformation for PB(973) in Flanders, NJ.",
    url: `${SITE_URL}/case-studies#case-study-1`,
    image: absoluteAsset("/images/case-studie/After.webp"),
  },
  {
    name: "Studio reel — motion with a job",
    description: "3D product visualization and environment motion reel.",
    url: `${SITE_URL}/case-studies#case-study-2`,
    image: absoluteAsset("/images/Service/Animation%20Banner%20.webp"),
  },
  {
    name: "Your Brand — Built for Growth",
    description: "Growth website and brand presence built by AllOfTech.",
    url: `${SITE_URL}/case-studies#case-study-3`,
    image: absoluteAsset("/images/case-studie/cs2-After.webp"),
  },
  {
    name: "Mashover — AI customer service",
    description: "AI-powered customer service chatbot for Mashover.",
    url: `${SITE_URL}/case-studies#case-study-4`,
    image: absoluteAsset("/images/case-studie/cs3.webp"),
  },
  {
    name: "Brand identity — graphic design",
    description: "Graphic design and brand identity work from AllOfTech.",
    url: `${SITE_URL}/case-studies#case-study-5`,
    image: absoluteAsset("/images/case-studie/34.webp"),
  },
] as const;

export function caseStudiesCollection() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AllOfTech case studies",
    url: absoluteUrl("/case-studies"),
    about: organizationRef(),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: CASE_STUDY_WORKS.length,
      itemListElement: CASE_STUDY_WORKS.map((work, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: work.name,
          description: work.description,
          url: work.url,
          image: work.image,
          creator: organizationRef(),
        },
      })),
    },
  };
}

export { COMPANY_ADDRESS, WHATSAPP_NUMBER };
