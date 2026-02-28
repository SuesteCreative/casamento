@font-face{
  font-family:"Against";
  src:url("fonts/against-Regular.woff2") format("woff2"),
      url("fonts/against-Regular.woff") format("woff");
  font-weight:400;
  font-style:normal;
  font-display:swap;
}

:root{
  --bg:#F1ECCE;
  --ink:#92AA97;
  --muted:rgba(146,170,151,.82);
  --muted-2:rgba(146,170,151,.66);

  --green:#92AA97;
  --green-2:#7A9480;

  --card:rgba(255,255,255,.72);
  --card-2:rgba(255,255,255,.58);
  --border:rgba(146,170,151,.28);

  --shadow:0 14px 30px rgba(0,0,0,.14);
  --shadow-2:0 18px 44px rgba(0,0,0,.18);

  --r:18px;
  --r2:14px;
  --max:1100px;

  --btn:#92AA97;
  --btn-ink:#ffffff;

  --focus:rgba(146,170,151,.55);
}

*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
  color:var(--ink);
  background:var(--bg);
}
img{max-width:100%;height:auto;display:block}
button,input,select,textarea{font:inherit}
a{color:inherit;text-decoration:none}

:focus-visible{
  outline:3px solid var(--focus);
  outline-offset:3px;
  border-radius:10px;
}

main{width:100%}

.font-against{
  font-family:"Against",system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
  font-weight:400;
  letter-spacing:.01em;
}

h1,h2,h3,h4,h5,h6{
  color:var(--ink);
}

p,li,small,span,label{
  color:var(--ink);
}

.form-btn,
.ugc-btn,
.ugc-submit{
  color:var(--btn-ink);
}

.form-btn:hover,
.ugc-btn:hover,
.ugc-submit:hover{
  filter:brightness(.98);
}

.form-btn:active,
.ugc-btn:active,
.ugc-submit:active{
  transform:translateY(1px);
}

/* Topo */
.banner-section{
  padding:clamp(26px,6vw,54px) 18px clamp(12px,3vw,26px);
  display:flex;
  justify-content:center;
  align-items:center;
}
.banner-logo{
  height:auto;
}
.banner-logo--sm{
  width:min(320px,58vw);
  height:auto;
}

/* Separadores (qebra) */
.break-icon-inline{
  display:flex;
  justify-content:center;
  align-items:center;
  padding:clamp(22px,5vw,46px) 0;
}
.break-icon-inline--lg{
  padding:clamp(28px,6vw,62px) 0;
}
.break-icon-img{
  width:min(140px,30vw);
  opacity:.92;
  transform:scale(1);
  transition:transform .55s ease, opacity .55s ease;
  transform-origin:center;
}
.break-icon-inline:hover .break-icon-img{
  transform:scale(1.08);
  opacity:1;
}

/* Hero 2 col */
.two-col-section{
  max-width:1200px;
  margin:0 auto;
  padding:clamp(24px,6vw,64px) 18px;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:clamp(18px,4.5vw,46px);
  align-items:center;
}
.left-half,.right-half{min-width:0}

.right-half h2{
  margin:0 0 clamp(14px,2.6vw,22px);
  font-size:clamp(30px,3.4vw,44px);
  line-height:1.08;
}

/* Outline swap */
.img-swap{
  position:relative;
  width:min(520px,92%);
  margin:0 auto;
  cursor:pointer;
  border-radius:calc(var(--r) + 10px);
  overflow:hidden;
  box-shadow:none;
}

.img-swap img{
  display:block;
  width:100%;
  height:auto;
  border-radius:calc(var(--r) + 10px);
  box-shadow:none;
}

.img-swap .swap-base,
.img-swap .swap-overlay{
  width:100%;
  height:auto;
  max-height:min(720px,70vh);
  object-fit:contain;
}

.img-swap .swap-overlay{
  position:absolute;
  inset:0;
  opacity:0;
  transition:opacity .45s ease;
  pointer-events:none;
}

.img-swap:hover .swap-overlay,
.img-swap.is-alt .swap-overlay{
  opacity:1;
}

