import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import UserNavbar from "../components/UserNavbar";

export default function UserDashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">(
    "dashboard"
  );
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setBookings([]); // Empty bookings or fetch here
  }, []);

  return (
    <>
      <UserNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="staff-dashboard">
        {activeTab === "dashboard" ? (
          <h1 style={{ color: "#1ab3f0", marginBottom: "0.5em" }}>
            Welcome, {user?.name || "User"}!
          </h1>
        ) : (
          <table className="staff-dashboard-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Booking Date</th>
                <th>Pet Name</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{/* No bookings */}</tbody>
          </table>
        )}
      </div>
    </>
  );
}
