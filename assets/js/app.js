/* =========================================================
   Brico Dab Zarzis — application boutique (SPA vanilla JS)
   ========================================================= */
(function () {
  "use strict";

  const S = window.STORE, CATS = window.CATEGORIES, PRODUCTS = window.PRODUCTS, BRANDS = window.BRANDS;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const app = $("#app");

  /* ---------------- Icons ---------------- */
  const P = {
    drill: '<path d="M3 7h11v6H3z"/><path d="M14 8.5h4v3h-4"/><path d="M18 10h3"/><path d="M6 13l-1.5 7h4.5l1.5-7"/><path d="M6 10h3"/>',
    hammer: '<path d="M14 4l6 6-2 2-6-6z"/><path d="M12 6l-2 2 2 2 2-2"/><path d="M11 9l-8 8a1.4 1.4 0 0 0 2 2l8-8"/>',
    bolt: '<path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z"/><circle cx="12" cy="11" r="3"/>',
    faucet: '<path d="M4 9h9a4 4 0 0 1 4 4v2"/><path d="M4 6v6"/><path d="M8 9V5h3"/><path d="M6.5 5h6"/><path d="M17 18.5c0 1-.7 2-1.5 2s-1.5-1-1.5-2 1.5-3 1.5-3 1.5 2 1.5 3z"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    roller: '<rect x="3" y="3" width="15" height="6" rx="1.5"/><path d="M18 6h2.5v5H11v3"/><rect x="9.5" y="14" width="3" height="7" rx="1"/>',
    brick: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9.3h18M3 14.6h18M9 4v5.3M15 9.3v5.3M9 14.6V20"/>',
    disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
    leaf: '<path d="M5 20c0-9 6-15 15-15 0 9-6 15-15 15z"/><path d="M5 20l8-8"/>',
    helmet: '<path d="M3 17h18"/><path d="M4.5 17a7.5 7.5 0 0 1 15 0"/><path d="M10 9.7V6h4v3.7"/><path d="M2.5 17v2h19v-2"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    ladder: '<path d="M7 2l-3 20M17 2l3 20"/><path d="M6.4 6.5h11.2M5.8 11h12.4M5.2 15.5h13.6M4.6 20h14.8"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.3a1 1 0 0 0 1 .7h9.6a1 1 0 0 0 1-.8L21 7H6"/>',
    heart: '<path d="M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    truck: '<path d="M2 6h12v10H2z"/><path d="M14 9h4l4 4v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
    headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/><path d="M20 19a3 3 0 0 1-3 3h-3"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.8-3.5M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.8 3.5M20 20v-4h-4"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    up: '<path d="M5 15l7-7 7 7"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    filter: '<path d="M3 5h18l-7 8.5V19l-4 2v-7.5z"/>',
    box: '<path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>'
  };
  const FB = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.5V14h2.7v8z"/></svg>';
  const IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>';
  const WA = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z"/></svg>';
  const icon = (n, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.box}</svg>`;

  /* ---------------- Logo ---------------- */
  const LOGO = (dark = false) => `
    <svg viewBox="0 0 250 84" role="img" aria-label="Brico Dab Zarzis">
      <path d="M32 26 L66 6 L100 26" fill="none" stroke="#f5c518" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M86 18 V8 h8 v14" fill="none" stroke="${dark ? "#fff" : "#151515"}" stroke-width="4"/>
      <rect x="61" y="17" width="4" height="4" fill="#f5c518"/><rect x="67" y="17" width="4" height="4" fill="#f5c518"/>
      <rect x="61" y="23" width="4" height="4" fill="#f5c518"/><rect x="67" y="23" width="4" height="4" fill="#f5c518"/>
      <text x="2" y="60" font-family="Montserrat, Poppins, sans-serif" font-weight="800" font-size="36" fill="${dark ? "#fff" : "#151515"}" letter-spacing="-.5">BRICO</text>
      <text x="130" y="60" font-family="Montserrat, Poppins, sans-serif" font-weight="800" font-size="36" fill="#f5c518" letter-spacing="-.5">DAB</text>
      <line x1="4" y1="75" x2="78" y2="75" stroke="#f5c518" stroke-width="2.5"/>
      <line x1="170" y1="75" x2="212" y2="75" stroke="#f5c518" stroke-width="2.5"/>
      <text x="124" y="80" text-anchor="middle" font-family="Montserrat, Poppins, sans-serif" font-weight="700" font-size="14" letter-spacing="4" fill="${dark ? "#fff" : "#151515"}">ZARZIS</text>
    </svg>`;

  /* ---------------- Helpers ---------------- */
  const money = (n) => n.toFixed(3).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DT";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const catBy = (slug) => CATS.find((c) => c.slug === slug);
  const prodBy = (id) => PRODUCTS.find((p) => p.id === Number(id));
  const discount = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);
  const stars = (r, n) => `<span class="stars">${"★".repeat(r)}${"☆".repeat(5 - r)}${n != null ? `<em>(${n})</em>` : ""}</span>`;
  const ref = (p) => "BD-" + String(p.id).padStart(5, "0");
  const store = {
    get(k, d) { try { const v = localStorage.getItem("bricodab_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("bricodab_" + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };

  // Illustration générée pour les produits sans photo
  const TINTS = ["#fff6d1", "#f1f1f3", "#fdf0c4", "#ececef"];
  function productVisual(p) {
    if (p.img) return `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy">`;
    const c = catBy(p.cat);
    const bg = TINTS[p.id % TINTS.length];
    return `<svg viewBox="0 0 300 300" role="img" aria-label="${esc(p.name)}">
      <rect width="300" height="300" fill="${bg}"/>
      <circle cx="150" cy="138" r="92" fill="#fff"/>
      <path d="M0 300 L0 250 Q150 215 300 250 L300 300z" fill="#f5c518" opacity=".9"/>
      <g transform="translate(90 78) scale(5)" fill="none" stroke="#2b2d31" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${P[c ? c.icon : "box"]}</g>
      <text x="150" y="283" text-anchor="middle" font-family="Montserrat, Poppins, sans-serif" font-weight="800" font-size="20" fill="#151515" letter-spacing="1">${esc(p.brand.toUpperCase())}</text>
    </svg>`;
  }

  /* ---------------- State ---------------- */
  let cart = store.get("cart", []);        // [{id, qty}]
  let wish = store.get("wish", []);        // [id]
  const saveCart = () => { store.set("cart", cart); updateBadges(); renderMiniCart(); };
  const saveWish = () => { store.set("wish", wish); updateBadges(); };
  const cartItems = () => cart.map((l) => ({ ...l, p: prodBy(l.id) })).filter((l) => l.p);
  const cartTotal = () => cartItems().reduce((s, l) => s + l.p.price * l.qty, 0);
  const cartCount = () => cart.reduce((s, l) => s + l.qty, 0);
  const shipping = (t) => (t === 0 || t >= S.freeShippingFrom ? 0 : S.shippingFee);

  function addToCart(id, qty = 1) {
    const p = prodBy(id); if (!p) return;
    const l = cart.find((x) => x.id === p.id);
    if (l) l.qty += qty; else cart.push({ id: p.id, qty });
    saveCart();
    toast(`« ${p.name} » ajouté au panier`);
  }
  function setQty(id, qty) {
    id = Number(id);
    if (qty <= 0) cart = cart.filter((l) => l.id !== id);
    else { const l = cart.find((x) => x.id === id); if (l) l.qty = Math.min(qty, 99); }
    saveCart();
  }
  function toggleWish(id) {
    id = Number(id);
    const on = wish.includes(id);
    wish = on ? wish.filter((x) => x !== id) : [...wish, id];
    saveWish();
    toast(on ? "Retiré des favoris" : "Ajouté aux favoris", "heart");
    $$(`[data-wish="${id}"]`).forEach((b) => b.classList.toggle("on", !on));
  }
  function updateBadges() {
    $$("[data-cart-count]").forEach((e) => (e.textContent = cartCount()));
    $$("[data-wish-count]").forEach((e) => (e.textContent = wish.length));
    $$("[data-cart-total]").forEach((e) => (e.textContent = money(cartTotal())));
  }

  let toastT;
  function toast(msg, ic = "check") {
    const t = $("#toast");
    t.innerHTML = icon(ic) + `<span>${esc(msg)}</span>`;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------------- Drawers ---------------- */
  function openDrawer(id) {
    closeDrawers();
    $("#" + id).classList.add("open");
    $("#overlay").classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeDrawers() {
    $$(".drawer.open, .filters.open").forEach((d) => d.classList.remove("open"));
    $("#overlay").classList.remove("show");
    document.body.style.overflow = "";
  }

  function renderMiniCart() {
    const items = cartItems();
    $("#mini-cart-body").innerHTML = items.length
      ? items.map((l) => `
        <div class="mini-line">
          <a href="#/produit/${l.p.id}" class="thumb">${productVisual(l.p)}</a>
          <div><a href="#/produit/${l.p.id}" class="ml-name">${esc(l.p.name)}</a>
          <div class="ml-meta">${l.qty} × <b>${money(l.p.price)}</b></div></div>
          <button class="rm" data-rm="${l.p.id}" aria-label="Retirer">${icon("trash")}</button>
        </div>`).join("")
      : `<div class="empty" style="margin-top:20px">${icon("cart")}<p>Votre panier est vide.</p></div>`;
    $("#mini-cart-foot").classList.toggle("hidden", !items.length);
  }

  /* ---------------- Shared blocks ---------------- */
  function card(p) {
    const d = discount(p);
    const out = p.stock === 0;
    return `
    <article class="p-card">
      <a class="p-img" href="#/produit/${p.id}">
        ${productVisual(p)}
        <div class="badges">
          ${d ? `<span class="badge badge-sale">-${d}%</span>` : ""}
          ${p.tags.includes("new") ? `<span class="badge badge-new">Nouveau</span>` : ""}
          ${out ? `<span class="badge badge-out">Rupture</span>` : ""}
        </div>
      </a>
      <div class="p-quick">
        <button data-wish="${p.id}" class="${wish.includes(p.id) ? "on" : ""}" aria-label="Favoris">${icon("heart")}</button>
        <a href="#/produit/${p.id}" aria-label="Voir le produit">${icon("eye")}</a>
      </div>
      <div class="p-body">
        <span class="p-brand">${esc(p.brand)}</span>
        <a class="p-name" href="#/produit/${p.id}" title="${esc(p.name)}">${esc(p.name)}</a>
        ${stars(p.rating, p.reviews)}
        <div class="p-price"><span class="price">${money(p.price)}</span>${p.old ? `<span class="old-price">${money(p.old)}</span>` : ""}</div>
        <button class="btn btn-yellow btn-sm btn-block add" data-add="${p.id}" ${out ? "disabled" : ""}>${icon("cart")} Ajouter au panier</button>
      </div>
    </article>`;
  }
  const grid = (list, cls = "") => list.length
    ? `<div class="p-grid ${cls}">${list.map(card).join("")}</div>`
    : `<div class="empty">${icon("search")}<p>Aucun produit trouvé.</p><a class="btn btn-yellow" href="#/boutique">Voir tous les produits</a></div>`;
  const crumbs = (...parts) => `<nav class="breadcrumb"><a href="#/">Accueil</a>${parts.filter(Boolean).map((p) => `<span>/</span>${p.href ? `<a href="${p.href}">${esc(p.label)}</a>` : `<b>${esc(p.label)}</b>`}`).join("")}</nav>`;
  const byTag = (t) => PRODUCTS.filter((p) => p.tags.includes(t));

  /* ---------------- Views ---------------- */
  function viewHome() {
    const slides = [
      { cls: "", kicker: "Qualité allemande", title: `Ciment colle <span>Deutsch Color</span>`, text: "FM 1000 · FM 2200 · FM 3000 — la qualité allemande, enfin à Zarzis ! Idéal pour le carrelage et le bâtiment.", img: "assets/img/promo-ciment-colle.jpg", link: "#/categorie/materiaux-construction", cta: "Découvrir" },
      { cls: "s-yellow", kicker: "Vente flash", title: `Boudin <span>bas de porte</span>`, text: "Stop aux courants d'air, à la poussière et aux nuisibles. Installé en 30 secondes !", img: "assets/img/promo-boudin.jpg", link: "#/produit/201", cta: "J'en profite" },
      { cls: "", kicker: "Outillage pro", title: `Makita · Ingco · <span>Total</span>`, text: "Perceuses, meuleuses, visseuses et coffrets : l'outillage professionnel au meilleur prix.", ic: "drill", link: "#/categorie/outillage-electroportatif", cta: "Voir l'outillage" }
    ];
    const cats = CATS.map((c) => ({ ...c, n: PRODUCTS.filter((p) => p.cat === c.slug).length }));
    return `
    <div class="container">
      <section class="hero">
        <aside class="hero-side-cats">
          ${cats.slice(0, 10).map((c) => `<a href="#/categorie/${c.slug}"><span class="ci">${icon(c.icon)}</span>${esc(c.name)}</a>`).join("")}
          <a href="#/boutique"><span class="ci">${icon("grid")}</span><b>Toutes les catégories</b></a>
        </aside>
        <div class="slider" id="slider">
          ${slides.map((s, i) => `
            <div class="slide ${s.cls} ${i === 0 ? "active" : ""}">
              <div class="s-text">
                <span class="s-kicker">${s.kicker}</span>
                <h2>${s.title}</h2>
                <p>${s.text}</p>
                <a class="btn ${s.cls ? "btn-dark" : "btn-yellow"}" href="${s.link}">${s.cta} ${icon("right")}</a>
              </div>
              ${s.img ? `<div class="s-img"><img src="${s.img}" alt=""></div>` : `<div class="s-big-ic">${icon(s.ic)}</div>`}
            </div>`).join("")}
          <button class="slider-arrow prev" data-slide="-1" aria-label="Précédent">${icon("left")}</button>
          <button class="slider-arrow next" data-slide="1" aria-label="Suivant">${icon("right")}</button>
          <div class="slider-dots">${slides.map((_, i) => `<button class="${i === 0 ? "active" : ""}" data-dot="${i}" aria-label="Diapo ${i + 1}"></button>`).join("")}</div>
        </div>
        <div class="hero-banners">
          <a class="mini-banner" href="#/produit/201"><img src="assets/img/promo-boudin.jpg" alt="Boudin bas de porte"><div class="mb-label"><strong>Boudin bas de porte</strong><span>Vente flash · -25%</span></div></a>
          <a class="mini-banner" href="#/categorie/materiaux-construction"><img src="assets/img/promo-ciment-colle.jpg" alt="Ciment colle Deutsch Color"><div class="mb-label"><strong>Ciment Colle Deutsch Color</strong><span>À partir de ${money(32)}</span></div></a>
        </div>
      </section>

      ${reassure()}

      <section class="section">
        <div class="sec-head"><h2>Nos catégories</h2><a class="more" href="#/boutique">Tout voir →</a></div>
        <div class="cat-grid">
          ${cats.map((c) => `<a class="cat-tile" href="#/categorie/${c.slug}"><div class="ct-ic">${icon(c.icon)}</div><strong>${esc(c.name)}</strong><span>${c.n} produit${c.n > 1 ? "s" : ""}</span></a>`).join("")}
        </div>
      </section>

      <section class="section" id="tabbed">
        <div class="sec-head">
          <h2>Nos produits</h2>
          <div class="tabs">
            <button class="active" data-tab="promo">Promotions</button>
            <button data-tab="best">Meilleures ventes</button>
            <button data-tab="new">Nouveautés</button>
          </div>
        </div>
        <div id="tab-body">${grid(byTag("promo").slice(0, 10))}</div>
      </section>

      <section class="section promo-row">
        <a class="promo-banner yellow" href="#/categorie/materiaux-construction">
          <div class="pb-text">
            <h3>La qualité allemande <span>à Zarzis !</span></h3>
            <p class="ar">الجودة الألمانية توّا في جرجيس</p>
            <p>Ciment colle Deutsch Color FM 1000, FM 2200 et FM 3000.</p>
            <span class="btn btn-dark btn-sm pb-cta">Commander</span>
          </div>
          <img src="assets/img/promo-ciment-colle.jpg" alt="Deutsch Color" loading="lazy">
        </a>
        <a class="promo-banner" href="#/produit/201">
          <div class="pb-text">
            <h3>Vente <span>flash</span></h3>
            <p>Boudin bas de porte : stop nuisibles, poussière et courants d'air.</p>
            <div class="p-price"><span class="price" style="color:#f5c518">${money(14.9)}</span><span class="old-price">${money(19.9)}</span></div>
            <span class="btn btn-yellow btn-sm pb-cta">J'en profite</span>
          </div>
          <img src="assets/img/promo-boudin.jpg" alt="Boudin bas de porte" loading="lazy">
        </a>
      </section>

      ${["outillage-electroportatif", "materiaux-construction", "outillage-a-main"].map((slug) => {
        const c = catBy(slug);
        return `<section class="section">
          <div class="sec-head"><h2>${esc(c.name)}</h2><a class="more" href="#/categorie/${slug}">Voir tout →</a></div>
          ${grid(PRODUCTS.filter((p) => p.cat === slug).slice(0, 5))}
        </section>`;
      }).join("")}

      <section class="section">
        <div class="sec-head"><h2>Nos marques</h2></div>
        <div class="brands">${BRANDS.slice(0, 8).map((b) => `<a class="brand" href="#/boutique?marque=${encodeURIComponent(b)}">${esc(b.toUpperCase())}</a>`).join("")}</div>
      </section>

      <section class="section">${storeBlock()}</section>
    </div>`;
  }

  const reassure = () => `
    <section class="reassure">
      <div><span class="ic">${icon("truck")}</span><div><strong>Livraison rapide</strong><span>Partout en Tunisie en 24 – 72h</span></div></div>
      <div><span class="ic">${icon("cash")}</span><div><strong>Paiement à la livraison</strong><span>Payez en espèces à la réception</span></div></div>
      <div><span class="ic">${icon("headset")}</span><div><strong>Service client</strong><span>Conseils au ${S.phone}</span></div></div>
      <div><span class="ic">${icon("shield")}</span><div><strong>Qualité garantie</strong><span>Produits et marques de confiance</span></div></div>
    </section>`;

  const storeBlock = () => `
    <div class="store">
      <img src="assets/img/magasin.jpg" alt="Magasin Brico Dab à Zarzis" loading="lazy">
      <div class="st-text">
        <h2>Visitez notre magasin <span>à Zarzis</span></h2>
        <div class="st-ar ar">${S.sloganAr}</div>
        <ul>
          <li>${icon("pin")}<span>${esc(S.address)}</span></li>
          <li>${icon("phone")}<span>${S.phone}</span></li>
          <li>${icon("clock")}<span>${esc(S.hours)}</span></li>
          <li>${icon("box")}<span>Quincaillerie, outillage, matériaux de construction, peinture, plomberie, électricité…</span></li>
        </ul>
        <div class="st-btns">
          <a class="btn btn-yellow" href="tel:+${S.phoneIntl}">${icon("phone")} Appeler</a>
          <a class="btn btn-wa" href="https://wa.me/${S.phoneIntl}" target="_blank" rel="noopener">${WA} WhatsApp</a>
          <a class="btn btn-outline" style="border-color:#fff;color:#fff" href="#/contact">Itinéraire</a>
        </div>
      </div>
    </div>`;

  function viewListing({ cat, q, title, preset, params }) {
    let base = PRODUCTS;
    if (cat) base = base.filter((p) => p.cat === cat.slug);
    if (preset) base = base.filter(preset);
    if (q) {
      const words = norm(q).split(/\s+/).filter(Boolean);
      base = base.filter((p) => { const h = norm(`${p.name} ${p.brand} ${catBy(p.cat)?.name} ${p.short}`); return words.every((w) => h.includes(w)); });
    }
    const brandsHere = [...new Set(base.map((p) => p.brand))].sort();
    const selBrands = params.get("marque") ? params.get("marque").split(",") : [];
    const min = parseFloat(params.get("min")) || 0, max = parseFloat(params.get("max")) || Infinity;
    const sort = params.get("tri") || "pertinence";
    let list = base.filter((p) => (!selBrands.length || selBrands.includes(p.brand)) && p.price >= min && p.price <= max);
    const sorters = {
      "prix-asc": (a, b) => a.price - b.price,
      "prix-desc": (a, b) => b.price - a.price,
      "nom": (a, b) => a.name.localeCompare(b.name, "fr"),
      "remise": (a, b) => discount(b) - discount(a)
    };
    if (sorters[sort]) list = [...list].sort(sorters[sort]);

    const heading = cat ? cat.name : title;
    return `
    <div class="container">
      ${crumbs(cat ? { label: "Boutique", href: "#/boutique" } : null, { label: heading })}
      <div class="page-banner"><div>
        <h1>${esc(heading)}</h1>
        <p>${esc(cat ? cat.desc : q ? `Résultats pour « ${q} »` : "Toute la quincaillerie, l'outillage et les matériaux de construction chez Brico Dab Zarzis.")}</p>
      </div></div>
      <div class="listing">
        <aside class="filters" id="filters">
          <div class="f-block f-cats"><h4>Catégories</h4>
            <a href="#/boutique" class="${!cat && !q && !preset ? "active" : ""}"><span>Tous les produits</span><em>${PRODUCTS.length}</em></a>
            ${CATS.map((c) => `<a href="#/categorie/${c.slug}" class="${cat && cat.slug === c.slug ? "active" : ""}"><span>${esc(c.name)}</span><em>${PRODUCTS.filter((p) => p.cat === c.slug).length}</em></a>`).join("")}
          </div>
          <div class="f-block"><h4>Marques</h4>
            ${brandsHere.map((b) => `<label><input type="checkbox" data-brand value="${esc(b)}" ${selBrands.includes(b) ? "checked" : ""}> ${esc(b)} <em>${base.filter((p) => p.brand === b).length}</em></label>`).join("")}
          </div>
          <div class="f-block"><h4>Prix (DT)</h4>
            <div class="price-range">
              <input type="number" min="0" placeholder="Min" id="f-min" value="${min || ""}">
              <span>–</span>
              <input type="number" min="0" placeholder="Max" id="f-max" value="${isFinite(max) ? max : ""}">
            </div>
            <button class="btn btn-dark btn-sm btn-block" style="margin-top:10px" id="f-apply">Filtrer</button>
            ${selBrands.length || min || isFinite(max) ? `<button class="btn btn-outline btn-sm btn-block" style="margin-top:8px" id="f-reset">Réinitialiser</button>` : ""}
          </div>
        </aside>
        <div>
          <div class="toolbar">
            <button class="btn btn-outline btn-sm filters-toggle" id="open-filters">${icon("filter")} Filtres</button>
            <span class="tb-count">${list.length} produit${list.length > 1 ? "s" : ""}</span>
            <label style="font-size:14px">Trier par :
              <select id="sort">
                ${[["pertinence", "Pertinence"], ["prix-asc", "Prix croissant"], ["prix-desc", "Prix décroissant"], ["nom", "Nom (A → Z)"], ["remise", "Meilleures remises"]].map(([v, l]) => `<option value="${v}" ${sort === v ? "selected" : ""}>${l}</option>`).join("")}
              </select>
            </label>
          </div>
          ${grid(list, "cols-4")}
        </div>
      </div>
    </div>`;
  }

  function viewProduct(id) {
    const p = prodBy(id);
    if (!p) return view404();
    const c = catBy(p.cat);
    const d = discount(p);
    const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 5);
    const specs = { "Référence": ref(p), "Marque": p.brand, "Catégorie": c.name, ...p.specs };
    document.title = `${p.name} | Brico Dab Zarzis`;
    return `
    <div class="container">
      ${crumbs({ label: c.name, href: `#/categorie/${c.slug}` }, { label: p.name })}
      <section class="product">
        <div class="gallery"><div class="g-main">${productVisual(p)}
          <div class="badges">${d ? `<span class="badge badge-sale">-${d}%</span>` : ""}${p.tags.includes("new") ? `<span class="badge badge-new">Nouveau</span>` : ""}</div></div></div>
        <div class="pd">
          <span class="pd-brand">${esc(p.brand)}</span>
          <h1>${esc(p.name)}</h1>
          <div>${stars(p.rating, p.reviews)} <span class="ref">· Réf. ${ref(p)}</span></div>
          <div class="p-price"><span class="price">${money(p.price)}</span>${p.old ? `<span class="old-price">${money(p.old)}</span><span class="save">Économisez ${money(p.old - p.price)}</span>` : ""}</div>
          <p class="short">${esc(p.short)}</p>
          ${p.feats && p.feats.length ? `<ul class="feats">${p.feats.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}
          <p>${p.stock === 0 ? `<span class="stock-no">● Rupture de stock</span>` : `<span class="stock-ok">● En stock — disponible au magasin de Zarzis</span>`}</p>
          <div class="buy-row">
            <div class="qty"><button data-q="-1" aria-label="Moins">−</button><input id="pd-qty" type="number" min="1" max="99" value="1" aria-label="Quantité"><button data-q="1" aria-label="Plus">+</button></div>
            <button class="btn btn-yellow" id="pd-add" data-id="${p.id}">${icon("cart")} Ajouter au panier</button>
            <button class="btn btn-outline" data-wish="${p.id}" aria-label="Favoris">${icon("heart")}</button>
          </div>
          <div class="buy-row">
            <button class="btn btn-dark" id="pd-buy" data-id="${p.id}">Acheter maintenant</button>
            <a class="btn btn-wa" target="_blank" rel="noopener" href="https://wa.me/${S.phoneIntl}?text=${encodeURIComponent(`Bonjour Brico Dab, je suis intéressé(e) par : ${p.name} (Réf. ${ref(p)}) à ${money(p.price)}.`)}">${WA} Commander sur WhatsApp</a>
          </div>
          <div class="pd-assure">
            <div>${icon("truck")}<span>Livraison 24 – 72h partout en Tunisie</span></div>
            <div>${icon("cash")}<span>Paiement à la livraison</span></div>
            <div>${icon("refresh")}<span>Échange sous 7 jours</span></div>
          </div>
        </div>
      </section>
      <section class="pd-tabs">
        <div class="tabs"><button class="active" data-ptab="desc">Description</button><button data-ptab="specs">Caractéristiques</button><button data-ptab="liv">Livraison & retours</button></div>
        <div class="tab-body" data-pbody="desc"><p>${esc(p.short)}</p>${p.feats ? `<ul>${p.feats.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}<p>Disponible chez <b>Brico Dab Zarzis</b> — ${esc(S.slogan)}</p></div>
        <div class="tab-body hidden" data-pbody="specs"><table class="spec-table">${Object.entries(specs).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table></div>
        <div class="tab-body hidden" data-pbody="liv"><p>Livraison partout en Tunisie en 24 à 72h. Livraison gratuite dès ${money(S.freeShippingFrom)} d'achat, sinon ${money(S.shippingFee)}. Retrait gratuit au magasin de Zarzis. Paiement en espèces à la livraison. Échange possible sous 7 jours (produit non utilisé, dans son emballage d'origine).</p></div>
      </section>
      ${related.length ? `<section class="section"><div class="sec-head"><h2>Produits similaires</h2></div>${grid(related)}</section>` : ""}
    </div>`;
  }

  function viewCart() {
    const items = cartItems();
    if (!items.length) return `<div class="container">${crumbs({ label: "Panier" })}<div class="empty" style="margin-bottom:48px">${icon("cart")}<h3>Votre panier est vide</h3><p>Découvrez nos produits et profitez de nos promotions.</p><a class="btn btn-yellow" href="#/boutique">Continuer mes achats</a></div></div>`;
    const t = cartTotal();
    return `
    <div class="container">
      ${crumbs({ label: "Panier" })}
      <h1 class="page-title">Mon panier</h1>
      <div class="cart-layout">
        <div class="box">
          ${items.map((l) => `
          <div class="cart-line">
            <a class="thumb" href="#/produit/${l.p.id}">${productVisual(l.p)}</a>
            <div><a class="cl-name" href="#/produit/${l.p.id}">${esc(l.p.name)}</a><div class="cl-unit">${money(l.p.price)} / unité</div></div>
            <div class="qty"><button data-cq="${l.p.id}" data-d="-1" aria-label="Moins">−</button><input value="${l.qty}" data-cqi="${l.p.id}" type="number" min="1" max="99" aria-label="Quantité"><button data-cq="${l.p.id}" data-d="1" aria-label="Plus">+</button></div>
            <div class="cl-total">${money(l.p.price * l.qty)}</div>
            <button class="rm" data-rm="${l.p.id}" aria-label="Retirer">${icon("trash")}</button>
          </div>`).join("")}
          <div style="display:flex;justify-content:space-between;margin-top:16px;gap:10px;flex-wrap:wrap">
            <a class="btn btn-outline btn-sm" href="#/boutique">${icon("left")} Continuer mes achats</a>
            <button class="btn btn-outline btn-sm" id="clear-cart">${icon("trash")} Vider le panier</button>
          </div>
        </div>
        ${summary(t, `<a class="btn btn-yellow btn-block" href="#/commande">Passer la commande ${icon("right")}</a>`)}
      </div>
    </div>`;
  }

  function summary(t, cta) {
    const sh = shipping(t);
    const left = S.freeShippingFrom - t;
    return `
    <aside class="box">
      <h3>Récapitulatif</h3>
      ${left > 0 ? `<div class="free-ship">Plus que <b>${money(left)}</b> pour la livraison gratuite !<div class="bar"><i style="width:${Math.min(100, (t / S.freeShippingFrom) * 100)}%"></i></div></div>` : `<div class="free-ship">🎉 Vous bénéficiez de la <b>livraison gratuite</b> !</div>`}
      <div class="sum-row"><span>Sous-total (${cartCount()} article${cartCount() > 1 ? "s" : ""})</span><b>${money(t)}</b></div>
      <div class="sum-row"><span>Livraison</span><b>${sh ? money(sh) : "Gratuite"}</b></div>
      <div class="sum-row total"><span>Total TTC</span><span>${money(t + sh)}</span></div>
      <div style="margin-top:14px">${cta}</div>
      <div class="pay-opt" style="margin-top:14px">${icon("cash")}<span>Paiement <b>à la livraison</b> en espèces</span></div>
    </aside>`;
  }

  const GOUVS = ["Médenine", "Tataouine", "Gabès", "Kébili", "Tozeur", "Gafsa", "Sfax", "Sidi Bouzid", "Kasserine", "Mahdia", "Monastir", "Sousse", "Kairouan", "Siliana", "Le Kef", "Jendouba", "Béja", "Bizerte", "Nabeul", "Zaghouan", "Ben Arous", "Tunis", "Ariana", "Manouba"];
  function viewCheckout() {
    const items = cartItems();
    if (!items.length) { location.hash = "#/panier"; return ""; }
    const saved = store.get("client", {});
    const f = (id, label, type = "text", extra = "") => `<div class="field ${extra}"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" value="${esc(saved[id] || "")}"><span class="err">Champ obligatoire</span></div>`;
    return `
    <div class="container">
      ${crumbs({ label: "Panier", href: "#/panier" }, { label: "Commande" })}
      <h1 class="page-title">Finaliser ma commande</h1>
      <form class="cart-layout" id="checkout" novalidate>
        <div class="box">
          <h3>Informations de livraison</h3>
          <div class="form-grid">
            ${f("nom", "Nom et prénom *")}
            ${f("tel", "Téléphone *", "tel")}
            <div class="field"><label for="gouv">Gouvernorat *</label><select id="gouv" name="gouv">${GOUVS.map((g) => `<option ${(saved.gouv || "Médenine") === g ? "selected" : ""}>${g}</option>`).join("")}</select></div>
            ${f("ville", "Ville *")}
            ${f("adresse", "Adresse complète *", "text", "full")}
            <div class="field full"><label for="livr">Mode de réception</label><select id="livr" name="livr"><option value="livraison">Livraison à domicile</option><option value="magasin">Retrait au magasin Brico Dab Zarzis (gratuit)</option></select></div>
            <div class="field full"><label for="note">Remarque (optionnel)</label><textarea id="note" name="note" rows="3" placeholder="Précisions sur la commande, horaires de livraison…"></textarea></div>
          </div>
          <h3 style="margin-top:22px">Paiement</h3>
          <div class="pay-opt">${icon("cash")}<span><b>Paiement à la livraison</b> — vous payez en espèces à la réception de votre commande.</span></div>
          <h3 style="margin-top:22px">Votre commande</h3>
          ${items.map((l) => `<div class="sum-row"><span>${l.qty} × ${esc(l.p.name)}</span><b>${money(l.p.price * l.qty)}</b></div>`).join("")}
        </div>
        <div id="co-summary">${summary(cartTotal(), `<button type="submit" class="btn btn-yellow btn-block">${icon("check")} Confirmer la commande</button><p style="font-size:12px;color:#71747c;margin:10px 0 0">Votre commande sera envoyée à Brico Dab via WhatsApp pour confirmation.</p>`)}</div>
      </form>
    </div>`;
  }

  function submitCheckout(form) {
    const data = Object.fromEntries(new FormData(form));
    let ok = true;
    const rules = { nom: (v) => v.trim().length >= 3, tel: (v) => /^[0-9 +]{8,15}$/.test(v.trim()), ville: (v) => v.trim(), adresse: (v) => data.livr === "magasin" || v.trim().length >= 5 };
    Object.entries(rules).forEach(([k, fn]) => {
      const valid = !!fn(data[k] || "");
      $("#" + k).closest(".field").classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) { toast("Veuillez compléter les champs obligatoires", "x"); return; }
    store.set("client", { nom: data.nom, tel: data.tel, gouv: data.gouv, ville: data.ville, adresse: data.adresse });

    const items = cartItems();
    const t = cartTotal();
    const sh = data.livr === "magasin" ? 0 : shipping(t);
    const num = "BD" + Date.now().toString().slice(-7);
    const lines = [
      `🛒 *Nouvelle commande ${num}* — Brico Dab Zarzis`, "",
      ...items.map((l) => `• ${l.qty} × ${l.p.name} (${ref(l.p)}) = ${money(l.p.price * l.qty)}`), "",
      `Sous-total : ${money(t)}`,
      `Livraison : ${sh ? money(sh) : "Gratuite"}`,
      `*Total : ${money(t + sh)}*`, "",
      `👤 ${data.nom}`, `📞 ${data.tel}`,
      `📍 ${data.livr === "magasin" ? "Retrait au magasin" : `${data.adresse}, ${data.ville}, ${data.gouv}`}`,
      data.note ? `📝 ${data.note}` : "",
      "💵 Paiement à la livraison"
    ].filter((x, i, a) => x !== "" || a[i - 1] !== "");
    const orders = store.get("orders", []);
    orders.unshift({ num, date: new Date().toISOString(), items: items.map((l) => ({ id: l.id, qty: l.qty, price: l.p.price })), total: t + sh, client: data });
    store.set("orders", orders.slice(0, 20));
    const wa = `https://wa.me/${S.phoneIntl}?text=${encodeURIComponent(lines.join("\n"))}`;
    cart = []; saveCart();
    app.innerHTML = `
      <div class="container"><div class="box success" style="margin:30px auto 48px;max-width:640px">
        <div class="ok">${icon("check")}</div>
        <h1 class="page-title" style="margin-bottom:8px">Merci ${esc(data.nom.split(" ")[0])} !</h1>
        <p>Votre commande <b>${num}</b> d'un montant de <b>${money(t + sh)}</b> a bien été enregistrée.</p>
        <p>Pour la confirmer rapidement, envoyez-la à notre équipe sur WhatsApp. Nous vous appellerons au <b>${esc(data.tel)}</b>.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px">
          <a class="btn btn-wa" href="${wa}" target="_blank" rel="noopener">${WA} Envoyer sur WhatsApp</a>
          <a class="btn btn-outline" href="#/">Retour à l'accueil</a>
        </div>
      </div></div>`;
    window.open(wa, "_blank", "noopener");
    scrollTo(0, 0);
  }

  function viewWish() {
    const list = wish.map(prodBy).filter(Boolean);
    return `<div class="container">${crumbs({ label: "Mes favoris" })}<h1 class="page-title">Mes favoris</h1>
      ${list.length ? grid(list) : `<div class="empty">${icon("heart")}<p>Vous n'avez pas encore de favoris.</p><a class="btn btn-yellow" href="#/boutique">Découvrir nos produits</a></div>`}<div style="height:48px"></div></div>`;
  }

  function viewContact() {
    return `
    <div class="container">
      ${crumbs({ label: "Contact" })}
      <div class="page-banner"><div><h1>Contactez <span>Brico Dab</span></h1><p>Une question, un devis, un conseil ? Notre équipe vous répond.</p></div></div>
      <div class="info-grid">
        <div class="box">
          <h3>Nos coordonnées</h3>
          <ul style="list-style:none;padding:0;display:grid;gap:14px">
            <li style="display:flex;gap:10px">${icon("pin", "ic20")}<span>${esc(S.address)}</span></li>
            <li style="display:flex;gap:10px">${icon("phone", "ic20")}<a href="tel:+${S.phoneIntl}">${S.phone}</a></li>
            <li style="display:flex;gap:10px">${icon("mail", "ic20")}<a href="mailto:${S.email}">${S.email}</a></li>
            <li style="display:flex;gap:10px">${icon("clock", "ic20")}<span>${esc(S.hours)}</span></li>
          </ul>
          <h3 style="margin-top:24px">Envoyez-nous un message</h3>
          <form id="contact-form" class="form-grid" novalidate>
            <div class="field"><label for="c-nom">Nom *</label><input id="c-nom" required></div>
            <div class="field"><label for="c-tel">Téléphone *</label><input id="c-tel" type="tel" required></div>
            <div class="field full"><label for="c-msg">Message *</label><textarea id="c-msg" rows="4" required></textarea></div>
            <div class="full"><button class="btn btn-wa" type="submit">${WA} Envoyer via WhatsApp</button></div>
          </form>
        </div>
        <iframe class="map" title="Carte Brico Dab Zarzis" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent("Brico Dab " + S.mapQuery)}&z=14&output=embed"></iframe>
      </div>
    </div>`;
  }

  function viewAbout() {
    return `
    <div class="container">
      ${crumbs({ label: "À propos" })}
      <div class="page-banner"><div><h1>À propos de <span>Brico Dab</span></h1><p>${esc(S.slogan)} — <span class="ar">${S.sloganAr}</span></p></div></div>
      <div class="info-grid">
        <div class="box">
          <h3>Votre quincaillerie à Zarzis</h3>
          <p>Brico Dab est une quincaillerie et un magasin de bricolage situé à Zarzis. Nous proposons un large choix de produits pour les professionnels du bâtiment comme pour les particuliers : outillage électroportatif et à main, quincaillerie, matériaux de construction, peinture, plomberie, électricité, jardinage et équipements de sécurité.</p>
          <p>Nous travaillons avec des marques reconnues comme <b>Deutsch Color</b>, <b>Makita</b>, <b>Ingco</b>, <b>Total</b> ou <b>Abrapro</b>, et fabriquons nos propres produits comme le <b>boudin bas de porte Brico Dab</b>.</p>
          <p>Avec notre boutique en ligne, commandez depuis chez vous et faites-vous livrer partout en Tunisie, avec paiement à la livraison.</p>
          <a class="btn btn-yellow" href="#/boutique">Découvrir la boutique</a>
        </div>
        <img src="assets/img/magasin.jpg" alt="Magasin Brico Dab" style="border-radius:10px;width:100%;height:100%;object-fit:cover">
      </div>
      ${reassure()}
      <section class="section faq">
        <div class="sec-head"><h2>Questions fréquentes</h2></div>
        <details><summary>Comment passer commande ?</summary><p>Ajoutez vos produits au panier, cliquez sur « Passer la commande », remplissez vos coordonnées puis confirmez. Votre commande nous est transmise par WhatsApp et nous vous rappelons pour la confirmer.</p></details>
        <details><summary>Quels sont les délais et frais de livraison ?</summary><p>Nous livrons partout en Tunisie en 24 à 72h. La livraison coûte ${money(S.shippingFee)} et devient gratuite dès ${money(S.freeShippingFrom)} d'achat.</p></details>
        <details><summary>Comment payer ?</summary><p>Le paiement se fait en espèces à la livraison, ou directement au magasin si vous choisissez le retrait.</p></details>
        <details><summary>Puis-je retirer ma commande au magasin ?</summary><p>Oui, choisissez « Retrait au magasin » lors de la commande. C'est gratuit.</p></details>
        <details><summary>Puis-je échanger un produit ?</summary><p>Oui, sous 7 jours, si le produit n'a pas été utilisé et se trouve dans son emballage d'origine.</p></details>
      </section>
    </div>`;
  }

  const view404 = () => `<div class="container"><div class="empty" style="margin:40px 0 48px">${icon("search")}<h2>Page introuvable</h2><p>La page demandée n'existe pas.</p><a class="btn btn-yellow" href="#/">Retour à l'accueil</a></div></div>`;

  /* ---------------- Router ---------------- */
  function route() {
    const hash = location.hash.slice(1) || "/";
    const [path, qs] = hash.split("?");
    const params = new URLSearchParams(qs || "");
    const seg = path.split("/").filter(Boolean);
    document.title = "Brico Dab Zarzis | Quincaillerie en ligne en Tunisie";
    let html;
    switch (seg[0]) {
      case undefined: html = viewHome(); break;
      case "boutique": html = viewListing({ title: "Tous les produits", params }); break;
      case "categorie": { const c = catBy(seg[1]); html = c ? viewListing({ cat: c, params }) : view404(); if (c) document.title = `${c.name} | Brico Dab Zarzis`; break; }
      case "promotions": html = viewListing({ title: "Promotions", preset: (p) => !!p.old, params }); break;
      case "nouveautes": html = viewListing({ title: "Nouveautés", preset: (p) => p.tags.includes("new"), params }); break;
      case "recherche": html = viewListing({ title: "Recherche", q: params.get("q") || "", params }); break;
      case "produit": html = viewProduct(seg[1]); break;
      case "panier": html = viewCart(); break;
      case "commande": html = viewCheckout(); break;
      case "favoris": html = viewWish(); break;
      case "contact": html = viewContact(); break;
      case "a-propos": html = viewAbout(); break;
      default: html = view404();
    }
    app.innerHTML = html;
    $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + path || (path === "/" && a.getAttribute("href") === "#/")));
    closeDrawers();
    $("#cat-menu").classList.add("hidden");
    if (seg[0] !== "recherche") $("#search-q").value = "";
    if (!seg[0]) startSlider();
    else stopSlider();
    window.scrollTo(0, 0);
  }

  function setParam(k, v) {
    const [path, qs] = (location.hash.slice(1) || "/").split("?");
    const p = new URLSearchParams(qs || "");
    if (v === "" || v == null) p.delete(k); else p.set(k, v);
    const s = p.toString();
    location.hash = path + (s ? "?" + s : "");
  }

  /* ---------------- Slider ---------------- */
  let slideI = 0, slideT;
  function goSlide(i) {
    const sl = $$("#slider .slide"); if (!sl.length) return;
    slideI = (i + sl.length) % sl.length;
    sl.forEach((s, k) => s.classList.toggle("active", k === slideI));
    $$("#slider [data-dot]").forEach((d, k) => d.classList.toggle("active", k === slideI));
  }
  function startSlider() { stopSlider(); slideI = 0; slideT = setInterval(() => goSlide(slideI + 1), 5500); }
  function stopSlider() { clearInterval(slideT); }

  /* ---------------- Search suggestions ---------------- */
  function suggest(q) {
    const box = $("#suggest");
    if (q.trim().length < 2) { box.classList.add("hidden"); return; }
    const w = norm(q).split(/\s+/).filter(Boolean);
    const cat = $("#search-cat").value;
    const res = PRODUCTS.filter((p) => (!cat || p.cat === cat) && w.every((x) => norm(`${p.name} ${p.brand}`).includes(x))).slice(0, 6);
    box.innerHTML = res.length
      ? res.map((p) => `<a href="#/produit/${p.id}"><span class="thumb">${productVisual(p)}</span><span><span class="s-name">${esc(p.name)}</span><br><span class="s-price">${money(p.price)}</span></span></a>`).join("") +
        `<a href="#/recherche?q=${encodeURIComponent(q)}" style="justify-content:center;font-weight:600">Voir tous les résultats</a>`
      : `<a style="color:#71747c">Aucun résultat pour « ${esc(q)} »</a>`;
    box.classList.remove("hidden");
  }

  /* ---------------- Static chrome ---------------- */
  function renderChrome() {
    $$("[data-logo]").forEach((e) => (e.innerHTML = LOGO(e.dataset.logo === "dark")));
    $$("[data-icon]").forEach((e) => (e.innerHTML = icon(e.dataset.icon)));
    $$("[data-wa]").forEach((e) => (e.innerHTML = WA + (e.dataset.wa ? " " + e.dataset.wa : "")));
    $$("[data-fb]").forEach((e) => (e.innerHTML = FB));
    $$("[data-ig]").forEach((e) => (e.innerHTML = IG));
    $$("[data-phone]").forEach((e) => (e.textContent = S.phone));
    $$("[data-tel]").forEach((e) => (e.href = "tel:+" + S.phoneIntl));
    $$("[data-walink]").forEach((e) => (e.href = "https://wa.me/" + S.phoneIntl));
    $$("[data-fblink]").forEach((e) => (e.href = S.facebook));
    $$("[data-address]").forEach((e) => (e.textContent = S.address));
    $$("[data-hours]").forEach((e) => (e.textContent = S.hours));
    $$("[data-email]").forEach((e) => { e.textContent = S.email; e.href = "mailto:" + S.email; });
    $("#search-cat").innerHTML = `<option value="">Toutes catégories</option>` + CATS.map((c) => `<option value="${c.slug}">${esc(c.name)}</option>`).join("");
    const catLinks = CATS.map((c) => `<a href="#/categorie/${c.slug}"><span class="ci">${icon(c.icon)}</span>${esc(c.name)}</a>`).join("");
    $("#cat-menu").innerHTML = catLinks;
    $("#mob-cats").innerHTML = catLinks;
    $("#footer-cats").innerHTML = CATS.slice(0, 7).map((c) => `<li><a href="#/categorie/${c.slug}">${esc(c.name)}</a></li>`).join("");
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------------- Events ---------------- */
  document.addEventListener("click", (e) => {
    const t = e.target;
    const add = t.closest("[data-add]");
    if (add) { e.preventDefault(); addToCart(add.dataset.add); return; }
    const w = t.closest("[data-wish]");
    if (w) { e.preventDefault(); toggleWish(w.dataset.wish); return; }
    const rm = t.closest("[data-rm]");
    if (rm) { setQty(rm.dataset.rm, 0); if (location.hash.startsWith("#/panier")) route(); return; }
    const cq = t.closest("[data-cq]");
    if (cq) { const l = cart.find((x) => x.id === Number(cq.dataset.cq)); if (l) { setQty(l.id, l.qty + Number(cq.dataset.d)); route(); } return; }
    const q = t.closest("[data-q]");
    if (q) { const i = $("#pd-qty"); i.value = Math.max(1, Math.min(99, (parseInt(i.value) || 1) + Number(q.dataset.q))); return; }
    if (t.closest("#pd-add")) { addToCart($("#pd-add").dataset.id, Math.max(1, parseInt($("#pd-qty").value) || 1)); openDrawer("mini-cart"); return; }
    if (t.closest("#pd-buy")) { addToCart($("#pd-buy").dataset.id, Math.max(1, parseInt($("#pd-qty").value) || 1)); location.hash = "#/commande"; return; }
    const tab = t.closest("[data-tab]");
    if (tab) {
      $$("[data-tab]").forEach((b) => b.classList.toggle("active", b === tab));
      $("#tab-body").innerHTML = grid(byTag(tab.dataset.tab).slice(0, 10));
      return;
    }
    const ptab = t.closest("[data-ptab]");
    if (ptab) {
      $$("[data-ptab]").forEach((b) => b.classList.toggle("active", b === ptab));
      $$("[data-pbody]").forEach((b) => b.classList.toggle("hidden", b.dataset.pbody !== ptab.dataset.ptab));
      return;
    }
    const sd = t.closest("[data-slide]");
    if (sd) { goSlide(slideI + Number(sd.dataset.slide)); startSliderKeep(); return; }
    const dot = t.closest("[data-dot]");
    if (dot) { goSlide(Number(dot.dataset.dot)); startSliderKeep(); return; }
    if (t.closest("#cat-toggle")) { $("#cat-menu").classList.toggle("hidden"); return; }
    if (!t.closest(".cat-wrap")) $("#cat-menu").classList.add("hidden");
    if (!t.closest(".search")) $("#suggest").classList.add("hidden");
    if (t.closest("[data-open-cart]")) { e.preventDefault(); openDrawer("mini-cart"); return; }
    if (t.closest("#burger")) { openDrawer("mob-menu"); return; }
    if (t.closest("[data-close]") || t.id === "overlay") { closeDrawers(); return; }
    if (t.closest("#open-filters")) { $("#filters").classList.add("open"); $("#overlay").classList.add("show"); return; }
    if (t.closest("#f-apply")) {
      const [path, qs] = location.hash.slice(1).split("?");
      const p = new URLSearchParams(qs || "");
      const mn = $("#f-min").value, mx = $("#f-max").value;
      mn ? p.set("min", mn) : p.delete("min");
      mx ? p.set("max", mx) : p.delete("max");
      location.hash = path + (p.toString() ? "?" + p : "");
      return;
    }
    if (t.closest("#f-reset")) { const [path, qs] = location.hash.slice(1).split("?"); const p = new URLSearchParams(qs || ""); ["min", "max", "marque"].forEach((k) => p.delete(k)); location.hash = path + (p.toString() ? "?" + p : ""); return; }
    if (t.closest("#clear-cart")) { cart = []; saveCart(); route(); return; }
    if (t.closest("#to-top")) { scrollTo({ top: 0, behavior: "smooth" }); }
  });
  function startSliderKeep() { stopSlider(); slideT = setInterval(() => goSlide(slideI + 1), 5500); }

  document.addEventListener("change", (e) => {
    if (e.target.id === "sort") setParam("tri", e.target.value === "pertinence" ? "" : e.target.value);
    if (e.target.matches("[data-brand]")) setParam("marque", $$("[data-brand]:checked").map((c) => c.value).join(","));
    if (e.target.matches("[data-cqi]")) { setQty(e.target.dataset.cqi, parseInt(e.target.value) || 0); route(); }
  });

  document.addEventListener("submit", (e) => {
    if (e.target.id === "search-form") {
      e.preventDefault();
      const q = $("#search-q").value.trim();
      const c = $("#search-cat").value;
      $("#suggest").classList.add("hidden");
      if (!q && c) location.hash = "#/categorie/" + c;
      else if (q) location.hash = "#/recherche?q=" + encodeURIComponent(q);
    }
    if (e.target.id === "checkout") { e.preventDefault(); submitCheckout(e.target); }
    if (e.target.id === "contact-form") {
      e.preventDefault();
      const n = $("#c-nom").value.trim(), tl = $("#c-tel").value.trim(), m = $("#c-msg").value.trim();
      if (!n || !tl || !m) { toast("Veuillez remplir tous les champs", "x"); return; }
      window.open(`https://wa.me/${S.phoneIntl}?text=${encodeURIComponent(`Bonjour Brico Dab,\n${m}\n\n— ${n} (${tl})`)}`, "_blank", "noopener");
      e.target.reset();
    }
    if (e.target.id === "nl-form") { e.preventDefault(); e.target.reset(); toast("Merci pour votre inscription !"); }
  });

  let sT;
  document.addEventListener("input", (e) => {
    if (e.target.id === "search-q") { clearTimeout(sT); sT = setTimeout(() => suggest(e.target.value), 150); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeDrawers(); $("#suggest").classList.add("hidden"); } });
  window.addEventListener("scroll", () => $("#to-top").classList.toggle("show", scrollY > 500), { passive: true });
  window.addEventListener("hashchange", route);
  window.addEventListener("storage", () => { cart = store.get("cart", []); wish = store.get("wish", []); updateBadges(); renderMiniCart(); });

  /* ---------------- Init ---------------- */
  renderChrome();
  updateBadges();
  renderMiniCart();
  route();
})();
