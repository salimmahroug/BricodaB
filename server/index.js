/* =========================================================
   Brico Dab Zarzis — API (Express + SQLite)
   Sert uniquement l'API JSON. Le site (Next.js, dossier /web)
   proxifie /api/* vers ce serveur (voir web/next.config.js),
   donc le navigateur ne voit qu'une seule origine et les
   cookies de session fonctionnent normalement.
   ========================================================= */
"use strict";
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { attachUser } = require("./auth-utils");

const app = express();
// Render (et la plupart des PaaS) terminent le HTTPS et transmettent en HTTP
// en interne : sans ceci, req.protocol vaudrait toujours "http", ce qui
// casserait les URL d'images générées par /api/upload.
app.set("trust proxy", true);

// Filet de sécurité pour un accès direct à l'API en dev (hors proxy Next.js) :
// autorise l'origine du site Next.js à envoyer des cookies en cross-origin.
app.use(cors({ origin: process.env.WEB_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(attachUser);

// Images envoyées depuis le formulaire produit/bannière de l'admin.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/banners", require("./routes/banners"));
app.use("/api/upload", require("./routes/upload"));

app.use((req, res) => res.status(404).json({ error: "Introuvable." }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur serveur." });
});

// Deux façons de déployer cette API, donc deux façons de choisir le port :
// - Service combiné (API + site Next.js dans le même conteneur, un seul
//   PORT public partagé) : API_PORT est défini explicitement (ex. 4000)
//   pour que l'API n'entre pas en collision avec Next.js sur le PORT public.
// - Service API seule (ex. sur Render, séparé du site hébergé sur Vercel) :
//   aucun API_PORT n'est défini, donc l'API utilise directement le PORT
//   fourni par la plateforme pour être joignable depuis l'extérieur.
const PORT = process.env.API_PORT || process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n  Brico Dab Zarzis — API démarrée : http://localhost:${PORT}/api\n`);
});
