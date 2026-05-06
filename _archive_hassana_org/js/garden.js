// Living Garden (abstract nodes, clusters, Poisson sampling, noise-driven motion)
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const byId = (id) => document.getElementById(id);

  // No runtime normalization; source files are UTF‑8.

  // Lightweight Perlin noise (2D)
  const Perlin = (()=>{
    const p = new Uint8Array(512);
    const perm = new Uint8Array(256);
    for (let i=0;i<256;i++) perm[i]=i;
    for (let i=255;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [perm[i],perm[j]]=[perm[j],perm[i]]; }
    for (let i=0;i<512;i++) p[i]=perm[i&255];
    const grad = (h, x, y)=>{ const u = (h&1)?-x:x; const v=(h&2)?-y:y; return u+v; };
    const fade = t=> t*t*t*(t*(t*6-15)+10);
    const lerp = (a,b,t)=> a + t*(b-a);
    function noise(x,y){
      const X = Math.floor(x)&255, Y=Math.floor(y)&255;
      x -= Math.floor(x); y -= Math.floor(y);
      const u = fade(x), v = fade(y);
      const aa = p[p[X]+Y], ab=p[p[X]+Y+1], ba=p[p[X+1]+Y], bb=p[p[X+1]+Y+1];
      return lerp(
        lerp(grad(aa,x,y), grad(ba,x-1,y), u),
        lerp(grad(ab,x,y-1), grad(bb,x-1,y-1), u), v
      )*0.5+0.5;
    }
    return { noise };
  })();

  // Poisson-disc sampling (Bridson) within [0,1]x[0,1]
  function poissonDisc(radius, k=20, max=200){
    const cell = radius/Math.SQRT2; const gridSize = Math.ceil(1/cell);
    const grid = new Array(gridSize*gridSize).fill(null);
    const active = []; const samples = [];
    function idx(x,y){ return y*gridSize+x; }
    function insert(pt){ const gx = Math.floor(pt.x/cell); const gy = Math.floor(pt.y/cell); grid[idx(gx,gy)] = pt; active.push(pt); samples.push(pt); }
    function inBounds(x,y){ return x>=0&&x<=1&&y>=0&&y<=1; }
    function far(pt){ const gx=Math.floor(pt.x/cell), gy=Math.floor(pt.y/cell); for(let y=-2;y<=2;y++){ for(let x=-2;x<=2;x++){ const g = grid[idx(gx+x, gy+y)]; if(!g) continue; const dx=g.x-pt.x, dy=g.y-pt.y; if(dx*dx+dy*dy < radius*radius) return false; } } return true; }
    insert({x:Math.random(), y:Math.random()});
    while(active.length && samples.length<max){
      const i = Math.floor(Math.random()*active.length);
      const s = active[i]; let placed=false;
      for(let n=0;n<k;n++){
        const a = Math.random()*Math.PI*2; const r = radius*(1+Math.random());
        const x = s.x + Math.cos(a)*r; const y = s.y + Math.sin(a)*r;
        const pt = {x,y};
        if(inBounds(x,y) && far(pt)){ insert(pt); placed=true; break; }
      }
      if(!placed) active.splice(i,1);
    }
    return samples;
  }

  function lerp(a,b,t){ return a + (b-a)*t; }
  function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

  function buildNodes(){
    // Define 3 cluster centers (research, community, papers)
    const centers = [ {x:.7,y:.35, type:'research'}, {x:.3,y:.55, type:'community'}, {x:.45,y:.25, type:'papers'} ];
    const nodes = [];
    // Base counts
    const counts = { community: 60+30, research: 2, papers: 4 };
    // Generate Poisson seeds, then map nearest to cluster
    const pts = poissonDisc(0.035, 25, counts.community + counts.research + counts.papers + 12);
    pts.forEach((pt, i)=>{
      // assign to nearest center
      let best=0, bestD=1e9; centers.forEach((c,ci)=>{ const dx=pt.x-c.x, dy=pt.y-c.y; const d=dx*dx+dy*dy; if(d<bestD){bestD=d; best=ci;} });
      const c = centers[best];
      const idx = nodes.length;
      const impact = (c.type==='community') ? (idx < 60 ? 0.9 : 0.6) : (c.type==='papers' ? 1.3 : 1.6);
      const size = clamp(impact * lerp(0.5, 2.0, Math.random()), 0.4, 2.0);
      const z = lerp(-1, 1, Math.random());
      const rot = lerp(-Math.PI/4, Math.PI/4, Math.random());
      const rotSpeed = lerp(-0.001, 0.001, Math.random());
      nodes.push({ x:pt.x, y:pt.y, z, size, rot, rotSpeed, type:c.type, pulse:0, hover:false,
        data: metaForNode(c.type, idx) });
    });
    // Light relaxation to cluster and separate (force-like init)
    for (let iter=0; iter<20; iter++){
      nodes.forEach(n=>{
        const c = centers.find(k=>k.type===n.type) || centers[0];
        n.x = clamp(lerp(n.x, c.x, 0.02), 0.02, 0.98);
        n.y = clamp(lerp(n.y, c.y, 0.02), 0.02, 0.98);
      });
      for (let i=0;i<nodes.length;i++){
        for (let j=i+1;j<nodes.length;j++){
          const a = nodes[i], b=nodes[j];
          const dx = a.x-b.x, dy=a.y-b.y; const d2 = dx*dx+dy*dy; const min = 0.0015;
          if (d2 < min){ const d = Math.sqrt(d2)+1e-6; const push=(min-d2)*0.0008; const ux=dx/d, uy=dy/d; a.x+=ux*push; a.y+=uy*push; b.x-=ux*push; b.y-=uy*push; }
        }
      }
    }
    // Ensure minimum highlighted nodes
    function pushNear(centerType, count){
      const c = centers.find(k=>k.type===centerType);
      for (let k=0;k<count;k++){
        const angle = Math.random()*Math.PI*2; const rad = lerp(0.02, 0.06, Math.random());
        const x = clamp(c.x + Math.cos(angle)*rad, 0.02, 0.98);
        const y = clamp(c.y + Math.sin(angle)*rad, 0.02, 0.98);
        const i = nodes.length;
        nodes.push({ x, y, z: lerp(-1,1,Math.random()), size: lerp(1.2,1.7,Math.random()), rot: lerp(-.2,.2,Math.random()), rotSpeed: lerp(-.001,.001,Math.random()), type: centerType, pulse:1, hover:false, data: metaForNode(centerType, i) });
      }
    }
    pushNear('research', 2);
    pushNear('papers', 4);
    return { nodes, centers };
  }

  function metaForNode(type, i){
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const initials = letters[i%26] + '.' + letters[(i*7)%26] + '.';
    const outcomes = {
      community: ['Secured internship at startup','Built first ML project','Presented at seminar','Launched study group','Won scholarship'],
      research: ['Open-sourced benchmark','Pipeline adopted','Found bug fixed','Published evaluation'],
      papers: ['AECF fusion result','Bayesian LLMs preprint','Co-author publication','Citations accrued']
    };
    const programs = { community: i<60 ? 'Workshop' : 'Coaching', research: i%2? 'Super-enhancer' : 'Near-zero hallucination', papers: i%2? 'Bayesian LLMs' : 'AECF fusion' };
    return { initials, program: programs[type], date: '2024–2025', outcome: outcomes[type][i % outcomes[type].length] };
  }

  function colorFor(node, t){
    // Warm at center, cooler outward; subtle seasonal/time hue shift
    const dx = node.x-0.5, dy=node.y-0.5; const r = Math.hypot(dx,dy);
    const warm = [255,215,0]; // gold
    const cool = [0,217,255]; // cyan
    const mix = clamp(1 - r*1.3, 0, 1); // center warmer, edges cooler
    const base = [
      Math.round(lerp(cool[0], warm[0], mix)),
      Math.round(lerp(cool[1], warm[1], mix)),
      Math.round(lerp(cool[2], warm[2], mix))
    ];
    const seasonHue = (new Date().getMonth()/12) * 30; // up to ~30deg shift
    const timeHue = (t % 10000)/10000 * 15; // slow drift
    return hueShift(base, seasonHue + timeHue);
  }

  function hueShift(rgb, deg){
    const [r,g,b]=rgb.map(v=>v/255);
    const cmax=Math.max(r,g,b), cmin=Math.min(r,g,b), d=cmax-cmin;
    let h=0,s= cmax? d/cmax:0, v=cmax;
    if (d!==0){ if(cmax===r) h=((g-b)/d)%6; else if(cmax===g) h=(b-r)/d+2; else h=(r-g)/d+4; h*=60; if(h<0) h+=360; }
    h=(h+deg)%360; // shift
    const c=v*s, x=c*(1-Math.abs((h/60)%2-1)), m=v-c; let rp=0,gp=0,bp=0;
    if (h<60){rp=c;gp=x;bp=0;} else if(h<120){rp=x;gp=c;bp=0;} else if(h<180){rp=0;gp=c;bp=x;} else if(h<240){rp=0;gp=x;bp=c;} else if(h<300){rp=x;gp=0;bp=c;} else {rp=c;gp=0;bp=x;}
    return [Math.round((rp+m)*255), Math.round((gp+m)*255), Math.round((bp+m)*255)];
  }

  function run(){
    const root = $('.living-garden');
    if (!root) return;

    const canvas = byId('garden-canvas');
    const tip = byId('leaf-tooltip');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    function resize(){
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.floor(r.width * DPR);
      canvas.height = Math.floor(r.height * DPR);
    }
    resize();
    window.addEventListener('resize', resize);

    const { nodes, centers } = buildNodes();
    let mouse = {x:-1,y:-1}; let hoverIdx = -1; let lastPointer={x:0,y:0};

    canvas.addEventListener('mousemove', (e)=>{
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left)/rect.width;
      mouse.y = (e.clientY - rect.top)/rect.height;
      lastPointer.x = e.clientX; lastPointer.y = e.clientY;
    });
    canvas.addEventListener('mouseleave', ()=>{ mouse.x = mouse.y = -1; hoverIdx = -1; tip.hidden = true; });
    canvas.addEventListener('click', ()=>{ if (hoverIdx>=0) openNodeModal(nodes[hoverIdx]); });

    // No CTA button

    // No live seed metrics (simplified)

    // Reduced motion support
    const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Spatial hash for edges
    const CONN_RADIUS = 90; // CSS px
    function buildGrid(W,H){
      const cell = CONN_RADIUS;
      const cols = Math.ceil(W/cell), rows = Math.ceil(H/cell);
      const grid = Array.from({length: cols*rows}, ()=> []);
      const key=(cx,cy)=> cy*cols+cx;
      nodes.forEach((n,i)=>{
        const cx = Math.min(cols-1, Math.max(0, Math.floor(n.x*W / cell)));
        const cy = Math.min(rows-1, Math.max(0, Math.floor(n.y*H / cell)));
        grid[key(cx,cy)].push(i);
      });
      return {grid, cols, rows, cell};
    }

    let rafId;
    function draw(tms){
      const t = tms || performance.now();
      ctx.clearRect(0,0,canvas.width, canvas.height);
      ctx.save(); ctx.scale(DPR, DPR);

      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;

      // Slow field rotation simulated by noise flow and z parallax
      nodes.forEach((n, i)=>{
        const nx = n.x * 2, ny = n.y * 2; // scale noise domain
        const wind = (Perlin.noise(nx + t*0.0001, ny) - 0.5) * 0.0025;
        const lift = (Perlin.noise(nx, ny + t*0.0001) - 0.5) * 0.0025;
        n.x = clamp(n.x + wind + (n.z*0.0003), 0, 1);
        n.y = clamp(n.y + lift - (n.z*0.0002), 0, 1);
        n.rot += n.rotSpeed;
        n.pulse = Math.max(0, n.pulse - 0.02);
      });

      // Hover detection
      hoverIdx = -1; let hoverDist = 1e9;
      if (mouse.x>=0){
        nodes.forEach((n, i)=>{
          const dx = (mouse.x - n.x) * W; const dy = (mouse.y - n.y) * H; const d = Math.hypot(dx, dy);
          const rpx = sizePx(n); if (d < rpx*1.6 && d < hoverDist){ hoverIdx = i; hoverDist = d; }
        });
      }

      // Draw connections via spatial hash
      ctx.lineWidth = 0.6; ctx.globalAlpha = 1;
      const {grid, cols, rows, cell} = buildGrid(W,H);
      const forNeighbors=(ix,iy,cb)=>{ for(let y=Math.max(0,iy-1); y<=Math.min(rows-1,iy+1); y++){ for(let x=Math.max(0,ix-1); x<=Math.min(cols-1,ix+1); x++){ cb(grid[y*cols+x]); } } };
      nodes.forEach((a,i)=>{
        const ix = Math.min(cols-1, Math.max(0, Math.floor(a.x*W / cell)));
        const iy = Math.min(rows-1, Math.max(0, Math.floor(a.y*H / cell)));
        forNeighbors(ix,iy,(bucket)=>{
          bucket.forEach(j=>{
            if (j<=i) return; const b = nodes[j];
            const dx=(a.x-b.x)*W, dy=(a.y-b.y)*H; const d=Math.hypot(dx,dy);
            if (d < CONN_RADIUS){
              const c = colorFor(a, t);
              ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]}, ${0.12 * (1 - d/CONN_RADIUS)})`;
              ctx.beginPath(); ctx.moveTo(a.x*W, a.y*H); ctx.lineTo(b.x*W, b.y*H); ctx.stroke();
            }
          });
        });
      });

      // Sort by depth (z) so far nodes first
      nodes.sort((a,b)=> a.z - b.z);

      // Draw nodes
      nodes.forEach((n,i)=>{
        const r = sizePx(n);
        const c = colorFor(n, t);
        ctx.save();
        ctx.translate(n.x*W, n.y*H);
        ctx.rotate(n.rot);
        // Depth of field via shadowBlur; farther = more blur, lower alpha
        const blur = 8 * (0.6 + (1 - (n.z+1)/2));
        ctx.shadowBlur = blur; ctx.shadowColor = `rgba(${c[0]},${c[1]},${c[2]},0.6)`;
        const alpha = 0.65 * (0.6 + (n.z+1)/2);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
        drawByType(ctx, n.type, r);
        // Pulse ring on hover
        if (i === hoverIdx){
          ctx.shadowBlur = 0; ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},0.8)`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0,0, r*1.8 + 3*Math.sin(t*0.01), 0, Math.PI*2); ctx.stroke();
        }
        ctx.restore();
      });

      // Tooltip
      if (hoverIdx >= 0 && tip){
        const n = nodes[hoverIdx];
        tip.innerHTML = `<strong>${n.data.initials}</strong> · ${n.data.program}<br><span class="minor">${n.data.date} — ${n.data.outcome}</span>`;
        tip.hidden = false; tip.style.left = lastPointer.x + 'px'; tip.style.top = lastPointer.y + 'px';
      } else if (tip) tip.hidden = true;

      // no seed particles (simplified, clearer visual language)

      ctx.restore();
      if (!prefersReduce) { rafId = requestAnimationFrame(draw); }
    }

    function sizePx(n){
      const rect = canvas.getBoundingClientRect();
      const base = 5 * n.size; // base radius
      const zScale = 0.7 + (n.z+1)/2; // 0.7..1.7
      return base * zScale;
    }

    function drawByType(ctx, type, r){
      if (type==='community'){
        ctx.beginPath(); ctx.arc(0,0, r*0.9, 0, Math.PI*2); ctx.fill();
      } else if (type==='papers'){
        const s = r*1.2; ctx.beginPath(); ctx.rect(-s/2, -s/2, s, s); ctx.fill();
      } else {
        const k=6, R=r*1.4; ctx.beginPath(); for (let i=0;i<k;i++){ const a=(Math.PI*2*i)/k; const x=Math.cos(a)*R, y=Math.sin(a)*R; i?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.closePath(); ctx.fill();
      }
    }

    // Modal for node details (accessible)
    function openNodeModal(node){
      const modal = byId('garden-modal'); const title = byId('garden-modal-title'); const body = byId('garden-modal-body'); const close = byId('garden-modal-close');
      if (!modal || !title || !body) return;
      title.textContent = `${node.data.program} — ${node.data.initials}`;
      body.innerHTML = `<p><strong>Type:</strong> ${node.type}</p><p><strong>Date:</strong> ${node.data.date}</p><p><strong>Outcome:</strong> ${node.data.outcome}</p>`;
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden','false');
      close?.focus();
    }
    function closeNodeModal(){ const modal = byId('garden-modal'); if (modal){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); } }
    byId('garden-modal-close')?.addEventListener('click', closeNodeModal);
    byId('garden-modal')?.addEventListener('click', (e)=>{ if (e.target.id==='garden-modal') closeNodeModal(); });
    document.addEventListener('keydown', (e)=>{ if (e.key==='Escape') closeNodeModal(); });

    // Start or render once
    if (prefersReduce) draw(); else rafId = requestAnimationFrame(draw);

    // Cleanup on page hide
    function cleanup(){ window.removeEventListener('resize', resize); canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave); canvas.removeEventListener('click', onClick); if (rafId) cancelAnimationFrame(rafId); }
    window.addEventListener('pagehide', cleanup);
  }

  document.addEventListener('DOMContentLoaded', run);
})();
