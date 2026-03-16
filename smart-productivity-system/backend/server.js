const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
<<<<<<< HEAD
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");
const auditRoutes = require("./routes/audits");
const ideaRoutes = require("./routes/ideas");
const reportRoutes = require("./routes/reports");
const voteRoutes = require("./routes/vote");
=======
>>>>>>> origin/main

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
<<<<<<< HEAD
app.use(express.json({ limit: "5mb" }));
=======
app.use(express.json());
>>>>>>> origin/main

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
<<<<<<< HEAD
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/audits", auditRoutes);
app.use("/ideas", ideaRoutes);
app.use("/reports", reportRoutes);
app.use("/vote", voteRoutes);
=======
>>>>>>> origin/main

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
