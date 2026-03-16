<<<<<<< HEAD
import { Platform } from "react-native";

const API_BASE_URL = Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const loginRequest = (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
export const logoutRequest = (token) => request("/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } });

export const getTasksRequest = (token) => request("/tasks", { headers: { Authorization: `Bearer ${token}` } });
export const createTaskRequest = (token, payload) => request("/tasks", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
export const updateTaskRequest = (token, id, payload) => request(`/tasks/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });

export const getAuditsRequest = (token) => request("/audits", { headers: { Authorization: `Bearer ${token}` } });
export const createAuditRequest = (token, payload) => request("/audits", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });

export const getIdeasRequest = (token) => request("/ideas", { headers: { Authorization: `Bearer ${token}` } });
export const createIdeaRequest = (token, payload) => request("/ideas", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
export const voteIdeaRequest = (token, ideaId) => request(`/ideas/vote/${ideaId}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
=======
const API_BASE_URL = "http://10.0.2.2:5000";

export const loginRequest = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};
>>>>>>> origin/main
