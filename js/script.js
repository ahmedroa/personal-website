// ==========================================
// NAVBAR — scroll behavior & mobile toggle
// ==========================================
const navbar   = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNavLink();
});

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('active', isOpen);
    });
}

if (navMenu) {
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentId = '';

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            currentId = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
}

// ==========================================
// PROFILE IMAGE — entrance animation
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.querySelector('.profile-image-container');
    const heroActions      = document.querySelector('.hero-actions');

    if (profileContainer) {
        setTimeout(() => {
            profileContainer.classList.add('visible-profile');
        }, 300);
    }

    if (heroActions) {
        setTimeout(() => {
            heroActions.classList.add('visible');
        }, 700);
    }
});

// ==========================================
// GENERAL SCROLL REVEAL
// ==========================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
    '.section-title, .service-card, .project-card, .gallery-item'
).forEach(el => revealObserver.observe(el));

// ==========================================
// CURSOR FOLLOWER
// ==========================================
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

(function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursorFollower.style.left = cursorX + 'px';
    cursorFollower.style.top  = cursorY + 'px';
    requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('.project-card, .social-link, .cv-download-btn, .btn-filled-hero, .btn-outline-hero')
    .forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
    });

// ==========================================
// RIPPLE EFFECT
// ==========================================
document.querySelectorAll('.project-card, .social-link, .cv-download-btn, .btn-filled-hero').forEach(el => {
    el.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect   = this.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top  - size / 2;

        Object.assign(ripple.style, {
            width: size + 'px', height: size + 'px',
            left: x + 'px', top: y + 'px',
            position: 'absolute', borderRadius: '50%',
            background: 'rgba(59,130,246,0.25)',
            transform: 'scale(0)',
            animation: 'ripple 0.55s ease-out',
            pointerEvents: 'none'
        });

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ==========================================
// MAGNETIC EFFECT on buttons
// ==========================================
document.querySelectorAll('.social-link, .cv-download-btn').forEach(el => {
    el.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width  / 2;
        const y = e.clientY - rect.top  - rect.height / 2;
        const factor = this.classList.contains('cv-download-btn') ? 0.15 : 0.3;
        this.style.transform = `translate(${x*factor}px, ${y*factor}px) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ==========================================
// PROJECTS SEARCH
// ==========================================
const projectSearch = document.getElementById('projectSearch');
if (projectSearch) {
    projectSearch.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        document.querySelectorAll('.project-card').forEach(card => {
            const name     = (card.dataset.name     || '').toLowerCase();
            const category = (card.dataset.category || '').toLowerCase();
            card.classList.toggle('hidden', query && !name.includes(query) && !category.includes(query));
        });
    });
}

// ==========================================
// CONTACT FORM — Formspree
// ==========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = this.querySelector('.submit-btn');
        const originalHTML = btn.innerHTML;

        // Loading state
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        btn.disabled = true;

        const formData = {
            name:    document.getElementById('name').value,
            email:   document.getElementById('email').value,
            phone:   document.getElementById('phone').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('https://formspree.io/f/xojpprqv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-check"></i> تم الإرسال بنجاح!';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                this.reset();
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            } else {
                throw new Error('فشل الإرسال');
            }
        } catch {
            btn.innerHTML = '<i class="fas fa-xmark"></i> حدث خطأ، حاول مجدداً';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}

// ==========================================
// REDUCE MOTION
// ==========================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}
