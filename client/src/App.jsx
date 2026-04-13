import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import RoundTable from "./pages/RoundTable";
import EventGallery2025 from "./pages/EventGallery2025";

// ROUTE GUARDS
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// NAVBAR
import Navbar from "./components/Navbar";

export default function App() {
  const location = useLocation();

  // 🔥 HIDE NAVBAR ON ADMIN PAGES
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ✅ SHOW ONLY IF NOT ADMIN */}
      {!isAdminPage && <Navbar />}

      <Routes>

        {/* 🌐 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/round-table" element={<RoundTable />} />
        <Route path="/EventGallery2025" element={<EventGallery2025 />} />

        {/* 🔐 USER ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 🛡️ ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* ❌ 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen text-center">
              <div>
                <h1 className="text-5xl font-bold text-red-500">404</h1>
                <p className="text-gray-400 mt-2">Page Not Found</p>
              </div>
            </div>
          }
        />

      </Routes>
    </div>
  );
}