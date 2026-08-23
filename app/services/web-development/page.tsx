import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ServicePage from "@/components/services/ServicePage";
import { serviceMetadata, serviceSchemas } from "@/lib/page-metadata";
import { getService } from "@/lib/services";

const service = getService("web-development");

export const metadata: Metadata = serviceMetadata(service);

export default function WebDevelopmentPage() {
  return (
    <>
      <JsonLd data={serviceSchemas(service)} />
      <ServicePage service={service} />
    </>
  );
}
