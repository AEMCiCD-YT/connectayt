// Conecta Empresas 2026 — Interacciones & Accesibilidad
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

  // Smooth Scroll
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

  // Reveal Animations
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // Form Submission Handler
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Gracias por registrar tu interés en Conecta Empresas 2026! Hemos recibido tus datos correctamente.');
      contactForm.reset();
    });
  }

  // Modal Legal
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

  /* =========================================================
     MALLA ESTÁTICA INTERACTIVA MIT NURSING AI SYMPOSIUM
     ========================================================= */
  initNursingMesh();

  function initNursingMesh() {
    const canvas = document.getElementById('nursingMeshCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Paleta cromática oficial MIT adaptada a Conecta Empresas (alto contraste y nitidez)
    const palettes = {
      hero: {
        line: [25, 75, 115],      // Azul IEEE navy contrastado y visible sobre fondo claro
        node: [0, 98, 155],       // Azul institucional IEEE #00629b
        hot:  [239, 64, 54],      // Rojo acento AEMCiCD #ef4036
        glow: [0, 98, 155]        // Resplandor azul
      },
      navy: {
        line: [120, 190, 245],    // Celeste estelar contrastado sobre slate-navy
        node: [239, 64, 54],      // Rojo acento
        hot:  [255, 255, 255],    // Blanco puro luminoso
        glow: [0, 188, 202]       // Halo cian tecnológico
      },
      white: {
        line: [35, 80, 120],      // Slate navy con claridad
        node: [0, 98, 155],       // Azul IEEE
        hot:  [239, 64, 54],      // Rojo acento
        glow: [0, 98, 155]
      },
      pizarra: {
        line: [125, 190, 240],    // Celeste claro sobre fondo pizarra
        node: [239, 64, 54],      // Rojo acento
        hot:  [255, 255, 255],    // Blanco puro
        glow: [0, 188, 202]
      }
    };

    function hash(e) {
      let t = 43758.5453123 * Math.sin(127.1 * e + 311.7);
      return t - Math.floor(t);
    }
    function clamp(e, min, max) {
      return Math.min(max, Math.max(min, e));
    }
    function lerpColor(c1, c2, t) {
      return [
        c1[0] + (c2[0] - c1[0]) * t,
        c1[1] + (c2[1] - c1[1]) * t,
        c1[2] + (c2[2] - c1[2]) * t
      ];
    }
    function rgba(c, a) {
      return `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${a})`;
    }
    function copyPalette(p) {
      return { line: [...p.line], node: [...p.node], hot: [...p.hot], glow: [...p.glow] };
    }
    function smoothStep(current, target, rate = 0.07) {
      current[0] += (target[0] - current[0]) * rate;
      current[1] += (target[1] - current[1]) * rate;
      current[2] += (target[2] - current[2]) * rate;
    }

    // Generador de red elástica y resortes reticulares (MIT Nursing AI Symposium)
    function buildLattice(width, height) {
      let particles = [];
      let springs = [];
      let cols = clamp(Math.floor(width / 105), 8, 16);
      let rows = clamp(Math.floor(height / 90), 6, 12);

      for (let i = 0; i < rows; i += 1) {
        for (let h = 0; h < cols; h += 1) {
          let idx = i * cols + h;
          let jx = hash(idx + 4) - 0.5;
          let jy = hash(idx + 19) - 0.5;
          let u = cols === 1 ? 0.5 : h / (cols - 1);
          let wave = 26 * Math.sin(u * Math.PI);
          let px = 30 + u * Math.max(1, width - 60) + 26 * jx;
          let py = 44 + (i / Math.max(rows - 1, 1)) * Math.max(1, height - 88) - wave + 22 * jy;

          particles.push({
            x: px + 15 * jx,
            y: py + 15 * jy,
            vx: 0,
            vy: 0,
            ax: px,
            ay: py,
            mass: 0.8 + 1.6 * hash(idx + 33),
            radius: 2.8 + 2.0 * hash(idx + 51),
            seed: hash(idx + 77) * Math.PI * 2
          });

          if (h > 0) {
            let left = idx - 1;
            springs.push({
              a: left,
              b: idx,
              rest: Math.hypot(particles[idx].ax - particles[left].ax, particles[idx].ay - particles[left].ay),
              strength: 0.007
            });
          }

          if (i > 0) {
            let top = idx - cols;
            springs.push({
              a: top,
              b: idx,
              rest: Math.hypot(particles[idx].ax - particles[top].ax, particles[idx].ay - particles[top].ay),
              strength: 0.0055
            });
          }

          if (i > 0 && h > 0 && hash(idx + 91) > 0.44) {
            let diag = idx - cols - 1;
            springs.push({
              a: diag,
              b: idx,
              rest: Math.hypot(particles[idx].ax - particles[diag].ax, particles[idx].ay - particles[diag].ay),
              strength: 0.003
            });
          }
        }
      }

      return { particles, springs };
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let animId = 0;
    let lastScrollY = window.scrollY;
    let scrollVel = 0;
    // Inicialización activa con posición predeterminada para iluminación inmediata
    let mouseX = typeof window !== 'undefined' && window.innerWidth ? window.innerWidth * 0.65 : 850;
    let mouseY = typeof window !== 'undefined' && window.innerHeight ? window.innerHeight * 0.35 : 300;
    let pointerActive = true;
    let mesh = buildLattice(1, 1);
    let currentSceneName = 'hero';
    let activeColors = copyPalette(palettes.hero);
    let targetColors = copyPalette(palettes.hero);

    // Detección de escena en scroll para transición cromática
    const updateScene = () => {
      let midY = 0.48 * window.innerHeight;
      let sceneElements = Array.from(document.querySelectorAll('[data-nursing-ai-scene]'));
      let closestDist = Infinity;
      let foundScene = 'hero';

      for (let el of sceneElements) {
        let rect = el.getBoundingClientRect();
        let scene = el.getAttribute('data-nursing-ai-scene');
        if (!(scene && scene in palettes)) continue;
        if (rect.top <= midY && rect.bottom >= midY) {
          foundScene = scene;
          break;
        }
        let dist = Math.min(Math.abs(rect.top - midY), Math.abs(rect.bottom - midY));
        if (dist < closestDist) {
          closestDist = dist;
          foundScene = scene;
        }
      }

      if (foundScene !== currentSceneName) {
        currentSceneName = foundScene;
        targetColors = copyPalette(palettes[currentSceneName] || palettes.hero);
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mesh = buildLattice(width, height);
      updateScene();
    };

    const onScroll = () => {
      let y = window.scrollY;
      scrollVel += 0.16 * clamp(y - lastScrollY, -90, 90);
      lastScrollY = y;
      updateScene();
    };

    const onPointerMove = (e) => {
      if (reducedMotion) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      pointerActive = true;
    };

    const onPointerLeave = () => {
      // Mantenemos la malla viva sin desconectar
    };

    // Bucle de física elástica y renderizado continuo
    const render = () => {
      let { particles, springs } = mesh;
      let scrollRatio = clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight), 0, 1);

      // Transición cromática suave
      smoothStep(activeColors.line, targetColors.line);
      smoothStep(activeColors.node, targetColors.node);
      smoothStep(activeColors.hot, targetColors.hot);
      smoothStep(activeColors.glow, targetColors.glow);

      // Dinámica de resortes (física elástica MIT)
      for (let sp of springs) {
        let pA = particles[sp.a];
        let pB = particles[sp.b];
        let dx = pB.x - pA.x;
        let dy = pB.y - pA.y;
        let dist = Math.max(0.001, Math.hypot(dx, dy));
        let force = (dist - sp.rest) * sp.strength;
        let fx = (dx / dist) * force;
        let fy = (dy / dist) * force;

        pA.vx += fx / pA.mass;
        pA.vy += fy / pA.mass;
        pB.vx -= fx / pB.mass;
        pB.vy -= fy / pB.mass;
      }

      // Dinámica de partículas y deflexión del cursor
      for (let p of particles) {
        let wave = p.seed + scrollRatio * Math.PI * 6;
        p.vx += (p.ax - p.x) * 0.006;
        p.vy += (p.ay - p.y) * 0.006;
        p.vx += Math.sin(wave) * scrollVel * 0.006;
        p.vy += Math.cos(0.8 * wave) * Math.abs(scrollVel) * 0.004;
        p.vy += 0.012 * p.mass;

        if (pointerActive) {
          let dx = p.x - mouseX;
          let dy = p.y - mouseY;
          let d = Math.max(24, Math.hypot(dx, dy));
          if (d < 220) {
            let push = (1 - d / 220) * 2.8;
            p.vx += (dx / d) * push;
            p.vy += (dy / d) * push;
          }
        }

        p.vx *= 0.915;
        p.vy *= 0.915;
        p.x += p.vx;
        p.y += p.vy;
      }

      scrollVel *= 0.86;

      // Dibujado sobre Canvas
      ctx.clearRect(0, 0, width, height);

      // Resplandor del cursor (Nursing AI)
      if (pointerActive && !reducedMotion) {
        let glowRadius = 280;
        let grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);
        if (currentSceneName === 'navy' || currentSceneName === 'pizarra') {
          grad.addColorStop(0, rgba(activeColors.glow, 0.42));
          grad.addColorStop(0.32, rgba(activeColors.glow, 0.18));
          grad.addColorStop(0.70, rgba(activeColors.glow, 0.04));
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        } else {
          grad.addColorStop(0, rgba(activeColors.glow, 0.18));
          grad.addColorStop(0.45, rgba(activeColors.glow, 0.06));
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.save();
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }
      }

      // Conexiones de resortes elásticos
      ctx.save();
      ctx.lineCap = 'round';
      for (let sp of springs) {
        let pA = particles[sp.a];
        let pB = particles[sp.b];
        let velEnergy = clamp((Math.abs(pA.vx) + Math.abs(pA.vy) + Math.abs(pB.vx) + Math.abs(pB.vy)) * 0.15, 0, 1);
        let midX = (pA.x + pB.x) / 2;
        let midY = (pA.y + pB.y) / 2;
        let cursorDist = pointerActive ? Math.hypot(midX - mouseX, midY - mouseY) : Infinity;
        let cursorProx = clamp(1 - cursorDist / 220, 0, 1);
        let col = lerpColor(activeColors.line, activeColors.hot, 0.85 * cursorProx);

        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.lineWidth = 1.15 + 1.6 * velEnergy + 1.2 * cursorProx;
        ctx.strokeStyle = rgba(col, 0.36 + 0.28 * velEnergy + 0.42 * cursorProx);
        ctx.stroke();
      }
      ctx.restore();

      // Nodos elásticos de la malla
      for (let p of particles) {
        let velEnergy = clamp((Math.abs(p.vx) + Math.abs(p.vy)) * 0.2, 0, 1);
        let cursorDist = pointerActive ? Math.hypot(p.x - mouseX, p.y - mouseY) : Infinity;
        let cursorProx = clamp(1 - cursorDist / 220, 0, 1);
        let col = lerpColor(activeColors.node, activeColors.hot, cursorProx);

        ctx.save();
        if (cursorProx > 0 && !reducedMotion) {
          ctx.shadowColor = rgba(activeColors.hot, 0.90 * cursorProx);
          ctx.shadowBlur = 16 * cursorProx;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 1.8 * velEnergy + 2.6 * cursorProx, 0, 2 * Math.PI);
        ctx.fillStyle = rgba(col, 0.75 + 0.25 * cursorProx);
        ctx.fill();
        ctx.restore();
      }

      animId = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    if (!reducedMotion) {
      animId = window.requestAnimationFrame(render);
    }
  }
});

