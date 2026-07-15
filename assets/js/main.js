// ===========================================================
// Bastion Recruitment — shared site behavior
// Mobile nav, header scroll state, scroll-reveal, job filters, form validation
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initYear();
  initJobFilters();
  initFormValidation();
  initImageAccordion();
});

/* ---------------- Header scroll state ---------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------------- Mobile nav ---------------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------- Scroll reveal (IntersectionObserver) ---------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el, i) => {
    if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i % 6);
    observer.observe(el);
  });
}

/* ---------------- Footer year ---------------- */
function initYear() {
  document.querySelectorAll('#year').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------------- Interactive image accordion ---------------- */
function initImageAccordion() {
  const container = document.querySelector('.img-accordion');
  const items = document.querySelectorAll('.img-accordion-item');
  if (!items.length) return;

  const activate = (item) => {
    items.forEach((el) => el.classList.remove('is-active'));
    item.classList.add('is-active');
  };

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => activate(item));
    item.addEventListener('focus', () => activate(item));
    item.addEventListener('click', () => activate(item));
  });

  if (!container) return;

  // Touch: let a finger drag across the strip to "scrub" between panels,
  // since there's no hover on phones. Only hijacks the gesture once it's
  // clearly horizontal, so normal page scrolling still works.
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let horizontal = false;

  container.addEventListener('touchstart', (e) => {
    dragging = true;
    horizontal = false;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (!horizontal) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      horizontal = Math.abs(dx) > Math.abs(dy);
      if (!horizontal) { dragging = false; return; }
    }

    e.preventDefault();
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const item = target && target.closest('.img-accordion-item');
    if (item) activate(item);
  }, { passive: false });

  container.addEventListener('touchend', () => { dragging = false; });
  container.addEventListener('touchcancel', () => { dragging = false; });
}

/* ---------------- Job category filter (static cards) ---------------- */
function initJobFilters() {
  const pills = document.querySelectorAll('.job-filter-pill');
  const cards = document.querySelectorAll('[data-job-category]');
  if (!pills.length || !cards.length) return;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      const category = pill.dataset.category;

      cards.forEach((card) => {
        const matches = category === 'all' || card.dataset.jobCategory === category;
        card.style.display = matches ? '' : 'none';
      });
    });
  });
}

/* ---------------- Form validation (Contact / vacancy / candidate forms) ---------------- */
function initFormValidation() {
  document.querySelectorAll('form[data-validate]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach((field) => {
        const wrapper = field.closest('.field');
        const value = field.value.trim();
        let fieldValid = value.length > 0;

        if (fieldValid && field.type === 'email') {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        if (wrapper) wrapper.classList.toggle('has-error', !fieldValid);
        if (!fieldValid) valid = false;
      });

      const status = form.querySelector('.form-status');
      if (status) {
        status.classList.remove('success', 'error');
        if (valid) {
          status.textContent = "Thanks — your message has been sent. We'll be in touch within one business day.";
          status.classList.add('success');
          form.reset();
        } else {
          status.textContent = 'Please fill in the highlighted fields correctly.';
          status.classList.add('error');
        }
      }
    });

    form.querySelectorAll('[required]').forEach((field) => {
      field.addEventListener('input', () => {
        const wrapper = field.closest('.field');
        if (wrapper && field.value.trim()) wrapper.classList.remove('has-error');
      });
    });
  });

  // Pre-fill subject field on contact page from query string (e.g. ?role=)
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  const subjectField = document.getElementById('subject');
  if (role && subjectField && !subjectField.value) subjectField.value = `Application interest: ${role}`;
}
