"use client";

import { useEffect, useLayoutEffect } from "react";
import { pathForHash, sectionIdForPath } from "@/lib/home-sections";

type PageScriptsProps = {
  scripts: readonly string[];
};

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[data-legacy-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.legacySrc = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function restoreSectionTarget() {
  const hashId = window.location.hash.replace(/^#/, "");
  if (hashId && (document.getElementById(hashId) || (hashId === "team" && document.getElementById("aot-team-root")))) {
    (document.getElementById(hashId) || document.getElementById("aot-team-root"))?.scrollIntoView({
      block: "start",
    });
    return;
  }
  const mapped = hashId ? pathForHash(hashId) : undefined;
  const pathId = sectionIdForPath(window.location.pathname);
  const id = mapped ? (hashId === "stats" ? "stats" : hashId) : pathId;
  if (!id || id === "top") return;
  document.getElementById(id)?.scrollIntoView({ block: "start" });
}

export default function PageScripts({ scripts }: PageScriptsProps) {
  const scriptKey = scripts.join("|");

  useLayoutEffect(() => {
    document.getElementById("sitePreloader")?.remove();
    restoreSectionTarget();
    document.body.classList.add("is-site-ready");
    window.dispatchEvent(new Event("aot:preloader-done"));
    window.dispatchEvent(new Event("aot:content-mounted"));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const list = scriptKey.split("|").filter(Boolean);
    const local = list.filter((src) => src.startsWith("/"));
    const remote = list.filter((src) => !src.startsWith("/"));

    (async () => {
      await Promise.all(
        local.map((src) =>
          loadScript(src).catch((error) => {
            console.error(error);
          }),
        ),
      );
      if (cancelled) return;
      window.dispatchEvent(new Event("aot:content-mounted"));
      for (const src of remote) {
        if (cancelled) return;
        try {
          await loadScript(src);
        } catch (error) {
          console.error(error);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [scriptKey]);

  return null;
}
