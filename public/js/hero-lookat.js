/*
    Hero look-at.

    The object stays in its grid slot. The mesh turns toward the cursor;
    the nucleus / glass / specular counter-rotate so they stay round volumes.
    Transforms are set on those nodes directly so cursor motion never
    invalidates CSS custom properties on the whole 3D tree.
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
    let core = null;
    let nucleus = null;
    let glass = null;
    let specular = null;
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

    function firstEnterHold() {
        const root = document.documentElement;
        return (
            root.classList.contains('aot-first-enter') &&
            !root.classList.contains('aot-first-enter-exit')
        );
    }

    function bindParts() {
        core = stage ? stage.querySelector('.hero-core') : null;
        nucleus = stage ? stage.querySelector('.hero-core__nucleus') : null;
        glass = stage ? stage.querySelector('.hero-core__glass') : null;
        specular = stage ? stage.querySelector('.hero-core__specular') : null;
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
        const yaw = currentX * MAX_YAW;
        const pitch = currentY * -MAX_PITCH;
        const yawCss = yaw.toFixed(2) + 'deg';
        const pitchCss = pitch.toFixed(2) + 'deg';
        const invYaw = (-yaw).toFixed(2) + 'deg';
        const invPitch = (-pitch).toFixed(2) + 'deg';
        const billboard = 'rotateY(' + invYaw + ') rotateX(' + invPitch + ')';

        if (core) core.style.transform = 'rotateX(' + pitchCss + ') rotateY(' + yawCss + ')';
        if (nucleus) nucleus.style.transform = billboard + ' translateZ(46px)';
        if (glass) glass.style.transform = billboard + ' translateZ(74px)';
        if (specular) specular.style.transform = billboard + ' translate3d(0, 0, 96px)';
    }

    function clearPaint() {
        if (core) core.style.removeProperty('transform');
        if (nucleus) nucleus.style.removeProperty('transform');
        if (glass) glass.style.removeProperty('transform');
        if (specular) specular.style.removeProperty('transform');
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
        if (!enabled() || firstEnterHold()) {
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
        bindParts();
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
        clearPaint();
        stage = null;
        core = null;
        nucleus = null;
        glass = null;
        specular = null;
        bounds = null;
    }

    function sync() {
        if (enabled() && !firstEnterHold()) attach();
        else detach();
    }

    function whenFirstEnterDone(fn) {
        const root = document.documentElement;
        if (!root.classList.contains('aot-first-enter')) {
            fn();
            return;
        }
        const obs = new MutationObserver(() => {
            if (!root.classList.contains('aot-first-enter')) {
                obs.disconnect();
                fn();
            }
        });
        obs.observe(root, { attributes: true, attributeFilter: ['class'] });
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
        document.addEventListener(
            'DOMContentLoaded',
            () => {
                whenFirstEnterDone(sync);
            },
            { once: true }
        );
    } else {
        whenFirstEnterDone(sync);
    }
})();
