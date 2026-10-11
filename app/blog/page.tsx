import type { Metadata } from "next";
import HtmlClone from "@/components/HtmlClone";
import JsonLd from "@/components/JsonLd";
import { BLOG_INDEX } from "@/lib/blog";
import { blogIndexSchemas } from "@/lib/page-metadata";
import { PAGE_SCRIPTS } from "@/lib/scripts";
import { shareMetadata } from "@/lib/seo";
import markup from "./markup.html";

export const metadata: Metadata = shareMetadata({
  title: BLOG_INDEX.title,
  description: BLOG_INDEX.description,
  path: BLOG_INDEX.canonical,
  keywords: BLOG_INDEX.keywords,
});

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={blogIndexSchemas()} />
      <HtmlClone html={markup} scripts={PAGE_SCRIPTS} />
    </>
  );
}
