// src/utils/api.js
// Axios wrapper with request IDs, x-tz-offset, and helpful logging.
// Named export: { api }

import axios from "axios";

function newRid() {
  // simple UUIDv4-like
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// VITE_API_BASE_URL may be either "http://localhost:6500" OR "http://localhost:6500/api".
// Normalize so we end up with exactly one "/api".
const ROOT_RAW = (import.meta.env.VITE_API_BASE_URL || "http://localhost:6500").replace(/\/+$/, "");
const BASE_URL = /\/api$/.test(ROOT_RAW) ? ROOT_RAW : `${ROOT_RAW}/api`;

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

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    // Normalize log shape
    const cfg = err.config || {};
    const url = cfg.url || "";
    const status = err.response?.status;
    const ridReq = cfg.headers?.["x-request-id"];
    const ridRes = err.response?.headers?.["x-request-id"];
    const data = err.response?.data;
    console.error("[api] error", { url, status, ridReq, ridRes, data });
    return Promise.reject(err);
  }
);

export const api = {
  // Items
  getItems() {
    return instance.get("/items");
  },
  // New unified loader for page load
  getItemsAndTasks() {
    return instance.get("/items/items-and-tasks");
  },
  createItem(payload) {
    return instance.post("/items", payload);
  },
  deleteItem(id) {
    return instance.delete(`/items/${id}`);
  },

  // Tasks
  getTasksByItem(itemId, { wait = false } = {}) {
    const q = wait ? "?wait=1" : "";
    return instance.get(`/tasks/item/${itemId}${q}`);
  },
};
