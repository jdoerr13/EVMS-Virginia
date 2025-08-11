import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login, user, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "eventManager") {
        navigate("/event-manager");
      } else {
        navigate("/public");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    
    try {
      await login({ email, password });
      // Navigation will be handled by useEffect above
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setIsSubmitting(true);
    clearError();
    
    try {
      let demoCredentials;
      switch (role) {
        case "admin":
          demoCredentials = { email: "admin@vccs.edu", password: "admin123" };
          break;
        case "eventManager":
          demoCredentials = { email: "manager@vccs.edu", password: "manager123" };
          break;
        case "public":
          demoCredentials = { email: "student@vccs.edu", password: "student123" };
          break;
        default:
          return;
      }
      
      await login(demoCredentials);
      // Navigation will be handled by useEffect above
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            VCCS Event & Venue Management System
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Virginia Community College System — 2025
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@vccs.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Demo Mode */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Demo Mode
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            For demonstration purposes, you can log in as an Admin, Event Manager, or Student using the sample credentials below:
          </p>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="bg-white border border-gray-300 rounded p-3">
              <strong>Admin User</strong><br />
              Email: admin@vccs.edu<br />
              Password: admin123<br />
              <span className="text-xs text-gray-500">(Backend API)</span>
            </div>
            <div className="bg-white border border-gray-300 rounded p-3">
              <strong>Event Manager</strong><br />
              Email: manager@vccs.edu<br />
              Password: manager123
            </div>
            <div className="bg-white border border-gray-300 rounded p-3">
              <strong>Student / Public User</strong><br />
              Email: student@vccs.edu<br />
              Password: student123
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleDemoLogin("admin")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-sm py-1 rounded"
            >
              Admin Portal
            </button>
            <button
              onClick={() => handleDemoLogin("eventManager")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-sm py-1 rounded"
            >
              Manager Portal
            </button>
            <button
              onClick={() => handleDemoLogin("public")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-sm py-1 rounded"
            >
              Student Portal
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6">
          &copy; 2025 Virginia Community College System — Event & Venue Management System
        </div>
      </div>
    </div>
  );
}
