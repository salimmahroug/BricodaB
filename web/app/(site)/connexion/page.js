"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { useStore } from "@/components/StoreContext";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, userReady, login, toast } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (userReady && currentUser) router.replace("/compte"); }, [userReady, currentUser, router]);

  async function submit(e) {
    e.preventDefault();
    setErr(null); setBusy(true);
    const r = await login(email, password);
    setBusy(false);
    if (!r.ok) { setErr(r.offline ? "Impossible de contacter le serveur. Réessayez plus tard." : r.data?.error || "Connexion impossible."); return; }
    toast(`Bienvenue ${r.data.user.name.split(" ")[0]} !`);
    router.push("/compte");
  }

  if (!userReady || currentUser) return null;

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Connexion" }]} />
      <div className="box" style={{ maxWidth: 440, margin: "0 auto 48px" }}>
        <h1 className="page-title" style={{ fontSize: 22 }}>Connexion</h1>
        {err ? <p style={{ display: "block", marginBottom: 14, background: "#fdeaea", color: "#e53935", padding: "10px 14px", borderRadius: 8, fontSize: 14 }}>{err}</p> : null}
        <form className="form-grid" onSubmit={submit} noValidate>
          <div className="field full"><label>E-mail *</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="field full"><label>Mot de passe *</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div className="full"><button className="btn btn-yellow btn-block" type="submit" disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button></div>
        </form>
        <p style={{ marginTop: 16, fontSize: 14, color: "var(--muted)" }}>Pas encore de compte ? <Link href="/inscription" style={{ color: "var(--yellow-dark)", fontWeight: 600 }}>Créer un compte</Link></p>
      </div>
    </div>
  );
}
