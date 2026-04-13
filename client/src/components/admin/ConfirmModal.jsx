import React from "react";

export default function ConfirmModal({ ticket, action, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-gray-900 p-6 rounded-xl w-[350px] border border-white/10">

        <h2 className="text-xl font-bold mb-3 text-yellow-400">
          Confirm {action}
        </h2>

        <p className="text-sm text-gray-300">
          Are you sure you want to {action} ticket of{" "}
          <span className="text-white font-semibold">
            {ticket.user?.name}
          </span>?
        </p>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-500 py-2 rounded"
          >
            Yes
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 py-2 rounded"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}