import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import MonthlyPdfPage from "@/components/MonthlyPdfPage";
import PageScripts from "@/components/PageScripts";
import {
  MONTHLY_PDF,
  MONTHLY_PDF_PATH,
  monthlyPdfSchemas,
} from "@/lib/monthly-pdf";
import { shareMetadata } from "@/lib/seo";

export const metadata: Metadata = shareMetadata({
  title: MONTHLY_PDF.pageTitle,
  description: MONTHLY_PDF.description,
  path: MONTHLY_PDF_PATH,
  keywords: [...MONTHLY_PDF.keywords],
});

export default function FreePdfRoute() {
  return (
    <>
      <JsonLd data={monthlyPdfSchemas()} />
      <MonthlyPdfPage />
      <PageScripts scripts={["/js/user-tracking.js"]} />
    </>
  );
}
