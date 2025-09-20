/**
 * App.jsx
 * - Defines routes: Home (protected), SignIn, SignUp.
 * - Displays NavBar across routes.
 * - Ensures accessibility in buttons/panels.
 */
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/signin" replace /> } />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to={user ? '/' : '/signin'} replace />} />
      </Routes>
    </div>
  );
}