/**
 * LoadingSpinner.jsx
 * - Simple accessible loading animation for data fetches.
 */
import React from "react";
import "../styles/LoadingSpinner.css";

export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="spinner" role="status" aria-live="polite" aria-busy="true">
      <div className="dot"></div><div className="dot"></div><div className="dot"></div>
      <span className="sr-only">{label}</span>
    </div>
  );
}