import React, { useState } from "react";
import API from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/api/auth/forgot-password", {
        email,
      });

      setMsg(res.data.msg);

      // save email
      localStorage.setItem("resetEmail", email);

      // 👉 u gudub verify OTP
      setTimeout(() => {
        window.location.href = "/verify-otp";
      }, 1000);

    } catch (err) {
      setMsg(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl w-[350px]">
        <h2 className="text-xl mb-4 text-yellow-400 text-center">
          🔐 Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 mb-3 bg-gray-800 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-yellow-500 p-2 rounded"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {msg && <p className="mt-3 text-center text-green-400">{msg}</p>}
      </form>
    </div>
  );
}