"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  HASH_TO_PATH,
  HOME_SHELL_PATHS,
  PRIMARY_NAV,
  SERVICE_ROUTES,
  isHomeShellPath,
  isPersistPath,
  normalizePath,
  pathForHash,
  sectionIdForPath,
} from "@/lib/home-sections";
import { FIRST_ENTER_MS, clearFirstEnter } from "@/lib/first-enter";
import { BOOK_A_CALL_URL, CONTACT_EMAIL, SITE_NAME, SOCIAL_PROFILES } from "@/lib/site";
import { Mail } from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa6";

const NAV_SOCIALS = [
  {
    href: SOCIAL_PROFILES.facebook,
    label: "AllOfTech on Facebook",
    Icon: FaFacebookF,
    external: true,
  },
  {
    href: SOCIAL_PROFILES.linkedin,
    label: "AllOfTech on LinkedIn",
    Icon: FaLinkedinIn,
    external: true,
  },
  {
    href: `mailto:${CONTACT_EMAIL}`,
    label: "Email AllOfTech",
    Icon: Mail,
    external: false,
  },
] as const;

function BrandLockup({
  className,
  priority = false,
}: {
  className: string;
  priority?: boolean;
}) {
  return (
    <Link href="/" className={className} aria-label={`${SITE_NAME} home`}>
      <span className="logo-wordmark-wrap">
        <img
          src="/images/new-Logo_tab.png"
          alt="AllOfTech"
          className="logo-wordmark"
          width={667}
          height={667}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          {...(!priority ? { loading: "lazy" as const } : {})}
        />
      </span>
    </Link>
  );
}

