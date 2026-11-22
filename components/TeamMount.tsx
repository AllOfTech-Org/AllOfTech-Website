"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import TeamSection from "@/components/TeamSection";

export default function TeamMount() {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setTarget(document.getElementById("aot-team-root"));
  }, []);

  useLayoutEffect(() => {
    if (!target) return;
    let pendingTeam = false;
    try {
      pendingTeam = sessionStorage.getItem("aotHash") === "#team";
      if (pendingTeam) sessionStorage.removeItem("aotHash");
    } catch {
      // Hash navigation still works when session storage is unavailable.
    }
    if (pendingTeam || window.location.hash === "#team") {
      target.querySelector("#team")?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    window.dispatchEvent(new Event("aot:content-mounted"));
  }, [target]);

  if (!target) return null;
  return createPortal(<TeamSection />, target);
}
