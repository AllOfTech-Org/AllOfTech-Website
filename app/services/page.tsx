import type { Metadata } from "next";
import HomeClone from "@/components/HomeClone";
import JsonLd from "@/components/JsonLd";
import { servicesIndexMetadata, servicesIndexSchemas } from "@/lib/page-metadata";

export const metadata: Metadata = servicesIndexMetadata();

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesIndexSchemas()} />
      <HomeClone />
    </>
  );
}
