// Terminal-style typing effect for section titles
window.addEventListener('DOMContentLoaded', () => {
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

// Slight magnetic hover effect on buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
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
