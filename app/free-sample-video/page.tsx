import type { Metadata } from "next";
import FreeSampleVideoPage from "@/components/FreeSampleVideoPage";
import JsonLd from "@/components/JsonLd";
import PageScripts from "@/components/PageScripts";
import {
  FREE_SAMPLE_VIDEO_DESCRIPTION,
  FREE_SAMPLE_VIDEO_KEYWORDS,
  FREE_SAMPLE_VIDEO_PATH,
  FREE_SAMPLE_VIDEO_TITLE,
  freeSampleVideoSchemas,
} from "@/lib/free-sample-video";
import { shareMetadata } from "@/lib/seo";

export const metadata: Metadata = shareMetadata({
  title: FREE_SAMPLE_VIDEO_TITLE,
  description: FREE_SAMPLE_VIDEO_DESCRIPTION,
  path: FREE_SAMPLE_VIDEO_PATH,
  keywords: FREE_SAMPLE_VIDEO_KEYWORDS,
});

export default function FreeSampleVideoRoute() {
  return (
    <>
      <JsonLd data={freeSampleVideoSchemas()} />
      <FreeSampleVideoPage />
      <PageScripts scripts={["/js/user-tracking.js"]} />
    </>
  );
}
