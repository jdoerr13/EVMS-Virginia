import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EventManager from "./pages/EventManager";
import ManagerCreateEvent from "./pages/ManagerCreateEvent";
import PublicView from "./pages/PublicView";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute"; 
import ReviewRequests from "./pages/ReviewRequests";

export default function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login";

  // Login page - no sidebar
  if (isAuthRoute) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    );
  }

  // All other pages - with sidebar
  return (
    <div className="flex min-h-screen bg-light text-dark">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/public" element={<PublicView />} />

          {/* 🔐 Admin-only routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
              <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ReviewRequests />
              </ProtectedRoute>
            }
          />

          {/* 🔐 Event Manager-only routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["eventManager"]}>
                <EventManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/create"
            element={
              <ProtectedRoute allowedRoles={["eventManager"]}>
                <ManagerCreateEvent />
              </ProtectedRoute>
            }
          />
      
        </Routes>
      </main>
    </div>
  );
}
