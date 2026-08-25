/** Full document load / reload only. Client navigations never re-add this class. */
export const FIRST_ENTER_HOLD_MS = 2100;
export const FIRST_ENTER_EXIT_MS = 900;
export const FIRST_ENTER_MS = FIRST_ENTER_HOLD_MS + FIRST_ENTER_EXIT_MS;

export const FIRST_ENTER_BOOT_SCRIPT = `(function(){try{if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;var r=document.documentElement;r.classList.add("aot-first-enter");r.setAttribute("aria-busy","true");var done=false;function clear(){if(done)return;done=true;r.classList.remove("aot-first-enter","aot-first-enter-exit","aot-first-enter-reduce");if(r.getAttribute("aria-busy")==="true")r.removeAttribute("aria-busy");}function exit(){if(done||r.classList.contains("aot-first-enter-exit"))return;r.classList.add("aot-first-enter-exit");setTimeout(clear,${FIRST_ENTER_EXIT_MS});}setTimeout(exit,${FIRST_ENTER_HOLD_MS});function bind(){var n=document.getElementById("aotIntro");if(!n)return;n.addEventListener("click",exit);}if(document.body)bind();else document.addEventListener("DOMContentLoaded",bind);}catch(e){}})();`;

export const FIRST_ENTER_CRITICAL_CSS = `
.aot-intro{display:none}
html.aot-first-enter,html.aot-first-enter body{overflow:hidden!important}
html.aot-first-enter body::before{
  content:"";
  position:fixed;
  inset:0;
  z-index:2147482980;
  background:#050510;
  pointer-events:auto;
}
html.aot-first-enter-exit body::before{content:none;display:none}
html.aot-first-enter .aot-intro,html.aot-first-enter-exit .aot-intro{
  display:flex;
  position:fixed;
  inset:0;
  z-index:2147482990;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  isolation:isolate;
  contain:layout paint;
  pointer-events:auto;
  user-select:none;
  -webkit-user-select:none;
  cursor:default;
  color:#fff;
}
.aot-intro__veil,.aot-intro__grid,.aot-intro__glow,.aot-intro__panel,.aot-intro__seam,.aot-intro__progress,.aot-intro__scan,.aot-intro__sparks,.aot-intro__frame,.aot-intro__cross{
  position:absolute;inset:0;pointer-events:none
}
.aot-intro__veil{background:#050510;z-index:0}
.aot-intro__grid{
  z-index:3;
  background-image:linear-gradient(rgba(0,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,.045) 1px,transparent 1px);
  background-size:48px 48px;
  -webkit-mask-image:radial-gradient(ellipse 72% 62% at 50% 46%,#000 18%,transparent 74%);
  mask-image:radial-gradient(ellipse 72% 62% at 50% 46%,#000 18%,transparent 74%);
  opacity:0;
  transform:scale(1.06);
  animation:aotIntroGrid .9s cubic-bezier(.16,1,.3,1) .05s forwards
}
.aot-intro__glow{
  z-index:3;
  background:
    radial-gradient(ellipse 46% 38% at 50% 44%,rgba(0,255,255,.16),transparent 62%),
    radial-gradient(ellipse 38% 32% at 50% 52%,rgba(124,58,237,.18),transparent 68%);
  opacity:0;
  transform:scale(.82);
  animation:aotIntroGlow 1.15s cubic-bezier(.16,1,.3,1) .08s forwards
}
.aot-intro__scan{
  z-index:3;
  height:22%;
  top:-24%;
  background:linear-gradient(to bottom,transparent,rgba(0,255,255,.1),transparent);
  opacity:0;
  animation:aotIntroScan 2.05s cubic-bezier(.16,1,.3,1) .12s both
}
.aot-intro__cross{z-index:3}
.aot-intro__cross-x,.aot-intro__cross-y{
  position:absolute;
  background:linear-gradient(90deg,transparent,rgba(0,255,255,.28),transparent);
  opacity:0
}
.aot-intro__cross-x{
  left:8%;right:8%;top:50%;height:1px;
  animation:aotIntroCrossX .9s cubic-bezier(.16,1,.3,1) .18s forwards
}
.aot-intro__cross-y{
  top:10%;bottom:10%;left:50%;width:1px;
  background:linear-gradient(180deg,transparent,rgba(124,58,237,.32),transparent);
  animation:aotIntroCrossY .9s cubic-bezier(.16,1,.3,1) .26s forwards
}
.aot-intro__sparks{z-index:3}
.aot-intro__sparks i{
  position:absolute;
  width:3px;height:3px;
  border-radius:50%;
  background:#00ffff;
  box-shadow:0 0 8px rgba(0,255,255,.8);
  opacity:0;
  animation:aotIntroSpark 1.7s ease-in-out infinite
}
.aot-intro__sparks i:nth-child(3n){background:#7c3aed;box-shadow:0 0 8px rgba(124,58,237,.85)}
.aot-intro__sparks i:nth-child(4n){background:#ff00ff;box-shadow:0 0 8px rgba(255,0,255,.7)}
.aot-intro__frame{z-index:5}
.aot-intro__corner{
  position:absolute;
  width:44px;height:44px;
  opacity:0;
  animation:aotIntroCorner .75s cubic-bezier(.16,1,.3,1) forwards
}
.aot-intro__corner--tl{top:28px;left:28px;border-top:1px solid rgba(0,255,255,.7);border-left:1px solid rgba(0,255,255,.7);transform-origin:0 0;animation-delay:.16s}
.aot-intro__corner--tr{top:28px;right:28px;border-top:1px solid rgba(0,255,255,.7);border-right:1px solid rgba(0,255,255,.7);transform-origin:100% 0;animation-delay:.24s}
.aot-intro__corner--bl{bottom:28px;left:28px;border-bottom:1px solid rgba(0,255,255,.7);border-left:1px solid rgba(0,255,255,.7);transform-origin:0 100%;animation-delay:.32s}
.aot-intro__corner--br{bottom:28px;right:28px;border-bottom:1px solid rgba(0,255,255,.7);border-right:1px solid rgba(0,255,255,.7);transform-origin:100% 100%;animation-delay:.4s}
.aot-intro__panel{
  left:0;right:0;height:50.2%;
  background:#050510;
  z-index:2;
  will-change:transform
}
.aot-intro__panel--top{top:0}
.aot-intro__panel--bottom{bottom:0;top:auto}
.aot-intro__seam{
  top:50%;
  bottom:auto;
  height:1px;
  left:12%;
  right:12%;
  width:auto;
  z-index:5;
  background:linear-gradient(90deg,transparent,#00ffff,transparent);
  opacity:0;
  transform:scaleX(.2)
}
.aot-intro__stage{
  position:relative;
  z-index:4;
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
  padding:24px;
  transform:translateZ(0)
}
.aot-intro__mark{
  position:relative;
  z-index:1;
  width:124px;height:124px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom:28px;
  isolation:isolate
}
.aot-intro__mark::after{
  content:"";
  position:absolute;
  inset:22%;
  border-radius:50%;
  background:radial-gradient(circle,rgba(0,255,255,.22),transparent 70%);
  opacity:0;
  transform:scale(.7);
  animation:aotIntroGlow 1.05s cubic-bezier(.16,1,.3,1) .16s forwards;
  z-index:0
}
.aot-intro__pulse{
  position:absolute;
  inset:6%;
  border-radius:50%;
  border:1px solid rgba(0,255,255,.35);
  opacity:0;
  pointer-events:none
}
.aot-intro__pulse--a{animation:aotIntroPulse 1.6s cubic-bezier(.16,1,.3,1) .28s infinite}
.aot-intro__pulse--b{animation:aotIntroPulse 1.6s cubic-bezier(.16,1,.3,1) .72s infinite}
.aot-intro__ticks{
  position:absolute;
  inset:0;
  z-index:1;
  pointer-events:none
}
.aot-intro__ticks i{
  position:absolute;
  left:50%;
  top:50%;
  width:1.5px;
  height:7px;
  margin:-3.5px 0 0 -.75px;
  background:rgba(0,255,255,.7);
  transform:rotate(calc(var(--i) * 30deg)) translateY(-58px);
  opacity:0;
  animation:aotIntroTick .45s cubic-bezier(.16,1,.3,1) forwards
}
.aot-intro__orbit{
  position:absolute;
  inset:-10px;
  z-index:2;
  opacity:0;
  animation:aotIntroOrbitIn .6s ease .35s forwards, aotIntroSpin 6.5s linear .35s infinite
}
.aot-intro__orbit i{
  position:absolute;
  width:7px;height:7px;
  border-radius:50%;
  background:#00ffff;
  box-shadow:0 0 10px rgba(0,255,255,.9);
  left:50%;
  top:0;
  margin-left:-3.5px
}
.aot-intro__orbit i:nth-child(2){
  top:auto;bottom:8%;left:10%;
  background:#7c3aed;
  box-shadow:0 0 10px rgba(124,58,237,.9)
}
.aot-intro__orbit i:nth-child(3){
  top:42%;left:auto;right:-2px;
  background:#ff00ff;
  box-shadow:0 0 10px rgba(255,0,255,.8);
  width:5px;height:5px
}
.aot-intro__ring{
  position:absolute;inset:0;
  width:100%;height:100%;
  z-index:1
}
.aot-intro__ring--spin{
  animation:aotIntroSpin 14s linear infinite
}
.aot-intro__ring-track{fill:none;stroke:rgba(0,255,255,.16);stroke-width:0.7}
.aot-intro__ring-dash{
  fill:none;
  stroke:rgba(0,255,255,.45);
  stroke-width:0.55;
  stroke-dasharray:3 7;
  stroke-linecap:round;
  opacity:0;
  animation:aotIntroFade .7s ease .2s forwards
}
.aot-intro__ring-draw{
  fill:none;
  stroke:#00ffff;
  stroke-width:0.95;
  stroke-linecap:round;
  stroke-dasharray:264;
  stroke-dashoffset:264;
  animation:aotIntroRing 1.15s cubic-bezier(.16,1,.3,1) .12s forwards
}
.aot-intro__nucleus{
  position:relative;
  z-index:1;
  width:58px;height:58px;
  perspective:140px;
  opacity:0;
  transform:scale(.62);
  animation:aotIntroLogo .85s cubic-bezier(.16,1,.3,1) .18s forwards
}
.aot-intro__nucleus-stage{
  position:relative;
  width:100%;height:100%;
  transform-style:preserve-3d
}
.aot-intro__nucleus-core{
  position:absolute;
  inset:26%;
  border-radius:50%;
  background:radial-gradient(circle at 34% 30%,#fff 0%,#d8ffff 12%,#00ffff 30%,#7c3aed 66%,#ff00ff 100%);
  box-shadow:inset 0 -4px 10px rgba(6,8,18,.5),inset 0 2px 6px rgba(255,255,255,.45),0 0 16px rgba(0,255,255,.55),0 0 28px rgba(255,0,255,.28);
  animation:aotIntroNucleusPulse 1.35s ease-in-out infinite
}
.aot-intro__nucleus-core::before{
  content:"";
  position:absolute;
  top:12%;left:16%;
  width:34%;height:26%;
  border-radius:50%;
  background:radial-gradient(circle,rgba(255,255,255,.95),rgba(255,255,255,0) 70%)
}
.aot-intro__nucleus-ring{
  position:absolute;
  inset:2%;
  border-radius:50%;
  border:1px solid rgba(0,255,255,.5);
  box-shadow:0 0 8px rgba(0,255,255,.18),inset 0 0 6px rgba(0,255,255,.12)
}
.aot-intro__nucleus-ring--a{
  animation:aotIntroNucleusSpinA 2.2s linear infinite
}
.aot-intro__nucleus-ring--b{
  inset:10%;
  border-color:rgba(255,0,255,.45);
  box-shadow:0 0 8px rgba(255,0,255,.16),inset 0 0 6px rgba(255,0,255,.12);
  animation:aotIntroNucleusSpinB 2.8s linear infinite reverse
}
.aot-intro__nucleus-ring--c{
  inset:18%;
  border-color:rgba(124,58,237,.5);
  box-shadow:0 0 8px rgba(124,58,237,.18),inset 0 0 6px rgba(124,58,237,.12);
  animation:aotIntroNucleusSpinC 1.8s linear infinite
}
.aot-intro__name{
  font-family:Arial,Helvetica,sans-serif;
  font-weight:700;
  font-size:clamp(28px,6.4vw,52px);
  letter-spacing:.06em;
  margin:0 -.06em 16px 0;
  line-height:1.1;
  color:#fff;
  text-transform:none
}
.aot-intro__name span{
  display:inline-block;
  opacity:0;
  transform:translate3d(0,22px,0);
  animation:aotIntroChar .7s cubic-bezier(.16,1,.3,1) forwards
}
.aot-intro__rule{
  display:block;
  width:0;
  height:1px;
  margin:0 auto 14px;
  background:linear-gradient(90deg,transparent,#00ffff,transparent);
  animation:aotIntroRule .7s cubic-bezier(.16,1,.3,1) 1.08s forwards
}
.aot-intro__tag{
  margin:0;
  font-size:12px;
  font-weight:700;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:rgba(0,255,255,.88);
  opacity:0;
  transform:translate3d(0,10px,0);
  animation:aotIntroTag .8s cubic-bezier(.16,1,.3,1) 1.2s forwards
}
.aot-intro__progress{
  top:auto;bottom:0;height:2px;z-index:5;
  background:rgba(255,255,255,.06)
}
.aot-intro__progress i{
  display:block;
  height:100%;
  width:0;
  background:linear-gradient(90deg,#00ffff,#7c3aed,#ff00ff);
  animation:aotIntroBar ${FIRST_ENTER_HOLD_MS}ms cubic-bezier(.16,1,.3,1) forwards
}
html.aot-first-enter-exit .aot-intro{pointer-events:none}
html.aot-first-enter-exit .aot-intro__stage{
  opacity:0;
  transform:scale(.96) translate3d(0,-10px,0);
  transition:opacity .45s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.76,0,.24,1)
}
html.aot-first-enter-exit .aot-intro__grid,
html.aot-first-enter-exit .aot-intro__glow,
html.aot-first-enter-exit .aot-intro__progress,
html.aot-first-enter-exit .aot-intro__veil,
html.aot-first-enter-exit .aot-intro__scan,
html.aot-first-enter-exit .aot-intro__sparks,
html.aot-first-enter-exit .aot-intro__frame,
html.aot-first-enter-exit .aot-intro__cross{
  opacity:0;
  transition:opacity .28s linear
}
html.aot-first-enter-exit .aot-intro__panel{
  transition:transform .9s cubic-bezier(.76,0,.24,1)
}
html.aot-first-enter-exit .aot-intro__panel--top{transform:translate3d(0,-101%,0)}
html.aot-first-enter-exit .aot-intro__panel--bottom{transform:translate3d(0,101%,0)}
html.aot-first-enter-exit .aot-intro__seam{
  animation:aotIntroSeam .65s cubic-bezier(.16,1,.3,1) both
}
@keyframes aotIntroGrid{to{opacity:1;transform:scale(1)}}
@keyframes aotIntroGlow{to{opacity:1;transform:scale(1)}}
@keyframes aotIntroFade{to{opacity:1}}
@keyframes aotIntroOrbitIn{to{opacity:1}}
@keyframes aotIntroRing{to{stroke-dashoffset:0}}
@keyframes aotIntroLogo{to{opacity:1;transform:scale(1)}}
@keyframes aotIntroNucleusPulse{0%,100%{box-shadow:inset 0 -4px 10px rgba(6,8,18,.5),inset 0 2px 6px rgba(255,255,255,.45),0 0 16px rgba(0,255,255,.55),0 0 28px rgba(255,0,255,.28)}50%{box-shadow:inset 0 -4px 10px rgba(6,8,18,.5),inset 0 2px 6px rgba(255,255,255,.55),0 0 22px rgba(0,255,255,.75),0 0 36px rgba(255,0,255,.4)}}
@keyframes aotIntroNucleusSpinA{from{transform:rotateX(74deg) rotateZ(0deg)}to{transform:rotateX(74deg) rotateZ(360deg)}}
@keyframes aotIntroNucleusSpinB{from{transform:rotateY(68deg) rotateX(18deg) rotateZ(0deg)}to{transform:rotateY(68deg) rotateX(18deg) rotateZ(360deg)}}
@keyframes aotIntroNucleusSpinC{from{transform:rotateX(52deg) rotateY(34deg) rotateZ(0deg)}to{transform:rotateX(52deg) rotateY(34deg) rotateZ(360deg)}}
@keyframes aotIntroChar{to{opacity:1;transform:translate3d(0,0,0)}}
@keyframes aotIntroRule{to{width:min(220px,46vw)}}
@keyframes aotIntroTag{to{opacity:1;transform:translate3d(0,0,0)}}
@keyframes aotIntroBar{to{width:100%}}
@keyframes aotIntroTick{to{opacity:1}}
@keyframes aotIntroCorner{from{opacity:0;transform:scale(.55)}to{opacity:1;transform:scale(1)}}
@keyframes aotIntroSpin{to{transform:rotate(360deg)}}
@keyframes aotIntroPulse{
  0%{opacity:.55;transform:scale(.92)}
  100%{opacity:0;transform:scale(1.35)}
}
@keyframes aotIntroScan{
  0%{transform:translate3d(0,0,0);opacity:0}
  18%{opacity:1}
  100%{transform:translate3d(0,128vh,0);opacity:.15}
}
@keyframes aotIntroSpark{
  0%,100%{opacity:0;transform:translate3d(0,8px,0) scale(.6)}
  40%{opacity:.95;transform:translate3d(0,-10px,0) scale(1)}
}
@keyframes aotIntroCrossX{
  0%{opacity:0;transform:scaleX(.12)}
  55%{opacity:.85;transform:scaleX(1)}
  100%{opacity:.22;transform:scaleX(1)}
}
@keyframes aotIntroCrossY{
  0%{opacity:0;transform:scaleY(.12)}
  55%{opacity:.7;transform:scaleY(1)}
  100%{opacity:.16;transform:scaleY(1)}
}
@keyframes aotIntroSeam{
  0%{opacity:0;transform:scaleX(.18)}
  28%{opacity:1;transform:scaleX(1)}
  100%{opacity:0;transform:scaleX(1.04)}
}
@media (max-width:768px){
  .aot-intro__grid,.aot-intro__scan,.aot-intro__sparks,.aot-intro__cross,.aot-intro__ticks,.aot-intro__orbit,.aot-intro__ring--spin,.aot-intro__pulse{display:none}
  .aot-intro__mark{width:88px;height:88px;margin-bottom:22px}
  .aot-intro__nucleus{width:42px;height:42px}
  .aot-intro__nucleus-ring{display:none}
  .aot-intro__name{letter-spacing:.04em;margin-right:-.04em}
  .aot-intro__tag{letter-spacing:.12em;font-size:11px}
  .aot-intro__corner{width:28px;height:28px}
  .aot-intro__corner--tl{top:16px;left:16px}
  .aot-intro__corner--tr{top:16px;right:16px}
  .aot-intro__corner--bl{bottom:16px;left:16px}
  .aot-intro__corner--br{bottom:16px;right:16px}
}
@media (prefers-reduced-motion:reduce){
  html.aot-first-enter body::before{content:none;display:none}
  html.aot-first-enter .aot-intro,html.aot-first-enter-exit .aot-intro{display:none}
}
`.replace(/\n/g, "");

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
