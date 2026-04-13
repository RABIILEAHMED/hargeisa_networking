import React from "react";
import { CheckCircle, Star, Zap } from "lucide-react";

export default function TicketCard({ t, selectedType, setSelectedType }) {
  const isActive = selectedType === t.type;

  // 🎨 TYPE CONFIG
  const config = {
    vip: {
      icon: <Star className="text-yellow-400" />,
      label: "VIP",
      desc: "Priority access + fast queue + premium seat",
      color: "from-yellow-400 to-orange-500",
    },
    skilled: {
      icon: <Zap className="text-blue-400" />,
      label: "Pro",
      desc: "Expert level networking experience",
      color: "from-blue-400 to-purple-500",
    },
    normal: {
      icon: <CheckCircle className="text-green-400" />,
      label: "Standard",
      desc: "Standard access to the event",
      color: "from-green-400 to-emerald-500",
    },
  };

  const current = config[t.type] || config.normal;

  return (
    <div
      onClick={() => setSelectedType(t.type)}
      className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 backdrop-blur-xl
      bg-white/5 shadow-xl hover:scale-[1.04] hover:shadow-2xl
      ${
        isActive
          ? "border-transparent bg-gradient-to-br " + current.color + " text-black"
          : "border-white/10 hover:border-yellow-400/40"
      }`}
    >
      {/* BADGE */}
      <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-black/40 text-white">
        {current.label}
      </div>

      {/* ICON */}
      <div className="mb-4 text-2xl">{current.icon}</div>

      {/* TITLE + PRICE */}
      <h3 className="text-xl font-bold flex justify-between items-center">
        <span className="capitalize">{t.type}</span>
        <span className="text-lg font-extrabold">
          ${t.price}
        </span>
      </h3>

      {/* DESC */}
      <p
        className={`mt-2 text-sm ${
          isActive ? "text-black/80" : "text-gray-400"
        }`}
      >
        {current.desc}
      </p>

      {/* FEATURES */}
      <ul className="mt-4 space-y-1 text-sm">
        <li>✔ Event Access</li>
        <li>✔ Networking</li>
        {t.type === "vip" && <li>✔ VIP Lounge</li>}
        {t.type === "skilled" && <li>✔ Skill Match</li>}
      </ul>

      {/* SELECTED */}
      {isActive && (
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
          <CheckCircle size={18} />
          Selected
        </div>
      )}
    </div>
  );
}