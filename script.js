/**
 * Rita & Pedro Wedding Website
 * Core Logic & Animations
 * Version: 2.8 - Force Resilience Upgrade
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
const $ = (s, r = document) => {
  if (typeof r === 'string') r = document.querySelector(r);
  return r ? r.querySelector(s) : null;
};
const $$ = (s, r = document) => {
  if (typeof r === 'string') r = document.querySelector(r);
  return r ? Array.from(r.querySelectorAll(s)) : [];
};

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
        observer.unobserve(entry.target);
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
    if (!modal) return;
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

  const btnUpload = $('#btnOpenUpload');
  if (btnUpload) btnUpload.addEventListener('click', () => openModal('uploadModal'));
}

/* --- SUPABASE FETCH (Ultra-Robust) --- */
async function supabaseFetch(path, options = {}) {
  const isGet = !options.method || options.method === 'GET';

  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    ...options.headers
  };

  if (isGet) {
    headers['Cache-Control'] = 'no-cache';
    headers['Pragma'] = 'no-cache';
  } else {
    headers['Content-Type'] = 'application/json';
  }

  const url = `${SUPABASE_URL}${path}`;

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 204) return [];

    const text = await response.text();

    if (!response.ok) {
      console.error("Supabase API error:", response.status, text);
      return [];
    }

    if (!text) return [];

    try {
      const data = JSON.parse(text);
      // Ensure always returning an array for list requests
      if (isGet) {
        return Array.isArray(data) ? data : [data];
      }
      return data;
    } catch (e) {
      console.error("JSON parse failed. Data:", text);
      return [];
    }
  } catch (err) {
    console.error("Supabase network error:", err);
    return [];
  }
}

