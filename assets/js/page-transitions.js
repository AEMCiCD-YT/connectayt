/**
 * Conecta IEEE YT 2026 — Transición Animada Nativa de Logotipos en Navbar
 * Anima con fluidez el logotipo oficial de la cabecera al navegar entre
 * el Hub Conecta YT, Conecta Universidades y Conecta Empresas.
 */

(function () {
  'use strict';

  function purgeOldOverlays() {
    document.querySelectorAll('#conectaTransitionOverlay, .conecta-transition-overlay').forEach((el) => {
      el.remove();
    });
  }

  // Purgar inmediatamente al cargar el script y al estar listo el DOM
  purgeOldOverlays();

  function initLogoTransitions() {
    purgeOldOverlays();

    const navbarLogo = document.querySelector('.brand-logo-img, .brand-logo-hub, .brand img');
    if (navbarLogo) {
      navbarLogo.classList.remove('logo-transitioning');
      navbarLogo.classList.add('logo-enter-active');
    }

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
    purgeOldOverlays();
    document.body.classList.remove('page-transition-out');
    const navbarLogo = document.querySelector('.brand-logo-img, .brand-logo-hub, .brand img');
    if (navbarLogo) {
      navbarLogo.classList.remove('logo-transitioning');
    }
  });
})();
