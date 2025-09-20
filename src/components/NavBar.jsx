/**
 * NavBar.jsx
 * - Left: "Easy Upkeep AI" app name
 * - Right: user email + Sign out (if authenticated)
 */
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/NavBar.css";

export default function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/" aria-label="Easy Upkeep AI Home">Easy Upkeep AI</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="user-email" aria-label="Signed in user email">{user.email}</span>
            <button className="signout-btn" onClick={signOut} aria-label="Sign out">Sign out</button>
          </>
        ) : (
          <>
            <Link to="/signin">Sign in</Link>
            <Link to="/signup" className="ml-8">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}