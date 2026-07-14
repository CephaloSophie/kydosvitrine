// Star field canvas animation for cosmic background
(function() {
  class StarField {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.stars = [];
      this.shootingStars = [];
      this.resize();
      this.init();
      window.addEventListener('resize', () => this.resize());
      this.animate();
    }
    resize() {
      this.w = this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
      this.h = this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    init() {
      this.stars = [];
      const count = Math.floor((this.canvas.offsetWidth * this.canvas.offsetHeight) / 3000);
      for (let i = 0; i < count; i++) {
        this.stars.push({
          x: Math.random() * this.canvas.offsetWidth,
          y: Math.random() * this.canvas.offsetHeight,
          r: Math.random() * 1.5 + 0.3,
          a: Math.random() * 0.6 + 0.2,
          speed: Math.random() * 0.0008 + 0.0003,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    spawnShootingStar() {
      if (this.shootingStars.length > 2) return;
      this.shootingStars.push({
        x: Math.random() * this.canvas.offsetWidth * 0.6,
        y: Math.random() * this.canvas.offsetHeight * 0.3,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 4 + 3,
        angle: Math.PI / 4 + Math.random() * 0.3,
        life: 1,
      });
    }
    animate() {
      const cw = this.canvas.offsetWidth;
      const ch = this.canvas.offsetHeight;
      this.ctx.clearRect(0, 0, cw, ch);
      const t = Date.now();
      // Stars
      for (const s of this.stars) {
        const flicker = Math.sin(t * s.speed + s.phase) * 0.3 + 0.7;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(220,225,255,${s.a * flicker})`;
        this.ctx.fill();
      }
      // Shooting stars
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const ss = this.shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life -= 0.008;
        if (ss.life <= 0) { this.shootingStars.splice(i, 1); continue; }
        const ex = ss.x - Math.cos(ss.angle) * ss.len;
        const ey = ss.y - Math.sin(ss.angle) * ss.len;
        const grad = this.ctx.createLinearGradient(ss.x, ss.y, ex, ey);
        grad.addColorStop(0, `rgba(255,255,255,${ss.life * 0.8})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        this.ctx.beginPath();
        this.ctx.moveTo(ss.x, ss.y);
        this.ctx.lineTo(ex, ey);
        this.ctx.strokeStyle = grad;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      }
      if (Math.random() < 0.003) this.spawnShootingStar();
      requestAnimationFrame(() => this.animate());
    }
  }
  window.StarField = StarField;
})();
