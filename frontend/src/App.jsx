import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./login";
import Register from "./register";
import Dashboard from "./dashboard";

function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("login") === "true";
    setIsLogin(loginStatus);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={isLogin ? <Dashboard /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;