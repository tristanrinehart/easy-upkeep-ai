// src/utils/api.js
// Axios wrapper with request IDs, x-tz-offset, and helpful logging.
// Named export: { api }

import axios from "axios";

/** simple UUIDv4-ish for request IDs */
function newRid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/**
 * VITE_API_BASE_URL may be either:
 *   - "http://localhost:6500"
 *   - "http://localhost:6500/api"
 * Normalize so we end up with exactly one "/api".
 */
const ROOT_RAW = (import.meta.env.VITE_API_BASE_URL || "http://localhost:6500").replace(/\/+$/, "");
const BASE_URL = /\/api$/.test(ROOT_RAW) ? ROOT_RAW : `${ROOT_RAW}/api`;

/** single axios instance for the whole app */
const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const rid = newRid();
  config.headers["x-request-id"] = rid;
  const tzOffset = new Date().getTimezoneOffset(); // minutes west of UTC
  config.headers["x-tz-offset"] = tzOffset;
  return config;
});

// Optional: basic logging (comment out if too chatty)
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    // surface useful info in dev
    if (import.meta.env.DEV) {
      console.error("[api] error", {
        url: err?.config?.url,
        method: err?.config?.method,
        status: err?.response?.status,
        data: err?.response?.data,
      });
    }
    return Promise.reject(err);
  }
);

/**
 * Exported API:
 * - Generic HTTP helpers so contexts/components can call api.post("/auth/...", payload)
 * - Existing domain-specific helpers kept intact for current call sites
 * - baseURL exposed for OAuth redirects
 */
export const api = {
  /** normalized base for building absolute redirects (e.g., OAuth) */
  baseURL: BASE_URL,

  // --- Generic HTTP helpers (used by AuthContext, etc.) ---
  get(...args)    { return instance.get(...args); },
  post(...args)   { return instance.post(...args); },
  put(...args)    { return instance.put(...args); },
  patch(...args)  { return instance.patch(...args); },
  delete(...args) { return instance.delete(...args); },

  // --- Optional convenience for auth (not required by callers) ---
  signIn(payload)  { return instance.post("/auth/signin", payload); },
  signUp(payload)  { return instance.post("/auth/signup", payload); },
  signOut()        { return instance.post("/auth/signout"); },

  // --- Items (keep existing names so nothing else breaks) ---
  getItems() {
    return instance.get("/items");
  },
  getItemsAndTasks() {
    return instance.get("/items/items-and-tasks");
  },
  createItem(payload) {
    return instance.post("/items", payload);
  },
  deleteItem(id) {
    return instance.delete(`/items/${id}`);
  },

  // --- Tasks (keep existing names) ---
  getTasksByItem(itemId, { wait = false } = {}) {
    const q = wait ? "?wait=1" : "";
    return instance.get(`/tasks/item/${itemId}${q}`);
  },
};
