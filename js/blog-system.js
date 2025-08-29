class BlogSystem {
  constructor() {
    this.posts = (window.blogPosts || []).slice().sort((a,b)=> new Date(b.date)-new Date(a.date));
    this.filteredPosts = [...this.posts];
    this.init();
  }

  init() {
    this.cache();
    // Apply initial category from hash before binding events/rendering
    const initialCat = this.getCategoryFromHash();
    if (initialCat) this.setActiveFilter(initialCat);
    this.setupFilters();
    this.generateTimeline();
    this.applyFilters();
    this.setupSearch();
    this.applyHash();
    window.addEventListener('hashchange', ()=> this.applyHash());
  }

  cache(){
    this.container = document.getElementById('blog-posts');
    this.template = document.getElementById('blog-card-template');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.yearSelect = document.getElementById('year-filter');
    this.monthSelect = document.getElementById('month-filter');
    this.searchInput = document.getElementById('blog-search');
  }

  setupFilters(){
    this.filterButtons.forEach(btn=>{
      btn.addEventListener('click', ()=>{ this.setActiveFilter(btn.dataset.filter || 'all'); this.applyFilters(); });
    });
    this.yearSelect?.addEventListener('change', ()=> this.applyFilters());
    this.monthSelect?.addEventListener('change', ()=> this.applyFilters());
  }

  setActiveFilter(category){
    const cat = category || 'all';
    (this.filterButtons||[]).forEach(b=> b.classList.toggle('active', (b.dataset.filter||'all')===cat));
  }

  setupSearch(){ this.searchInput?.addEventListener('input', ()=> this.applyFilters()); }

  generateTimeline(){
    // months
    const months = [ '01','02','03','04','05','06','07','08','09','10','11','12' ];
    this.monthSelect.innerHTML = '<option value="">All Months</option>' + months.map((m,i)=>`<option value="${m}">${(new Date(0, i)).toLocaleString(undefined,{month:'long'})}</option>`).join('');
    // years from posts
    const years = Array.from(new Set(this.posts.map(p=> new Date(p.date).getFullYear()))).sort((a,b)=>b-a);
    const yearOptions = ['<option value="">All Years</option>', ...years.map(y=>`<option value="${y}">${y}</option>`)];
    this.yearSelect.innerHTML = yearOptions.join('');
  }

  applyFilters(){
    const activeBtn = Array.from(this.filterButtons || []).find(b=>b.classList.contains('active'));
    const category = (activeBtn && activeBtn.dataset.filter) ? activeBtn.dataset.filter : (this.getCategoryFromHash() || 'all');
    const year = this.yearSelect?.value || '';
    const month = this.monthSelect?.value || '';
    const q = (this.searchInput?.value || '').toLowerCase();

    this.filteredPosts = this.posts.filter(p=>{
      const d = new Date(p.date);
      const byCat = (category==='all') || (p.category===category);
      const byYear = !year || d.getFullYear().toString()===year;
      const byMonth = !month || (String(d.getMonth()+1).padStart(2,'0')===month);
      const bySearch = !q || [p.title, p.summary, (p.tags||[]).join(' ')].join(' ').toLowerCase().includes(q);
      return byCat && byYear && byMonth && bySearch;
    });

    if (this.filteredPosts.length === 0) {
      this.container.innerHTML = '<div class="no-posts-message">No posts match the selected filters.</div>';
    } else {
      this.renderPosts();
    }
  }

  renderPosts(){
    if (!this.container || !this.template) return;
    this.container.innerHTML = '<div class="blog-loading"><span class="loading-dots"></span></div>';
    const frag = document.createDocumentFragment();
    this.filteredPosts.forEach(post=> frag.appendChild(this.createCard(post)));
    this.container.innerHTML = '';
    this.container.appendChild(frag);
    // After rendering, if a hash is present, expand the matching post
    this.applyHash();
  }

  createCard(post){
    const frag = this.template.content.cloneNode(true);
    const article = frag.querySelector('.blog-card');
    // Ensure visibility even with AOS defaults; cards are added dynamically after DOMContentLoaded
    article.classList.add('aos-animate');
    article.dataset.id = post.id;
    article.id = post.id; // allow anchor navigation
    frag.querySelector('.post-date').textContent = this.formatDate(post.date);
    frag.querySelector('.post-category').textContent = post.category;
    frag.querySelector('.post-emoji').textContent = post.emoji || '';
    frag.querySelector('.title-text').textContent = post.title;
    frag.querySelector('.post-summary').textContent = post.summary;

    // metrics
    const metrics = frag.querySelector('.post-metrics');
    if (post.metrics) {
      Object.entries(post.metrics).forEach(([k,v])=> metrics.appendChild(this.metricBadge(k,v)));
    }

    frag.querySelector('.expand-btn').addEventListener('click', (e)=>{
      e.preventDefault(); e.stopPropagation();
      const expanded = article.classList.contains('expanded');
      document.querySelectorAll('.blog-card.expanded').forEach(c=> this.collapse(c));
      if (!expanded) this.expand(article, post);
    });
    return frag;
  }

  metricBadge(key,value){
    const el = document.createElement('span');
    el.className = 'metric-badge';
    const label = document.createElement('span'); label.textContent = key;
    const val = document.createElement('span'); val.className='metric-value'; val.textContent = value;
    el.append(label, val); return el;
  }

  expand(card, post){
    card.classList.add('expanded');
    const expanded = card.querySelector('.expanded-content');
    const full = expanded.querySelector('.full-post'); full.innerHTML = this.parse(post.content || '');
    const links = expanded.querySelector('.post-links'); links.innerHTML='';
    if (post.links && post.links.length){
      links.className = `post-links links-${Math.min(post.links.length,4)}`;
      post.links.forEach(l=> links.appendChild(this.linkCard(l)));
    }
    const tags = expanded.querySelector('.post-tags'); tags.innerHTML='';
    (post.tags||[]).forEach(t=>{ const s=document.createElement('span'); s.className='tag-pill'; s.textContent=`#${t}`; tags.appendChild(s); });
    expanded.style.maxHeight = expanded.scrollHeight + 'px';
    const btn = card.querySelector('.expand-btn'); btn.textContent = 'Show Less ↑';

    // Hide missing images gracefully
    full.querySelectorAll('img').forEach(img=>{
      img.addEventListener('error', ()=>{
        const fig = img.closest('figure');
        if (fig) fig.remove(); else img.remove();
      });
    });
  }

  collapse(card){
    card.classList.remove('expanded');
    const expanded = card.querySelector('.expanded-content'); expanded.style.maxHeight = '0px';
    const btn = card.querySelector('.expand-btn'); if (btn) btn.textContent = 'Read More →';
  }

  linkCard(link){
    const a = document.createElement('a'); a.className='link-card'; a.href=link.url; a.target='_blank'; a.rel='noopener noreferrer';
    const icon=document.createElement('span'); icon.className='link-icon'; icon.textContent=this.iconFor(link.type);
    const text=document.createElement('span'); text.className='link-text'; text.textContent=link.text;
    a.append(icon,text); return a;
  }

  iconFor(type){ return ({code:'💻', paper:'📄', demo:'🚀', video:'🎥', slides:'📊', data:'🧪'}[type] || '🔗'); }

  formatDate(d){ try { const dt=new Date(d); return dt.toLocaleDateString(undefined,{year:'numeric', month:'short', day:'numeric'});} catch { return d; } }

  parse(html){
    // Normalize a few common Unicode punctuation marks to HTML entities to avoid mojibake on misconfigured encodings
    if (!html) return html;
    return html
      .replace(/\u2019/g, '&rsquo;')  // ’
      .replace(/\u2018/g, '&lsquo;')  // ‘
      .replace(/\u2014/g, '&mdash;')  // —
      .replace(/\u2013/g, '&ndash;')  // –
      .replace(/\u00A0/g, '&nbsp;');  // non‑breaking space
  }

  applyHash(){
    const h = (window.location.hash||'').replace('#','');
    if (!h) return;
    // Category jump: support #research, #community, #papers
    if (['research','community','papers'].includes(h)) {
      this.setActiveFilter(h);
      this.applyFilters();
      document.getElementById('blog-container')?.scrollIntoView({behavior:'smooth'});
      return;
    }

    // Direct post jump: expand by id
    const esc = (s)=> (window.CSS && CSS.escape) ? CSS.escape(s) : s.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
    const card = this.container?.querySelector(`.blog-card[data-id="${esc(h)}"]`);
    if (card) {
      document.querySelectorAll('.blog-card.expanded').forEach(c=> this.collapse(c));
      this.expand(card, this.posts.find(p=> p.id===h));
      card.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  }

  getCategoryFromHash(){
    const h = (window.location.hash||'').replace('#','');
    return ['research','community','papers'].includes(h) ? h : 'all';
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const start = () => { try { new BlogSystem(); } catch (e) { console.error('BlogSystem init failed', e); } };
  // Ensure posts are available (handles occasional race on local file:// loads)
  if (Array.isArray(window.blogPosts) && window.blogPosts.length) {
    start();
  } else {
    let tries = 0;
    const id = setInterval(()=>{
      tries++;
      if (Array.isArray(window.blogPosts)) { clearInterval(id); start(); }
      else if (tries > 50) { clearInterval(id); start(); }
    }, 20);
  }
});
