import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Validation
    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const res = await axios.post(
  "https://hargeisa-connect.onrender.com/api/auth/register",
  form
);;

      setSuccess("✅ Account created successfully!");

      // ✅ Reset form
      setForm({
        name: "",
        email: "",
        password: "",
      });

      // ✅ Auto redirect after 1.5s
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md backdrop-blur-lg bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl"
      >

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Create Account 🚀
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Join the system and start now
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 text-red-400 p-2 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-500/20 text-green-400 p-2 mb-4 rounded text-sm text-center">
            {success}
          </div>
        )}

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          className="w-full p-3 mb-4 bg-gray-900/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          className="w-full p-3 mb-4 bg-gray-900/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          className="w-full p-3 mb-4 bg-gray-900/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 transition p-3 rounded-lg text-black font-semibold"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* Login link */}
        <p className="text-center text-gray-400 mt-5 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-400 cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>

      </form>
    </div>
  );
}