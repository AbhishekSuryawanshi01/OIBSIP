/**
 * js/api.js
 * Thin wrapper around fetch for all API calls to the backend
 */

const API_BASE = "http://localhost:3001/api";

/**
 * Core request helper
 * @param {string} path - e.g. "/auth/login"
 * @param {object} options - fetch options override
 * @returns {Promise<object>} parsed JSON response
 */
async function request(path, options = {}) {
  const token = Auth.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

const API = {
  auth: {
    register: (payload) =>
      request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),

    login: (payload) =>
      request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),

    logout: () =>
      request("/auth/logout", { method: "POST" }),

    refresh: (refreshToken) =>
      request("/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken }) }),
  },

  protected: {
    dashboard: () => request("/protected/dashboard"),
    profile: ()   => request("/protected/profile"),
  },
};

window.API = API;
