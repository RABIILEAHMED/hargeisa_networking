import React from "react";

export default function StatsCard({ title, value, highlight }) {
  return (
    <div className={`p-5 rounded-2xl border backdrop-blur shadow-xl transition hover:scale-105
    ${highlight 
      ? "bg-yellow-400/10 border-yellow-400 text-yellow-300" 
      : "bg-white/5 border-white/10 text-white"}`}>

      <h2 className="text-sm text-gray-400 mb-1">{title}</h2>

      <p className="text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}