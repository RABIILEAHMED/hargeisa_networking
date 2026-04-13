import React, { useEffect, useState } from "react";

export default function MyTickets({ myTicket }) {
  const [timeLeft, setTimeLeft] = useState(null);

  // ⏱️ COUNTDOWN (1 MIN)
  useEffect(() => {
    if (!myTicket || myTicket.status === "approved") return;

    const createdTime = new Date(myTicket.createdAt).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = 1 * 60 * 1000 - (now - createdTime);

      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [myTicket]);

  // ⏱️ FORMAT TIME
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // ❌ NO TICKET
  if (!myTicket) {
    return (
      <div className="text-center text-gray-400 mt-10">
        No ticket yet 🎟️
      </div>
    );
  }

  // 💰 PRICE
  const prices = {
    normal: 5,
    vip: 10,
    skilled: 15,
  };

  const selectedPrice = prices[myTicket.type] || 5;
  const amount = selectedPrice * 10000;

  const cleanPhone = (myTicket.paymentPhone || "").replace(/\D/g, "");
  const ussd = `*223*439233*${amount}#`;

  const handlePay = () => {
    window.location.href = `tel:${ussd}`;
  };

  const isApproved = myTicket.status === "approved";

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-yellow-400">
          🎟️ My Ticket
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isApproved
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {myTicket.status}
        </span>
      </div>

      {/* DETAILS */}
      <div className="space-y-2 text-sm text-gray-300">
        <p>
          <span className="text-gray-400">Type:</span>{" "}
          <span className="capitalize font-medium text-white">
            {myTicket.type}
          </span>
        </p>

        <p>
          <span className="text-gray-400">Phone:</span>{" "}
          {cleanPhone || "N/A"}
        </p>

        <p>
          <span className="text-gray-400">Price:</span>{" "}
          <span className="text-yellow-400 font-semibold">
            ${selectedPrice}
          </span>
        </p>
      </div>

      {/* ⏳ PENDING */}
      {!isApproved && (
        <div className="mt-6 space-y-4">

          {/* TIMER */}
          {timeLeft !== null && timeLeft > 0 && (
            <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-400/20 px-4 py-2 rounded-xl">
              <span className="text-yellow-400 text-sm">
                ⏳ Time Left
              </span>
              <span className="font-mono text-yellow-300 text-lg">
                {formatTime(timeLeft)}
              </span>
            </div>
          )}

          {/* EXPIRED */}
          {timeLeft === 0 && (
            <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/30">

              <p className="text-red-400 font-semibold text-sm">
                ❌ Payment Required
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Your payment was not completed. Please pay now to activate your ticket.
              </p>

              {/* PAY BUTTON */}
              <button
                onClick={handlePay}
                className="mt-4 w-full py-3 rounded-xl 
                bg-gradient-to-r from-green-500 to-emerald-600 
                hover:scale-[1.02] active:scale-95 transition 
                text-white font-semibold shadow-lg"
              >
                💳 Pay Now (${selectedPrice})
              </button>

              <p className="text-[10px] text-gray-500 mt-2 text-center">
                Dial: {ussd}
              </p>
            </div>
          )}

          {/* WAITING */}
          {timeLeft > 0 && (
            <div className="text-center text-xs text-gray-400">
              ⏳ Waiting for payment / approval...
            </div>
          )}

        </div>
      )}

      {/* ✅ APPROVED */}
      {isApproved && (
        <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
          <p className="text-green-400 font-semibold">
            ✅ Ticket Confirmed
          </p>
          <p className="text-xs text-gray-400 mt-1">
            You are ready for the event 🎉
          </p>
        </div>
      )}

    </div>
  );
}