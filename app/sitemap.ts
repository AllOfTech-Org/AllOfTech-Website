import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { sitemapImageUrls } from "@/lib/seo-media";
import { SERVICES } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

type PathEntry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const PAGE_ENTRIES: PathEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  ...SERVICES.map((service) => ({
    path: service.route,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  })),
  { path: "/packages", changeFrequency: "monthly", priority: 0.7 },
  { path: "/reviews", changeFrequency: "monthly", priority: 0.6 },
  { path: "/why-choose-us", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/free-website-audit", changeFrequency: "monthly", priority: 0.4 },
  { path: "/free-guide", changeFrequency: "monthly", priority: 0.5 },
  { path: "/free-pdf", changeFrequency: "monthly", priority: 0.5 },
  { path: "/case-studies", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blog/", changeFrequency: "weekly", priority: 0.6 },
  ...BLOG_POSTS.map((post) => ({
    path: post.route,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  })),
  { path: "/resources/", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGE_ENTRIES.map((entry) => ({
    url: entry.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${entry.path}`,
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    images: sitemapImageUrls(entry.path),
  }));
}
