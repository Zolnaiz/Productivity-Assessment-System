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

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === "object" && data?.message ? data.message : "API Error";
    throw new Error(message);
  }

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

export const downloadTaskReport = async (type = "csv") => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE_URL}/reports/tasks.${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to download report");

  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `tasks-report.${type}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};