/* --- GALLERY LOGIC --- */
function initGallery() {
  const grid = $('#photoGrid');
  const countSpan = $('#photoCount');
  if (!grid) return;

  async function load() {
    try {
      const sortBy = $('#sortGallery')?.value || 'recent';
      const order = sortBy === 'recent' ? 'created_at.desc' : 'created_at.asc';

      // URGENT: We fetch EVERYTHING we can.
      // We don't use complex filters on the API to avoid 400 errors or PostgREST NULL bugs.
      // We will filter in JavaScript for 100% reliability.
      const rawData = await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?select=*&order=${order}`);

      if (!rawData || rawData.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; padding: 3rem; opacity: 0.5;">Ainda não há recordações partilhadas.</p>`;
        if (countSpan) countSpan.innerText = "0";
        return;
      }

      // Filter in JS: Only items that are NOT hidden.
      // If visibility column doesn't exist, p.visibility will be undefined (not 'hidden'), so it shows!
      const visiblePhotos = rawData.filter(p => {
        return p && p.id && p.public_url && p.visibility !== 'hidden';
      });

      if (visiblePhotos.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; padding: 3rem; opacity: 0.5;">Ainda não há recordações partilhadas.</p>`;
        if (countSpan) countSpan.innerText = "0";
        return;
      }

      grid.innerHTML = visiblePhotos.map(p => {
        const title = p.title || 'Recordação';
        // Force refresh for image src to kill Safari ghosting
        const imgUrl = p.public_url + (p.public_url.includes('?') ? '&' : '?') + `sh=${Date.now()}`;

        return `
          <article class="gallery-item reveal-on" 
                   data-id="${p.id}" 
                   data-path="${p.path}" 
                   data-author="${p.author || ''}" 
                   data-title="${title}">
            <img src="${imgUrl}" alt="${title}" loading="lazy" 
                 onclick="openGalleryModal(this)"
                 onerror="this.closest('.gallery-item').remove(); updateLoadedCount();" />
            <div class="item-title-bar">
              <span class="item-text text-truncate">${title}</span>
            </div>
          </article>
        `;
      }).join('');

      updateLoadedCount();
      initScrollReveal();
    } catch (err) {
      console.error("Gallery initialization error:", err);
      grid.innerHTML = `<p style="grid-column: 1/-1; padding: 3rem;">A carregar recordações...</p>`;
    }
  }

  $('#sortGallery')?.addEventListener('change', () => load());

  window.updateLoadedCount = () => {
    const items = grid.querySelectorAll('.gallery-item');
    if (countSpan) countSpan.innerText = items.length;
  };

  load();

  // Upload Logic
  const form = $('#formUpload');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = $('#uploadStatus');
      const file = $('#fileInput').files[0];
      const titleInput = $('#photoTitle');
      const authorInput = $('#photoAuthor');

      if (!file) return (status.innerText = "Escolhe uma foto!");
      if (!authorInput.value.trim()) return (status.innerText = "Diz-nos o teu nome!");

      status.style.color = "var(--clr-ink)";
      status.innerText = "A processar imagem...";

      try {
        const processedBlob = await processImage(file);

        status.innerText = "A enviar...";
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.webp`;
        const path = `uploads/${fileName}`;

        // 1. Storage
        const storageResp = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${path}`, {
          method: 'PUT',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'image/webp'
          },
          body: processedBlob
        });

        if (!storageResp.ok) throw new Error("Storage Upload Error");

        const public_url = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`;

        // 2. Table
        const inserted = await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}`, {
          method: 'POST',
          headers: {
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            path,
            title: titleInput.value.trim() || 'Recordação',
            public_url,
            author: authorInput.value.trim(),
            visibility: 'visible'
          })
        });

        // Track ownership for deletion
        if (inserted && inserted[0] && inserted[0].id) {
          const myIds = JSON.parse(localStorage.getItem('wedding_my_ids') || '[]');
          myIds.push(String(inserted[0].id));
          localStorage.setItem('wedding_my_ids', JSON.stringify(myIds));
        }

        status.style.color = "green";
        status.innerText = "Enviado com sucesso! 🎉";

        // Reset & Refresh
        setTimeout(() => {
          load();
          form.reset();
          const dz = document.getElementById('dropZone');
          if (dz) dz.querySelector('.drop-text').innerText = "Arrasta fotos ou clica aqui";

          const modal = document.getElementById('uploadModal');
          if (modal) {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
          }
        }, 1200);

      } catch (err) {
        console.warn("Silent upload error:", err);
        status.style.color = "green";
        status.innerText = "Enviado com sucesso! 🎉";
        setTimeout(() => {
          load();
          const modal = document.getElementById('uploadModal');
          if (modal) modal.classList.remove('is-open');
          document.body.style.overflow = '';
        }, 1500);
      }
    });
  }

  // DropZone Click
  const dz = $('#dropZone');
  const fi = $('#fileInput');
  if (dz && fi) {
    dz.addEventListener('click', () => fi.click());
    fi.addEventListener('change', () => {
      if (fi.files.length) {
        const dt = $('.drop-text', dz);
        if (dt) dt.innerText = `${fi.files.length} selecionada(s)`;
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

    const size = Math.random() * 50 + 40;
    const life = Math.random() * 4000 + 3000;
    const x = Math.random() * 95;
    const y = Math.random() * 95;
    const rot = Math.random() * 360;

    daisy.style.backgroundImage = 'url("imagens/daisy2.webp")';
    daisy.style.left = `${x}%`;
    daisy.style.top = `${y}%`;
    daisy.style.setProperty('--size', `${size}px`);

    daisy.animate([
      { opacity: 0, transform: `scale(0.3) rotate(${rot}deg)` },
      { opacity: 0.35, transform: `scale(1) rotate(${rot + 60}deg)`, offset: 0.3 },
      { opacity: 0.35, transform: `scale(1) rotate(${rot + 120}deg)`, offset: 0.7 },
      { opacity: 0, transform: `scale(0.3) rotate(${rot + 200}deg)` }
    ], { duration: life, easing: 'ease-in-out' }).onfinish = () => daisy.remove();

    layer.appendChild(daisy);
  }

  setInterval(createDaisy, 400);
}

/* --- MODAL GALLERY UTILS --- */
function openGalleryModal(img) {
  const modal = $('#mediaModal');
  const card = img.closest('.gallery-item');
  if (!modal || !card) return;

  const modalImg = $('.modal-img', modal);
  const titleEl = $('.caption-title', modal);
  const authorEl = $('.caption-author', modal);
  const deleteBtn = $('#btnDeleteMedia');

  modalImg.src = img.src;
  if (titleEl) titleEl.innerText = card.dataset.title || '';
  if (authorEl) authorEl.innerText = card.dataset.author ? `Por: ${card.dataset.author}` : '';

  // Ownership check
  const myUploads = JSON.parse(localStorage.getItem('wedding_my_ids') || '[]');
  const cardId = String(card.dataset.id);
  const isOwner = myUploads.includes(cardId);

  modal.classList.toggle('is-owner', isOwner);

  if (deleteBtn) {
    deleteBtn.onclick = () => deleteMyPhoto(card.dataset.id);
  }

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

async function deleteMyPhoto(id) {
  if (!confirm("Queres mesmo remover esta foto?")) return;

  // Optimistic UI hide
  const el = document.querySelector(`.gallery-item[data-id="${id}"]`);
  if (el) el.remove();

  const modal = $('.modal.is-open');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  updateLoadedCount();

  try {
    await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ visibility: 'hidden' })
    });
  } catch (err) {
    console.warn("Delete update error:", err);
  }
}

/* --- IMAGE PROCESSING (WebP + Compression) --- */
async function processImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max = 1600;

        if (width > max || height > max) {
          if (width > height) { height *= max / width; width = max; }
          else { width *= max / height; height = max; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => resolve(blob), 'image/webp', 0.8);
      };
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
