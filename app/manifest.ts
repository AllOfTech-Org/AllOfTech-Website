import type { MetadataRoute } from "next";
import { HOME_DESCRIPTION } from "@/lib/home";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: HOME_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#050510",
    theme_color: "#050510",
    lang: "en",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/images/new-Logo_tab.png",
        sizes: "667x667",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/new-Logo.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      { name: "Services", short_name: "Services", url: "/services", description: SITE_TAGLINE },
      { name: "Contact", short_name: "Contact", url: "/contact" },
    ],
  };
}
