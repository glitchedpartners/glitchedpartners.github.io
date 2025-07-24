/* =========================================================
   SolaRé – premium.js
   One-file enhancement script
   • Smooth scrolling & current-section nav highlight
   • Scroll-reveal animationsIntersection Observer)
   • Animated number counters
   • FAQ accordion
   • Gallery category filter
   • Real-time form validation
   • Floating WhatsApp button
   • Graceful fallbacks & accessibility
   ========================================================= */

/* ---------- 1.  Helpers ---------- */
const $ = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const inViewOptions = { threshold: 0.15 };

/* ---------- 2. Smooth-scroll & nav highlight ---------- */
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = $(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* highlight current section in nav */
const sections = $$('main section[id]');
const navLinks = $$('nav a');
const navHighlight = () => {
  const scrollPos = window.scrollY + window.innerHeight / 3;
  sections.forEach(sec => {
    const { top, bottom } = sec.getBoundingClientRect();
    const inView = top + window.scrollY <= scrollPos && bottom + window.scrollY >= scrollPos;
    navLinks.forEach(l => l.classList.toggle('active', inView && l.hash === `#${sec.id}`));
  });
};
navHighlight();
window.addEventListener('scroll', navHighlight);

/* ---------- 3. Scroll-reveal ---------- */
if (!prefersReducedMotion) {
  const ioReveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        ioReveal.unobserve(entry.target);
      }
    });
  }, inViewOptions);
  $$('[class*="animate-on-scroll"]').forEach(el => ioReveal.observe(el));
}

/* ---------- 4. Animated counters ---------- */
const counters = $$('.stat-number');
if (!prefersReducedMotion) {
  const ioCounter = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const end = parseInt(el.textContent.replace(/\D/g, ''), 10);
        const duration = 1200;
        let startTime = null;
        const step = ts => {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          el.textContent = `${Math.floor(progress * end)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (el.dataset.unit || '');
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        ioCounter.unobserve(el);
      }
    });
  }, inViewOptions);
  counters.forEach(c => ioCounter.observe(c));
}

/* ---------- 5. FAQ accordion ---------- */
$$('.faq-item').forEach(item => {
  const btn = $('.faq-question', item);
  btn.addEventListener('click', () => {
    item.classList.toggle('active');
    btn.setAttribute('aria-expanded', item.classList.contains('active'));
  });
});

/* ---------- 6. Gallery filter ---------- */
const galleryBtns = $$('.filter-btn');
const galleryItems = $$('.gallery-item');
galleryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    galleryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(it => {
      it.style.display = filter === 'all' || it.dataset.category === filter ? 'block' : 'none';
    });
  });
});

/* ---------- 7. Form validation ---------- */
const form = $('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    let valid = true;
    $$('input[required], textarea[required]', form).forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.setAttribute('aria-invalid', 'true');
        input.parentElement.querySelector('.error-message')?.remove();
        const msg = document.createElement('div');
        msg.className = 'error-message';
        msg.textContent = 'Required field';
        input.after(msg);
      }
    });
    if (!valid) e.preventDefault();
  });
  /* live clear */
  $$('input, textarea', form).forEach(input =>
    input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
      input.parentElement.querySelector('.error-message')?.remove();
    })
  );
}

/* ---------- 8. Floating WhatsApp --------- */
(() => {
  const wBtn = document.createElement('a');
  wBtn.href = 'https://wa.me/923390015006';
  wBtn.target = '_blank';
  wBtn.className = 'whatsapp-float';
  wBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
  document.body.appendChild(wBtn);
})();

/* ---------- 9. Lazy-load Gallery Images (optional polyfill for older browsers) ---------- */
if ('loading' in HTMLImageElement.prototype === false) {
  import('https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js');
}

/* ---------- 10. Accessibility & reduced-motion clean-up ---------- */
if (prefersReducedMotion) {
  document.documentElement.classList.add('reduced-motion');
}
