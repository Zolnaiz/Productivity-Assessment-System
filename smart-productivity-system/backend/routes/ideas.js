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
  const client = await pool.connect();
  let isTransactionOpen = false;
  try {
    const ideaId = req.params.idea_id;
    const userId = req.user.id;

    const existingVoteResult = await client.query(
      `SELECT 1 FROM idea_votes WHERE idea_id = $1 AND user_id = $2 LIMIT 1`,
      [ideaId, userId]
    );

    if (existingVoteResult.rows.length) {
      return res.status(409).json({
        success: false,
        message: "You have already voted for this idea",
        policy: "duplicate_vote_returns_409"
      });
    }

    await client.query("BEGIN");
    isTransactionOpen = true;

    const voteInsertResult = await client.query(
      `INSERT INTO idea_votes (idea_id, user_id) VALUES ($1, $2) RETURNING idea_id`,
      [ideaId, userId]
    );

    if (!voteInsertResult.rows.length) {
      throw new Error("Failed to register vote");
    }

    const ideaUpdateResult = await client.query(
      `UPDATE improvement_ideas
       SET votes = votes + 1
       WHERE id = $1
       RETURNING *`,
      [ideaId]
    );

    if (!ideaUpdateResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Idea not found" });
    }

    await client.query("COMMIT");
    isTransactionOpen = false;
    return res.json({
      success: true,
      data: ideaUpdateResult.rows[0],
      policy: "duplicate_vote_returns_409"
    });
  } catch (error) {
    if (isTransactionOpen) {
      await client.query("ROLLBACK");
    }

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "You have already voted for this idea",
        policy: "duplicate_vote_returns_409"
      });
    }

    return res.status(500).json({ success: false, message: "Failed to vote", error: error.message });
  } finally {
    client.release();
  }
});

module.exports = router;
