const express = require("express");
const pool = require("../database/db");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, u.name AS submitted_by
       FROM improvement_ideas i JOIN users u ON u.id = i.user_id
       ORDER BY i.votes DESC, i.id DESC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch ideas", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: "title/description required" });
    }

    const result = await pool.query(
      `INSERT INTO improvement_ideas (title, description, votes, user_id)
       VALUES ($1,$2,0,$3) RETURNING *`,
      [title, description, req.user.id]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create idea", error: error.message });
  }
});

router.post("/vote/:idea_id", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE improvement_ideas SET votes = votes + 1 WHERE id=$1 RETURNING *`,
      [req.params.idea_id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: "Idea not found" });
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to vote", error: error.message });
  }
});

module.exports = router;
