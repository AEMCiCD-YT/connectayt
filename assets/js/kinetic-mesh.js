/**
 * Kinetic Constellation & Shifting Network Canvas — Full Page Background Engine
 * Inspirado en MIT Critical Data / Make Health
 * Sistema de nodos en movimiento continuo por toda la página, interacción global con cursor y transición cromática fluida.
 */

(function () {
  'use strict';

  // Paleta oficial Conecta IEEE YT & Escuelas
  const PALETTE = [
    { r: 0,   g: 188, b: 202, hex: '#00bcca' }, // Cian
    { r: 60,  g: 159, b: 230, hex: '#3c9fe6' }, // Azul Eléctrico
    { r: 157, g: 124, b: 176, hex: '#9d7cb0' }, // Púrpura
    { r: 255, g: 82,  b: 66,  hex: '#ff5242' }, // Coral
    { r: 253, g: 202, b: 38,  hex: '#fdca26' }, // Oro / Amarillo
    { r: 0,   g: 188, b: 82,  hex: '#00bc52' }, // Verde
    { r: 0,   g: 98,  b: 155, hex: '#00629b' }  // Azul IEEE
  ];

  function interpolateColor(color1, color2, factor) {
    return {
      r: Math.round(color1.r + (color2.r - color1.r) * factor),
      g: Math.round(color1.g + (color2.g - color1.g) * factor),
      b: Math.round(color1.b + (color2.b - color1.b) * factor)
    };
  }

  function getDynamicBrandColor(time, offset = 0) {
    const totalColors = PALETTE.length;
    const speed = 0.00025; // Transición cromática suave
    const progress = ((time * speed + offset) % totalColors + totalColors) % totalColors;
    const index1 = Math.floor(progress);
    const index2 = (index1 + 1) % totalColors;
    const factor = progress - index1;
    return interpolateColor(PALETTE[index1], PALETTE[index2], factor);
  }

  class FullPageKineticMesh {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.theme = options.theme || 'dark';
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.particles = [];
      this.mouse = {
        x: -9999,
        y: -9999,
        radius: 200,
        isActive: false
      };

      this.init();
    }

    init() {
      this.resize();
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

      this.maxDistance = Math.min(this.width, this.height) * 0.18;
      if (this.maxDistance < 110) this.maxDistance = 110;
      if (this.maxDistance > 160) this.maxDistance = 160;

      // Cantidad de partículas balanceada para rendimiento suave en toda la pantalla
      this.particleCount = Math.floor((this.width * this.height) / 16000);
      if (this.particleCount < 45) this.particleCount = 45;
      if (this.particleCount > 100) this.particleCount = 100;
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        const colorIdx = i % PALETTE.length;
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          radius: Math.random() * 2.2 + 1.2,
          colorIdx: colorIdx,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01
        });
      }
    }

    bindEvents() {
      // Seguimiento global del cursor en toda la ventana
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

      // Soporte táctil global
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

      // Efecto onda expansiva al hacer clic
      window.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;

        this.particles.forEach(p => {
          const dx = p.x - clickX;
          const dy = p.y - clickY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 260 && dist > 0) {
            const force = (1 - dist / 260) * 4.5;
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
          this.createParticles();
        }, 150);
      });
    }

    animate(time) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      const dynamicGlobalColor = getDynamicBrandColor(time);

      // 1. Actualizar y dibujar partículas
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // Movimiento continuo suave
        p.x += p.vx;
        p.y += p.vy;

        // Fricción leve para estabilizar
        p.vx *= 0.992;
        p.vy *= 0.992;

        // Mantener velocidad constante
        if (Math.abs(p.vx) < 0.12) p.vx += (Math.random() - 0.5) * 0.08;
        if (Math.abs(p.vy) < 0.12) p.vy += (Math.random() - 0.5) * 0.08;

        // Envoltura / rebote en bordes de pantalla
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
            const force = (1 - dist / this.mouse.radius) * 0.7;
            p.vx += (dx / dist) * force * 0.1;
            p.vy += (dy / dist) * force * 0.1;

            // Línea de conexión al cursor
            const lineAlpha = (1 - dist / this.mouse.radius) * 0.4;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.strokeStyle = `rgba(${dynamicGlobalColor.r}, ${dynamicGlobalColor.g}, ${dynamicGlobalColor.b}, ${lineAlpha})`;
            this.ctx.lineWidth = 1.1;
            this.ctx.stroke();
          }
        }

        // Color individual con morphing cromático
        const pColor = getDynamicBrandColor(time, p.colorIdx);
        p.phase += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.phase) * 0.5;

        // Halo de resplandor
        const glowAlpha = this.theme === 'dark' ? 0.35 : 0.22;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, currentRadius * 2.6, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${glowAlpha})`;
        this.ctx.fill();

        // Núcleo del nodo
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgb(${pColor.r}, ${pColor.g}, ${pColor.b})`;
        this.ctx.fill();

        // 2. Conectar partículas cercanas con líneas dinámicas
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.maxDistance) {
            const alpha = (1 - dist / this.maxDistance) * (this.theme === 'dark' ? 0.25 : 0.18);
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);

            const grad = this.ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            const p2Color = getDynamicBrandColor(time, p2.colorIdx);
            grad.addColorStop(0, `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${alpha})`);
            grad.addColorStop(1, `rgba(${p2Color.r}, ${p2Color.g}, ${p2Color.b}, ${alpha})`);

            this.ctx.strokeStyle = grad;
            this.ctx.lineWidth = 0.85;
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
