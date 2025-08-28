class EasterEggs {
  constructor(){ this.konami=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; this.pos=0; this.init(); }
  init(){ document.addEventListener('keydown',(e)=>{ if(e.key===this.konami[this.pos]){ this.pos++; if(this.pos===this.konami.length){ this.activate(); this.pos=0; } } else { this.pos=0; } });
    console.log('%c🔬 Welcome to HassanaLabs','color:#00D9FF;font-size:20px;font-weight:bold');
    console.log('%c"In memory of Hassana - bridging science and heritage"','color:#FFD700;font-style:italic');
    console.log('%cTry the Konami code! ↑↑↓↓←→←→BA','color:#00FF41;font-family:monospace');
  }
  activate(){ document.body.style.animation='konamiGlow 2s ease'; const m=document.createElement('div'); m.className='konami-message'; m.innerHTML=`<h2>🌟 Dedicated to Hassana 🌟</h2><p>Bridging the wisdom of our ancestors with the innovations of tomorrow</p><p style="font-family: var(--font-arabic);">حسانة - راحت ولكن ذكراها باقية</p>`; document.body.appendChild(m); setTimeout(()=>{ m.remove(); document.body.style.animation=''; },5000); }
}
new EasterEggs();

