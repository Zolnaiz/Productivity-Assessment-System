const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const pool = require("../database/db");
const { authMiddleware } = require("../middleware/auth");
const { loginValidator } = require("../middleware/validators");
const validate = require("../middleware/validate");

const router = express.Router();
const attempts = new Map();
const limiter = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const slot = attempts.get(key) || { count: 0, ts: now };
  if (now - slot.ts > 10 * 60 * 1000) { slot.count = 0; slot.ts = now; }
  slot.count += 1;
  attempts.set(key, slot);
  if (slot.count > 30) return res.status(429).json({ success: false, message: "Too many requests" });
  return next();
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

router.post("/login", limiter, loginValidator, validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT id, name, email, password, role, department_id FROM users WHERE email = $1", [email]);
    if (!result.rows.length) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const dbUser = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: dbUser.id, email: dbUser.email, role: dbUser.role, department_id: dbUser.department_id }, process.env.JWT_SECRET, { expiresIn: "8h" });
    return res.json({ success: true, token, user: { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role, department_id: dbUser.department_id } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/forgot-password", limiter, async (req, res) => {
  try {
    const { email } = req.body;
    const userRes = await pool.query("SELECT id, email FROM users WHERE email=$1", [email]);
    if (!userRes.rows.length) return res.json({ success: true, message: "If account exists, reset email sent" });
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);
    await pool.query("UPDATE users SET reset_token=$1, reset_token_expiry=$2 WHERE id=$3", [token, expiry, userRes.rows[0].id]);
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.CLIENT_URL) {
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
      await transporter.sendMail({ from: process.env.EMAIL_USER, to: userRes.rows[0].email, subject: "Password Reset", html: `<p>Click <a href=\"${resetUrl}\">here</a> to reset your password.</p>` });
    }
    return res.json({ success: true, message: "If account exists, reset email sent" });
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Failed to process request" });
  }
});

router.post("/reset-password/:token", limiter, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ success: false, message: "Password too short" });
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(`UPDATE users SET password=$1, reset_token=NULL, reset_token_expiry=NULL WHERE reset_token=$2 AND reset_token_expiry > NOW() RETURNING id`, [hashed, req.params.token]);
    if (!result.rows.length) return res.status(400).json({ success: false, message: "Invalid or expired token" });
    return res.json({ success: true, message: "Password reset successful" });
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Failed to reset password" });
  }
});

router.post("/logout", authMiddleware, (_req, res) => res.json({ success: true, message: "Logged out" }));

module.exports = router;
