/**
 * SignIn page
 * - After success, redirect to home (handled by App route using user state).
 * - Shows promotional info about the app.
 */
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthForm from "../components/AuthForm.jsx";
import "../styles/SignIn.css";

export default function SignIn() {
  const { emailPasswordSignIn, user } = useAuth();
  const [error, setError] = useState(null);
  

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(email, password) {
    try {
      await emailPasswordSignIn(email, password);
    } catch (e) {
      setError(e?.response?.data || { message: e.message });
    }
  }

  return (
    <div className="auth-page">
      <AuthForm title="Sign in" onSubmit={onSubmit} />
      {error && <div className="error">Error: {error.message || "Unknown error"}</div>}
      <section className="promo">
        <h3>What is Easy Upkeep AI?</h3>
        <p>Track your home maintenance items and auto-generate smart tasks tailored to your models.</p>
      </section>
    </div>
  );
}