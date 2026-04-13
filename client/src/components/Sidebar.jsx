import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  Pencil,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Ticket,
} from "lucide-react";



export default function Sidebar({ setPage, logout, darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(
    localStorage.getItem("activePage") || "dashboard"
  );

  // 🔁 Persist active page
  useEffect(() => {
    localStorage.setItem("activePage", active);
  }, [active]);

  const handlePage = (page) => {
    setPage(page);
    setActive(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* 🔥 MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black border-b border-white/10">
        <h1 className="text-yellow-400 font-bold tracking-wide">🚀 HNN</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 🔥 OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🚀 SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 
        bg-gradient-to-b from-black via-gray-900 to-black 
        border-r border-white/10 shadow-2xl p-5 flex flex-col justify-between
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* 🔝 TOP */}
        <div>
          <h1 className="text-2xl font-extrabold mb-10 
          bg-gradient-to-r from-yellow-400 to-yellow-600 
          text-transparent bg-clip-text">
            🚀 HNN
          </h1>

          {/* 📌 NAV */}
          <nav className="flex flex-col gap-2">

            {/* DASHBOARD */}
            <button
              onClick={() => handlePage("dashboard")}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all
              ${active === "dashboard"
                ? "bg-yellow-400/20 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400 hover:bg-white/5"}`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            {/* 🎟️ MY TICKETS */}
            <button
              onClick={() => handlePage("tickets")}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all
              ${active === "tickets"
                ? "bg-yellow-400/20 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400 hover:bg-white/5"}`}
            >
              <Ticket size={18} />
              My Tickets
            </button>

            {/* PROFILE */}
            <button
              onClick={() => handlePage("profile")}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all
              ${active === "profile"
                ? "bg-yellow-400/20 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400 hover:bg-white/5"}`}
            >
              <User size={18} />
              Profile
            </button>

            {/* EDIT */}
            <button
              onClick={() => handlePage("edit")}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all
              ${active === "edit"
                ? "bg-yellow-400/20 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400 hover:bg-white/5"}`}
            >
              <Pencil size={18} />
              Edit Profile
            </button>
            
 

          </nav>
        </div>

        {/* 🔻 BOTTOM */}
        <div className="flex flex-col gap-3">

          {/* 🌙 DARK MODE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-between px-4 py-2 rounded-xl 
            bg-white/5 hover:bg-white/10 transition"
          >
            <span className="flex items-center gap-2 text-gray-300">
              {darkMode ? <Moon size={16} /> : <Sun size={16} />}
              {darkMode ? "Dark Mode" : "Light Mode"}
            </span>

            <div className={`w-10 h-5 flex items-center rounded-full p-1
              ${darkMode ? "bg-yellow-400" : "bg-gray-400"}`}>
              <div className={`bg-white w-4 h-4 rounded-full transform transition
                ${darkMode ? "translate-x-5" : "translate-x-0"}`} />
            </div>
          </button>

          {/* Divider */}
          <div className="border-t border-white/10"></div>

          {/* 🚪 LOGOUT */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl 
            bg-red-500/10 text-red-400 
            hover:bg-red-500 hover:text-white transition"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </aside>
    </>
  );
}