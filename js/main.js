/**
 * Herbora - Erboristeria Partanna
 * Main JavaScript: animations, carousel, form, open/closed indicator, menu
 */

(function () {
    'use strict';

    // ===== DYNAMIC DATES =====
    var ANNO_FONDAZIONE = 1997;
    var annoCorrente = new Date().getFullYear();
    var anniExp = document.getElementById('anniEsperienza');
    if (anniExp) anniExp.textContent = (annoCorrente - ANNO_FONDAZIONE) + '+';
    var annoCopy = document.getElementById('annoCopyright');
    if (annoCopy) annoCopy.textContent = annoCorrente;

    // ===== NAVBAR SCROLL =====
    var navbar = document.getElementById('navbar');
    var lastScrollY = 0;

    function handleNavbarScroll() {
        var scrollY = window.scrollY || window.pageYOffset;
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ===== MOBILE MENU =====
    var navbarToggle = document.getElementById('navbarToggle');
    var mobileOverlay = document.getElementById('mobileOverlay');
    var mobileClose = document.getElementById('mobileClose');
    var mobileLinks = document.querySelectorAll('.mobile-link');

    function openMobileMenu() {
        mobileOverlay.classList.add('active');
        navbarToggle.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileOverlay.classList.remove('active');
        navbarToggle.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    if (navbarToggle) {
        navbarToggle.addEventListener('click', function () {
            if (mobileOverlay.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }

    // Chiudi overlay toccando lo sfondo
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function (e) {
            if (e.target === mobileOverlay) {
                closeMobileMenu();
            }
        });
    }

    mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== ORGANIC ANIMATIONS (IntersectionObserver) =====
    var animationElements = document.querySelectorAll('[data-organic]');

    if ('IntersectionObserver' in window) {
        var animObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Add stagger delay for sequential elements
                    var parent = entry.target.parentElement;
                    if (parent) {
                        var siblings = parent.querySelectorAll('[data-organic]');
                        var index = Array.prototype.indexOf.call(siblings, entry.target);
                        if (index > 0) {
                            entry.target.style.animationDelay = (index * 0.15) + 's';
                        }
                    }
                    entry.target.classList.add('animated');
                    animObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animationElements.forEach(function (el) {
            animObserver.observe(el);
        });
    } else {
        // Fallback: show all immediately
        animationElements.forEach(function (el) {
            el.classList.add('animated');
        });
    }

    // ===== CAROUSEL (Drag-to-scroll) =====
    var carouselTrack = document.getElementById('carouselTrack');
    var carouselLeft = document.getElementById('carouselLeft');
    var carouselRight = document.getElementById('carouselRight');

    if (carouselTrack) {
        var isDragging = false;
        var startX = 0;
        var scrollLeft = 0;

        carouselTrack.addEventListener('mousedown', function (e) {
            isDragging = true;
            carouselTrack.style.cursor = 'grabbing';
            startX = e.pageX - carouselTrack.offsetLeft;
            scrollLeft = carouselTrack.scrollLeft;
        });

        carouselTrack.addEventListener('mouseleave', function () {
            isDragging = false;
            carouselTrack.style.cursor = 'grab';
        });

        carouselTrack.addEventListener('mouseup', function () {
            isDragging = false;
            carouselTrack.style.cursor = 'grab';
        });

        carouselTrack.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            e.preventDefault();
            var x = e.pageX - carouselTrack.offsetLeft;
            var walk = (x - startX) * 1.5;
            carouselTrack.scrollLeft = scrollLeft - walk;
        });

        // Touch support (prevent default only on horizontal swipe)
        var touchStartX = 0;
        var touchStartY = 0;

        carouselTrack.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        // Arrow buttons
        if (carouselLeft) {
            carouselLeft.addEventListener('click', function () {
                carouselTrack.scrollBy({ left: -300, behavior: 'smooth' });
            });
        }

        if (carouselRight) {
            carouselRight.addEventListener('click', function () {
                carouselTrack.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }
    }


    // ===== OPEN/CLOSED INDICATOR =====
    function updateOpenStatus() {
        var statusEl = document.getElementById('orariStatus');
        var statusText = document.getElementById('orariStatusText');
        if (!statusEl || !statusText) return;

        var now = new Date();
        var day = now.getDay(); // 0=Sun, 1=Mon...
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var currentMinutes = hours * 60 + minutes;

        var isOpen = false;

        if (day === 1) {
            // Lunedi: solo pomeriggio 16:30-19:30
            if (currentMinutes >= 990 && currentMinutes < 1170) {
                isOpen = true;
            }
        } else if (day >= 2 && day <= 6) {
            // Mar-Sab: 9:30-13:00 / 16:30-19:30
            if ((currentMinutes >= 570 && currentMinutes < 780) ||
                (currentMinutes >= 990 && currentMinutes < 1170)) {
                isOpen = true;
            }
        }
        // Domenica: chiuso

        statusEl.className = 'orari-status ' + (isOpen ? 'open' : 'closed');
        statusText.textContent = isOpen ? 'Aperto ora' : 'Chiuso';

        // Highlight today's row
        var rows = document.querySelectorAll('.orari-table tr[data-day]');
        rows.forEach(function (row) {
            row.classList.remove('today');
            if (parseInt(row.getAttribute('data-day')) === day) {
                row.classList.add('today');
            }
        });
    }

    updateOpenStatus();
    setInterval(updateOpenStatus, 60000); // Update every minute

    // ===== CONTACT FORM =====
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Add placeholder attributes for :placeholder-shown to work
        contactForm.querySelectorAll('input, textarea').forEach(function (field) {
            if (!field.getAttribute('placeholder')) {
                field.setAttribute('placeholder', ' ');
            }
        });

        contactForm.addEventListener('submit', function (e) {
            var privacyCheck = document.getElementById('formPrivacy');
            if (!privacyCheck.checked) {
                e.preventDefault();
                privacyCheck.focus();
                return;
            }

            // Visual feedback
            var submitBtn = contactForm.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.textContent = 'Invio in corso...';
                submitBtn.disabled = true;
            }
        });
    }


    // ===== INITIAL CHECK =====
    handleNavbarScroll();

})();
