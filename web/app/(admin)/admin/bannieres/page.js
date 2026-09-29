"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { resolveImg } from "@/lib/format";
import { useAdmin } from "@/components/admin/AdminContext";
import Modal from "@/components/admin/Modal";
import ImageUploadField from "@/components/admin/ImageUploadField";

const ZONES = {
  slider: "Slider principal (accueil)",
  mini: "Petites bannières (à côté du slider)",
  promo: "Bandeau promo (sous les produits)"
};

export default function BannersPage() {
  const { toast } = useAdmin();
  const [banners, setBanners] = useState(null);
  const [zone, setZone] = useState("slider");
  const [editing, setEditing] = useState(null);

  const load = () => apiFetch("/api/banners").then((r) => setBanners(r.ok ? r.data.banners : []));
  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm("Supprimer cette bannière ?")) return;
    const r = await apiFetch("/api/banners/" + id, { method: "DELETE" });
    if (!r.ok) { toast(r.data?.error || "Erreur", true); return; }
    toast("Bannière supprimée.");
    load();
  }
  async function toggleActive(b) {
    const r = await apiFetch("/api/banners/" + b.id, { method: "PUT", body: JSON.stringify({ ...b, active: !b.active }) });
    if (!r.ok) { toast(r.data?.error || "Erreur", true); return; }
    load();
  }

  if (banners === null) return <p className="muted">Chargement…</p>;
  const list = banners.filter((b) => b.zone === zone);

  return (
    <>
      <p className="muted" style={{ marginTop: -8, marginBottom: 16 }}>
        Gère les visuels de la page d&apos;accueil : le grand slider, les deux petites bannières à côté, et le bandeau promo sous les produits.
      </p>
      <div className="panel">
        <div className="panel-head">
          <div className="tabs">
            {Object.entries(ZONES).map(([z, label]) => (
              <button key={z} className={zone === z ? "active" : ""} onClick={() => setZone(z)}>{label}</button>
            ))}
          </div>
          <button className="btn btn-yellow" onClick={() => setEditing({ zone, position: list.length })}>+ Ajouter</button>
        </div>
        <div className="panel-body" style={{ overflow: "auto" }}>
          <table>
            <thead><tr><th></th><th>Ordre</th><th>Titre</th><th>Lien</th><th>Actif</th><th></th></tr></thead>
            <tbody>
              {list.length ? list.map((b) => (
                <tr key={b.id}>
                  <td>{b.image ? <img className="cell-img" src={resolveImg(b.image)} alt="" /> : <div className="cell-img" style={{ display: "grid", placeItems: "center", color: "#bbb" }}>–</div>}</td>
                  <td>{b.position}</td>
                  <td>{b.title}{b.highlight ? <> <b>{b.highlight}</b></> : null}</td>
                  <td className="mono">{b.link}</td>
                  <td><button className="btn btn-sm" onClick={() => toggleActive(b)}>{b.active ? "✅ Oui" : "⬜ Non"}</button></td>
                  <td className="row-actions">
                    <button className="btn btn-sm" onClick={() => setEditing(b)}>Modifier</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(b.id)}>Suppr.</button>
                  </td>
                </tr>
              )) : <tr className="empty-row"><td colSpan={6}>Aucune bannière dans cette zone.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editing !== null && (
        <BannerForm banner={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </>
  );
}

function BannerForm({ banner, onClose, onSaved }) {
  const { toast } = useAdmin();
  const isEdit = !!banner.id;

  async function submit(e) {
    e.preventDefault();
    const f = e.target;
    const body = {
      zone: f.zone.value, position: Number(f.position.value) || 0,
      kicker: f.kicker.value.trim() || null, title: f.title.value.trim() || null,
      highlight: f.highlight.value.trim() || null, subtitle: f.subtitle.value.trim() || null,
      body: f.body.value.trim() || null, ar_text: f.ar_text.value.trim() || null,
      image: f.image.value.trim() || null, link: f.link.value.trim() || null,
      cta: f.cta.value.trim() || null, style: f.style.value,
      active: banner.active !== false
    };
    const r = await apiFetch(isEdit ? "/api/banners/" + banner.id : "/api/banners", { method: isEdit ? "PUT" : "POST", body: JSON.stringify(body) });
    if (!r.ok) { toast(r.data?.error || "Erreur", true); return; }
    toast(isEdit ? "Bannière mise à jour." : "Bannière ajoutée.");
    onSaved();
  }

  return (
    <Modal onClose={onClose}>
      <h3>{isEdit ? "Modifier la bannière" : "Ajouter une bannière"}</h3>
      <form className="form-grid" onSubmit={submit}>
        <div className="field"><label>Zone *</label>
          <select name="zone" defaultValue={banner.zone}>{Object.entries(ZONES).map(([z, l]) => <option key={z} value={z}>{l}</option>)}</select>
        </div>
        <div className="field"><label>Ordre</label><input name="position" type="number" min="0" defaultValue={banner.position ?? 0} /></div>
        <div className="field full"><label>Étiquette (kicker, slider uniquement)</label><input name="kicker" defaultValue={banner.kicker || ""} placeholder="ex. Vente flash" /></div>
        <div className="field"><label>Titre</label><input name="title" defaultValue={banner.title || ""} /></div>
        <div className="field"><label>Titre en surbrillance (jaune)</label><input name="highlight" defaultValue={banner.highlight || ""} /></div>
        <div className="field full"><label>Sous-titre (petites bannières uniquement)</label><input name="subtitle" defaultValue={banner.subtitle || ""} placeholder="ex. Vente flash · -25%" /></div>
        <div className="field full"><label>Texte</label><textarea name="body" rows="2" defaultValue={banner.body || ""} /></div>
        <div className="field full"><label>Texte en arabe (bandeau promo uniquement)</label><input name="ar_text" dir="rtl" defaultValue={banner.ar_text || ""} /></div>
        <ImageUploadField name="image" defaultValue={banner.image || ""} />
        <div className="field"><label>Lien</label><input name="link" defaultValue={banner.link || ""} placeholder="/categorie/… ou /produit/…" /></div>
        <div className="field"><label>Texte du bouton</label><input name="cta" defaultValue={banner.cta || ""} placeholder="ex. Découvrir" /></div>
        <div className="field full"><label>Style</label>
          <select name="style" defaultValue={banner.style || ""}>
            <option value="">Normal (fond sombre)</option>
            <option value="yellow">Jaune</option>
          </select>
        </div>
        <div className="form-actions full">
          <button type="button" className="btn" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-yellow">{isEdit ? "Enregistrer" : "Ajouter"}</button>
        </div>
      </form>
    </Modal>
  );
}
