import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { getAudits, getTasks } from "../services/api";

export default function DashboardPage() {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, avgAudit: 0 });

  useEffect(() => {
    const load = async () => {
      const [tasksRes, auditsRes] = await Promise.all([getTasks(), getAudits()]);
      const tasks = tasksRes.data || [];
      const audits = auditsRes.data || [];
      const completed = tasks.filter((t) => t.status === "Completed").length;
      const pending = tasks.length - completed;
      const avgAudit = audits.length ? Math.round(audits.reduce((acc, a) => acc + a.score, 0) / audits.length) : 0;

      setStats({ total: tasks.length, completed, pending, avgAudit });

      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels: ["Completed", "Pending", "Audit Score"],
          datasets: [{ label: "Productivity", data: [completed, pending, avgAudit] }],
        },
      });
    };

    load();
    return () => chartRef.current?.destroy();
  }, []);

  const cards = [
    ["Total Tasks", stats.total],
    ["Completed", stats.completed],
    ["Pending", stats.pending],
    ["Avg Audit", stats.avgAudit],
  ];

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        {cards.map(([k, v]) => (
          <div key={k} style={{ background: "#e2e8f0", padding: 10 }}>
            <b>{k}:</b> {v}
          </div>
        ))}
      </div>
      <canvas ref={canvasRef} height="120" />
    </div>
  );
}
