"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { isHomeShellPath, normalizePath, pathForHash, scrollSectionIdForPath } from "@/lib/home-sections";

function hrefUrl(href: string) {
  try {
    return new URL(href, window.location.origin);
  } catch {
    return null;
  }
}

function desktopList() {
  return document.querySelector("nav .nav-container > .nav-links") as HTMLElement | null;
}

function navAnchors(root: ParentNode | Document = document) {
  return [
    ...root.querySelectorAll<HTMLAnchorElement>(
      "nav .nav-container > .nav-links > li > a, .mobile-menu-nav a",
    ),
  ];
}

function sectionId(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href) return "";
  const url = hrefUrl(href);
  if (!url || url.origin !== window.location.origin) return "";
  const fromPath = scrollSectionIdForPath(url.pathname);
  if (fromPath && fromPath !== "top") return fromPath;
  const fromHash = url.hash.replace(/^#/, "");
  if (fromHash && pathForHash(fromHash)) {
    const mappedSection = scrollSectionIdForPath(pathForHash(fromHash) || "");
    return mappedSection && mappedSection !== "top" ? mappedSection : fromHash;
  }
  return fromHash;
}

function destinationsMatch(a: HTMLAnchorElement, b: HTMLAnchorElement) {
  const hrefA = a.getAttribute("href");
  const hrefB = b.getAttribute("href");
  if (!hrefA || !hrefB) return false;
  const urlA = hrefUrl(hrefA);
  const urlB = hrefUrl(hrefB);
  if (!urlA || !urlB) return hrefA === hrefB;
  const pathA = pathForHash(urlA.hash) || normalizePath(urlA.pathname);
  const pathB = pathForHash(urlB.hash) || normalizePath(urlB.pathname);
  return pathA === pathB;
}

function scoreLink(anchor: HTMLAnchorElement, path: string) {
  const href = anchor.getAttribute("href");
  if (!href || href === "#" || href.startsWith("mailto:") || href.startsWith("tel:")) return 0;
  const url = hrefUrl(href);
  if (!url || url.origin !== window.location.origin) return 0;

  const urlPath = pathForHash(url.hash) || normalizePath(url.pathname);

  if (urlPath !== "/" && path === urlPath) return 100;
  if (urlPath === "/services" && path.startsWith("/services/")) return 90;
  return 0;
}

type SectionMark = { id: string; top: number; anchor: HTMLAnchorElement };

function collectSectionMarks(anchors: HTMLAnchorElement[]): SectionMark[] {
  const marks: SectionMark[] = [];
  const seen = new Set<string>();
  for (const anchor of anchors) {
    const id = sectionId(anchor);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const section = document.getElementById(id);
    if (!section) continue;
    marks.push({
      id,
      top: section.getBoundingClientRect().top + window.scrollY,
      anchor,
    });
  }
  return marks;
}

function activeFromScroll(marks: SectionMark[]) {
  if (!isHomeShellPath(window.location.pathname)) return null;

  const marker = window.scrollY + 140;
  let current: HTMLAnchorElement | null = null;
  let currentTop = Number.NEGATIVE_INFINITY;
  for (const item of marks) {
    if (item.top <= marker && item.top >= currentTop) {
      currentTop = item.top;
      current = item.anchor;
    }
  }
  return current;
}

function activeLink(anchors: HTMLAnchorElement[], path: string, marks: SectionMark[]) {
  let winner: HTMLAnchorElement | null = null;
  let best = 0;
  for (const anchor of anchors) {
    const score = scoreLink(anchor, path);
    if (score > best) {
      best = score;
      winner = anchor;
    }
  }
  if (isHomeShellPath(path)) {
    return activeFromScroll(marks) ?? (best > 0 ? winner : null);
  }
  return winner;
}

function movePill(list: HTMLElement, pill: HTMLElement, target: HTMLElement | null) {
  if (!target || list.offsetParent === null || list.clientWidth === 0) {
    pill.style.opacity = "0";
    return;
  }
  const listRect = list.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  if (rect.width < 4) {
    pill.style.opacity = "0";
    return;
  }
  pill.style.opacity = "1";
  pill.style.width = `${rect.width}px`;
  pill.style.transform = `translateX(${rect.left - listRect.left + list.scrollLeft}px)`;
}

