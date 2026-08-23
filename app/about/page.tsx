import type { Metadata } from "next";
import HomeClone from "@/components/HomeClone";
import JsonLd from "@/components/JsonLd";
import { homeSectionMetadata } from "@/lib/home-sections";
import { aboutSchemas } from "@/lib/page-metadata";

export const metadata: Metadata = homeSectionMetadata("/about");

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutSchemas()} />
      <HomeClone />
    </>
  );
}
