import React, { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../services/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const load = async () => setTasks((await getTasks()).data || []);
  useEffect(() => { load(); }, []);

  return <div>
    <h2>Даалгаврын удирдлага</h2>
    <div style={{ marginBottom: 10 }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Даалгаврын нэр" />
      <button onClick={async () => { await createTask({ title, status: "Pending" }); setTitle(""); load(); }}>Даалгавар нэмэх</button>
    </div>
    <table border="1" cellPadding="8"><thead><tr><th>Нэр</th><th>Төлөв</th><th>Үйлдэл</th></tr></thead><tbody>
      {tasks.map((t) => <tr key={t.id}><td>{t.title}</td><td>{t.status}</td><td>
        <button onClick={async () => { await updateTask(t.id, { status: "Completed" }); load(); }}>Дууссан болгох</button>
        <button onClick={async () => { await deleteTask(t.id); load(); }}>Устгах</button>
      </td></tr>)}
    </tbody></table>
  </div>;
}