function instantScroll(id: string) {
  const section = id.replace(/^#/, "");
  if (!section || section === "top") {
    window.scrollTo(0, 0);
    return;
  }
  const el =
    document.getElementById(section) ||
    (section === "team" ? document.getElementById("aot-team-root") : null);
  el?.scrollIntoView({ block: "start" });
}

function rewriteSectionUrl(url: URL) {
  const mapped = pathForHash(url.hash);
  if (!mapped) return url;
  const next = new URL(mapped, url.origin);
  next.search = url.search;
  return next;
}

function stripHash() {
  if (!window.location.hash) return;
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}

export default function SiteChrome() {
  const pathname = usePathname();
  const router = useRouter();
  const path = normalizePath(pathname);
  const persist = isPersistPath(path);
  const homeShell = isHomeShellPath(path);
  const prevPath = useRef(path);
  const firstPaint = useRef(true);

  useLayoutEffect(() => {
    document.body.classList.toggle("aot-persistent-chrome", persist);
    if (!persist) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      document.body.classList.remove("aot-persistent-chrome");
      window.history.scrollRestoration = previous;
    };
  }, [persist]);

  useEffect(() => {
    const run = () => {
      router.prefetch("/case-studies");
      router.prefetch("/services");
      for (const route of HOME_SHELL_PATHS) router.prefetch(route);
      for (const route of SERVICE_ROUTES) router.prefetch(route);
    };
    if (typeof window.requestIdleCallback === "function") {
      const idle = window.requestIdleCallback(run, { timeout: 1600 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = window.setTimeout(run, 180);
    return () => window.clearTimeout(timer);
  }, [router]);

  useLayoutEffect(() => {
    const mapped = pathForHash(window.location.hash);
    if (!mapped) return;
    instantScroll(window.location.hash);
    if (normalizePath(window.location.pathname) !== mapped) {
      router.replace(mapped);
      return;
    }
    stripHash();
  }, [pathname, router]);

  useLayoutEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url: URL;
      try {
        url = rewriteSectionUrl(new URL(href, window.location.href));
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (/\.[a-z0-9]+$/i.test(url.pathname) && !url.pathname.endsWith(".html")) return;

      const nextPath = normalizePath(url.pathname);
      const currentPath = normalizePath(window.location.pathname);
      const nextHref = `${url.pathname}${url.search}${url.hash}`;
      const hashId = url.hash.replace(/^#/, "");
      const scrollId = hashId || sectionIdForPath(nextPath);
      const stayOnHome = isHomeShellPath(currentPath) && isHomeShellPath(nextPath);

      if (nextPath === currentPath || stayOnHome) {
        event.preventDefault();
        instantScroll(scrollId);
        if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextHref) {
          window.history.pushState(null, "", nextHref);
        }
        return;
      }

      event.preventDefault();
      const continuous = persist && isPersistPath(nextPath);
      try {
        const leftoverHash = url.hash.replace(/^#/, "");
        if (leftoverHash && !HASH_TO_PATH[leftoverHash]) {
          sessionStorage.setItem("aotHash", url.hash);
        } else {
          sessionStorage.removeItem("aotHash");
        }
      } catch {
        // Ignore storage failures.
      }
      router.push(nextHref, { scroll: !continuous });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [persist, router]);

  useLayoutEffect(() => {
    const previous = prevPath.current;
    prevPath.current = path;
    const stayOnHome = isHomeShellPath(previous) && homeShell;
    const html = document.documentElement;

    let settle = 0;
    if (html.classList.contains("aot-first-enter")) {
      if (firstPaint.current) {
        const reduce =
          html.classList.contains("aot-first-enter-reduce") ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        settle = window.setTimeout(clearFirstEnter, reduce ? 0 : FIRST_ENTER_MS);
      } else {
        clearFirstEnter();
      }
    }
    firstPaint.current = false;

    if (homeShell) {
      const mapped = pathForHash(window.location.hash);
      if (mapped && mapped !== path) {
        return () => window.clearTimeout(settle);
      }
      let hashId = window.location.hash.replace(/^#/, "");
      try {
        const stored = sessionStorage.getItem("aotHash");
        if (stored) {
          sessionStorage.removeItem("aotHash");
          hashId = stored.replace(/^#/, "");
        }
      } catch {
        // Ignore storage failures.
      }
      if (hashId !== "team") stripHash();
      if (hashId && document.getElementById(hashId)) {
        instantScroll(hashId);
      } else {
        instantScroll(sectionIdForPath(path));
      }
      if (!stayOnHome) window.dispatchEvent(new Event("aot:content-mounted"));
    } else if (persist) {
      let hash = window.location.hash;
      try {
        const stored = sessionStorage.getItem("aotHash");
        if (stored) {
          sessionStorage.removeItem("aotHash");
          hash = stored;
          if (window.location.hash !== stored) {
            history.replaceState(
              null,
              "",
              `${window.location.pathname}${window.location.search}${stored}`,
            );
          }
        }
      } catch {
        // Ignore storage failures.
      }
      if (hash) instantScroll(hash);
      else window.scrollTo(0, 0);
      window.dispatchEvent(new Event("aot:content-mounted"));
    }

    return () => window.clearTimeout(settle);
  }, [path, persist, homeShell]);

  return (
    <div data-aot-chrome="" style={{ display: "contents" }}>
      {persist ? (
        <>
          <div className="cyber-bg">
            <div className="cyber-gradient" />
            <div className="matrix-rain" id="matrixRain" />
          </div>
          <div className="particles" id="particlesContainer" />
          <div className="data-streams" id="dataStreams" />
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />
          <div className="grid-overlay">
            <div className="grid-lines" />
            <div className="grid-glow" />
          </div>
          <div className="scanlines" />
          <div className="noise-overlay" />
        </>
      ) : null}

      <nav className="aot-site-nav" aria-label="Primary">
        <div className="nav-container">
          <BrandLockup className="logo" priority />
          <ul className="nav-links">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <div className="nav-social" aria-label="Social links">
            {NAV_SOCIALS.map(({ href, label, Icon, external }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(external ? { target: "_blank", rel: "me noopener noreferrer" } : {})}
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="nav-bottom">
            <a href={BOOK_A_CALL_URL} target="_blank" rel="noopener" className="cyber-button">
              Book a call
            </a>
          </div>
          <button className="mobile-menu-button" id="mobileMenuBtn" type="button" aria-label="Toggle mobile menu" aria-expanded="false">
            <div className="hamburger">
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
      </nav>

      <div className="mobile-menu-overlay" id="mobileMenuOverlay" />
      <div className="mobile-menu" id="mobileMenu">
        <div className="mobile-menu-header">
          <BrandLockup className="mobile-menu-logo" />
          <button className="mobile-menu-close" id="mobileMenuClose" type="button" aria-label="Close mobile menu">
            ✕
          </button>
        </div>
        <div className="mobile-menu-cta">
          <a href={BOOK_A_CALL_URL} target="_blank" rel="noopener" className="cyber-button">
            Book a call
          </a>
        </div>
        <nav className="mobile-menu-nav">
          <ul>
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu-social" aria-label="Social links">
          {NAV_SOCIALS.map(({ href, label, Icon, external }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(external ? { target: "_blank", rel: "me noopener noreferrer" } : {})}
            >
              <Icon aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
