import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";

export default function StaffDashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    // Mock bookings
    setBookings([
      {
        id: 1,
        date: "2025-06-21",
        name: "John Doe",
        mobile: "1234567890",
        email: "john@example.com",
        remarks: "No allergies",
      },
      {
        id: 2,
        date: "2025-06-22",
        name: "Jane Smith",
        mobile: "9876543210",
        email: "jane@example.com",
        remarks: "Needs special food",
      },
    ]);
  }, []);

  useEffect(() => {
    const handleOpenCreateBooking = () => handleCreateBooking();
    window.addEventListener("open-create-booking", handleOpenCreateBooking);
    return () => window.removeEventListener("open-create-booking", handleOpenCreateBooking);
  }, []);

  const handleCreateBooking = () => {
    // Show create booking modal or navigate
    alert("Create Booking clicked!");
  };

  const handleMoreInfo = (booking: any) => {};
  const handleEdit = (booking: any) => {};
  const handleDelete = (bookingId: string) => {};

  return (
    <div className="staff-dashboard">
      <h1 style={{ color: "#1ab3f0", marginBottom: "0.5em" }}>
        Welcome, {user?.name || "Staff"}!
      </h1>

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
        <tbody>
          {bookings.map((b, idx) => (
            <tr key={b.id}>
              <td>{idx + 1}</td>
              <td>{b.date}</td>
              <td>{b.name}</td>
              <td>{b.mobile}</td>
              <td>{b.email}</td>
              <td>{b.remarks}</td>
              <td>
                <button onClick={() => handleMoreInfo(b)} title="More Info">
                  🔍
                </button>
              </td>
              <td>
                <button onClick={() => handleEdit(b)} title="Edit">
                  ✏️
                </button>
                <button onClick={() => handleDelete(b.id)} title="Delete">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
