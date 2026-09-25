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

      alert('¡Confirmación exitosa! Te redirigimos al formulario oficial para completar tus credenciales.');
      window.open('https://forms.cloud.microsoft/r/WfhkCradvM', '_blank');
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

  /* =========================================================
     MALLA ESTÁTICA INTERACTIVA MIT FRED TRAJANO CON CURSOR BRILLANTE
     ========================================================= */
  initFellowshipMesh();

  function initFellowshipMesh() {
    const canvas = document.getElementById('fellowshipMeshCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Paleta cromática oficial MIT adaptada a Conecta Universidades
    const colors = {
      ink: {
        line: [0, 215, 235],     // Cian técnico luminoso #00d7eb
        ring: [0, 195, 215],     // Anillos orbitales
        node: [195, 155, 235],   // Púrpura gala brillante #c39beb
        hot:  [255, 245, 255],   // Destello blanco-púrpura estelar
        glow: [175, 125, 230]    // Resplandor del cursor en púrpura gala #af7de6
      },
      paper: {
        line: [125, 70, 155],    // Púrpura editorial visible sobre papel #f7f5f0
        ring: [140, 85, 170],
        node: [0, 135, 155],     // Cian profundo contrastado
        hot:  [180, 95, 220],    // Púrpura gala activo
        glow: [157, 124, 176]    // Resplandor del cursor
      },
      tint: {
        line: [0, 130, 145],     // Cian pizarra visible
        ring: [0, 145, 160],
        node: [140, 90, 170],    // Púrpura gala
        hot:  [0, 188, 202],     // Cian técnico
        glow: [0, 188, 202]      // Resplandor cian
      }
    };

    function hash(val) {
      let s = 43758.5453123 * Math.sin(127.1 * val + 311.7);
      return s - Math.floor(s);
    }
    function clamp(val, min, max) {
      return Math.min(max, Math.max(min, val));
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
      return {
        line: [...p.line],
        ring: [...(p.ring || p.line)],
        node: [...p.node],
        hot:  [...p.hot],
        glow: [...p.glow]
      };
    }
    function smoothStep(current, target, rate = 0.07) {
      current[0] += (target[0] - current[0]) * rate;
      current[1] += (target[1] - current[1]) * rate;
      current[2] += (target[2] - current[2]) * rate;
    }

    // Generador de geometría orbital de Fred Trajano
    function buildOrbitalField(width, height) {
      let cx = 0.52 * width;
      let cy = 0.48 * height;
      let span = Math.max(width, height);
      let ringSpecs = [
        { rx: Math.max(170, 0.18 * span), ry: Math.max(140, 0.15 * span), count: 9, rotation: -0.18 },
        { rx: Math.max(320, 0.34 * span), ry: Math.max(250, 0.28 * span), count: 14, rotation: 0.12 },
        { rx: Math.max(540, 0.58 * span), ry: Math.max(410, 0.47 * span), count: 20, rotation: -0.08 }
      ];

      let nodes = [];
      let edges = [];
      let rings = ringSpecs.map((spec, idx) => ({
        cx,
        cy,
        rx: spec.rx,
        ry: spec.ry,
        rotation: spec.rotation,
        phase: 1.8 * idx
      }));

      let ringStarts = [];
      for (let rIdx = 0; rIdx < ringSpecs.length; rIdx++) {
        let spec = ringSpecs[rIdx];
        let startIdx = nodes.length;
        ringStarts.push(startIdx);

        for (let i = 0; i < spec.count; i++) {
          let angle = (i / spec.count) * Math.PI * 2 + spec.rotation;
          let jitter = hash(i + 31 * rIdx) - 0.5;
          let px = cx + Math.cos(angle) * spec.rx + jitter * (rIdx + 1) * 22;
          let py = cy + Math.sin(angle) * spec.ry + jitter * (rIdx + 1) * 18;

          nodes.push({
            x: px,
            y: py,
            anchorX: px,
            anchorY: py,
            vx: 0,
            vy: 0,
            phase: hash(i + 47 * rIdx + 8) * Math.PI * 2,
            ring: rIdx,
            radius: 1.8 + 1.4 * hash(i + 59 * rIdx + 14)
          });

          edges.push({
            a: startIdx + i,
            b: startIdx + ((i + 1) % spec.count)
          });
        }
      }

      // Conexiones transversales entre órbitas
      for (let rIdx = 1; rIdx < ringSpecs.length; rIdx++) {
        let currStart = ringStarts[rIdx];
        let prevStart = ringStarts[rIdx - 1];
        let currCount = ringSpecs[rIdx].count;
        let prevCount = ringSpecs[rIdx - 1].count;

        for (let i = 0; i < currCount; i++) {
          let mapped = Math.floor((i / currCount) * prevCount) % prevCount;
          edges.push({ a: currStart + i, b: prevStart + mapped });
          if (i % 3 === 0) {
            edges.push({ a: currStart + i, b: prevStart + ((mapped + 1) % prevCount) });
          }
        }
      }

      // Nodo central de la constelación (más tenue y refinado)
      let centerIdx = nodes.length;
      nodes.push({
        x: cx,
        y: cy,
        anchorX: cx,
        anchorY: cy,
        vx: 0,
        vy: 0,
        phase: 0.4,
        ring: -1,
        radius: 4.2
      });
      for (let i = 0; i < ringSpecs[0].count; i += 2) {
        edges.push({ a: centerIdx, b: ringStarts[0] + i });
      }

      // Satélites exteriores
      let outerCount = Math.max(10, Math.round(width / 160));
      for (let i = 0; i < outerCount; i++) {
        let angle = (i / outerCount) * Math.PI * 2 + 0.22;
        let nx = cx + 0.74 * span * Math.cos(angle);
        let ny = cy + 0.62 * span * Math.sin(angle);
        let nIdx = nodes.length;
        nodes.push({
          x: nx,
          y: ny,
          anchorX: nx,
          anchorY: ny,
          vx: 0,
          vy: 0,
          phase: hash(i + 117) * Math.PI * 2,
          ring: 3,
          radius: 2.2 + 2.0 * hash(i + 149)
        });
        edges.push({
          a: nIdx,
          b: ringStarts[2] + (Math.floor((i / outerCount) * ringSpecs[2].count) % ringSpecs[2].count)
        });
      }

      return { nodes, edges, rings };
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let animId = 0;
    let lastTime = 0;
    // Inicialización activa con posición predeterminada para iluminación inmediata
    let mouseX = typeof window !== 'undefined' && window.innerWidth ? window.innerWidth * 0.60 : 750;
    let mouseY = typeof window !== 'undefined' && window.innerHeight ? window.innerHeight * 0.40 : 350;
    let pointerActive = true;
    let field = buildOrbitalField(1, 1);
    let currentSceneName = 'ink';
    let activeColors = copyPalette(colors.ink);
    let targetColors = copyPalette(colors.ink);

    // Detección de escena en scroll para transición cromática de mallas
    const updateScene = () => {
      let midY = 0.48 * window.innerHeight;
      let closestDist = Infinity;
      let foundScene = 'ink';
      const sceneElements = document.querySelectorAll('[data-fellowship-scene]');
      for (let el of sceneElements) {
        let rect = el.getBoundingClientRect();
        let scene = el.dataset.fellowshipScene;
        if (!scene || !colors[scene]) continue;
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
        targetColors = copyPalette(colors[foundScene] || colors.ink);
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
      field = buildOrbitalField(width, height);
      updateScene();
    };

    const onPointerMove = (e) => {
      if (reducedMotion) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      pointerActive = true;
    };

    const onPointerLeave = () => {
      // Mantenemos visible el resplandor con posición reposada sin desconectar
    };

    // Bucle de renderizado gráfico de alta precisión
    const render = (time) => {
      let tSec = 0.001 * time;
      let dt = lastTime ? clamp((time - lastTime) / 16.67, 0.5, 2) : 1;
      lastTime = time;

      // Transición cromática suave de paletas
      smoothStep(activeColors.line, targetColors.line);
      smoothStep(activeColors.ring, targetColors.ring);
      smoothStep(activeColors.node, targetColors.node);
      smoothStep(activeColors.hot, targetColors.hot);
      smoothStep(activeColors.glow, targetColors.glow);

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';

      // Dinámica de oscilación suave y repulsión magnética del cursor
      if (!reducedMotion) {
        for (let node of field.nodes) {
          let oscScale = 6 + 3.5 * Math.max(node.ring, 0);
          let targetX = node.anchorX + Math.cos(tSec * (0.22 + 0.02 * node.ring) + node.phase) * oscScale;
          let targetY = node.anchorY + Math.sin(tSec * (0.18 + 0.018 * node.ring) + node.phase) * oscScale;

          node.vx += (targetX - node.x) * 0.006 * dt;
          node.vy += (targetY - node.y) * 0.006 * dt;

          if (pointerActive) {
            let dx = node.x - mouseX;
            let dy = node.y - mouseY;
            let dist = Math.max(1, Math.hypot(dx, dy));
            if (dist < 240) {
              let force = (1 - dist / 240) * 0.85;
              node.vx += (dx / dist) * force * dt;
              node.vy += (dy / dist) * force * dt;
            }
          }

          node.vx *= 0.91;
          node.vy *= 0.91;
          node.x += node.vx * dt;
          node.y += node.vy * dt;
        }
      }

      // ========================================================
      // 1. EL RESPLANDOR / BRILLO RADIAL DEL CURSOR (ESTILO FRED TRAJANO MIT)
      // ========================================================
      if (pointerActive && !reducedMotion) {
        let glowRadius = 300;
        let grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);
        if (currentSceneName === 'ink') {
          grad.addColorStop(0, rgba(activeColors.glow, 0.22));
          grad.addColorStop(0.32, rgba(activeColors.glow, 0.09));
          grad.addColorStop(0.70, rgba(activeColors.glow, 0.02));
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        } else {
          grad.addColorStop(0, rgba(activeColors.glow, 0.12));
          grad.addColorStop(0.42, rgba(activeColors.glow, 0.04));
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.save();
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }
      }

      // ========================================================
      // 2. ANILLOS ORBITALES DISCONTINUOS (MÁS TENUES Y PRECISOS)
      // ========================================================
      for (let ring of field.rings) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(
          ring.cx,
          ring.cy,
          ring.rx,
          ring.ry,
          ring.rotation + 0.025 * Math.sin(0.12 * tSec + ring.phase),
          0,
          2 * Math.PI
        );
        ctx.setLineDash([4, 10]);
        ctx.lineWidth = 0.95;
        ctx.strokeStyle = rgba(activeColors.ring, 0.18);
        ctx.stroke();
        ctx.restore();
      }

      // ========================================================
      // 3. LÍNEAS DE CONEXIÓN VECTORIAL (MÁS TENUES Y ELEGANTES)
      // ========================================================
      for (let edge of field.edges) {
        let na = field.nodes[edge.a];
        let nb = field.nodes[edge.b];
        let midX = (na.x + nb.x) / 2;
        let midY = (na.y + nb.y) / 2;
        let dist = pointerActive ? Math.hypot(midX - mouseX, midY - mouseY) : Infinity;
        let prox = clamp(1 - dist / 240, 0, 1);
        let col = lerpColor(activeColors.line, activeColors.hot, 0.85 * prox);

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.lineWidth = 0.85 + 0.95 * prox;
        ctx.strokeStyle = rgba(col, 0.17 + 0.30 * prox);
        ctx.stroke();
      }

      // ========================================================
      // 4. NODOS CON AURA LUMINOSA Y SOMBRA AL ACERCAR EL CURSOR
      // ========================================================
      for (let node of field.nodes) {
        let dist = pointerActive ? Math.hypot(node.x - mouseX, node.y - mouseY) : Infinity;
        let prox = clamp(1 - dist / 240, 0, 1);
        let col = lerpColor(activeColors.node, activeColors.hot, prox);

        ctx.save();
        if (prox > 0) {
          ctx.shadowColor = rgba(activeColors.hot, 0.75 * prox);
          ctx.shadowBlur = 10 * prox;
        }
        ctx.beginPath();
        let baseRadius = node.ring === -1 ? 4.2 : node.radius;
        ctx.arc(node.x, node.y, baseRadius + 1.8 * prox, 0, 2 * Math.PI);
        ctx.fillStyle = rgba(col, 0.38 + 0.42 * prox);
        ctx.fill();
        ctx.restore();
      }

      animId = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', updateScene, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('blur', onPointerLeave);
    animId = window.requestAnimationFrame(render);
  }
});

