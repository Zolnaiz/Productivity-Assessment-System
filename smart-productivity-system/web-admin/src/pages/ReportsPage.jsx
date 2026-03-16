import React from "react";
import { downloadTaskReport } from "../services/api";

export default function ReportsPage() {
  return (
    <div>
      <h2>Reports Export</h2>
      <p>Task report экспорт (CSV болон PDF).</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => downloadTaskReport("csv")}>Export CSV</button>
        <button onClick={() => downloadTaskReport("pdf")}>Export PDF</button>
      </div>
    </div>
  );
}
