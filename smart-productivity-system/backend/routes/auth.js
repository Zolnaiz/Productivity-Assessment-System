const express = require("express");
const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const bcrypt = require("bcryptjs");
const pool = require("../database/db");
const { authMiddleware } = require("../middleware/auth");
=======
const bcrypt = require("bcrypt");
const pool = require("../database/db");
>>>>>>> origin/main

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

<<<<<<< HEAD
    const result = await pool.query(
      "SELECT id, name, email, password, role, department_id FROM users WHERE email = $1",
      [email]
    );
=======
    const result = await pool.query("SELECT id, name, email, password, role FROM users WHERE email = $1", [email]);
>>>>>>> origin/main

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const dbUser = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
<<<<<<< HEAD
      { id: dbUser.id, email: dbUser.email, role: dbUser.role, department_id: dbUser.department_id },
=======
      {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
      },
>>>>>>> origin/main
      process.env.JWT_SECRET || "super-secret-key",
      { expiresIn: "8h" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
<<<<<<< HEAD
        department_id: dbUser.department_id,
=======
>>>>>>> origin/main
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

<<<<<<< HEAD
router.post("/logout", authMiddleware, (_req, res) => {
  return res.json({ success: true, message: "Logged out on client side. Remove token from storage." });
});

=======
>>>>>>> origin/main
module.exports = router;
