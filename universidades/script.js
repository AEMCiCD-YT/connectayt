// Conecta Universidades 2026 — Interacciones de Gala & Formulario Unificado
document.addEventListener('DOMContentLoaded', () => {

  /* --- Menú Móvil --- */
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

  /* --- Scrollspy Activo con Glassmorphism --- */
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
      { threshold: 0.25, rootMargin: '-60px 0px -40% 0px' }
    );

    sections.forEach((sec) => spyObserver.observe(sec));
  }

  /* --- Revelado Suave de Secciones --- */
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* --- Modal de Registro Unificado (Confirma tu Asistencia) --- */
  const registerTriggers = document.querySelectorAll('.btn-register-trigger');
  const registerModal = document.getElementById('registerModal');
  const registerClose = document.getElementById('registerClose');
  const registrationForm = document.getElementById('registrationForm');

  const openRegisterModal = (e) => {
    if (e) e.preventDefault();
    if (registerModal) {
      registerModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeRegisterModal = () => {
    if (registerModal) {
      registerModal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  };

  registerTriggers.forEach(btn => btn.addEventListener('click', openRegisterModal));
  if (registerClose) registerClose.addEventListener('click', closeRegisterModal);
  if (registerModal) {
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) closeRegisterModal();
    });
  }

  /* --- Validación del Formulario Unificado --- */
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailField = document.getElementById('regEmail');
      const emailVal = emailField.value.trim().toLowerCase();

      // Validación de correo institucional para estudiantes
      const userType = document.querySelector('input[name="tipoPerfil"]:checked');
      if (userType && userType.value === 'pregrado' && !emailVal.includes('.edu')) {
        alert('Por favor ingrese un correo institucional válido (.edu o .edu.ec) para validar su condición de estudiante.');
        emailField.focus();
        return;
      }

      alert('¡Confirmación exitosa! Hemos registrado tu asistencia a Conecta Universidades 2026. Te enviaremos tus credenciales y detalles de acceso al correo.');
      registrationForm.reset();
      closeRegisterModal();
    });
  }

  /* --- Modal Legal --- */
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

    const closeLegal = () => {
      legalModal.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    if (legalClose) legalClose.addEventListener('click', closeLegal);
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) closeLegal();
    });
  }

  // Tecla Escape para cerrar modales
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRegisterModal();
      if (legalModal) legalModal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  });
});
