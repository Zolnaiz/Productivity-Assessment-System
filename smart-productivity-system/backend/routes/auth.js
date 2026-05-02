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
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

router.post("/login", loginValidator, validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      "SELECT id, name, email, password, role, department_id FROM users WHERE email = $1",
      [email]
    );
    if (!result.rows.length) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const dbUser = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: dbUser.id, email: dbUser.email, role: dbUser.role, department_id: dbUser.department_id },
      process.env.JWT_SECRET || "super-secret-key",
      { expiresIn: "8h" }
    );

    return res.json({ success: true, token, user: { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role, department_id: dbUser.department_id } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const userRes = await pool.query("SELECT id, email FROM users WHERE email=$1", [email]);
    if (!userRes.rows.length) return res.status(404).json({ success: false, message: "No user found" });
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);
    await pool.query("UPDATE users SET reset_token=$1, reset_token_expiry=$2 WHERE id=$3", [token, expiry, userRes.rows[0].id]);
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await transporter.sendMail({ from: process.env.EMAIL_USER, to: userRes.rows[0].email, subject: "Password Reset", html: `<p>Click <a href=\"${resetUrl}\">here</a> to reset your password.</p>` });
    return res.json({ success: true, message: "Reset email sent" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to send reset email", error: error.message });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `UPDATE users SET password=$1, reset_token=NULL, reset_token_expiry=NULL
       WHERE reset_token=$2 AND reset_token_expiry > NOW() RETURNING id`,
      [hashed, token]
    );
    if (!result.rows.length) return res.status(400).json({ success: false, message: "Invalid or expired token" });
    return res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to reset password", error: error.message });
  }
});

router.post("/logout", authMiddleware, (_req, res) => res.json({ success: true, message: "Logged out" }));

module.exports = router;
