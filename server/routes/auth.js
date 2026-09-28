"use strict";
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { setSessionCookie, clearSessionCookie, requireAuth } = require("../auth-utils");

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(u) { return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role }; }

router.post("/register", (req, res) => {
  const { name, email, phone, password } = req.body || {};
  if (!name || !String(name).trim() || String(name).trim().length < 2) return res.status(400).json({ error: "Nom invalide." });
  if (!email || !EMAIL_RE.test(String(email).trim())) return res.status(400).json({ error: "E-mail invalide." });
  if (!password || String(password).length < 6) return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });

  const emailNorm = String(email).trim().toLowerCase();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(emailNorm);
  if (existing) return res.status(409).json({ error: "Un compte existe déjà avec cet e-mail." });

  const hash = bcrypt.hashSync(String(password), 10);
  const info = db.prepare("INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'client')")
    .run(String(name).trim(), emailNorm, phone ? String(phone).trim() : null, hash);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
  setSessionCookie(res, user);
  res.status(201).json({ user: publicUser(user) });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "E-mail et mot de passe requis." });
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(String(email).trim().toLowerCase());
  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return res.status(401).json({ error: "E-mail ou mot de passe incorrect." });
  }
  setSessionCookie(res, user);
  res.json({ user: publicUser(user) });
});

router.post("/logout", (req, res) => { clearSessionCookie(res); res.json({ ok: true }); });

router.get("/me", (req, res) => {
  if (!req.user) return res.json({ user: null });
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.json({ user: null });
  res.json({ user: publicUser(user) });
});

router.get("/orders", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC").all(req.user.id);
  res.json({ orders: rows.map(formatOrder) });
});

function formatOrder(o) {
  return { ...o, items: JSON.parse(o.items) };
}

module.exports = router;
