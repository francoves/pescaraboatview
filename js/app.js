/* =========================================================
   Trabocchi Boat — app
   ========================================================= */

/* 🔧 MODIFICA QUI — i tuoi contatti.
   WHATSAPP: numero in formato internazionale, solo cifre (es. 39 333 1234567 -> "393331234567"). */
const CONFIG = {
  whatsapp: "390000000000",          // <-- inserisci il tuo numero WhatsApp
  email:    "info@trabocchiboat.it"  // <-- inserisci la tua email
};

/* ---------- i18n ---------- */
const DICT = window.I18N || {};
const SUPPORTED = ["it","en","ru"];

function detectLang(){
  const saved = localStorage.getItem("tb_lang");
  if (saved && SUPPORTED.includes(saved)) return saved;
  const nav = (navigator.language || "it").slice(0,2).toLowerCase();
  return SUPPORTED.includes(nav) ? nav : "it";
}

let lang = detectLang();

function waLink(l){
  const msg = (DICT[l] && DICT[l]["wa.msg"]) || "";
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}

function applyLang(l){
  lang = l;
  localStorage.setItem("tb_lang", l);
  document.documentElement.lang = l;
  const t = DICT[l] || {};

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if (t[key] != null) el.innerHTML = t[key];
  });

  // active state on buttons
  document.querySelectorAll("#lang button").forEach(b=>{
    b.classList.toggle("is-active", b.dataset.lang === l);
  });

  // whatsapp + mail links
  const wa = waLink(l);
  ["navWa","heroWa","bigWa","waFloat","depWa"].forEach(id=>{
    const el = document.getElementById(id);
    if (el) el.href = wa;
  });
  document.querySelectorAll(".card-cta .btn, .btn-wa").forEach(el=>{
    if (el.tagName === "A") el.href = wa;
  });
  const mail = document.getElementById("mailLink");
  if (mail){
    const subj = encodeURIComponent("Trabocchi Boat — richiesta info");
    mail.href = `mailto:${CONFIG.email}?subject=${subj}`;
    if (t["ct.mail"]) mail.textContent = t["ct.mail"];
  }
}

/* ---------- language buttons ---------- */
document.getElementById("lang").addEventListener("click", e=>{
  const b = e.target.closest("button");
  if (b) applyLang(b.dataset.lang);
});

/* ---------- nav scroll ---------- */
const nav = document.getElementById("nav");
const onScroll = ()=> nav.classList.toggle("scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, {passive:true});

/* ---------- burger / mobile menu ---------- */
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.addEventListener("click", ()=>{
  burger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=>{
  burger.classList.remove("open");
  navLinks.classList.remove("open");
}));

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
  });
}, {threshold:0.12, rootMargin:"0px 0px -8% 0px"});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

/* ---------- init ---------- */
applyLang(lang);

/* fix anchor links that we hijacked as WhatsApp targets:
   contact CTA + float should open WhatsApp, not jump to #contatti when already wired */
