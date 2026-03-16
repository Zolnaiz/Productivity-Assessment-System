const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../database/db");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", authorizeRoles("Admin"), async (_req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role, department_id, created_at FROM users ORDER BY id DESC");
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
});

router.post("/", authorizeRoles("Admin"), async (req, res) => {
  try {
    const { name, email, password, role = "Employee", department_id = null } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "name/email/password required" });
    }

    const allowedRoles = ["Admin", "Manager", "Employee"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, department_id)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id,name,email,role,department_id,created_at`,
      [name, email, hashed, role, department_id]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create user", error: error.message });
  }
});

router.put("/:id", authorizeRoles("Admin"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    if (!existing.rows.length) return res.status(404).json({ success: false, message: "User not found" });

    const u = existing.rows[0];
    const { name, email, role, department_id } = req.body;
    if (role) {
      const allowedRoles = ["Admin", "Manager", "Employee"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ success: false, message: "Invalid role" });
      }
    }

    const result = await pool.query(
      `UPDATE users SET name=$1,email=$2,role=$3,department_id=$4 WHERE id=$5 RETURNING id,name,email,role,department_id,created_at`,
      [name ?? u.name, email ?? u.email, role ?? u.role, department_id ?? u.department_id, id]
    );
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update user", error: error.message });
  }
});

router.delete("/:id", authorizeRoles("Admin"), async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING id", [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
  }
});

module.exports = router;
