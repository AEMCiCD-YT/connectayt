/**
 * Conecta IEEE YT 2026 — Transición Animada Cinematográfica de Logos y Páginas
 * Ejecuta una transición visual inmersiva con morphing de isotipos y auras de luz
 * al navegar entre el Hub Conecta YT, Conecta Universidades y Conecta Empresas.
 */

(function () {
  'use strict';

  // Configuración de logotipos por destino
  const BRAND_CONFIG = {
    hub: {
      src: 'assets/logos/conectayt_logo_hcolor.png',
      alt: 'Conecta YT 2026',
      glow: 'rgba(0, 188, 202, 0.65)'
    },
    universidades: {
      src: 'assets/logos/cu_logo_hcolor.png',
      alt: 'Conecta Universidades 2026',
      glow: 'rgba(251, 113, 133, 0.75)'
    },
    empresas: {
      src: 'assets/logos/ce_logo_hcolor.png',
      alt: 'Conecta Empresas 2026',
      glow: 'rgba(0, 98, 155, 0.75)'
    }
  };

  // Crear o reutilizar overlay de transición en el DOM
  function getOrCreateOverlay() {
    let overlay = document.getElementById('conectaTransitionOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'conectaTransitionOverlay';
      overlay.className = 'conecta-transition-overlay';
      overlay.innerHTML = `
        <div class="transition-portal-box">
          <div class="transition-pulse-aura"></div>
          <div class="transition-logo-container">
            <img class="transition-logo-img" src="" alt="Cargando experiencia...">
          </div>
          <div class="transition-ripple-ring"></div>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function determineTargetType(href) {
    if (href.includes('universidades')) return 'universidades';
    if (href.includes('empresas')) return 'empresas';
    return 'hub';
  }

  function resolveLogoSrc(type, currentPath) {
    const isSubdir = currentPath.includes('/universidades/') || currentPath.includes('/empresas/');
    const prefix = isSubdir ? '../' : './';
    
    if (type === 'universidades') return prefix + 'assets/logos/cu_logo_hcolor.png?v=2026.1';
    if (type === 'empresas') return prefix + 'assets/logos/ce_logo_hcolor.png?v=2026.1';
    return prefix + 'assets/logos/conectayt_logo_hcolor.png?v=2026.1';
  }

  function initPageTransitions() {
    const overlay = getOrCreateOverlay();

    // Animación de entrada al cargar la página
    window.addEventListener('pageshow', () => {
      overlay.classList.remove('is-active', 'is-animating');
      const navbarLogo = document.querySelector('.brand-logo-img, .brand-logo-hub, .brand img');
      if (navbarLogo) {
        navbarLogo.classList.remove('logo-transitioning');
        navbarLogo.classList.add('logo-enter-active');
      }
    });

    // Interceptar enlaces internos
    const links = document.querySelectorAll('a[href]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Descartar anclas, correos o externos
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        link.getAttribute('target') === '_blank'
      ) {
        return;
      }

      // Validar si navega a otra sección/página
      const isCrossPageNav = (
        href.includes('empresas') ||
        href.includes('universidades') ||
        href.includes('index.html') ||
        href === '/' ||
        href === '../' ||
        href.startsWith('./') ||
        href.startsWith('../')
      );

      if (isCrossPageNav) {
        link.addEventListener('click', (e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;

          e.preventDefault();
          const targetUrl = link.href;
          const targetType = determineTargetType(targetUrl);
          const targetLogoSrc = resolveLogoSrc(targetType, window.location.pathname);

          const overlayImg = overlay.querySelector('.transition-logo-img');
          const aura = overlay.querySelector('.transition-pulse-aura');

          if (overlayImg) {
            overlayImg.src = targetLogoSrc;
          }

          if (aura) {
            aura.style.boxShadow = `0 0 80px 40px ${BRAND_CONFIG[targetType].glow}`;
          }

          // Activar animación en el navbar
          const navbarLogo = document.querySelector('.brand-logo-img, .brand-logo-hub, .brand img');
          if (navbarLogo) {
            navbarLogo.classList.add('logo-transitioning');
          }

          // Activar overlay animado
          overlay.classList.add('is-active');
          requestAnimationFrame(() => {
            overlay.classList.add('is-animating');
          });

          // Navegar suavemente una vez completado el clímax de la animación
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 360);
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
  } else {
    initPageTransitions();
  }
})();
