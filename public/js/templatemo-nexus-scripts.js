/*

TemplateMo 594 nexus flow

https://templatemo.com/tm-594-nexus-flow

*/

// JavaScript Document
(function () {
    'use strict';

    // ---------------------------------------------------------------------
    // Shared environment helpers (motion, viewport, body-scroll lock)
    // ---------------------------------------------------------------------
    const reducedMotionMq =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerMq =
        window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)');
    const mobileMq = window.matchMedia && window.matchMedia('(max-width: 768px)');
    const desktopMq = window.matchMedia && window.matchMedia('(min-width: 1024px)');

    let prefersReducedMotion = reducedMotionMq ? reducedMotionMq.matches : false;
    let isCoarsePointer = coarsePointerMq ? coarsePointerMq.matches : false;
    let isMobile = mobileMq ? mobileMq.matches : false;
    let isDesktop = desktopMq ? desktopMq.matches : true;

    function bindMediaListener(mq, handler) {
        if (!mq) return;
        if (typeof mq.addEventListener === 'function') {
            mq.addEventListener('change', handler);
        } else if (typeof mq.addListener === 'function') {
            mq.addListener(handler);
        }
    }

    // Coordinated body-scroll lock — prevents the mobile menu, service modals
    // and lightboxes from clobbering each other's body.style.overflow value.
    let bodyLockCount = 0;
    function lockBodyScroll() {
        bodyLockCount += 1;
        if (bodyLockCount === 1) {
            document.body.style.overflow = 'hidden';
        }
    }
    function unlockBodyScroll() {
        if (bodyLockCount === 0) return;
        bodyLockCount -= 1;
        if (bodyLockCount === 0) {
            document.body.style.overflow = '';
        }
    }
    // Expose so other scripts (chatbot, lightbox) can reuse the same counter.
    window.AllOfTechScroll = {
        lock: lockBodyScroll,
        unlock: unlockBodyScroll,
    };

    function isMobilePerformanceMode() {
        return isMobile;
    }

    function isDesktopMotionEnabled() {
        return (
            !prefersReducedMotion &&
            !isCoarsePointer &&
            desktopMq &&
            desktopMq.matches
        );
    }

    function syncMotionDesktopClass() {
        const root = document.documentElement;
        const enabled = isDesktopMotionEnabled();
        root.classList.toggle('motion-desktop', enabled);
        root.classList.toggle('aot-lite', isMobile || isCoarsePointer);
        const progress = document.querySelector('.scroll-progress');
        if (progress) {
            if (enabled) {
                progress.removeAttribute('hidden');
            } else {
                progress.setAttribute('hidden', '');
            }
        }
    }

    bindMediaListener(reducedMotionMq, (ev) => {
        prefersReducedMotion = ev.matches;
        syncMotionDesktopClass();
    });
    bindMediaListener(coarsePointerMq, (ev) => {
        isCoarsePointer = ev.matches;
        syncMotionDesktopClass();
    });
    bindMediaListener(desktopMq, () => {
        isDesktop = desktopMq.matches;
        syncMotionDesktopClass();
    });

    onReady(syncMotionDesktopClass);

    // ---------------------------------------------------------------------
    // Intro preloader
    // ---------------------------------------------------------------------
    function initializeSitePreloader() {
        document.getElementById('sitePreloader')?.remove();
        document.body.classList.add('is-site-ready');
        window.dispatchEvent(new Event('aot:preloader-done'));
    }

    onReady(initializeSitePreloader);

    // ---------------------------------------------------------------------
    // Mobile menu
    // ---------------------------------------------------------------------
    function mobileMenuIsOpen() {
        const menu = document.getElementById('mobileMenu');
        return Boolean(menu && menu.classList.contains('active'));
    }

    function openMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay) return;
        if (mobileMenuIsOpen()) return;

        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        lockBodyScroll();

        const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-nav a');
        mobileMenuLinks.forEach((link, index) => {
            link.style.animation = 'none';
            link.style.opacity = '0';
            link.style.transform = 'translateX(20px)';
            setTimeout(() => {
                link.style.animation = 'slideInLeft 0.4s ease forwards';
            }, 250 + index * 100);
        });

        const mobileMenuCta = mobileMenu.querySelector('.mobile-menu-cta');
        if (mobileMenuCta) {
            mobileMenuCta.style.animation = 'none';
            mobileMenuCta.style.opacity = '0';
            mobileMenuCta.style.transform = 'translateY(20px)';
            setTimeout(() => {
                mobileMenuCta.style.animation = 'slideInUp 0.4s ease forwards';
            }, 100);
        }
    }

    function closeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        if (!mobileMenuIsOpen()) {
            mobileMenuBtn?.classList.remove('active');
            mobileMenuBtn?.setAttribute('aria-expanded', 'false');
            mobileMenu?.classList.remove('active');
            mobileMenuOverlay?.classList.remove('active');
            return;
        }
        mobileMenuBtn?.classList.remove('active');
        mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        mobileMenu?.classList.remove('active');
        mobileMenuOverlay?.classList.remove('active');
        unlockBodyScroll();
    }

    function initializeMobileMenu() {
        if (window.__aotMobileMenuBound) {
            closeMobileMenu();
            return;
        }
        window.__aotMobileMenuBound = true;

        document.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;

            if (target.closest('#mobileMenuBtn')) {
                e.preventDefault();
                e.stopPropagation();
                if (mobileMenuIsOpen()) closeMobileMenu();
                else openMobileMenu();
                return;
            }

            if (target.closest('#mobileMenuClose') || target.closest('#mobileMenuOverlay')) {
                e.preventDefault();
                e.stopPropagation();
                closeMobileMenu();
                return;
            }

            if (target.closest('#mobileMenu a')) {
                const link = target.closest('a');
                if (link && link.getAttribute('href') === '#') e.preventDefault();
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuIsOpen()) closeMobileMenu();
        });

        bindMediaListener(mobileMq, (ev) => {
            isMobile = ev.matches;
            if (!ev.matches) closeMobileMenu();
        });

        document.addEventListener(
            'touchmove',
            (e) => {
                const target = e.target;
                if (target instanceof Element && target.closest('#mobileMenu')) {
                    e.stopPropagation();
                }
            },
            { passive: true }
        );
    }

    onReady(initializeMobileMenu);

    // ---------------------------------------------------------------------
    // Background effects (matrix rain / particles / data streams)
    // ---------------------------------------------------------------------
    const MATRIX_CHARS = 'A L L O F T E C H AI ML WEB DEV UX UI N8N DATA CLOUD CODE 0 1 {} <> [] () # @';

    function generateMatrixRain() {
        const matrixRain = document.getElementById('matrixRain');
        if (!matrixRain) return;
        const maxColumns = 40;
        const columns = Math.min(Math.floor(window.innerWidth / 24), maxColumns);
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = `${i * 20}px`;
            column.style.animationDuration = `${Math.random() * 5 + 10}s`;
            column.style.animationDelay = `${Math.random() * 5}s`;
            let text = '';
            const charCount = Math.floor(Math.random() * 20 + 10);
            for (let j = 0; j < charCount; j++) {
                text += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] + ' ';
            }
            column.textContent = text;
            fragment.appendChild(column);
        }
        matrixRain.appendChild(fragment);
    }

    function generateParticles() {
        const particlesContainer = document.getElementById('particlesContainer');
        if (!particlesContainer) return;
        const particleCount = window.innerWidth < 1200 ? 30 : 40;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 20}s`;
            fragment.appendChild(particle);
        }
        particlesContainer.appendChild(fragment);
    }

    function generateDataStreams() {
        const dataStreams = document.getElementById('dataStreams');
        if (!dataStreams) return;
        const streamCount = 6;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < streamCount; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            stream.style.top = `${Math.random() * 100}%`;
            stream.style.left = '-300px';
            stream.style.animationDelay = `${Math.random() * 5}s`;
            stream.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
            fragment.appendChild(stream);
        }
        dataStreams.appendChild(fragment);
    }

    function setupBackgroundEffects() {
        if (prefersReducedMotion || isMobilePerformanceMode()) return;
        const matrixRain = document.getElementById('matrixRain');
        if (matrixRain && matrixRain.childElementCount === 0) generateMatrixRain();
        const particlesContainer = document.getElementById('particlesContainer');
        if (particlesContainer && particlesContainer.childElementCount === 0) generateParticles();
        const dataStreams = document.getElementById('dataStreams');
        if (dataStreams && dataStreams.childElementCount === 0) generateDataStreams();
    }

    onReady(setupBackgroundEffects);
    window.addEventListener('aot:content-mounted', setupBackgroundEffects);

    // Regenerate background pieces when the viewport changes, but throttle and
    // skip on phones (CSS already hides them there).
    let resizeRafId = 0;
    let resizeTimer = 0;
    window.addEventListener(
        'resize',
        () => {
            if (prefersReducedMotion) return;
            if (resizeRafId) cancelAnimationFrame(resizeRafId);
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeRafId = requestAnimationFrame(() => {
                    resizeRafId = 0;
                    const matrixRain = document.getElementById('matrixRain');
                    if (!matrixRain) return;
                    matrixRain.textContent = '';
                    if (!isMobilePerformanceMode()) generateMatrixRain();
                });
            }, 250);
        },
        { passive: true }
    );

    // ---------------------------------------------------------------------
    // Pointer effects: orb parallax (throttled with rAF, off on touch/reduced motion)
    // ---------------------------------------------------------------------
    let orbs = null;
    let pointerX = 0;
    let pointerY = 0;
    let pointerHasMoved = false;
    let pointerFrame = 0;

    window.addEventListener('aot:content-mounted', () => {
        orbs = document.querySelectorAll('.orb');
    });

    function pointerEffectsEnabled() {
        return isDesktopMotionEnabled();
    }

    function applyPointerEffects() {
        pointerFrame = 0;
        if (!pointerHasMoved) return;
        if (!pointerEffectsEnabled()) return;

        if (!orbs || orbs.length === 0) orbs = document.querySelectorAll('.orb');
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.02;
            const x = (pointerX - halfW) * speed;
            const y = (pointerY - halfH) * speed;
            orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
    }

    function onPointerMove(e) {
        pointerX = e.clientX;
        pointerY = e.clientY;
        pointerHasMoved = true;
        if (pointerFrame) return;
        pointerFrame = requestAnimationFrame(applyPointerEffects);
    }

    function attachPointerEffects() {
        if (!pointerEffectsEnabled()) return;
        document.addEventListener('mousemove', onPointerMove, { passive: true });
    }

    function detachPointerEffects() {
        document.removeEventListener('mousemove', onPointerMove);
        if (pointerFrame) {
            cancelAnimationFrame(pointerFrame);
            pointerFrame = 0;
        }
    }

    onReady(attachPointerEffects);

    bindMediaListener(reducedMotionMq, (ev) => {
        prefersReducedMotion = ev.matches;
        if (prefersReducedMotion) detachPointerEffects();
        else attachPointerEffects();
    });
    bindMediaListener(coarsePointerMq, (ev) => {
        isCoarsePointer = ev.matches;
        if (isCoarsePointer) detachPointerEffects();
        else attachPointerEffects();
    });
    bindMediaListener(desktopMq, (ev) => {
        isDesktop = ev.matches;
        if (!isDesktop) detachPointerEffects();
        else attachPointerEffects();
    });

    // Instant in-page jumps for leftover hash targets — known sections
    // are rewritten to clean paths by SiteChrome before this runs.
    onReady(() => {
        document.addEventListener(
            'click',
            (e) => {
                if (e.defaultPrevented) return;
                const target = e.target;
                if (!(target instanceof Element)) return;
                const anchor = target.closest('a[href]');
                if (!anchor) return;
                const href = anchor.getAttribute('href');
                if (!href || href.charAt(0) !== '#' || href.length <= 1) return;
                if (href === '#top') {
                    e.preventDefault();
                    window.scrollTo(0, 0);
                    return;
                }
                let section = null;
                try {
                    section = document.querySelector(href);
                } catch (_) {
                    return;
                }
                if (!section) return;
                e.preventDefault();
                section.scrollIntoView({ block: 'start' });
            },
            true
        );
    });

    // ---------------------------------------------------------------------
    // Navbar scroll state (rAF throttled, passive)
    // ---------------------------------------------------------------------
    onReady(() => {
        const nav = document.querySelector('nav');
        if (!nav) return;
        let scrollScheduled = false;
        let lastY = window.scrollY;

        function update() {
            scrollScheduled = false;
            nav.classList.toggle('nav-scrolled', lastY > 100);
        }

        window.addEventListener(
            'scroll',
            () => {
                lastY = window.scrollY;
                if (scrollScheduled) return;
                scrollScheduled = true;
                requestAnimationFrame(update);
            },
            { passive: true }
        );
        nav.classList.toggle('nav-scrolled', window.scrollY > 100);
    });

    // ---------------------------------------------------------------------
    // Desktop motion: hero intro, grid parallax, scroll progress, reveals
    // ---------------------------------------------------------------------
    const HERO_INTRO_SESSION_KEY = 'aotHeroIntroSeen';
    let gridParallaxActive = false;
    let gridParallaxFrame = 0;
    let gridTargetX = 0;
    let gridTargetY = 0;
    let gridCurrentX = 0;
    let gridCurrentY = 0;
    const GRID_PARALLAX_MAX = 12;
    const GRID_PARALLAX_LERP = 0.06;

    function initHeroIntro() {
        const root = document.documentElement;
        if (!isDesktopMotionEnabled()) {
            root.classList.add('hero-intro-complete');
            return;
        }
        if (sessionStorage.getItem(HERO_INTRO_SESSION_KEY) === '1') {
            root.classList.add('hero-intro-complete');
            return;
        }

        function finishIntro() {
            root.classList.remove('hero-intro-pending');
            root.classList.add('hero-intro-complete');
            sessionStorage.setItem(HERO_INTRO_SESSION_KEY, '1');
        }

        function startIntro() {
            if (root.classList.contains('hero-intro-complete')) return;
            root.classList.add('hero-intro-pending');
            const flowWipe = document.querySelector('.hero-wipe--flow');
            if (!flowWipe) {
                finishIntro();
                return;
            }
            let done = false;
            function complete() {
                if (done) return;
                done = true;
                finishIntro();
            }
            flowWipe.addEventListener('animationend', complete, { once: true });
            setTimeout(complete, 1600);
        }

        if (document.body.classList.contains('is-site-ready')) {
            startIntro();
            return;
        }

        const preloader = document.getElementById('sitePreloader');
        if (!preloader) {
            startIntro();
            return;
        }

        const bodyObserver = new MutationObserver(() => {
            if (document.body.classList.contains('is-site-ready')) {
                bodyObserver.disconnect();
                startIntro();
            }
        });
        bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    function gridParallaxTick() {
        gridCurrentX += (gridTargetX - gridCurrentX) * GRID_PARALLAX_LERP;
        gridCurrentY += (gridTargetY - gridCurrentY) * GRID_PARALLAX_LERP;
        const overlay = document.querySelector('.grid-overlay');
        if (overlay) {
            overlay.style.transform = `translate3d(${gridCurrentX}px, ${gridCurrentY}px, 0)`;
        }
        if (gridParallaxActive) {
            gridParallaxFrame = requestAnimationFrame(gridParallaxTick);
        }
    }

    function onGridParallaxMove(e) {
        if (!isDesktopMotionEnabled()) return;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        gridTargetX = nx * GRID_PARALLAX_MAX;
        gridTargetY = ny * GRID_PARALLAX_MAX;
    }

    function attachGridParallax() {
        if (!isDesktopMotionEnabled() || gridParallaxActive) return;
        gridParallaxActive = true;
        document.addEventListener('mousemove', onGridParallaxMove, { passive: true });
        gridParallaxFrame = requestAnimationFrame(gridParallaxTick);
    }

    function detachGridParallax() {
        if (!gridParallaxActive) return;
        gridParallaxActive = false;
        document.removeEventListener('mousemove', onGridParallaxMove);
        if (gridParallaxFrame) {
            cancelAnimationFrame(gridParallaxFrame);
            gridParallaxFrame = 0;
        }
        gridTargetX = 0;
        gridTargetY = 0;
        gridCurrentX = 0;
        gridCurrentY = 0;
        const overlay = document.querySelector('.grid-overlay');
        if (overlay) overlay.style.transform = '';
    }

    function initScrollProgress() {
        const bar = document.querySelector('.scroll-progress__bar');
        if (!bar) return;
        let scheduled = false;

        function update() {
            scheduled = false;
            if (!isDesktopMotionEnabled()) return;
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
            bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
        }

        window.addEventListener(
            'scroll',
            () => {
                if (!isDesktopMotionEnabled()) return;
                if (scheduled) return;
                scheduled = true;
                requestAnimationFrame(update);
            },
            { passive: true }
        );
        update();
    }

    function revealFadeUpElement(el) {
        el.classList.add('visible');
        if (el.id === 'services' && isDesktopMotionEnabled()) {
            el.querySelectorAll('.feature-card').forEach((card, index) => {
                card.style.setProperty('--stagger-index', String(index));
                requestAnimationFrame(() => {
                    card.classList.add('is-revealed');
                });
            });
        }
    }

    onReady(() => {
        initHeroIntro();
        if (isDesktopMotionEnabled()) {
            attachGridParallax();
        }
        initScrollProgress();

        const fadeEls = document.querySelectorAll('.fade-up');
        if (!fadeEls.length) return;

        if (!isDesktopMotionEnabled()) {
            fadeEls.forEach((el) => el.classList.add('visible'));
            return;
        }

        if (!('IntersectionObserver' in window)) {
            fadeEls.forEach(revealFadeUpElement);
            return;
        }

        const fadeObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        revealFadeUpElement(entry.target);
                        fadeObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        fadeEls.forEach((el) => fadeObserver.observe(el));
    });

    bindMediaListener(reducedMotionMq, () => {
        if (!isDesktopMotionEnabled()) detachGridParallax();
        else attachGridParallax();
    });
    bindMediaListener(coarsePointerMq, () => {
        if (!isDesktopMotionEnabled()) detachGridParallax();
        else attachGridParallax();
    });
    bindMediaListener(desktopMq, () => {
        if (!isDesktopMotionEnabled()) detachGridParallax();
        else attachGridParallax();
    });

    // ---------------------------------------------------------------------
    // Stats counter — reusable CountUp (800ms ease-out, desktop motion only)
    // ---------------------------------------------------------------------
    function countUpElement(stat, durationMs) {
        if (stat.dataset.countAnimated === '1') return;
        const original = stat.textContent.trim();
        const match = original.match(/(\d+)/);
        if (!match || match.index === undefined) {
            stat.dataset.countAnimated = '1';
            return;
        }
        const target = parseInt(match[0], 10);
        if (!Number.isFinite(target)) {
            stat.dataset.countAnimated = '1';
            return;
        }
        const prefix = original.slice(0, match.index);
        const suffix = original.slice(match.index + match[0].length);
        stat.dataset.countAnimated = '1';

        if (!isDesktopMotionEnabled()) return;

        const duration = durationMs || 800;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(1, elapsed / duration);
            const eased = 1 - Math.pow(1 - progress, 2);
            const value = Math.round(target * eased);
            stat.textContent = prefix + value + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                stat.textContent = original;
            }
        }

        stat.textContent = prefix + '0' + suffix;
        requestAnimationFrame(step);
    }

    function animateStats(section) {
        section.querySelectorAll('.stat-number, .about-future-stat-number').forEach((stat, index) => {
            if (isDesktopMotionEnabled()) {
                window.setTimeout(() => countUpElement(stat, 1100), index * 120);
            } else {
                countUpElement(stat, 800);
            }
        });
    }

    onReady(() => {
        const statsSections = document.querySelectorAll('.stats');
        if (!statsSections.length) return;
        if (!('IntersectionObserver' in window)) {
            statsSections.forEach(animateStats);
            return;
        }
        const statsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateStats(entry.target);
                        statsObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
        );
        statsSections.forEach((section) => {
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
                animateStats(section);
            } else {
                statsObserver.observe(section);
            }
        });
    });

    // ---------------------------------------------------------------------
    // FAQ accordion
    // ---------------------------------------------------------------------
    function initializeFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;
        faqItems.forEach((item) => {
            const trigger = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!trigger || !answer || trigger.dataset.aotBound === '1') return;
            trigger.dataset.aotBound = '1';
            trigger.addEventListener('click', () => {
                const wasOpen = item.classList.contains('is-open');
                faqItems.forEach((other) => {
                    other.classList.remove('is-open');
                    const otherBtn = other.querySelector('.faq-question');
                    const otherAnswer = other.querySelector('.faq-answer');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    if (otherAnswer) otherAnswer.hidden = true;
                });
                if (!wasOpen) {
                    item.classList.add('is-open');
                    trigger.setAttribute('aria-expanded', 'true');
                    answer.hidden = false;
                }
            });
        });
    }

    onReady(initializeFaqAccordion);

    // ---------------------------------------------------------------------
    // Decorative "cyber text" overlay — desktop only, pauses when hidden
    // ---------------------------------------------------------------------
    const CYBER_TEXTS = [
        'STARTING UP...',
        'TURNING TECHNOLOGY INTO GROWTH',
        'BUILD SMART. GROW FAST',
        'Application Live',
    ];

    let cyberTextInterval = 0;

    function ensureFadeOutKeyframes() {
        if (document.getElementById('aot-cyber-fade-style')) return;
        const style = document.createElement('style');
        style.id = 'aot-cyber-fade-style';
        style.textContent = `
