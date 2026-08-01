/* ==========================================================
   LOADER
   ========================================================== */
const loaderTextEl = document.getElementById('loaderText');
const loaderWords = ['booting_ai','loading_model','ready'];
let loaderWordIndex = 0;

function typeLoaderWord(word, cb){
  let i = 0;
  loaderTextEl.textContent = '';
  const interval = setInterval(()=>{
    loaderTextEl.textContent += word[i];
    i++;
    if(i >= word.length){
      clearInterval(interval);
      setTimeout(cb, 220);
    }
  }, 28);
}

function runLoaderSequence(){
  if(loaderWordIndex < loaderWords.length){
    typeLoaderWord(loaderWords[loaderWordIndex], ()=>{
      loaderWordIndex++;
      if(loaderWordIndex < loaderWords.length){
        setTimeout(runLoaderSequence, 200);
      } else {
        setTimeout(()=>{
          document.getElementById('loader').classList.add('hidden');
        }, 260);
      }
    });
  }
}
runLoaderSequence();
window.addEventListener('load', ()=>{
  setTimeout(()=>document.getElementById('loader').classList.add('hidden'), 1600);
});

/* ==========================================================
   AOS INIT
   ========================================================== */
if(window.AOS){ AOS.init({ once:true, duration:800, easing:'ease-out-cubic' }); }

/* ==========================================================
   THEME TOGGLE
   ========================================================== */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('portfolio-theme');
if(savedTheme){ root.setAttribute('data-theme', savedTheme); }
updateThemeIcon();

themeToggle.addEventListener('click', ()=>{
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  if(next === 'dark'){ root.removeAttribute('data-theme'); } else { root.setAttribute('data-theme','light'); }
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon();
});

function updateThemeIcon(){
  const isLight = root.getAttribute('data-theme') === 'light';
  themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

/* ==========================================================
   NAVBAR SCROLL STATE + PROGRESS BAR + ACTIVE LINK
   ========================================================== */
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const navLinkEls = document.querySelectorAll('[data-nav]');
const sections = document.querySelectorAll('main .section, .hero');

function onScroll(){
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 40);
  backToTop.classList.toggle('show', scrollY > 500);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  scrollProgress.style.width = progress + '%';

  let currentId = 'home';
  sections.forEach(sec=>{
    const rect = sec.getBoundingClientRect();
    if(rect.top <= 140 && rect.bottom >= 140){ currentId = sec.id; }
  });
  navLinkEls.forEach(link=>{
    link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
  });
}
document.addEventListener('scroll', onScroll, { passive:true });
onScroll();

backToTop.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));

/* ==========================================================
   MOBILE NAV
   ========================================================== */
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
navBurger.addEventListener('click', ()=>{
  navLinks.classList.toggle('open');
  navBurger.classList.toggle('open');
});
navLinkEls.forEach(link=>{
  link.addEventListener('click', ()=> navLinks.classList.remove('open'));
});

/* ==========================================================
   TYPED.JS — ROLE ROTATOR
   ========================================================== */
if(window.Typed){
  new Typed('#typed', {
    strings:[
      'Artificial Intelligence Student',
      'Machine Learning Engineer',
      'Data Scientist',
      'Python Developer'
    ],
    typeSpeed:45,
    backSpeed:25,
    backDelay:1400,
    loop:true,
    showCursor:false
  });
}

/* ==========================================================
   SKILL PROFICIENCY BARS
   ========================================================== */
const skillBars = document.querySelectorAll('.skill-bar');
const skillBarObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const fill = entry.target.querySelector('.skill-bar-fill');
      const progress = entry.target.dataset.progress || 0;
      requestAnimationFrame(()=>{ fill.style.width = progress + '%'; });
      skillBarObserver.unobserve(entry.target);
    }
  });
}, { threshold:0.4 });
skillBars.forEach(bar=>skillBarObserver.observe(bar));

/* ==========================================================
   PROJECT DETAIL MODALS
   ========================================================== */
const modalOverlay = document.getElementById('modalOverlay');
const modalTriggers = document.querySelectorAll('[data-modal]');
const modalBoxes = document.querySelectorAll('.modal-box');

modalTriggers.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.dataset.modal;
    modalBoxes.forEach(box=> box.classList.toggle('open', box.id === id));
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal(){
  modalOverlay.classList.remove('open');
  modalBoxes.forEach(box=> box.classList.remove('open'));
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-close]').forEach(btn=> btn.addEventListener('click', closeModal));
modalOverlay.addEventListener('click', (e)=>{ if(e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

/* ==========================================================
   CONTACT FORM (front-end only — no backend configured)
   ========================================================== */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
contactForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  const mailBody = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  );
  const mailto = `mailto:ma7hmouda7med11@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio contact')}&body=${mailBody}`;

  formStatus.textContent = 'Opening your email client to send this message...';
  window.location.href = mailto;
  contactForm.reset();
});

/* ==========================================================
   FOOTER YEAR
   ========================================================== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ==========================================================
   NEURAL-NETWORK PARTICLE BACKGROUND (canvas)
   ========================================================== */
(function(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let width, height, nodes;
  const NODE_COUNT_BASE = 70;

  function resize(){
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function init(){
    resize();
    const count = window.innerWidth < 760 ? 34 : NODE_COUNT_BASE;
    nodes = Array.from({length:count}, ()=>({
      x: Math.random()*width,
      y: Math.random()*height,
      vx: (Math.random()-0.5)*0.35,
      vy: (Math.random()-0.5)*0.35,
      r: Math.random()*1.8 + 1
    }));
  }

  function step(){
    ctx.clearRect(0,0,width,height);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const lineColor = isLight ? 'rgba(59,130,246,' : 'rgba(56,189,248,';
    const dotColor = isLight ? 'rgba(59,130,246,0.7)' : 'rgba(56,189,248,0.8)';

    nodes.forEach(n=>{
      n.x += n.vx; n.y += n.vy;
      if(n.x < 0 || n.x > width) n.vx *= -1;
      if(n.y < 0 || n.y > height) n.vy *= -1;
    });

    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 140){
          ctx.strokeStyle = lineColor + (1 - dist/140)*0.35 + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n=>{
      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fill();
    });

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  init();
  step();
})();
