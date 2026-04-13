import React from "react";

export default function PaymentBox({ phone, setPhone, handleBuy }) {
  return (
    <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">

      <h3 className="text-lg font-semibold mb-3 text-yellow-400">
        💳 Payment (ZAAD / EVC)
      </h3>

      <input
        placeholder="Enter phone (2526xxxxxxx)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-3 rounded-xl bg-black border border-white/20 
        focus:border-yellow-400 outline-none"
      />

      <button
        onClick={handleBuy}
        className="w-full mt-4 py-3 rounded-xl font-semibold 
        bg-gradient-to-r from-yellow-400 to-yellow-500 
        text-black hover:scale-105 transition"
      >
        Confirm Payment 🚀
      </button>

      <p className="text-xs text-gray-400 mt-2">
        You will receive confirmation instantly.
      </p>
    </div>
  );
}