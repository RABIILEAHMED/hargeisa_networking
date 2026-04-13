import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isAuth } = useContext(AuthContext);

  // 🔄 fallback haddii refresh dhaco
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const currentUser = user || storedUser;

  // ❌ haddii aan login ahayn
  if (!isAuth && !currentUser) {
    return <Navigate to="/login" />;
  }

  // ❌ haddii user yahay (not admin)
  if (currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  // ✅ admin allowed
  return children;
}