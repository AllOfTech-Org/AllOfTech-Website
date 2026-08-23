
        // Handle service selection from case studies buttons.
        // Runs once after DOMContentLoaded; observer is disconnected after the
        // first successful auto-fill so we don't keep observing forever.
        (function () {
            var observer = null;

            function isContactRoute() {
                var path = window.location.pathname.replace(/\/+$/, '') || '/';
                return path === '/contact' || window.location.hash === '#contact';
            }

            function autoFillMessage() {
                var messageField = document.getElementById('message');
                var selectedService = sessionStorage.getItem('selectedService');
                if (selectedService && messageField && !messageField.value.trim()) {
                    messageField.value = "I'm interested in learning more about: " + selectedService + "\n\n";
                    messageField.focus();
                    sessionStorage.removeItem('selectedService');
                    return true;
                }
                return false;
            }

            function bindServiceButtons() {
                document.querySelectorAll('[data-service]').forEach(function (button) {
                    if (button.dataset.aotServiceBound === '1') return;
                    button.dataset.aotServiceBound = '1';
                    button.addEventListener('click', function () {
                        var serviceName = this.getAttribute('data-service');
                        if (serviceName) sessionStorage.setItem('selectedService', serviceName);
                    });
                });
            }

            function watchContact() {
                var contactSection = document.getElementById('contact');
                if (!contactSection || !('IntersectionObserver' in window)) return;
                if (observer) observer.disconnect();
                observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) return;
                        setTimeout(function () {
                            if (autoFillMessage() && observer) observer.disconnect();
                        }, 300);
                    });
                }, { threshold: 0.3 });
                observer.observe(contactSection);
            }

            function init() {
                bindServiceButtons();
                watchContact();
                if (isContactRoute()) setTimeout(autoFillMessage, 300);
            }

            function onContactNav() {
                bindServiceButtons();
                watchContact();
                if (isContactRoute()) setTimeout(autoFillMessage, 500);
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init, { once: true });
            } else {
                init();
            }
            window.addEventListener('hashchange', onContactNav);
            window.addEventListener('popstate', onContactNav);
            window.addEventListener('aot:content-mounted', onContactNav);
        })();
