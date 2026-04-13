import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
    if (!form.email || !form.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      const { token, user } = res.data;

      login(token, user);

      setSuccess("✅ Login successful!");

      // 🔥 Redirect
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.msg || "Login failed ❌");
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
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-2">
          Welcome Back 🔐
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Login to continue
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

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          className="w-full p-3 mb-4 bg-gray-900/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          className="w-full p-3 mb-2 bg-gray-900/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Forgot Password */}
        <p
          onClick={() => navigate("/forgot-password")}
          className="text-right text-sm text-gray-400 mb-4 cursor-pointer hover:text-yellow-400"
        >
          Forgot Password?
        </p>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 transition p-3 rounded-lg text-black font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register link */}
        <p className="text-center text-gray-400 mt-5 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </form>
    </div>
  );
}