/* ==========================================================================
   أحمد خالد — مهندس برمجيات
   Vanilla JS, no dependencies.
   ========================================================================== */
(() => {
    'use strict';

    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];

    /* ----------------------------------------------------------------------
       1. Reveal on scroll
       ---------------------------------------------------------------------- */
    const revealIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            revealIO.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    $$('[data-reveal]').forEach((el) => revealIO.observe(el));

    /* ----------------------------------------------------------------------
       2. Nav: shadow on scroll, active section, mobile menu
       ---------------------------------------------------------------------- */
    const nav = $('#nav');
    let ticking = false;
    const onScroll = () => {
        nav.classList.toggle('is-scrolled', window.scrollY > 12);
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    // Sections map to the nav item that "owns" them.
    const owner = { home: 'home', work: 'work', about: 'about', expertise: 'about', experience: 'experience', achievements: 'achievements', skills: 'achievements', contact: 'contact' };
    const navAnchors = $$('.nav__links a, .mobile-menu nav a');
    const sectionIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = owner[entry.target.id] || entry.target.id;
            navAnchors.forEach((a) => {
                const on = a.getAttribute('href') === '#' + id;
                a.classList.toggle('is-active', on);
                if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('main section[id]').forEach((s) => sectionIO.observe(s));

    const toggle = $('#navToggle');
    const menu = $('#mobileMenu');
    function setMenu(open) {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    }
    if (toggle && menu) {
        toggle.addEventListener('click', () => setMenu(menu.hidden));
        $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
        });
        document.addEventListener('click', (e) => {
            if (!menu.hidden && !nav.contains(e.target)) setMenu(false);
        });
        window.addEventListener('resize', () => { if (window.innerWidth > 960) setMenu(false); });
    }

    /* ----------------------------------------------------------------------
       3. Lightbox for achievement photos
       ---------------------------------------------------------------------- */
    const lightbox = $('#lightbox');
    if (lightbox && typeof lightbox.showModal === 'function') {
        const lbImg = $('#lightboxImg');
        const lbCap = $('#lightboxCap');
        let opener = null;
        $$('.award__media').forEach((btn) => {
            btn.addEventListener('click', () => {
                const img = $('img', btn);
                lbImg.src = img.currentSrc || img.src;
                lbImg.alt = img.alt;
                lbCap.textContent = btn.dataset.caption || '';
                opener = btn;
                lightbox.showModal();
            });
        });
        $('.lightbox__close', lightbox).addEventListener('click', () => lightbox.close());
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
        lightbox.addEventListener('close', () => { if (opener) opener.focus(); });
    }

    /* ----------------------------------------------------------------------
       4. Copy email
       ---------------------------------------------------------------------- */
    $$('[data-copy]').forEach((btn) => {
        const label = $('.channel__copied', btn);
        btn.addEventListener('click', async () => {
            const text = btn.dataset.copy;
            let ok = false;
            try {
                await navigator.clipboard.writeText(text);
                ok = true;
            } catch {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.setAttribute('readonly', '');
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try { ok = document.execCommand('copy'); } catch { ok = false; }
                ta.remove();
            }
            if (label) label.textContent = ok ? 'تم النسخ' : 'تعذّر النسخ';
            btn.classList.add('is-copied');
            clearTimeout(btn._t);
            btn._t = setTimeout(() => {
                btn.classList.remove('is-copied');
                if (label) label.textContent = '';
            }, 1800);
        });
    });

    /* ----------------------------------------------------------------------
       5. Footer year
       ---------------------------------------------------------------------- */
    const year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
})();
