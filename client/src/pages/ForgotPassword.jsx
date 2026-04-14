import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const API = "http://localhost:5000";
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${API}/api/auth/forgot-password`, {
      email,
    });

    setMsg(res.data.msg);

    // 💎 SAVE EMAIL FOR NEXT STEP
    localStorage.setItem("resetEmail", email);

    // redirect to OTP page
    setTimeout(() => {
      window.location.href = "/reset-password";
    }, 1000);

  } catch (err) {
    setMsg(err.response?.data?.msg);
  }
};

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-xl w-[350px] shadow-2xl"
      >
        <h2 className="text-xl mb-4 text-yellow-400 text-center">
          🔐 Forgot Password
        </h2>

        <input
          placeholder="Enter your email"
          className="w-full p-2 mb-3 bg-gray-800 rounded outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-yellow-500 p-2 rounded hover:bg-yellow-400 transition"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {msg && (
          <p className="mt-3 text-center text-sm text-green-400">
            {msg}
          </p>
        )}
      </form>
    </div>
  );
}