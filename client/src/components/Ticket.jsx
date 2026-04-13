import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import TicketCard from "../components/TicketCard";
import MyTicket from "./MyTickets";
import Attendees from "../components/Attendees";
import QueueStatus from "../components/QueueStatus";

export default function Ticket() {
  const [selectedType, setSelectedType] = useState(null);
  const [phone, setPhone] = useState("");
  const [tickets, setTickets] = useState([]);
  const [myTicket, setMyTicket] = useState(null);
  const [queuePos, setQueuePos] = useState(null);
  const [loading, setLoading] = useState(false);

const token = localStorage.getItem("token");
const API = "https://hargeisa-connect.onrender.com";

  // 🎟️ TYPES
  const ticketTypes = [
    { type: "normal", price: 5 },
    { type: "vip", price: 10 },
    { type: "skilled", price: 15 },
  ];

  // 📥 FETCH
  const fetchTickets = async () => {
    const res = await axios.get(`${API}/api/tickets/public`);
    setTickets(res.data);
  };

  const fetchMyTicket = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/api/tickets/my`, {
        headers: { Authorization: token },
      });
      setMyTicket(res.data);
    } catch {
      setMyTicket(null);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchMyTicket();
  }, []);

  // ⚡ SOCKET
  useEffect(() => {
    const socket = io(API);

    socket.on("queueUpdate", (data) => {
      setQueuePos(data.position);
    });

    return () => socket.disconnect();
  }, []);

  // 💰 CURRENT PRICE
  const selectedTicket = ticketTypes.find(t => t.type === selectedType);

  const selectedPrice = selectedTicket?.price || 0;

  // =========================
  // 💳 PAYMENT FLOW PRO
  // =========================
  const handleBuy = async () => {
    if (!token) return alert("Login first");
    if (!selectedType) return alert("Select ticket type");
    if (!phone) return alert("Enter phone number");
    if (myTicket) return alert("You already have a ticket");

    setLoading(true);

    const amount = selectedPrice * 11000;
    const cleanPhone = phone.replace(/\D/g, "");
    const ussd = `*223*439233*${amount}#`;

    try {
      // 🎟️ CREATE
      await axios.post(
        `${API}/api/tickets`,
        {
          type: selectedType,
          paymentPhone: cleanPhone,
        },
        { headers: { Authorization: token } }
      );

      // 📲 AUTO OPEN DIAL
      window.location.href = `tel:${ussd}`;

      // 🔔 UX MESSAGE
      setTimeout(() => {
        alert("📲 Complete payment with your PIN to activate ticket");
      }, 800);

      fetchMyTicket();
      fetchTickets();

    } catch (err) {
      alert(err.response?.data?.msg || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-4 space-y-10">

      {/* 🎫 MY TICKET */}
      {myTicket && (
        <>
          <MyTicket myTicket={myTicket} />
          {queuePos && <QueueStatus position={queuePos} />}
        </>
      )}

      {/* 🎟️ BUY SECTION */}
      {!myTicket && (
        <div className="max-w-4xl mx-auto">

          <h2 className="text-3xl font-bold text-center mb-8">
            Choose Your Ticket 🎟️
          </h2>

          {/* CARDS */}
          <div className="grid md:grid-cols-3 gap-5">
            {ticketTypes.map((t) => (
              <TicketCard
                key={t.type}
                t={t}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />
            ))}
          </div>

          {/* 💳 PAYMENT BOX PRO */}
          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">

            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              Payment Details 💳
            </h3>

            {/* SELECTED INFO */}
            <div className="mb-4 text-sm text-gray-300 space-y-1">
              <p>
                Ticket:{" "}
                <span className="text-white font-semibold">
                  {selectedType || "Not selected"}
                </span>
              </p>

              <p>
                Price:{" "}
                <span className="text-yellow-400 font-bold">
                  ${selectedPrice}
                </span>
              </p>
            </div>

            {/* PHONE INPUT */}
            <input
              type="tel"
              placeholder="Enter phone (e.g. 25263xxxxxxx)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-yellow-400"
            />

            {/* PAY BUTTON */}
            <button
              onClick={handleBuy}
              disabled={loading}
              className="mt-4 w-full py-3 rounded-xl 
              bg-gradient-to-r from-green-500 to-emerald-600 
              hover:scale-[1.02] active:scale-95 transition 
              text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : `💳 Pay $${selectedPrice}`}
            </button>

            {/* INFO */}
            <p className="text-xs text-gray-400 mt-3 text-center">
              Your phone will open ZAAD/EVC automatically 📲
            </p>

          </div>

        </div>
      )}

      {/* 👥 USERS */}
      <Attendees tickets={tickets} />

    </div>
  );
}