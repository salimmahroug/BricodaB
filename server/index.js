/* =========================================================
   Brico Dab Zarzis — API (Express + SQLite)
   Sert uniquement l'API JSON. Le site (Next.js, dossier /web)
   proxifie /api/* vers ce serveur (voir web/next.config.js),
   donc le navigateur ne voit qu'une seule origine et les
   cookies de session fonctionnent normalement.
   ========================================================= */
"use strict";
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { attachUser } = require("./auth-utils");

const app = express();

// Filet de sécurité pour un accès direct à l'API en dev (hors proxy Next.js) :
// autorise l'origine du site Next.js à envoyer des cookies en cross-origin.
app.use(cors({ origin: process.env.WEB_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(attachUser);

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));

app.use((req, res) => res.status(404).json({ error: "Introuvable." }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur serveur." });
});

// API_PORT (pas PORT) : sur un hébergeur comme Render, la plateforme injecte
// un seul PORT partagé par tous les processus du conteneur. Le site (Next.js)
// doit l'utiliser pour être joignable depuis l'extérieur ; l'API, elle,
// n'est appelée qu'en interne (par le proxy Next.js), donc son port est
// indépendant et fixe pour éviter que les deux processus ne se disputent
// le même port.
const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n  Brico Dab Zarzis — API démarrée : http://localhost:${PORT}/api\n`);
});
