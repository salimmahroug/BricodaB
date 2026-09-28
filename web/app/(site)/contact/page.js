"use client";
import { useState } from "react";
import Icon from "@/components/Icon";
import Breadcrumb from "@/components/Breadcrumb";
import { STORE } from "@/lib/format";
import { useStore } from "@/components/StoreContext";

export default function ContactPage() {
  const { toast } = useStore();
  const [form, setForm] = useState({ nom: "", tel: "", msg: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!form.nom || !form.tel || !form.msg) { toast("Veuillez remplir tous les champs"); return; }
    window.open(`https://wa.me/${STORE.phoneIntl}?text=${encodeURIComponent(`Bonjour Brico Dab,\n${form.msg}\n\n— ${form.nom} (${form.tel})`)}`, "_blank", "noopener");
    setForm({ nom: "", tel: "", msg: "" });
  }

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Contact" }]} />
      <div className="page-banner"><div><h1>Contactez <span>Brico Dab</span></h1><p>Une question, un devis, un conseil ? Notre équipe vous répond.</p></div></div>
      <div className="info-grid">
        <div className="box">
          <h3>Nos coordonnées</h3>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 14 }}>
            <li style={{ display: "flex", gap: 10 }}><Icon name="pin" className="ic20" /><span>{STORE.address}</span></li>
            <li style={{ display: "flex", gap: 10 }}><Icon name="phone" className="ic20" /><a href={`tel:+${STORE.phoneIntl}`}>{STORE.phone}</a></li>
            <li style={{ display: "flex", gap: 10 }}><Icon name="mail" className="ic20" /><a href={`mailto:${STORE.email}`}>{STORE.email}</a></li>
            <li style={{ display: "flex", gap: 10 }}><Icon name="clock" className="ic20" /><span>{STORE.hours}</span></li>
          </ul>
          <h3 style={{ marginTop: 24 }}>Envoyez-nous un message</h3>
          <form className="form-grid" onSubmit={submit} noValidate>
            <div className="field"><label>Nom *</label><input required value={form.nom} onChange={set("nom")} /></div>
            <div className="field"><label>Téléphone *</label><input type="tel" required value={form.tel} onChange={set("tel")} /></div>
            <div className="field full"><label>Message *</label><textarea rows="4" required value={form.msg} onChange={set("msg")} /></div>
            <div className="full"><button className="btn btn-wa" type="submit">Envoyer via WhatsApp</button></div>
          </form>
        </div>
        <iframe className="map" title="Carte Brico Dab Zarzis" loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent("Brico Dab " + STORE.mapQuery)}&z=14&output=embed`} />
      </div>
    </div>
  );
}
