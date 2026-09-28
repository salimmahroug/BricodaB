"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { useStore } from "@/components/StoreContext";

export default function RegisterPage() {
  const router = useRouter();
  const { currentUser, userReady, register, toast } = useStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => { if (userReady && currentUser) router.replace("/compte"); }, [userReady, currentUser, router]);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    if (form.name.trim().length < 2) return setErr("Nom invalide.");
    if (form.password.length < 6) return setErr("Le mot de passe doit contenir au moins 6 caractères.");
    setBusy(true);
    const r = await register(form);
    setBusy(false);
    if (!r.ok) { setErr(r.offline ? "Impossible de contacter le serveur. Réessayez plus tard." : r.data?.error || "Inscription impossible."); return; }
    toast(`Compte créé, bienvenue ${r.data.user.name.split(" ")[0]} !`);
    router.push("/compte");
  }

  if (!userReady || currentUser) return null;

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Créer un compte" }]} />
      <div className="box" style={{ maxWidth: 440, margin: "0 auto 48px" }}>
        <h1 className="page-title" style={{ fontSize: 22 }}>Créer un compte</h1>
        {err ? <p style={{ display: "block", marginBottom: 14, background: "#fdeaea", color: "#e53935", padding: "10px 14px", borderRadius: 8, fontSize: 14 }}>{err}</p> : null}
        <form className="form-grid" onSubmit={submit} noValidate>
          <div className="field full"><label>Nom et prénom *</label><input required value={form.name} onChange={set("name")} /></div>
          <div className="field full"><label>E-mail *</label><input type="email" required value={form.email} onChange={set("email")} /></div>
          <div className="field full"><label>Téléphone</label><input type="tel" value={form.phone} onChange={set("phone")} /></div>
          <div className="field full"><label>Mot de passe * <span style={{ fontWeight: 400, color: "var(--muted)" }}>(6 caractères min.)</span></label><input type="password" minLength={6} required value={form.password} onChange={set("password")} /></div>
          <div className="full"><button className="btn btn-yellow btn-block" type="submit" disabled={busy}>{busy ? "Création…" : "Créer mon compte"}</button></div>
        </form>
        <p style={{ marginTop: 16, fontSize: 14, color: "var(--muted)" }}>Déjà un compte ? <Link href="/connexion" style={{ color: "var(--yellow-dark)", fontWeight: 600 }}>Se connecter</Link></p>
      </div>
    </div>
  );
}
