/**
 * Kinetic Aurora & Constellation Network Canvas — Full Page Engine
 * Estilo: Paleta 100% Pastel Suave (Sin Colores Neón)
 * Auroras atmosféricas difusas, malla de nodos pastel interconectados con el cursor
 * y transiciones cromáticas orgánicas y elegantes.
 */

(function () {
  'use strict';

  // Paleta Pastel Universal Suave (Tonos Desaturados, Elegantes y Cálidos — Cero Neón)
  const PALETTE_PASTEL_DEFAULT = [
    { r: 196, g: 181, b: 253, hex: '#c4b5fd', name: 'Lavanda / Lila Suave' },
    { r: 252, g: 165, b: 165, hex: '#fca5a5', name: 'Coral / Melocotón Suave' },
    { r: 147, g: 197, b: 253, hex: '#93c5fd', name: 'Bígaro / Cielo Pastel' },
    { r: 134, g: 239, b: 172, hex: '#86efac', name: 'Matcha / Salvia Pastel' },
    { r: 253, g: 230, b: 138, hex: '#fde68a', name: 'Vainilla / Crema' },
    { r: 244, g: 114, b: 182, hex: '#f472b6', name: 'Rosa Orquídea Pastel' },
    { r: 167, g: 243, b: 208, hex: '#a7f3d0', name: 'Menta Celadón Suave' }
  ];

  // Paleta Conecta Universidades (Gala Nocturna Pastel Cálida)
  const PALETTE_PASTEL_GALA = [
    { r: 251, g: 113, b: 133, hex: '#fb7185', name: 'Rosa Sunset Pastel' },
    { r: 192, g: 132, b: 252, hex: '#c084fc', name: 'Orquídea Cósmica Pastel' },
    { r: 253, g: 186, b: 116, hex: '#fdba74', name: 'Albaricoque Pastel' },
    { r: 134, g: 239, b: 172, hex: '#86efac', name: 'Matcha Pastel' },
    { r: 253, g: 230, b: 138, hex: '#fde68a', name: 'Champán Pastel' },
    { r: 232, g: 121, b: 249, hex: '#e879f9', name: 'Violeta Rubí Pastel' },
    { r: 167, g: 243, b: 208, hex: '#a7f3d0', name: 'Menta Pastel' }
  ];

  function interpolateColor(color1, color2, factor) {
    return {
      r: Math.round(color1.r + (color2.r - color1.r) * factor),
      g: Math.round(color1.g + (color2.g - color1.g) * factor),
      b: Math.round(color1.b + (color2.b - color1.b) * factor)
    };
  }

  function getDynamicColor(time, palette, offset = 0, speed = 0.0005) {
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
      this.theme = options.theme || 'dark';
      this.isGala = (this.theme === 'dark-pastel');
      this.palette = this.isGala ? PALETTE_PASTEL_GALA : PALETTE_PASTEL_DEFAULT;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.particles = [];
      this.auroras = [];
      this.mouse = {
        x: -9999,
        y: -9999,
        radius: 220,
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

      this.maxDistance = Math.min(this.width, this.height) * 0.2;
      if (this.maxDistance < 120) this.maxDistance = 120;
      if (this.maxDistance > 180) this.maxDistance = 180;

      this.particleCount = Math.floor((this.width * this.height) / 14000);
      if (this.particleCount < 50) this.particleCount = 50;
      if (this.particleCount > 105) this.particleCount = 105;
    }

    createAuroras() {
      // Auroras ambientales suaves de fondo difuso (sin estridencias ni neón)
      this.auroras = [];
      const numAuroras = 4;
      for (let i = 0; i < numAuroras; i++) {
        this.auroras.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.min(this.width, this.height) * (0.45 + Math.random() * 0.3),
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          colorOffset: (i * (this.palette.length / numAuroras))
        });
      }
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2.5 + 1.8,
          colorOffset: Math.random() * this.palette.length,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01
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
          if (dist < 200 && dist > 0) {
            const force = (1 - dist / 200) * 3;
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
      // 1. DIBUJAR AURORAS PASTEL FLUIDAS
      // =========================================================
      for (let i = 0; i < this.auroras.length; i++) {
        const a = this.auroras[i];
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < -100) a.x = this.width + 100;
        if (a.x > this.width + 100) a.x = -100;
        if (a.y < -100) a.y = this.height + 100;
        if (a.y > this.height + 100) a.y = -100;

        const auroraColor = getDynamicColor(time, this.palette, a.colorOffset, 0.00035);
        const auroraAlpha = 0.09;

        const radialGrad = this.ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.radius);
        radialGrad.addColorStop(0, `rgba(${auroraColor.r}, ${auroraColor.g}, ${auroraColor.b}, ${auroraAlpha})`);
        radialGrad.addColorStop(0.5, `rgba(${auroraColor.r}, ${auroraColor.g}, ${auroraColor.b}, ${auroraAlpha * 0.4})`);
        radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = radialGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }

      // =========================================================
      // 2. DIBUJAR CONSTELACIÓN PASTEL INTERACTIVA
      // =========================================================
      const dynamicGlobalColor = getDynamicColor(time, this.palette, 0, 0.0005);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.992;
        p.vy *= 0.992;

        if (Math.abs(p.vx) < 0.12) p.vx += (Math.random() - 0.5) * 0.08;
        if (Math.abs(p.vy) < 0.12) p.vy += (Math.random() - 0.5) * 0.08;

        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;
        if (p.y < -10) p.y = this.height + 10;
        if (p.y > this.height + 10) p.y = -10;

        // Interacción con cursor global
        if (this.mouse.isActive) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.mouse.radius && dist > 0) {
            const force = (1 - dist / this.mouse.radius) * 0.75;
            p.vx += (dx / dist) * force * 0.1;
            p.vy += (dy / dist) * force * 0.1;

            // Línea luminosa hacia el cursor (suave pastel)
            const lineAlpha = (1 - dist / this.mouse.radius) * 0.45;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.strokeStyle = `rgba(${dynamicGlobalColor.r}, ${dynamicGlobalColor.g}, ${dynamicGlobalColor.b}, ${lineAlpha})`;
            this.ctx.lineWidth = 1.3;
            this.ctx.stroke();
          }
        }

        // Color individual pastel suave
        const pColor = getDynamicColor(time, this.palette, p.colorOffset, 0.0005);
        p.phase += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.phase) * 0.5;

        // Halo suave pastel (no neón estridente)
        const glowAlpha = 0.28;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, currentRadius * 2.4, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${glowAlpha})`;
        this.ctx.fill();

        // Núcleo del nodo pastel
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgb(${pColor.r}, ${pColor.g}, ${pColor.b})`;
        this.ctx.fill();

        // Conectar con nodos cercanos con trazo suave
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.maxDistance) {
            const lineAlpha = (1 - dist / this.maxDistance) * 0.26;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${lineAlpha})`;
            this.ctx.lineWidth = 1.0;
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
