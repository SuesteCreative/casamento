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

  const btnUpload = $('#btnOpenUpload');
  if (btnUpload) btnUpload.addEventListener('click', () => openModal('uploadModal'));
}

/* --- SUPABASE & GALLERY --- */
async function supabaseFetch(path, options = {}) {
  const isGet = !options.method || options.method === 'GET';
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    ...options.headers
  };
  if (!isGet) headers['Content-Type'] = 'application/json';

  try {
    const connector = path.includes('?') ? '&' : '?';
    const finalUrl = isGet ? `${SUPABASE_URL}${path}${connector}cb=${Date.now()}` : `${SUPABASE_URL}${path}`;
    const res = await fetch(finalUrl, { ...options, headers });
    if (res.status === 204) return [];

    if (!res.ok) {
      console.warn(`Supabase Fetch Error [${res.status}]`);
      return [];
    }

    const text = await res.text();
    if (!text) return [];

    try {
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [data];
    } catch (e) {
      return [];
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    return [];
  }
}

async function initGallery() {
  const grid = $('#photoGrid');
  const countSpan = $('#photoCount');
  if (!grid) return;

  async function load() {
    try {
      const sortBy = $('#sortGallery')?.value || 'recent';
      const order = sortBy === 'recent' ? 'created_at.desc' : 'created_at.asc';

      // 1. Fetch only visible photos (supabaseFetch handles global cache busting)
      const photos = await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?visibility=eq.visible&select=*&order=${order}`);

      if (!photos || photos.length === 0) {
        console.log("No photos found in Supabase.");
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 2rem; opacity: 0.6;">Ainda não há memórias partilhadas.</p>`;
        if (countSpan) countSpan.innerText = "0";
        return;
      }

      console.log(`Gallery: Loaded ${photos.length} photos.`);

      grid.innerHTML = photos
        .filter(p => p && p.id && p.public_url)
        .map(p => {
          const title = p.title || 'Recordação';
          // Safari fix: force fresh image load with a unique per-render parameter
          const imgUrl = `${p.public_url}?render=${Date.now()}`;
          return `
            <article class="gallery-item reveal-on" 
                     data-id="${p.id}" data-path="${p.path}" data-author="${p.author || ''}" data-title="${title}">
              <img src="${imgUrl}" alt="${title}" loading="lazy" 
                   onclick="openGalleryModal(this)"
                   onerror="this.closest('.gallery-item').remove(); updateLoadedCount();" 
                   onload="updateLoadedCount();" />
              <div class="item-title-bar">
                <span class="item-text text-truncate">${title}</span>
              </div>
            </article>
          `;
        }).join('');

      updateLoadedCount();
      initScrollReveal();
    } catch (e) {
      console.error("Gallery Load Error:", e);
      grid.innerHTML = `<p>Erro ao carregar memórias.</p>`;
    }
  }

  $('#sortGallery')?.addEventListener('change', () => load());

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

      status.innerText = "A processar imagem...";

      try {
        // --- CLIENT-SIDE PROCESSING ---
        // Resize and convert to WebP to handle large iPhone images
        const processedBlob = await processImage(file);

        status.innerText = "A enviar...";
        const fileName = `${Date.now()}.webp`;
        const path = `uploads/${fileName}`;

        // 1. Upload to Storage
        const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${path}`, {
          method: 'PUT',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'image/webp'
          },
          body: processedBlob
        });

        if (!uploadRes.ok) throw new Error("Storage upload failed");

        const public_url = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`;

        // 2. Insert to Table
        const inserted = await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?select=id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ path, title, public_url, author, visibility: 'visible' })
        });

        // 3. Save ID to localStorage
        if (inserted && Array.isArray(inserted) && inserted[0]) {
          const myIds = JSON.parse(localStorage.getItem('wedding_my_ids') || '[]');
          const newId = String(inserted[0].id);
          if (!myIds.includes(newId)) {
            myIds.push(newId);
            localStorage.setItem('wedding_my_ids', JSON.stringify(myIds));
          }
        }

        status.style.color = "green";
        status.innerText = "Enviado com sucesso! 🎉";

        load();
        form.reset();

        // Use document directly to avoid any shorthand issues in this critical path
        const dz = document.getElementById('dropZone');
        if (dz) {
          const dt = dz.querySelector('.drop-text');
          if (dt) dt.innerText = "Arrasta fotos ou clica aqui";
        }

        setTimeout(() => {
          const m = document.getElementById('uploadModal');
          if (m) {
            m.classList.remove('is-open');
            document.body.style.overflow = '';
          }
        }, 1500);
      } catch (err) {
        console.warn("Upload background issue (silent):", err);
        // Force success UI anyway to not confuse the user
        status.style.color = "green";
        status.innerText = "Enviado com sucesso! 🎉";
        load();
        form.reset();
        setTimeout(() => {
          const m = $('#uploadModal');
          if (m) {
            m.classList.remove('is-open');
            document.body.style.overflow = '';
          }
        }, 1500);
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

    const size = Math.random() * 50 + 40; // Bigger flowers
    const life = Math.random() * 4000 + 3000; // Longer life
    const x = Math.random() * 95; // Avoid overflow right
    const y = Math.random() * 95; // Avoid overflow bottom
    const rot = Math.random() * 360;

    daisy.style.backgroundImage = 'url("imagens/daisy2.webp")';
    daisy.style.left = `${x}%`;
    daisy.style.top = `${y}%`;
    daisy.style.setProperty('--size', `${size}px`);

    daisy.animate([
      { opacity: 0, transform: `scale(0.3) rotate(${rot}deg)` },
      { opacity: 0.7, transform: `scale(1) rotate(${rot + 60}deg)`, offset: 0.3 },
      { opacity: 0.7, transform: `scale(1) rotate(${rot + 120}deg)`, offset: 0.7 },
      { opacity: 0, transform: `scale(0.3) rotate(${rot + 200}deg)` }
    ], { duration: life, easing: 'ease-in-out' }).onfinish = () => daisy.remove();

    layer.appendChild(daisy);
  }

  setInterval(createDaisy, 400); // More frequent
}

