import { Footer } from "@/components/ui/footer";
import {
  BOOK_A_CALL_URL,
  CONTACT_EMAIL,
  SITE_NAME,
  SITE_TAGLINE,
  SOCIAL_PROFILES,
} from "@/lib/site";

export default function SiteFooter() {
  return (
    <Footer
      brandName={SITE_NAME}
      tagline={SITE_TAGLINE}
      homeHref="/"
      logoSrc="/images/new-Logo_tab.png"
      cta={{ label: "Book a call", href: BOOK_A_CALL_URL }}
      columns={[
        {
          title: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Services", href: "/services" },
            { label: "Our Packages", href: "/packages" },
            { label: "Why Choose Us", href: "/why-choose-us" },
            { label: "Case Studies", href: "/case-studies" },
            { label: "Reviews", href: "/reviews" },
            { label: "Team", href: "/#team" },
            { label: "Contact", href: "/contact" },
          ],
        },
        {
          title: "Services",
          links: [
            { label: "AI Development", href: "/services/ai-development" },
            { label: "Web Development", href: "/services/web-development" },
            { label: "Animation", href: "/services/animation" },
            { label: "Branding", href: "/services/branding" },
            { label: "UX/UI Design", href: "/services/ux-ui-design" },
            { label: "Mobile Apps", href: "/services/mobile-app-development" },
          ],
        },
        {
          title: "Connect",
          links: [
            { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
            { label: "Book a call", href: BOOK_A_CALL_URL },
            { label: "Blog", href: "/blog" },
            { label: "Resources", href: "/resources" },
            { label: "Free guide", href: "/free-guide" },
          ],
        },
      ]}
      legalLinks={[{ label: "Terms & Conditions", href: "/terms-and-conditions" }]}
      socials={[
        {
          label: "Facebook",
          href: SOCIAL_PROFILES.facebook,
          icon: "facebook",
        },
        {
          label: "LinkedIn",
          href: SOCIAL_PROFILES.linkedin,
          icon: "linkedin",
        },
      ]}
      copyright={`© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`}
      backgroundImage="/images/footer-bg.avif"
    />
  );
}
