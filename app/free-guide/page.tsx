import type { Metadata } from "next";
import FreePdfPage from "@/components/FreePdfPage";
import JsonLd from "@/components/JsonLd";
import PageScripts from "@/components/PageScripts";
import {
  CURRENT_PDF,
  FREE_PDF_PATH,
  freePdfSchemas,
} from "@/lib/free-pdf";
import { shareMetadata } from "@/lib/seo";

export const metadata: Metadata = shareMetadata({
  title: CURRENT_PDF.pageTitle,
  description: CURRENT_PDF.description,
  path: FREE_PDF_PATH,
  keywords: [...CURRENT_PDF.keywords],
});

export default function FreeGuidePage() {
  return (
    <>
      <JsonLd data={freePdfSchemas()} />
      <FreePdfPage />
      <PageScripts scripts={[]} />
    </>
  );
}
