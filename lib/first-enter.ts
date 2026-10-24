/** Full document load / reload only. Client navigations never re-add this class. */
export const FIRST_ENTER_HOLD_MS = 2100;
export const FIRST_ENTER_EXIT_MS = 900;
export const FIRST_ENTER_MS = FIRST_ENTER_HOLD_MS + FIRST_ENTER_EXIT_MS;

export const FIRST_ENTER_BOOT_SCRIPT = `(function(){try{if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;var r=document.documentElement;r.classList.add("aot-first-enter");r.setAttribute("aria-busy","true");var done=false;function clear(){if(done)return;done=true;r.classList.remove("aot-first-enter","aot-first-enter-exit","aot-first-enter-reduce");if(r.getAttribute("aria-busy")==="true")r.removeAttribute("aria-busy");}function exit(){if(done||r.classList.contains("aot-first-enter-exit"))return;r.classList.add("aot-first-enter-exit");setTimeout(clear,${FIRST_ENTER_EXIT_MS});}setTimeout(exit,${FIRST_ENTER_HOLD_MS});function bind(){var n=document.getElementById("aotIntro");if(!n)return;n.addEventListener("click",exit);}if(document.body)bind();else document.addEventListener("DOMContentLoaded",bind);}catch(e){}})();`;

export function clearFirstEnter() {
  try {
    const root = document.documentElement;
    root.classList.remove("aot-first-enter", "aot-first-enter-exit", "aot-first-enter-reduce");
    if (root.getAttribute("aria-busy") === "true") {
      root.removeAttribute("aria-busy");
    }
  } catch {
    // First-enter CSS is gone once the class is off; ignore DOM failures.
  }
}
