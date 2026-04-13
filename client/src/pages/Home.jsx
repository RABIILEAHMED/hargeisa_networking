import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Ticket from "../components/Ticket";
import { useNavigate } from "react-router-dom";
import { Users, Ticket as TicketIcon, Clock } from "lucide-react";
import RoundTable from "./RoundTable";
import EventGallery2025 from "./EventGallery2025";
import Footer from "../components/Footer/Footer";

export default function Home() {
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // ⏳ COUNTDOWN TIMER
  const eventDate = new Date("2026-05-01T18:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / 1000 / 60) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white mt-20 relative overflow-hidden">

      {/* GLOBAL BACKGROUND EFFECT */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-500/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full"></div>

      <Navbar />

      {/* HERO */}
      <div className="relative text-center py-24 px-4">

        {/* Glow */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-[400px] h-[400px] bg-yellow-400/20 blur-[140px] rounded-full animate-pulse"></div>
        </div>

        <h1 className="relative text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 text-transparent bg-clip-text">
            Clourdinary ORG
          </span>
          <br />
          <span className="text-white/80 text-2xl md:text-3xl font-semibold">
            Future Event Experience 🚀
          </span>
        </h1>

        <p className="relative text-gray-400 mt-6 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Join innovators, developers & entrepreneurs. Experience networking like never before with a modern digital platform.
        </p>

        {/* CTA */}
        {!isAuth && (
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 rounded-xl font-semibold 
              bg-yellow-400 text-black 
              hover:bg-yellow-500 
              shadow-lg shadow-yellow-500/30 
              hover:scale-105 transition-all duration-300"
            >
              Get Started
            </button>

            <button
              className="px-8 py-3 rounded-xl border border-white/20 
              backdrop-blur-md bg-white/5
              hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        )}
      </div>

      {/* ⏳ COUNTDOWN */}
      <div className="relative max-w-4xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">

          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div
              key={unit}
              className="bg-white/5 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 
              shadow-xl hover:scale-105 hover:border-yellow-400/20 transition duration-300"
            >
              <p className="text-3xl md:text-4xl font-bold text-yellow-400">
                {timeLeft[unit] || 0}
              </p>
              <p className="text-gray-400 text-xs md:text-sm mt-1 capitalize">
                {unit}
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* 📊 STATS */}
      <div className="relative max-w-5xl mx-auto px-4 mb-24">
        <div className="grid md:grid-cols-3 gap-6 text-center">

          <div className="group bg-white/5 p-6 rounded-2xl border border-white/10 
          hover:scale-105 hover:border-yellow-400/30 transition duration-300 shadow-md">
            <Users className="mx-auto mb-3 text-yellow-400 group-hover:scale-110 transition" size={32} />
            <h2 className="text-3xl font-bold">1,200+</h2>
            <p className="text-gray-400">Attendees</p>
          </div>

          <div className="group bg-white/5 p-6 rounded-2xl border border-white/10 
          hover:scale-105 hover:border-yellow-400/30 transition duration-300 shadow-md">
            <TicketIcon className="mx-auto mb-3 text-yellow-400 group-hover:scale-110 transition" size={32} />
            <h2 className="text-3xl font-bold">850+</h2>
            <p className="text-gray-400">Tickets Sold</p>
          </div>

          <div className="group bg-white/5 p-6 rounded-2xl border border-white/10 
          hover:scale-105 hover:border-yellow-400/30 transition duration-300 shadow-md">
            <Clock className="mx-auto mb-3 text-yellow-400 group-hover:scale-110 transition" size={32} />
            <h2 className="text-3xl font-bold">24h</h2>
            <p className="text-gray-400">Event Duration</p>
          </div>

        </div>
      </div>

      {/* 🎤 ROUND TABLE */}
      <div className="mt-20 relative z-10">
        <RoundTable />
      </div>

      {/* 🎟️ TICKETS */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50">
          <Ticket />
        </div>
      </div>

      {/* FINAL CTA */}
      {!isAuth && (
        <div className="text-center pb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to join the future? 🚀
          </h2>

          <button
            onClick={() => navigate("/login")}
            className="px-10 py-3 bg-yellow-400 text-black font-semibold rounded-xl 
            hover:bg-yellow-500 hover:scale-105 transition duration-300 shadow-lg shadow-yellow-500/30"
          >
            Buy Ticket Now
          </button>
        </div>
      )}

      <EventGallery2025 />
      <Footer />

    </div>
  );
}