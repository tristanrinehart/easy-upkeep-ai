/**
 * AuthContext.jsx
 * - Holds auth state (user, loading).
 * - Persists auth (stay signed in) via localStorage until sign out.
 * - Stubs Google/Apple flows; email/password calls API via axios instance.
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api.js"; // <-- named import (matches utils/api.js)

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("eua_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Persist user changes
  useEffect(() => {
    if (user) localStorage.setItem("eua_user", JSON.stringify(user));
    else localStorage.removeItem("eua_user");
  }, [user]);

  async function emailPasswordSignIn(email, password) {
    setLoading(true);
    try {
      const res = await api.post("/auth/signin", { email, password });
      setUser(res.data.user);
      return res.data;
    } finally {
      setLoading(false);
    }
  }

  async function emailPasswordSignUp(email, password) {
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", { email, password });
      setUser(res.data.user);
      return res.data;
    } finally {
      setLoading(false);
    }
  }

  function signInWithGoogle() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  }

  function signInWithApple() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/apple`;
  }

  async function signOut() {
    setLoading(true);
    try {
      await api.post("/auth/signout");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, emailPasswordSignIn, emailPasswordSignUp, signOut, signInWithGoogle, signInWithApple }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
