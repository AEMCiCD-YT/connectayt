/**
 * Kinetic Constellation & Shifting Network Canvas
 * Inspirado en MIT Critical Data / Make Health
 * Sistema de nodos en movimiento continuo, interacción con el cursor y transición cromática dinámica.
 */

(function () {
  'use strict';

  // Paleta oficial de Conecta IEEE YT & Escuelas
  const PALETTE = [
    { r: 0,   g: 188, b: 202, hex: '#00bcca' }, // Cian
    { r: 60,  g: 159, b: 230, hex: '#3c9fe6' }, // Azul Claro
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
    const speed = 0.0003; // Velocidad de transición suave
    const progress = ((time * speed + offset) % totalColors + totalColors) % totalColors;
    const index1 = Math.floor(progress);
    const index2 = (index1 + 1) % totalColors;
    const factor = progress - index1;
    return interpolateColor(PALETTE[index1], PALETTE[index2], factor);
  }

  class KineticMesh {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.theme = options.theme || 'dark'; // 'dark' or 'light'
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.particles = [];
      this.mouse = {
        x: -9999,
        y: -9999,
        radius: 180,
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
      const parent = this.canvas.parentElement;
      const width = parent ? parent.offsetWidth : window.innerWidth;
      const height = parent ? parent.offsetHeight : window.innerHeight;

      this.width = width;
      this.height = height;

      this.canvas.width = width * this.dpr;
      this.canvas.height = height * this.dpr;
      this.ctx.scale(this.dpr, this.dpr);

      this.maxDistance = Math.min(width, height) * 0.22;
      if (this.maxDistance < 100) this.maxDistance = 100;
      if (this.maxDistance > 160) this.maxDistance = 160;

      // Densidad adaptativa de nodos
      this.particleCount = Math.floor((width * height) / 13000);
      if (this.particleCount < 35) this.particleCount = 35;
      if (this.particleCount > 85) this.particleCount = 85;
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        const colorIdx = i % PALETTE.length;
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          radius: Math.random() * 2.2 + 1.2,
          colorIdx: colorIdx,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01
        });
      }
    }

    bindEvents() {
      const target = this.canvas.parentElement || window;

      const handleMove = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.mouse.isActive = true;
      };

      const handleLeave = () => {
        this.mouse.isActive = false;
        this.mouse.x = -9999;
        this.mouse.y = -9999;
      };

      target.addEventListener('mousemove', handleMove, { passive: true });
      target.addEventListener('mouseleave', handleLeave, { passive: true });

      // Soporte táctil móvil
      target.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          const rect = this.canvas.getBoundingClientRect();
          this.mouse.x = e.touches[0].clientX - rect.left;
          this.mouse.y = e.touches[0].clientY - rect.top;
          this.mouse.isActive = true;
        }
      }, { passive: true });

      target.addEventListener('touchend', handleLeave, { passive: true });

      // Click ripple burst
      target.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        this.particles.forEach(p => {
          const dx = p.x - clickX;
          const dy = p.y - clickY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const force = (1 - dist / 220) * 4;
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

        // Fricción leve para estabilizar impulsos
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Restaurar velocidad mínima si decae
        if (Math.abs(p.vx) < 0.15) p.vx += (Math.random() - 0.5) * 0.1;
        if (Math.abs(p.vy) < 0.15) p.vy += (Math.random() - 0.5) * 0.1;

        // Rebote en bordes suaves
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > this.width) { p.x = this.width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > this.height) { p.y = this.height; p.vy *= -1; }

        // Interacción con cursor (atracción / repulsión elástica)
        if (this.mouse.isActive) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.mouse.radius) {
            const force = (1 - dist / this.mouse.radius) * 0.8;
            p.vx += (dx / dist) * force * 0.12;
            p.vy += (dy / dist) * force * 0.12;

            // Línea de conexión al cursor
            const lineAlpha = (1 - dist / this.mouse.radius) * 0.45;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.strokeStyle = `rgba(${dynamicGlobalColor.r}, ${dynamicGlobalColor.g}, ${dynamicGlobalColor.b}, ${lineAlpha})`;
            this.ctx.lineWidth = 1.2;
            this.ctx.stroke();
          }
        }

        // Color individual con morphing cromático
        const pColor = getDynamicBrandColor(time, p.colorIdx);
        p.phase += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.phase) * 0.6;

        // Halo de resplandor
        const glowAlpha = this.theme === 'dark' ? 0.35 : 0.18;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, currentRadius * 2.5, 0, Math.PI * 2);
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
            const alpha = (1 - dist / this.maxDistance) * (this.theme === 'dark' ? 0.28 : 0.16);
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            
            // Gradiente entre ambos nodos
            const grad = this.ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            const p2Color = getDynamicBrandColor(time, p2.colorIdx);
            grad.addColorStop(0, `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${alpha})`);
            grad.addColorStop(1, `rgba(${p2Color.r}, ${p2Color.g}, ${p2Color.b}, ${alpha})`);

            this.ctx.strokeStyle = grad;
            this.ctx.lineWidth = 0.9;
            this.ctx.stroke();
          }
        }
      }

      requestAnimationFrame((t) => this.animate(t));
    }
  }

  // Inicialización automática para cualquier canvas con la clase `.kinetic-canvas`
  document.addEventListener('DOMContentLoaded', () => {
    const canvases = document.querySelectorAll('.kinetic-canvas');
    canvases.forEach(canvas => {
      const theme = canvas.dataset.theme || 'dark';
      new KineticMesh(canvas, { theme });
    });
  });

  window.KineticMesh = KineticMesh;
})();
