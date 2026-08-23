import type { Metadata } from "next";
import HomeClone from "@/components/HomeClone";
import JsonLd from "@/components/JsonLd";
import { HOME_DESCRIPTION, HOME_KEYWORDS, HOME_OG_DESCRIPTION, HOME_OG_TITLE, HOME_TITLE } from "@/lib/home";
import { homeSchemas } from "@/lib/page-metadata";
import { shareMetadata } from "@/lib/seo";

export const metadata: Metadata = shareMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  keywords: HOME_KEYWORDS,
  ogTitle: HOME_OG_TITLE,
  ogDescription: HOME_OG_DESCRIPTION,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeSchemas()} />
      <HomeClone />
    </>
  );
}
