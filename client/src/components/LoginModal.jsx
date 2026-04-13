import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800">
          🔐 Login Required
        </h2>

        <p className="text-gray-600 text-sm">
          Fadlan login samee si aad u iibsan karto ticket.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-200 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-1/2 bg-blue-600 text-white py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}