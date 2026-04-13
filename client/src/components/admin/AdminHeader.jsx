import React from "react";
import NotificationCenter from "./NotificationCenter";

export default function AdminHeader({
  notifications,
  clearNotifications,
  logout,
  adminName,
  adminEmail
}) {

  // fallback haddii props la waayo
  const name = adminName || localStorage.getItem("name") || "Admin";
  const email = adminEmail || localStorage.getItem("email") || "";

  return (
    <div className="w-full mb-6 relative z-50">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 
      bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-lg">

        {/* 🛠️ LEFT SIDE */}
        <div className="flex items-center justify-between w-full md:w-auto">

          {/* TITLE + STATUS */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 tracking-tight">
              🛠️ Admin Panel
            </h1>

            {/* 🟢 ONLINE */}
            <div className="flex items-center gap-1 text-xs text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Online
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 flex-wrap">

          {/* 👤 ADMIN INFO */}
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{name}</p>
            <p className="text-xs text-gray-400">{email}</p>
          </div>

          {/* 🔔 NOTIFICATIONS (FIXED Z-INDEX) */}
          <div className="relative z-[999]">
            <NotificationCenter
              notifications={notifications}
              clearAll={clearNotifications}
            />
          </div>

          {/* 🚪 LOGOUT */}
          <button
            onClick={logout}
            className="bg-red-500/90 px-4 py-2 rounded-xl text-sm font-medium 
            hover:bg-red-600 transition shadow-md"
          >
            Logout
          </button>

        </div>
      </div>

    </div>
  );
}