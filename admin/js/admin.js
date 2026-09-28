/* =========================================================
   Brico Dab Zarzis — tableau de bord admin (vanilla JS)
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => Number(n).toFixed(3).replace(".", ",") + " DT";
  const fmtDate = (s) => new Date(s).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const ICONS = ["drill", "hammer", "bolt", "faucet", "bulb", "roller", "brick", "disc", "leaf", "helmet", "shield", "ladder", "box"];
  const STATUS_LABEL = { en_attente: "En attente", confirmee: "Confirmée", livree: "Livrée", annulee: "Annulée" };

  let me = null, categories = [], products = [];

  /* ---------------- API ---------------- */
  async function api(url, opts = {}) {
    const res = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json" }, ...opts });
    let data = null;
    try { data = await res.json(); } catch (e) { /* pas de JSON */ }
    if (!res.ok) throw new Error((data && data.error) || "Erreur serveur (" + res.status + ")");
    return data;
  }

  let toastT;
  function toast(msg, err) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.toggle("err", !!err);
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 2800);
  }

  /* ---------------- Logo (réutilise le style du site) ---------------- */
  function LOGO(dark) {
    return `<svg viewBox="0 0 250 84"><path d="M32 26 L66 6 L100 26" fill="none" stroke="#f5c518" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><path d="M86 18 V8 h8 v14" fill="none" stroke="${dark ? "#fff" : "#151515"}" stroke-width="4"/><rect x="61" y="17" width="4" height="4" fill="#f5c518"/><rect x="67" y="17" width="4" height="4" fill="#f5c518"/><rect x="61" y="23" width="4" height="4" fill="#f5c518"/><rect x="67" y="23" width="4" height="4" fill="#f5c518"/><text x="2" y="60" font-family="Montserrat, sans-serif" font-weight="800" font-size="36" fill="${dark ? "#fff" : "#151515"}">BRICO</text><text x="130" y="60" font-family="Montserrat, sans-serif" font-weight="800" font-size="36" fill="#f5c518">DAB</text><line x1="4" y1="75" x2="78" y2="75" stroke="#f5c518" stroke-width="2.5"/><line x1="170" y1="75" x2="212" y2="75" stroke="#f5c518" stroke-width="2.5"/><text x="124" y="80" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="700" font-size="14" letter-spacing="4" fill="${dark ? "#fff" : "#151515"}">ZARZIS</text></svg>`;
  }

  /* ---------------- Auth ---------------- */
  async function checkAuth() {
    try {
      const { user } = await api("/api/auth/me");
      if (user && user.role === "admin") { me = user; showApp(); return; }
    } catch (e) { /* pas connecté */ }
    showLogin();
  }
  function showLogin() {
    $("#login-screen").classList.remove("hidden");
    $("#admin-app").classList.add("hidden");
    $("[data-logo]").innerHTML = LOGO(false);
  }
  function showApp() {
    $("#login-screen").classList.add("hidden");
    $("#admin-app").classList.remove("hidden");
    $('[data-logo="dark"]').innerHTML = LOGO(true);
    $("#who").textContent = me.name + " · " + me.email;
    route();
  }

  $("#admin-login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#login-error").classList.add("hidden");
    try {
      const { user } = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email: $("#al-email").value.trim(), password: $("#al-pass").value }) });
      if (user.role !== "admin") { await api("/api/auth/logout", { method: "POST" }); throw new Error("Ce compte n'est pas administrateur."); }
      me = user; showApp();
    } catch (err) {
      $("#login-error").textContent = err.message;
      $("#login-error").classList.remove("hidden");
    }
  });
  $("#admin-logout").addEventListener("click", async () => { await api("/api/auth/logout", { method: "POST" }).catch(() => {}); me = null; showLogin(); });
  $("#mob-toggle").addEventListener("click", () => $(".sidebar").classList.toggle("open"));

  /* ---------------- Router ---------------- */
  const PAGES = {
    "tableau-de-bord": { title: "Tableau de bord", render: renderDashboard },
    "produits": { title: "Produits", render: renderProducts },
    "commandes": { title: "Commandes", render: renderOrders },
    "clients": { title: "Clients", render: renderCustomers },
    "categories": { title: "Catégories", render: renderCategories }
  };
  async function route() {
    const seg = (location.hash.slice(1) || "/tableau-de-bord").split("/").filter(Boolean)[0] || "tableau-de-bord";
    const page = PAGES[seg] || PAGES["tableau-de-bord"];
    $("#page-title").textContent = page.title;
    $$("#side-nav a").forEach((a) => a.classList.toggle("active", a.dataset.nav === seg));
    $(".sidebar").classList.remove("open");
    $("#content").innerHTML = `<p class="muted">Chargement…</p>`;
    try { await page.render(); } catch (err) { $("#content").innerHTML = `<div class="panel"><div class="panel-body" style="padding:20px"><p class="login-error" style="margin:0">${esc(err.message)}</p></div></div>`; }
  }
  window.addEventListener("hashchange", route);

  /* ---------------- Tableau de bord ---------------- */
  async function renderDashboard() {
    const s = await api("/api/admin/stats");
    $("#content").innerHTML = `
      <div class="stat-cards">
        <div class="stat-card accent"><div class="n">${s.orderCount}</div><div class="l">Commandes totales</div></div>
        <div class="stat-card"><div class="n">${money(s.revenue)}</div><div class="l">Chiffre d'affaires</div></div>
        <div class="stat-card"><div class="n">${s.productCount}</div><div class="l">Produits au catalogue</div></div>
        <div class="stat-card"><div class="n">${s.customerCount}</div><div class="l">Clients inscrits</div></div>
      </div>
      <div class="two-col">
        <div class="panel">
          <div class="panel-head"><h3>Dernières commandes</h3><a class="btn btn-sm" href="#/commandes">Tout voir</a></div>
          <div class="panel-body">
            <table><thead><tr><th>N°</th><th>Client</th><th>Total</th><th>Statut</th><th>Date</th></tr></thead><tbody>
              ${s.recentOrders.length ? s.recentOrders.map((o) => `<tr><td>${esc(o.order_number)}</td><td>${esc(o.client_name)}</td><td class="mono">${money(o.total)}</td><td><span class="badge st-${o.status}">${STATUS_LABEL[o.status]}</span></td><td>${fmtDate(o.created_at)}</td></tr>`).join("") : `<tr class="empty-row"><td colspan="5">Aucune commande pour le moment.</td></tr>`}
            </tbody></table>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h3>Stock faible</h3></div>
          <div class="panel-body">
            <table><thead><tr><th>Produit</th><th>Stock</th></tr></thead><tbody>
              ${s.lowStock.length ? s.lowStock.map((p) => `<tr><td>${esc(p.name)}</td><td class="stock-low">${p.stock}</td></tr>`).join("") : `<tr class="empty-row"><td colspan="2">Aucun produit en stock faible.</td></tr>`}
            </tbody></table>
          </div>
        </div>
      </div>`;
  }

  /* ---------------- Produits ---------------- */
  async function loadCatalog() {
    const [c, p] = await Promise.all([api("/api/categories"), api("/api/products")]);
    categories = c.categories; products = p.products;
  }
  async function renderProducts() {
    await loadCatalog();
    $("#content").innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>${products.length} produit(s)</h3><button class="btn btn-yellow" id="add-product">+ Ajouter un produit</button></div>
        <div class="panel-body" style="overflow:auto">
          <table><thead><tr><th></th><th>Nom</th><th>Catégorie</th><th>Marque</th><th>Prix</th><th>Stock</th><th></th></tr></thead>
          <tbody>${products.map(productRow).join("") || `<tr class="empty-row"><td colspan="7">Aucun produit.</td></tr>`}</tbody></table>
        </div>
      </div>`;
    $("#add-product").addEventListener("click", () => openProductModal());
    $$("[data-edit-p]").forEach((b) => b.addEventListener("click", () => openProductModal(products.find((p) => p.id === Number(b.dataset.editP)))));
    $$("[data-del-p]").forEach((b) => b.addEventListener("click", () => deleteProduct(Number(b.dataset.delP))));
  }
  function productRow(p) {
    const cat = categories.find((c) => c.slug === p.cat);
    return `<tr>
      <td>${p.img ? `<img class="cell-img" src="../${esc(p.img)}" alt="">` : `<div class="cell-img" style="display:grid;place-items:center;color:#bbb">–</div>`}</td>
      <td>${esc(p.name)}</td><td>${esc(cat ? cat.name : p.cat)}</td><td>${esc(p.brand)}</td>
      <td class="mono">${money(p.price)}${p.old ? `<br><small class="mono" style="color:#e53935;text-decoration:line-through">${money(p.old)}</small>` : ""}</td>
      <td class="${p.stock <= 5 ? "stock-low" : ""}">${p.stock}</td>
      <td class="row-actions"><button class="btn btn-sm" data-edit-p="${p.id}">Modifier</button><button class="btn btn-sm btn-danger" data-del-p="${p.id}">Suppr.</button></td>
    </tr>`;
  }
  function openProductModal(p) {
    const isEdit = !!p;
    const tags = p ? p.tags : [];
    const feats = p ? (p.feats || []).join("\n") : "";
    const specs = p ? Object.entries(p.specs || {}).map(([k, v]) => `${k}: ${v}`).join("\n") : "";
    showModal(`
      <h3>${isEdit ? "Modifier le produit" : "Ajouter un produit"}</h3>
      <form id="product-form" class="form-grid">
        <div class="field full"><label>Nom *</label><input id="pf-name" value="${esc(p ? p.name : "")}" required></div>
        <div class="field"><label>Catégorie *</label><select id="pf-cat">${categories.map((c) => `<option value="${c.slug}" ${p && p.cat === c.slug ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select></div>
        <div class="field"><label>Marque</label><input id="pf-brand" value="${esc(p ? p.brand : "Brico Dab")}"></div>
        <div class="field"><label>Prix (DT) *</label><input id="pf-price" type="number" step="0.001" min="0" value="${p ? p.price : ""}" required></div>
        <div class="field"><label>Ancien prix (promo)</label><input id="pf-old" type="number" step="0.001" min="0" value="${p && p.old ? p.old : ""}"></div>
        <div class="field"><label>Stock</label><input id="pf-stock" type="number" min="0" value="${p ? p.stock : 100}"></div>
        <div class="field"><label>Image (chemin ou URL)</label><input id="pf-img" value="${esc(p && p.img ? p.img : "")}" placeholder="assets/img/…"></div>
        <div class="field full"><label>Description courte</label><textarea id="pf-short" rows="2">${esc(p ? p.short : "")}</textarea></div>
        <div class="field full"><label>Points forts (un par ligne)</label><textarea id="pf-feats" rows="3">${esc(feats)}</textarea></div>
        <div class="field full"><label>Caractéristiques (Clé: valeur, une par ligne)</label><textarea id="pf-specs" rows="3">${esc(specs)}</textarea></div>
        <div class="field full"><label>Étiquettes</label>
          <div class="tag-choices">
            <label><input type="checkbox" value="new" ${tags.includes("new") ? "checked" : ""}> Nouveauté</label>
            <label><input type="checkbox" value="best" ${tags.includes("best") ? "checked" : ""}> Meilleure vente</label>
            <label><input type="checkbox" value="promo" ${tags.includes("promo") ? "checked" : ""}> Promotion</label>
          </div>
        </div>
        <div class="form-actions full">
          <button type="button" class="btn" id="modal-cancel">Annuler</button>
          <button type="submit" class="btn btn-yellow">${isEdit ? "Enregistrer" : "Ajouter"}</button>
        </div>
      </form>`);
    $("#modal-cancel").addEventListener("click", closeModal);
    $("#product-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const body = {
        name: $("#pf-name").value.trim(), cat: $("#pf-cat").value, brand: $("#pf-brand").value.trim(),
        price: Number($("#pf-price").value), old: $("#pf-old").value ? Number($("#pf-old").value) : null,
        stock: Number($("#pf-stock").value), img: $("#pf-img").value.trim(),
        short: $("#pf-short").value.trim(),
        feats: $("#pf-feats").value.split("\n").map((s) => s.trim()).filter(Boolean),
        specs: Object.fromEntries($("#pf-specs").value.split("\n").map((l) => l.split(":")).filter((a) => a.length >= 2 && a[0].trim()).map(([k, ...v]) => [k.trim(), v.join(":").trim()])),
        tags: $$(".tag-choices input:checked").map((c) => c.value)
      };
      try {
        if (isEdit) await api("/api/products/" + p.id, { method: "PUT", body: JSON.stringify(body) });
        else await api("/api/products", { method: "POST", body: JSON.stringify(body) });
        closeModal(); toast(isEdit ? "Produit mis à jour." : "Produit ajouté."); renderProducts();
      } catch (err) { toast(err.message, true); }
    });
  }
  async function deleteProduct(id) {
    if (!confirm("Supprimer définitivement ce produit ?")) return;
    try { await api("/api/products/" + id, { method: "DELETE" }); toast("Produit supprimé."); renderProducts(); }
    catch (err) { toast(err.message, true); }
  }

  /* ---------------- Commandes ---------------- */
  async function renderOrders() {
    const { orders } = await api("/api/orders");
    $("#content").innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>${orders.length} commande(s)</h3></div>
        <div class="panel-body" style="overflow:auto">
          <table><thead><tr><th>N°</th><th>Client</th><th>Téléphone</th><th>Articles</th><th>Total</th><th>Statut</th><th>Date</th></tr></thead>
          <tbody>${orders.map(orderRow).join("") || `<tr class="empty-row"><td colspan="7">Aucune commande.</td></tr>`}</tbody></table>
        </div>
      </div>`;
    $$("[data-status-o]").forEach((sel) => sel.addEventListener("change", async () => {
      try { await api("/api/orders/" + sel.dataset.statusO, { method: "PATCH", body: JSON.stringify({ status: sel.value }) }); toast("Statut mis à jour."); }
      catch (err) { toast(err.message, true); renderOrders(); }
    }));
  }
  function orderRow(o) {
    return `<tr>
      <td>${esc(o.order_number)}</td><td>${esc(o.client_name)}</td><td>${esc(o.client_phone)}</td>
      <td>${o.items.length}</td><td class="mono">${money(o.total)}</td>
      <td><select data-status-o="${o.id}">${Object.entries(STATUS_LABEL).map(([v, l]) => `<option value="${v}" ${o.status === v ? "selected" : ""}>${l}</option>`).join("")}</select></td>
      <td>${fmtDate(o.created_at)}</td>
    </tr>`;
  }

  /* ---------------- Clients ---------------- */
  async function renderCustomers() {
    const { customers } = await api("/api/admin/customers");
    $("#content").innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>${customers.length} client(s) inscrit(s)</h3></div>
        <div class="panel-body" style="overflow:auto">
          <table><thead><tr><th>Nom</th><th>E-mail</th><th>Téléphone</th><th>Inscrit le</th></tr></thead>
          <tbody>${customers.map((c) => `<tr><td>${esc(c.name)}</td><td>${esc(c.email)}</td><td>${esc(c.phone || "—")}</td><td>${fmtDate(c.created_at)}</td></tr>`).join("") || `<tr class="empty-row"><td colspan="4">Aucun client inscrit pour le moment.</td></tr>`}</tbody></table>
        </div>
      </div>`;
  }

  /* ---------------- Catégories ---------------- */
  async function renderCategories() {
    const { categories: cats } = await api("/api/categories");
    categories = cats;
    $("#content").innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>${cats.length} catégorie(s)</h3><button class="btn btn-yellow" id="add-cat">+ Ajouter une catégorie</button></div>
        <div class="panel-body" style="overflow:auto">
          <table><thead><tr><th>Nom</th><th>Slug</th><th>Icône</th><th>Description</th><th></th></tr></thead>
          <tbody>${cats.map((c) => `<tr><td>${esc(c.name)}</td><td class="mono">${esc(c.slug)}</td><td>${esc(c.icon)}</td><td>${esc(c.description || "")}</td>
            <td class="row-actions"><button class="btn btn-sm" data-edit-c="${c.slug}">Modifier</button><button class="btn btn-sm btn-danger" data-del-c="${c.slug}">Suppr.</button></td></tr>`).join("")}</tbody></table>
        </div>
      </div>`;
    $("#add-cat").addEventListener("click", () => openCategoryModal());
    $$("[data-edit-c]").forEach((b) => b.addEventListener("click", () => openCategoryModal(cats.find((c) => c.slug === b.dataset.editC))));
    $$("[data-del-c]").forEach((b) => b.addEventListener("click", () => deleteCategory(b.dataset.delC)));
  }
  function openCategoryModal(c) {
    showModal(`
      <h3>${c ? "Modifier la catégorie" : "Ajouter une catégorie"}</h3>
      <form id="cat-form" class="form-grid">
        <div class="field full"><label>Nom *</label><input id="cf-name" value="${esc(c ? c.name : "")}" required></div>
        <div class="field full"><label>Icône</label><select id="cf-icon">${ICONS.map((i) => `<option ${c && c.icon === i ? "selected" : ""}>${i}</option>`).join("")}</select></div>
        <div class="field full"><label>Description</label><textarea id="cf-desc" rows="2">${esc(c ? c.description : "")}</textarea></div>
        <div class="form-actions full">
          <button type="button" class="btn" id="modal-cancel">Annuler</button>
          <button type="submit" class="btn btn-yellow">${c ? "Enregistrer" : "Ajouter"}</button>
        </div>
      </form>`);
    $("#modal-cancel").addEventListener("click", closeModal);
    $("#cat-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const body = { name: $("#cf-name").value.trim(), icon: $("#cf-icon").value, description: $("#cf-desc").value.trim() };
      try {
        if (c) await api("/api/categories/" + c.slug, { method: "PUT", body: JSON.stringify(body) });
        else await api("/api/categories", { method: "POST", body: JSON.stringify(body) });
        closeModal(); toast("Catégorie enregistrée."); renderCategories();
      } catch (err) { toast(err.message, true); }
    });
  }
  async function deleteCategory(slug) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try { await api("/api/categories/" + slug, { method: "DELETE" }); toast("Catégorie supprimée."); renderCategories(); }
    catch (err) { toast(err.message, true); }
  }

  /* ---------------- Modale ---------------- */
  function showModal(html) { $("#modal").innerHTML = html; $("#modal-overlay").classList.remove("hidden"); }
  function closeModal() { $("#modal-overlay").classList.add("hidden"); $("#modal").innerHTML = ""; }
  $("#modal-overlay").addEventListener("click", (e) => { if (e.target.id === "modal-overlay") closeModal(); });

  checkAuth();
})();
