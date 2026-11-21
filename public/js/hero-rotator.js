/* A single text layer fades to zero before its copy changes, so phrases never overlap. */
(() => {
  if (window.aotHeroRotatorLoaded) return;
  window.aotHeroRotatorLoaded = true;
  const slides = [
    ["Customers get answers", "before they leave.", "AI support that replies in seconds, day and night, and hands tricky cases to your team."],
    ["Products that", "explain themselves.", "3D animation that shows what photos can't: materials, movement, and how it works."],
    ["Your whole business", "on one screen.", "Cash, stock, orders, and reports together, built around how you actually work."],
    ["A website that works", "while you sleep.", "Fast, clear sites and web apps built to turn visitors into inquiries."],
    ["Your brand,", "in their pocket.", "Mobile apps that make buying, booking, and coming back effortless."],
    ["A brand people", "remember.", "Identity and design that make you look as good as you are."],
  ];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  function init() {
    const title = document.querySelector("[data-hero-rotator]");
    const subline = document.querySelector("[data-hero-subline]");
    if (!title || !subline || title.dataset.rotatorReady) return;
    const titleLayer = title.querySelector(".hero-rotator-layer");
    const sublineLayer = subline.querySelector(".hero-rotator-layer");
    if (!titleLayer || !sublineLayer) return;
    title.dataset.rotatorReady = "";
    let index = 0, previousWidth = 0, changing = false, swapStarted = false;

    function measure() {
      const width = Math.ceil(title.getBoundingClientRect().width);
      if (!width || width === previousWidth) return;
      previousWidth = width;
      const headingProbe = titleLayer.cloneNode(true);
      const lineProbe = sublineLayer.cloneNode(true);
      headingProbe.classList.remove("is-fading");
      lineProbe.classList.remove("is-fading");
      for (const [probe, probeWidth] of [[headingProbe, width], [lineProbe, Math.ceil(subline.getBoundingClientRect().width)]]) {
        probe.style.cssText = `position:absolute;inset:auto;left:-9999px;top:0;width:${probeWidth}px;height:auto;min-height:0;visibility:hidden;opacity:1;transform:none;transition:none;`;
        const sourceStyle = getComputedStyle(probe === headingProbe ? title : subline);
        probe.style.font = sourceStyle.font;
        probe.style.letterSpacing = sourceStyle.letterSpacing;
        probe.style.lineHeight = sourceStyle.lineHeight;
        probe.style.textWrap = sourceStyle.textWrap;
        title.parentElement.append(probe);
      }
      let headingHeight = 0, lineHeight = 0;
      for (const [lead, accent, description] of slides) {
        headingProbe.innerHTML = `<span class="hero-rotator-lead"></span><span class="hero-rotator-accent"></span>`;
        headingProbe.querySelector(".hero-rotator-lead").textContent = lead;
        headingProbe.querySelector(".hero-rotator-accent").textContent = accent;
        lineProbe.textContent = description;
        headingHeight = Math.max(headingHeight, headingProbe.getBoundingClientRect().height);
        lineHeight = Math.max(lineHeight, lineProbe.getBoundingClientRect().height);
      }
      title.style.height = `${Math.ceil(headingHeight)}px`;
      subline.style.height = `${Math.ceil(lineHeight)}px`;
      headingProbe.remove();
      lineProbe.remove();
    }
    const observer = new ResizeObserver(measure);
    observer.observe(title.parentElement);
    measure();
    document.fonts?.ready.then(() => { previousWidth = 0; measure(); });

    function showNextSlide() {
      index = (index + 1) % slides.length;
      const [lead, accent, description] = slides[index];
      titleLayer.querySelector(".hero-rotator-lead").textContent = lead;
      titleLayer.querySelector(".hero-rotator-accent").textContent = accent;
      sublineLayer.textContent = description;

      // Keep the replacement hidden for a painted frame before fading it in.
      requestAnimationFrame(() => {
        titleLayer.style.transitionDuration = "260ms";
        sublineLayer.style.transitionDuration = "260ms";
        titleLayer.classList.remove("is-fading");
        sublineLayer.classList.remove("is-fading");
        setTimeout(() => { changing = false; }, 270);
      });
    }

    function finishFadeOut(event) {
      if (event && (event.target !== titleLayer || event.propertyName !== "opacity")) return;
      if (!changing || swapStarted) return;
      // Timers may run before a busy browser has painted the full fade.
      if (Number(getComputedStyle(titleLayer).opacity) > 0.001) {
        setTimeout(finishFadeOut, 30);
        return;
      }
      swapStarted = true;
      titleLayer.removeEventListener("transitionend", finishFadeOut);
      showNextSlide();
    }

    const timer = setInterval(() => {
      if (!title.isConnected) { clearInterval(timer); observer.disconnect(); return; }
      if (document.hidden || reduced.matches || changing) return;
      changing = true;
      swapStarted = false;
      titleLayer.style.transitionDuration = "200ms";
      sublineLayer.style.transitionDuration = "200ms";
      titleLayer.addEventListener("transitionend", finishFadeOut);
      titleLayer.classList.add("is-fading");
      sublineLayer.classList.add("is-fading");
      // Backstop for browsers that suppress transitionend in a background tab.
      setTimeout(finishFadeOut, 260);
    }, 4500);
  }

  init();
  window.addEventListener("aot:content-mounted", init);
})();
