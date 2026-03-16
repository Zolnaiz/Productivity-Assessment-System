import React from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import TasksPage from "./pages/TasksPage";
import AuditsPage from "./pages/AuditsPage";
import ReportsPage from "./pages/ReportsPage";
import { clearToken, getToken } from "./services/api";

function Layout({ children }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
      <aside style={{ width: 220, background: "#0f172a", color: "white", padding: 16 }}>
        <h3>Smart Admin</h3>
        <nav style={{ display: "grid", gap: 10 }}>
          <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
          <Link to="/users" style={{ color: "white" }}>Users</Link>
          <Link to="/tasks" style={{ color: "white" }}>Tasks</Link>
          <Link to="/audits" style={{ color: "white" }}>Audits</Link>
          <Link to="/reports" style={{ color: "white" }}>Reports</Link>
        </nav>
        <button style={{ marginTop: 20 }} onClick={() => { clearToken(); navigate('/login'); }}>Logout</button>
      </aside>
      <main style={{ flex: 1, padding: 20 }}>{children}</main>
    </div>
  );
}

const Protected = ({ children }) => (getToken() ? children : <Navigate to="/login" replace />);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Protected><Layout><DashboardPage /></Layout></Protected>} />
      <Route path="/users" element={<Protected><Layout><UsersPage /></Layout></Protected>} />
      <Route path="/tasks" element={<Protected><Layout><TasksPage /></Layout></Protected>} />
      <Route path="/audits" element={<Protected><Layout><AuditsPage /></Layout></Protected>} />
      <Route path="/reports" element={<Protected><Layout><ReportsPage /></Layout></Protected>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
