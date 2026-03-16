import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setToken } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@smart.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      setToken(res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return <form onSubmit={onSubmit} style={{ maxWidth: 320, margin: "80px auto", display: "grid", gap: 10 }}>
    <h2>Админ нэвтрэх</h2>
    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Имэйл" />
    <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Нууц үг" />
    {error && <p style={{ color: "red" }}>{error}</p>}
    <button>Нэвтрэх</button>
  </form>;
}
