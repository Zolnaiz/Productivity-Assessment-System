import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { getAudits, getCurrentUser, getTasks } from "../services/api";

export default function DashboardPage() {
  const progressChartRef = useRef(null);
  const auditChartRef = useRef(null);
  const progressCanvasRef = useRef(null);
  const auditCanvasRef = useRef(null);

  const currentUser = getCurrentUser();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0, avgAudit: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [tasksRes, auditsRes] = await Promise.all([getTasks(), getAudits()]);
        const tasks = tasksRes.data || [];
        const audits = auditsRes.data || [];

        const completed = tasks.filter((t) => t.status === "Completed").length;
        const inProgress = tasks.filter((t) => t.status === "In Progress").length;
        const pending = tasks.filter((t) => t.status === "Pending").length;
        const avgAudit = audits.length ? Number((audits.reduce((acc, a) => acc + Number(a.score), 0) / audits.length).toFixed(1)) : 0;

        setStats({ total: tasks.length, completed, pending, inProgress, avgAudit });

        const latest7AuditScores = audits
          .slice(0, 7)
          .reverse()
          .map((a) => ({ label: a.date, value: Number(a.score) }));

        if (progressChartRef.current) progressChartRef.current.destroy();
        if (auditChartRef.current) auditChartRef.current.destroy();

        progressChartRef.current = new Chart(progressCanvasRef.current, {
          type: "doughnut",
          data: {
            labels: ["Completed", "In Progress", "Pending"],
            datasets: [{ data: [completed, inProgress, pending], backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b"] }],
          },
          options: { plugins: { legend: { position: "bottom" } } },
        });

        auditChartRef.current = new Chart(auditCanvasRef.current, {
          type: "line",
          data: {
            labels: latest7AuditScores.map((a) => a.label),
            datasets: [{ label: "Audit score", data: latest7AuditScores.map((a) => a.value), tension: 0.35, borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.2)", fill: true }],
          },
          options: {
            scales: { y: { suggestedMin: 0, suggestedMax: 100 } },
            plugins: { legend: { display: false } },
          },
        });
      } catch (e) {
        setError(e.message || "Dashboard load failed");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => {
      progressChartRef.current?.destroy();
      auditChartRef.current?.destroy();
    };
  }, []);

  const cards = useMemo(() => ([
    { label: "Нийт даалгавар", value: stats.total, accent: "#0ea5e9" },
    { label: "Дууссан", value: stats.completed, accent: "#22c55e" },
    { label: "Хийж буй", value: stats.inProgress, accent: "#3b82f6" },
    { label: "Хүлээгдэж буй", value: stats.pending, accent: "#f59e0b" },
    { label: "Дундаж аудит", value: stats.avgAudit, accent: "#8b5cf6" },
  ]), [stats]);

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <h2 style={styles.title}>Сайн байна уу, {currentUser?.role || "User"}</h2>
          <p style={styles.subtitle}>Таны профайлд тохирсон үзүүлэлт болон 5S гүйцэтгэлийн хяналт.</p>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {loading ? <div style={styles.loading}>Уншиж байна...</div> : (
        <>
          <div style={styles.cardGrid}>
            {cards.map((card) => (
              <div key={card.label} style={{ ...styles.metricCard, borderTop: `4px solid ${card.accent}` }}>
                <div style={styles.metricLabel}>{card.label}</div>
                <div style={styles.metricValue}>{card.value}</div>
              </div>
            ))}
          </div>

          <div style={styles.chartsGrid}>
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Task Progress</h3>
              <canvas ref={progressCanvasRef} height="230" />
            </div>
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>5S Audit Trend (Last 7)</h3>
              <canvas ref={auditCanvasRef} height="230" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page: { display: "grid", gap: 16 },
  hero: {
    background: "linear-gradient(135deg, #1d4ed8, #4f46e5)",
    color: "white",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 12px 30px rgba(79,70,229,0.25)",
  },
  title: { margin: 0, fontSize: 26 },
  subtitle: { marginTop: 8, opacity: 0.95 },
  error: { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5", padding: 12, borderRadius: 10 },
  loading: { background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12 },
  metricCard: { background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: 14, boxShadow: "0 8px 20px rgba(15,23,42,0.06)" },
  metricLabel: { color: "#64748b", fontSize: 13 },
  metricValue: { marginTop: 6, fontSize: 28, fontWeight: 700, color: "#0f172a" },
  chartsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 12 },
  chartCard: { background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: 14, boxShadow: "0 8px 20px rgba(15,23,42,0.06)" },
  chartTitle: { marginTop: 0, marginBottom: 10, fontSize: 16, color: "#1e293b" },
};
