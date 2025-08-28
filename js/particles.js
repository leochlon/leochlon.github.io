// DNA-like particles system (lightweight, no external deps)
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return; // graceful skip
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.init();
  }
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
    for (let i = 0; i < 50; i++) {
      this.particles.push({ x: Math.random()*this.canvas.width, y: Math.random()*this.canvas.height, vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5, radius: Math.random()*2+1, helix: i%2===0 });
    }
    this.animate();
  }
  resize() { if (!this.canvas) return; this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
  animate() {
    if (!this.canvas) return;
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.particles.forEach((p, i) => {
      if (p.helix) {
        p.x += p.vx; p.y = this.canvas.height/2 + Math.sin(p.x*0.01)*100; if (p.x > this.canvas.width) p.x = 0;
      } else {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
        const dx = this.mouse.x - p.x; const dy = this.mouse.y - p.y; const dist = Math.hypot(dx,dy);
        if (dist < 200) { p.vx += dx*0.00001; p.vy += dy*0.00001; }
      }
      this.ctx.beginPath(); this.ctx.arc(p.x,p.y,p.radius,0,Math.PI*2); this.ctx.fillStyle = p.helix ? '#00D9FF' : '#00FFF0'; this.ctx.fill();
      this.particles.slice(i+1).forEach(p2 => {
        const d = Math.hypot(p.x-p2.x, p.y-p2.y);
        if (d < 100) { this.ctx.beginPath(); this.ctx.strokeStyle = `rgba(0,217,255,${0.2*(1-d/100)})`; this.ctx.lineWidth = .5; this.ctx.moveTo(p.x,p.y); this.ctx.lineTo(p2.x,p2.y); this.ctx.stroke(); }
      });
    });
    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => { new ParticleSystem(); });

