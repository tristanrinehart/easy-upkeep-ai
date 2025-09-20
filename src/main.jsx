/**
 * Entry point for the React application.
 * - Uses React Router for navigation.
 * - Wraps the app with AuthProvider to share auth state.
 * - All CSS files live in /styles (one per component/page).
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/global.css"; // global (no dark mode)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);