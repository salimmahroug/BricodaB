"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const fmtDate = (s) => new Date(s).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function CustomersPage() {
  const [customers, setCustomers] = useState(null);
  useEffect(() => { apiFetch("/api/admin/customers").then((r) => setCustomers(r.ok ? r.data.customers : [])); }, []);
  if (customers === null) return <p className="muted">Chargement…</p>;

  return (
    <div className="panel">
      <div className="panel-head"><h3>{customers.length} client(s) inscrit(s)</h3></div>
      <div className="panel-body" style={{ overflow: "auto" }}>
        <table>
          <thead><tr><th>Nom</th><th>E-mail</th><th>Téléphone</th><th>Inscrit le</th></tr></thead>
          <tbody>
            {customers.length ? customers.map((c) => (
              <tr key={c.id}><td>{c.name}</td><td>{c.email}</td><td>{c.phone || "—"}</td><td>{fmtDate(c.created_at)}</td></tr>
            )) : <tr className="empty-row"><td colSpan={4}>Aucun client inscrit pour le moment.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
