import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'eventManager':
        return <Navigate to="/event-manager" replace />;
      default:
        return <Navigate to="/public" replace />;
    }
  }

  return children;
}
