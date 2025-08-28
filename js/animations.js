// Typing headers, Matrix rain, AOS-like animations, counters, magnetic buttons
class TypingHeaders {
  constructor() {
    document.querySelectorAll('.terminal-header').forEach(header => {
      const text = header.dataset.text || '';
      const elt = header.querySelector('.typing-text');
      if (!elt) return;
      let i = 0;
      const type = () => { if (i < text.length) { elt.textContent += text.charAt(i++); setTimeout(type, 100); } };
      const io = new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { type(); obs.unobserve(header); } }, { threshold: 0.4 });
      io.observe(header);
    });
  }
}

class MatrixRain {
  constructor() {
    this.container = document.getElementById('matrix-rain');
    if (!this.container) return;
    this.characters = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','∑','∫','∂','∇','∆','π','φ','λ','Ω','α','β','γ','{','}','(',')','[',']','<','>','/','=','+','-','0','1','2','3','4','5','6','7','8','9'];
    this.init();
  }
  init() { const count = Math.floor(window.innerWidth/20); for (let i=0;i<count;i++) this.createColumn(i*20); }
  createColumn(x) { const col = document.createElement('div'); col.className='matrix-column'; col.style.left = x+'px'; col.style.animationDuration = (Math.random()*10+10)+'s'; col.style.animationDelay = (Math.random()*10)+'s'; let t=''; for (let i=0;i<30;i++) t += this.characters[Math.floor(Math.random()*this.characters.length)]+'\n'; col.textContent=t; this.container.appendChild(col); }
}

class ScrollAnimations {
  constructor(){ this.els = document.querySelectorAll('[data-aos]'); if (!this.els.length) return; const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if (e.isIntersecting){ const a=e.target.dataset.aos; e.target.classList.add('aos-animate', `aos-${a}`); io.unobserve(e.target);} });},{threshold:.1, rootMargin:'50px'}); this.els.forEach(el=>io.observe(el)); }
}

class AnimatedCounter { constructor(el){ this.el=el; this.target=parseInt(el.dataset.target||'0',10); this.prefix=el.dataset.prefix||''; this.suffix=el.dataset.suffix||''; this.format=el.dataset.format; this.done=false; const io=new IntersectionObserver((es)=>{es.forEach(en=>{ if(en.isIntersecting&&!this.done){ this.animate(); this.done=true; io.unobserve(el);} });}); io.observe(el);} animate(){ const dur=2000; const start=Date.now(); const tick=()=>{ const p=Math.min((Date.now()-start)/dur,1); const ease=1-Math.pow(1-p,4); const cur=Math.floor(ease*this.target); let disp=cur; if(this.format==='comma'){ disp=cur.toLocaleString(); } this.el.textContent=this.prefix+disp+this.suffix; if(p<1) requestAnimationFrame(tick); }; tick(); } }

function initMagneticButtons(){ document.querySelectorAll('[data-magnetic]').forEach(el=>{ el.addEventListener('mousemove',(e)=>{ const r=el.getBoundingClientRect(); const x=e.clientX-r.left-r.width/2; const y=e.clientY-r.top-r.height/2; el.style.transform=`translate(${x*.3}px,${y*.3}px)`; }); el.addEventListener('mouseleave',()=>{ el.style.transform='translate(0,0)'; }); }); }

window.addEventListener('DOMContentLoaded',()=>{
  new TypingHeaders();
  new MatrixRain();
  new ScrollAnimations();
  document.querySelectorAll('.stat-number').forEach(el=> new AnimatedCounter(el));
  initMagneticButtons();
  // Optional: Orbital nav
  if (document.querySelector('.orbital-container')) new OrbitalNav();
});

// Orbital nav items rotating gently around a center element
class OrbitalNav {
  constructor(){
    this.container = document.querySelector('.orbital-container');
    this.items = Array.from(document.querySelectorAll('.orbital-item'));
    this.t = 0; this.rAF = null;
    if (this.container && this.items.length) this.animate();
  }
  animate(){
    const rect = this.container.getBoundingClientRect();
    const cx = rect.width / 2; const cy = rect.height / 2; const radius = Math.min(cx, cy) - 10;
    this.items.forEach((el, i)=>{
      const angle = this.t + (i * (Math.PI*2 / this.items.length));
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      el.style.position = 'absolute';
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    });
    this.t += 0.005; this.rAF = requestAnimationFrame(()=>this.animate());
  }
}
