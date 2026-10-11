import type { ReactNode } from "react";
import PageScripts from "@/components/PageScripts";
import { PAGE_SCRIPTS } from "@/lib/scripts";

export default function ServicesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <PageScripts scripts={PAGE_SCRIPTS} />
    </>
  );
}
