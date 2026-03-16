import React, { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../services/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const load = async () => setTasks((await getTasks()).data || []);
  useEffect(() => { load(); }, []);

  return <div>
    <h2>Task Management</h2>
    <div style={{ marginBottom: 10 }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
      <button onClick={async () => { await createTask({ title, status: "Pending" }); setTitle(""); load(); }}>Create Task</button>
    </div>
    <table border="1" cellPadding="8"><thead><tr><th>Title</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {tasks.map((t) => <tr key={t.id}><td>{t.title}</td><td>{t.status}</td><td>
        <button onClick={async () => { await updateTask(t.id, { status: "Completed" }); load(); }}>Mark Completed</button>
        <button onClick={async () => { await deleteTask(t.id); load(); }}>Delete</button>
      </td></tr>)}
    </tbody></table>
  </div>;
}
