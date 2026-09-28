"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { money } from "@/lib/format";
import { useAdmin } from "@/components/admin/AdminContext";
import Modal from "@/components/admin/Modal";

export default function ProductsPage() {
  const { toast } = useAdmin();
  const [cats, setCats] = useState([]);
  const [products, setProducts] = useState(null);
  const [editing, setEditing] = useState(null); // null closed, {} new, product edit

  const load = () => Promise.all([apiFetch("/api/categories"), apiFetch("/api/products")]).then(([c, p]) => {
    setCats(c.ok ? c.data.categories : []);
    setProducts(p.ok ? p.data.products : []);
  });
  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm("Supprimer définitivement ce produit ?")) return;
    const r = await apiFetch("/api/products/" + id, { method: "DELETE" });
    if (!r.ok) { toast(r.data?.error || "Erreur", true); return; }
    toast("Produit supprimé.");
    load();
  }

  if (products === null) return <p className="muted">Chargement…</p>;

  return (
    <>
      <div className="panel">
        <div className="panel-head"><h3>{products.length} produit(s)</h3><button className="btn btn-yellow" onClick={() => setEditing({})}>+ Ajouter un produit</button></div>
        <div className="panel-body" style={{ overflow: "auto" }}>
          <table>
            <thead><tr><th></th><th>Nom</th><th>Catégorie</th><th>Marque</th><th>Prix</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => {
                const cat = cats.find((c) => c.slug === p.cat);
                return (
                  <tr key={p.id}>
                    <td>{p.img ? <img className="cell-img" src={"/" + p.img.replace(/^\/+/, "")} alt="" /> : <div className="cell-img" style={{ display: "grid", placeItems: "center", color: "#bbb" }}>–</div>}</td>
                    <td>{p.name}</td><td>{cat ? cat.name : p.cat}</td><td>{p.brand}</td>
                    <td className="mono">{money(p.price)}{p.old ? <><br /><small className="mono" style={{ color: "#e53935", textDecoration: "line-through" }}>{money(p.old)}</small></> : null}</td>
                    <td className={p.stock <= 5 ? "stock-low" : ""}>{p.stock}</td>
                    <td className="row-actions">
                      <button className="btn btn-sm" onClick={() => setEditing(p)}>Modifier</button>
                      <button className="btn btn-sm btn-danger" onClick={() => remove(p.id)}>Suppr.</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing !== null && (
        <ProductForm cats={cats} product={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </>
  );
}

function ProductForm({ cats, product, onClose, onSaved }) {
  const { toast } = useAdmin();
  const isEdit = !!product.id;
  const tags = product.tags || [];

  async function submit(e) {
    e.preventDefault();
    const f = e.target;
    const body = {
      name: f.name.value.trim(), cat: f.cat.value, brand: f.brand.value.trim(),
      price: Number(f.price.value), old: f.old.value ? Number(f.old.value) : null,
      stock: Number(f.stock.value), img: f.img.value.trim(),
      short: f.short.value.trim(),
      feats: f.feats.value.split("\n").map((s) => s.trim()).filter(Boolean),
      specs: Object.fromEntries(
        f.specs.value.split("\n").map((l) => l.split(":")).filter((a) => a.length >= 2 && a[0].trim())
          .map(([k, ...v]) => [k.trim(), v.join(":").trim()])
      ),
      tags: [...f.querySelectorAll('input[type=checkbox]:checked')].map((c) => c.value)
    };
    const r = await apiFetch(isEdit ? "/api/products/" + product.id : "/api/products", { method: isEdit ? "PUT" : "POST", body: JSON.stringify(body) });
    if (!r.ok) { toast(r.data?.error || "Erreur", true); return; }
    toast(isEdit ? "Produit mis à jour." : "Produit ajouté.");
    onSaved();
  }

  return (
    <Modal onClose={onClose}>
      <h3>{isEdit ? "Modifier le produit" : "Ajouter un produit"}</h3>
      <form className="form-grid" onSubmit={submit}>
        <div className="field full"><label>Nom *</label><input name="name" defaultValue={product.name || ""} required /></div>
        <div className="field"><label>Catégorie *</label>
          <select name="cat" defaultValue={product.cat || cats[0]?.slug}>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        </div>
        <div className="field"><label>Marque</label><input name="brand" defaultValue={product.brand || "Brico Dab"} /></div>
        <div className="field"><label>Prix (DT) *</label><input name="price" type="number" step="0.001" min="0" defaultValue={product.price ?? ""} required /></div>
        <div className="field"><label>Ancien prix (promo)</label><input name="old" type="number" step="0.001" min="0" defaultValue={product.old || ""} /></div>
        <div className="field"><label>Stock</label><input name="stock" type="number" min="0" defaultValue={product.stock ?? 100} /></div>
        <div className="field"><label>Image (chemin ou URL)</label><input name="img" defaultValue={product.img || ""} placeholder="assets/img/…" /></div>
        <div className="field full"><label>Description courte</label><textarea name="short" rows="2" defaultValue={product.short || ""} /></div>
        <div className="field full"><label>Points forts (un par ligne)</label><textarea name="feats" rows="3" defaultValue={(product.feats || []).join("\n")} /></div>
        <div className="field full"><label>Caractéristiques (Clé: valeur, une par ligne)</label>
          <textarea name="specs" rows="3" defaultValue={Object.entries(product.specs || {}).map(([k, v]) => `${k}: ${v}`).join("\n")} />
        </div>
        <div className="field full">
          <label>Étiquettes</label>
          <div className="tag-choices">
            <label><input type="checkbox" value="new" defaultChecked={tags.includes("new")} /> Nouveauté</label>
            <label><input type="checkbox" value="best" defaultChecked={tags.includes("best")} /> Meilleure vente</label>
            <label><input type="checkbox" value="promo" defaultChecked={tags.includes("promo")} /> Promotion</label>
          </div>
        </div>
        <div className="form-actions full">
          <button type="button" className="btn" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-yellow">{isEdit ? "Enregistrer" : "Ajouter"}</button>
        </div>
      </form>
    </Modal>
  );
}
