/**
 * Rita & Pedro Wedding Website
 * Core Logic & Animations
 */

// Supabase Configuration
const SUPABASE_URL = "https://ofllnwwpyhhvyzuhwzzc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mbGxud3dweWhodnl6dWh3enpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzQzNzUsImV4cCI6MjA4NTU1MDM3NX0.W04EDji-e6ukxHXNiRwW1xy7K-bv-qyO_Yco99_fTOc";
const SUPABASE_BUCKET = "wedding-uploads";
const SUPABASE_TABLE = "wedding_photos";

document.addEventListener('DOMContentLoaded', () => {
  initDaisyBackground();
  initCountdown();
  initImgSwap();
  initModals();
  initScrollReveal();
  initCarousel();
  initGallery();
});

/* --- UTILS --- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* --- COUNTDOWN LOGIC --- */
function initCountdown() {
  const targetDate = new Date('July 18, 2026 15:30:00').getTime();
  const els = {
    d: $('#cd-days'), h: $('#cd-hours'), m: $('#cd-mins'), s: $('#cd-secs')
  };

  if (!els.d) return;

  function update() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      const card = $('#wedding-countdown');
      if (card) card.innerHTML = "<h2 class='font-against'>É HOJE! ❤️</h2>";
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

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
  const wrap = $('#swapWrap-2');
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
        observer.unobserve(entry.target); // Efficiency: only reveal once
      }
    });
  }, { threshold: 0.1 });
  $$('.reveal-on').forEach(el => observer.observe(el));
}

/* --- CAROUSEL --- */
function initCarousel() {
  const viewport = $('#accCarousel');
  const [btnPrev, btnNext] = [$('.carousel-side-btn.prev'), $('.carousel-side-btn.next')];
  if (!viewport || !btnPrev) return;

  const scroll = (dir) => {
    // Scroll by the width of one item + gap
    const amount = 340;
    viewport.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };
  btnNext.addEventListener('click', () => scroll(1));
  btnPrev.addEventListener('click', () => scroll(-1));
}

/* --- MODALS --- */
function initModals() {
  const openModal = (id, imgSrc = null) => {
    const modal = $(`#${id}`);
    if (!modal) return;
    if (imgSrc) { const img = $('.modal-img', modal); if (img) img.src = imgSrc; }
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  window.addEventListener('click', (e) => {
    if (e.target.matches('.modal-overlay') || e.target.closest('[data-close]')) {
      closeModal(e.target.closest('.modal'));
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const open = $('.modal.is-open');
      if (open) closeModal(open);
    }
  });

  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.gallery-item img')) {
      openModal('mediaModal', e.target.closest('img').src);
    }
  });

  const btnUpload = $('#btnOpenUpload');
  if (btnUpload) btnUpload.addEventListener('click', () => openModal('uploadModal'));
}

