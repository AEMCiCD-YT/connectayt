/**
 * Conecta YT 2026 - Directorio de Comités Organizadores
 * Script interactivo: Búsqueda en tiempo real, filtros por categoría y navegación
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navegación Móvil
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('is-open');
    });

    // Cerrar nav al hacer clic en enlaces
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
      });
    });
  }

  // 2. Elementos de filtrado y búsqueda
  const searchInput = document.getElementById('memberSearch');
  const clearSearchBtn = document.getElementById('clearSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const committeeSections = document.querySelectorAll('.committee-section-block');
  const noResultsBox = document.getElementById('noResults');

  let activeCategory = 'all';
  let searchTerm = '';

  // Función principal de filtrado
  function applyFilters() {
    let totalVisibleMembers = 0;
    const normalizedQuery = searchTerm.trim().toLowerCase();

    committeeSections.forEach(section => {
      const sectionCategory = section.getAttribute('data-category');
      const matchesCategory = (activeCategory === 'all' || activeCategory === sectionCategory);

      if (!matchesCategory) {
        section.style.display = 'none';
        return;
      }

      // Filtrar filas de integrantes dentro de esta sección
      let visibleMembersInSection = 0;
      const rows = section.querySelectorAll('.roster-row');

      rows.forEach(row => {
        const name = (row.getAttribute('data-name') || '').toLowerCase();
        const role = (row.getAttribute('data-role') || '').toLowerCase();
        const rowText = row.textContent.toLowerCase();

        const matchesSearch = !normalizedQuery || 
                              name.includes(normalizedQuery) || 
                              role.includes(normalizedQuery) || 
                              rowText.includes(normalizedQuery);

        if (matchesSearch) {
          row.style.display = '';
          visibleMembersInSection++;
          totalVisibleMembers++;
        } else {
          row.style.display = 'none';
        }
      });

      // Ocultar sección completa si no tiene miembros visibles
      if (visibleMembersInSection === 0) {
        section.style.display = 'none';
      } else {
        section.style.display = '';
      }
    });

    // Control del Empty State
    if (noResultsBox) {
      if (totalVisibleMembers === 0) {
        noResultsBox.style.display = 'block';
      } else {
        noResultsBox.style.display = 'none';
      }
    }
  }

  // Eventos de Búsqueda
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchTerm.length > 0 ? 'block' : 'none';
      }
      applyFilters();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchTerm = '';
      clearSearchBtn.style.display = 'none';
      applyFilters();
    });
  }

  // Eventos de Filtro por Categoría
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      activeCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();

      // Si seleccionó una sección específica y no está en vista, scroll suave
      if (activeCategory !== 'all') {
        const targetSection = document.getElementById(activeCategory);
        if (targetSection && targetSection.style.display !== 'none') {
          const headerOffset = 90;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Soporte para URL hash al cargar (ej. comites/#desarrollo-web)
  if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    const matchingBtn = document.querySelector(`.filter-btn[data-filter="${hash}"]`);
    if (matchingBtn) {
      matchingBtn.click();
    }
  }
});
