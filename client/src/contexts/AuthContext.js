// client/src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore from localStorage on load
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Demo-only login (matches your seeded users)
  async function login({ email, password }) {
    setError(null);
    let mockUser = null;

    if (email === "admin@vccs.edu" && password === "admin123") {
      mockUser = { id: 1, name: "Admin User", email, role: "admin" };
    } else if (email === "manager@vccs.edu" && password === "manager123") {
      mockUser = { id: 2, name: "Event Manager", email, role: "eventManager" };
    } else if (email === "student@vccs.edu" && password === "student123") {
      mockUser = { id: 3, name: "Student User", email, role: "student" };
    } else {
      setError("Invalid credentials");
      throw new Error("Invalid credentials");
    }

    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    return { user: mockUser };
  }

  function register({ name, email }) {
    const mockUser = { id: Date.now(), name, email, role: "student" };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    return { user: mockUser };
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateUser: (u) => { setUser(u); localStorage.setItem("user", JSON.stringify(u)); },
    clearError: () => setError(null),
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isEventManager: user?.role === "eventManager",
    isStudent: user?.role === "student",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
