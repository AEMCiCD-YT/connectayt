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
