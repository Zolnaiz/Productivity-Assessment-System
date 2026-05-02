const cron = require("node-cron");
const nodemailer = require("nodemailer");
const pool = require("../database/db");

const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
cron.schedule("0 8 * * *", async () => {
  try {
    const overdue = await pool.query(`SELECT t.id,t.title,u.id as user_id,u.email FROM tasks t JOIN users u ON u.id=t.assigned_user WHERE t.deadline < NOW() AND t.status != 'Completed'`);
    for (const task of overdue.rows) {
      await pool.query("INSERT INTO notifications (user_id,message,type) VALUES ($1,$2,$3)", [task.user_id, `Task \"${task.title}\" is overdue! [${task.id}]`, "overdue"]);
      await transporter.sendMail({ from: process.env.EMAIL_USER, to: task.email, subject: "Overdue Task Alert", html: `<p>Task <strong>${task.title}</strong> is overdue.</p>` });
    }
  } catch (e) { console.error("cronService error", e.message); }
});
