// Petit client HTTP pour l'API. Comme Next.js proxifie /api/* vers Express
// (voir next.config.js), on appelle simplement des chemins relatifs : le
// navigateur ne voit qu'une seule origine et les cookies suivent normalement.
export async function apiFetch(path, opts = {}) {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...opts
  });
  let data = null;
  try { data = await res.json(); } catch (e) { /* pas de corps JSON */ }
  return { ok: res.ok, status: res.status, data };
}
