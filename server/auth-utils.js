"use strict";
const jwt = require("jsonwebtoken");

// En production, définissez JWT_SECRET dans l'environnement (voir README).
const SECRET = process.env.JWT_SECRET || "brico-dab-zarzis-dev-secret-changez-moi";
const COOKIE = "bd_session";

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, SECRET, { expiresIn: "30d" });
}

function setSessionCookie(res, user) {
  res.cookie(COOKIE, signToken(user), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production"
  });
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE);
}

// Attache req.user si un cookie de session valide est présent (sans bloquer la requête).
function attachUser(req, res, next) {
  const token = req.cookies && req.cookies[COOKIE];
  if (token) {
    try { req.user = jwt.verify(token, SECRET); } catch (e) { /* cookie invalide/expiré : ignoré */ }
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Connexion requise." });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") return res.status(403).json({ error: "Accès réservé à l'administrateur." });
  next();
}

module.exports = { signToken, setSessionCookie, clearSessionCookie, attachUser, requireAuth, requireAdmin, COOKIE };
