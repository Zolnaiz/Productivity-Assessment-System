import React from "react";
import { downloadTaskReport } from "../services/api";

export default function ReportsPage() {
  return (
    <div>
      <h2>Тайлан татах</h2>
      <p>Даалгаврын тайлан (CSV болон PDF).</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => downloadTaskReport("csv")}>CSV татах</button>
        <button onClick={() => downloadTaskReport("pdf")}>PDF татах</button>
      </div>
    </div>
  );
}
