import type { Metadata } from "next";
import HomeClone from "@/components/HomeClone";
import JsonLd from "@/components/JsonLd";
import { homeSectionMetadata } from "@/lib/home-sections";
import { reviewsSchemas } from "@/lib/page-metadata";

export const metadata: Metadata = homeSectionMetadata("/reviews");

export default function ReviewsPage() {
  return (
    <>
      <JsonLd data={reviewsSchemas()} />
      <HomeClone />
    </>
  );
}
