import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const API = "http://localhost:5000";
  const navigate = useNavigate();

  // 💎 GET EMAIL FROM LOCAL STORAGE
  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/reset-password`, { email, otp, password });
      setMsg(res.data.msg);
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.msg);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl w-[350px]">
        <h2 className="text-xl mb-4 text-yellow-400 text-center">
          Reset Password
        </h2>

        <input
          placeholder="Email"
          className="w-full p-2 mb-3 bg-gray-800 rounded"
          onChange={(e) => setEmail(e.target.value)}
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

        <button className="w-full bg-green-500 p-2 rounded hover:bg-green-400 transition">
  Reset Password
</button>

{msg && (
  <p className="mt-3 text-center text-sm text-yellow-400">
    {msg}
  </p>
)}
      </form>
    </div>
  );
}