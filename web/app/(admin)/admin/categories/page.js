"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAdmin } from "@/components/admin/AdminContext";
import Modal from "@/components/admin/Modal";

const ICONS = ["drill", "hammer", "bolt", "faucet", "bulb", "roller", "brick", "disc", "leaf", "helmet", "shield", "ladder", "box"];

export default function CategoriesPage() {
  const { toast } = useAdmin();
  const [cats, setCats] = useState(null);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {slug,...} = edit

  const load = () => apiFetch("/api/categories").then((r) => setCats(r.ok ? r.data.categories : []));
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    const form = e.target;
    const body = { name: form.name.value.trim(), icon: form.icon.value, description: form.description.value.trim() };
    const isEdit = !!editing?.slug;
    const r = await apiFetch(isEdit ? "/api/categories/" + editing.slug : "/api/categories", { method: isEdit ? "PUT" : "POST", body: JSON.stringify(body) });
    if (!r.ok) { toast(r.data?.error || "Erreur", true); return; }
    toast("Catégorie enregistrée.");
    setEditing(null);
    load();
  }

  async function remove(slug) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const r = await apiFetch("/api/categories/" + slug, { method: "DELETE" });
    if (!r.ok) { toast(r.data?.error || "Erreur", true); return; }
    toast("Catégorie supprimée.");
    load();
  }

  if (cats === null) return <p className="muted">Chargement…</p>;

  return (
    <>
      <div className="panel">
        <div className="panel-head"><h3>{cats.length} catégorie(s)</h3><button className="btn btn-yellow" onClick={() => setEditing({})}>+ Ajouter une catégorie</button></div>
        <div className="panel-body" style={{ overflow: "auto" }}>
          <table>
            <thead><tr><th>Nom</th><th>Slug</th><th>Icône</th><th>Description</th><th></th></tr></thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c.slug}>
                  <td>{c.name}</td><td className="mono">{c.slug}</td><td>{c.icon}</td><td>{c.description}</td>
                  <td className="row-actions">
                    <button className="btn btn-sm" onClick={() => setEditing(c)}>Modifier</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(c.slug)}>Suppr.</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing !== null && (
        <Modal onClose={() => setEditing(null)}>
          <h3>{editing.slug ? "Modifier la catégorie" : "Ajouter une catégorie"}</h3>
          <form className="form-grid" onSubmit={save}>
            <div className="field full"><label>Nom *</label><input name="name" defaultValue={editing.name || ""} required /></div>
            <div className="field full"><label>Icône</label>
              <select name="icon" defaultValue={editing.icon || "box"}>{ICONS.map((i) => <option key={i}>{i}</option>)}</select>
            </div>
            <div className="field full"><label>Description</label><textarea name="description" rows="2" defaultValue={editing.description || ""} /></div>
            <div className="form-actions full">
              <button type="button" className="btn" onClick={() => setEditing(null)}>Annuler</button>
              <button type="submit" className="btn btn-yellow">{editing.slug ? "Enregistrer" : "Ajouter"}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
