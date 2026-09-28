"use strict";
const express = require("express");
const db = require("../db");
const { requireAdmin } = require("../auth-utils");

const router = express.Router();
const STATUSES = ["en_attente", "confirmee", "livree", "annulee"];

function formatOrder(o) { return { ...o, items: JSON.parse(o.items) }; }
function genOrderNumber() { return "BD" + Date.now().toString().slice(-8); }

router.post("/", (req, res) => {
  const b = req.body || {};
  if (!Array.isArray(b.items) || !b.items.length) return res.status(400).json({ error: "Le panier est vide." });
  if (!b.client_name || !String(b.client_name).trim()) return res.status(400).json({ error: "Le nom est obligatoire." });
  if (!b.client_phone || !/^[0-9 +]{8,15}$/.test(String(b.client_phone).trim())) return res.status(400).json({ error: "Numéro de téléphone invalide." });
  if (b.mode !== "magasin" && (!b.adresse || !String(b.adresse).trim())) return res.status(400).json({ error: "L'adresse est obligatoire pour une livraison." });

  const subtotal = b.items.reduce((s, l) => s + Number(l.price) * Number(l.qty), 0);
  const shipping = Number(b.shipping) || 0;
  const orderNumber = genOrderNumber();

  const info = db.prepare(`INSERT INTO orders
    (order_number, user_id, items, subtotal, shipping, total, client_name, client_phone, gouvernorat, ville, adresse, mode, note)
    VALUES (@num, @uid, @items, @subtotal, @shipping, @total, @name, @phone, @gouv, @ville, @adresse, @mode, @note)`).run({
    num: orderNumber, uid: req.user ? req.user.id : null, items: JSON.stringify(b.items),
    subtotal, shipping, total: subtotal + shipping,
    name: String(b.client_name).trim(), phone: String(b.client_phone).trim(),
    gouv: b.gouvernorat || null, ville: b.ville || null, adresse: b.adresse || null,
    mode: b.mode === "magasin" ? "magasin" : "livraison", note: b.note || null
  });
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json({ order: formatOrder(row) });
});

router.get("/", requireAdmin, (req, res) => {
  res.json({ orders: db.prepare("SELECT * FROM orders ORDER BY id DESC").all().map(formatOrder) });
});

router.patch("/:id", requireAdmin, (req, res) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) return res.status(400).json({ error: "Statut invalide." });
  const info = db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
  if (!info.changes) return res.status(404).json({ error: "Commande introuvable." });
  res.json({ order: formatOrder(db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id)) });
});

module.exports = router;
