const express = require("express");
const pool = require("../database/db");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, d.name AS department_name
       FROM audits a JOIN departments d ON d.id = a.department_id
       ORDER BY a.date DESC, a.id DESC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch audits", error: error.message });
  }
});

router.post("/", authorizeRoles("Admin", "Manager", "Employee"), async (req, res) => {
  try {
    const { department_id, score, date = null, images = [] } = req.body;
    if (!department_id || score === undefined) {
      return res.status(400).json({ success: false, message: "department_id and score are required" });
    }

    const numericScore = Number(score);
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      return res.status(400).json({ success: false, message: "score must be between 0 and 100" });
    }

    const result = await pool.query(
      `INSERT INTO audits (department_id, score, date, images)
       VALUES ($1,$2,COALESCE($3, CURRENT_DATE),$4)
       RETURNING *`,
      [department_id, numericScore, date, Array.isArray(images) ? images : []]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create audit", error: error.message });
  }
});

module.exports = router;
