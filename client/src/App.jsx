import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Page imports
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resources from "./pages/Resources";
import ResourceDetails from "./pages/ResourceDetails";
import StudentDashboard from "./pages/StudentDashboard";
import BookingHistory from "./pages/BookingHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AdminResourceManagement from "./pages/AdminResourceManagement";
import CreateResource from "./pages/CreateResource";
import EditResource from "./pages/EditResource";
import AdminBookingManagement from "./pages/AdminBookingManagement";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "dark:bg-navy-900 dark:text-white border dark:border-navy-800 text-sm rounded-lg",
          duration: 4000,
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:id" element={<ResourceDetails />} />

        {/* Student Protected Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-history"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <BookingHistory />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/resources"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminResourceManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/resources/create"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/resources/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminBookingManagement />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;