@keyframes fadeOut {
    0% { opacity: 0.7; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-50px); }
}`;
        document.head.appendChild(style);
    }

    function spawnCyberText() {
        if (document.hidden) return;
        const text = CYBER_TEXTS[Math.floor(Math.random() * CYBER_TEXTS.length)];
        const node = document.createElement('div');
        node.textContent = text;
        node.style.cssText = `
            position: fixed;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            color: var(--primary-cyan);
            font-size: 0.8rem;
            font-weight: 700;
            z-index: 1000;
            opacity: 0.7;
            pointer-events: none;
            animation: fadeOut 3s ease-out forwards;
            text-shadow: 0 0 10px var(--primary-cyan);
        `;
        document.body.appendChild(node);
        const cleanupHandler = () => {
            if (node.parentNode) node.parentNode.removeChild(node);
        };
        node.addEventListener('animationend', cleanupHandler, { once: true });
        // Fallback in case the animationend event is missed (tab switch etc.)
        setTimeout(cleanupHandler, 3500);
    }

    function startCyberTextLoop() {
        if (cyberTextInterval) return;
        if (prefersReducedMotion || !isDesktop) return;
        ensureFadeOutKeyframes();
        cyberTextInterval = setInterval(spawnCyberText, 5000);
    }

    function stopCyberTextLoop() {
        if (!cyberTextInterval) return;
        clearInterval(cyberTextInterval);
        cyberTextInterval = 0;
    }

    onReady(startCyberTextLoop);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopCyberTextLoop();
        else startCyberTextLoop();
    });
    bindMediaListener(reducedMotionMq, () => {
        if (prefersReducedMotion) stopCyberTextLoop();
        else startCyberTextLoop();
    });
    bindMediaListener(desktopMq, () => {
        if (!isDesktop) stopCyberTextLoop();
        else startCyberTextLoop();
    });

    // ---------------------------------------------------------------------
    // Service modals
    // ---------------------------------------------------------------------
    function initializeServiceModals() {
        const modalOverlay = document.getElementById('serviceModalOverlay');
        if (!modalOverlay || modalOverlay.dataset.aotBound === '1') return;
        modalOverlay.dataset.aotBound = '1';
        const serviceCards = document.querySelectorAll('.clickable-service');
        const modals = modalOverlay.querySelectorAll('.service-modal');
        const closeButtons = modalOverlay.querySelectorAll('.modal-close');
        const relatedServiceCards = modalOverlay.querySelectorAll('.related-service-card');
        let openModalEl = null;

        function openModal(serviceType) {
            const target = document.getElementById(`modal-${serviceType}`);
            if (!target) return;
            modals.forEach((modal) => modal.classList.remove('active'));
            target.classList.add('active');
            if (!modalOverlay.classList.contains('active')) {
                modalOverlay.classList.add('active');
                lockBodyScroll();
            }
            openModalEl = target;
            generateModalBackground(serviceType);
        }

        function closeModal() {
            if (!modalOverlay.classList.contains('active')) return;
            modalOverlay.classList.remove('active');
            modals.forEach((modal) => modal.classList.remove('active'));
            openModalEl = null;
            unlockBodyScroll();
        }

        serviceCards.forEach((card) => {
            card.addEventListener('click', function () {
                const serviceType = this.getAttribute('data-service');
                if (serviceType) openModal(serviceType);
            });
        });

        relatedServiceCards.forEach((card) => {
            card.addEventListener('click', function (e) {
                e.stopPropagation();
                const serviceType = this.getAttribute('data-service');
                if (serviceType) openModal(serviceType);
            });
        });

        closeButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                closeModal();
            });
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && openModalEl) closeModal();
        });
    }

    function generateModalBackground(serviceType) {
        // Skip the heavy in-modal effects on phone-class hardware.
        if (isMobilePerformanceMode()) return;
        const modal = document.getElementById(`modal-${serviceType}`);
        if (!modal || modal.dataset.bgReady === '1') return;
        modal.dataset.bgReady = '1';

        const matrixRain = modal.querySelector('.modal-matrix-rain');
        const particles = modal.querySelector('.modal-particles');

        if (matrixRain && matrixRain.children.length === 0) {
            const columns = Math.max(0, Math.floor(modal.offsetWidth / 20));
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < columns; i++) {
                const column = document.createElement('div');
                column.className = 'matrix-column';
                column.style.left = `${i * 20}px`;
                column.style.animationDuration = `${Math.random() * 5 + 10}s`;
                column.style.animationDelay = `${Math.random() * 5}s`;
                let text = '';
                const charCount = Math.floor(Math.random() * 15 + 8);
                for (let j = 0; j < charCount; j++) {
                    text += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] + ' ';
                }
                column.textContent = text;
                fragment.appendChild(column);
            }
            matrixRain.appendChild(fragment);
        }

        if (particles && particles.children.length === 0) {
            const particleCount = 20;
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 20}s`;
                particle.style.animationDuration = `${Math.random() * 10 + 20}s`;
                fragment.appendChild(particle);
            }
            particles.appendChild(fragment);
        }
    }

    onReady(initializeServiceModals);

    // ---------------------------------------------------------------------
    // Contact + review forms (server SMTP)
    // ---------------------------------------------------------------------
    function postMail(url, payload) {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).then(async (response) => {
            let data = {};
            try {
                data = await response.json();
            } catch (err) {
                data = {};
            }
            if (!response.ok || !data.ok) {
                throw new Error('send-failed');
            }
        });
    }

    function initializeContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm || contactForm.dataset.aotBound === '1') return;
        contactForm.dataset.aotBound = '1';
        const contactFeedback = document.getElementById('contactFormFeedback');

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const message = document.getElementById('message')?.value.trim();
            const service = document.getElementById('service')?.value?.trim() || '';

            if (!name || !email || !message) {
                alert('Please fill out all required fields.');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton?.textContent || 'Send Message';
            const richSubmit = isDesktopMotionEnabled();

            if (submitButton) {
                submitButton.disabled = true;
                if (richSubmit) {
                    submitButton.classList.add('is-loading');
                } else {
                    submitButton.textContent = 'Sending...';
                }
            }
            if (richSubmit && contactFeedback) {
                contactFeedback.hidden = true;
                contactFeedback.classList.remove('is-visible', 'is-success');
            }

            postMail('/api/contact', { name, email, message, service })
                .then(() => {
                    if (richSubmit && contactFeedback) {
                        contactForm.reset();
                        contactFeedback.textContent =
                            'Message sent — we\'ll reply within 24 hours.';
                        contactFeedback.hidden = false;
                        requestAnimationFrame(() => {
                            contactFeedback.classList.add('is-visible', 'is-success');
                        });
                    } else {
                        alert('Message sent successfully!');
                        this.reset();
                    }
                })
                .catch(() => {
                    console.error('Contact send failed');
                    alert('Failed to send message. Please try again later or contact us directly at contact@alloftech.site');
                })
                .finally(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.classList.remove('is-loading');
                        if (!richSubmit) {
                            submitButton.textContent = originalButtonText;
                        }
                    }
                });
        });
    }

    // ---------------------------------------------------------------------
    // Hero ticker: seamless loop, duration synced to content width
    // ---------------------------------------------------------------------
    function initHeroTicker() {
        const track = document.querySelector('.hero-ticker__track');
        if (!track || track.dataset.tickerReady === '1') return;

        let groups = track.querySelectorAll('.hero-ticker__group');
        if (groups.length === 1) {
            const clone = groups[0].cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
            groups = track.querySelectorAll('.hero-ticker__group');
        }

        if (groups.length < 2) return;

        track.dataset.tickerReady = '1';

        if (prefersReducedMotion) {
            track.style.animation = 'none';
            return;
        }

        const syncDuration = () => {
            const firstGroup = track.querySelector('.hero-ticker__group');
            if (!firstGroup) return;
            const groupWidth = firstGroup.getBoundingClientRect().width;
            if (groupWidth <= 0) return;
            const pxPerSecond = isMobile ? 72 : 92;
            const duration = Math.max(24, groupWidth / pxPerSecond);
            track.style.setProperty('--hero-ticker-duration', `${duration}s`);
        };

        syncDuration();
        requestAnimationFrame(syncDuration);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(syncDuration).catch(function () {});
        }
        let tickerResizeRaf = 0;
        window.addEventListener(
            'resize',
            () => {
                if (tickerResizeRaf) return;
                tickerResizeRaf = requestAnimationFrame(() => {
                    tickerResizeRaf = 0;
                    syncDuration();
                });
            },
            { passive: true }
        );
    }

    // ---------------------------------------------------------------------
    // Reviews marquee: rAF auto-scroll, pauses when off-screen or hidden
    // ---------------------------------------------------------------------
    let teardownReviewsMarquee = null;

    function initializeReviewsMarquee() {
        const root = document.querySelector('[data-reviews-marquee]');
        const viewport = document.getElementById('reviews-marquee-viewport');
        const track = root && root.querySelector('.reviews-marquee-track');
        if (!root || !viewport || !track) return;
        if (viewport.dataset.marqueeReady === '1') return;

        if (typeof teardownReviewsMarquee === 'function') {
            teardownReviewsMarquee();
            teardownReviewsMarquee = null;
        }

        const originals = Array.from(track.querySelectorAll('.review-card:not([data-review-clone])'));
        if (!originals.length) return;

        viewport.dataset.marqueeReady = '1';

        if (!track.querySelector('[data-review-clone]')) {
            const cloneFragment = document.createDocumentFragment();
            originals.forEach((card) => {
                const clone = card.cloneNode(true);
                clone.setAttribute('data-review-clone', '');
                clone.setAttribute('aria-hidden', 'true');
                cloneFragment.appendChild(clone);
            });
            track.appendChild(cloneFragment);
        }

        const AUTO_PX_PER_SEC = 72;
        const RESUME_MS = 2200;

        let position = 0;
        let loopWidth = 0;
        let cardStep = 0;
        let autoplayActive = !prefersReducedMotion;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartPos = 0;
        let resumeTimer = 0;
        let lastTs = 0;
        let pageVisible = !document.hidden;
        let rafId = 0;
        let metricsRaf = 0;

        function isInView() {
            const rect = viewport.getBoundingClientRect();
            return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
        }

        let visible = isInView();

        function readGapPx() {
            const gapCss = getComputedStyle(track).columnGap || getComputedStyle(track).gap;
            const parsed = parseFloat(gapCss);
            return Number.isFinite(parsed) ? parsed : 20;
        }

        function applyTransform() {
            track.style.transform = `translate3d(${position}px, 0, 0)`;
        }

        function wrapPosition() {
            if (!loopWidth) return;
            while (position <= -loopWidth) position += loopWidth;
            while (position > 0) position -= loopWidth;
        }

        function visibleCountForWidth(width) {
            if (width < 700) return 1;
            if (width < 1100) return 2;
            return 4;
        }

        function measureLoopWidth() {
            const cards = track.querySelectorAll('.review-card');
            const first = cards[0];
            const firstClone = cards[originals.length];
            if (!first || !firstClone) return 0;
            const width = firstClone.offsetLeft - first.offsetLeft;
            return width > 0 ? width : 0;
        }

        function updateMetrics() {
            const styles = getComputedStyle(viewport);
            const padL = parseFloat(styles.paddingLeft) || 0;
            const padR = parseFloat(styles.paddingRight) || 0;
            const inner = Math.max(0, viewport.clientWidth - padL - padR);
            const gap = readGapPx();
            const n = visibleCountForWidth(viewport.clientWidth);
            const basis = Math.max(220, (inner - (n - 1) * gap) / n);
            viewport.style.setProperty('--review-card-basis', `${basis}px`);

            loopWidth = measureLoopWidth();
            cardStep = basis + gap;

            wrapPosition();
            applyTransform();
            kickTick();
        }

        function scheduleMetrics() {
            if (metricsRaf) return;
            metricsRaf = requestAnimationFrame(() => {
                metricsRaf = 0;
                updateMetrics();
            });
        }

        function scheduleResumeAutoplay() {
            if (prefersReducedMotion) {
                autoplayActive = false;
                return;
            }
            clearTimeout(resumeTimer);
            autoplayActive = false;
            resumeTimer = setTimeout(() => {
                autoplayActive = true;
                resumeTimer = 0;
                kickTick();
            }, RESUME_MS);
        }

        function finishDrag() {
            if (!isDragging) return;
            isDragging = false;
            viewport.classList.remove('is-dragging');
            track.classList.remove('is-dragging');
            wrapPosition();
            applyTransform();
            scheduleResumeAutoplay();
        }

        function onPointerDown(e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            isDragging = true;
            viewport.classList.add('is-dragging');
            track.classList.add('is-dragging');
            dragStartX = e.clientX;
            dragStartPos = position;
            clearTimeout(resumeTimer);
            resumeTimer = 0;
            autoplayActive = false;
            try {
                viewport.setPointerCapture(e.pointerId);
            } catch (_) {}
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            position = dragStartPos + (e.clientX - dragStartX);
            wrapPosition();
            applyTransform();
        }

        function onPointerUp(e) {
            if (!isDragging) return;
            try {
                viewport.releasePointerCapture(e.pointerId);
            } catch (_) {}
            finishDrag();
        }

        function onLostCapture() {
            if (isDragging) finishDrag();
        }

        function onKeydown(e) {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            e.preventDefault();
            clearTimeout(resumeTimer);
            resumeTimer = 0;
            autoplayActive = false;
            const dir = e.key === 'ArrowLeft' ? -1 : 1;
            position += dir * cardStep;
            wrapPosition();
            applyTransform();
            scheduleResumeAutoplay();
        }

        viewport.addEventListener('pointerdown', onPointerDown);
        viewport.addEventListener('pointermove', onPointerMove);
        viewport.addEventListener('pointerup', onPointerUp);
        viewport.addEventListener('pointercancel', onPointerUp);
        viewport.addEventListener('lostpointercapture', onLostCapture);
        viewport.addEventListener('keydown', onKeydown);

        function shouldRun() {
            return Boolean(
                loopWidth &&
                    visible &&
                    pageVisible &&
                    autoplayActive &&
                    !isDragging &&
                    !prefersReducedMotion
            );
        }

        function tick(ts) {
            if (!shouldRun()) {
                rafId = 0;
                lastTs = 0;
                return;
            }
            if (!lastTs) lastTs = ts;
            const dt = Math.min(64, ts - lastTs) / 1000;
            lastTs = ts;
            position -= AUTO_PX_PER_SEC * dt;
            wrapPosition();
            applyTransform();
            rafId = requestAnimationFrame(tick);
        }

        function kickTick() {
            if (rafId || !shouldRun()) return;
            lastTs = 0;
            rafId = requestAnimationFrame(tick);
        }

        const ro = ('ResizeObserver' in window)
            ? new ResizeObserver(() => scheduleMetrics())
            : null;
        if (ro) ro.observe(viewport);
        else window.addEventListener('resize', scheduleMetrics, { passive: true });

        function onLoad() {
            updateMetrics();
        }
        if (document.readyState !== 'complete') {
            window.addEventListener('load', onLoad, { once: true });
        }
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(updateMetrics).catch(() => {});
        }

        let io = null;
        if ('IntersectionObserver' in window) {
            io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        visible = entry.isIntersecting;
                        if (!visible) lastTs = 0;
                        else kickTick();
                    });
                },
                { threshold: 0, rootMargin: '80px 0px' }
            );
            io.observe(viewport);
        } else {
            visible = true;
        }

        function onVisibility() {
            pageVisible = !document.hidden;
            if (!pageVisible) lastTs = 0;
            else kickTick();
        }
        document.addEventListener('visibilitychange', onVisibility);

        function onMotionPref(ev) {
            if (ev.matches) {
                autoplayActive = false;
                clearTimeout(resumeTimer);
                resumeTimer = 0;
            } else {
                autoplayActive = true;
                kickTick();
            }
        }
        bindMediaListener(reducedMotionMq, onMotionPref);

        updateMetrics();
        kickTick();

        teardownReviewsMarquee = function () {
            if (rafId) cancelAnimationFrame(rafId);
            if (metricsRaf) cancelAnimationFrame(metricsRaf);
            clearTimeout(resumeTimer);
            ro?.disconnect();
            io?.disconnect();
            window.removeEventListener('resize', scheduleMetrics);
            window.removeEventListener('load', onLoad);
            document.removeEventListener('visibilitychange', onVisibility);
            viewport.removeEventListener('pointerdown', onPointerDown);
            viewport.removeEventListener('pointermove', onPointerMove);
            viewport.removeEventListener('pointerup', onPointerUp);
            viewport.removeEventListener('pointercancel', onPointerUp);
            viewport.removeEventListener('lostpointercapture', onLostCapture);
            viewport.removeEventListener('keydown', onKeydown);
            delete viewport.dataset.marqueeReady;
            rafId = 0;
            metricsRaf = 0;
        };
    }

    // ---------------------------------------------------------------------
    // Reviews submission form
    // ---------------------------------------------------------------------
    function initializeReviewSection() {
        const reviewToggleBtn = document.getElementById('reviewToggleBtn');
        const reviewFormPanel = document.getElementById('reviewFormPanel');
        const reviewForm = document.getElementById('review-form');
        const reviewRatingInput = document.getElementById('review_rating');
        const ratingButtons = document.querySelectorAll('.rating-star-btn');
        const ratingHelperText = document.getElementById('ratingHelperText');

        if (!reviewToggleBtn || !reviewFormPanel || !reviewForm) return;
        if (reviewToggleBtn.dataset.aotBound === '1') return;
        reviewToggleBtn.dataset.aotBound = '1';

        function setStarRating(ratingValue) {
            const numericRating = Number(ratingValue);
            if (!reviewRatingInput || !Number.isFinite(numericRating)) return;
            reviewRatingInput.value = String(numericRating);
            ratingButtons.forEach((button) => {
                const buttonRating = Number(button.getAttribute('data-rating'));
                button.classList.toggle('active', buttonRating <= numericRating);
            });
            if (ratingHelperText) {
                ratingHelperText.textContent = `${numericRating} star${numericRating > 1 ? 's' : ''} selected`;
            }
        }

        ratingButtons.forEach((button) => {
            button.addEventListener('click', () => {
                setStarRating(button.getAttribute('data-rating'));
            });
        });

        reviewToggleBtn.addEventListener('click', () => {
            const wasOpen = reviewToggleBtn.getAttribute('aria-expanded') === 'true';
            reviewToggleBtn.setAttribute('aria-expanded', String(!wasOpen));
            reviewFormPanel.hidden = wasOpen;
        });

        reviewForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const reviewName = document.getElementById('review_name')?.value.trim();
            const reviewOccupation = document.getElementById('review_occupation')?.value.trim() || 'Not provided';
            const reviewRating = document.getElementById('review_rating')?.value.trim();
            const reviewMessage = document.getElementById('review_message')?.value.trim();

            if (!reviewName || !reviewRating || !reviewMessage) {
                alert('Please fill out your name, star rating, and main review.');
                return;
            }

            const submitButton = reviewForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton?.textContent || 'Submit Review';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';
            }

            postMail('/api/review', {
                name: reviewName,
                occupation: reviewOccupation === 'Not provided' ? '' : reviewOccupation,
                rating: Number(reviewRating),
                message: reviewMessage,
            })
                .then(() => {
                    alert('Thank you! Your review has been submitted successfully.');
                    reviewForm.reset();
                    reviewFormPanel.hidden = true;
                    reviewToggleBtn.setAttribute('aria-expanded', 'false');
                    ratingButtons.forEach((button) => button.classList.remove('active'));
                    if (ratingHelperText) {
                        ratingHelperText.textContent = 'Click a star to set rating';
                    }
                })
                .catch(() => {
                    console.error('Review send failed');
                    alert('Failed to submit review. Please try again later.');
                })
                .finally(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                    }
                });
        });
    }

    // Initialize forms after DOM is ready.
    onReady(() => {
        initHeroTicker();
        requestAnimationFrame(() => {
            initializeContactForm();
            initializeReviewsMarquee();
            initializeReviewSection();
        });
    });

    function bootInteractivePage() {
        initializeFaqAccordion();
        initializeServiceModals();
        initializeContactForm();
        initializeReviewsMarquee();
        initializeReviewSection();
        initHeroTicker();
        document.querySelectorAll('.fade-up').forEach((el) => el.classList.add('visible'));
        document.querySelectorAll('#services .feature-card').forEach((card) => {
            card.classList.add('is-revealed');
        });
    }
    window.addEventListener('aot:content-mounted', () => {
        requestAnimationFrame(bootInteractivePage);
    });

    // ---------------------------------------------------------------------
    // Utility: run on DOM ready (handles late-loaded scripts as well)
    // ---------------------------------------------------------------------
    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    }
})();
