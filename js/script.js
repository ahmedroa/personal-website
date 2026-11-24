/* ==========================================================================
   أحمد خالد — مهندس برمجيات
   Vanilla JS, no dependencies.
   ========================================================================== */
(() => {
    'use strict';

    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];

    // UI strings follow the page language (index.html = Arabic, en/ = English)
    const isEn = (document.documentElement.lang || '').toLowerCase().startsWith('en');
    const T = isEn
        ? { openMenu: 'Open menu', closeMenu: 'Close menu', copied: 'Copied', copyFailed: "Couldn't copy" }
        : { openMenu: 'فتح القائمة', closeMenu: 'إغلاق القائمة', copied: 'تم النسخ', copyFailed: 'تعذّر النسخ' };

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

    let revealStarted = false;
    function startReveal() {
        if (revealStarted) return;
        revealStarted = true;
        $$('[data-reveal]').forEach((el) => revealIO.observe(el));
    }

    /* ----------------------------------------------------------------------
       1b. Splash — a "build graph": the <AhmedKhalid /> component types
           itself, real app icons and awards connect to it, then everything
           collapses into the centre and the page appears.
           The head script decides whether it plays (once per session,
           never with reduced motion). Click or any key skips it.
       ---------------------------------------------------------------------- */
    const root = document.documentElement;
    const splash = $('#splash');

    function runSplash() {
        try { sessionStorage.setItem('splashSeen', '1'); } catch { /* storage blocked: fine */ }

        const timers = [];
        const later = (fn, ms) => timers.push(setTimeout(fn, ms));

        // fit the 600px graph to small screens: radii shrink with k, nodes a bit less
        const k = Math.min(1, (window.innerWidth - 24) / 600, (window.innerHeight - 210) / 600);
        const ns = Math.max(0.78, k);
        splash.style.setProperty('--k', k.toFixed(3));
        splash.style.setProperty('--ns', ns.toFixed(3));

        const svg = $('.sx__wires', splash);
        const half = 300 * k;
        svg.setAttribute('viewBox', `${-half} ${-half} ${half * 2} ${half * 2}`);
        const SVG_NS = 'http://www.w3.org/2000/svg';

        const nodes = $$('.sx__node', splash);
        const wires = nodes.map((node, i) => {
            const a = (Number(node.dataset.a) * Math.PI) / 180;
            const r = Number(node.dataset.r) * k;
            const isAward = node.classList.contains('sx__node--award');
            node.style.setProperty('--x', (Math.cos(a) * r).toFixed(1) + 'px');
            node.style.setProperty('--y', (Math.sin(a) * r).toFixed(1) + 'px');
            node.style.setProperty('--i', i);
            const from = 62 * k;                       // just outside the core card
            const to = r - (isAward ? 30 : 46) * ns;   // stop short of the node
            const line = document.createElementNS(SVG_NS, 'line');
            line.setAttribute('x1', (Math.cos(a) * from).toFixed(1));
            line.setAttribute('y1', (Math.sin(a) * from).toFixed(1));
            line.setAttribute('x2', (Math.cos(a) * to).toFixed(1));
            line.setAttribute('y2', (Math.sin(a) * to).toFixed(1));
            line.setAttribute('pathLength', '1');
            if (isAward) line.classList.add('is-award');
            svg.appendChild(line);
            return line;
        });

        const code = $('.sx__code', splash);
        code.style.setProperty('--n', code.textContent.length);
        later(() => splash.classList.add('is-typing'), 200);

        // apps pop first, awards follow on the outer ring (~4.5s in total)
        let appIndex = 0;
        let awardIndex = 0;
        nodes.forEach((node, i) => {
            const at = node.classList.contains('sx__node--award')
                ? 1950 + awardIndex++ * 230
                : 750 + appIndex++ * 220;
            later(() => wires[i].classList.add('is-on'), at - 140);
            later(() => node.classList.add('is-on'), at);
        });
        later(() => {
            splash.classList.add('is-collapse');
            setTimeout(finish, 720);
        }, 3600);

        let finished = false;
        function finish() {
            if (finished) return;
            finished = true;
            timers.forEach(clearTimeout);
            document.removeEventListener('keydown', finish);
            splash.classList.add('is-out');
            root.classList.remove('splash-active');
            startReveal();
            setTimeout(() => splash.remove(), 600);
        }
        splash.addEventListener('click', finish);
        document.addEventListener('keydown', finish);
    }

    if (splash && root.classList.contains('splash-active')) {
        runSplash();
    } else {
        if (splash) splash.remove();
        startReveal();
    }

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
    const owner = { home: 'home', work: 'work', about: 'about', expertise: 'about', achievements: 'achievements', skills: 'achievements', contact: 'contact' };
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
        toggle.setAttribute('aria-label', open ? T.closeMenu : T.openMenu);
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
            if (label) label.textContent = ok ? T.copied : T.copyFailed;
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
