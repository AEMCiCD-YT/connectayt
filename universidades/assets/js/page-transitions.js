/**
 * Conecta IEEE YT 2026 — Logo & Page Transition Controller
 * Proporciona transiciones animadas fluidas y efectos de morphing en los logos
 * al navegar entre el Hub Principal, Conecta Empresas y Conecta Universidades.
 */

(function () {
  'use strict';

  function initLogoTransitions() {
    const brandLogo = document.querySelector('.brand-logo-img, .brand-logo-hub, .brand img');
    if (brandLogo) {
      // Activar animación de entrada
      brandLogo.classList.add('logo-anim-ready');
      requestAnimationFrame(() => {
        brandLogo.classList.add('logo-enter-active');
      });
    }

    // Interceptar enlaces internos entre subdirecciones (Hub, Empresas, Universidades)
    const links = document.querySelectorAll('a[href]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Filtrar enlaces externos, de correo o anclas puras (#)
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        link.getAttribute('target') === '_blank'
      ) {
        return;
      }

      // Comprobar si es un enlace de navegación entre secciones/páginas
      const isInternalNav = (
        href.includes('empresas') ||
        href.includes('universidades') ||
        href.includes('index.html') ||
        href === '/' ||
        href === '../' ||
        href.startsWith('./') ||
        href.startsWith('../')
      );

      if (isInternalNav) {
        link.addEventListener('click', (e) => {
          // Si el usuario mantiene Ctrl o Command, permitir abrir en nueva pestaña
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;

          e.preventDefault();
          const targetUrl = link.href;

          if (brandLogo) {
            brandLogo.classList.add('logo-transitioning');
          }

          document.body.classList.add('page-transition-out');

          // Si el navegador soporta View Transitions nativas
          if (document.startViewTransition) {
            document.startViewTransition(() => {
              window.location.href = targetUrl;
            });
          } else {
            setTimeout(() => {
              window.location.href = targetUrl;
            }, 240);
          }
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogoTransitions);
  } else {
    initLogoTransitions();
  }
})();
