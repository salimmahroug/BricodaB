/* =========================================================
   Brico Dab Zarzis — base de données (SQLite via better-sqlite3)
   Le fichier server/data/bricodab.db est créé et rempli
   automatiquement au premier démarrage à partir de
   server/data/seed.json (catalogue initial).
   ========================================================= */
"use strict";
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "bricodab.db");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    brand TEXT,
    price REAL NOT NULL,
    old_price REAL,
    image TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    rating INTEGER NOT NULL DEFAULT 5,
    reviews INTEGER NOT NULL DEFAULT 0,
    short TEXT,
    features TEXT NOT NULL DEFAULT '[]',
    specs TEXT NOT NULL DEFAULT '{}',
    stock INTEGER NOT NULL DEFAULT 100,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_slug) REFERENCES categories(slug)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    items TEXT NOT NULL,
    subtotal REAL NOT NULL,
    shipping REAL NOT NULL,
    total REAL NOT NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    gouvernorat TEXT,
    ville TEXT,
    adresse TEXT,
    mode TEXT NOT NULL DEFAULT 'livraison',
    note TEXT,
    status TEXT NOT NULL DEFAULT 'en_attente',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

/* ---------------- Amorçage (première exécution uniquement) ---------------- */
function seedIfEmpty() {
  const catCount = db.prepare("SELECT COUNT(*) n FROM categories").get().n;
  if (catCount === 0) {
    const seed = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "seed.json"), "utf8"));
    const insCat = db.prepare("INSERT INTO categories (slug, name, icon, description) VALUES (@slug, @name, @icon, @desc)");
    // Les id des produits d'amorçage sont conservés tels quels (101, 201, 301…) :
    // plusieurs liens du site (bannières d'accueil, etc.) pointent vers ces id précis.
    const insProd = db.prepare(`INSERT INTO products
      (id, name, category_slug, brand, price, old_price, image, tags, rating, reviews, short, features, specs, stock)
      VALUES (@id, @name, @cat, @brand, @price, @old, @img, @tags, @rating, @reviews, @short, @features, @specs, @stock)`);
    const tx = db.transaction(() => {
      seed.categories.forEach((c) => insCat.run(c));
      seed.products.forEach((p) => insProd.run({
        id: p.id, name: p.name, cat: p.cat, brand: p.brand, price: p.price, old: p.old || null,
        img: p.img || null, tags: JSON.stringify(p.tags || []), rating: p.rating || 5, reviews: p.reviews || 0,
        short: p.short || "", features: JSON.stringify(p.feats || []), specs: JSON.stringify(p.specs || {}),
        stock: p.stock === 0 ? 0 : 100
      }));
      // La prochaine insertion (via le tableau de bord admin) continuera après le plus grand id du catalogue.
      const maxId = db.prepare("SELECT MAX(id) m FROM products").get().m || 0;
      db.prepare("INSERT OR REPLACE INTO sqlite_sequence (name, seq) VALUES ('products', ?)").run(maxId);
    });
    tx();
    console.log(`[db] Catalogue initial importé : ${seed.categories.length} catégories, ${seed.products.length} produits.`);
  }

  const adminCount = db.prepare("SELECT COUNT(*) n FROM users WHERE role = 'admin'").get().n;
  if (adminCount === 0) {
    const email = process.env.ADMIN_EMAIL || "admin@bricodab.tn";
    const pass = process.env.ADMIN_PASSWORD || "admin123";
    const hash = bcrypt.hashSync(pass, 10);
    db.prepare("INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'admin')")
      .run("Administrateur", email, "26118124", hash);
    console.log(`[db] Compte admin créé → ${email} / ${pass}  ⚠️  à changer immédiatement après la première connexion.`);
  }
}
seedIfEmpty();

module.exports = db;
