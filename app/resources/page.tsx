import type { Metadata } from "next";
import HtmlClone from "@/components/HtmlClone";
import JsonLd from "@/components/JsonLd";
import { resourcesSchemas } from "@/lib/page-metadata";
import { RESOURCES_META } from "@/lib/resources";
import { PAGE_SCRIPTS } from "@/lib/scripts";
import { shareMetadata } from "@/lib/seo";
import markup from "./markup.html";

export const metadata: Metadata = shareMetadata({
  title: RESOURCES_META.title,
  description: RESOURCES_META.description,
  path: RESOURCES_META.canonical,
  keywords: RESOURCES_META.keywords,
});

export default function ResourcesPage() {
  return (
    <>
      <JsonLd data={resourcesSchemas()} />
      <HtmlClone html={markup} scripts={PAGE_SCRIPTS} />
    </>
  );
}
