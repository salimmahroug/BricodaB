export function readLocal(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem("bricodab_" + key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) { return fallback; }
}
export function writeLocal(key, value) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem("bricodab_" + key, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ }
}
