
        // Image Lightbox Functionality. Uses the shared body-scroll lock from
        // templatemo-nexus-scripts.js when available so nested overlays don't
        // step on each other's body.style.overflow value.
        (function () {
            function initializeImageLightbox() {
                var lightboxOverlay = document.getElementById('imageLightboxOverlay');
                var lightboxImage = document.getElementById('lightboxImage');
                var lightboxCaption = document.getElementById('lightboxCaption');
                var lightboxClose = document.getElementById('lightboxClose');

            if (!lightboxOverlay || !lightboxImage || !lightboxCaption || !lightboxClose) {
                return;
            }
            if (lightboxOverlay.dataset.aotBound === '1') return;
            lightboxOverlay.dataset.aotBound = '1';

                var clickableImages = document.querySelectorAll('.clickable-image');
                var isOpen = false;

                function lockScroll() {
                    if (window.AllOfTechScroll && typeof window.AllOfTechScroll.lock === 'function') {
                        window.AllOfTechScroll.lock();
                    } else {
                        document.body.style.overflow = 'hidden';
                    }
                }
                function unlockScroll() {
                    if (window.AllOfTechScroll && typeof window.AllOfTechScroll.unlock === 'function') {
                        window.AllOfTechScroll.unlock();
                    } else {
                        document.body.style.overflow = '';
                    }
                }

                function openLightbox(imageSrc, imageAlt) {
                    lightboxImage.src = imageSrc;
                    lightboxImage.alt = imageAlt || '';
                    lightboxCaption.textContent = imageAlt || '';
                    lightboxOverlay.classList.add('active');
                    if (!isOpen) {
                        isOpen = true;
                        lockScroll();
                    }
                }

                function closeLightbox() {
                    if (!isOpen) return;
                    isOpen = false;
                    lightboxOverlay.classList.remove('active');
                    unlockScroll();
                }

                clickableImages.forEach(function (imageContainer) {
                    imageContainer.addEventListener('click', function (e) {
                        if (e.target.closest('.cs-site-badge')) return;
                        e.preventDefault();
                        var imageSrc = this.getAttribute('data-image-src');
                        var imageAlt = this.getAttribute('data-image-alt');
                        if (imageSrc) openLightbox(imageSrc, imageAlt);
                    });
                    imageContainer.style.cursor = 'pointer';
                });

                lightboxImage.addEventListener('error', function () {
                    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%231a0b2e" width="800" height="600"/%3E%3Ctext fill="%2300ffff" font-family="monospace" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                });

                lightboxClose.addEventListener('click', closeLightbox);
                lightboxOverlay.addEventListener('click', function (e) {
                    if (e.target === lightboxOverlay) closeLightbox();
                });

                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape' && isOpen) closeLightbox();
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeImageLightbox, { once: true });
            } else {
                initializeImageLightbox();
            }
            window.addEventListener('aot:content-mounted', initializeImageLightbox);
        })();

        // Brand portfolio filter (Case Study 4)
        (function () {
            function initBrandFilter() {
                var filterBar = document.querySelector('.brand-filter-bar');
                if (!filterBar || filterBar.dataset.aotBound === '1') return;
                filterBar.dataset.aotBound = '1';

                var buttons = filterBar.querySelectorAll('.brand-filter-btn');
                var tiles = document.querySelectorAll('.brand-tile');

                buttons.forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var filter = btn.getAttribute('data-filter');
                        buttons.forEach(function (b) { b.classList.remove('active'); });
                        btn.classList.add('active');
                        tiles.forEach(function (tile) {
                            var category = tile.getAttribute('data-category');
                            if (filter === 'all' || category === filter) {
                                tile.classList.remove('is-hidden');
                            } else {
                                tile.classList.add('is-hidden');
                            }
                        });
                    });
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initBrandFilter, { once: true });
            } else {
                initBrandFilter();
            }
            window.addEventListener('aot:content-mounted', initBrandFilter);
        })();

        // Silent looping case-study reels — decode and play only while on screen.
        (function () {
            var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var observer = null;

            function forcePlay(el) {
                if (reduceMotion || !el || document.hidden) return;
                el.defaultMuted = true;
                el.muted = true;
                el.playsInline = true;
                el.loop = true;
                if (el.preload === 'none') el.preload = 'metadata';
                var attempt = el.play();
                if (attempt) void attempt.catch(function () {});
            }

            function pauseOffscreen(el) {
                if (!el || el.paused) return;
                el.pause();
            }

            function ensureObserver() {
                if (observer || typeof IntersectionObserver === 'undefined') return observer;
                observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) forcePlay(entry.target);
                        else pauseOffscreen(entry.target);
                    });
                }, { rootMargin: '80px 0px', threshold: 0.2 });
                return observer;
            }

            function initLoopVideos() {
                document.querySelectorAll('video.cs-loop-video').forEach(function (el) {
                    if (el.dataset.aotBound === '1') return;
                    el.dataset.aotBound = '1';
                    el.addEventListener('ended', function () { forcePlay(el); });
                    var io = ensureObserver();
                    if (io) io.observe(el);
                    else forcePlay(el);
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initLoopVideos, { once: true });
            } else {
                initLoopVideos();
            }
            window.addEventListener('aot:content-mounted', initLoopVideos);
            document.addEventListener('visibilitychange', function () {
                document.querySelectorAll('video.cs-loop-video').forEach(function (el) {
                    if (document.hidden) pauseOffscreen(el);
                    else if (el.dataset.aotBound === '1') {
                        var rect = el.getBoundingClientRect();
                        if (rect.top < window.innerHeight && rect.bottom > 0) forcePlay(el);
                    }
                });
            });
        })();
    