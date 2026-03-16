const express = require("express");
const pool = require("../database/db");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (_req, res) => {
  const result = await pool.query(
    `SELECT a.*, d.name AS department_name
     FROM audits a JOIN departments d ON d.id = a.department_id
     ORDER BY a.date DESC, a.id DESC`
  );
  return res.json({ success: true, data: result.rows });
});

router.post("/", authorizeRoles("Admin", "Manager", "Employee"), async (req, res) => {
  const { department_id, score, date = null, images = [] } = req.body;
  if (!department_id || score === undefined) {
    return res.status(400).json({ success: false, message: "department_id and score are required" });
  }

  const result = await pool.query(
    `INSERT INTO audits (department_id, score, date, images)
     VALUES ($1,$2,COALESCE($3, CURRENT_DATE),$4)
     RETURNING *`,
    [department_id, score, date, images]
  );

  return res.status(201).json({ success: true, data: result.rows[0] });
});

module.exports = router;