.img-swap:active .swap-overlay{
  opacity:1;
}

.img-swap:focus-visible{
  outline:3px solid var(--focus);
  outline-offset:6px;
}

/* Countdown (estilo como antes, sem caixas) */
.countdown-wrapper{
  margin-top:clamp(10px,2vw,14px);
}
.countdown-wrapper--clean{
  background:transparent;
  border:0;
  box-shadow:none;
  padding:0;
  max-width:640px;
}

.countdown-label-top{
  margin:0 0 10px;
  font-size:14px;
  color:var(--muted);
}

.countdown-row{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:clamp(12px,2.4vw,22px);
  align-items:end;
  margin:6px 0 10px;
}

.cd-item{
  text-align:center;
  padding:0;
  background:transparent;
  border:0;
  border-radius:0;
}

.cd-value{
  display:block;
  font-family:"Against",system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
  font-weight:400;
  font-size:clamp(44px,4.8vw,66px);
  line-height:1;
  color:var(--ink);
}

.cd-unit{
  display:block;
  margin-top:8px;
  font-size:13px;
  color:var(--muted-2);
}

.countdown-extra{
  margin:10px 0 0;
  color:var(--muted);
  font-size:15px;
  line-height:1.35;
  max-width:54ch;
}

.form-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  margin-top:clamp(14px,2.4vw,22px);
  padding:14px 26px;
  border-radius:999px;
  background:var(--btn);
  border:1px solid rgba(255,255,255,.25);
  box-shadow:0 10px 22px rgba(0,0,0,.10);
  font-weight:650;
  transition:transform .18s ease, box-shadow .18s ease, filter .18s ease;
}
.form-btn:hover{box-shadow:0 14px 28px rgba(0,0,0,.14)}

/* Detalhes */
.details-section{
  max-width:1200px;
  margin:0 auto;
  padding:clamp(20px,5vw,56px) 18px;
}

.details-inner{
  display:grid;
  grid-template-columns:1fr 1.25fr;
  gap:clamp(18px,4vw,44px);
  align-items:start;
}

.details-title{
  margin:0 0 14px;
  font-size:clamp(28px,3.1vw,40px);
}

.details-list{
  list-style:none;
  padding:0;
  margin:0;
  display:grid;
  gap:10px;
}

.details-list li{
  display:flex;
  align-items:flex-start;
  gap:12px;
  color:var(--ink);
}

.details-icon{
  width:26px;
  flex:0 0 26px;
  display:flex;
  justify-content:center;
  margin-top:2px;
}

.details-text-line{
  color:var(--ink);
  font-size:16px;
  line-height:1.35;
}

.details-local-trigger{
  padding:0;
  border:0;
  background:transparent;
  text-align:left;
  cursor:pointer;
}

.map-frame-wrap{
  border-radius:22px;
  overflow:hidden;
  border:1px solid var(--border);
  box-shadow:0 12px 26px rgba(0,0,0,.10);
  background:rgba(255,255,255,.25);
}

.map-frame-wrap iframe{
  width:100%;
  height:min(420px,56vw);
  border:0;
  display:block;
}

.details-links{
  grid-column:1 / -1;
  display:flex;
  justify-content:center;
  gap:16px;
  margin-top:clamp(18px,4vw,30px);
}

.details-link{
  width:58px;
  height:58px;
  border-radius:16px;
  display:grid;
  place-items:center;
  background:transparent;
  border:0;
  box-shadow:none;
  transition:transform .18s ease, filter .18s ease;
}

.details-link:hover{
  transform:translateY(-1px);
}

.details-link-img{
  width:54px;
  height:54px;
  object-fit:contain;
  background:transparent;
}

/* Quinta */
.quinta-section{
  max-width:1200px;
  margin:0 auto;
  padding:clamp(20px,5vw,56px) 18px;
}

.quinta-header{
  text-align:center;
  margin-bottom:clamp(16px,3vw,26px);
}

.quinta-title{
  margin:0;
  font-size:clamp(28px,3.1vw,40px);
}

.quinta-subtitle{
  margin:10px auto 0;
  max-width:68ch;
  color:var(--muted);
}

