import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { sitemapImageUrls } from "@/lib/seo-media";
import { SERVICES } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

type PathEntry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: string;
};

const PAGE_ENTRIES: PathEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1, lastModified: "2026-11-17" },
  ...SERVICES.map((service) => ({
    path: service.route,
    changeFrequency: "weekly" as const,
    priority: 0.9,
    lastModified: ["ai-development", "animation", "web-development"].includes(service.slug)
      ? "2026-11-17"
      : undefined,
  })),
  { path: "/free-sample-video", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-11-17" },
  { path: "/case-studies", changeFrequency: "weekly", priority: 0.8, lastModified: "2026-11-17" },
  { path: "/blog/", changeFrequency: "weekly", priority: 0.6 },
  ...BLOG_POSTS.map((post) => ({
    path: post.route,
    changeFrequency: "monthly" as const,
    priority: 0.55,
    lastModified: post.route === "/blog/ai-agency-services-guide" ? "2026-11-17" : undefined,
  })),
  { path: "/resources/", changeFrequency: "monthly", priority: 0.5, lastModified: "2026-11-17" },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_ENTRIES.map((entry) => ({
    url: entry.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${entry.path}`,
    lastModified: entry.lastModified ? new Date(`${entry.lastModified}T00:00:00.000Z`) : undefined,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    images: sitemapImageUrls(entry.path),
  }));
}
