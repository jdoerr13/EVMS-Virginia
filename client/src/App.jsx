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
import ContractGenerator from "./pages/ContractGenerator";
import InvoiceManager from "./pages/InvoiceManager";
import RegistrationPage from "./pages/RegistrationPage";
import SpeakerBios from "./pages/SpeakerBios";
import CRM from "./pages/CRM";
import ResourceManagement from "./pages/ResourceManagement";
import Reports from "./pages/Reports";
import AccessibilityDemo from "./pages/AccessibilityDemo";
import EventRequestForm from "./pages/EventRequestForm";
import { EventProvider } from "./contexts/EventContext";

export default function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login";

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

  return (
    <EventProvider> {/* ✅ Wrap everything so PublicView has events */}
      <div className="flex min-h-screen bg-light text-dark">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/public" element={<PublicView />} />
            <Route path="/request-event" element={<EventRequestForm />} />

            {/* 🔐 Admin-only routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }/>
            <Route path="/admin/requests" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ReviewRequests />
              </ProtectedRoute>
            }/>
            <Route path="/contracts" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ContractGenerator />
              </ProtectedRoute>
            }/>
            <Route path="/invoices" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <InvoiceManager />
              </ProtectedRoute>
            }/>
            <Route path="/registration" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <RegistrationPage />
              </ProtectedRoute>
            }/>
            <Route path="/speakers" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <SpeakerBios />
              </ProtectedRoute>
            }/>
            <Route path="/crm" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CRM />
              </ProtectedRoute>
            }/>
            <Route path="/resources" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ResourceManagement />
              </ProtectedRoute>
            }/>
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reports />
              </ProtectedRoute>
            }/>
            <Route path="/accessibility-demo" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AccessibilityDemo />
              </ProtectedRoute>
            }/>

            {/* 🔐 Event Manager-only routes */}
            <Route path="/manager" element={
              <ProtectedRoute allowedRoles={["eventManager"]}>
                <EventManager />
              </ProtectedRoute>
            }/>
            <Route path="/manager/create" element={
              <ProtectedRoute allowedRoles={["eventManager"]}>
                <ManagerCreateEvent />
              </ProtectedRoute>
            }/>
          </Routes>
        </main>
      </div>
    </EventProvider>
  );
}
