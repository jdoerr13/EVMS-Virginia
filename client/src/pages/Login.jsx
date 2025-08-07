
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../contexts/RoleContext";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState("public");
  const { setRole } = useRole();
  const navigate = useNavigate();

  const handleLogin = () => {
    setRole(selectedRole);

    if (selectedRole === "admin") navigate("/admin");
    else if (selectedRole === "eventManager") navigate("/manager");
    else navigate("/public");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Login as...</h1>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        >
          <option value="public">Public Viewer</option>
          <option value="eventManager">Event Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </div>
    </section>
  );
}
