import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setToken } from "../services/api";

const rolePresets = [
  { label: "Admin", email: "admin@smart.com", password: "123456" },
  { label: "Manager", email: "manager@smart.com", password: "123456" },
  { label: "Employee", email: "employee@smart.com", password: "123456" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@smart.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => email.trim() && password.trim(), [email, password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    try {
      setSubmitting(true);
      setError("");
      const res = await login(email.trim(), password);
      setToken(res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Нэвтрэх явцад алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Smart Productivity</h2>
        <p style={styles.subtitle}>Нэвтэрч системээ ашиглана уу</p>

        <div style={styles.presetRow}>
          {rolePresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              style={styles.presetBtn}
              onClick={() => {
                setEmail(preset.email);
                setPassword(preset.password);
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>Имэйл</label>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@company.com"
            autoComplete="email"
          />

          <label style={styles.label}>Нууц үг</label>
          <input
            style={styles.input}
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {!!error && <p style={styles.error}>{error}</p>}

          <button style={styles.submitBtn} disabled={!canSubmit || submitting}>
            {submitting ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background: "radial-gradient(circle at top, #e0ecff 0%, #f5f8ff 40%, #eef2ff 100%)",
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 430,
    borderRadius: 20,
    background: "#ffffff",
    boxShadow: "0 18px 45px rgba(37, 99, 235, 0.14)",
    padding: 28,
    border: "1px solid #dbe7ff",
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    color: "#475569",
    fontSize: 14,
  },
  presetRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 8,
    marginBottom: 16,
  },
  presetBtn: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
    borderRadius: 10,
    padding: "8px 10px",
    cursor: "pointer",
    fontWeight: 600,
  },
  form: {
    display: "grid",
    gap: 10,
  },
  label: {
    fontSize: 13,
    color: "#334155",
    fontWeight: 600,
  },
  input: {
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    padding: "11px 12px",
    fontSize: 14,
    outline: "none",
  },
  error: {
    margin: 0,
    color: "#dc2626",
    fontWeight: 500,
    fontSize: 14,
  },
  submitBtn: {
    marginTop: 6,
    border: "none",
    borderRadius: 10,
    background: "#2563eb",
    color: "white",
    padding: "12px 14px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};
