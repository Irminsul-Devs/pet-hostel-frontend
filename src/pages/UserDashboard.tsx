import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import "../styles/UserDashboard.css";
import UserNavbar from "../components/UserNavbar";
import CreateBookingModal from "../components/CreateBookingModal";
import UserProfileModal from "../components/UserProfileModal";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">("dashboard");
  const [bookings, setBookings] = useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    // Dummy bookings with fromDate and toDate
    setBookings([
      {
        id: 1,
        fromDate: "2025-06-01",
        toDate: "2025-06-03",
        services: ["Boarding", "Grooming"],
        remarks: "Regular check-in",
      },
      {
        id: 2,
        fromDate: "2025-06-15",
        toDate: "2025-06-17",
        services: ["Training"],
        remarks: "Puppy obedience course",
      },
      {
        id: 3,
        fromDate: "2025-06-22",
        toDate: "2025-06-22",
        services: ["Day Care"],
        remarks: "Half-day stay",
      },
    ]);
  }, []);

  useEffect(() => {
    const handler = () => setShowBookingModal(true);
    window.addEventListener("open-create-booking", handler);
    return () => window.removeEventListener("open-create-booking", handler);
  }, []);

  return (
    <>
      <UserNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onProfileClick={() => setShowProfileModal(true)}
      />

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
                <th>Service Opted</th>
                <th>Remarks</th>
                <th>More Info</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td>{booking.fromDate} - {booking.toDate}</td>
                  <td>{booking.services.join(", ")}</td>
                  <td>{booking.remarks}</td>
                  <td className="tooltip-cell">
                    <div
                      className="tooltip-icon"
                      onClick={() => window.location.href = `/booking-details/${booking.id}`}
                      title={`Click to view full details`}
                    >
                      i
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showBookingModal && (
        <CreateBookingModal onClose={() => setShowBookingModal(false)} />
      )}

      {showProfileModal && (
        <UserProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}
