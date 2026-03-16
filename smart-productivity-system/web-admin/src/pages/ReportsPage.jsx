import React from "react";
import { getTaskReportUrl, getToken } from "../services/api";

export default function ReportsPage() {
  const openCsv = () => {
    const url = `${getTaskReportUrl()}?token=${encodeURIComponent(getToken() || "")}`;
    window.open(url, "_blank");
  };

  return <div>
    <h2>Reports Export</h2>
    <p>Task report CSV экспорт хийх.</p>
    <button onClick={openCsv}>Export CSV</button>
    <p style={{ marginTop: 10 }}>PDF export endpoint is planned in next iteration.</p>
  </div>;
}
