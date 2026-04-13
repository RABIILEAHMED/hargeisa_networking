import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar"; // ✅ NEW
import { Toaster, toast } from "react-hot-toast";
import socket from "../socket";

import Profile from "./Profile";
import EditProfile from "./EditProfile";
import MyTickets from "../components/MyTickets";


export default function Dashboard() {
  const { token, logout } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [myTicket, setMyTicket] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "false" ? false : true
  );

const API = "https://hargeisa-connect.onrender.com";

  // =========================
  // 🔁 FETCH USER
  // =========================
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/api/auth/me`, {
          headers: { Authorization: token },
        });

        setUser(res.data);
        toast.success(`Welcome ${res.data.name} 👋`);
      } catch (err) {
        toast.error("Session expired ❌");
        logout();
      }
    };

    fetchUser();
  }, [token]);

  // =========================
  // 🎟️ FETCH MY TICKET
  // =========================
  const fetchMyTicket = async () => {
    try {
      const res = await axios.get(`${API}/api/tickets/my`, {
        headers: { Authorization: token },
      });

      setMyTicket(res.data || null);
    } catch {
      setMyTicket(null);
    }
  };

  useEffect(() => {
    if (token) fetchMyTicket();
  }, [token]);

  // =========================
  // ⚡ SOCKET REALTIME
  // =========================
 useEffect(() => {
  socket.on("connect", () => {
    console.log("🔥 Connected:", socket.id);
  });

  socket.on("notification", (data) => {
    toast.success(data.message);
    fetchMyTicket();
  });

  return () => {
    socket.off("connect");
    socket.off("notification");
  };
}, []);

  // =========================
  // 🌙 DARK MODE
  // =========================
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // =========================
  // ⏳ LOADING
  // =========================
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse text-yellow-400 text-lg">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-b from-black via-gray-900 to-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <Toaster position="top-right" />

      {/* ✅ TOP NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* BODY WRAPPER */}
      <div className="pt-20 flex">

        {/* ✅ SIDEBAR */}
        <div className="hidden md:block fixed top-20 left-0 h-full w-64">
          <Sidebar
            setPage={setPage}
            logout={logout}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </div>

        {/* ✅ MAIN CONTENT */}
        <div className="flex-1 md:ml-64 p-4 md:p-6 space-y-6">

          {/* DASHBOARD */}
          {page === "dashboard" && (
            <div className="max-w-6xl mx-auto space-y-6">

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Welcome,{" "}
                  <span className="text-yellow-400">{user.name}</span> 👋
                </h2>

                <p className="text-gray-400 mt-2">
                  Manage everything in one place 🚀
                </p>
              </div>

              {/* CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm text-gray-400">Account</h3>
                  <p className="text-yellow-400 font-semibold mt-1">
                    {user.role}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm text-gray-400">Ticket</h3>
                  <p className="text-green-400 font-semibold mt-1">
                    {myTicket ? myTicket.type : "None"}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm text-gray-400">Status</h3>
                  <p className="text-blue-400 font-semibold mt-1">
                    {myTicket ? myTicket.status : "No Ticket"}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* PROFILE */}
          {page === "profile" && (
            <div className="max-w-3xl mx-auto">
              <Profile user={user} />
            </div>
          )}

          {/* EDIT */}
          {page === "edit" && (
            <div className="max-w-3xl mx-auto">
              <EditProfile user={user} setUser={setUser} />
            </div>
          )}

          {/* TICKETS */}
          {page === "tickets" && (
            <div className="max-w-4xl mx-auto">
              <MyTickets myTicket={myTicket} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}