"use strict";
const express = require("express");
const db = require("../db");
const { requireAdmin } = require("../auth-utils");

const router = express.Router();
const ZONES = ["slider", "mini", "promo"];

function toJson(b) {
  return { ...b, active: !!b.active };
}

router.get("/", (req, res) => {
  const zone = req.query.zone;
  const rows = zone
    ? db.prepare("SELECT * FROM banners WHERE zone = ? AND active = 1 ORDER BY position ASC, id ASC").all(zone)
    : db.prepare("SELECT * FROM banners ORDER BY zone ASC, position ASC, id ASC").all();
  res.json({ banners: rows.map(toJson) });
});

function validate(body) {
  if (!body.zone || !ZONES.includes(body.zone)) return `Zone invalide (attendu : ${ZONES.join(", ")}).`;
  return null;
}

const FIELDS = ["zone", "position", "kicker", "title", "highlight", "subtitle", "body", "ar_text", "image", "link", "cta", "style"];
function pick(body) {
  const out = {};
  FIELDS.forEach((f) => { out[f] = body[f] ?? null; });
  out.position = Number(out.position) || 0;
  out.style = out.style || "";
  return out;
}

router.post("/", requireAdmin, (req, res) => {
  const err = validate(req.body || {});
  if (err) return res.status(400).json({ error: err });
  const b = pick(req.body);
  const info = db.prepare(`INSERT INTO banners
    (zone, position, kicker, title, highlight, subtitle, body, ar_text, image, link, cta, style)
    VALUES (@zone, @position, @kicker, @title, @highlight, @subtitle, @body, @ar_text, @image, @link, @cta, @style)`).run(b);
  res.status(201).json({ banner: toJson(db.prepare("SELECT * FROM banners WHERE id = ?").get(info.lastInsertRowid)) });
});

router.put("/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM banners WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Bannière introuvable." });
  const err = validate(req.body || {});
  if (err) return res.status(400).json({ error: err });
  const b = pick(req.body);
  db.prepare(`UPDATE banners SET zone=@zone, position=@position, kicker=@kicker, title=@title, highlight=@highlight,
      subtitle=@subtitle, body=@body, ar_text=@ar_text, image=@image, link=@link, cta=@cta, style=@style,
      active=@active WHERE id=@id`).run({ ...b, active: req.body.active === false ? 0 : 1, id: req.params.id });
  res.json({ banner: toJson(db.prepare("SELECT * FROM banners WHERE id = ?").get(req.params.id)) });
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM banners WHERE id = ?").run(req.params.id);
  if (!info.changes) return res.status(404).json({ error: "Bannière introuvable." });
  res.json({ ok: true });
});

module.exports = router;
