import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../contexts/RoleContext";

export default function Login() {
  const { setRole } = useRole();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (role) => {
    setRole(role);
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "eventManager") {
      navigate("/event-manager");
    } else {
      navigate("/public");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo only — match sample creds
    if (email === "admin@vccs.edu" && password === "admin123") {
      handleLogin("admin");
    } else if (email === "manager@vccs.edu" && password === "manager123") {
      handleLogin("eventManager");
    } else if (email === "student@vccs.edu" && password === "student123") {
      handleLogin("public");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4">

      <div className="max-w-md w-full space-y-8 bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        
          {/* Header */}
          <div className="flex items-center gap-4 justify-center py-6 select-none">
            {/* Monogram tile */}
            <div className="grid h-14 w-14 place-items-center rounded-2xl 
                            bg-gradient-to-br from-indigo-600 to-blue-600 
                            text-white font-black text-xl shadow-md ring-1 ring-white/15">
              EV
            </div>

            {/* Wordmark */}
            <div className="leading-tight text-left">
              <div className="text-gray-800 font-extrabold text-[20px] tracking-tight">
                Event & Venue
              </div>
              <div className="text-gray-600 text-[14px] font-semibold -mt-0.5">
                Management
                <span className="ml-2 align-middle rounded-full px-2.5 py-0.5 
                                text-[12px] font-bold text-blue-700 
                                bg-blue-50 ring-1 ring-blue-200">
                  Prototype
                </span>
              </div>
            </div>


        {/* <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            VCCS Event & Venue Management System
          </h1> */}
          {/* <p className="text-sm text-gray-500 mt-1">
            Virginia Community College System — 2025
          </p> */}
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Sign In
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
              Password: admin123
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
              onClick={() => handleLogin("admin")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-sm py-1 rounded"
            >
              Admin Portal
            </button>
            <button
              onClick={() => handleLogin("eventManager")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-sm py-1 rounded"
            >
              Manager Portal
            </button>
            <button
              onClick={() => handleLogin("public")}
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
