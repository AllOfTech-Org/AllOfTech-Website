/*
    AllOfTech motion system.

    Drives one animation language across every route: a scroll-reactive
    atmosphere, staggered section reveals, and pointer-tracked card sheen.
    The navbar is excluded everywhere by design.
*/
(function () {
    'use strict';

    if (window.__aotMotionSystem) return;
    window.__aotMotionSystem = true;

    const root = document.documentElement;

    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarseMq = window.matchMedia('(hover: none), (pointer: coarse)');
    const liteMq = window.matchMedia('(max-width: 768px)');

    function reduced() {
        return reducedMotionMq.matches;
    }

    function lite() {
        return liteMq.matches || coarseMq.matches;
    }

    function syncRuntimeClasses() {
        root.classList.toggle('aot-lite', lite());
        root.classList.toggle('aot-page-hidden', document.hidden);
    }

    // Chrome that must never animate with the page body.
    const EXCLUDE = [
        'nav',
        '.mobile-menu',
        '.mobile-menu-overlay',
        '.site-preloader',
        '.chatbot-window',
        '.chatbot-button',
        '.chatbot-callout',
        '.service-modal-overlay',
        '.image-lightbox-overlay',
        '.reviews-marquee',
        '#hero',
        '.hero-seq',
        '.aot-atmosphere',
    ].join(',');

    const REVEAL = [
        '.section-header',
        '.hero-buttons',
        '.reviews-marquee-hint',
        '.review-form-wrapper',
        '.feature-card',
        '.pricing-card',
        '.blog-card',
        '.resource-card',
        '.terms-section',
        '.faq-item',
        '.choose-unique-card',
        '.choose-unique-eyebrow',
        '.choose-unique-title',
        '.choose-unique-intro',
        '.about-future-eyebrow',
        '.about-future-heading',
        '.about-future-kicker',
        '.about-future-description',
        '.about-future-mission',
        '.about-future-stat',
        '.stat-item',
        '.bar-item',
        '.roi-card',
        '.case-study-header',
        '.cs-result-card',
        '.psi-item',
        '.cs-index-card',
        '.highlight-box',
        '.cta-box',
        '.contact-form-wrapper',
        '.contact-info',
        '.aot-team1__card',
        '.aot-team__shot',
        '.service-post > h2',
        '.service-post > h3',
        '.service-post > p',
        '.service-post > ul',
        '.blog-post > h2',
        '.blog-post > h3',
        '.blog-post > p',
        '.blog-post > ul',
    ].join(',');

    // Cards that read better arriving with a slight scale.
    const SCALE_REVEAL = [
        '.feature-card',
        '.pricing-card',
        '.blog-card',
        '.resource-card',
        '.choose-unique-card',
        '.about-future-stat',
        '.about-future-mission',
        '.aot-team1__card',
        '.aot-team__shot',
    ].join(',');

    const SPOTLIGHT = [
        '.feature-card',
        '.pricing-card',
        '.blog-card',
        '.resource-card',
        '.terms-section',
        '.choose-unique-card',
        '.about-future-stat',
        '.about-future-mission',
        '.aot-team1__card',
        '.aot-team__shot',
    ].join(',');

    const LEFT_REVEAL = [
        '.about-future-eyebrow',
        '.about-future-heading',
        '.about-future-kicker',
        '.choose-unique-eyebrow',
        '.choose-unique-title',
    ].join(',');
    const RIGHT_REVEAL = ['.about-future-description', '.choose-unique-intro'].join(',');

    const STAGGER_STEP = 70;
    const STAGGER_MAX = 420;

    // ------------------------------------------------------------ atmosphere

    function ensureAtmosphere() {
        if (document.querySelector('.aot-atmosphere')) return;
        const layer = document.createElement('div');
        layer.className = 'aot-atmosphere';
        layer.setAttribute('aria-hidden', 'true');
        layer.innerHTML =
            '<div class="aot-aurora aot-aurora--1"><i></i></div>' +
            '<div class="aot-aurora aot-aurora--2"><i></i></div>' +
            '<div class="aot-aurora aot-aurora--3"><i></i></div>';
        document.body.insertBefore(layer, document.body.firstChild);
    }

    // ---------------------------------------------------------- scroll field
    // A lerped scroll position feeds the background parallax, so the
    // atmosphere keeps gliding after the wheel stops instead of snapping.

    let targetY = window.scrollY;
    let smoothY = window.scrollY;
    let frame = 0;

    function tick() {
        frame = 0;
        const delta = targetY - smoothY;
        smoothY += delta * 0.09;
        root.style.setProperty('--aot-sy', smoothY.toFixed(2) + 'px');
        if (Math.abs(delta) > 0.15) frame = requestAnimationFrame(tick);
    }

    function requestTick() {
        if (frame) return;
        frame = requestAnimationFrame(tick);
    }

    function onScroll() {
        targetY = window.scrollY;
        requestTick();
    }

    function startScrollField() {
        if (reduced() || lite()) {
            root.style.setProperty('--aot-sy', '0px');
            return;
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        targetY = window.scrollY;
        smoothY = window.scrollY;
        requestTick();
    }

    function stopScrollField() {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        root.style.setProperty('--aot-sy', '0px');
    }

    // --------------------------------------------------------------- reveals

    let observer = null;

    function show(el) {
        if (el.classList.contains('is-inview')) return;
        el.classList.add('is-revealing', 'is-inview');
        window.setTimeout(() => el.classList.remove('is-revealing'), 1400);
    }

    function ensureObserver() {
        if (observer || typeof IntersectionObserver === 'undefined') return observer;
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    show(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            // A near-zero threshold guarantees elements pinned to the very
            // bottom of a page still fire; the margin sets the trigger point.
            { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
        );
        return observer;
    }

    function setupReveals() {
        const nodes = document.querySelectorAll(REVEAL);
        if (!nodes.length) return;

        const counts = new Map();
        const pending = [];
        const tallLimit = window.innerHeight * 1.6;

        // Document order, so a container is always seen before its contents.
        nodes.forEach((el) => {
            if (el.hasAttribute('data-aot-reveal')) return;
            if (el.closest(EXCLUDE)) return;

            // Blocks much taller than the viewport cannot animate as a whole —
            // their own children carry the motion instead.
            if (el.getBoundingClientRect().height > tallLimit) return;

            // One reveal per nesting chain keeps the stagger legible.
            if (el.parentElement && el.parentElement.closest('[data-aot-reveal]')) return;

            let type = 'rise';
            if (el.matches(SCALE_REVEAL)) type = 'scale';
            else if (el.matches(LEFT_REVEAL)) type = 'left';
            else if (el.matches(RIGHT_REVEAL)) type = 'right';
            el.setAttribute('data-aot-reveal', type);

            const parent = el.parentElement || document.body;
            const index = counts.get(parent) || 0;
            counts.set(parent, index + 1);
            el.style.setProperty('--aot-delay', Math.min(index * STAGGER_STEP, STAGGER_MAX) + 'ms');

            pending.push(el);
        });

        if (!pending.length) return;

        if (reduced()) {
            pending.forEach(show);
            return;
        }

        const io = ensureObserver();
        const viewport = window.innerHeight;

        pending.forEach((el) => {
            const top = el.getBoundingClientRect().top;
            if (top < 0) {
                // Already scrolled past on load — no entrance to play.
                el.style.setProperty('--aot-delay', '0ms');
                show(el);
                return;
            }
            if (top < viewport * 0.95) {
                requestAnimationFrame(() => show(el));
                return;
            }
            if (io) io.observe(el);
            else show(el);
        });

        // Safety net: nothing inside the viewport may stay at opacity 0, even
        // if the observer misses it.
        window.setTimeout(() => {
            pending.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) show(el);
            });
        }, 2500);
    }

    // ------------------------------------------------------------- card glow

    function setupSpotlights() {
        if (reduced() || coarseMq.matches) return;
        document.querySelectorAll(SPOTLIGHT).forEach((card) => {
            if (card.hasAttribute('data-aot-spot')) return;
            if (card.closest(EXCLUDE)) return;
            if (card.getBoundingClientRect().height > window.innerHeight * 0.72) return;
            const spot = document.createElement('span');
            spot.className = 'aot-spot';
            spot.setAttribute('aria-hidden', 'true');
            card.insertBefore(spot, card.firstChild);
            card.setAttribute('data-aot-spot', '');
        });
    }

    let spotFrame = 0;
    let spotTarget = null;
    let spotX = 0;
    let spotY = 0;

    function paintSpot() {
        spotFrame = 0;
        if (!spotTarget) return;
        spotTarget.style.setProperty('--aot-mx', spotX.toFixed(1) + '%');
        spotTarget.style.setProperty('--aot-my', spotY.toFixed(1) + '%');
    }

    function onPointerMove(event) {
        if (event.pointerType === 'touch') return;
        const card = event.target instanceof Element ? event.target.closest('[data-aot-spot]') : null;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        spotTarget = card;
        spotX = ((event.clientX - rect.left) / rect.width) * 100;
        spotY = ((event.clientY - rect.top) / rect.height) * 100;
        if (spotFrame) return;
        spotFrame = requestAnimationFrame(paintSpot);
    }

    // ------------------------------------------------- pause decorative cost
    // Hero / aurora / ticker keep running only while they can be seen.

    const PAUSE_SEL = [
        '.hero-object',
        '.aot-atmosphere',
        '.hero-ticker',
        '.about-orbit',
        '.aot-epc-orbit',
        '.about-stage__fx',
        '.why-stage__fx',
    ].join(',');

    let pauseObserver = null;

    function ensurePauseObserver() {
        if (pauseObserver || typeof IntersectionObserver === 'undefined') return pauseObserver;
        pauseObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle('is-aot-paused', !entry.isIntersecting);
                });
            },
            { rootMargin: '80px 0px', threshold: 0 }
        );
        return pauseObserver;
    }

    function setupPauseIslands() {
        const io = ensurePauseObserver();
        if (!io) return;
        document.querySelectorAll(PAUSE_SEL).forEach((el) => {
            if (el.dataset.aotPause === '1') return;
            el.dataset.aotPause = '1';
            io.observe(el);
        });
    }

    // ------------------------------------------------------------------ boot

    function apply() {
        syncRuntimeClasses();
        ensureAtmosphere();
        setupReveals();
        setupSpotlights();
        setupPauseIslands();
    }

    function boot() {
        root.classList.add('aot-motion');
        syncRuntimeClasses();
        apply();
        startScrollField();
        document.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('visibilitychange', syncRuntimeClasses);
        function onLiteChange() {
            syncRuntimeClasses();
            stopScrollField();
            if (!reduced() && !lite()) startScrollField();
        }
        if (typeof liteMq.addEventListener === 'function') {
            liteMq.addEventListener('change', onLiteChange);
            coarseMq.addEventListener('change', onLiteChange);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }

    // Routes swap markup in place; re-tag whatever just mounted.
    window.addEventListener('aot:content-mounted', () => {
        requestAnimationFrame(apply);
    });

    reducedMotionMq.addEventListener('change', () => {
        if (reduced() || lite()) {
            stopScrollField();
            if (reduced()) document.querySelectorAll('[data-aot-reveal]').forEach(show);
        } else {
            startScrollField();
        }
    });
})();
