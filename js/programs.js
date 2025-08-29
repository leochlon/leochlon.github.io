// Programs page dynamic features: testimonials, research links, sessions, learning path
(function(){
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  const pick = (arr, n)=> arr.slice(0, n);
  // Source is UTF‑8; no runtime normalization needed
  const normalizeText = (s)=> (s||'');

  function buildTestimonials(){
    const el = document.getElementById('testimonials');
    if (!el || !Array.isArray(window.blogPosts)) return;
    // Prefer actual testimonials; if none, remove section (avoid placeholder noise)
    const testimonials = window.blogPosts.filter(p=> p.category === 'testimonial');
    if (!testimonials.length) {
      const section = document.querySelector('.testimonials-section');
      if (section) section.remove();
      return;
    }
    const items = pick(testimonials, 6).map(post=>{
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      const quote = document.createElement('blockquote');
      quote.textContent = cleanQuote(post.summary || '');
      const meta = document.createElement('div');
      meta.className = 'testimonial-meta';
      meta.textContent = `${formatDate(post.date)} · ${post.title}`;
      card.append(quote, meta);
      return card;
    });
    el.innerHTML = '';
    items.forEach(c=> el.appendChild(c));
    // Simple auto-rotate: emphasize a rotating set without hiding others
    let idx = 0; const step = ()=>{
      const children = Array.from(el.children);
      children.forEach((c,i)=> c.style.opacity = (i%3===idx%3) ? '1' : '0.8');
      idx++;
    };
    step(); setInterval(step, 3500);
  }

  function populateResearchLinks(){
    if (!Array.isArray(window.blogPosts)) return;
    document.querySelectorAll('.program-card').forEach(card=>{
      const tags = (card.getAttribute('data-tags')||'').split(',').map(s=> s.trim().toLowerCase()).filter(Boolean);
      const box = card.querySelector('.research-links'); if (!box) return;
      const matches = window.blogPosts.filter(p=> (p.category==='research'||p.category==='papers'||p.category==='community') && intersects(tags, (p.tags||[]).map(t=> t.toLowerCase())));
      box.innerHTML = '';
      pick(matches, 3).forEach(p=>{
        const a = document.createElement('a');
        a.href = 'work.html#'+encodeURIComponent(p.id);
        a.textContent = p.title;
        a.addEventListener('click', (e)=>{ /* future: deep‑link behavior */ });
        box.appendChild(a);
      });
      if (!box.children.length){
        const a = document.createElement('a'); a.href='work.html'; a.textContent='Browse related work →'; box.appendChild(a);
      }
    });
  }

  function buildSessions(){
    const grid = document.getElementById('sessions-grid'); if (!grid) return;
    const sessions = [
      { date:'2025-03-15', title:'Intro to PyTorch', seats:12 },
      { date:'2025-04-02', title:'ML Fundamentals – Week 1', seats:20 },
      { date:'2025-04-10', title:'Career Clinic: CV + Interviews', seats:8 }
    ];
    grid.innerHTML = '';
    sessions.forEach(s=>{
      const card = document.createElement('div'); card.className='session-card';
      const t = document.createElement('time'); t.textContent = formatDate(s.date);
      const h = document.createElement('h4'); h.textContent = s.title;
      const seats = document.createElement('span'); seats.className='seats'; seats.textContent = `${s.seats} seats left`;
      const a = document.createElement('a'); a.textContent='Join Waitlist'; a.href='contact.html#waitlist'; a.className='details-btn'; a.setAttribute('aria-label', `Join waitlist for ${s.title}`);
      card.append(t,h,seats,a); grid.appendChild(card);
    });
  }

  function buildImpactOverview(){
    // Populate new asymmetric bento tiles instead of nested cards
    const posts = Array.isArray(window.blogPosts) ? window.blogPosts.slice().sort((a,b)=> new Date(b.date)-new Date(a.date)) : [];

    // Research: show one featured item prominently (title + summary)
    const researchTile = document.getElementById('tile-research');
    if (researchTile) {
      const featured = posts.find(p=> p.category==='research');
      const body = researchTile.querySelector('.tile-body');
      body.innerHTML = '';
      if (featured) {
        const wrap = document.createElement('div');
        wrap.innerHTML = `
          <div class="featured">
            <div class="featured-title">${escapeHTML(featured.title)}</div>
            <div class="featured-summary">${escapeHTML(trimSummary(featured.summary||'', 160))}</div>
            <div class="featured-actions" style="margin-top:.75rem;display:flex;gap:.5rem;">
              <a class="tile-action" href="work.html#${encodeURIComponent(featured.id)}">Read</a>
              <a class="tile-action" href="work.html#research">More</a>
            </div>
          </div>`;
        body.appendChild(wrap);
      } else {
        body.innerHTML = '<div style="opacity:.8">No research items yet.</div>';
      }
    }

    // Community: compact live feed
    const communityTile = document.getElementById('tile-community');
    if (communityTile) {
      initLiveFeed();
    }

    // Papers: citation-style list (title — date)
    const papersList = document.getElementById('papers-list');
    if (papersList) {
      papersList.innerHTML='';
      const papers = posts.filter(p=> p.category==='papers').slice(0,5);
      if (!papers.length) {
        const li = document.createElement('li');
        li.innerHTML = '<span class="papers-meta">No papers yet.</span>';
        papersList.appendChild(li);
      } else {
        papers.forEach(p=>{
          const li = document.createElement('li');
          const cite = document.createElement('span'); cite.className='papers-cite'; cite.textContent = p.title;
          const meta = document.createElement('span'); meta.className='papers-meta'; meta.textContent = formatDate(p.date);
          const link = document.createElement('a'); link.href = `work.html#${encodeURIComponent(p.id)}`; link.textContent = 'View'; link.className='tile-action'; link.style.marginTop = '.4rem';
          li.append(cite, meta, link);
          papersList.appendChild(li);
        });
      }
    }

    // Metrics: live stats + sparklines
    const metricsTile = document.getElementById('tile-metrics');
    if (metricsTile) {
      initLiveStats();
    }

    function trimSummary(s, n){ s = (s||'').replace(/\s+/g,' ').trim(); return s.length>n ? s.slice(0,n-1)+'…' : s; }
  }

  function buildLearningPath(){
    const lp = document.getElementById('learning-path'); if (!lp) return;
    lp.innerHTML = '';
    const row = document.createElement('div'); row.style.display='flex'; row.style.gap='1rem'; row.style.alignItems='center';
    const node = (label)=>{ const n=document.createElement('div'); n.className='learning-node'; n.textContent=label; return n; };
    const connector = ()=>{ const c=document.createElement('div'); c.className='learning-connector'; return c; };
    row.append(node('Basics'), connector(), node('Intermediate'), connector(), node('Advanced'));
    lp.appendChild(row);

    // Clickable nodes show a lightweight modal with details
    const entries = {
      'Basics': { title:'Basics', body:'Python fundamentals, math refreshers, and version control (Git).' },
      'Intermediate': { title:'Intermediate', body:'Supervised learning, model evaluation, and ML tooling.' },
      'Advanced': { title:'Advanced', body:'Deep learning, deployment, and responsible AI practices.' }
    };
    lp.querySelectorAll('.learning-node').forEach(n=>{
      n.tabIndex = 0;
      n.addEventListener('click',()=> openModal(entries[n.textContent]||{title:n.textContent, body:'Details coming soon.'}));
      n.addEventListener('keydown',(e)=>{ if (e.key==='Enter' || e.key===' ') { e.preventDefault(); openModal(entries[n.textContent]||{title:n.textContent, body:'Details coming soon.'}); } });
    });
  }

  // -----------------------
  // Bento grid initializers
  // -----------------------
  function initBento(){
    initHeroShowcase();
    initLiveStats();
    initLiveFeed();
    initTestimonialsMini();
    initLearningTicker();
    // Stagger-in animation
    const tiles = document.querySelectorAll('.bento-tile');
    const io = new IntersectionObserver((es)=>{
      es.forEach((e)=>{ if(e.isIntersecting){ e.target.style.transition='transform .4s ease, opacity .4s ease'; e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; io.unobserve(e.target);} });
    },{ rootMargin: '0px 0px -10% 0px', threshold: .1 });
    tiles.forEach((t,i)=>{ t.style.opacity='0'; t.style.transform='translateY(12px)'; t.style.transitionDelay = `${i*100}ms`; io.observe(t); });
  }

  function initHeroShowcase(){
    const preview = document.getElementById('hero-preview'); if (!preview) return;
    const projects = deriveProjects(); if (!projects.length) return;
    const idx = dayIndex() % projects.length;
    const p = projects[idx];
    preview.innerHTML = `<pre class="code-sample">${escapeHTML(p.snippet)}</pre>`;
    // Mouse reactive background
    preview.addEventListener('mousemove', (e)=>{
      const r = preview.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
      preview.style.background = `radial-gradient(600px at ${x*100}% ${y*100}%, rgba(0,217,255,0.15), transparent 60%), rgba(0,0,0,0.2)`;
    });
    // Progress + spots
    const progress = document.getElementById('hero-progress'); if (progress) progress.style.width = `${Math.min(100, Math.max(0, p.progress))}%`;
    const spots = document.getElementById('hero-spots'); if (spots) spots.textContent = `${p.spots} spots left`;
    document.getElementById('hero-join')?.addEventListener('click', ()=>{ window.location.href = 'contact.html#waitlist'; });
  }

  function deriveProjects(){
    const posts = Array.isArray(window.blogPosts) ? window.blogPosts : [];
    const picked = posts.filter(p=> p.category==='community' || p.category==='research').slice(0,5).map(p=>({
      title:p.title,
      snippet:`// ${p.title}\n// ${trimSummary(p.summary||'', 64)}\nfunction start(){ console.log('Hello, cohort!'); }`,
      progress: 62, spots: 7
    }));
    return picked.length ? picked : [
      { title:'ML Fundamentals', snippet: 'def train():\n    pass\n# sample project', progress: 40, spots: 10 },
      { title:'Career Clinic', snippet: 'const steps = ["CV", "Portfolio", "Interviews"];', progress: 70, spots: 4 }
    ];
  }

  function dayIndex(){ const d=new Date(); const start=new Date(d.getFullYear(),0,0); const diff=d-start; return Math.floor(diff/86400000); }
  function escapeHTML(s){ return (s||'').replace(/[&<>]/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  function initLiveStats(){
    const cards = document.querySelectorAll('.stat-card'); if (!cards.length) return;
    const source = new StatsSource();
    const animateTo = (el, target, fmt)=>{
      const start = parseFloat((el.textContent||'').replace(/[^0-9.]/g,''))||0; const t0 = performance.now(); const dur=800;
      const step=(t)=>{ const p=Math.min(1,(t-t0)/dur); const val=start+(target-start)*(1-Math.pow(1-p,3)); el.textContent = fmt(val); if(p<1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const fmt = {
      activeStudents: v=> Math.round(v).toString(),
      completionRate: v=> `${Math.round(v)}%`,
      hoursWatched: v=> Math.round(v).toString(),
      communityPosts: v=> Math.round(v).toString()
    };
    source.fetch().then(data=>{
      cards.forEach(c=>{
        const key=c.dataset.key; const val=(data[key]?.value)||0; const trend=(data[key]?.trend)||[];
        const valueEl=c.querySelector('.value'); animateTo(valueEl, val, fmt[key]||((x)=>String(Math.round(x))));
        renderSparkline(c.querySelector('.sparkline'), trend, data[key]?.delta || 0);
        c.classList.remove('skeleton');
      });
    }).catch(()=>{ /* keep skeletons */ });
  }

  class StatsSource {
    async fetch(){
      // Try external JSON; fallback to derived numbers
      if (window.PROGRAMS_STATS_URL) {
        try { const r=await fetch(window.PROGRAMS_STATS_URL, { cache:'no-store' }); if (r.ok) return await r.json(); } catch {}
      }
      const posts = Array.isArray(window.blogPosts) ? window.blogPosts : [];
      const nStudents = posts.filter(p=> p.metrics?.participants).reduce((a,p)=> a + parseInt(String(p.metrics.participants).replace(/\D/g,'')||'0',10), 0) || 60;
      const calls = posts.filter(p=> p.metrics?.calls).reduce((a,p)=> a + parseInt(String(p.metrics.calls).replace(/\D/g,'')||'0',10), 0) || 30;
      return {
        activeStudents: { value: nStudents, delta: +5, trend: trendArray(7, nStudents) },
        completionRate: { value: 62, delta: +2, trend: trendArray(7, 62) },
        hoursWatched: { value: nStudents*5, delta: +12, trend: trendArray(7, nStudents*5) },
        communityPosts: { value: calls, delta: +3, trend: trendArray(7, calls) },
      };
    }
  }

  function trendArray(n, base){ const arr=Array.from({length:n}, (_,i)=> Math.max(0, Math.round(base*(0.6 + 0.1*i + Math.random()*0.05)/n))); return arr; }
  function renderSparkline(svg, arr, delta){
    if (!svg) return;
    const w=svg.clientWidth||240, h=svg.clientHeight||40;
    const max=Math.max(...arr,1); const step=w/Math.max(1,arr.length-1);
    const pts=arr.map((v,i)=> `${i*step},${h - (v/max)*h}`).join(' ');
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.innerHTML = `<polyline points='${pts}' fill='none' stroke='${delta>=0?'#00D9FF':'#999'}' stroke-width='2' />`;
  }

  function updateAchievementsFromStats(stats){
    if (!stats) return;
    const setTarget=(idx, val)=>{ const el=document.querySelector(`.achievements .achievement-card:nth-child(${idx}) .stat-number`); if(el&&isFinite(+val)) el.dataset.target = String(Math.round(+val)); };
    if (stats.activeStudents?.value) setTarget(1, stats.activeStudents.value);
    if (stats.communityPosts?.value) setTarget(3, stats.communityPosts.value);
  }

  function initLiveFeed(){
    const el = document.getElementById('live-feed'); if (!el) return;
    const buffer = [];
    const maxVisible = 5;
    let paused = false;
    const addItem=(item)=>{ buffer.unshift(item); while(buffer.length>50) buffer.pop(); render(); };
    const render=()=>{
      el.innerHTML=''; const visible = buffer.slice(0,maxVisible);
      visible.forEach(it=> el.appendChild(feedItem(it)));
      el.setAttribute('aria-busy','false');
    };
    el.addEventListener('mouseenter', ()=> paused=true);
    el.addEventListener('mouseleave', ()=> paused=false);
    document.querySelector('[data-action="pause"]')?.addEventListener('click', ()=> paused=!paused);
    // Seed with community talks + coaching calls only
    const posts = Array.isArray(window.blogPosts) ? window.blogPosts : [];
    const isTalkOrCoaching = (p)=>{
      const t = (p.title||'').toLowerCase();
      const hasKw = t.includes('coaching') || t.includes('seminar') || t.includes('talk');
      const tags = (p.tags||[]).map(x=> String(x).toLowerCase());
      const hasTag = tags.includes('workshops') || tags.includes('mentorship') || tags.includes('career');
      return hasKw || hasTag;
    };
    posts.filter(p=> p.category==='community').filter(isTalkOrCoaching).slice(0,8).forEach(p=>{
      addItem({ initial: (p.emoji||'📣'), text: `${normalizeText(p.title)}`, time: formatDate(p.date) });
    });
    // WS or fallback
    if (window.PROGRAMS_WS_URL) {
      try { const ws = new WebSocket(window.PROGRAMS_WS_URL); ws.onmessage=(e)=> addItem(JSON.parse(e.data)); } catch {}
    } else {
      // No websocket configured; keep seeded items only (no fake feed)
    }
    // Auto-scroll simulation
    setInterval(()=>{ if(!paused && buffer.length>maxVisible){ buffer.push(buffer.shift()); render(); } }, 3000);
  }

  function feedItem(it){
    const row = document.createElement('div'); row.className='feed-item';
    const av = document.createElement('div'); av.className='feed-avatar'; av.textContent = (it.initial||'?');
    const desc = document.createElement('div'); desc.className='feed-desc'; desc.textContent = it.text;
    const time = document.createElement('time'); time.className='feed-time'; time.textContent = it.time || new Date().toLocaleTimeString();
    row.append(av, desc, time);
    row.addEventListener('click', ()=> openModal({ title:'Activity', body: it.text }));
    return row;
  }

  function fallbackGenerator(push){
    const actions = ['pushed code', 'posted in forum', 'completed project', 'unlocked milestone'];
    const initials = ['AZ','SR','MK','LM','JO','HA'];
    setInterval(()=>{
      const it = { initial: initials[Math.floor(Math.random()*initials.length)], text: `${randomName()} ${actions[Math.floor(Math.random()*actions.length)]}`, time: new Date().toLocaleTimeString() };
      push(it);
    }, 2200);
  }
  function randomName(){ const names=['Ava','Sam','Lee','Noor','Omar','Maya','Jin']; return names[Math.floor(Math.random()*names.length)]; }

  function initTestimonialsMini(){
    const el = document.getElementById('testimonials-mini'); if (!el) return;
    const t = (Array.isArray(window.blogPosts)?window.blogPosts:[]).filter(p=> p.category==='testimonial');
    if (!t.length) { el.innerHTML = '<div class="quote-mini">Share your story</div><div class="quote-meta">We\'d love to feature it.</div>'; document.querySelector('[data-action="share"]').addEventListener('click', ()=> window.location.href='contact.html'); return; }
    el.innerHTML = '';
    t.slice(0,3).forEach(p=>{ const q=document.createElement('div'); q.className='quote-mini'; q.textContent = p.summary || p.title; const m=document.createElement('div'); m.className='quote-meta'; m.textContent = new Date(p.date).toLocaleDateString(); const wrap=document.createElement('div'); wrap.append(q,m); el.appendChild(wrap); });
  }

  function initLearningTicker(){
    const el = document.getElementById('learning-ticker'); if (!el) return;
    const nodes = [ 'Basics', 'ML Fundamentals', 'Career Advice', 'Research Literacy', 'Advanced' ];
    el.innerHTML = '';
    nodes.forEach((n,i)=>{ const b=document.createElement('button'); b.className='ticker-node'+(i? '':' active'); b.textContent=n; b.addEventListener('click',()=>{ el.querySelectorAll('.ticker-node').forEach(x=>x.classList.remove('active')); b.classList.add('active'); filterImpactBy(n); }); el.appendChild(b); });
  }
  function filterImpactBy(n){ document.querySelector('.impact-overview')?.scrollIntoView({behavior:'smooth'}); }

  function intersects(a,b){ return a.some(v=> b.includes(v)); }
  function formatDate(d){ try { const dt=new Date(d); return dt.toLocaleDateString(undefined,{year:'numeric', month:'short', day:'numeric'});} catch { return d; } }
  function cleanQuote(t){ return (t||'').replace(/\s+/g,' ').trim(); }

  // Minimal modal for learning path details
  function openModal(data){
    const overlay = document.createElement('div'); overlay.className='lp-modal-overlay';
    const modal = document.createElement('div'); modal.className='lp-modal';
    modal.innerHTML = `<h3>${data.title}</h3><p>${data.body}</p><div class="lp-modal-actions"><button type="button" class="close-btn">Close</button></div>`;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    const close = ()=> overlay.remove();
    overlay.addEventListener('click',(e)=>{ if (e.target===overlay) close(); });
    modal.querySelector('.close-btn').addEventListener('click', close);
  }

  function applyStagger(){
    const tiles = document.querySelectorAll('.bento-tile');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach((e)=>{
        if(e.isIntersecting){
          e.target.style.transition='opacity .4s ease, transform .4s ease';
          e.target.style.opacity='1';
          e.target.style.transform='translateY(0)';
          io.unobserve(e.target);
        }
      });
    },{ threshold: .1 });
    tiles.forEach((t,i)=>{ t.style.opacity='0'; t.style.transform='translateY(10px)'; t.style.transitionDelay = `${i*80}ms`; io.observe(t); });
  }

  ready(()=>{
    // Temporarily show only Impact Overview and achievements
    buildImpactOverview();
    applyStagger();

    if (typeof AnimatedCounter === 'function') {
      hydrateAchievementStats();
    }
  });
})();
  // Compute achievements from blog posts where possible
  function hydrateAchievementStats(){
    const posts = Array.isArray(window.blogPosts) ? window.blogPosts : [];
    const sumNumeric = (vals)=> vals.reduce((a,b)=> a + (isFinite(+b) ? +b : 0), 0);
    const numFrom = (v)=>{ const m = String(v||'').match(/\d+/); return m ? parseInt(m[0],10) : 0; };

    // Students trained: sum 'participants' across community posts
    const trained = sumNumeric(posts.filter(p=> p.category==='community' && p.metrics && p.metrics.participants)
      .map(p=> numFrom(p.metrics.participants)));
    const trainedEl = document.querySelector('.achievement-card .ach-label:nth-of-type(1)')?.closest('.achievement-card')?.querySelector('.stat-number');
    const trainedElDirect = document.querySelector('.achievements .achievement-card:nth-child(1) .stat-number');
    if (trainedElDirect && trained>0) trainedElDirect.dataset.target = String(trained);

    // Active programs: count non-empty categories among research/community/papers
    const activeEl = document.querySelector('.achievements .achievement-card:nth-child(2) .stat-number');
    const categories = ['research','community','papers'];
    const active = categories.reduce((acc, k)=> acc + (posts.some(p=> p.category===k) ? 1 : 0), 0) || 3;
    if (activeEl) activeEl.dataset.target = String(active);

    // Free coaching calls: sum 'calls' across community posts
    const calls = sumNumeric(posts.filter(p=> p.metrics && p.metrics.calls).map(p=> numFrom(p.metrics.calls)));
    const callsEl = document.querySelector('.achievements .achievement-card:nth-child(3) .stat-number');
    if (callsEl && calls>0) callsEl.dataset.target = String(calls);

    // University seminars: count posts tagged 'University'
    const seminars = posts.filter(p=> (p.tags||[]).includes('University')).length;
    const semEl = document.querySelector('.achievements .achievement-card:nth-child(4) .stat-number');
    if (semEl && seminars>0) semEl.dataset.target = String(seminars);

    // Animate
    const els = Array.from(document.querySelectorAll('.programs-intro .stat-number'));
    els.forEach((el,i)=> setTimeout(()=> new AnimatedCounter(el), i*150));
  }
