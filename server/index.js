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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n  Brico Dab Zarzis — API démarrée : http://localhost:${PORT}/api\n`);
});
