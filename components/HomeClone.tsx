import ContactSection from "@/components/ContactSection";
import HomeServices from "@/components/HomeServices";
import PageScripts from "@/components/PageScripts";
import TeamMount from "@/components/TeamMount";
import { preparePageHtml } from "@/lib/page-html";
import { HOME_SCRIPTS } from "@/lib/scripts";
import markup from "@/app/markup.html";

const TEAM_MARKER = "<!-- AOT_TEAM_SECTION -->";
const TEAM_ROOT = `${TEAM_MARKER}\n        <div id="aot-team-root"></div>`;
const SERVICES_ROOT = '<div id="aot-services-root"></div>';
const CONTACT_ROOT = '<div id="aot-contact-root"></div>';

function replaceLegacyContact(html: string) {
  if (html.includes('id="aot-contact-root"')) return html;

  const marker = html.indexOf("<!-- Contact Section -->");
  const sectionMatch = html.search(/<section\b[^>]*\bid=["']contact["']/i);
  const from = marker >= 0 ? marker : sectionMatch;
  if (from < 0) return html;

  const open = html.indexOf("<section", from);
  if (open < 0) return html;

  let depth = 0;
  let index = open;
  while (index < html.length) {
    const nextOpen = html.indexOf("<section", index);
    const nextClose = html.indexOf("</section>", index);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      index = nextOpen + 8;
    } else {
      depth -= 1;
      index = nextClose + 10;
      if (depth === 0) {
        return `${html.slice(0, from)}${CONTACT_ROOT}${html.slice(index)}`;
      }
    }
  }

  return html;
}

export default function HomeClone() {
  let html = markup;
  if (!html.includes('id="aot-team-root"')) {
    html = html.replace(TEAM_MARKER, TEAM_ROOT);
  }
  html = replaceLegacyContact(html);

  const prepared = preparePageHtml(html);
  const splitAt = prepared.indexOf(SERVICES_ROOT);
  const before = splitAt >= 0 ? prepared.slice(0, splitAt) : prepared;
  const afterServices = splitAt >= 0 ? prepared.slice(splitAt + SERVICES_ROOT.length) : "";
  const contactAt = afterServices.indexOf(CONTACT_ROOT);
  const mid = contactAt >= 0 ? afterServices.slice(0, contactAt) : afterServices;
  const afterContact =
    contactAt >= 0 ? afterServices.slice(contactAt + CONTACT_ROOT.length) : "";

  return (
    <>
      <div className="aot-page-clone">
        <div className="aot-home-html" dangerouslySetInnerHTML={{ __html: before }} />
        <HomeServices />
        <div className="aot-home-html" dangerouslySetInnerHTML={{ __html: mid }} />
        <ContactSection />
        {afterContact ? (
          <div className="aot-home-html" dangerouslySetInnerHTML={{ __html: afterContact }} />
        ) : null}
      </div>
      <PageScripts scripts={HOME_SCRIPTS} />
      <TeamMount />
    </>
  );
}
