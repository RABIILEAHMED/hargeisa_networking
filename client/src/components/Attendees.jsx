import React, { useEffect, useState } from "react";
import { Crown, Zap, User, Briefcase, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import ProfileModal from "../components/attendees/ProfileModal";

export default function Attendees({ tickets = [] }) {
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0);

const BASE_URL = "https://hargeisa-connect.onrender.com";

  // ✅ SOCKET
  useEffect(() => {
    const socket = io(BASE_URL, {
      transports: ["websocket"],
    });

    socket.on("users", (data) => {
      setOnlineUsers(data?.total || 0);
    });

    return () => socket.disconnect();
  }, []);

  // ✅ FILTER LOGIC
  const approved = tickets.filter((t) => t.status === "approved");

  const filtered =
    filter === "all"
      ? approved
      : approved.filter((t) => t.type === filter);

  // 🎨 CONFIG
  const typeConfig = {
    vip: {
      icon: <Crown size={12} />,
      color: "bg-yellow-400 text-black",
      label: "VIP",
    },
    skilled: {
      icon: <Zap size={12} />,
      color: "bg-blue-500 text-white",
      label: "PRO",
    },
    normal: {
      icon: <User size={12} />,
      color: "bg-green-500 text-white",
      label: "STANDARD",
    },
  };

  // ✅ IMAGE FIX FUNCTION
  const getImageUrl = (photo) => {
    if (!photo) return null;

    // haddii backend path yahay (uploads/xxx.jpg)
    if (photo.startsWith("http")) return photo;

    const clean = photo.startsWith("/") ? photo.slice(1) : photo;

    return `${BASE_URL}/${clean}`;
  };

  return (
    <div className="mt-14">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

        <div>
          <h3 className="text-3xl font-bold text-white">
            👥 Attendees
          </h3>
          <p className="text-sm text-gray-400">
            {filtered.length} Approved • 🟢 {onlineUsers} Online
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 flex-wrap justify-center">
          {["all", "vip", "skilled", "normal"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs border transition ${
                filter === f
                  ? "bg-yellow-400 text-black"
                  : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((t, i) => {
          const user = t.user || {};
          const config = typeConfig[t.type] || typeConfig.normal;

          const initials =
            user.name?.split(" ").map((n) => n[0]).join("") || "U";

          const imageUrl = getImageUrl(user.photo);

          return (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative group p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:scale-105 hover:shadow-2xl transition duration-300"
            >

              {/* BADGE */}
              <div
                className={`absolute top-3 right-3 flex items-center gap-1 text-[10px] px-2 py-1 rounded ${config.color}`}
              >
                {config.icon}
                {config.label}
              </div>

              {/* PROFILE */}
              <div className="flex flex-col items-center text-center">

                {/* IMAGE */}
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="user"
                    className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-yellow-400 shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : null}

                {/* INITIALS fallback */}
                {!imageUrl && (
                  <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold mb-3">
                    {initials}
                  </div>
                )}

                <h4 className="font-semibold text-white">
                  {user.name || "Unknown"}
                </h4>

                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Briefcase size={12} />
                  {user.jobTitle || "Attendee"}
                </p>

                {/* VIEW BUTTON */}
                <button
                  onClick={() => setSelectedUser(user)}
                  className="mt-3 text-xs px-3 py-1 rounded-full bg-yellow-400 text-black flex items-center gap-1 hover:bg-yellow-300 transition"
                >
                  <Eye size={12} />
                  View
                </button>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No attendees found
        </div>
      )}

      {/* MODAL */}
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

    </div>
  );
}