.quinta-grid{
  display:grid;
  grid-template-columns:repeat(12,1fr);
  gap:12px;
}

.quinta-grid-item{
  border:0;
  padding:0;
  background:transparent;
  cursor:pointer;
  border-radius:22px;
  overflow:hidden;
  box-shadow:0 12px 26px rgba(0,0,0,.12);
  border:1px solid rgba(255,255,255,.22);
}

.quinta-grid-item img{
  width:100%;
  height:100%;
  object-fit:cover;
  transition:transform .55s ease;
}

.quinta-grid-item:hover img{
  transform:scale(1.04);
}

.quinta-grid-item:nth-child(1){grid-column:1 / span 7; grid-row:1 / span 2; min-height:320px}
.quinta-grid-item:nth-child(2){grid-column:8 / span 5; min-height:154px}
.quinta-grid-item:nth-child(3){grid-column:8 / span 5; min-height:154px}
.quinta-grid-item:nth-child(4){grid-column:1 / span 6; min-height:200px}
.quinta-grid-item:nth-child(5){grid-column:7 / span 6; min-height:200px}

.quinta-modal{
  position:fixed;
  inset:0;
  display:none;
  place-items:center;
  background:rgba(0,0,0,.55);
  padding:18px;
  z-index:50;
}

.quinta-modal.is-open{display:grid}
.quinta-modal-inner{
  width:min(980px,96vw);
  max-height:88vh;
  border-radius:24px;
  background:rgba(255,255,255,.88);
  border:1px solid rgba(255,255,255,.40);
  box-shadow:0 22px 70px rgba(0,0,0,.28);
  padding:14px;
  position:relative;
}

.quinta-modal-close{
  position:absolute;
  top:12px;
  right:12px;
  width:40px;
  height:40px;
  border-radius:999px;
  border:1px solid rgba(146,170,151,.30);
  background:rgba(255,255,255,.85);
  cursor:pointer;
  color:var(--ink);
}

.quinta-modal-img{
  width:100%;
  height:auto;
  max-height:78vh;
  object-fit:contain;
  border-radius:18px;
}

/* Acomodação */
.accommodation-section{
  max-width:1200px;
  margin:0 auto;
  padding:clamp(20px,5vw,56px) 18px;
}

.acc-header{
  text-align:center;
  margin-bottom:clamp(14px,3vw,22px);
}

.acc-title{
  margin:0;
  font-size:clamp(28px,3.1vw,40px);
}

.acc-subtitle{
  margin:10px auto 0;
  max-width:70ch;
  color:var(--muted);
}

.acc-carousel-wrap{
  position:relative;
  margin-top:clamp(14px,3vw,18px);
}

.acc-viewport{
  overflow:hidden;
  border-radius:26px;
  border:1px solid rgba(255,255,255,.22);
  box-shadow:0 14px 36px rgba(0,0,0,.16);
  background:rgba(255,255,255,.18);
}

.acc-carousel{
  display:flex;
  width:100%;
  transform:translateX(0);
  transition:transform .55s ease;
  will-change:transform;
}

.acc-slide{
  min-width:100%;
  flex:0 0 100%;
}

.acc-img-link{
  display:block;
}

.acc-img-wrapper{
  position:relative;
  aspect-ratio:16/9;
  width:100%;
  background:rgba(255,255,255,.18);
}

.acc-img-wrapper img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

.acc-title-overlay{
  position:absolute;
  left:16px;
  right:16px;
  bottom:14px;
  padding:12px 14px;
  border-radius:999px;
  background:rgba(146,170,151,.34);
  border:1px solid rgba(255,255,255,.18);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  color:#ffffff;
  text-align:center;
  font-weight:650;
}

.acc-capacity-badge{
  position:absolute;
  top:14px;
  left:14px;
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:7px 12px;
  border-radius:999px;
  background:rgba(146,170,151,.34);
  border:1px solid rgba(255,255,255,.18);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  color:#ffffff;
  font-weight:650;
  font-size:13px;
}

.acc-capacity-icon{
  width:18px;
  height:18px;
  display:grid;
  place-items:center;
}

