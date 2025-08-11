import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; 
import { useAuth } from "../contexts/AuthContext";

const allNavItems = {
  public: [
    { path: "/public", label: "Public Calendar" },
    { path: "/student", label: "Student Dashboard" },
    // { path: "/registration", label: "My Registrations" },
    { path: "/speakers", label: "About Performers" }
  ],
  eventManager: [
    { path: "/event-manager", label: "Event Manager Dash" },
    { path: "/manager/create", label: "Create Event" },
    { path: "/venues", label: "Venue Inventory" },
    { path: "/registration", label: "Registration" },
    { path: "/speakers", label: "Speaker Bios" },
    { path: "/crm", label: "CRM" },
    { path: "/resources", label: "Resource Management" },
    { path: "/reports", label: "Reports" },
    { path: "/breakout-sessions", label: "Breakout Sessions" },
    { path: "/mobile-app", label: "Mobile App" },
  ],
  admin: [
    { path: "/admin", label: "Admin Dashboard" },
    { path: "/admin/requests", label: "Review Requests" },
    { path: "/contracts", label: "Contract Generator" },
    { path: "/invoices", label: "Invoices" },
    { path: "/registration", label: "Registration" },
    { path: "/speakers", label: "Speaker Bios" },
    { path: "/crm", label: "CRM" },
    { path: "/resources", label: "Resource Management" },
    { path: "/reports", label: "Reports" },
    { path: "/accessibility-demo", label: "Accessibility" },
    { path: "/venues", label: "Venue Inventory" },
    { path: "/breakout-sessions", label: "Breakout Sessions" },
    { path: "/mobile-app", label: "Mobile App" },
    { path: "/security-settings", label: "Security Settings" },
    { path: "/data-migration", label: "Data Migration" },
    { path: "/compliance", label: "Compliance" },
  ],
  default: [
    { path: "/login", label: "Login" },
    { path: "/public", label: "Public Calendar" },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role || 'default';
  const navItems = allNavItems[role] || allNavItems.default;

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-gray-900 text-white min-h-screen flex flex-col justify-between p-6 shadow-xl">
      <div>
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-2xl font-bold tracking-wide text-blue-300">EVMS</h2>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ path, label }) => {
            const isActive =
              location.pathname === path ||
              location.pathname.startsWith(path + "#");
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

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
      >
        Log Out
      </button>
    </aside>
  );
}
