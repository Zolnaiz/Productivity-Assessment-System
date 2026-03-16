const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../database/db");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", authorizeRoles("Admin"), async (_req, res) => {
  const result = await pool.query(
    "SELECT id, name, email, role, department_id, created_at FROM users ORDER BY id DESC"
  );
  return res.json({ success: true, data: result.rows });
});

router.post("/", authorizeRoles("Admin"), async (req, res) => {
  const { name, email, password, role = "Employee", department_id = null } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: "name/email/password required" });
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, department_id)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id,name,email,role,department_id,created_at`,
    [name, email, hashed, role, department_id]
  );
  return res.status(201).json({ success: true, data: result.rows[0] });
});

router.put("/:id", authorizeRoles("Admin"), async (req, res) => {
  const id = Number(req.params.id);
  const existing = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  if (!existing.rows.length) return res.status(404).json({ success: false, message: "User not found" });
  const u = existing.rows[0];
  const { name, email, role, department_id } = req.body;
  const result = await pool.query(
    `UPDATE users SET name=$1,email=$2,role=$3,department_id=$4 WHERE id=$5 RETURNING id,name,email,role,department_id,created_at`,
    [name ?? u.name, email ?? u.email, role ?? u.role, department_id ?? u.department_id, id]
  );
  return res.json({ success: true, data: result.rows[0] });
});

router.delete("/:id", authorizeRoles("Admin"), async (req, res) => {
  const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING id", [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ success: false, message: "User not found" });
  return res.json({ success: true, message: "User deleted" });
});

module.exports = router;
