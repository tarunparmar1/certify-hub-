
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save admin information
      localStorage.setItem(
        "admin",
        JSON.stringify(response.data.admin)
      );

      // Go to admin dashboard
      navigate("/admin");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] bg-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Certificate Manager
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to manage your certificates
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#FBBF24]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#FBBF24]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FBBF24] hover:bg-[#eaa902] text-white py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register option */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Don't have an Certificate Manager account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#d99b00] font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;

