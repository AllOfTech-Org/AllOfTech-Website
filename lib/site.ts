export const SITE_URL = "https://www.alloftech.site";
export const SITE_NAME = "AllOfTech";
export const SITE_LEGAL_NAME = "AllOfTech";
export const SITE_TAGLINE = "Building Digital Systems That Scale";
export const SITE_LOCALE = "en_US";
export const SITE_LANGUAGE = "en";

export const CONTACT_EMAIL = "contact@alloftech.site";
export const BOOK_A_CALL_URL = "https://calendar.app.google/39A1uSVFK96rUrUg9";
export const WHATSAPP_NUMBER = "+8801867989210";
export const WHATSAPP_URL =
  "https://wa.me/8801867989210?text=Hi%20AllOfTech%2C%20I%27d%20like%20to%20discuss%20a%20project.";

export const COMPANY_REGISTRATION = "01301927872";
export const COMPANY_ADDRESS =
  "Road No-2, Adarsh Nagar, Middle Badda, West Lane of Abul Hotel, Dhaka, Bangladesh";

export const COMPANY_ADDRESS_PARTS = {
  streetAddress: "Road No-2, Adarsh Nagar, Middle Badda, West Lane of Abul Hotel",
  addressLocality: "Dhaka",
  addressRegion: "Dhaka",
  addressCountry: "BD",
  addressCountryName: "Bangladesh",
} as const;

export const LOGO_PATH = "/images/new-Logo.png";
export const LOGO_ICON_PATH = "/images/new-Logo_tab.png";
export const DEFAULT_OG_IMAGE_PATH = "/images/new-Logo.png";
export const DEFAULT_OG_IMAGE_ALT = "AllOfTech logo";

export const SOCIAL_PROFILES = {
  facebook: "https://www.facebook.com/AllOfTech.official",
  instagram: "https://www.instagram.com/alloftech.official/",
  threads: "https://www.threads.com/@alloftech.official",
  x: "https://x.com/alloftech_site",
  youtube: "https://www.youtube.com/@AllOfTechOfficial",
  linkedin: "https://www.linkedin.com/company/alloftech/",
  reddit: "https://www.reddit.com/user/Rare-Philosophy387/",
} as const;

export const SAME_AS = [
  SOCIAL_PROFILES.facebook,
  SOCIAL_PROFILES.instagram,
  SOCIAL_PROFILES.threads,
  SOCIAL_PROFILES.x,
  SOCIAL_PROFILES.youtube,
  SOCIAL_PROFILES.linkedin,
  SOCIAL_PROFILES.reddit,
] as const;

export const PUBLISHED_STATS = {
  projectsDelivered: 27,
  clientSatisfactionPercent: 98,
  onTimeDeliveryPercent: 95,
  combinedExperienceYears: "9+",
  technologiesMastered: "50+",
  teamMembers: "8+",
  serviceCategories: 6,
  ratingValue: "4.9",
  ratingBest: "5",
  reviewCount: 5,
} as const;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteAsset(path: string) {
  return absoluteUrl(path);
}
