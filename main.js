// Main site JavaScript extracted from index.html

const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('in-view')),{threshold:.15});
document.querySelectorAll('section').forEach(el=>io.observe(el));

const nav=[...document.querySelectorAll('nav a')],secs=[...document.querySelectorAll('section')];
function sync(){const y=scrollY+innerHeight/3;secs.forEach(s=>nav.forEach(l=>l.classList.toggle('active',l.hash==='#'+s.id&&y>=s.offsetTop&&y<s.offsetTop+s.offsetHeight)));}addEventListener('scroll',sync);sync();

const name=document.querySelector('.accent'),cursor=document.querySelector('.cursor'),txt=name.textContent;
name.textContent='';[...txt].forEach((c,i)=>setTimeout(()=>{name.textContent+=c;i===txt.length-1&&(cursor.style.animationPlayState='running');},50*i));

document.querySelectorAll('.exp-tabs button').forEach((b,i)=>b.onclick=()=>{document.querySelectorAll('.exp-tabs button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.exp-panel').forEach((p,idx)=>p.classList.toggle('active',idx===i));});

const track=document.querySelector('.slide-track'),slides=[...track.children],dotsWrap=document.querySelector('.dots'),L=document.querySelector('.arrow-left'),R=document.querySelector('.arrow-right');
let idx=0,auto;
slides.forEach((_,i)=>{const d=document.createElement('button');d.className='slider-dot'+(!i?' active':'');d.dataset.i=i;dotsWrap.appendChild(d);});
const dots=[...document.querySelectorAll('.slider-dot')];
function go(n){idx=(n+slides.length)%slides.length;track.style.transform=`translateX(-${idx*100}%)`;dots.forEach((d,i)=>d.classList.toggle('active',i===idx));}
function next(){go(idx+1)}function play(){auto=setInterval(next,7000)}function stop(){clearInterval(auto)}
L.onclick=()=>{stop();go(idx-1);play()};R.onclick=()=>{stop();go(idx+1);play()};dots.forEach(d=>d.onclick=()=>{stop();go(+d.dataset.i);play()});
track.addEventListener('pointerdown',e=>{stop();let x0=e.clientX,dx;track.style.transition='none';
  const mv=ev=>{dx=ev.clientX-x0;track.style.transform=`translateX(${ -idx*100+dx*100/innerWidth }%)`},up=()=>{track.style.transition='';Math.abs(dx)>60?go(idx-(dx>0?1:-1)):go(idx);play();window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up)};
  window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);});
addEventListener('keydown',e=>{e.code==='ArrowLeft'&&L.click();e.code==='ArrowRight'&&R.click();});
play();

// Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('nav');

if (mobileToggle && navMenu) {
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
    mobileToggle.textContent = navMenu.classList.contains('mobile-open') ? '✕' : '☰';
  });

  // Close mobile menu when clicking nav links
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      mobileToggle.textContent = '☰';
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      navMenu.classList.remove('mobile-open');
      mobileToggle.textContent = '☰';
    }
  });
}