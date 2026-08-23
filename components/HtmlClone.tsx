import PageScripts from "@/components/PageScripts";
import { preparePageHtml } from "@/lib/page-html";

type HtmlCloneProps = {
  html: string;
  scripts: readonly string[];
};

export default function HtmlClone({ html, scripts }: HtmlCloneProps) {
  const markup = preparePageHtml(html);
  return (
    <>
      <div className="aot-page-clone" dangerouslySetInnerHTML={{ __html: markup }} />
      <PageScripts scripts={scripts} />
    </>
  );
}
