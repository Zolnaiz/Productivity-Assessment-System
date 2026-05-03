import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearToken, getCurrentUser } from "../services/api";

const links = [
  { to: "dashboard", label: "Dashboard", roles: ["Admin", "Manager", "Employee"] },
  { to: "tasks", label: "Tasks", roles: ["Admin", "Manager", "Employee"] },
  { to: "audits", label: "5S Audits", roles: ["Admin", "Manager", "Employee"] },
  { to: "notes", label: "Improvement", roles: ["Admin", "Manager", "Employee"] },
  { to: "goals", label: "Daily Goals", roles: ["Admin", "Manager", "Employee"] },
  { to: "reports", label: "Reports", roles: ["Admin", "Manager"] },
  { to: "export", label: "Export", roles: ["Admin", "Manager"] },
  { to: "users", label: "Users", roles: ["Admin"] },
  { to: "departments", label: "Departments", roles: ["Admin", "Manager"] },
  { to: "audit-log", label: "Audit Log", roles: ["Admin"] },
  { to: "badges", label: "Badges", roles: ["Admin", "Manager", "Employee"] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const visibleLinks = links.filter((item) => item.roles.includes(currentUser?.role || "Employee"));

  return (
    <aside style={styles.aside}>
      <div style={styles.brand}>Smart Productivity</div>
      <div style={styles.profileCard}>
        <div style={styles.roleBadge}>{currentUser?.role || "Guest"}</div>
        <div style={styles.email}>{currentUser?.email || "Not signed in"}</div>
      </div>

      <nav style={styles.nav}>
        {visibleLinks.map((item) => {
          const active = location.pathname === `/${item.to}`;
          return (
            <Link
              key={item.to}
              to={`/${item.to}`}
              style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        style={styles.logoutBtn}
        onClick={() => {
          clearToken();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </aside>
  );
}

const styles = {
  aside: {
    width: 270,
    background: "linear-gradient(180deg, #0b1220, #0f1a31)",
    color: "#e2e8f0",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    borderRight: "1px solid #1e293b",
  },
  brand: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 0.2,
  },
  profileCard: {
    background: "rgba(30, 41, 59, 0.8)",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 12,
  },
  roleBadge: {
    display: "inline-block",
    background: "#2563eb",
    borderRadius: 8,
    padding: "4px 8px",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
  },
  email: { fontSize: 12, color: "#cbd5e1", wordBreak: "break-all" },
  nav: { display: "grid", gap: 8 },
  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 10,
    background: "transparent",
    border: "1px solid transparent",
    fontWeight: 500,
  },
  linkActive: {
    color: "#ffffff",
    background: "rgba(37, 99, 235, 0.25)",
    border: "1px solid #3b82f6",
  },
  logoutBtn: {
    marginTop: "auto",
    border: "1px solid #ef4444",
    background: "rgba(239, 68, 68, 0.15)",
    color: "#fecaca",
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  },
};
