import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

import { Image } from "lucide-react"; // 👈 add this top
import TicketCard from "../components/admin/TicketCard";
import ConfirmModal from "../components/admin/ConfirmModal";
import StatsCard from "../components/admin/StatsCard";
import AdminHeader from "../components/admin/AdminHeader";
import AdminGalleryUpload from "../components/admin/AdminGalleryUpload";

export default function Admin() {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("recent"); // 🔥 NEW
  const [showGallery, setShowGallery] = useState(false);

  const token = localStorage.getItem("token");
  const API = "https://hargeisa-connect.onrender.com";

  const soundRef = useRef(new Audio("/sounds/notify.mp3"));

  const prices = { normal: 5, vip: 10, skilled: 15 };

  const fetchTickets = async () => {
    const res = await axios.get(`${API}/api/tickets/public`);
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 🔥 SOCKET
  useEffect(() => {
    const socket = io(API, { transports: ["websocket"] });

    socket.on("ticket:new", (data) => {
      toast.success(data.message);
      soundRef.current.play();
      setNotifications(prev => [data.message, ...prev]);
      fetchTickets();
    });

socket.on("ticket:update", (data) => {
  const name = data.userName || "User";

  let message = data.message;

  if (message.includes("approved")) {
    message = `✅ Ticket approved - ${name}`;
  }

  if (message.includes("rejected")) {
    message = `❌ Ticket rejected - ${name}`;
  }

  toast(message);
  soundRef.current.play();
  setNotifications(prev => [message, ...prev]);
  fetchTickets();
});

    return () => socket.disconnect();
  }, []);

  const handleAction = (ticket, type) => {
    setSelected(ticket);
    setActionType(type);
  };

  const confirmAction = async () => {
    try {
      await axios.put(
        `${API}/api/tickets/${actionType}/${selected._id}`,
        {},
        { headers: { Authorization: token } }
      );
      toast.success("Done ✅");
      fetchTickets();
    } catch {
      toast.error("Error ❌");
    }
    setSelected(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const clearNotifications = () => setNotifications([]);

  // =========================
  // 📊 STATS
  // =========================

  const approvedTickets = tickets.filter(t => t.status === "approved");

  const totalRevenue = approvedTickets.reduce(
    (sum, t) => sum + (prices[t.type] || 0),
    0
  );

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === "pending").length,
    approved: approvedTickets.length,
    rejected: tickets.filter(t => t.status === "rejected").length,
  };

  // =========================
  // 🎯 FILTER LOGIC
  // =========================

  const sortedTickets = [...tickets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const recentTickets = sortedTickets.slice(0, 10);
  const pendingTickets = sortedTickets.filter(t => t.status === "pending");
  const approvedList = sortedTickets.filter(t => t.status === "approved");
  const rejectedList = sortedTickets.filter(t => t.status === "rejected");

  let displayTickets = [];

  if (filter === "recent") displayTickets = recentTickets;
  if (filter === "pending") displayTickets = pendingTickets;
  if (filter === "approved") displayTickets = approvedList;
  if (filter === "rejected") displayTickets = rejectedList;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6">

      <AdminHeader
        notifications={notifications}
        clearNotifications={clearNotifications}
        logout={logout}
      />

      {/* 🔥 STATS */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <StatsCard title="Total" value={stats.total} />
        <StatsCard title="Pending" value={stats.pending} />
        <StatsCard title="Approved" value={stats.approved} />
        <StatsCard title="Rejected" value={stats.rejected} />
        <StatsCard title="💰 Revenue" value={`$${totalRevenue}`} highlight />
      </div>

      {/* 🎯 FILTER TABS */}
      <div className="flex flex-wrap gap-3 mb-6">

        {[
          { key: "recent", label: "🆕 Last 10" },
          { key: "pending", label: "⏳ Pending" },
          { key: "approved", label: "✅ Approved" },
          { key: "rejected", label: "❌ Rejected" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition
              ${filter === tab.key
                ? "bg-yellow-400 text-black"
                : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
          >
            {tab.label}
          </button>
        ))}

      </div>

      {/* 🎟️ TICKETS GRID */}
      <div className="grid md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">

        {displayTickets.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">
            No tickets found...
          </p>
        ) : (
          displayTickets.map((t) => (
            <TicketCard
              key={t._id}
              ticket={t}
              onApprove={() => handleAction(t, "approve")}
              onReject={() => handleAction(t, "reject")}
            />
          ))
        )}

      </div>

      {/* MODAL */}
      {selected && (
        <ConfirmModal
          ticket={selected}
          action={actionType}
          onClose={() => setSelected(null)}
          onConfirm={confirmAction}
        />
      )}

      {/* 📸 FLOATING GALLERY BUTTON */}
<button
  onClick={() => setShowGallery(true)}
  className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full 
  bg-yellow-400 text-black flex items-center justify-center 
  shadow-lg hover:scale-110 transition"
>
  <Image size={20} />
</button>

{/* 🌫️ MODAL */}
{showGallery && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    {/* BACKDROP */}
    <div
      onClick={() => setShowGallery(false)}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
    ></div>

    {/* MODAL CONTENT */}
    <div className="relative z-10 w-full max-w-2xl mx-auto bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-fadeIn">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-yellow-400">
          📸 Upload Gallery
        </h2>

        <button
          onClick={() => setShowGallery(false)}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✖
        </button>
      </div>

      {/* CONTENT */}
      <AdminGalleryUpload />

    </div>
  </div>
)}

    </div>
  );
}