import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "bookings" | "staff"
  >("dashboard");
  const [bookings, setBookings] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setBookings([]); // Empty bookings or fetch here
    setStaff([]); // Empty staff or fetch here
  }, []);

  return (
    <>
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="staff-dashboard">
        {activeTab === "dashboard" ? (
          <h1 style={{ color: "#1ab3f0", marginBottom: "0.5em" }}>
            Welcome, {user?.name || "Admin"}!
          </h1>
        ) : activeTab === "bookings" ? (
          <table className="staff-dashboard-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Booking Date</th>
                <th>Name</th>
                <th>Mobile No</th>
                <th>Email</th>
                <th>Remarks</th>
                <th>More Info</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{/* No bookings */}</tbody>
          </table>
        ) : (
          <table className="staff-dashboard-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{/* No staff */}</tbody>
          </table>
        )}
      </div>
    </>
  );
}
