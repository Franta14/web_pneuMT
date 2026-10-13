/**
 * ŘEMESLNÁ DÍLNA & VÝROBA — UNIVERZÁLNÍ ŠABLONA PRO ŘEMESLA
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
       3. MINIMALISTICKÝ LIGHTBOX PRO GALERII
       ========================================================================== */
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.getElementById('modal-close');
    const galleryCards = document.querySelectorAll('.gallery-card');

    const openModal = (src, title) => {
        if (!modal || !modalImg) return;
        modalImg.src = src;
        modalImg.alt = title || 'Ukázka práce';
        if (modalTitle) modalTitle.textContent = title || 'Ukázka práce';
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
            const title = card.querySelector('.gallery-card-title')?.textContent;
            if (img) {
                openModal(img.src, title);
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
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

/* ==========================================================================
   PŘÍPRAVA PRO DYNAMICKÝ CENÍK Z GOOGLE TABULEK
   ==========================================================================
   Postup:
   1. V Google Tabulce zvolte Soubor -> Sdílet -> Publikovat na webu (formát CSV).
   2. Zavolejte window.loadGoogleSheetsPricing(csvUrl).
*/
window.loadGoogleSheetsPricing = async function(csvUrl) {
    const tableBody = document.getElementById('price-table-body');
    if (!tableBody) return;

    try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        const rows = csvText.trim().split('\n').map(r => r.split(','));
        const dataRows = rows.slice(1); // vynechat záhlaví
        
        tableBody.innerHTML = '';

        dataRows.forEach(cells => {
            const [item, unit, priceWithoutVat, priceWithVat] = cells.map(c => c?.replace(/"/g, '').trim());
            if (!item) return;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="col-bold">${item}</td>
                <td class="col-unit">${unit || 'úkon'}</td>
                <td class="col-price">${priceWithoutVat || '—'}</td>
                <td class="col-price">${priceWithVat || '—'}</td>
            `;
            tableBody.appendChild(tr);
        });

        console.log(`[Ceník] Načteno ${dataRows.length} položek z Google Tabulek.`);
    } catch (err) {
        console.error('[Ceník] Chyba při načítání:', err);
    }
};
