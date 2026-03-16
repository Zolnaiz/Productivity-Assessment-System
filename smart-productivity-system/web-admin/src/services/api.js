const API_BASE_URL = "http://localhost:5000";

export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const clearToken = () => localStorage.removeItem("token");

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API Error");
  return data;
}

export const login = (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
export const getUsers = () => request("/users");
export const createUser = (payload) => request("/users", { method: "POST", body: JSON.stringify(payload) });
export const updateUser = (id, payload) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteUser = (id) => request(`/users/${id}`, { method: "DELETE" });
export const getTasks = () => request("/tasks");
export const createTask = (payload) => request("/tasks", { method: "POST", body: JSON.stringify(payload) });
export const updateTask = (id, payload) => request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });
export const getAudits = () => request("/audits");
export const createAudit = (payload) => request("/audits", { method: "POST", body: JSON.stringify(payload) });
export const getIdeas = () => request("/ideas");
export const voteIdea = (id) => request(`/ideas/vote/${id}`, { method: "POST" });
export const getTaskReportUrl = () => `${API_BASE_URL}/reports/tasks.csv`;
