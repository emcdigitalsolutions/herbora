/**
 * Herbora - Cookie Consent GDPR
 * Gestione banner cookie, preferenze e caricamento condizionale Google Maps
 */

(function () {
    'use strict';

    var COOKIE_KEY = 'herbora_cookie_consent';
    var COOKIE_EXPIRY_DAYS = 180;

    var banner = document.getElementById('cookieBanner');
    var modalOverlay = document.getElementById('cookieModalOverlay');
    var thirdPartyToggle = document.getElementById('cookieThirdParty');

    var btnAcceptAll = document.getElementById('cookieAcceptAll');
    var btnNecessary = document.getElementById('cookieNecessary');
    var btnSettings = document.getElementById('cookieSettings');
    var btnModalReject = document.getElementById('cookieModalReject');
    var btnModalSave = document.getElementById('cookieModalSave');

    function getConsent() {
        try {
            var stored = localStorage.getItem(COOKIE_KEY);
            if (!stored) return null;

            var consent = JSON.parse(stored);
            if (consent.expiry && Date.now() > consent.expiry) {
                localStorage.removeItem(COOKIE_KEY);
                return null;
            }
            return consent;
        } catch (e) {
            return null;
        }
    }

    function saveConsent(thirdParty) {
        var consent = {
            technical: true,
            thirdParty: thirdParty,
            expiry: Date.now() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    }

    function showBanner() {
        if (banner) {
            setTimeout(function () {
                banner.classList.add('show');
            }, 1500);
        }
    }

    function hideBanner() {
        if (banner) {
            banner.classList.remove('show');
        }
    }

    function showModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function hideModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    function loadGoogleMaps() {
        var mapContainer = document.getElementById('mapContainer');
        var mapPlaceholder = document.getElementById('mapPlaceholder');
        if (!mapContainer || !mapPlaceholder) return;

        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.0!2d12.8892!3d37.7284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x131a3c6b0a0a0a0b%3A0x0!2sVia+Vittorio+Emanuele+70%2C+91028+Partanna+TP!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.setAttribute('allowfullscreen', '');
        iframe.title = 'Google Maps - Herbora, Via Vittorio Emanuele 70, Partanna';

        mapPlaceholder.style.display = 'none';
        mapContainer.appendChild(iframe);
    }

    function showMapPlaceholder() {
        var mapPlaceholder = document.getElementById('mapPlaceholder');
        if (mapPlaceholder) {
            mapPlaceholder.style.display = 'flex';
        }
        var mapContainer = document.getElementById('mapContainer');
        if (mapContainer) {
            var existingIframe = mapContainer.querySelector('iframe');
            if (existingIframe) {
                existingIframe.remove();
            }
        }
    }

    function applyConsent(consent) {
        if (consent && consent.thirdParty) {
            loadGoogleMaps();
        } else {
            showMapPlaceholder();
        }
    }

    function handleAccept(thirdParty) {
        saveConsent(thirdParty);
        hideBanner();
        hideModal();
        applyConsent({ thirdParty: thirdParty });
    }

    function init() {
        var consent = getConsent();

        if (consent) {
            applyConsent(consent);
        } else {
            showBanner();
            showMapPlaceholder();
        }

        if (btnAcceptAll) {
            btnAcceptAll.addEventListener('click', function () {
                handleAccept(true);
            });
        }

        if (btnNecessary) {
            btnNecessary.addEventListener('click', function () {
                handleAccept(false);
            });
        }

        if (btnSettings) {
            btnSettings.addEventListener('click', function () {
                if (thirdPartyToggle) {
                    var current = getConsent();
                    thirdPartyToggle.checked = current ? current.thirdParty : false;
                }
                hideBanner();
                showModal();
            });
        }

        if (btnModalReject) {
            btnModalReject.addEventListener('click', function () {
                handleAccept(false);
            });
        }

        if (btnModalSave) {
            btnModalSave.addEventListener('click', function () {
                var thirdParty = thirdPartyToggle ? thirdPartyToggle.checked : false;
                handleAccept(thirdParty);
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) {
                    hideModal();
                    showBanner();
                }
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('show')) {
                hideModal();
                showBanner();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
