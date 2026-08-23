import { SERVICES } from "@/lib/services";
import { absoluteAsset, SITE_URL } from "@/lib/site";

export type SeoVideo = {
  pagePath: string;
  contentPath: string;
  name: string;
  description: string;
  thumbnailPath: string;
};

export const SEO_VIDEOS: SeoVideo[] = [
  {
    pagePath: "/services/animation",
    contentPath: "/images/Service/Animation%204.mp4",
    name: "AllOfTech custom 3D animation",
    description:
      "Product and environment in 3D — scenes you can show, explain, and sell, kept in a professional register.",
    thumbnailPath: "/images/Service/Animation%201.webp",
  },
  {
    pagePath: "/services/animation",
    contentPath: "/images/Service/animation.mp4",
    name: "AllOfTech animation reel",
    description:
      "Studio reel of AllOfTech 3D product visualization and environment motion — a silent loop that shows how the work sells.",
    thumbnailPath: "/images/Service/Animation%20Banner%20.webp",
  },
  {
    pagePath: "/case-studies",
    contentPath: "/images/Service/animation.mp4",
    name: "AllOfTech 3D animation reel",
    description:
      "Cinematic 3D reel with lighting, camera, and environment that loops so the work sells without a pitch.",
    thumbnailPath: "/images/Service/Animation%20Banner%20.webp",
  },
];

const CASE_STUDY_IMAGES = [
  "/images/case-studie/Before.webp",
  "/images/case-studie/After.webp",
  "/images/case-studie/cs2-before.webp",
  "/images/case-studie/cs2-After.webp",
  "/images/case-studie/cs3.webp",
  "/images/case-studie/32.webp",
  "/images/case-studie/33.webp",
  "/images/case-studie/34.webp",
  "/images/case-studie/35.webp",
  "/images/case-studie/38.webp",
  "/images/case-studie/39.webp",
  "/images/case-studie/41.webp",
  "/images/case-studie/42.webp",
  "/images/case-studie/43.webp",
  "/images/case-studie/44.webp",
] as const;

function unique(paths: Array<string | undefined>) {
  return [...new Set(paths.filter((path): path is string => Boolean(path)))];
}

export function serviceImagePaths() {
  return unique(
    SERVICES.flatMap((service) => [
      service.listingImage,
      service.heroImage,
      ...service.gallery.map((slot) => slot.imageSrc),
      ...service.showcases.map((item) => item.imageSrc),
    ]),
  );
}

export function sitemapImagesForPath(path: string) {
  if (path === "/" || path === "/services") {
    return unique([
      "/images/new-Logo.png",
      ...SERVICES.map((service) => service.listingImage),
    ]);
  }

  if (path.startsWith("/services/")) {
    const service = SERVICES.find((entry) => entry.route === path);
    if (!service) return ["/images/new-Logo.png"];
    return unique([
      service.heroImage,
      service.listingImage,
      ...service.gallery.map((slot) => slot.imageSrc),
      ...service.showcases.map((item) => item.imageSrc),
    ]);
  }

  if (path === "/case-studies") {
    return unique(["/images/new-Logo.png", ...CASE_STUDY_IMAGES]);
  }

  return ["/images/new-Logo.png"];
}

export function sitemapImageUrls(path: string) {
  return sitemapImagesForPath(path).map((image) => absoluteAsset(image));
}

export function videoContentUrl(video: SeoVideo) {
  return `${SITE_URL}${video.contentPath}`;
}

export function videoThumbnailUrl(video: SeoVideo) {
  return absoluteAsset(video.thumbnailPath);
}
