// src/utils/api.js
import axios from "axios";

// simple UUIDv4-like request id
function newRid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// Normalize base so there's exactly one "/api"
const ROOT_RAW = (import.meta.env.VITE_API_BASE_URL || "http://localhost:6700").replace(/\/+$/, "");
const BASE_URL = /\/api$/.test(ROOT_RAW) ? ROOT_RAW : `${ROOT_RAW}/api`;

// Create axios instance FIRST so it exists for everything below
const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  config.headers["x-request-id"] = newRid();
  config.headers["x-tz-offset"] = new Date().getTimezoneOffset();
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
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

// Exported API
export const api = {
  // expose normalized base for OAuth redirects if needed
  baseURL: BASE_URL,

  // Generic HTTP helpers (what AuthContext/Home call)
  get(...args)    { return instance.get(...args); },
  post(...args)   { return instance.post(...args); },
  put(...args)    { return instance.put(...args); },
  patch(...args)  { return instance.patch(...args); },
  delete(...args) { return instance.delete(...args); },

  // Optional auth conveniences
  signIn(payload)  { return instance.post("/auth/signin", payload); },
  signUp(payload)  { return instance.post("/auth/signup", payload); },
  signOut()        { return instance.post("/auth/signout"); },

  // Items/Tasks helpers you already use elsewhere
  getItems() { return instance.get("/items"); },
  getItemsAndTasks() { return instance.get("/items/items-and-tasks"); },
  createItem(payload) { return instance.post("/items", payload); },
  deleteItem(id) { return instance.delete(`/items/${id}`); },

  getTasksByItem(itemId, { wait = false } = {}) {
    const q = wait ? "?wait=1" : "";
    return instance.get(`/tasks/item/${itemId}${q}`);
  },
};
