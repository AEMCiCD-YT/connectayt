/**
 * Conecta IEEE YT 2026 — Transición Animada de Logotipos en Navbar
 * Anima elegantemente el logotipo de la barra de navegación al cambiar
 * entre el Portal Hub, Conecta Universidades y Conecta Empresas.
 */

(function () {
  'use strict';

  function initLogoTransitions() {
    // Eliminar cualquier overlay previo si existiera
    const oldOverlay = document.getElementById('conectaTransitionOverlay');
    if (oldOverlay) {
      oldOverlay.remove();
    }

    const navbarLogo = document.querySelector('.brand-logo-img, .brand-logo-hub, .brand img');
    if (navbarLogo) {
      // Activar animación de entrada fluida
      navbarLogo.classList.remove('logo-transitioning');
      navbarLogo.classList.add('logo-enter-active');
    }

    // Interceptar clics en enlaces entre secciones para animar el logo
    const links = document.querySelectorAll('a[href]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        link.getAttribute('target') === '_blank'
      ) {
        return;
      }

      const isCrossNav = (
        href.includes('empresas') ||
        href.includes('universidades') ||
        href.includes('index.html') ||
        href === '/' ||
        href === '../' ||
        href.startsWith('./') ||
        href.startsWith('../')
      );

      if (isCrossNav) {
        link.addEventListener('click', (e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;

          e.preventDefault();
          const targetUrl = link.href;

          if (navbarLogo) {
            navbarLogo.classList.add('logo-transitioning');
          }

          document.body.classList.add('page-transition-out');

          setTimeout(() => {
            window.location.href = targetUrl;
          }, 180);
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogoTransitions);
  } else {
    initLogoTransitions();
  }

  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-transition-out');
    const navbarLogo = document.querySelector('.brand-logo-img, .brand-logo-hub, .brand img');
    if (navbarLogo) {
      navbarLogo.classList.remove('logo-transitioning');
    }
  });
})();
