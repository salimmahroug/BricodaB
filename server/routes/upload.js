"use strict";
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const express = require("express");
const multer = require("multer");
const { requireAdmin } = require("../auth-utils");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, crypto.randomBytes(10).toString("hex") + (ALLOWED[file.mimetype] || ""))
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
  fileFilter: (req, file, cb) => cb(null, !!ALLOWED[file.mimetype])
});

const router = express.Router();

router.post("/", requireAdmin, (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message === "File too large" ? "Image trop lourde (5 Mo max)." : "Fichier invalide (JPG, PNG, WEBP ou GIF uniquement)." });
    if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu." });
    // URL publique complète : le front (sur un autre domaine, ex. Vercel) affiche
    // l'image directement depuis l'API, pas besoin de proxy pour un <img>.
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(201).json({ url });
  });
});

module.exports = router;
