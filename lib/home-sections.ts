import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export type HomeSectionPath =
  | "/"
  | "/about"
  | "/services"
  | "/packages"
  | "/reviews"
  | "/why-choose-us"
  | "/contact";

type HomeSection = {
  path: HomeSectionPath;
  sectionId: string;
  label: string;
};

export const PRIMARY_NAV = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Packages", href: "/packages" },
  { label: "Why Choose Us", href: "/why-choose-us" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Reviews", href: "/reviews" },
  { label: "Team", href: "/#team" },
  { label: "Contact", href: "/contact" },
] as const;

export const HOME_SECTIONS: readonly HomeSection[] = [
  { path: "/", sectionId: "top", label: "Home" },
  { path: "/about", sectionId: "about", label: "About" },
  { path: "/services", sectionId: "services", label: "Services" },
  { path: "/packages", sectionId: "packages", label: "Our Packages" },
  { path: "/why-choose-us", sectionId: "why-choose-us", label: "Why Choose Us" },
  { path: "/reviews", sectionId: "reviews", label: "Reviews" },
  { path: "/contact", sectionId: "contact", label: "Contact" },
] as const;

export const HOME_SHELL_PATHS = new Set<string>(HOME_SECTIONS.map((section) => section.path));

export const SERVICE_ROUTES = [
  "/services/ai-development",
  "/services/web-development",
  "/services/animation",
  "/services/branding",
  "/services/ux-ui-design",
  "/services/mobile-app-development",
] as const;

export const HASH_TO_PATH: Record<string, HomeSectionPath> = {
  top: "/",
  about: "/about",
  services: "/services",
  packages: "/packages",
  stats: "/why-choose-us",
  "why-choose-us": "/why-choose-us",
  reviews: "/reviews",
  contact: "/contact",
};

const PATH_TO_SECTION = Object.fromEntries(
  HOME_SECTIONS.map((section) => [section.path, section.sectionId]),
) as Record<HomeSectionPath, string>;

export function normalizePath(path: string) {
  const clean = path.replace(/\/+$/, "");
  return clean || "/";
}

export function isHomeShellPath(path: string) {
  return HOME_SHELL_PATHS.has(normalizePath(path));
}

export function isServicesPath(path: string) {
  const clean = normalizePath(path);
  return clean.startsWith("/services/");
}

export function isPersistPath(path: string) {
  const clean = normalizePath(path);
  return (
    isHomeShellPath(clean) ||
    clean === "/case-studies" ||
    clean === "/free-website-audit" ||
    clean === "/free-guide" ||
    clean === "/free-pdf" ||
    isServicesPath(clean)
  );
}

export function sectionIdForPath(path: string) {
  return PATH_TO_SECTION[normalizePath(path) as HomeSectionPath] ?? "";
}

export function scrollSectionIdForPath(path: string) {
  const clean = normalizePath(path);
  if (clean === "/case-studies") return "case-studies";
  return sectionIdForPath(clean);
}

export function pathForHash(hash: string) {
  const id = hash.replace(/^#/, "");
  return id ? HASH_TO_PATH[id] : undefined;
}

const SECTION_SEO: Record<
  Exclude<HomeSectionPath, "/">,
  { title: string; description: string; keywords: string[] }
> = {
  "/about": {
    title: "About AllOfTech | Tech & AI Agency in Dhaka",
    description:
      "AllOfTech is a technology and AI agency in Dhaka, Bangladesh. 27 projects delivered, 98% client satisfaction, and six service categories for US and global businesses.",
    keywords: [
      "about AllOfTech",
      "AllOfTech agency",
      "tech agency Dhaka",
      "AI agency Bangladesh",
      "technology agency about",
    ],
  },
  "/services": {
    title: "Services | AllOfTech",
    description:
      "AllOfTech builds AI, websites, animation, brand identity, UX/UI, and mobile apps. See what you get, then book a call.",
    keywords: [
      "AllOfTech services",
      "AI development agency",
      "web development agency",
      "animation studio",
      "branding agency",
      "UX UI design",
      "mobile app development",
    ],
  },
  "/packages": {
    title: "Our Packages | AI, Web, Mobile & Animation | AllOfTech",
    description:
      "AllOfTech service packages for AI & ML solutions, complete digital presence, web and mobile products, and animation. Book a call for a custom quote.",
    keywords: [
      "AllOfTech packages",
      "AI ML solutions package",
      "web and mobile package",
      "animation services package",
      "digital transformation package",
    ],
  },
  "/reviews": {
    title: "Client Reviews | 4.9 Average | AllOfTech",
    description:
      "Read published AllOfTech client reviews for web development, AI chatbots, and animation. 4.9 average from four verified client reviews.",
    keywords: [
      "AllOfTech reviews",
      "AllOfTech testimonials",
      "tech agency reviews",
      "AI agency reviews",
    ],
  },
  "/why-choose-us": {
    title: "Why Choose AllOfTech | 27 Projects, 95% On-Time",
    description:
      "Why businesses choose AllOfTech: 27 projects delivered, 9+ years combined experience, 50+ technologies mastered, and 95% on-time delivery.",
    keywords: [
      "why choose AllOfTech",
      "tech agency results",
      "on-time delivery agency",
      "AllOfTech experience",
    ],
  },
  "/contact": {
    title: "Contact AllOfTech | Book a Call | Dhaka, Bangladesh",
    description:
      "Contact AllOfTech in Dhaka, Bangladesh. Email contact@alloftech.site or book a call to discuss AI, web, mobile, branding, UX/UI, or animation.",
    keywords: [
      "contact AllOfTech",
      "AllOfTech Dhaka",
      "tech agency Bangladesh",
      "book a call AllOfTech",
      "AllOfTech email",
    ],
  },
};

export function homeSectionMetadata(path: Exclude<HomeSectionPath, "/">): Metadata {
  const seo = SECTION_SEO[path];
  const section = HOME_SECTIONS.find((item) => item.path === path);
  const title = seo?.title ?? `${section?.label ?? SITE_NAME} | ${SITE_NAME}`;
  return shareMetadata({
    title,
    description: seo?.description ?? "",
    path,
    keywords: seo?.keywords,
  });
}
