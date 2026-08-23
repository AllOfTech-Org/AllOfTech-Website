/** Reuse the old intro key so returning visitors stay immediate. */
export const FIRST_ENTER_STORAGE_KEY = "aot.intro.seen";
export const FIRST_ENTER_STORAGE_VALUE = "1";

/** Must stay in sync with `--aot-reveal-duration` / first-enter CSS. */
export const FIRST_ENTER_MS = 900;

export const FIRST_ENTER_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(FIRST_ENTER_STORAGE_KEY)};var v=${JSON.stringify(FIRST_ENTER_STORAGE_VALUE)};if(localStorage.getItem(k)===v)return;localStorage.setItem(k,v);if(window.matchMedia&&(window.matchMedia("(max-width:768px)").matches||window.matchMedia("(hover:none),(pointer:coarse)").matches))return;var r=document.documentElement;r.classList.add("aot-first-enter");if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)r.classList.add("aot-first-enter-reduce");}catch(e){}})();`;

export const FIRST_ENTER_CRITICAL_CSS =
  "html.aot-first-enter .aot-page-clone,html.aot-first-enter .aot-services,html.aot-first-enter .aot-footer-16{opacity:0}html.aot-first-enter-reduce .aot-page-clone,html.aot-first-enter-reduce .aot-services,html.aot-first-enter-reduce .aot-footer-16{opacity:1;filter:none}@media (max-width:768px),(hover:none),(pointer:coarse){html.aot-first-enter .aot-page-clone,html.aot-first-enter .aot-services,html.aot-first-enter .aot-footer-16{opacity:1;filter:none;animation:none}}";

export function clearFirstEnter() {
  try {
    document.documentElement.classList.remove("aot-first-enter", "aot-first-enter-reduce");
  } catch {
    // First-enter CSS is gone once the class is off; ignore DOM failures.
  }
}
