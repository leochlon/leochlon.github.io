// Initialize interactive features once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  // Terminal-style typing effect for section titles
  document.querySelectorAll('.terminal-title').forEach(title => {
    const text = title.dataset.text || title.textContent;
    title.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    title.appendChild(cursor);
    let i = 0;
    const type = () => {
      if (i < text.length) {
        cursor.insertAdjacentText('beforebegin', text.charAt(i));
        i++;
        setTimeout(type, 80);
      } else {
        cursor.remove();
      }
    };
    type();
  });
});

// Initialize after DOM ready for other effects
window.addEventListener('DOMContentLoaded', () => {
  // Slight magnetic hover effect on buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  initCommandPalette();
  matrixRain();
});

// Command palette with Cmd+K / Ctrl+K shortcut
function initCommandPalette() {
  const palette = document.createElement('div');
  palette.className = 'command-palette';
  palette.innerHTML = `
    <div class="command-box">
      <input type="text" placeholder="Type a command..." aria-label="Command input">
      <ul class="command-list"></ul>
    </div>`;
  document.body.appendChild(palette);

  const input = palette.querySelector('input');
  const list = palette.querySelector('.command-list');
  const commands = [
    { label: 'Read Papers / \u0627\u0642\u0631\u0623 \u0627\u0644\u0623\u0648\u0631\u0627\u0642', url: 'resources.html' },
    { label: 'View Impact / \u0631\u0624\u064a\u0629 \u0627\u0644\u0623\u062b\u0631', url: 'about.html' },
    { label: 'Contact / \u062a\u0648\u0627\u0635\u0644', url: 'contact.html' }
  ];

  const render = (filter = '') => {
    list.innerHTML = '';
    commands
      .filter(c => c.label.toLowerCase().includes(filter.toLowerCase()))
      .forEach(c => {
        const li = document.createElement('li');
        li.textContent = c.label;
        li.addEventListener('click', () => {
          window.location.href = c.url;
          hide();
        });
        list.appendChild(li);
      });
  };

  const show = () => {
    palette.classList.add('active');
    render();
    input.focus();
  };
  const hide = () => {
    palette.classList.remove('active');
    input.value = '';
  };

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      show();
    } else if (e.key === 'Escape') {
      hide();
    }
  });

  input.addEventListener('input', e => render(e.target.value));
}

// Subtle Matrix rain effect with Arabic letters and formulas
function matrixRain() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const letters = 'شسلهمنتعغفقكلظطزخحجدثبآ٠١٢٣٤٥٦٧٨٩∑λπ';
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00FFF0';
    ctx.font = fontSize + 'px Fira Code, monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);
}
