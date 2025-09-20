/**
 * SignUp page
 * - After success, you're authenticated and App route takes you to home.
 */
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthForm from "../components/AuthForm.jsx";
import "../styles/SignUp.css";

export default function SignUp() {
  const { emailPasswordSignUp, user } = useAuth();
  const [error, setError] = useState(null);

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(email, password) {
    try {
      await emailPasswordSignUp(email, password);
    } catch (e) {
      setError(e?.response?.data || { message: e.message });
    }
  }

  return (
    <div className="auth-page">
      <AuthForm title="Sign up" onSubmit={onSubmit} />
      {error && <div className="error">Error: {error.message || "Unknown error"}</div>}
    </div>
  );
}