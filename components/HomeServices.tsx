"use client";

import Link from "next/link";
import {
  Brain,
  Clapperboard,
  Globe,
  LayoutTemplate,
  Palette,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import Blog4, { type Blog4Data, type Blog5Article } from "@/components/ui/blog-4";
import { SERVICES, type ServiceIconName } from "@/lib/services";

const ICONS: Record<ServiceIconName, LucideIcon> = {
  brain: Brain,
  globe: Globe,
  clapperboard: Clapperboard,
  palette: Palette,
  layout: LayoutTemplate,
  smartphone: Smartphone,
  sparkles: Sparkles,
};

const BLOG_ACCENTS = ["violet", "green", "blue"] as const;

export default function HomeServices() {
  const articles: Blog5Article[] = SERVICES.map((service, index) => ({
    category: service.eyebrow,
    readTime: service.listingMeta,
    title: service.listingTitle,
    excerpt: service.cardSummary,
    href: service.route,
    accent: BLOG_ACCENTS[index % BLOG_ACCENTS.length],
    imageSrc: service.listingImage,
    imageAlt: service.listingImageAlt,
    comingSoon: !service.listingImage,
    comingSoonLabel: "Coming soon",
    icon: ICONS[service.icon],
    ctaLabel: "View service",
  }));

  const data: Blog4Data = {
    badge: "SERVICES",
    heading: "Complete technology\nsolutions",
    headingId: "services-heading",
    description:
      "As a leading technology agency, we specialize in AI & Machine Learning Development, Web Development, Animation Services, Graphics & Branding, UX/UI Design, and Mobile App Development. Open a card for the full brief.",
    aside: "Pictures, the complete write-up, and a path to start - one service at a time.",
    viewAllLabel: "All services",
    viewAllHref: "/services",
    showViewAll: false,
    ctaLabel: "View service",
    articles,
  };

  return (
    <div className="aot-home-services fade-up section-major dark">
      <Blog4
        id="services"
        data={data}
        className="aot-home-services__blog"
        renderViewAllLink={({ href, children }) => <Link href={href}>{children}</Link>}
        renderArticleLink={({ href, children }) => (
          <Link
            href={href}
            className="focus-visible:ring-ring block h-full rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {children}
          </Link>
        )}
      />
    </div>
  );
}
