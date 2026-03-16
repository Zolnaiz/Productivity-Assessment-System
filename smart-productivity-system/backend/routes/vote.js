const express = require("express");
const pool = require("../database/db");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.post("/:idea_id", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE improvement_ideas SET votes = votes + 1 WHERE id=$1 RETURNING *`,
      [req.params.idea_id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Idea not found" });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to vote", error: error.message });
  }
});

module.exports = router;
