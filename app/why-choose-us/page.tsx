import type { Metadata } from "next";
import HomeClone from "@/components/HomeClone";
import JsonLd from "@/components/JsonLd";
import { homeSectionMetadata } from "@/lib/home-sections";
import { whyChooseUsSchemas } from "@/lib/page-metadata";

export const metadata: Metadata = homeSectionMetadata("/why-choose-us");

export default function WhyChooseUsPage() {
  return (
    <>
      <JsonLd data={whyChooseUsSchemas()} />
      <HomeClone />
    </>
  );
}
