/* script.js */

const SUPABASE_URL = "https://ofllnwwpyhhvyzuhwzzc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8iHaCkyT6RdrOF4Dcrf5VQ_ZLgr8zm6";
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

function isPlaceholder(v){
  return !v || String(v).includes("COLOCA_AQUI");
}

function assertSupabaseConfig(){
  const okUrl = SUPABASE_URL && /^https:\/\/.+\.supabase\.co\/?$/.test(SUPABASE_URL);
  const okKey = SUPABASE_ANON_KEY && (SUPABASE_ANON_KEY.startsWith("sb_") || SUPABASE_ANON_KEY.length > 40);

  if(isPlaceholder(SUPABASE_URL) || isPlaceholder(SUPABASE_ANON_KEY) || !okUrl || !okKey){
    const msg = "Supabase não configurado. Confirma SUPABASE_URL (https://...supabase.co) e SUPABASE_ANON_KEY (sb_...).";
    setStatus(msg, "error");
    console.error(msg, { SUPABASE_URL, hasKey: !!SUPABASE_ANON_KEY });
    return false;
  }
  return true;
}

function withTimeout(promise, ms, label){
  let t;
  const timeout = new Promise((_, reject)=>{
    t = setTimeout(()=>{
      reject(new Error(label || "Timeout"));
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(()=> clearTimeout(t));
}

/* UI stuff */
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
function joinPathKeepSlashes(path){
  const parts = String(path || "").split("/").filter(Boolean);
  return parts.map(p => encodeURIComponent(p)).join("/");
}

async function supabaseFetch(path, options = {}){
  if(!assertSupabaseConfig()) throw new Error("Supabase não configurado.");

  const base = SUPABASE_URL.replace(/\/+$/, "");
  const url = `${base}${path}`;

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...(options.headers || {})
  };

  const fetchOpts = {
    method: options.method || "GET",
    headers,
    body: options.body,
    mode: "cors",
    credentials: "omit",
    cache: "no-store"
  };

  try{
    const res = await withTimeout(fetch(url, fetchOpts), 20000, "Timeout a contactar Supabase");
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    if(!res.ok){
      const msg =
        (data && typeof data === "object" && data.message) ? data.message :
        (data && typeof data === "object" && data.error) ? data.error :
        `Erro (${res.status})`;
      const err = new Error(msg);
      err._status = res.status;
      err._data = data;
      throw err;
    }

    return data;
  }catch(err){
    if(err && err.name === "TypeError" && String(err.message).toLowerCase().includes("failed to fetch")){
      const hint = [
        "Failed to fetch: normalmente é CORS, bloqueio de rede/adblock, URL do Supabase errada, ou Cloudflare a interferir.",
        "Confirma em Supabase: API > CORS Allowed Origins inclui https://ocasamento.website e https://theyoungsailor.github.io",
        "Confirma que SUPABASE_URL começa com https e que não tens http misturado.",
        "Confirma que o bucket e policies permitem upload para anon."
      ].join(" ");
      console.error("Supabase fetch falhou", { url, hint, err });
      throw new Error(hint);
    }
    console.error("Supabase fetch erro", { url, err });
    throw err;
  }
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

function normalizeContentType(file){
  if(file && file.type) return file.type;
  const n = (file && file.name) ? file.name.toLowerCase() : "";
  if(n.endsWith(".png")) return "image/png";
  if(n.endsWith(".webp")) return "image/webp";
  if(n.endsWith(".heic")) return "image/heic";
  if(n.endsWith(".heif")) return "image/heif";
  return "image/jpeg";
}

async function uploadFileToBucket(file){
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const baseName = safeName(file.name.replace(/\.[^/.]+$/, ""));
  const stamp = Date.now();
  const path = `uploads/${stamp}-${baseName}.${ext}`;

  const bucketEnc = encodeURIComponent(SUPABASE_BUCKET);
  const pathEnc = joinPathKeepSlashes(path);

  const uploadPath = `/storage/v1/object/${bucketEnc}/${pathEnc}`;

  await supabaseFetch(uploadPath, {
    method: "PUT",
    headers: {
      "Content-Type": normalizeContentType(file),
      "x-upsert": "false"
    },
    body: file
  });

  return path;
}

function publicUrlFor(path){
  const base = SUPABASE_URL.replace(/\/+$/, "");
  const pathEnc = joinPathKeepSlashes(path);
  return `${base}/storage/v1/object/public/${SUPABASE_BUCKET}/${pathEnc}`;
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

/* Lista ficheiros no bucket (fallback e sync opcional)
   Nota: este endpoint depende de policies em storage.objects para anon.
*/
async function listBucketObjects(prefix = "uploads/"){
  const bucketEnc = encodeURIComponent(SUPABASE_BUCKET);
  const payload = { prefix, limit: 1000, offset: 0, sortBy: { column: "name", order: "desc" } };

  const data = await supabaseFetch(`/storage/v1/object/list/${bucketEnc}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if(!Array.isArray(data)) return [];
  return data
    .filter(o => o && o.name && !o.name.endsWith("/"))
    .map(o => `${prefix}${o.name}`.replace(/\/+/g, "/"));
}

async function syncBucketToTableIfPossible(){
  try{
    const existing = await fetchPhotos({ order: "latest" });
    const existingPaths = new Set(existing.map(x => x.path).filter(Boolean));

    const objects = await listBucketObjects("uploads/");
    const toInsert = objects.filter(p => !existingPaths.has(p)).slice(0, 50);

    if(!toInsert.length) return;

    for(const path of toInsert){
      const publicUrl = publicUrlFor(path);
      await insertPhotoRow({ path, title: null, public_url: publicUrl });
    }
  }catch(err){
    console.warn("Sync bucket -> table falhou (normal se não houver permissão para listar).", err);
  }
}

function renderGallery(items){
  const grid = $("#ugcGrid");
  const count = $("#ugcCount");
  const tpl = $("#ugcCardTpl");
  if(!grid || !count) return;

  grid.innerHTML = "";
  count.textContent = String(items.length);

  items.forEach(item=>{
    const url = item.public_url || (item.path ? publicUrlFor(item.path) : "");
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
      const type = f.type || normalizeContentType(f);

      if(!ACCEPTED_TYPES.includes(type)){
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
      if(!assertSupabaseConfig()){
        renderGallery([]);
        return;
      }

      let items = await fetchPhotos({ order: sortMode });

      if(items.length === 0){
        await syncBucketToTableIfPossible();
        items = await fetchPhotos({ order: sortMode });

        if(items.length === 0){
          try{
            const objects = await listBucketObjects("uploads/");
            items = objects.map(p => ({ path: p, title: "", public_url: publicUrlFor(p) }));
          }catch(_){
          }
        }
      }

      renderGallery(items);
      setStatus("");
    }catch(err){
      setStatus("Não foi possível carregar a galeria. Confirma tabela, RLS, CORS e bucket.", "error");
      console.error("Refresh galeria falhou", err);
    }
  }

  async function doSubmit(){
    if(!selectedFiles.length){
      setStatus("Escolhe pelo menos uma imagem.", "error");
      setStep(1);
      return;
    }

    if(!assertSupabaseConfig()){
      setStatus("Supabase não configurado. Confirma as variáveis no script.js.", "error");
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
      const msg = (err && err.message) ? err.message : "Erro no upload.";
      setStatus(`Erro no upload. ${msg}`.trim(), "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submeter";
      console.error("Upload falhou", err);
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

function initDaisyBackground(){
  const layer = document.getElementById("daisy-layer");
  if(!layer) return;

  const MAX_FLOWERS = 12;
  const INTERVAL_MS = 700;

  const MIN_SIZE = 30;
  const MAX_SIZE = 84;

  const MIN_LIFE = 1;
  const MAX_LIFE = 5;

  const MIN_SPIN = 1.2;
  const MAX_SPIN = 3.4;

  const MIN_OPACITY = 0.06;
  const MAX_OPACITY = 0.14;

  const DRIFT_RANGE = 60;
  const SAFE_PADDING = 12;
  const MAX_ATTEMPTS = 20;

  const alive = [];

  function rand(min, max){
    return Math.random() * (max - min) + min;
  }

  function rectsOverlap(a, b){
    return !(
      a.x + a.w <= b.x ||
      b.x + b.w <= a.x ||
      a.y + a.h <= b.y ||
      b.y + b.h <= a.y
    );
  }

  function canPlace(candidate){
    for(const r of alive){
      if(rectsOverlap(candidate, r)) return false;
    }
    return true;
  }

  function tryCreate(){
    if(layer.childElementCount >= MAX_FLOWERS) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const size = Math.round(rand(MIN_SIZE, MAX_SIZE));
    const life = rand(MIN_LIFE, MAX_LIFE);
    const spin = rand(MIN_SPIN, MAX_SPIN);
    const opacity = rand(MIN_OPACITY, MAX_OPACITY);

    const dir = Math.random() < 0.5 ? -1 : 1;
    const startRot = `${Math.round(rand(0, 360))}deg`;

    const dxVal = Math.round(rand(-DRIFT_RANGE, DRIFT_RANGE));
    const dyVal = Math.round(rand(-DRIFT_RANGE, DRIFT_RANGE));

    let placed = false;
    let x = 0;
    let y = 0;

    for(let attempt = 0; attempt < MAX_ATTEMPTS; attempt++){
      x = rand(0, Math.max(0, vw - size));
      y = rand(0, Math.max(0, vh - size));

      const candidate = {
        x: x - SAFE_PADDING,
        y: y - SAFE_PADDING,
        w: size + SAFE_PADDING * 2,
        h: size + SAFE_PADDING * 2
      };

      if(canPlace(candidate)){
        alive.push(candidate);
        placed = true;
        break;
      }
    }

    if(!placed) return;

    const el = document.createElement("div");
    el.className = "daisy";

    el.style.setProperty("--size", `${size}px`);
    el.style.setProperty("--life", `${life}s`);
    el.style.setProperty("--spin", `${spin}s`);
    el.style.setProperty("--opacity", `${opacity}`);
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    el.style.setProperty("--dx", `${dxVal}px`);
    el.style.setProperty("--dy", `${dyVal}px`);
    el.style.setProperty("--dir", String(dir));
    el.style.setProperty("--start-rot", startRot);

    layer.appendChild(el);

    const removeAfter = Math.ceil(life * 1000) + 300;

    setTimeout(()=>{
      el.remove();

      const targetX = x - SAFE_PADDING;
      const targetY = y - SAFE_PADDING;
      const targetW = size + SAFE_PADDING * 2;

      const idx = alive.findIndex(r =>
        r.x === targetX && r.y === targetY && r.w === targetW
      );
      if(idx >= 0) alive.splice(idx, 1);
    }, removeAfter);
  }

  let timer = setInterval(tryCreate, INTERVAL_MS);

  document.addEventListener("visibilitychange", ()=>{
    if(document.hidden){
      clearInterval(timer);
      timer = null;
      layer.innerHTML = "";
      alive.length = 0;
    }else{
      if(!timer) timer = setInterval(tryCreate, INTERVAL_MS);
    }
  });
}

/* Arranque */
document.addEventListener("DOMContentLoaded", ()=>{
  initReveal();
  initImgSwap();
  initCountdown();
  initQuintaModal();
  initAccommodationCarousel();
  initUGC();
  initDaisyBackground();
});
