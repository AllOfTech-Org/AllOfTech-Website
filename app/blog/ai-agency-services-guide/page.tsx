import type { Metadata } from "next";
import HtmlClone from "@/components/HtmlClone";
import JsonLd from "@/components/JsonLd";
import { getBlogPost } from "@/lib/blog";
import { blogPostMetadata, blogPostSchemas } from "@/lib/page-metadata";
import { PAGE_SCRIPTS } from "@/lib/scripts";
import markup from "./markup.html";

const post = getBlogPost("ai-agency-services-guide");

export const metadata: Metadata = blogPostMetadata(post);

export default function AiAgencyServicesGuidePage() {
  return (
    <>
      <JsonLd data={blogPostSchemas(post)} />
      <HtmlClone html={markup} scripts={PAGE_SCRIPTS} />
    </>
  );
}
