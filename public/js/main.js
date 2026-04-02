/**
 * Rohullah Rassuli Tiling Services — Client-Side JavaScript
 * Vanilla JS only. No frameworks.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. Mobile Hamburger Menu ───
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.querySelector('.nav-mobile');

  function openMenu() {
    document.body.classList.add('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    document.body.classList.remove('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.classList.contains('nav-open') ? closeMenu() : openMenu();
    });
  }

  // Close on mobile nav link click
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      document.body.classList.contains('nav-open') &&
      hamburger &&
      !hamburger.contains(e.target) &&
      mobileNav &&
      !mobileNav.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeMenu();
      hamburger?.focus();
    }
  });

  // ─── 2. Scroll Fade-In Animations ───
  const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in');

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeElements.forEach((el) => obs.observe(el));
  } else {
    fadeElements.forEach((el) => el.classList.add('visible'));
  }

  // ─── 3. Sticky Header ───
  const header = document.querySelector('.site-header');

  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── 4. Smooth Scroll for Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth',
      });
    });
  });

  // ─── 5. Mobile Sticky CTA Bar ───
  const ctaBar = document.getElementById('mobile-cta-bar');
  if (ctaBar) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      ctaBar.classList.toggle('cta-hidden', y > lastY && y > 100);
      lastY = y;
    }, { passive: true });
  }

  // ─── 6. Form Validation ───
  document.querySelectorAll('.contact-form').forEach((form) => {
    function showError(field, msg) {
      clearError(field);
      field.classList.add('field-error');
      const el = document.createElement('span');
      el.className = 'error-message';
      el.setAttribute('role', 'alert');
      el.textContent = msg;
      field.parentNode.appendChild(el);
    }

    function clearError(field) {
      field.classList.remove('field-error');
      const ex = field.parentNode.querySelector('.error-message');
      if (ex) ex.remove();
    }

    function validate(field) {
      const v = field.value.trim();
      if (field.hasAttribute('required') && !v) {
        showError(field, 'This field is required.');
        return false;
      }
      if (field.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        showError(field, 'Please enter a valid email address.');
        return false;
      }
      if (field.type === 'tel' && v && !/^\+?[\d\s\-()]{7,20}$/.test(v)) {
        showError(field, 'Please enter a valid phone number.');
        return false;
      }
      clearError(field);
      return true;
    }

    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach((f) => f.addEventListener('blur', () => validate(f)));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      fields.forEach((f) => { if (!validate(f)) ok = false; });
      if (!ok) return;

      form.reset();
      fields.forEach((f) => clearError(f));

      let msg = form.querySelector('.form-success');
      if (!msg) {
        msg = document.createElement('div');
        msg.className = 'form-success';
        msg.setAttribute('role', 'status');
        form.appendChild(msg);
      }
      msg.textContent = 'Thank you! Your message has been sent successfully.';
      setTimeout(() => { if (msg) msg.textContent = ''; }, 5000);
    });
  });
});
