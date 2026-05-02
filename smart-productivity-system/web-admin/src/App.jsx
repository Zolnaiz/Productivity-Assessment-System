import React from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import TasksPage from "./pages/TasksPage";
import AuditsPage from "./pages/AuditsPage";
import ReportsPage from "./pages/ReportsPage";
import NotesPage from "./pages/NotesPage";
import DailyGoalsPage from "./pages/DailyGoalsPage";
import BadgesPage from "./pages/BadgesPage";
import AuditLogPage from "./pages/AuditLogPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ExportReportsPage from "./pages/ExportReportsPage";
import { clearToken, getToken } from "./services/api";

function Layout({ children }) {
  const navigate = useNavigate();
  const links = ["dashboard","users","tasks","audits","reports","notes","goals","badges","departments","audit-log","export"];
  return <div style={{ display:"flex", minHeight:"100vh", fontFamily:"Arial" }}><aside style={{ width:240, background:"#0f172a", color:"white", padding:16 }}><h3>Smart Admin</h3><nav style={{ display:"grid", gap:8 }}>{links.map((l)=><Link key={l} to={`/${l}`} style={{ color:"white" }}>{l}</Link>)}</nav><button style={{ marginTop: 20 }} onClick={() => { clearToken(); navigate('/login'); }}>Logout</button></aside><main style={{ flex:1, padding:20 }}>{children}</main></div>;
}
const Protected = ({ children }) => (getToken() ? children : <Navigate to="/login" replace />);
export default function App(){return <Routes><Route path="/login" element={<LoginPage/>}/><Route path="/dashboard" element={<Protected><Layout><DashboardPage/></Layout></Protected>}/><Route path="/users" element={<Protected><Layout><UsersPage/></Layout></Protected>}/><Route path="/tasks" element={<Protected><Layout><TasksPage/></Layout></Protected>}/><Route path="/audits" element={<Protected><Layout><AuditsPage/></Layout></Protected>}/><Route path="/reports" element={<Protected><Layout><ReportsPage/></Layout></Protected>}/><Route path="/notes" element={<Protected><Layout><NotesPage/></Layout></Protected>}/><Route path="/goals" element={<Protected><Layout><DailyGoalsPage/></Layout></Protected>}/><Route path="/badges" element={<Protected><Layout><BadgesPage/></Layout></Protected>}/><Route path="/departments" element={<Protected><Layout><DepartmentsPage/></Layout></Protected>}/><Route path="/audit-log" element={<Protected><Layout><AuditLogPage/></Layout></Protected>}/><Route path="/export" element={<Protected><Layout><ExportReportsPage/></Layout></Protected>}/><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes>}
