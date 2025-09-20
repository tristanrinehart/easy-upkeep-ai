/**
 * AuthForm.jsx
 * - Reusable email/password form with Google/Apple buttons.
 * - On submit, calls props.onSubmit(email, password).
 */
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/AuthForm.css";

export default function AuthForm({ title, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInWithGoogle, signInWithApple } = useAuth();

  return (
    <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onSubmit(email, password); }}>
      <h2>{title}</h2>
      <label>Email
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>Password
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Submit</button>

      <div className="or">or</div>

      <button type="button" onClick={signInWithGoogle} aria-label="Sign in with Google">Sign in with Google</button>
      <button type="button" onClick={signInWithApple} aria-label="Sign in with Apple">Sign in with Apple</button>
    </form>
  );
}