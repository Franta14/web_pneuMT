/**
 * MARI&TALI TATTOO-PIERCING (KOLÍN)
 * Čistý Vanilla JavaScript bez externích knihoven.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MOBILNÍ NAVIGACE (HAMBURGER MENU)
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('is-open');
            menuToggle.classList.toggle('is-active', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-open');
                menuToggle.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ==========================================================================
       2. AKTIVNÍ STAV NAVIGAČNÍCH ODKAZŮ PŘI SCROLLOVÁNÍ
       ========================================================================== */
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ==========================================================================
       3. MINIMALISTICKÝ LIGHTBOX PRO GALERII (POUZE OBRÁZKY)
       ========================================================================== */
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.getElementById('modal-close');
    const galleryCards = document.querySelectorAll('.gallery-card');

    const openModal = (src) => {
        if (!modal || !modalImg) return;
        modalImg.src = src;
        modalImg.alt = 'Mari&Tali Tattoo-Piercing Kolín';
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
    };

    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('.gallery-card-img');
            if (img) {
                openModal(img.src);
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-body')) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
            closeModal();
        }
    });

    /* ==========================================================================
       4. TLAČÍTKO SCROLL NAHORU
       ========================================================================== */
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