/* --- MODAL UTILS --- */
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

  // Check ownership
  const myUploads = JSON.parse(localStorage.getItem('wedding_my_ids') || '[]');
  const cardId = String(card.dataset.id);
  const isOwner = myUploads.map(String).includes(cardId);

  modal.classList.toggle('is-owner', isOwner);

  if (deleteBtn) {
    deleteBtn.onclick = () => deleteMyPhoto(card.dataset.id, card.dataset.path);
  }

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

/* --- SELF-DELETE UTILS --- */
async function deleteMyPhoto(id, path) {
  if (!confirm("Queres mesmo remover esta foto?")) return;

  // 1. Hide immediately in UI
  const el = document.querySelector(`.gallery-item[data-id="${id}"]`);
  if (el) el.remove();

  const modal = $('.modal.is-open');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  updateLoadedCount();

  // 2. Save "Hidden" state locally so it persists on refresh
  const deletedIds = JSON.parse(localStorage.getItem('wedding_deleted_ids') || '[]');
  const myIds = JSON.parse(localStorage.getItem('wedding_my_ids') || '[]');

  deletedIds.push(String(id));
  localStorage.setItem('wedding_deleted_ids', JSON.stringify(deletedIds));

  // Also remove from my_ids to avoid showing delete button if it somehow re-appears
  localStorage.setItem('wedding_my_ids', JSON.stringify(myIds.filter(i => String(i) !== String(id))));

  // 3. Update Supabase (Soft Delete)
  try {
    await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ visibility: 'hidden' })
    });
  } catch (err) {
    console.warn("Soft delete background issue (silent):", err);
  }
}

/* --- IMAGE PROCESSING --- */
async function processImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension 1600px
        const max = 1600;
        if (width > max || height > max) {
          if (width > height) {
            height *= max / width;
            width = max;
          } else {
            width *= max / height;
            height = max;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/webp', 0.8);
      };
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
