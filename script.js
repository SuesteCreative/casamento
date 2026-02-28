/**
 * Rita & Pedro Wedding Website
 * Core Logic & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initDaisyBackground();
  initCountdown();
  initImgSwap();
  initModals();
  initScrollReveal();
  initCarousel();
});

/* --- COUNTDOWN LOGIC --- */
function initCountdown() {
  const targetDate = new Date('July 18, 2026 15:30:00').getTime();
  const els = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-mins'),
    s: document.getElementById('cd-secs')
  };

  if (!els.d) return;

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('wedding-countdown').innerHTML = "É HOJE! ❤️";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    els.d.innerText = String(d).padStart(2, '0');
    els.h.innerText = String(h).padStart(2, '0');
    els.m.innerText = String(m).padStart(2, '0');
    els.s.innerText = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --- IMAGE SWAP --- */
function initImgSwap() {
  const wrap = document.getElementById('swapWrap-2');
  if (!wrap) return;

  const toggle = () => wrap.classList.toggle('is-active');

  wrap.addEventListener('click', toggle);
  wrap.addEventListener('keypress', (e) => { if (e.key === 'Enter') toggle(); });
}

/* --- SCROLL REVEAL --- */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on').forEach(el => observer.observe(el));
}

/* --- CAROUSEL --- */
function initCarousel() {
  const viewport = document.getElementById('accCarousel');
  const btnPrev = document.querySelector('.nav-btn.prev');
  const btnNext = document.querySelector('.nav-btn.next');

  if (!viewport || !btnPrev) return;

  const scrollAmount = 320;

  btnNext.addEventListener('click', () => viewport.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
  btnPrev.addEventListener('click', () => viewport.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
}

/* --- MODALS --- */
function initModals() {
  const modals = document.querySelectorAll('.modal');

  function openModal(id, imgSrc = null) {
    const modal = document.getElementById(id);
    if (!modal) return;

    if (imgSrc) {
      const img = modal.querySelector('.modal-img');
      if (img) img.src = imgSrc;
    }

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Gallery Click
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => openModal('mediaModal', img.src));
  });

  // Open Upload
  const btnUpload = document.getElementById('btnOpenUpload');
  if (btnUpload) btnUpload.addEventListener('click', () => openModal('uploadModal'));

  // Close Logic
  document.querySelectorAll('[data-close]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const modal = trigger.closest('.modal');
      closeModal(modal);
    });
  });

  // ESC Key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector('.modal.is-open');
      if (openModalEl) closeModal(openModalEl);
    }
  });
}

/* --- DAISY BACKGROUND --- */
function initDaisyBackground() {
  const layer = document.getElementById('daisy-layer');
  if (!layer) return;

  const MAX_FLOWERS = 12;
  const MIN_LIFE = 2000;
  const MAX_LIFE = 5000;

  function createDaisy() {
    if (layer.children.length >= MAX_FLOWERS) return;

    const daisy = document.createElement('div');
    daisy.className = 'daisy';

    const size = Math.random() * 50 + 30;
    const life = Math.random() * (MAX_LIFE - MIN_LIFE) + MIN_LIFE;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const rotation = Math.random() * 360;

    daisy.style.left = `${x}%`;
    daisy.style.top = `${y}%`;
    daisy.style.setProperty('--size', `${size}px`);

    // Animate using Web Animations API
    const anim = daisy.animate([
      { opacity: 0, transform: `scale(0.5) rotate(${rotation}deg) translate(0, 0)` },
      { opacity: 0.15, transform: `scale(1) rotate(${rotation + 45}deg) translate(20px, 20px)`, offset: 0.2 },
      { opacity: 0.15, transform: `scale(1) rotate(${rotation + 90}deg) translate(40px, 40px)`, offset: 0.8 },
      { opacity: 0, transform: `scale(0.5) rotate(${rotation + 180}deg) translate(60px, 60px)` }
    ], {
      duration: life,
      easing: 'ease-in-out'
    });

    layer.appendChild(daisy);

    anim.onfinish = () => daisy.remove();
  }

  setInterval(createDaisy, 800);
}
