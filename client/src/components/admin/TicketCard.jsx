import React from "react";

export default function TicketCard({ ticket, onApprove, onReject }) {

  const statusColor =
    ticket.status === "approved"
      ? "text-green-400"
      : ticket.status === "rejected"
      ? "text-red-400"
      : "text-yellow-400";

  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400 transition shadow-lg">

      <h3 className="text-lg font-bold">{ticket.user?.name}</h3>

      <p className="text-sm text-gray-400">{ticket.paymentPhone}</p>

      <p className="text-xs text-gray-500 mt-1">
        {new Date(ticket.createdAt).toLocaleString()}
      </p>

      <p className="uppercase text-yellow-400 mt-2 font-semibold">
        {ticket.type}
      </p>

      <p className={`mt-2 text-sm ${statusColor}`}>
        {ticket.status}
      </p>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-4">

        {ticket.status !== "approved" && (
          <button
            onClick={onApprove}
            className="flex-1 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition"
          >
            Approve
          </button>
        )}

        {ticket.status !== "rejected" && (
          <button
            onClick={onReject}
            className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition"
          >
            Reject
          </button>
        )}

      </div>

    </div>
  );
}