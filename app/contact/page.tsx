import type { Metadata } from "next";
import HomeClone from "@/components/HomeClone";
import JsonLd from "@/components/JsonLd";
import { homeSectionMetadata } from "@/lib/home-sections";
import { contactSchemas } from "@/lib/page-metadata";

export const metadata: Metadata = homeSectionMetadata("/contact");

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactSchemas()} />
      <HomeClone />
    </>
  );
}
