/**
 * Kinetic Aurora & Constellation Network Canvas — Full Page Engine
 * Paletas 100% Pastel Homogéneas, Coherentes y Armónicas (Cero Neón / Cero Ruido)
 * Sistema de gradiente espacial continuo: los nodos adyacentes comparten tonalidades
 * armónicas en degradados suaves (Lila -> Lavanda -> Cielo -> Rosa Sunset -> Melocotón).
 */

(function () {
  'use strict';

  // 1. Paleta Pastel Armónica para el Hub Principal (Lila, Lavanda, Cielo, Orquídea y Melocotón Pastel)
  const PALETTE_HUB_PASTEL = [
    { r: 196, g: 181, b: 253, hex: '#c4b5fd', name: 'Lila Pastel' },
    { r: 165, g: 180, b: 252, hex: '#a5b4fc', name: 'Lavanda Cósmica Suave' },
    { r: 147, g: 197, b: 253, hex: '#93c5fd', name: 'Cielo / Bígaro Pastel' },
    { r: 244, g: 114, b: 182, hex: '#f472b6', name: 'Rosa Orquídea Pastel' },
    { r: 252, g: 165, b: 165, hex: '#fca5a5', name: 'Rosa Sunset Pastel' },
    { r: 253, g: 186, b: 116, hex: '#fdba74', name: 'Melocotón Cálido Pastel' },
    { r: 196, g: 181, b: 253, hex: '#c4b5fd', name: 'Lila Pastel Cierre' }
  ];

  // 2. Paleta Pastel Conecta Universidades (Gala Cálida & Botánica Armónica)
  const PALETTE_UNIV_PASTEL = [
    { r: 251, g: 113, b: 133, hex: '#fb7185', name: 'Rosa Sunset Gala' },
    { r: 192, g: 132, b: 252, hex: '#c084fc', name: 'Orquídea Cósmica' },
    { r: 232, g: 121, b: 249, hex: '#e879f9', name: 'Violeta Pastel' },
    { r: 253, g: 186, b: 116, hex: '#fdba74', name: 'Melocotón Pastel' },
    { r: 253, g: 230, b: 138, hex: '#fde68a', name: 'Champán Pastel' },
    { r: 134, g: 239, b: 172, hex: '#86efac', name: 'Matcha Pastel' },
    { r: 251, g: 113, b: 133, hex: '#fb7185', name: 'Rosa Sunset Cierre' }
  ];

  // 3. Paleta Pastel Conecta Empresas (Bígaro, Menta Suave, Cian Pastel y Lavanda)
  const PALETTE_EMPRESAS_PASTEL = [
    { r: 147, g: 197, b: 253, hex: '#93c5fd', name: 'Cielo Pastel' },
    { r: 165, g: 243, b: 252, hex: '#a5f3fc', name: 'Cian Hielo Suave' },
    { r: 167, g: 243, b: 208, hex: '#a7f3d0', name: 'Menta Celadón' },
    { r: 196, g: 181, b: 253, hex: '#c4b5fd', name: 'Lavanda Suave' },
    { r: 147, g: 197, b: 253, hex: '#93c5fd', name: 'Cielo Pastel Cierre' }
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
      
      if (this.theme === 'dark-pastel') {
        this.palette = PALETTE_UNIV_PASTEL;
      } else if (this.theme === 'corporate') {
        this.palette = PALETTE_EMPRESAS_PASTEL;
      } else {
        this.palette = PALETTE_HUB_PASTEL;
      }

      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.particles = [];
      this.auroras = [];
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

      this.maxDistance = Math.min(this.width, this.height) * 0.18;
      if (this.maxDistance < 110) this.maxDistance = 110;
      if (this.maxDistance > 165) this.maxDistance = 165;

      this.particleCount = Math.floor((this.width * this.height) / 15000);
      if (this.particleCount < 45) this.particleCount = 45;
      if (this.particleCount > 95) this.particleCount = 95;
    }

    createAuroras() {
      // Auroras atmosféricas homogéneas difusas (fondo fluido envolvente)
      this.auroras = [];
      const numAuroras = 3;
      for (let i = 0; i < numAuroras; i++) {
        this.auroras.push({
          x: (this.width / (numAuroras + 1)) * (i + 1),
          y: Math.random() * this.height,
          radius: Math.min(this.width, this.height) * (0.5 + Math.random() * 0.25),
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
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
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.2 + 2.0, // Tamaño uniforme y refinado (2.0px a 3.2px)
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
          if (dist < 180 && dist > 0) {
            const force = (1 - dist / 180) * 2.5;
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

        const auroraColor = getDynamicColor(time, this.palette, a.colorOffset, 0.00025);
        const auroraAlpha = 0.075;

        const radialGrad = this.ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.radius);
        radialGrad.addColorStop(0, `rgba(${auroraColor.r}, ${auroraColor.g}, ${auroraColor.b}, ${auroraAlpha})`);
        radialGrad.addColorStop(0.5, `rgba(${auroraColor.r}, ${auroraColor.g}, ${auroraColor.b}, ${auroraAlpha * 0.4})`);
        radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = radialGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }

      // =========================================================
      // 2. DIBUJAR CONSTELACIÓN PASTEL HOMOGÉNEA (GRADIENTE ESPACIAL CONTINUO)
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

        // Color espacial homogéneo: nodos cercanos tienen tonalidades armónicas continuas
        const spatialProgress = ((p.x / this.width) * 1.4 + (p.y / this.height) * 0.6);
        const pColor = getDynamicColor(time, this.palette, spatialProgress, 0.00025);

        // Interacción con cursor global
        if (this.mouse.isActive) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.mouse.radius && dist > 0) {
            const force = (1 - dist / this.mouse.radius) * 0.65;
            p.vx += (dx / dist) * force * 0.09;
            p.vy += (dy / dist) * force * 0.09;

            // Línea luminosa hacia el cursor (suave pastel)
            const lineAlpha = (1 - dist / this.mouse.radius) * 0.38;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.strokeStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${lineAlpha})`;
            this.ctx.lineWidth = 1.1;
            this.ctx.stroke();
          }
        }

        p.phase += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.phase) * 0.4;

        // Halo suave pastel uniforme
        const glowAlpha = 0.2;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, currentRadius * 1.9, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${glowAlpha})`;
        this.ctx.fill();

        // Núcleo del nodo pastel nítido
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgb(${pColor.r}, ${pColor.g}, ${pColor.b})`;
        this.ctx.fill();

        // Conectar con nodos cercanos con líneas pastel finas y armónicas
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.maxDistance) {
            const lineAlpha = (1 - dist / this.maxDistance) * 0.22;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${lineAlpha})`;
            this.ctx.lineWidth = 0.9;
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
