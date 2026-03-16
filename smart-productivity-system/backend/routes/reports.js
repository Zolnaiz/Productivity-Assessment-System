const express = require("express");
const pool = require("../database/db");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");
const { generateTasksPdfBuffer } = require("../utils/pdf");

const router = express.Router();
router.use(authMiddleware, authorizeRoles("Admin", "Manager"));

const fetchTasks = async () => {
  const result = await pool.query(
    `SELECT t.id, t.title, t.status, t.deadline, u.name as assigned_user
     FROM tasks t LEFT JOIN users u ON u.id = t.assigned_user
     ORDER BY t.id DESC`
  );
  return result.rows;
};

router.get("/tasks.csv", async (_req, res) => {
  const rowsData = await fetchTasks();
  const header = "id,title,status,deadline,assigned_user";
  const rows = rowsData.map((r) =>
    [r.id, r.title, r.status, r.deadline ? new Date(r.deadline).toISOString() : "", r.assigned_user || ""]
      .map((v) => `"${String(v).replaceAll('"', '""')}"`)
      .join(",")
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=tasks-report.csv");
  return res.send([header, ...rows].join("\n"));
});

router.get("/tasks.pdf", async (_req, res) => {
  const rowsData = await fetchTasks();
  const pdfBuffer = generateTasksPdfBuffer(rowsData);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=tasks-report.pdf");
  return res.send(pdfBuffer);
});

module.exports = router;
