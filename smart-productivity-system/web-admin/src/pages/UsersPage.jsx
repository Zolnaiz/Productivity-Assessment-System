import React, { useEffect, useState } from "react";
import { createUser, deleteUser, getUsers } from "../services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "123456", role: "Employee", department_id: 1 });

  const load = async () => setUsers((await getUsers()).data || []);
  useEffect(() => { load(); }, []);

  return <div>
    <h2>Хэрэглэгчийн удирдлага</h2>
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      <input placeholder="Нэр" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Имэйл" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>Admin</option><option>Manager</option><option>Employee</option></select>
      <button onClick={async () => { await createUser(form); setForm({ ...form, name: "", email: "" }); load(); }}>Үүсгэх</button>
    </div>
    <table border="1" cellPadding="8"><thead><tr><th>ID</th><th>Нэр</th><th>Имэйл</th><th>Эрх</th><th /></tr></thead><tbody>
      {users.map((u) => <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td><button onClick={async () => { await deleteUser(u.id); load(); }}>Устгах</button></td></tr>)}
    </tbody></table>
  </div>;
}
