/* =========================================================
   Brico Dab Zarzis — serveur (site + API + tableau de bord admin)
   ========================================================= */
"use strict";
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const { attachUser } = require("./auth-utils");

const ROOT = path.join(__dirname, "..");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(attachUser);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));

// Site public (racine du dépôt) et tableau de bord admin (/admin)
app.use(express.static(ROOT, { index: "index.html" }));
app.use("/admin", express.static(path.join(ROOT, "admin"), { index: "index.html" }));

app.use((req, res) => res.status(404).json({ error: "Introuvable." }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur serveur." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  Brico Dab Zarzis — serveur démarré : http://localhost:${PORT}`);
  console.log(`  Tableau de bord admin              : http://localhost:${PORT}/admin\n`);
});
