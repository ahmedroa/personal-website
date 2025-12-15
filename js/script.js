// Typing Animation Effect
function typeText(element, text, speed = 100, callback) {
    element.textContent = '';
    element.classList.add('typing');
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.add('typing-complete');
            if (callback) callback();
        }
    }
    
    type();
}

// Initialize page animations
document.addEventListener('DOMContentLoaded', function() {
    const heroActions = document.querySelector('.hero-actions');
    const profileImage = document.querySelector('.profile-image-container');
    
    // Animate profile image first
    setTimeout(() => {
        profileImage.style.transition = 'all 1s ease-out';
        profileImage.style.opacity = '1';
        profileImage.style.transform = 'scale(1)';
    }, 300);

    // Show actions and features after a short delay
    setTimeout(() => {
        heroActions.classList.add('visible');
        
        // Show hero features
        setTimeout(() => {
            document.querySelectorAll('.hero-feature').forEach((feature, index) => {
                setTimeout(() => {
                    feature.classList.add('visible');
                }, index * 200);
            });
        }, 500);
    }, 800);
});

// Animate skill bars on scroll
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.skill-progress');
            const width = progressBar.getAttribute('data-width');
            setTimeout(() => {
                progressBar.style.width = width + '%';
            }, 200);
            entry.target.classList.add('visible');
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-item').forEach(item => {
    skillObserver.observe(item);
});

// Animate other sections on scroll
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .contact-item, .gallery-item').forEach(item => {
    sectionObserver.observe(item);
});


// Cursor Follower Effect
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const diffX = mouseX - cursorX;
    const diffY = mouseY - cursorY;
    
    cursorX += diffX * 0.1;
    cursorY += diffY * 0.1;
    
    cursorFollower.style.left = cursorX + 'px';
    cursorFollower.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Activate cursor follower on hover
document.querySelectorAll('.project-card, .skill-chip, .social-link, .cv-download-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('active');
    });
});

// Smooth scroll reveal with Intersection Observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('.section-title, .project-card, .skill-chip').forEach(el => {
    fadeInObserver.observe(el);
});

// Parallax effect on scroll
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
            
            ticking = false;
        });
        
        ticking = true;
    }
});

// Add ripple effect on click
document.querySelectorAll('.project-card, .skill-chip, .social-link, .cv-download-btn').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(59, 130, 246, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Smooth section transitions
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add magnetic effect to social links and CV button
document.querySelectorAll('.social-link, .cv-download-btn').forEach(link => {
    link.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        if (this.classList.contains('cv-download-btn')) {
            this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-5px) scale(1.05)`;
        } else {
            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) translateY(-5px)`;
        }
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Performance: Reduce animations on low-end devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