/* --- SUPABASE & GALLERY --- */
async function supabaseFetch(path, options = {}) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...options.headers
  };
  const res = await fetch(`${SUPABASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 404) return null; // Handle missing items gracefully
    const errText = await res.text();
    console.error(`Supabase Error [${res.status}]:`, errText);
    throw new Error(`Supabase error: ${res.statusText}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

async function initGallery() {
  const grid = $('#photoGrid');
  const countSpan = $('#photoCount');
  if (!grid) return;

  async function load() {
    try {
      const photos = await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?select=*&order=created_at.desc`);
      const myUploads = JSON.parse(localStorage.getItem('wedding_my_ids') || '[]');

      grid.innerHTML = photos.map(p => {
        const canDelete = myUploads.includes(p.id);
        const title = p.title || 'Recordação';
        const author = p.author ? `@${p.author}` : '';

        return `
          <article class="gallery-item reveal-on ${canDelete ? 'can-delete' : ''}" data-id="${p.id}" data-path="${p.path}">
            <button class="btn-delete-item" onclick="deleteMyPhoto(event, ${p.id}, '${p.path}')" title="Remover minha foto">&times;</button>
            <img src="${p.public_url}" alt="${title}" loading="lazy" 
                 onerror="this.closest('.gallery-item').remove(); updateLoadedCount();" 
                 onload="updateLoadedCount();" />
            <div class="item-title-bar">
              <span class="item-text">${title}</span>
              <span class="item-author">${author}</span>
            </div>
          </article>
        `;
      }).join('');
      initScrollReveal();
    } catch (e) {
      grid.innerHTML = `<p>A carregar memórias...</p>`;
    }
  }

  window.updateLoadedCount = () => {
    const activeItems = grid.querySelectorAll('.gallery-item:not([style*="display: none"])');
    if (countSpan) countSpan.innerText = activeItems.length;
  };

  load();

  const form = $('#formUpload');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const file = $('#fileInput').files[0];
      const title = $('#photoTitle').value.trim();
      const author = $('#photoAuthor').value.trim();
      const status = $('#uploadStatus');

      if (!file) return (status.innerText = "Escolhe uma foto!");
      if (!author) return (status.innerText = "Diz-nos o teu nome!");

      status.innerText = "A enviar...";
      try {
        const path = `uploads/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;

        // 1. Upload to Storage
        const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${path}`, {
          method: 'PUT',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': file.type
          },
          body: file
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.text();
          console.error("Storage Error:", err);
          throw new Error("Upload failed");
        }

        const public_url = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`;

        // 2. Insert to Table
        const inserted = await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?select=id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ path, title, public_url, author })
        });

        // 3. Save ID to localStorage so user can delete it later
        if (inserted && inserted[0]) {
          const myIds = JSON.parse(localStorage.getItem('wedding_my_ids') || '[]');
          myIds.push(inserted[0].id);
          localStorage.setItem('wedding_my_ids', JSON.stringify(myIds));
        }

        status.style.color = "green";
        status.innerText = "Enviado com sucesso! 🎉";
        form.reset();
        const dropText = $('.drop-text', '#dropZone');
        if (dropText) dropText.innerText = "Arrasta fotos ou clica aqui";

        setTimeout(() => {
          const open = $('.modal.is-open');
          if (open) {
            open.classList.remove('is-open');
            document.body.style.overflow = '';
          }
          load();
        }, 1500);
      } catch (err) {
        console.error("Upload Catch:", err);
        status.style.color = "red";
        status.innerText = "Erro ao enviar. Tenta de novo.";
      }
    });
  }

  // Handle Drop Zone click
  const dropZone = $('#dropZone');
  const fileInput = $('#fileInput');
  const dropText = $('.drop-text', dropZone);
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        if (dropText) dropText.innerText = `${fileInput.files.length} selecionada(s)`;
        else dropZone.innerText = `${fileInput.files.length} selecionada(s)`;
      }
    });
  }
}

/* --- DAISY BACKGROUND --- */
function initDaisyBackground() {
  const layer = document.getElementById('daisy-layer');
  if (!layer) return;

  const MAX_FLOWERS = window.innerWidth < 600 ? 6 : 12;

  function createDaisy() {
    if (layer.children.length >= MAX_FLOWERS) return;

    const daisy = document.createElement('div');
    daisy.className = 'daisy';

    const size = Math.random() * 40 + 30;
    const life = Math.random() * 3000 + 2500;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const rot = Math.random() * 360;

    daisy.style.left = `${x}%`;
    daisy.style.top = `${y}%`;
    daisy.style.setProperty('--size', `${size}px`);

    daisy.animate([
      { opacity: 0, transform: `scale(0.3) rotate(${rot}deg)` },
      { opacity: 0.12, transform: `scale(1) rotate(${rot + 60}deg)`, offset: 0.3 },
      { opacity: 0.12, transform: `scale(1) rotate(${rot + 120}deg)`, offset: 0.7 },
      { opacity: 0, transform: `scale(0.3) rotate(${rot + 180}deg)` }
    ], { duration: life, easing: 'ease-in-out' }).onfinish = () => daisy.remove();

    layer.appendChild(daisy);
  }

  setInterval(createDaisy, 900);
}

/* --- SELF-DELETE UTILS --- */
async function deleteMyPhoto(event, id, path) {
  event.stopPropagation();
  if (!confirm("Queres mesmo remover esta foto?")) return;

  try {
    // 1. Delete from Table
    await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?id=eq.${id}`, {
      method: 'DELETE'
    });

    // 2. Delete from Storage
    await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${path}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    });

    // 3. Remove from local list
    const myIds = JSON.parse(localStorage.getItem('wedding_my_ids') || '[]');
    localStorage.setItem('wedding_my_ids', JSON.stringify(myIds.filter(i => i !== id)));

    // 4. UI Feedback
    const el = document.querySelector(`.gallery-item[data-id="${id}"]`);
    if (el) el.remove();

    const count = document.getElementById('photoCount');
    if (count) count.innerText = parseInt(count.innerText) - 1;

  } catch (err) {
    console.error("Delete Error:", err);
    alert("Erro ao remover. Tenta de novo.");
  }
}
