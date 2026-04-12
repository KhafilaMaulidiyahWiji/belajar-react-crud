import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./login";
import Register from "./register";
import Dashboard from "./dashboard";

function App() {
  const isLogin = localStorage.getItem("login") === "true";

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* proteksi dashboard */}
      <Route
        path="/dashboard"
        element={isLogin ? <Dashboard /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;