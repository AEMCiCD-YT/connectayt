// Conecta Universidades 2026 — Interacciones de Gala
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

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });
  }

  /* --- Burbuja Glassmorphism dinámica al navegar / hacer scroll (Scrollspy) --- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');

  if (sections.length > 0 && navLinks.length > 0) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeId = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${activeId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-60px 0px -40% 0px' }
    );

    sections.forEach((sec) => spyObserver.observe(sec));
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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));
  }

  /* --- Validación del formulario de contacto --- */
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
        alert('Por favor complete los campos obligatorios para enviar su solicitud.');
      } else {
        event.preventDefault();
        alert('¡Gracias por su interés en Conecta Universidades 2026! El equipo organizador coordinará su mensaje en breve.');
        contactForm.reset();
      }
    });
  }
});
