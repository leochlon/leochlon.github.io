// Photo gallery stories
class MemorialGallery {
  constructor() {
    this.stories = {
      1: { title: 'The Books She Saved For', content: 'During the hardest times, when food was scarce, she still saved for books—believing knowledge would feed us longer.' },
      2: { title: 'Resilience', content: 'Through displacement and uncertainty, she taught us dignity in learning and in helping others learn.' }
    };
    this.init();
  }
  init(){
    document.querySelectorAll('.photo-tile').forEach(tile=>{
      tile.addEventListener('click', ()=>{
        const id = tile.dataset.story;
        this.displayStory(this.stories[id]);
      });
    });
  }
  displayStory(story){
    const panel = document.getElementById('story-display');
    if (!panel || !story) return;
    panel.innerHTML = `<h3>${story.title}</h3><p>${story.content}</p>`;
    panel.classList.add('active');
    panel.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
}

// Intersection observer for timeline reveal
function initMemorialObservers(){
  const cards = document.querySelectorAll('.memory-card, .legacy-card');
  if (!cards.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .1, rootMargin: '0px 0px -80px 0px' });
  cards.forEach(c=> obs.observe(c));
}

document.addEventListener('DOMContentLoaded', ()=>{
  new MemorialGallery();
  initMemorialObservers();
  // Initialize animated counters with stagger for featured numbers
  if (typeof AnimatedCounter === 'function') {
    const bigCounters = Array.from(document.querySelectorAll('.big-number'));
    bigCounters.forEach((el, i) => setTimeout(() => new AnimatedCounter(el), i * 200));
    // Note: .stat-number counters are initialized globally in animations.js (also staggered)
  }
  // Graceful image error handling
  document.querySelectorAll('.memory-card img, .photo-tile img, .story-photo').forEach(img => {
    img.addEventListener('error', function(){ this.style.display = 'none'; });
  });
});
