import type { Metadata } from "next";
import type { BlogPost } from "@/lib/blog";
import type { ServicePageContent } from "@/lib/services";
import { SERVICES, SERVICES_INDEX } from "@/lib/services";
import {
  articleNode,
  breadcrumbList,
  caseStudiesCollection,
  faqPageNode,
  organizationRef,
  reviewNodes,
  serviceOfferCatalog,
  shareMetadata,
  videosForPath,
  webPageNode,
} from "@/lib/seo";
import { absoluteUrl, CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export function servicesIndexMetadata(): Metadata {
  return shareMetadata({
    title: SERVICES_INDEX.title,
    description: SERVICES_INDEX.description,
    path: "/services",
    keywords: [...SERVICES_INDEX.keywords],
    image: SERVICES[0]?.listingImage,
    imageAlt: SERVICES[0]?.listingImageAlt,
    ogDescription: SERVICES_INDEX.openGraphDescription,
  });
}

export function servicesIndexSchemas() {
  return [
    webPageNode({
      path: "/services",
      name: SERVICES_INDEX.title,
      description: SERVICES_INDEX.description,
      type: "CollectionPage",
    }),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "AllOfTech services",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: SERVICES.length,
      itemListElement: SERVICES.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.shortName,
        url: absoluteUrl(service.route),
        image: service.listingImage ? absoluteUrl(service.listingImage) : undefined,
      })),
    },
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]),
  ];
}

export function serviceMetadata(service: ServicePageContent): Metadata {
  return shareMetadata({
    title: service.title,
    description: service.description,
    path: service.route,
    keywords: service.keywords,
    image: service.heroImage ?? service.listingImage,
    imageAlt: service.heroImageAlt ?? service.listingImageAlt,
    ogTitle: service.openGraphTitle,
    ogDescription: service.openGraphDescription,
  });
}

export function blogPostMetadata(post: BlogPost): Metadata {
  return shareMetadata({
    title: post.title,
    description: post.description,
    path: post.route,
    keywords: post.keywords,
    type: "article",
    publishedTime: post.datePublished,
  });
}

export function serviceSchemas(service: ServicePageContent) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${absoluteUrl(service.route)}#service`,
      serviceType: service.schema.serviceType,
      name: service.schema.name,
      description: service.schema.description,
      url: absoluteUrl(service.route),
      image: service.heroImage
        ? absoluteUrl(service.heroImage)
        : service.listingImage
          ? absoluteUrl(service.listingImage)
          : undefined,
      areaServed: [
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "Bangladesh" },
        "Worldwide",
      ],
      provider: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/images/new-Logo.png`,
        email: CONTACT_EMAIL,
      },
      hasOfferCatalog: serviceOfferCatalog(service),
      mainEntityOfPage: `${absoluteUrl(service.route)}#webpage`,
    },
    webPageNode({
      path: service.route,
      name: service.title,
      description: service.description,
    }),
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.shortName, path: service.route },
    ]),
    ...videosForPath(service.route),
  ];
}

export function homeSchemas() {
  return [
    webPageNode({
      path: "/",
      name: "AllOfTech home",
      description:
        "AllOfTech is a tech and AI agency delivering AI/ML, web development, mobile apps, UX/UI, branding, and animation.",
    }),
    faqPageNode(`${SITE_URL}/`),
    breadcrumbList([{ name: "Home", path: "/" }]),
  ];
}

export function aboutSchemas() {
  return [
    webPageNode({
      path: "/about",
      name: "About AllOfTech",
      description:
        "AllOfTech is a technology agency dedicated to delivering AI, web, mobile, design, branding, and animation solutions.",
      type: "AboutPage",
    }),
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
  ];
}

export function contactSchemas() {
  return [
    webPageNode({
      path: "/contact",
      name: "Contact AllOfTech",
      description:
        "Contact AllOfTech in Dhaka, Bangladesh for a free consultation on AI, web, mobile, branding, UX/UI, or animation.",
      type: "ContactPage",
    }),
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  ];
}

export function reviewsSchemas() {
  return [
    webPageNode({
      path: "/reviews",
      name: "AllOfTech client reviews",
      description: "Published client reviews of AllOfTech web, AI, and animation work.",
    }),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "AllOfTech client reviews",
      itemListElement: reviewNodes().map((review, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: review,
      })),
    },
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Reviews", path: "/reviews" },
    ]),
  ];
}

export function packagesSchemas() {
  return [
    webPageNode({
      path: "/packages",
      name: "AllOfTech packages",
      description:
        "AllOfTech service packages for AI & ML, complete digital presence, web and mobile, and animation.",
      type: "CollectionPage",
    }),
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Our Packages", path: "/packages" },
    ]),
  ];
}

export function whyChooseUsSchemas() {
  return [
    webPageNode({
      path: "/why-choose-us",
      name: "Why choose AllOfTech",
      description:
        "Why clients choose AllOfTech: 27 projects delivered, 9+ years combined experience, 50+ technologies, and 95% on-time delivery.",
    }),
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Why Choose Us", path: "/why-choose-us" },
    ]),
  ];
}

export function blogIndexSchemas() {
  return [
    webPageNode({
      path: "/blog/",
      name: "AllOfTech blog",
      description: "Technology insights from AllOfTech on AI, web development, and digital transformation.",
      type: "Blog",
    }),
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog/" },
    ]),
  ];
}

export function blogPostSchemas(post: BlogPost) {
  return [
    articleNode(post),
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog/" },
      { name: post.title, path: post.route },
    ]),
  ];
}

export function caseStudiesSchemas() {
  return [
    caseStudiesCollection(),
    ...videosForPath("/case-studies"),
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Case Studies", path: "/case-studies" },
    ]),
  ];
}

export function resourcesSchemas() {
  return [
    webPageNode({
      path: "/resources/",
      name: "AllOfTech resources",
      description: "Free technology resources and guides from AllOfTech.",
      type: "CollectionPage",
    }),
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Resources", path: "/resources/" },
    ]),
  ];
}

export function termsSchemas() {
  return [
    webPageNode({
      path: "/terms-and-conditions",
      name: "AllOfTech terms and conditions",
      description: "AllOfTech Terms & Conditions, Privacy Policy, Refund Policy, Support Policy, and Service Level Agreement.",
    }),
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Terms & Conditions", path: "/terms-and-conditions" },
    ]),
  ];
}

export { organizationRef };