function ensureMobileShell(list: HTMLElement) {
  const bar = document.querySelector("nav .nav-container") as HTMLElement | null;
  if (!bar) return;

  if (!document.getElementById("mobileMenuBtn")) {
    const button = document.createElement("button");
    button.className = "mobile-menu-button";
    button.id = "mobileMenuBtn";
    button.type = "button";
    button.setAttribute("aria-label", "Toggle mobile menu");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = '<div class="hamburger"><span></span><span></span><span></span></div>';
    bar.appendChild(button);
  }

  const navEl = bar.closest("nav") ?? bar.parentElement;
  if (!navEl) return;

  let overlay = document.getElementById("mobileMenuOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "mobile-menu-overlay";
    overlay.id = "mobileMenuOverlay";
    navEl.insertAdjacentElement("afterend", overlay);
  }

  if (document.getElementById("mobileMenu")) return;

  const cta = bar.querySelector(".nav-bottom a.cyber-button");
  const items = [...list.querySelectorAll<HTMLAnchorElement>(":scope > li > a")]
    .map((anchor) => {
      const href = (anchor.getAttribute("href") || "#").replace(/"/g, "&quot;");
      const label = (anchor.textContent || "").trim();
      if (!label) return "";
      return `<li><a href="${href}">${label}</a></li>`;
    })
    .join("");

  const menu = document.createElement("div");
  menu.className = "mobile-menu";
  menu.id = "mobileMenu";
  menu.innerHTML = `
    <div class="mobile-menu-header">
      <a href="/" class="mobile-menu-logo" aria-label="AllOfTech home">AllOfTech</a>
      <button class="mobile-menu-close" id="mobileMenuClose" type="button" aria-label="Close mobile menu">✕</button>
    </div>
    ${cta ? `<div class="mobile-menu-cta">${cta.outerHTML}</div>` : ""}
    <nav class="mobile-menu-nav"><ul>${items}</ul></nav>
  `;
  overlay.insertAdjacentElement("afterend", menu);
}

function closeMobileMenu() {
  const btn = document.getElementById("mobileMenuBtn");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileMenuOverlay");
  const wasOpen = menu?.classList.contains("active");
  btn?.classList.remove("active");
  btn?.setAttribute("aria-expanded", "false");
  menu?.classList.remove("active");
  overlay?.classList.remove("active");
  if (wasOpen) {
    window.AllOfTechScroll?.unlock();
  }
}

export default function ContinuousNav() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    let list: HTMLElement | null = null;
    let pill: HTMLElement | null = null;
    let anchors: HTMLAnchorElement[] = [];
    let marks: SectionMark[] = [];
    let locked: HTMLAnchorElement | null = null;
    let scrollRaf = 0;
    let lastDocHeight = 0;
    let observer: ResizeObserver | null = null;
    const listeners: Array<() => void> = [];

    const pathNow = () => normalizePath(window.location.pathname);

    const paint = () => {
      if (!list || !pill) return;
      anchors = navAnchors();
      const winner = locked;
      for (const anchor of anchors) {
        const on = Boolean(winner && (anchor === winner || destinationsMatch(anchor, winner)));
        anchor.classList.toggle("is-tab-active", on);
        anchor.classList.toggle("active", on);
        if (on) anchor.setAttribute("aria-current", "page");
        else anchor.removeAttribute("aria-current");
      }
      const desktopTarget =
        winner && list.contains(winner)
          ? winner
          : (anchors.find((anchor) => list && list.contains(anchor) && anchor.classList.contains("is-tab-active")) ??
            null);
      movePill(list, pill, desktopTarget);
    };

    const refresh = () => {
      if (!list) return;
      anchors = navAnchors();
      marks = collectSectionMarks(anchors);
      lastDocHeight = document.documentElement.scrollHeight;
      locked = activeLink(anchors, pathNow(), marks);
      paint();
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        if (!isHomeShellPath(pathNow())) return;
        if (!list) return;
        const height = document.documentElement.scrollHeight;
        if (height !== lastDocHeight) {
          lastDocHeight = height;
          marks = collectSectionMarks(anchors);
        }
        locked = activeLink(anchors, pathNow(), marks);
        paint();
      });
    };

    const onNavClick = (event: Event) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a") as HTMLAnchorElement | null;
      if (!anchor || !list) return;
      const inDesktop = list.contains(anchor);
      const inMobileNav = Boolean(anchor.closest(".mobile-menu-nav"));
      const inMobileChrome = Boolean(anchor.closest(".mobile-menu-cta, .mobile-menu-logo"));
      if (!inDesktop && !inMobileNav && !inMobileChrome) return;
      anchor.blur();
      if (inMobileNav || inMobileChrome) closeMobileMenu();
      if (!inDesktop && !inMobileNav) return;
      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = hrefUrl(href);
      if (url && url.origin !== window.location.origin) return;
      locked = anchor;
      paint();
    };

    const unbind = () => {
      for (const off of listeners) off();
      listeners.length = 0;
      observer?.disconnect();
      observer = null;
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = 0;
      pill?.remove();
      pill = null;
      if (list) {
        list.classList.remove("continuous-tabs");
        for (const extra of list.querySelectorAll(":scope > .continuous-tabs-pill")) extra.remove();
      }
      list = null;
      closeMobileMenu();
    };

    const bind = () => {
      const next = desktopList();
      if (next && next === list && list.isConnected && pill) {
        refresh();
        return;
      }
      unbind();
      if (!next) return;
      list = next;
      list.classList.add("continuous-tabs");
      ensureMobileShell(list);

      pill = document.createElement("span");
      pill.className = "continuous-tabs-pill";
      pill.setAttribute("aria-hidden", "true");
      list.insertBefore(pill, list.firstChild);

      const add = (target: EventTarget, type: string, handler: EventListener, options?: AddEventListenerOptions) => {
        target.addEventListener(type, handler, options);
        listeners.push(() => target.removeEventListener(type, handler, options));
      };

      add(document, "click", onNavClick, { capture: true });
      add(window, "hashchange", refresh);
      add(window, "popstate", refresh);
      add(window, "pageshow", refresh);
      add(window, "scroll", onScroll, { passive: true });
      add(window, "resize", refresh);
      add(window, "aot:preloader-done", refresh);
      add(window, "aot:content-mounted", refresh);

      observer =
        typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => paint());
      if (list) observer?.observe(list);

      refresh();
    };

    const onNavRefresh = () => bind();
    bind();
    window.addEventListener("aot:nav-refresh", onNavRefresh);

    return () => {
      window.removeEventListener("aot:nav-refresh", onNavRefresh);
      unbind();
      for (const anchor of navAnchors()) {
        if (!anchor.closest(".nav-links, .mobile-menu-nav")) continue;
        anchor.classList.remove("is-tab-active");
        anchor.removeAttribute("aria-current");
      }
    };
  }, []);

  useLayoutEffect(() => {
    window.dispatchEvent(new Event("aot:nav-refresh"));
  }, [pathname]);

  return null;
}

declare global {
  interface Window {
    AllOfTechScroll?: { lock: () => void; unlock: () => void };
  }
}