.acc-capacity-icon-img{
  width:18px;
  height:18px;
  object-fit:contain;
  filter:brightness(0) invert(1);
}

.acc-arrow{
  position:absolute;
  top:50%;
  transform:translateY(-50%);
  width:52px;
  height:52px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.24);
  background:rgba(146,170,151,.36);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  color:#ffffff;
  cursor:pointer;
  display:grid;
  place-items:center;
  box-shadow:0 12px 26px rgba(0,0,0,.14);
  transition:transform .18s ease, filter .18s ease;
  z-index:3;
}

.acc-arrow-left{left:14px}
.acc-arrow-right{right:14px}
.acc-arrow:hover{filter:brightness(1.02)}
.acc-arrow:active{transform:translateY(-50%) scale(.98)}

/* UGC */
.ugc-section{
  max-width:1200px;
  margin:0 auto;
  padding:clamp(20px,5vw,56px) 18px clamp(36px,7vw,86px);
}

.ugc-hero{
  text-align:center;
  margin-bottom:clamp(14px,3vw,22px);
}

.ugc-title{
  margin:0;
  font-size:clamp(30px,3.2vw,42px);
}

.ugc-subtitle{
  margin:10px auto 0;
  max-width:70ch;
  color:var(--muted);
}

.ugc-btn{
  margin-top:clamp(14px,3vw,22px);
  padding:12px 22px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.25);
  background:var(--btn);
  cursor:pointer;
  font-weight:650;
  box-shadow:0 12px 26px rgba(0,0,0,.10);
  transition:transform .18s ease, box-shadow .18s ease, filter .18s ease;
}

.ugc-topbar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:14px;
  margin:clamp(12px,3vw,18px) 0 12px;
}

.ugc-results{
  color:var(--muted);
  font-size:14px;
}

.ugc-sort-btn{
  border:1px solid rgba(146,170,151,.28);
  background:rgba(255,255,255,.55);
  color:var(--ink);
  padding:10px 12px;
  border-radius:999px;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap:10px;
}

.ugc-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:12px;
}

.ugc-card{
  border-radius:18px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.22);
  background:rgba(255,255,255,.42);
  box-shadow:0 10px 22px rgba(0,0,0,.10);
}

.ugc-card-btn{
  width:100%;
  border:0;
  background:transparent;
  padding:0;
  cursor:pointer;
  text-align:left;
}

.ugc-card-img{
  width:100%;
  height:220px;
  object-fit:cover;
}

.ugc-card-title{
  display:block;
  padding:10px 12px 12px;
  color:var(--muted);
  font-size:14px;
}

/* Modal UGC */
.ugc-modal{
  position:fixed;
  inset:0;
  display:none;
  place-items:center;
  background:rgba(0,0,0,.55);
  padding:16px;
  z-index:70;
}
.ugc-modal.is-open{display:grid}

.ugc-modal-inner{
  width:min(860px,96vw);
  border-radius:26px;
  background:rgba(255,255,255,.90);
  border:1px solid rgba(255,255,255,.40);
  box-shadow:0 22px 70px rgba(0,0,0,.28);
  padding:16px 16px 14px;
  position:relative;
}

.ugc-modal-close{
  position:absolute;
  top:12px;
  right:12px;
  width:40px;
  height:40px;
  border-radius:999px;
  border:1px solid rgba(146,170,151,.30);
  background:rgba(255,255,255,.85);
  cursor:pointer;
  color:var(--ink);
}

.ugc-modal-title{
  margin:6px 0 12px;
  font-size:22px;
  text-align:center;
}

.ugc-steps{
  display:flex;
  justify-content:center;
  gap:18px;
  margin:8px 0 14px;
  color:var(--muted);
}

.ugc-step{
  display:flex;
  align-items:center;
  gap:10px;
  font-size:13px;
  letter-spacing:.08em;
}

.ugc-step span{
  width:26px;
  height:26px;
  border-radius:999px;
  display:grid;
  place-items:center;
  border:1px solid rgba(146,170,151,.34);
  background:rgba(255,255,255,.55);
  color:var(--ink);
  font-weight:700;
}

