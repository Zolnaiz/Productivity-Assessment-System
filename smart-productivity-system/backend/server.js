const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");
const auditRoutes = require("./routes/audits");
const ideaRoutes = require("./routes/ideas");
const reportRoutes = require("./routes/reports");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/audits", auditRoutes);
app.use("/ideas", ideaRoutes);
app.use("/reports", reportRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
