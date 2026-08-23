/*
    Hero look-at.

    The object stays in its grid slot. The mesh turns toward the cursor;
    the nucleus counter-rotates so it stays a round volume, and the
    highlight slides with --hero-look-nx/ny.
*/
(function () {
    'use strict';

    if (window.__aotHeroLookAt) return;
    window.__aotHeroLookAt = true;

    const MAX_YAW = 22;
    const MAX_PITCH = 16;
    const LERP = 0.16;
    const EPSILON = 0.0005;

    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopMq = window.matchMedia('(min-width: 981px)');

    let stage = null;
    let active = false;
    let frame = 0;
    let bounds = null;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function enabled() {
        return !reducedMotionMq.matches && desktopMq.matches;
    }

    function measure() {
        if (!stage) return;
        const rect = stage.getBoundingClientRect();
        bounds = rect.width && rect.height ? rect : null;
    }

    function clamp(value) {
        return value < -1 ? -1 : value > 1 ? 1 : value;
    }

    function paint() {
        if (!stage) return;
        stage.style.setProperty('--hero-look-x', (currentX * MAX_YAW).toFixed(2) + 'deg');
        stage.style.setProperty('--hero-look-y', (currentY * -MAX_PITCH).toFixed(2) + 'deg');
        stage.style.setProperty('--hero-look-nx', currentX.toFixed(3));
        stage.style.setProperty('--hero-look-ny', currentY.toFixed(3));
    }

    function tick() {
        currentX += (targetX - currentX) * LERP;
        currentY += (targetY - currentY) * LERP;

        const settled =
            Math.abs(targetX - currentX) < EPSILON && Math.abs(targetY - currentY) < EPSILON;
        if (settled) {
            currentX = targetX;
            currentY = targetY;
        }

        paint();

        if (!active) {
            frame = 0;
            return;
        }
        frame = settled ? 0 : requestAnimationFrame(tick);
    }

    function schedule() {
        if (frame || !active) return;
        frame = requestAnimationFrame(tick);
    }

    function onPointerMove(event) {
        if (event.pointerType === 'touch') return;
        if (stage && stage.closest('.is-aot-paused')) return;
        if (!bounds) measure();
        if (!bounds) return;

        const cx = bounds.left + bounds.width / 2;
        const cy = bounds.top + bounds.height / 2;
        const spanX = Math.max(cx, window.innerWidth - cx) || 1;
        const spanY = Math.max(cy, window.innerHeight - cy) || 1;

        targetX = clamp((event.clientX - cx) / spanX);
        targetY = clamp((event.clientY - cy) / spanY);
        schedule();
    }

    function onPointerLeave() {
        targetX = 0;
        targetY = 0;
        schedule();
    }

    function onViewportChange() {
        measure();
    }

    function unbind() {
        document.removeEventListener('pointermove', onPointerMove);
        document.documentElement.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('scroll', onViewportChange);
        window.removeEventListener('resize', onViewportChange);
        if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
        }
    }

    function attach() {
        if (!enabled()) {
            detach();
            return;
        }

        const next = document.querySelector('.hero-object__stage');
        if (!next) return;

        if (active && stage === next) {
            measure();
            return;
        }

        unbind();
        stage = next;
        active = true;
        measure();
        document.addEventListener('pointermove', onPointerMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onPointerLeave, { passive: true });
        window.addEventListener('scroll', onViewportChange, { passive: true });
        window.addEventListener('resize', onViewportChange, { passive: true });
    }

    function detach() {
        unbind();
        active = false;
        targetX = 0;
        targetY = 0;
        currentX = 0;
        currentY = 0;
        if (stage) {
            stage.style.removeProperty('--hero-look-x');
            stage.style.removeProperty('--hero-look-y');
            stage.style.removeProperty('--hero-look-nx');
            stage.style.removeProperty('--hero-look-ny');
        }
        stage = null;
        bounds = null;
    }

    function sync() {
        if (enabled()) attach();
        else detach();
    }

    function bindMediaListener(mq, handler) {
        if (typeof mq.addEventListener === 'function') mq.addEventListener('change', handler);
        else if (typeof mq.addListener === 'function') mq.addListener(handler);
    }

    bindMediaListener(reducedMotionMq, sync);
    bindMediaListener(desktopMq, sync);

    window.addEventListener('aot:content-mounted', () => {
        active = false;
        requestAnimationFrame(sync);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sync, { once: true });
    } else {
        sync();
    }
})();
