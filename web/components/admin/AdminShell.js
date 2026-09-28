"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { useAdmin } from "./AdminContext";

const NAV = [
  { href: "/admin", label: "Tableau de bord", ic: "📊" },
  { href: "/admin/produits", label: "Produits", ic: "📦" },
  { href: "/admin/commandes", label: "Commandes", ic: "🧾" },
  { href: "/admin/clients", label: "Clients", ic: "👥" },
  { href: "/admin/categories", label: "Catégories", ic: "🏷️" }
];

export default function AdminShell({ children }) {
  const { me, ready, logout, toastMsg, toastErr } = useAdmin();
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  if (!ready) return null;
  if (!me) return <LoginScreen />;

  return (
    <div className="admin-app">
      <aside className={`sidebar ${navOpen ? "open" : ""}`}>
        <div className="side-logo"><Logo dark /></div>
        <nav>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={pathname === n.href ? "active" : ""} onClick={() => setNavOpen(false)}>
              {n.ic} <span>{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="side-foot">
          <a href="/" target="_blank" rel="noopener noreferrer">↗ Voir le site</a>
          <button onClick={logout}>Se déconnecter</button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <button className="mob-toggle" aria-label="Menu" onClick={() => setNavOpen((o) => !o)}>☰</button>
          <h2>{NAV.find((n) => n.href === pathname)?.label || "Tableau de bord"}</h2>
          <span className="who">{me.name} · {me.email}</span>
        </header>
        <main className="content">{children}</main>
      </div>
      <div className={`toast ${toastMsg ? "show" : ""} ${toastErr ? "err" : ""}`}>{toastMsg}</div>
    </div>
  );
}

function LoginScreen() {
  const { login } = useAdmin();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(null); setBusy(true);
    const r = await login(email, pass);
    setBusy(false);
    if (!r.ok) setErr(r.error);
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={submit} noValidate>
        <div className="login-logo"><Logo /></div>
        <h1>Tableau de bord</h1>
        <p className="muted">Connexion réservée à l&apos;administrateur.</p>
        {err ? <div className="login-error">{err}</div> : null}
        <div className="field"><label>E-mail</label><input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><label>Mot de passe</label><input type="password" required autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} /></div>
        <button className="btn-primary" type="submit" disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
        <p className="muted small">Compte créé automatiquement au premier démarrage du serveur (voir le README du projet).</p>
        <a className="back-link" href="/">← Retour au site</a>
      </form>
    </div>
  );
}
