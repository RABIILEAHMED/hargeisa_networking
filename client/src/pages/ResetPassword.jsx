import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/reset-password", {
        email,
        otp,
        password,
      });

      setMsg(res.data.msg);

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setMsg(err.response?.data?.msg || "Error resetting password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl w-[350px]">
        <h2 className="text-xl mb-4 text-yellow-400 text-center">
          Reset Password
        </h2>

        {/* email show only */}
        <input
          value={email || ""}
          disabled
          className="w-full p-2 mb-3 bg-gray-800 rounded"
        />

        <input
          placeholder="OTP"
          className="w-full p-2 mb-3 bg-gray-800 rounded"
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 mb-3 bg-gray-800 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-green-500 p-2 rounded">
          Reset Password
        </button>

        {msg && <p className="mt-3 text-center text-yellow-400">{msg}</p>}
      </form>
    </div>
  );
}