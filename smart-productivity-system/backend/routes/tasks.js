const express = require("express");
const pool = require("../database/db");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");
const { taskValidator, commentValidator } = require("../middleware/validators");
const validate = require("../middleware/validate");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const { role, id } = req.user;
    const params = [];
    let query = `SELECT t.id, t.title, t.description, t.assigned_user, t.deadline, t.status, t.created_at, u.name AS assigned_user_name FROM tasks t LEFT JOIN users u ON u.id = t.assigned_user`;
    if (role === "Employee") { query += " WHERE t.assigned_user = $1"; params.push(id); }
    query += " ORDER BY t.created_at DESC";
    const result = await pool.query(query, params);
    return res.json({ success: true, data: result.rows });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to fetch tasks", error: error.message }); }
});

router.post("/", authorizeRoles("Admin", "Manager"), taskValidator, validate, async (req, res) => {
  try {
    const { title, description = null, assigned_user = null, deadline = null, status = "Pending" } = req.body;
    const result = await pool.query(`INSERT INTO tasks (title, description, assigned_user, deadline, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [title, description, assigned_user, deadline, status]);
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to create task", error: error.message }); }
});

router.put("/:id", taskValidator, validate, async (req, res) => {
  try { /* unchanged core logic */
    const taskId = Number(req.params.id); const { role, id: userId } = req.user; const { title, description, assigned_user, deadline, status } = req.body;
    const taskResult = await pool.query("SELECT * FROM tasks WHERE id = $1", [taskId]); if (!taskResult.rows.length) return res.status(404).json({ success: false, message: "Task not found" });
    const existing = taskResult.rows[0]; if (role === "Employee" && existing.assigned_user !== userId) return res.status(403).json({ success: false, message: "Cannot update others' tasks" });
    const result = await pool.query(`UPDATE tasks SET title=$1, description=$2, assigned_user=$3, deadline=$4, status=$5 WHERE id=$6 RETURNING *`, [title ?? existing.title, description ?? existing.description, role === "Employee" ? existing.assigned_user : assigned_user ?? existing.assigned_user, deadline ?? existing.deadline, status ?? existing.status, taskId]);
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to update task", error: error.message }); }
});

router.post("/:id/comments", commentValidator, validate, async (req, res) => {
  try {
    const result = await pool.query(`INSERT INTO task_comments (task_id, user_id, text) VALUES ($1,$2,$3) RETURNING id, task_id, user_id, text, created_at`, [req.params.id, req.user.id, req.body.text]);
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to add comment", error: error.message }); }
});
router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { id: taskId, commentId } = req.params;
    const commentResult = await pool.query("SELECT id, user_id, task_id FROM task_comments WHERE id=$1", [commentId]);
    if (!commentResult.rows.length) return res.status(404).json({ success: false, message: "Comment not found" });

    const comment = commentResult.rows[0];
    if (Number(comment.task_id) !== Number(taskId)) return res.status(404).json({ success: false, message: "Comment not found" });

    const canDelete = Number(comment.user_id) === Number(userId) || role === "Admin" || role === "Manager";
    if (!canDelete) return res.status(403).json({ success: false, message: "Forbidden to delete this comment" });

    await pool.query("DELETE FROM task_comments WHERE id=$1 AND task_id=$2 RETURNING *", [commentId, taskId]);
    return res.json({ success: true, message: "Comment deleted" });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to delete comment", error: error.message }); }
});

router.delete("/:id", authorizeRoles("Admin", "Manager"), async (req, res) => {
  try { const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING id", [req.params.id]); if (!result.rows.length) return res.status(404).json({ success: false, message: "Task not found" }); return res.json({ success: true, message: "Task deleted" }); } catch (error) { return res.status(500).json({ success: false, message: "Failed to delete task", error: error.message }); }
});

module.exports = router;
