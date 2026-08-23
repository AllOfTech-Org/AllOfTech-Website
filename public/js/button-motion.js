(function () {
    'use strict';

    if (window.__aotButtonMotion) return;
    window.__aotButtonMotion = true;

    const SELECTOR = [
        '.cyber-button',
        '.btn-primary',
        '.btn-secondary',
        '.contact-whatsapp-btn',
        '.chatbot-button',
        '.chatbot-login-button',
        '.chatbot-send',
        '.chatbot-close',
        '.chatbot-callout-close',
        '.chatbot-lead-button',
        '.review-toggle-btn',
        '.brand-filter-btn',
        '.rating-star-btn',
        '.faq-question',
        '.modal-close',
        '.lightbox-close',
        '.clickable-service',
        '.related-service-card',
        'a.cs-site-badge',
        '.blog-link',
        '.resource-card > a',
        '.mobile-menu-button',
        '.mobile-menu-close',
        '.nav-social a',
    ].join(',');

    const COMPACT = [
        '.brand-filter-btn',
        '.rating-star-btn',
        '.modal-close',
        '.lightbox-close',
        '.chatbot-close',
        '.chatbot-callout-close',
        '.chatbot-send',
        '.chatbot-button',
        '.chatbot-lead-button',
        'a.cs-site-badge',
        '.blog-link',
        '.resource-card > a',
        '.mobile-menu-button',
        '.mobile-menu-close',
        '.nav-social a',
        '.nav-bottom .cyber-button',
        '.mobile-menu-cta .cyber-button',
    ].join(',');

    const CARD = ['.clickable-service', '.related-service-card'].join(',');
    const PRESS_ONLY = [
        '.faq-question',
        '.brand-filter-btn',
        '.modal-close',
        '.lightbox-close',
        '.chatbot-close',
        '.chatbot-callout-close',
    ].join(',');

    const REST = { x: 1, y: 1, ty: 0 };
    const HOVER_MS = 520;
    const PRESS_MS = 140;
    const REST_MS = 580;
    const EASE_GLIDE = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const EASE_PRESS = 'cubic-bezier(0.3, 0.8, 0.4, 1)';

    const running = new WeakMap();
    const pose = new WeakMap();

    const PRESETS = {
        full: {
            hover: { x: 1.035, y: 1.035, ty: -4 },
            press: { x: 0.97, y: 0.97, ty: 0 },
        },
        compact: {
            hover: { x: 1.045, y: 1.045, ty: -2 },
            press: { x: 0.96, y: 0.96, ty: 0 },
        },
        card: {
            hover: { x: 1.015, y: 1.015, ty: -6 },
            press: { x: 0.985, y: 0.985, ty: -2 },
        },
        pressOnly: {
            hover: REST,
            press: { x: 0.985, y: 0.985, ty: 0 },
        },
    };

    function reduced() {
        return Boolean(
            window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
    }

    function fineHover() {
        return Boolean(
            window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches
        );
    }

    function targetOf(event) {
        const node = event.target;
        if (!(node instanceof Element)) return null;
        const el = node.closest(SELECTOR);
        if (!el || el.closest('.logo, .mobile-menu-logo')) return null;
        if (el.matches(':disabled, [aria-disabled="true"]')) return null;
        return el;
    }

    function kindOf(el) {
        if (el.matches(PRESS_ONLY)) return 'pressOnly';
        if (el.matches(CARD)) return 'card';
        if (el.matches(COMPACT)) return 'compact';
        return 'full';
    }

    function cssTransform(p) {
        return `translate3d(0, ${p.ty}px, 0) scale(${p.x}, ${p.y})`;
    }

    function readPose(el) {
        const t = getComputedStyle(el).transform;
        if (!t || t === 'none') return { ...REST };
        try {
            const m = new DOMMatrixReadOnly(t);
            return { x: m.a, y: m.d, ty: m.f };
        } catch {
            return pose.get(el) || { ...REST };
        }
    }

    function stop(el) {
        const anim = running.get(el);
        if (!anim) return readPose(el);
        try {
            if (typeof anim.commitStyles === 'function') anim.commitStyles();
        } catch {
            // Keep going from the last known pose if the engine rejects commit.
        }
        const now = readPose(el);
        anim.cancel();
        running.delete(el);
        return now;
    }

    function go(el, next, duration, easing) {
        const from = stop(el);
        const keyframes = [
            { transform: cssTransform(from) },
            { transform: cssTransform(next) },
        ];
        const options = {
            duration: duration || HOVER_MS,
            easing: easing || EASE_GLIDE,
            fill: 'forwards',
        };
        let anim;
        try {
            anim = el.animate(keyframes, { ...options, composite: 'replace' });
        } catch {
            anim = el.animate(keyframes, options);
        }
        running.set(el, anim);
        pose.set(el, next);
        anim.addEventListener('finish', () => {
            if (running.get(el) === anim) running.delete(el);
        });
    }

    function hovered(el) {
        return fineHover() && el.matches(':hover') && el.dataset.aotPressed !== '1';
    }

    function rest(el) {
        go(el, REST, REST_MS, EASE_GLIDE);
    }

    function hoverIn(el) {
        if (!fineHover()) return;
        const preset = PRESETS[kindOf(el)];
        if (preset.hover.x === 1 && preset.hover.y === 1 && preset.hover.ty === 0) return;
        go(el, preset.hover, HOVER_MS, EASE_GLIDE);
    }

    function press(el) {
        el.dataset.aotPressed = '1';
        go(el, PRESETS[kindOf(el)].press, PRESS_MS, EASE_PRESS);
    }

    function release(el) {
        el.dataset.aotPressed = '0';
        if (hovered(el)) hoverIn(el);
        else rest(el);
    }

    function releaseAll() {
        document.querySelectorAll('[data-aot-pressed="1"]').forEach((node) => {
            if (node instanceof HTMLElement) release(node);
        });
    }

    function onPointerOver(event) {
        if (reduced()) return;
        const el = targetOf(event);
        if (!el || event.pointerType === 'touch') return;
        const from = event.relatedTarget;
        if (from instanceof Node && el.contains(from)) return;
        hoverIn(el);
    }

    function onPointerOut(event) {
        const el = targetOf(event);
        if (!el) return;
        const to = event.relatedTarget;
        if (to instanceof Node && el.contains(to)) return;
        if (el.dataset.aotPressed === '1') return;
        rest(el);
    }

    function onPointerDown(event) {
        if (reduced()) return;
        if (event.button != null && event.button !== 0) return;
        const el = targetOf(event);
        if (!el) return;
        if (typeof el.setPointerCapture === 'function') {
            try {
                el.setPointerCapture(event.pointerId);
            } catch {
                // Capture is optional; pointerup on document still releases.
            }
        }
        press(el);
    }

    function onPointerUp() {
        releaseAll();
    }

    document.addEventListener('pointerover', onPointerOver, true);
    document.addEventListener('pointerout', onPointerOut, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointerup', onPointerUp, true);
    document.addEventListener('pointercancel', onPointerUp, true);
    window.addEventListener('blur', releaseAll);
})();
