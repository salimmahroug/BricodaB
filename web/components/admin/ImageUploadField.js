"use client";
import { useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { resolveImg } from "@/lib/format";
import { useAdmin } from "./AdminContext";

/** Champ image d'un formulaire admin : upload de fichier (avec aperçu) + champ
 *  caché "name" qui porte la valeur réellement soumise avec le formulaire. */
export default function ImageUploadField({ name, defaultValue, label = "Image" }) {
  const { toast } = useAdmin();
  const [value, setValue] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await apiFetch("/api/upload", { method: "POST", body: fd, headers: {} }); // pas de Content-Type manuel : le navigateur fixe le boundary multipart
    setBusy(false);
    if (!r.ok) { toast(r.data?.error || "Échec de l'envoi de l'image.", true); return; }
    setValue(r.data.url);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="field full img-field">
      <label>{label}</label>
      <input type="hidden" name={name} value={value} readOnly />
      <div className="img-field-row">
        {value ? <img className="img-preview" src={resolveImg(value)} alt="" /> : <div className="img-preview empty">–</div>}
        <div className="img-field-controls">
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onFile} disabled={busy} />
          <input
            type="text" placeholder="…ou collez une URL / un chemin (assets/img/…)" value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {value ? <button type="button" className="btn btn-sm" onClick={() => setValue("")}>Retirer</button> : null}
        </div>
      </div>
      {busy ? <span className="muted small">Envoi en cours…</span> : null}
    </div>
  );
}
