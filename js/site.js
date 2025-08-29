// Site-level utilities: mobile menu toggle + basic form validation
window.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }));
  }

  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const invalid = Array.from(form.querySelectorAll('[required]')).some(inp => !inp.value || (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)));
      if (invalid) {
        e.preventDefault();
        alert('Please complete the required fields correctly.');
      }
    });
  });

  // Theme toggle (switches brand palette to hero warm tones)
  const key = 'hl-color-theme';
  const applyTheme = (mode) => {
    document.documentElement.classList.toggle('theme-hero', mode === 'hero');
    localStorage.setItem(key, mode);
  };
  const current = localStorage.getItem(key) || 'default';
  applyTheme(current);

  const headerContainer = document.querySelector('header .container');
  if (headerContainer) {
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle color theme');
    btn.innerHTML = '<span class="dot" aria-hidden="true"></span><span>Theme</span>';
    headerContainer.appendChild(btn);
    btn.addEventListener('click', () => {
      const next = document.documentElement.classList.contains('theme-hero') ? 'default' : 'hero';
      applyTheme(next);
    });
  }

  // Scroll progress indicator (thin top bar)
  const progress = document.createElement('div');
  progress.id = 'scroll-progress';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
});
