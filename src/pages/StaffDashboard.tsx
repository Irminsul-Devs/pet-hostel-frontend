import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import StaffNavbar from "../components/StaffNavbar";
import CreateBookingModal from "../components/CreateBookingModal";

export default function StaffDashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">(
    "dashboard"
  );
  const [bookings, setBookings] = useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setBookings([]); // can fetch bookings here later
  }, []);

  useEffect(() => {
    const handler = () => setShowBookingModal(true);
    window.addEventListener("open-create-booking", handler);
    return () => window.removeEventListener("open-create-booking", handler);
  }, []);

  return (
    <>
      <StaffNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="staff-dashboard">
        {activeTab === "dashboard" ? (
          <h1 style={{ color: "#1ab3f0", marginBottom: "0.5em" }}>
            Welcome, {user?.name || "Staff"}!
          </h1>
        ) : (
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
            <tbody>{/* No bookings yet */}</tbody>
          </table>
        )}
      </div>
      {showBookingModal && (
        <CreateBookingModal onClose={() => setShowBookingModal(false)} />
      )}
    </>
  );
}
