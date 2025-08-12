import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EventManager from "./pages/EventManager";
import ManagerCreateEvent from "./pages/ManagerCreateEvent";
import PublicView from "./pages/PublicView";
import ReviewRequests from "./pages/ReviewRequests";
import ContractGenerator from "./pages/ContractGenerator";
import InvoiceManager from "./pages/InvoiceManager";
import RegistrationPage from "./pages/RegistrationPage";
import SpeakerBios from "./pages/SpeakerBios";
import CRM from "./pages/CRM";
import ResourceManagement from "./pages/ResourceManagement";
import Reports from "./pages/Reports";
import AccessibilityDemo from "./pages/AccessibilityDemo";
import EventRequestForm from "./pages/EventRequestForm";
import EmailRegistrants from "./pages/EmailRegistrants";
import StudentDashboard from "./pages/StudentDashboard"; // NEW

// RFP Pages
import Venues from "./pages/Venues";
import BreakoutSessions from "./pages/BreakoutSessions";
import MobileApp from "./pages/MobileApp";
import SecuritySettings from "./pages/SecuritySettings";
import DataMigration from "./pages/DataMigration";
import Compliance from "./pages/Compliance";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { EventProvider } from "./contexts/EventContext";
import { AuthProvider } from "./contexts/AuthContext";

// Default redirect component that routes users to appropriate dashboard based on role
function DefaultRedirect() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'eventManager':
      return <Navigate to="/event-manager" replace />;
    default:
      return <Navigate to="/public" replace />;
  }
}

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login";

  return (
    <AuthProvider>
      <EventProvider>
      {hideSidebar ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <AppLayout>
          <Routes>
            {/* Public routes */}
            <Route path="/public" element={<PublicView />} />
            <Route path="/student" element={<StudentDashboard />} /> {/* NEW */}
            <Route path="/request-event" element={<EventRequestForm />} />
            <Route path="/speakers" element={<SpeakerBios />} />
            <Route path="/registration" element={<RegistrationPage />} />

            {/* Admin */}
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

            {/* Event Manager */}
            <Route
              path="/event-manager"
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
            <Route
              path="/email-registrants"
              element={
                <ProtectedRoute allowedRoles={["admin", "eventManager"]}>
                  <EmailRegistrants />
                </ProtectedRoute>
              }
            />

            {/* Shared Tools */}
            <Route
              path="/contracts"
              element={
                <ProtectedRoute allowedRoles={["admin", "eventManager"]}>
                  <ContractGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute allowedRoles={["admin", "eventManager"]}>
                  <InvoiceManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm"
              element={
                <ProtectedRoute allowedRoles={["admin", "eventManager"]}>
                  <CRM />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute allowedRoles={["admin", "eventManager"]}>
                  <ResourceManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={["admin", "eventManager"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* RFP Pages */}
            <Route
              path="/venues"
              element={
                <ProtectedRoute allowedRoles={["admin", "eventManager"]}>
                  <Venues />
                </ProtectedRoute>
              }
            />
            <Route
              path="/breakout-sessions"
              element={
                <ProtectedRoute allowedRoles={["admin", "eventManager"]}>
                  <BreakoutSessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mobile-app"
              element={
                <ProtectedRoute allowedRoles={["admin", "eventManager"]}>
                  <MobileApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/security-settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SecuritySettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-migration"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DataMigration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compliance"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Compliance />
                </ProtectedRoute>
              }
            />

            {/* Misc */}
            <Route path="/accessibility-demo" element={<AccessibilityDemo />} />
            
            {/* Default redirect based on user role */}
            <Route path="*" element={<DefaultRedirect />} />
          </Routes>
        </AppLayout>
      )}
      </EventProvider>
    </AuthProvider>
  );
}
