"use strict";
const express = require("express");
const db = require("../db");
const { requireAdmin } = require("../auth-utils");

const router = express.Router();
router.use(requireAdmin);

router.get("/stats", (req, res) => {
  const productCount = db.prepare("SELECT COUNT(*) n FROM products").get().n;
  const customerCount = db.prepare("SELECT COUNT(*) n FROM users WHERE role = 'client'").get().n;
  const orderCount = db.prepare("SELECT COUNT(*) n FROM orders").get().n;
  const revenue = db.prepare("SELECT COALESCE(SUM(total), 0) s FROM orders WHERE status != 'annulee'").get().s;
  const pending = db.prepare("SELECT COUNT(*) n FROM orders WHERE status = 'en_attente'").get().n;
  const lowStock = db.prepare("SELECT id, name, stock FROM products WHERE stock <= 5 ORDER BY stock ASC LIMIT 5").all();
  const recentOrders = db.prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 6").all().map((o) => ({ ...o, items: JSON.parse(o.items) }));
  res.json({ productCount, customerCount, orderCount, revenue, pending, lowStock, recentOrders });
});

router.get("/customers", (req, res) => {
  res.json({ customers: db.prepare("SELECT id, name, email, phone, created_at FROM users WHERE role = 'client' ORDER BY id DESC").all() });
});

module.exports = router;
