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
});

