class CommandPalette {
  constructor() {
    this.palette = document.getElementById('command-palette');
    if (!this.palette) return;
    this.input = this.palette.querySelector('.command-input');
    this.items = this.palette.querySelectorAll('.command-item');
    this.currentIndex = 0;
    this.init();
  }
  init() {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); this.toggle(); }
      if (this.palette.style.display !== 'none') {
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowDown') this.navigateDown();
        if (e.key === 'ArrowUp') this.navigateUp();
        if (e.key === 'Enter') this.executeCommand();
      }
    });
    this.palette.querySelector('.command-overlay')?.addEventListener('click', () => this.close());
    this.input?.addEventListener('input', (e) => this.filterCommands(e.target.value));
    this.items.forEach(item => item.addEventListener('click', () => this.executeAction(item.dataset.action)));
  }
  toggle(){ (this.palette.style.display === 'none' || !this.palette.style.display) ? this.open() : this.close(); }
  open(){ this.palette.style.display='block'; this.input?.focus(); if (this.input) this.input.value=''; this.currentIndex=0; this.updateActiveItem(); }
  close(){ this.palette.style.display='none'; }
  navigateDown(){ this.currentIndex=(this.currentIndex+1)%this.items.length; this.updateActiveItem(); }
  navigateUp(){ this.currentIndex=(this.currentIndex-1+this.items.length)%this.items.length; this.updateActiveItem(); }
  updateActiveItem(){ this.items.forEach((item,i)=> item.classList.toggle('active', i===this.currentIndex)); }
  executeCommand(){ const it=this.items[this.currentIndex]; if (it) this.executeAction(it.dataset.action); }
  executeAction(action){ switch(action){ case 'projects': document.getElementById('projects-grid')?.scrollIntoView({behavior:'smooth'}); break; case 'research': window.location.href='work.html'; break; case 'contact': window.location.href='contact.html'; break; case 'theme': document.body.classList.toggle('light-theme'); break; } this.close(); }
  filterCommands(q){ const s=(q||'').toLowerCase(); this.items.forEach(it=>{ const t=it.querySelector('.command-text')?.textContent.toLowerCase()||''; it.style.display = t.includes(s) ? 'flex':'none'; }); }
}

window.addEventListener('DOMContentLoaded',()=>{ new CommandPalette(); });

