import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      
      // Mock authentication for development
      let mockUser;
      if (credentials.email === "admin@vccs.edu" && credentials.password === "admin123") {
        mockUser = {
          id: 1,
          name: "Admin User",
          email: "admin@vccs.edu",
          role: "admin"
        };
      } else if (credentials.email === "manager@vccs.edu" && credentials.password === "manager123") {
        mockUser = {
          id: 2,
          name: "Event Manager",
          email: "manager@vccs.edu",
          role: "eventManager"
        };
      } else if (credentials.email === "student@vccs.edu" && credentials.password === "student123") {
        mockUser = {
          id: 3,
          name: "Student User",
          email: "student@vccs.edu",
          role: "student"
        };
      } else {
        throw new Error("Invalid credentials");
      }
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { user: mockUser };
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      
      // Mock registration for development
      const mockUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: "student" // Default role for new registrations
      };
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { user: mockUser };
    } catch (error) {
      setError(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    // Clear all stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    setUser(null);
    setError(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEventManager: user?.role === 'eventManager',
    isStudent: user?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
