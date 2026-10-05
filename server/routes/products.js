"use strict";
const express = require("express");
const db = require("../db");
const { requireAdmin } = require("../auth-utils");

const router = express.Router();

function toJson(p) {
  return {
    id: p.id,
    name: p.name,
    cat: p.category_slug,
    brand: p.brand,
    price: p.price,
    old: p.old_price || undefined,
    img: p.image || undefined,
    tags: JSON.parse(p.tags || "[]"),
    rating: p.rating,
    reviews: p.reviews,
    short: p.short || "",
    feats: JSON.parse(p.features || "[]"),
    specs: JSON.parse(p.specs || "{}"),
    stock: p.stock,
    hidePrice: !!p.hide_price
  };
}

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM products ORDER BY id").all();
  res.json({ products: rows.map(toJson) });
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Produit introuvable." });
  res.json({ product: toJson(row) });
});

function validate(body) {
  if (!body.name || !String(body.name).trim()) return "Le nom est obligatoire.";
  if (!body.cat) return "La catégorie est obligatoire.";
  const price = Number(body.price);
  if (!isFinite(price) || price <= 0) return "Le prix doit être un nombre positif.";
  if (body.old != null && body.old !== "" && Number(body.old) <= price) return "L'ancien prix doit être supérieur au prix actuel.";
  return null;
}

router.post("/", requireAdmin, (req, res) => {
  const err = validate(req.body || {});
  if (err) return res.status(400).json({ error: err });
  const b = req.body;
  const info = db.prepare(`INSERT INTO products
    (name, category_slug, brand, price, old_price, image, tags, short, features, specs, stock, hide_price)
    VALUES (@name, @cat, @brand, @price, @old, @img, @tags, @short, @features, @specs, @stock, @hidePrice)`).run({
    name: String(b.name).trim(), cat: b.cat, brand: b.brand ? String(b.brand).trim() : "Brico Dab",
    price: Number(b.price), old: b.old ? Number(b.old) : null, img: b.img || null,
    tags: JSON.stringify(Array.isArray(b.tags) ? b.tags : []), short: b.short || "",
    features: JSON.stringify(Array.isArray(b.feats) ? b.feats : []), specs: JSON.stringify(b.specs || {}),
    stock: b.stock != null ? Number(b.stock) : 100,
    hidePrice: b.hidePrice ? 1 : 0
  });
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json({ product: toJson(row) });
});

router.put("/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Produit introuvable." });
  const err = validate(req.body || {});
  if (err) return res.status(400).json({ error: err });
  const b = req.body;
  db.prepare(`UPDATE products SET name=@name, category_slug=@cat, brand=@brand, price=@price, old_price=@old,
      image=@img, tags=@tags, short=@short, features=@features, specs=@specs, stock=@stock, hide_price=@hidePrice WHERE id=@id`).run({
    id: req.params.id, name: String(b.name).trim(), cat: b.cat, brand: b.brand ? String(b.brand).trim() : "Brico Dab",
    price: Number(b.price), old: b.old ? Number(b.old) : null, img: b.img || null,
    tags: JSON.stringify(Array.isArray(b.tags) ? b.tags : []), short: b.short || "",
    features: JSON.stringify(Array.isArray(b.feats) ? b.feats : []), specs: JSON.stringify(b.specs || {}),
    stock: b.stock != null ? Number(b.stock) : existing.stock,
    hidePrice: b.hidePrice ? 1 : 0
  });
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  res.json({ product: toJson(row) });
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  if (!info.changes) return res.status(404).json({ error: "Produit introuvable." });
  res.json({ ok: true });
});

module.exports = router;
