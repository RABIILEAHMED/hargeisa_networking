import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Home,
  LayoutDashboard,
  Shield,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth, user, logout } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false); // close mobile menu
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 pt-4">
      <div
        className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3
        bg-white/5 backdrop-blur-xl border border-white/10 
        rounded-2xl shadow-lg"
      >
        {/* LOGO */}
        <h1
          onClick={() => handleNav("/")}
          className="flex items-center gap-2 text-yellow-400 font-bold cursor-pointer text-lg"
        >
          🚀 <span className="hidden sm:inline">HNN Tickets</span>
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-3 items-center">
          {/* HOME */}
          <button
            onClick={() => handleNav("/")}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition
              ${isActive("/") ? "bg-yellow-400 text-black" : "hover:bg-white/10 text-gray-300"}`}
          >
            <Home size={16} /> Home
          </button>

          {/* USER */}
          {isAuth && user?.role === "user" && (
            <button
              onClick={() => handleNav("/dashboard")}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition
                ${isActive("/dashboard") ? "bg-yellow-400 text-black" : "hover:bg-white/10 text-gray-300"}`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
          )}

          {/* ADMIN */}
          {isAuth && user?.role === "admin" && (
            <button
              onClick={() => handleNav("/admin")}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition
                ${isActive("/admin") ? "bg-yellow-400 text-black" : "hover:bg-white/10 text-gray-300"}`}
            >
              <Shield size={16} /> Admin
            </button>
          )}

          {/* AUTH */}
          {!isAuth ? (
            <button
              onClick={() => handleNav("/login")}
              className="flex items-center gap-1 px-4 py-2 rounded-lg 
              bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
            >
              <LogIn size={16} /> Login
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-lg 
              text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-gray-900 border-l border-white/10 
        backdrop-blur-xl z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col gap-4">

          <h2 className="text-yellow-400 font-bold text-lg mb-4">
            Menu
          </h2>

          {/* HOME */}
          <button
            onClick={() => handleNav("/")}
            className={`flex items-center gap-2 p-3 rounded-lg
              ${isActive("/") ? "bg-yellow-400 text-black" : "hover:bg-white/10"}`}
          >
            <Home size={18} /> Home
          </button>

          {/* USER */}
          {isAuth && user?.role === "user" && (
            <button
              onClick={() => handleNav("/dashboard")}
              className={`flex items-center gap-2 p-3 rounded-lg
                ${isActive("/dashboard") ? "bg-yellow-400 text-black" : "hover:bg-white/10"}`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
          )}

          {/* ADMIN */}
          {isAuth && user?.role === "admin" && (
            <button
              onClick={() => handleNav("/admin")}
              className={`flex items-center gap-2 p-3 rounded-lg
                ${isActive("/admin") ? "bg-yellow-400 text-black" : "hover:bg-white/10"}`}
            >
              <Shield size={18} /> Admin Panel
            </button>
          )}

          {/* AUTH */}
          {!isAuth && (
            <>
              <button
                onClick={() => handleNav("/login")}
                className="flex items-center gap-2 p-3 rounded-lg bg-yellow-400 text-black font-semibold"
              >
                <LogIn size={18} /> Login
              </button>

              <button
                onClick={() => handleNav("/register")}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/10"
              >
                <UserPlus size={18} /> Register
              </button>
            </>
          )}

          {/* LOGOUT */}
          {isAuth && (
            <button
              onClick={() => {
                logout();
                navigate("/");
                setIsOpen(false);
              }}
              className="flex items-center gap-2 p-3 rounded-lg text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}