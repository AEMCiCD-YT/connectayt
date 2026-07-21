// Conecta Empresas 2026 — interacciones de la página

document.addEventListener('DOMContentLoaded', () => {

  /* --- Menú móvil --- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    const setMenuState = (isOpen) => {
      navToggle.classList.toggle('is-open', isOpen);
      primaryNav.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.contains('is-open');
      setMenuState(!isOpen);
    });

    // Cierra el menú al elegir una sección (mejora la navegación en móvil)
    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });
  }

  /* --- Revelado de secciones al hacer scroll --- */
  const revealTargets = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));
  }

  /* --- Diagrama de enlace: longitud real de cada línea para la animación --- */
  document.querySelectorAll('.link-lines path').forEach((path) => {
    const length = path.getTotalLength();
    path.style.setProperty('--len', length);
  });

  /* --- Validación amable del formulario de contacto --- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      const requiredFields = contactForm.querySelectorAll('[required]');
      let allValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          allValid = false;
          field.style.borderColor = 'var(--rojo-base)';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!allValid) {
        event.preventDefault();
      }
    });
  }
});
