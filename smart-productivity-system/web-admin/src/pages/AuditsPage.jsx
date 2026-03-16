import React, { useEffect, useState } from "react";
import { createAudit, getAudits } from "../services/api";

export default function AuditsPage() {
  const [audits, setAudits] = useState([]);
  const [form, setForm] = useState({ department_id: 1, score: 90 });
  const load = async () => setAudits((await getAudits()).data || []);
  useEffect(() => { load(); }, []);

  return <div>
    <h2>Audit Results</h2>
    <div style={{ marginBottom: 10 }}>
      <input type="number" value={form.department_id} onChange={(e) => setForm({ ...form, department_id: Number(e.target.value) })} />
      <input type="number" value={form.score} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} />
      <button onClick={async () => { await createAudit(form); load(); }}>Add Audit</button>
    </div>
    <ul>{audits.map((a) => <li key={a.id}>{a.department_name || a.department_id} - {a.score} ({a.date})</li>)}</ul>
  </div>;
}
