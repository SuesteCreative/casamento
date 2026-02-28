/* script.js */

const SUPABASE_URL = "COLOCA_AQUI_O_TEU_SUPABASE_URL";
const SUPABASE_ANON_KEY = "COLOCA_AQUI_O_TEU_SUPABASE_PUBLISHABLE_KEY";
const SUPABASE_BUCKET = "wedding-uploads";
const SUPABASE_TABLE = "wedding_photos";

const WEDDING_DATE_ISO = "2026-07-18T15:30:00+01:00";
const MAX_FILE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function pad2(n){ return String(n).padStart(2,"0"); }

function setStatus(msg, type){
  const el = $("#ugcStatus");
  if(!el) return;
  el.classList.remove("is-error","is-ok");
  if(type === "error") el.classList.add("is-error");
  if(type === "ok") el.classList.add("is-ok");
  el.textContent = msg || "";
}

function openModal(modal){
  if(!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden","false");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

function closeModal(modal){
  if(!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden","true");
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

function initReveal(){
  const sections = $all(".reveal-on");
  if(!sections.length) return;

  if(!("IntersectionObserver" in window)){
    sections.forEach(s => s.classList.add("is-visible"));
    return;
  }

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  sections.forEach(s => obs.observe(s));
}

function initImgSwap(){
  const wrap = $("#swapWrap-2");
  if(!wrap) return;

  const toggle = ()=> wrap.classList.toggle("is-alt");
  wrap.addEventListener("click", toggle);
  wrap.addEventListener("keydown", (e)=>{
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      toggle();
    }
  });
}

function initCountdown(){
  const daysEl = $("#cd-days-2");
  const hoursEl = $("#cd-hours-2");
  const minsEl = $("#cd-mins-2");
  const secsEl = $("#cd-secs-2");
  if(!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const target = new Date(WEDDING_DATE_ISO).getTime();

  function tick(){
    const now = Date.now();
    let diff = Math.max(0, target - now);

    const d = Math.floor(diff / (1000*60*60*24));
    diff -= d * (1000*60*60*24);
    const h = Math.floor(diff / (1000*60*60));
    diff -= h * (1000*60*60);
    const m = Math.floor(diff / (1000*60));
    diff -= m * (1000*60);
    const s = Math.floor(diff / 1000);

    daysEl.textContent = pad2(d);
    hoursEl.textContent = pad2(h);
    minsEl.textContent = pad2(m);
    secsEl.textContent = pad2(s);
  }

  tick();
  setInterval(tick, 1000);
}

function initQuintaModal(){
  const section = $("#quinta-falesia");
  const modal = $("#quintaModal");
  if(!section || !modal) return;

  const imgEl = $(".quinta-modal-img", modal);
  const closeBtn = $(".quinta-modal-close", modal);
  if(!imgEl || !closeBtn) return;

  const thumbs = $all(".quinta-grid-item img", section);

  function open(src, alt){
    imgEl.src = src;
    imgEl.alt = alt || "";
    openModal(modal);
  }

  function close(){
    closeModal(modal);
    imgEl.src = "";
    imgEl.alt = "";
  }

  thumbs.forEach(img=>{
    img.addEventListener("click", ()=>{
      open(img.currentSrc || img.src, img.alt);
    });
  });

  closeBtn.addEventListener("click", (e)=>{
    e.stopPropagation();
    close();
  });

  modal.addEventListener("click", ()=> close());
  const inner = $(".quinta-modal-inner", modal);
  if(inner) inner.addEventListener("click", (e)=> e.stopPropagation());

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
}

function initAccommodationCarousel(){
  const section = $("#accommodation-section");
  const track = $("#accCarousel");
  if(!section || !track) return;

  const slides = $all(".acc-slide", track);
  const total = slides.length;
  if(!total) return;

  let index = 0;

  const goTo = (i)=>{
    index = (i + total) % total;
    track.style.transform = `translateX(${(-index * 100)}%)`;
  };

  const prevBtn = $("[data-acc-prev]", section) || $(".acc-arrow-left", section);
  const nextBtn = $("[data-acc-next]", section) || $(".acc-arrow-right", section);

  if(prevBtn) prevBtn.addEventListener("click", ()=> goTo(index - 1));
  if(nextBtn) nextBtn.addEventListener("click", ()=> goTo(index + 1));

  let startX = null;
  const threshold = 40;

  track.addEventListener("touchstart", (e)=>{
    if(e.touches && e.touches.length === 1) startX = e.touches[0].clientX;
  }, { passive:true });

  track.addEventListener("touchend", (e)=>{
    if(startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if(diff > threshold) goTo(index - 1);
    else if(diff < -threshold) goTo(index + 1);
    startX = null;
  });

  goTo(0);
}

/* Supabase helpers (sem dependências externas) */
async function supabaseFetch(path, options = {}){
  const url = `${SUPABASE_URL}${path}`;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...(options.headers || {})
  };
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if(!res.ok){
    const msg = (data && data.message) ? data.message : `Erro (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

function safeName(name){
  return (name || "upload")
    .toLowerCase()
    .replace(/\s+/g,"-")
    .replace(/[^a-z0-9._-]/g,"");
}

function fileTooBig(file){
  return file.size > (MAX_FILE_MB * 1024 * 1024);
}

async function uploadFileToBucket(file){
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const base = safeName(file.name.replace(/\.[^/.]+$/, ""));
  const stamp = Date.now();
  const path = `uploads/${stamp}-${base}.${ext}`;

  const uploadPath = `/storage/v1/object/${encodeURIComponent(SUPABASE_BUCKET)}/${encodeURIComponent(path)}`;

  await supabaseFetch(uploadPath, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false"
    },
    body: file
  });

  return path;
}

function publicUrlFor(path){
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`;
}

async function insertPhotoRow({ path, title, public_url }){
  const body = [{
    path,
    title: title || null,
    public_url: public_url || null
  }];

  const data = await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(body)
  });

  return Array.isArray(data) ? data[0] : data;
}

async function fetchPhotos({ order = "latest" } = {}){
  const orderBy = order === "latest" ? "created_at.desc" : "created_at.asc";
  const data = await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?select=*&order=${encodeURIComponent(orderBy)}`, {
    method: "GET"
  });
  return Array.isArray(data) ? data : [];
}

function renderGallery(items){
  const grid = $("#ugcGrid");
  const count = $("#ugcCount");
  const tpl = $("#ugcCardTpl");
  if(!grid || !count) return;

  grid.innerHTML = "";
  count.textContent = String(items.length);

  items.forEach(item=>{
    const url = item.public_url || publicUrlFor(item.path);
    const title = item.title || "";

    let node;
    if(tpl && tpl.content){
      node = tpl.content.firstElementChild.cloneNode(true);
      const img = $(".ugc-card-img", node);
      const t = $(".ugc-card-title", node);
      const btn = $(".ugc-card-btn", node);

      if(img){
        img.src = url;
        img.alt = title || "Foto";
      }
      if(t) t.textContent = title || " ";

      if(btn){
        btn.addEventListener("click", ()=> openPreview(url, title));
      }
    }else{
      node = document.createElement("article");
      node.className = "ugc-card";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ugc-card-btn";

      const img = document.createElement("img");
      img.className = "ugc-card-img";
      img.loading = "lazy";
      img.decoding = "async";
      img.src = url;
      img.alt = title || "Foto";

      const span = document.createElement("span");
      span.className = "ugc-card-title";
      span.textContent = title || " ";

      btn.appendChild(img);
      btn.appendChild(span);
      btn.addEventListener("click", ()=> openPreview(url, title));

      node.appendChild(btn);
    }

    grid.appendChild(node);
  });
}

/* Preview modal (reutiliza o modal da Quinta) */
function openPreview(url, title){
  const modal = $("#quintaModal");
  const img = modal ? $(".quinta-modal-img", modal) : null;
  if(!modal || !img) return;
  img.src = url;
  img.alt = title || "Foto";
  openModal(modal);
}

/* UGC */
function initUGC(){
  const openBtn = $("[data-open-upload]");
  const modal = $("#ugcModal");
  const closeBtn = modal ? $(".ugc-modal-close", modal) : null;

  const drop = modal ? $("[data-dropzone]", modal) : null;
  const fileInput = modal ? $("#ugcFile") : null;

  const panel1 = modal ? $("[data-ugc-step='1']", modal) : null;
  const panel2 = modal ? $("[data-ugc-step='2']", modal) : null;

  const prevBtn = modal ? $("[data-prev]", modal) : null;
  const nextBtn = modal ? $("[data-next]", modal) : null;

  const titleInput = modal ? $("#ugcTitle") : null;
  const submitBtn = modal ? $("[data-ugc-submit]", modal) : null;

  const previewGrid = modal ? $("#ugcPreviewList") : null;

  const sortBtn = $(".ugc-sort-btn");

  if(!modal || !openBtn || !drop || !fileInput || !panel1 || !panel2 || !titleInput || !submitBtn) return;

  let sortMode = "latest";
  let selectedFiles = [];
  let previewUrls = [];
  let step = 1;

  const dots = $all(".ugc-step", modal);

  function setStep(n){
    step = n;

    dots.forEach((d, i)=> d.classList.toggle("is-active", i === (step - 1)));

    panel1.classList.toggle("is-active", step === 1);
    panel2.classList.toggle("is-active", step === 2);

    if(prevBtn) prevBtn.disabled = step === 1;

    if(nextBtn){
      if(step === 1){
        nextBtn.disabled = false;
        nextBtn.textContent = "›";
        nextBtn.setAttribute("aria-label", "Seguinte");
      }else{
        nextBtn.disabled = true;
        nextBtn.textContent = "›";
        nextBtn.setAttribute("aria-label", "Seguinte");
      }
    }
  }

  function clearPreviews(){
    if(previewUrls.length){
      previewUrls.forEach(u => URL.revokeObjectURL(u));
    }
    previewUrls = [];
    if(previewGrid) previewGrid.innerHTML = "";
  }

  function renderPreviews(files){
    clearPreviews();
    if(!previewGrid) return;

    files.forEach((file)=>{
      const url = URL.createObjectURL(file);
      previewUrls.push(url);

      const wrap = document.createElement("div");
      wrap.className = "ugc-preview-item";

      const img = document.createElement("img");
      img.src = url;
      img.alt = file.name || "Pré-visualização";

      wrap.appendChild(img);
      previewGrid.appendChild(wrap);
    });
  }

  function resetFlow(){
    selectedFiles = [];
    clearPreviews();
    fileInput.value = "";
    titleInput.value = "";
    setStatus("");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submeter";
    setStep(1);
  }

  function validateFiles(files){
    const ok = [];
    for(const f of files){
      if(!ACCEPTED_TYPES.includes(f.type)){
        setStatus("Formato não suportado. Usa JPG, PNG, WEBP ou HEIC.", "error");
        continue;
      }
      if(fileTooBig(f)){
        setStatus(`Ficheiro demasiado grande. Máximo ${MAX_FILE_MB}MB.`, "error");
        continue;
      }
      ok.push(f);
    }
    return ok;
  }

  async function refresh(){
    try{
      const items = await fetchPhotos({ order: sortMode });
      renderGallery(items);
    }catch(err){
      setStatus("Não foi possível carregar a galeria. Confirma a tabela e permissões.", "error");
    }
  }

  async function doSubmit(){
    if(!selectedFiles.length){
      setStatus("Escolhe pelo menos uma imagem.", "error");
      setStep(1);
      return;
    }

    const title = (titleInput.value || "").trim();

    setStatus("A enviar...", "");
    submitBtn.disabled = true;
    submitBtn.textContent = "A enviar...";

    try{
      for(const file of selectedFiles){
        const path = await uploadFileToBucket(file);
        const publicUrl = publicUrlFor(path);
        await insertPhotoRow({ path, title, public_url: publicUrl });
      }

      setStatus("Enviado com sucesso. A atualizar galeria...", "ok");
      await refresh();

      setTimeout(()=>{
        closeModal(modal);
        submitBtn.disabled = false;
        submitBtn.textContent = "Submeter";
      }, 650);

    }catch(err){
      setStatus(`Erro no upload. ${err.message || ""}`.trim(), "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submeter";
    }
  }

  openBtn.addEventListener("click", ()=>{
    resetFlow();
    openModal(modal);
  });

  if(closeBtn){
    closeBtn.addEventListener("click", ()=>{
      closeModal(modal);
      clearPreviews();
    });
  }

  modal.addEventListener("click", (e)=>{
    if(e.target === modal){
      closeModal(modal);
      clearPreviews();
    }
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && modal.classList.contains("is-open")){
      closeModal(modal);
      clearPreviews();
    }
  });

  drop.addEventListener("dragover", (e)=>{
    e.preventDefault();
    drop.classList.add("is-dragover");
  });

  drop.addEventListener("dragleave", ()=>{
    drop.classList.remove("is-dragover");
  });

  drop.addEventListener("drop", (e)=>{
    e.preventDefault();
    drop.classList.remove("is-dragover");

    const files = Array.from((e.dataTransfer && e.dataTransfer.files) ? e.dataTransfer.files : []);
    const ok = validateFiles(files);

    if(ok.length){
      selectedFiles = ok;
      renderPreviews(ok);
      setStatus(`${ok.length} ficheiro(s) selecionado(s).`, "ok");
      setStep(2);
    }
  });

  fileInput.addEventListener("change", ()=>{
    const files = Array.from(fileInput.files || []);
    const ok = validateFiles(files);

    if(ok.length){
      selectedFiles = ok;
      renderPreviews(ok);
      setStatus(`${ok.length} ficheiro(s) selecionado(s).`, "ok");
      setStep(2);
    }
  });

  if(prevBtn){
    prevBtn.addEventListener("click", ()=> setStep(1));
  }

  if(nextBtn){
    nextBtn.addEventListener("click", ()=>{
      if(step === 1){
        if(!selectedFiles.length){
          setStatus("Escolhe pelo menos uma imagem.", "error");
          return;
        }
        setStep(2);
      }
    });
  }

  submitBtn.addEventListener("click", doSubmit);

  if(sortBtn){
    const setSortLabel = ()=>{
      const label = sortMode === "latest" ? "Mais recentes" : "Mais antigas";
      sortBtn.textContent = label;
    };

    setSortLabel();

    sortBtn.addEventListener("click", async ()=>{
      sortMode = (sortMode === "latest") ? "oldest" : "latest";
      setSortLabel();
      await refresh();
    });
  }

  refresh();
}

/* Arranque */
document.addEventListener("DOMContentLoaded", ()=>{
  initReveal();
  initImgSwap();
  initCountdown();
  initQuintaModal();
  initAccommodationCarousel();
  initUGC();
});
