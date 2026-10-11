import type { Metadata } from "next";
import HtmlClone from "@/components/HtmlClone";
import JsonLd from "@/components/JsonLd";
import { TERMS_META } from "@/lib/legal";
import { termsSchemas } from "@/lib/page-metadata";
import { PAGE_SCRIPTS } from "@/lib/scripts";
import { shareMetadata } from "@/lib/seo";
import markup from "./markup.html";

export const metadata: Metadata = shareMetadata({
  title: TERMS_META.title,
  description: TERMS_META.description,
  path: TERMS_META.canonical,
});

export default function TermsPage() {
  return (
    <>
      <JsonLd data={termsSchemas()} />
      <HtmlClone html={markup} scripts={PAGE_SCRIPTS} />
    </>
  );
}
