/**
 * Kinetic Aurora & Constellation Network Canvas — Full Page Engine
 * Soporta modos temáticos diferenciados:
 * 1. Default (Hub Conecta YT): Modo oscuro con malla pastel armónica y homogénea
 * 2. dark-pastel (Conecta Universidades): Modo oscuro de gala cálida y botánica
 * 3. corporate (Conecta Empresas): MODO CLARO CORPORATIVO (Zafiro, Cobalto, Cian, Teal, Índigo)
 *    con nodos pigmentados de alta nitidez, conexiones visibles en toda la página y radar interactivo.
 */

(function () {
  'use strict';

  // 1. Paleta Pastel Armónica para el Hub Principal (Lila, Lavanda, Cielo, Orquídea y Melocotón)
  const PALETTE_HUB_PASTEL = [
    { r: 196, g: 181, b: 253, hex: '#c4b5fd', name: 'Lila Pastel' },
    { r: 165, g: 180, b: 252, hex: '#a5b4fc', name: 'Lavanda Cósmica Suave' },
    { r: 147, g: 197, b: 253, hex: '#93c5fd', name: 'Cielo / Bígaro Pastel' },
    { r: 244, g: 114, b: 182, hex: '#f472b6', name: 'Rosa Orquídea Pastel' },
    { r: 252, g: 165, b: 165, hex: '#fca5a5', name: 'Rosa Sunset Pastel' },
    { r: 253, g: 186, b: 116, hex: '#fdba74', name: 'Melocotón Cálido Pastel' },
    { r: 196, g: 181, b: 253, hex: '#c4b5fd', name: 'Lila Pastel Cierre' }
  ];

  // 2. Paleta Conecta Universidades (Gala Cálida & Botánica Armónica)
  const PALETTE_UNIV_PASTEL = [
    { r: 251, g: 113, b: 133, hex: '#fb7185', name: 'Rosa Sunset Gala' },
    { r: 192, g: 132, b: 252, hex: '#c084fc', name: 'Orquídea Cósmica' },
    { r: 232, g: 121, b: 249, hex: '#e879f9', name: 'Violeta Pastel' },
    { r: 253, g: 186, b: 116, hex: '#fdba74', name: 'Melocotón Pastel' },
    { r: 253, g: 230, b: 138, hex: '#fde68a', name: 'Champán Pastel' },
    { r: 134, g: 239, b: 172, hex: '#86efac', name: 'Matcha Pastel' },
    { r: 251, g: 113, b: 133, hex: '#fb7185', name: 'Rosa Sunset Cierre' }
  ];

  // 3. Paleta Formal Corporate Tech (Modo Claro) para Conecta Empresas (Cobalto, Zafiro, Cian, Teal, Índigo)
  const PALETTE_EMPRESAS_CORPORATE = [
    { r: 2, g: 132, b: 199, hex: '#0284c7', name: 'Cobalto Corporativo' },
    { r: 3, g: 105, b: 161, hex: '#0369a1', name: 'Zafiro Profundo' },
    { r: 8, g: 145, b: 178, hex: '#0891b2', name: 'Cian Tecnológico' },
    { r: 67, g: 56, b: 202, hex: '#4338ca', name: 'Índigo Real' },
    { r: 15, g: 118, b: 110, hex: '#0f766e', name: 'Teal Esmeralda' },
    { r: 2, g: 132, b: 199, hex: '#0284c7', name: 'Cobalto Cierre' }
  ];

  function interpolateColor(color1, color2, factor) {
    return {
      r: Math.round(color1.r + (color2.r - color1.r) * factor),
      g: Math.round(color1.g + (color2.g - color1.g) * factor),
      b: Math.round(color1.b + (color2.b - color1.b) * factor)
    };
  }

  function getDynamicColor(time, palette, offset = 0, speed = 0.00035) {
    const totalColors = palette.length;
    const progress = ((time * speed + offset) % totalColors + totalColors) % totalColors;
    const index1 = Math.floor(progress);
    const index2 = (index1 + 1) % totalColors;
    const factor = progress - index1;
    return interpolateColor(palette[index1], palette[index2], factor);
  }

  class FullPageKineticMesh {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.theme = options.theme || 'default';
      this.isCorporate = (this.theme === 'corporate');
      this.isGala = (this.theme === 'dark-pastel');
      
      if (this.isGala) {
        this.palette = PALETTE_UNIV_PASTEL;
      } else if (this.isCorporate) {
        this.palette = PALETTE_EMPRESAS_CORPORATE;
      } else {
        this.palette = PALETTE_HUB_PASTEL;
      }

      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.particles = [];
      this.auroras = [];
      this.mouse = {
        x: -9999,
        y: -9999,
        radius: this.isCorporate ? 260 : 200,
        isActive: false
      };

      this.init();
    }

    init() {
      this.resize();
      this.createAuroras();
      this.createParticles();
      this.bindEvents();
      this.animate(0);
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.ctx.scale(this.dpr, this.dpr);

      this.maxDistance = Math.min(this.width, this.height) * (this.isCorporate ? 0.22 : 0.18);
      if (this.maxDistance < 130) this.maxDistance = 130;
      if (this.maxDistance > 200) this.maxDistance = 200;

      this.particleCount = Math.floor((this.width * this.height) / (this.isCorporate ? 10000 : 15000));
      if (this.particleCount < 60) this.particleCount = 60;
      if (this.particleCount > 130) this.particleCount = 130;
    }

    createAuroras() {
      this.auroras = [];
      const numAuroras = this.isCorporate ? 4 : 3;
      for (let i = 0; i < numAuroras; i++) {
        this.auroras.push({
          x: (this.width / (numAuroras + 1)) * (i + 1),
          y: Math.random() * this.height,
          radius: Math.min(this.width, this.height) * (0.55 + Math.random() * 0.35),
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          colorOffset: (i * (this.palette.length / numAuroras))
        });
      }
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        const baseRadius = this.isCorporate ? (Math.random() * 1.8 + 2.8) : (Math.random() * 1.2 + 2.0);
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * (this.isCorporate ? 0.38 : 0.4),
          vy: (Math.random() - 0.5) * (this.isCorporate ? 0.38 : 0.4),
          radius: baseRadius,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.025 + 0.012,
          isHighPriority: Math.random() > 0.7
        });
      }
    }

    bindEvents() {
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.isActive = true;
      }, { passive: true });

      document.addEventListener('mouseleave', () => {
        this.mouse.isActive = false;
        this.mouse.x = -9999;
        this.mouse.y = -9999;
      });

      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          this.mouse.x = e.touches[0].clientX;
          this.mouse.y = e.touches[0].clientY;
          this.mouse.isActive = true;
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        this.mouse.isActive = false;
        this.mouse.x = -9999;
        this.mouse.y = -9999;
      });

      window.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;

        this.particles.forEach(p => {
          const dx = p.x - clickX;
          const dy = p.y - clickY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220 && dist > 0) {
            const force = (1 - dist / 220) * 3.5;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        });
      });

      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.resize();
          this.createParticles();
        }, 150);
      });
    }

    animate(time) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // =========================================================
      // 1. DIBUJAR AURORAS DE FONDO
      // =========================================================
      for (let i = 0; i < this.auroras.length; i++) {
        const a = this.auroras[i];
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < -120) a.x = this.width + 120;
        if (a.x > this.width + 120) a.x = -120;
        if (a.y < -120) a.y = this.height + 120;
        if (a.y > this.height + 120) a.y = -120;

        const auroraColor = getDynamicColor(time, this.palette, a.colorOffset, 0.00025);
        const auroraAlpha = this.isCorporate ? 0.06 : 0.075;

        const radialGrad = this.ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.radius);
        radialGrad.addColorStop(0, `rgba(${auroraColor.r}, ${auroraColor.g}, ${auroraColor.b}, ${auroraAlpha})`);
        radialGrad.addColorStop(0.5, `rgba(${auroraColor.r}, ${auroraColor.g}, ${auroraColor.b}, ${auroraAlpha * 0.4})`);
        radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = radialGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }

      // =========================================================
      // 2. DIBUJAR MALLA DE PUNTOS Y CONEXIONES INTERACTIVAS
      // =========================================================
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.992;
        p.vy *= 0.992;

        if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.06;
        if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.06;

        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;
        if (p.y < -10) p.y = this.height + 10;
        if (p.y > this.height + 10) p.y = -10;

        // Gradiente espacial continuo armónico
        const spatialProgress = ((p.x / this.width) * 1.5 + (p.y / this.height) * 0.7);
        const pColor = getDynamicColor(time, this.palette, spatialProgress, 0.0003);

        // Interacción con cursor global
        if (this.mouse.isActive) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.mouse.radius && dist > 0) {
            const force = (1 - dist / this.mouse.radius) * (this.isCorporate ? 0.95 : 0.65);
            p.vx += (dx / dist) * force * 0.1;
            p.vy += (dy / dist) * force * 0.1;

            // Línea luminosa hacia el cursor
            const lineAlpha = (1 - dist / this.mouse.radius) * (this.isCorporate ? 0.65 : 0.38);
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.strokeStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${lineAlpha})`;
            this.ctx.lineWidth = this.isCorporate ? 1.5 : 1.1;
            this.ctx.stroke();
          }
        }

        p.phase += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.phase) * (this.isCorporate ? 0.7 : 0.4);

        if (this.isCorporate) {
          // MODO CLARO CORPORATIVO: Nodos pigmentados de alto contraste
          const glowAlpha = p.isHighPriority ? 0.28 : 0.18;
          
          // Halo exterior sutil
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, currentRadius * 2.4, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${glowAlpha})`;
          this.ctx.fill();

          // Anillo medio nítido
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, currentRadius * 1.5, 0, Math.PI * 2);
          this.ctx.strokeStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, 0.70)`;
          this.ctx.lineWidth = 1.2;
          this.ctx.stroke();

          // Núcleo pigmentado brillante de alta definición
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgb(${pColor.r}, ${pColor.g}, ${pColor.b})`;
          this.ctx.fill();
        } else {
          // ESTILO HUB & GALA: Halo pastel suave difuso
          const glowAlpha = 0.20;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, currentRadius * 1.9, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${glowAlpha})`;
          this.ctx.fill();

          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgb(${pColor.r}, ${pColor.g}, ${pColor.b})`;
          this.ctx.fill();
        }

        // Conectar con nodos cercanos
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.maxDistance) {
            const lineAlpha = (1 - dist / this.maxDistance) * (this.isCorporate ? 0.42 : 0.22);
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${lineAlpha})`;
            this.ctx.lineWidth = this.isCorporate ? 1.15 : 0.9;
            this.ctx.stroke();
          }
        }
      }

      requestAnimationFrame((t) => this.animate(t));
    }
  }

  // Inicializar automáticamente cuando el DOM esté listo
  function initGlobalMesh() {
    let canvas = document.getElementById('globalKineticCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'globalKineticCanvas';
      canvas.className = 'global-kinetic-canvas';
      document.body.prepend(canvas);
    }

    const theme = document.body.getAttribute('data-theme') || 'default';
    window.globalKineticMesh = new FullPageKineticMesh(canvas, { theme });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalMesh);
  } else {
    initGlobalMesh();
  }
})();
