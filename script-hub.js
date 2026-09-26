// Conecta IEEE YT 2026 — Script del Portal Principal (Hub)
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Countdown hero + mini (d:h:m:s, 00 si fecha pasada)
  const pad = (n) => String(n).padStart(2, '0');
  const tickCountdown = (el) => {
    const target = new Date(el.dataset.countdown).getTime();
    let diff = target - Date.now();
    if (isNaN(diff) || diff < 0) diff = 0;
    const dd = Math.floor(diff / 864e5);
    const hh = Math.floor(diff / 36e5) % 24;
    const mm = Math.floor(diff / 6e4) % 60;
    const ss = Math.floor(diff / 1e3) % 60;
    const q = (s) => el.querySelector(`[data-${s}]`);
    if (q('dd')) q('dd').textContent = pad(dd);
    if (q('hh')) q('hh').textContent = pad(hh);
    if (q('mm')) q('mm').textContent = pad(mm);
    if (q('ss')) q('ss').textContent = pad(ss);
  };
  const countdownEls = document.querySelectorAll('[data-countdown]');
  if (countdownEls.length) {
    countdownEls.forEach(tickCountdown);
    setInterval(() => countdownEls.forEach(tickCountdown), 1000);
  }

  // Mini contador visible cuando el hero sale de pantalla
  const hero = document.querySelector('.hero-hub');
  const mini = document.getElementById('miniCountdown');
  if (hero && mini && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { mini.hidden = e.isIntersecting; }).observe(hero);
  }

  // Modal de Términos y Privacidad
  const legalTriggers = document.querySelectorAll('.legal-trigger');
  const legalModal = document.getElementById('legalModal');
  const legalClose = document.getElementById('legalClose');

  if (legalModal) {
    legalTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        legalModal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      legalModal.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    if (legalClose) legalClose.addEventListener('click', closeModal);
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && legalModal.classList.contains('is-active')) {
        closeModal();
      }
    });
  }
});
