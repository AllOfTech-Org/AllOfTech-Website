/** Full document load / reload only. Client navigations never re-add this class. */
export const FIRST_ENTER_MS = 1500;

export const FIRST_ENTER_BOOT_SCRIPT = `(function(){try{if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;var r=document.documentElement;r.classList.add("aot-first-enter");r.setAttribute("aria-busy","true");setTimeout(function(){r.classList.remove("aot-first-enter","aot-first-enter-reduce");if(r.getAttribute("aria-busy")==="true")r.removeAttribute("aria-busy");},${FIRST_ENTER_MS});}catch(e){}})();`;

export const FIRST_ENTER_CRITICAL_CSS = `
html.aot-first-enter body::after{
  content:"";
  position:fixed;
  inset:0;
  z-index:2147482990;
  pointer-events:auto;
  background:rgba(5,5,16,.2);
  backdrop-filter:blur(24px) saturate(1.18);
  -webkit-backdrop-filter:blur(24px) saturate(1.18);
  will-change:opacity;
  animation:aotBlurLoader ${FIRST_ENTER_MS}ms cubic-bezier(.16,1,.3,1) both;
}
@keyframes aotBlurLoader{
  0%,60%{opacity:1}
  100%{opacity:0}
}
@media (max-width:768px){
  html.aot-first-enter body::after{
    background:rgba(5,5,16,.28);
    backdrop-filter:blur(16px) saturate(1.1);
    -webkit-backdrop-filter:blur(16px) saturate(1.1);
  }
}
@media (prefers-reduced-motion:reduce){
  html.aot-first-enter body::after{content:none;display:none}
}
`.replace(/\n/g, "");

export function clearFirstEnter() {
  try {
    const root = document.documentElement;
    root.classList.remove("aot-first-enter", "aot-first-enter-reduce");
    if (root.getAttribute("aria-busy") === "true") {
      root.removeAttribute("aria-busy");
    }
  } catch {
    // First-enter CSS is gone once the class is off; ignore DOM failures.
  }
}
