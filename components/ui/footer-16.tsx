"use client";

import { motion, type Variants } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export interface Footer16Link {
  label: string;
  href: string;
}

export interface Footer16Column {
  title: string;
  links: Footer16Link[];
}

export interface Footer16Social {
  label: string;
  href: string;
  icon: "facebook" | "twitter" | "instagram" | "linkedin";
}

export interface Footer16Props {
  brandName?: string;
  tagline?: string;
  homeHref?: string;
  logoSrc?: string;
  cta?: Footer16Link;
  columns?: Footer16Column[];
  legalLinks?: Footer16Link[];
  socials?: Footer16Social[];
  copyright?: string;
  backgroundImage?: string;
}

const defaultColumns: Footer16Column[] = [
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
      { label: "contact@alloftech.site", href: "mailto:contact@alloftech.site" },
      { label: "Book a call", href: "https://calendar.app.google/39A1uSVFK96rUrUg9" },
      { label: "Blog", href: "/blog" },
      { label: "Resources", href: "/resources" },
    ],
  },
];

const defaultLegalLinks: Footer16Link[] = [
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

const defaultSocials: Footer16Social[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/AllOfTech.official",
    icon: "facebook",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/alloftech/",
    icon: "linkedin",
  },
];

const backgroundUrl = "/images/footer-16-bg.avif";

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const wordmarkVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 1.1, bounce: 0 },
  },
};

const panelRise: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.55, bounce: 0 },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
    },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 7 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.42, bounce: 0 },
  },
};

const socialIcons = {
  facebook: FaFacebookF,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
};

function externalProps(href: string) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return { target: "_blank" as const, rel: "noopener noreferrer" };
  }
  return {};
}

export function Footer16({
  brandName = "AllOfTech",
  tagline = "Building Digital Systems That Scale",
  homeHref = "/",
  logoSrc = "/images/new-Logo_tab.png",
  cta,
  columns = defaultColumns,
  legalLinks = defaultLegalLinks,
  socials = defaultSocials,
  copyright = "© 2026 AllOfTech. All rights reserved.",
  backgroundImage = backgroundUrl,
}: Footer16Props) {
  return (
    <footer className="aot-footer-16 relative w-full overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
      <div
        className="absolute inset-0 z-10 bg-cover bg-center sm:-translate-y-16"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,10,14,0.35)_0%,rgba(9,10,14,0.06)_42%,rgba(9,10,14,0.58)_68%,rgba(9,10,14,0.9)_100%)]"
        aria-hidden="true"
      />

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.22 }}
        className="relative mx-auto flex min-h-[620px] flex-col justify-end pt-16 sm:min-h-[680px] lg:min-h-[812px]"
      >
        <motion.div
          variants={wordmarkVariants}
          className="pointer-events-none absolute top-[43%] left-1/2 flex w-[118vw] -translate-x-1/2 justify-center overflow-hidden sm:top-[20%] lg:top-[12%]"
          aria-hidden="true"
        >
          <svg
            className="h-auto w-full select-none"
            viewBox={`0 0 ${Math.max(brandName.length * 90, 400)} 160`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="brandGrad16" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#52525b" />
                <stop offset="100%" stopColor="#18181b" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="50%"
              dominantBaseline="alphabetic"
              textAnchor="middle"
              textLength="80%"
              lengthAdjust="spacing"
              className="font-medium tracking-tight"
              fill="url(#brandGrad16)"
              fontSize="100"
              style={{
                fontFamily:
                  "var(--font-merriweather), Merriweather, Georgia, serif",
              }}
            >
              {brandName}
            </text>
          </svg>
        </motion.div>

        <div className="aot-footer-16__panel">
          <div className="aot-footer-16__inner">
            <motion.div variants={panelRise} className="aot-footer-16__intro">
              <div className="aot-footer-16__brand">
                <a
                  href={homeHref}
                  className="aot-footer-16__brand-link"
                  aria-label={`${brandName} home`}
                >
                  <img
                    src={logoSrc}
                    alt="AllOfTech"
                    className="aot-footer-16__logo"
                    width={32}
                    height={32}
                    decoding="async"
                  />
                  <span className="aot-footer-16__brand-name">{brandName}</span>
                </a>
                <p className="aot-footer-16__tagline">{tagline}</p>
              </div>
              {cta ? (
                <a
                  href={cta.href}
                  className="aot-footer-16__cta"
                  {...externalProps(cta.href)}
                >
                  {cta.label}
                </a>
              ) : null}
            </motion.div>

            <motion.div
              variants={sectionVariants}
              role="navigation"
              aria-label="Footer navigation"
              className="aot-footer-16__cols"
            >
              {columns.map((column) => (
                <motion.div
                  variants={panelRise}
                  className="aot-footer-16__col"
                  key={column.title}
                >
                  <h3 className="aot-footer-16__col-title">{column.title}</h3>
                  <motion.ul
                    variants={listVariants}
                    className="aot-footer-16__list"
                  >
                    {column.links.map((link) => (
                      <motion.li variants={linkVariants} key={link.label}>
                        <a
                          href={link.href}
                          className={
                            link.href.startsWith("mailto:")
                              ? "aot-footer-16__link aot-footer-16__link--email"
                              : "aot-footer-16__link"
                          }
                          {...externalProps(link.href)}
                        >
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={panelRise} className="aot-footer-16__bar">
              <p className="aot-footer-16__copy">{copyright}</p>

              <div className="aot-footer-16__meta">
                <ul className="aot-footer-16__legal">
                  {legalLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} {...externalProps(link.href)}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>

                <ul className="aot-footer-16__socials" aria-label="Social links">
                  {socials.map((social) => {
                    const Icon = socialIcons[social.icon];

                    return (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          aria-label={social.label}
                          className="aot-footer-16__social"
                          target="_blank"
                          rel="me noopener noreferrer"
                        >
                          <Icon />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
