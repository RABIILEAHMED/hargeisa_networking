import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const API = "http://localhost:5000";
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");

    try {
      const res = await axios.post(
        `${API}/api/auth/verify-otp`,
        { email, otp }
      );

      setMsg(res.data.msg);

      // 🚀 GO TO RESET PASSWORD
      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);

    } catch (err) {
      setMsg(err.response?.data?.msg || "Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <form
        onSubmit={handleVerify}
        className="bg-gray-900 p-6 rounded-xl w-[350px]"
      >
        <h2 className="text-xl mb-4 text-yellow-400 text-center">
          🔑 Verify OTP
        </h2>

        <input
          placeholder="Enter OTP"
          className="w-full p-2 mb-3 bg-gray-800 rounded"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="w-full bg-green-500 p-2 rounded">
          Verify OTP
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