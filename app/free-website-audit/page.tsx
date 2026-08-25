import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PageScripts from "@/components/PageScripts";
import WebsiteAuditPage from "@/components/WebsiteAuditPage";
import { shareMetadata } from "@/lib/seo";
import {
  WEBSITE_AUDIT_DESCRIPTION,
  WEBSITE_AUDIT_KEYWORDS,
  WEBSITE_AUDIT_PATH,
  WEBSITE_AUDIT_TITLE,
  websiteAuditSchemas,
} from "@/lib/website-audit";

export const metadata: Metadata = shareMetadata({
  title: WEBSITE_AUDIT_TITLE,
  description: WEBSITE_AUDIT_DESCRIPTION,
  path: WEBSITE_AUDIT_PATH,
  keywords: WEBSITE_AUDIT_KEYWORDS,
});

export default function FreeWebsiteAuditRoute() {
  return (
    <>
      <JsonLd data={websiteAuditSchemas()} />
      <WebsiteAuditPage />
      <PageScripts scripts={["/js/user-tracking.js"]} />
    </>
  );
}