.ugc-step.is-active span{
  background:rgba(146,170,151,.26);
  border-color:rgba(146,170,151,.40);
}

.ugc-step-panels{
  width:100%;
}

.ugc-panel{
  display:none;
}

.ugc-panel.is-active{
  display:block;
}

.ugc-drop{
  border:2px dashed rgba(146,170,151,.46);
  border-radius:22px;
  padding:18px;
  position:relative;
  background:rgba(255,255,255,.55);
}

.ugc-file{
  position:absolute;
  inset:0;
  opacity:0;
  cursor:pointer;
}

.ugc-drop-ui{
  min-height:170px;
  display:grid;
  place-items:center;
  text-align:center;
  color:var(--muted);
  gap:10px;
  padding:10px;
}

.ugc-drop-icon{
  font-size:34px;
  opacity:.85;
}

.ugc-preview{
  margin-top:14px;
}

.ugc-preview-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:10px;
}

.ugc-preview-item{
  border-radius:16px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.22);
  background:rgba(255,255,255,.40);
  box-shadow:0 10px 22px rgba(0,0,0,.10);
}

.ugc-preview-item img{
  width:100%;
  height:140px;
  object-fit:cover;
}

.ugc-form{
  display:grid;
  gap:10px;
  max-width:520px;
  margin:0 auto;
}

.ugc-label{
  font-size:13px;
  color:var(--muted);
}

.ugc-input{
  width:100%;
  padding:12px 14px;
  border-radius:14px;
  border:1px solid rgba(146,170,151,.28);
  background:rgba(255,255,255,.70);
  color:var(--ink);
}

.ugc-submit{
  margin-top:6px;
  padding:12px 18px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.25);
  background:var(--btn);
  cursor:pointer;
  font-weight:700;
  box-shadow:0 12px 26px rgba(0,0,0,.10);
  transition:transform .18s ease, box-shadow .18s ease, filter .18s ease;
}

.ugc-status{
  margin-top:12px;
  text-align:center;
  color:var(--muted);
  min-height:22px;
}

.ugc-actions{
  margin-top:12px;
  display:flex;
  justify-content:center;
  gap:10px;
}

.ugc-nav{
  width:44px;
  height:44px;
  border-radius:14px;
  border:1px solid rgba(146,170,151,.28);
  background:rgba(255,255,255,.70);
  color:var(--ink);
  cursor:pointer;
  display:grid;
  place-items:center;
}

.ugc-nav:disabled{
  opacity:.45;
  cursor:not-allowed;
}

/* Reveal simples */
.reveal-on{opacity:1}
.reveal-item{opacity:1}

/* Responsivo */
@media (max-width: 980px){
  .two-col-section{
    grid-template-columns:1fr;
    gap:26px;
  }

  .img-swap{
    width:min(520px,92vw);
  }

  .details-inner{
    grid-template-columns:1fr;
  }

  .ugc-grid{
    grid-template-columns:repeat(3,minmax(0,1fr));
  }

  .ugc-preview-grid{
    grid-template-columns:repeat(3,minmax(0,1fr));
  }
}

@media (max-width: 720px){
  .banner-logo--sm{
    width:min(260px,70vw);
  }

  .countdown-row{
    grid-template-columns:repeat(2,minmax(0,1fr));
    row-gap:18px;
  }

  .details-links{
    gap:12px;
  }

  .details-link{
    width:54px;
    height:54px;
    border-radius:16px;
  }

  .details-link-img{
    width:52px;
    height:52px;
  }

  .ugc-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }

  .ugc-preview-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }

  .acc-img-wrapper{
    aspect-ratio:4/3;
  }

  .acc-title-overlay{
    left:12px;
    right:12px;
    bottom:12px;
  }

  .acc-arrow{
    width:46px;
    height:46px;
  }
}

@media (max-width: 420px){
  .ugc-modal-inner{
    padding:14px 12px 12px;
  }

  .ugc-drop-ui{
    min-height:150px;
  }

  .ugc-card-img{
    height:190px;
  }
}
