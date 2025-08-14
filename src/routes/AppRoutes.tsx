import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import StaffDashboard from "../pages/StaffDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import About from "../pages/About";
import Contact from "../pages/Contact";
import { useEffect, useState, type JSX } from "react";

export default function AppRoutes() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const updateUser = () => {
      const saved = localStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    };
    updateUser();
    window.addEventListener("storage", updateUser);
    window.addEventListener("user-login", updateUser);
    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("user-login", updateUser);
    };
  }, []);

  console.log("Current user:", user);

  // Helper for role-based access
  const ProtectedRoute = ({ children, role }: { children: JSX.Element; role: string }) => {
    if (user?.role === role) {
      return children;
    }
    return <Navigate to="/" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute role="customer">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-dashboard"
        element={
          <ProtectedRoute role="staff">
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      {/* Catch all unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
