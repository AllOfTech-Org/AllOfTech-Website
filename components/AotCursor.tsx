"use client";

import { useEffect, useRef } from "react";

const FINE_MQ = "(hover: hover) and (pointer: fine)";
const REDUCE_MQ = "(prefers-reduced-motion: reduce)";

const TEXT_SEL =
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="color"]):not([type="range"]):not([type="image"]), textarea, [contenteditable="true"]';

const HOVER_SEL = [
  "a[href]",
  "button",
  "summary",
  "label[for]",
  "select",
  '[role="button"]',
  '[role="link"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="checkbox"]',
  '[role="switch"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="file"]',
  'input[type="color"]',
  'input[type="range"]',
  ".cyber-button",
  ".clickable-service",
  ".clickable-image",
  ".brand-tile",
  ".reviews-marquee-viewport",
].join(",");

// ~75ms to cover 63% of the remaining distance, independent of refresh rate.
const RING_TAU = 0.075;
const SETTLE = 0.01;
const MAX_DT = 1 / 30;

export default function AotCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootEl = rootRef.current;
    const pointerNode = pointerRef.current;
    const followerNode = followerRef.current;
    if (!rootEl || !pointerNode || !followerNode) return;

    const root: HTMLDivElement = rootEl;
    const pointerEl: HTMLDivElement = pointerNode;
    const followerEl: HTMLDivElement = followerNode;

    const html = document.documentElement;
    const fineMq = window.matchMedia(FINE_MQ);
    const reduceMq = window.matchMedia(REDUCE_MQ);

    let allowed = false;
    let visible = false;
    let hovering = false;
    let pressing = false;
    let overText = false;
    let hasPoint = false;
    let running = false;
    let frame = 0;
    let last = 0;

    let targetX = 0;
    let targetY = 0;
    let ringX = 0;
    let ringY = 0;
    let lastNode: Element | null = null;

    function paintPointer(x: number, y: number) {
      pointerEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    function paintRing(x: number, y: number) {
      followerEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    function setVisible(next: boolean) {
      if (visible === next) return;
      visible = next;
      root.classList.toggle("is-visible", next && !overText);
    }

    function setHover(next: boolean) {
      if (hovering === next) return;
      hovering = next;
      root.classList.toggle("is-hover", next);
    }

    function setPress(next: boolean) {
      if (pressing === next) return;
      pressing = next;
      root.classList.toggle("is-press", next);
    }

    function setText(next: boolean) {
      if (overText === next) return;
      overText = next;
      root.classList.toggle("is-text", next);
      root.classList.toggle("is-visible", visible && !next);
    }

    function readTarget(node: EventTarget | null) {
      const el =
        node instanceof Element ? node : node instanceof Node ? node.parentElement : null;
      if (el === lastNode) return;
      lastNode = el;
      if (!el) {
        setText(false);
        setHover(false);
        return;
      }
      const text = Boolean(el.closest(TEXT_SEL));
      setText(text);
      setHover(!text && Boolean(el.closest(HOVER_SEL)));
    }

    function tick(now: number) {
      const dt = last ? Math.min(MAX_DT, (now - last) / 1000) : 1 / 60;
      last = now;

      const alpha = 1 - Math.exp(-dt / RING_TAU);
      ringX += (targetX - ringX) * alpha;
      ringY += (targetY - ringY) * alpha;

      const dx = targetX - ringX;
      const dy = targetY - ringY;
      if (dx * dx + dy * dy < SETTLE) {
        ringX = targetX;
        ringY = targetY;
        paintRing(ringX, ringY);
        running = false;
        frame = 0;
        last = 0;
        return;
      }

      paintRing(ringX, ringY);
      frame = window.requestAnimationFrame(tick);
    }

    function kick() {
      if (running || !allowed) return;
      running = true;
      last = 0;
      frame = window.requestAnimationFrame(tick);
    }

    function enable() {
      if (allowed) return;
      allowed = true;
      html.classList.add("aot-cursor-on");
    }

    function disable() {
      if (!allowed && !visible) return;
      allowed = false;
      hasPoint = false;
      lastNode = null;
      html.classList.remove("aot-cursor-on");
      setVisible(false);
      setHover(false);
      setPress(false);
      setText(false);
      if (frame) window.cancelAnimationFrame(frame);
      running = false;
      frame = 0;
      last = 0;
    }

    function syncCapability() {
      if (reduceMq.matches || !fineMq.matches) disable();
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") {
        disable();
        return;
      }
      if (reduceMq.matches || !fineMq.matches) return;

      enable();

      const x = event.clientX;
      const y = event.clientY;
      targetX = x;
      targetY = y;

      if (!hasPoint) {
        hasPoint = true;
        ringX = x;
        ringY = y;
        paintRing(x, y);
      }

      paintPointer(x, y);
      readTarget(event.target);
      setVisible(true);
      kick();
    }

    function onPointerOver(event: PointerEvent) {
      if (!allowed || event.pointerType === "touch") return;
      readTarget(event.target);
    }

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === "touch") {
        disable();
        return;
      }
      if (!allowed) return;
      if (event.button === 0) setPress(true);
      readTarget(event.target);
    }

    function onPointerUp() {
      setPress(false);
    }

    function onPointerCancel() {
      setPress(false);
    }

    function onLeave() {
      hasPoint = false;
      lastNode = null;
      setVisible(false);
      setPress(false);
    }

    syncCapability();

    fineMq.addEventListener("change", syncCapability);
    reduceMq.addEventListener("change", syncCapability);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerCancel, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      disable();
      fineMq.removeEventListener("change", syncCapability);
      reduceMq.removeEventListener("change", syncCapability);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="aot-cursor" aria-hidden="true">
      <div
        ref={followerRef}
        className="aot-cursor__follower"
        style={{ transform: "translate3d(-120px, -120px, 0)" }}
      >
        <span className="aot-cursor__ring" />
      </div>
      <div
        ref={pointerRef}
        className="aot-cursor__pointer"
        style={{ transform: "translate3d(-120px, -120px, 0)" }}
      >
        <span className="aot-cursor__dot" />
      </div>
    </div>
  );
}
