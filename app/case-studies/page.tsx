import type { Metadata } from "next";
import HtmlClone from "@/components/HtmlClone";
import JsonLd from "@/components/JsonLd";
import {
  CASE_STUDIES_DESCRIPTION,
  CASE_STUDIES_KEYWORDS,
  CASE_STUDIES_OG_DESCRIPTION,
  CASE_STUDIES_TITLE,
} from "@/lib/case-studies";
import { caseStudiesSchemas } from "@/lib/page-metadata";
import { CASE_STUDY_SCRIPTS } from "@/lib/scripts";
import { shareMetadata } from "@/lib/seo";
import markup from "./markup.html";

export const metadata: Metadata = shareMetadata({
  title: CASE_STUDIES_TITLE,
  description: CASE_STUDIES_DESCRIPTION,
  path: "/case-studies",
  keywords: CASE_STUDIES_KEYWORDS,
  ogDescription: CASE_STUDIES_OG_DESCRIPTION,
  image: "/images/case-studie/After.webp",
  imageAlt: "PB(973) transformed website after AllOfTech rebuild",
});

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={caseStudiesSchemas()} />
      <HtmlClone html={markup} scripts={CASE_STUDY_SCRIPTS} />
    </>
  );
}
