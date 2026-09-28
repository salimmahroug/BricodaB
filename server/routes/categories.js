"use strict";
const express = require("express");
const db = require("../db");
const { requireAdmin } = require("../auth-utils");

const router = express.Router();
const slugify = (s) => String(s).toLowerCase().trim()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

router.get("/", (req, res) => {
  res.json({ categories: db.prepare("SELECT * FROM categories ORDER BY id").all() });
});

router.post("/", requireAdmin, (req, res) => {
  const { name, icon, description } = req.body || {};
  if (!name || !String(name).trim()) return res.status(400).json({ error: "Le nom est obligatoire." });
  const slug = slugify(name);
  if (!slug) return res.status(400).json({ error: "Nom de catégorie invalide." });
  if (db.prepare("SELECT id FROM categories WHERE slug = ?").get(slug)) return res.status(409).json({ error: "Cette catégorie existe déjà." });
  const info = db.prepare("INSERT INTO categories (slug, name, icon, description) VALUES (?, ?, ?, ?)")
    .run(slug, String(name).trim(), icon || "box", description || "");
  res.status(201).json({ category: db.prepare("SELECT * FROM categories WHERE id = ?").get(info.lastInsertRowid) });
});

router.put("/:slug", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM categories WHERE slug = ?").get(req.params.slug);
  if (!existing) return res.status(404).json({ error: "Catégorie introuvable." });
  const { name, icon, description } = req.body || {};
  db.prepare("UPDATE categories SET name = ?, icon = ?, description = ? WHERE slug = ?")
    .run(name ? String(name).trim() : existing.name, icon || existing.icon, description ?? existing.description, req.params.slug);
  res.json({ category: db.prepare("SELECT * FROM categories WHERE slug = ?").get(req.params.slug) });
});

router.delete("/:slug", requireAdmin, (req, res) => {
  const used = db.prepare("SELECT COUNT(*) n FROM products WHERE category_slug = ?").get(req.params.slug).n;
  if (used > 0) return res.status(409).json({ error: `Impossible de supprimer : ${used} produit(s) utilisent encore cette catégorie.` });
  const info = db.prepare("DELETE FROM categories WHERE slug = ?").run(req.params.slug);
  if (!info.changes) return res.status(404).json({ error: "Catégorie introuvable." });
  res.json({ ok: true });
});

module.exports = router;
