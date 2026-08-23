import type { Metadata } from "next";
import HomeClone from "@/components/HomeClone";
import JsonLd from "@/components/JsonLd";
import { homeSectionMetadata } from "@/lib/home-sections";
import { packagesSchemas } from "@/lib/page-metadata";

export const metadata: Metadata = homeSectionMetadata("/packages");

export default function PackagesPage() {
  return (
    <>
      <JsonLd data={packagesSchemas()} />
      <HomeClone />
    </>
  );
}
