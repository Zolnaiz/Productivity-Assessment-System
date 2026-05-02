const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");
const auditRoutes = require("./routes/audits");
const ideaRoutes = require("./routes/ideas");
const reportRoutes = require("./routes/reports");
const voteRoutes = require("./routes/vote");
const departmentRoutes = require("./routes/departments");
const settingsRoutes = require("./routes/settings");
const auditLogRoutes = require("./routes/audit");

dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}
require("./services/cronService");

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:19006").split(",");

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/audits", auditRoutes);
app.use("/ideas", ideaRoutes);
app.use("/reports", reportRoutes);
app.use("/vote", voteRoutes);
app.use("/departments", departmentRoutes);
app.use("/settings", settingsRoutes);
app.use("/audit", auditLogRoutes);

app.use((err, _req, res, _next) => {
  return res.status(500).json({ success: false, message: err.message || "Server error" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
