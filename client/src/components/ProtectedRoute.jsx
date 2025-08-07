import React from "react";
import { Navigate } from "react-router-dom";
import { useRole } from "../contexts/RoleContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role } = useRole();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
