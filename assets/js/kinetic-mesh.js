/**
 * Kinetic Aurora & Constellation Shifting Network Canvas — Full Page Engine
 * Inspirado en MIT Critical Data / Make Health (Concepción & Roma)
 * Sistema de auroras cromáticas vivas, malla de nodos interconectados con el cursor
 * y transiciones de color fluidas y visibles por toda la página.
 */

(function () {
  'use strict';

  // Paleta Conecta Empresas / Hub (Corporativa & Escuelas)
  const PALETTE_VIBRANT = [
    { r: 0,   g: 188, b: 202, hex: '#00bcca', name: 'Cian' },
    { r: 60,  g: 159, b: 230, hex: '#3c9fe6', name: 'Azul Eléctrico' },
    { r: 157, g: 124, b: 176, hex: '#9d7cb0', name: 'Púrpura' },
    { r: 255, g: 82,  b: 66,  hex: '#ff5242', name: 'Coral' },
    { r: 253, g: 202, b: 38,  hex: '#fdca26', name: 'Oro' },
    { r: 0,   g: 188, b: 82,  hex: '#00bc52', name: 'Verde' },
    { r: 0,   g: 98,  b: 155, hex: '#00629b', name: 'Azul IEEE' }
  ];

  // Paleta Conecta Universidades (Gala Nocturna Creativa — Tonos Cálidos, Orquídea, Rosa, Matcha y Champán)
  const PALETTE_PASTEL = [
    { r: 251, g: 113, b: 133, hex: '#fb7185', name: 'Rosa Coral Atardecer' },
    { r: 192, g: 132, b: 252, hex: '#c084fc', name: 'Orquídea / Lavanda Cósmico' },
    { r: 134, g: 239, b: 172, hex: '#86efac', name: 'Matcha / Jade Pastel' },
    { r: 253, g: 230, b: 138, hex: '#fde68a', name: 'Mantequilla / Champán' },
    { r: 253, g: 186, b: 116, hex: '#fdba74', name: 'Melocotón / Albaricoque' },
    { r: 232, g: 121, b: 249, hex: '#e879f9', name: 'Violeta Rubí Pastel' },
    { r: 94,  g: 234, b: 212, hex: '#5eead4', name: 'Menta Turquesa Suave' }
  ];

  function interpolateColor(color1, color2, factor) {
    return {
      r: Math.round(color1.r + (color2.r - color1.r) * factor),
      g: Math.round(color1.g + (color2.g - color1.g) * factor),
      b: Math.round(color1.b + (color2.b - color1.b) * factor)
    };
  }

  function getDynamicColor(time, palette, offset = 0, speed = 0.0006) {
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
      this.isPastel = (this.theme === 'dark-pastel');
      this.palette = this.isPastel ? PALETTE_PASTEL : PALETTE_VIBRANT;
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
      if (this.particleCount > 110) this.particleCount = 110;
    }

    createAuroras() {
      // Campos de luz ambiental viva (Auroras flotantes difusas)
      this.auroras = [];
      const numAuroras = 4;
      for (let i = 0; i < numAuroras; i++) {
        this.auroras.push({
          x: (this.width / (numAuroras + 1)) * (i + 1),
          y: (this.height / 2) + (Math.random() - 0.5) * (this.height * 0.5),
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.min(this.width, this.height) * (0.35 + Math.random() * 0.25),
          colorOffset: i * 1.75
        });
      }
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        const colorIdx = i % this.palette.length;
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          radius: Math.random() * 2.8 + 1.6,
          colorOffset: Math.random() * this.palette.length,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.03 + 0.015
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
          if (dist < 280 && dist > 0) {
            const force = (1 - dist / 280) * 5.5;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        });
      });

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this.resize();
          this.createAuroras();
          this.createParticles();
        }, 150);
      });
    }

    animate(time) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // =========================================================
      // 1. DIBUJAR AURORAS CROMÁTICAS FLUIDAS (FONDO VIVO MAKE HEALTH)
      // =========================================================
      for (let i = 0; i < this.auroras.length; i++) {
        const a = this.auroras[i];
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < -100) a.x = this.width + 100;
        if (a.x > this.width + 100) a.x = -100;
        if (a.y < -100) a.y = this.height + 100;
        if (a.y > this.height + 100) a.y = -100;

        const auroraColor = getDynamicColor(time, this.palette, a.colorOffset, 0.00045);
        const auroraAlpha = this.isPastel ? 0.09 : 0.07;

        const radialGrad = this.ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.radius);
        radialGrad.addColorStop(0, `rgba(${auroraColor.r}, ${auroraColor.g}, ${auroraColor.b}, ${auroraAlpha})`);
        radialGrad.addColorStop(0.5, `rgba(${auroraColor.r}, ${auroraColor.g}, ${auroraColor.b}, ${auroraAlpha * 0.4})`);
        radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = radialGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }

      // =========================================================
      // 2. DIBUJAR CONSTELACIÓN INTERACTIVA DE PARTÍCULAS
      // =========================================================
      const dynamicGlobalColor = getDynamicColor(time, this.palette, 0, 0.0007);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.992;
        p.vy *= 0.992;

        if (Math.abs(p.vx) < 0.15) p.vx += (Math.random() - 0.5) * 0.1;
        if (Math.abs(p.vy) < 0.15) p.vy += (Math.random() - 0.5) * 0.1;

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
            const force = (1 - dist / this.mouse.radius) * 0.85;
            p.vx += (dx / dist) * force * 0.12;
            p.vy += (dy / dist) * force * 0.12;

            // Línea luminosa hacia el cursor
            const lineAlpha = (1 - dist / this.mouse.radius) * 0.55;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.strokeStyle = `rgba(${dynamicGlobalColor.r}, ${dynamicGlobalColor.g}, ${dynamicGlobalColor.b}, ${lineAlpha})`;
            this.ctx.lineWidth = 1.3;
            this.ctx.stroke();
          }
        }

        // Color individual con morphing continuo bien perceptible
        const pColor = getDynamicColor(time, this.palette, p.colorOffset, 0.0007);
        p.phase += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.phase) * 0.6;

        // Halo de resplandor
        const glowAlpha = this.isPastel ? 0.35 : 0.45;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, currentRadius * 2.8, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${glowAlpha})`;
        this.ctx.fill();

        // Núcleo del nodo
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgb(${pColor.r}, ${pColor.g}, ${pColor.b})`;
        this.ctx.fill();

        // Conectar con nodos cercanos
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.maxDistance) {
            const alpha = (1 - dist / this.maxDistance) * 0.38;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);

            const grad = this.ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            const p2Color = getDynamicColor(time, this.palette, p2.colorOffset, 0.0007);
            grad.addColorStop(0, `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${alpha})`);
            grad.addColorStop(1, `rgba(${p2Color.r}, ${p2Color.g}, ${p2Color.b}, ${alpha})`);

            this.ctx.strokeStyle = grad;
            this.ctx.lineWidth = 1.0;
            this.ctx.stroke();
          }
        }
      }

      requestAnimationFrame((t) => this.animate(t));
    }
  }

  // Inicializar canvas fijo global
  document.addEventListener('DOMContentLoaded', () => {
    let globalCanvas = document.getElementById('globalKineticCanvas');
    if (!globalCanvas) {
      globalCanvas = document.createElement('canvas');
      globalCanvas.id = 'globalKineticCanvas';
      globalCanvas.className = 'global-kinetic-canvas';
      document.body.prepend(globalCanvas);
    }
    const theme = document.body.dataset.theme || 'dark';
    new FullPageKineticMesh(globalCanvas, { theme });
  });

  window.FullPageKineticMesh = FullPageKineticMesh;
})();
