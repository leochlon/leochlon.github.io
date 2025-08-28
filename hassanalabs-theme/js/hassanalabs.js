/* HassanaLabs UI script: motion, counters, helix, parallax, numerals, theme */
(function () {
  const HL = {
    init(options = {}) {
      this.opts = Object.assign({ autoProgressBar: true, autoHelix: true, helixSelector: '.hl-helix' }, options);
      document.documentElement.style.setProperty('--hl-init', 1);
      this.initThemeToggle();
      this.initShineObserver();
      this.initTilt();
      this.initCountUp();
      this.initScrollProgress();
      this.initArabicNumerals();
      this.initParallax();
      if (this.opts.autoHelix) this.initHelix();
    },
    initThemeToggle() {
      const storageKey = 'hl-theme';
      const root = document.documentElement;
      const setTheme = (mode) => { root.classList.toggle('theme-light', mode === 'light'); localStorage.setItem(storageKey, mode); };
      const current = localStorage.getItem(storageKey) || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      setTheme(current);
      document.querySelectorAll('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', () => setTheme(root.classList.contains('theme-light') ? 'dark' : 'light')));
    },
    initShineObserver() {
      const io = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.setAttribute('data-inview', 'true'); }); }, { threshold: 0.35 });
      document.querySelectorAll('.hl-shine').forEach(el => io.observe(el));
    },
    initTilt() {
      const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
      document.querySelectorAll('.hl-tilt').forEach(el => {
        const max = parseFloat(el.getAttribute('data-tilt-max')) || 10;
        const perspective = parseFloat(el.getAttribute('data-tilt-persp')) || 600;
        el.style.transformStyle = 'preserve-3d';
        el.style.transition = 'transform 200ms var(--hl-ease)';
        el.addEventListener('mousemove', (ev) => {
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2; const cy = r.top + r.height / 2;
          const dx = (ev.clientX - cx) / (r.width / 2); const dy = (ev.clientY - cy) / (r.height / 2);
          const rx = clamp(-dy * max, -max, max); const ry = clamp(dx * max, -max, max);
          el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0)`; });
      });
    },
    initCountUp() {
      const els = document.querySelectorAll('[data-count-up]'); if (!els.length) return;
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return; const el = e.target; obs.unobserve(el);
          const target = Number(el.getAttribute('data-target') || '0');
          const duration = Number(el.getAttribute('data-duration') || '1500');
          const suffix = el.getAttribute('data-suffix') || '';
          const start = performance.now(); const startVal = Number(el.textContent.replace(/[^0-9.]/g, '')) || 0;
          const fmt = (n) => n.toLocaleString(undefined);
          const tick = (t) => { const p = Math.min(1, (t - start) / duration); const ease = 1 - Math.pow(1 - p, 3); const val = Math.round(startVal + (target - startVal) * ease); el.textContent = fmt(val) + suffix; if (p < 1) requestAnimationFrame(tick); };
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.4 });
      els.forEach(el => io.observe(el));
    },
    initScrollProgress() {
      let bar = document.querySelector('#hl-progress'); if (!bar) { bar = document.createElement('div'); bar.id = 'hl-progress'; bar.className = 'hl-progress'; document.body.appendChild(bar); }
      const onScroll = () => { const scrollTop = window.scrollY; const docH = document.documentElement.scrollHeight - window.innerHeight; const p = docH > 0 ? (scrollTop / docH) : 0; bar.style.width = (p * 100).toFixed(2) + '%'; };
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    },
    initParallax() {
      const els = Array.from(document.querySelectorAll('[data-parallax-depth]')); if (!els.length) return;
      const apply = () => { const y = window.scrollY; els.forEach(el => { const depth = parseFloat(el.getAttribute('data-parallax-depth')) || 0.2; el.style.transform = `translate3d(0, ${Math.round(y * depth)}px, 0)`; }); };
      window.addEventListener('scroll', apply, { passive: true }); apply();
    },
    initArabicNumerals() {
      const map = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
      const toArabic = (s) => s.replace(/[0-9]/g, d => map[Number(d)]);
      document.querySelectorAll('.hl-arabic-hover').forEach(el => {
        el.addEventListener('mouseenter', () => {
          const current = el.textContent.trim();
          el.dataset.latin = current;
          el.dataset.arabic = 'true';
          el.textContent = toArabic(current);
        });
        el.addEventListener('mouseleave', () => {
          el.dataset.arabic = 'false';
          if (el.dataset.latin) el.textContent = el.dataset.latin;
        });
      });
    },
    initHelix() {
      const container = document.querySelector(this.opts.helixSelector); if (!container) return;
      const canvas = document.createElement('canvas'); canvas.width = container.clientWidth; canvas.height = container.clientHeight; container.appendChild(canvas);
      const ctx = canvas.getContext('2d'); let t = 0; const dots = 100;
      const draw = () => {
        const w = canvas.width = container.clientWidth; const h = canvas.height = container.clientHeight; ctx.clearRect(0,0,w,h);
        const cx = w/2; const amp = Math.min(w, h) * 0.18;
        for (let i=0;i<dots;i++) { const p = i / dots; const y = p * h; const phase = t + p * Math.PI * 2; const x1 = cx + Math.sin(phase) * amp; const x2 = cx - Math.sin(phase) * amp; const r = 2 + 2 * (0.5 + 0.5 * Math.cos(phase)); ctx.fillStyle = 'rgba(212,165,116,0.75)'; this.drawKhatamDot(ctx, x1, y, r); ctx.fillStyle = 'rgba(0,105,92,0.85)'; this.drawKhatamDot(ctx, x2, y, r); ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke(); }
        t += 0.02; requestAnimationFrame(draw);
      };
      const ro = new ResizeObserver(() => { canvas.width = container.clientWidth; canvas.height = container.clientHeight; }); ro.observe(container); draw();
    },
    drawKhatamDot(ctx, x, y, r) {
      ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let i=0;i<8;i++) { const a = (i * Math.PI) / 4; const rx = Math.cos(a) * r; const ry = Math.sin(a) * r; ctx.lineTo(rx, ry); } ctx.closePath(); ctx.fill(); ctx.restore();
    },
    showLoader() {
      if (document.getElementById('hl-loader-overlay')) return; const overlay = document.createElement('div'); overlay.id = 'hl-loader-overlay'; Object.assign(overlay.style, { position: 'fixed', inset: '0', display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 10000 }); const img = document.createElement('img'); img.src = (window.HL_LOADER_SRC || '/hassanalabs-theme/svg/loader-calligraphy.svg'); img.alt = 'Loading'; img.className = 'hl-loader'; overlay.appendChild(img); document.body.appendChild(overlay);
    },
    hideLoader() { const overlay = document.getElementById('hl-loader-overlay'); if (overlay) overlay.remove(); }
  };
  window.HLTheme = HL; if (document.readyState !== 'loading') HL.init(); else document.addEventListener('DOMContentLoaded', () => HL.init());
})();
