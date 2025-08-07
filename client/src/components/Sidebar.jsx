import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useRole } from "../contexts/RoleContext";

const allNavItems = {
  public: [{ path: "/public", label: "Public Calendar" }],
  eventManager: [
    { path: "/manager", label: "Event Manager" },
    { path: "/manager/create", label: "Create Event" },
  ],
  admin: [
    { path: "/admin", label: "Admin Dashboard" },
    { path: "/admin/requests", label: "Review Requests" }, // future
  ],
  default: [
    { path: "/login", label: "Login" },
    { path: "/public", label: "Public Calendar" },
  ],
};

export default function Sidebar() {
  const { role, setRole } = useRole();
  const location = useLocation();
  const navItems = allNavItems[role] || allNavItems.default;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col justify-between p-6 shadow-xl">
      <div>
        <h2 className="text-2xl font-bold mb-8 tracking-wide text-blue-400">EVMS</h2>
        <nav className="space-y-2">
          {navItems.map(({ path, label }) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + "#");
            return (
              <NavLink
                key={path}
                to={path}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="truncate">{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 🔴 Logout fixed at bottom */}
      <button
        onClick={() => {
          setRole(null);
          window.location.href = "/login";
        }}
        className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
      >
        Log Out
      </button>
    </aside>
  );
}
