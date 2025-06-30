import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import StaffNavbar from "../components/StaffNavbar";
import CreateBookingModal from "../components/CreateBookingModal";
import BookingInfoModal from "../components/BookingInfoModal";
import EditBookingModal from "../components/EditBookingModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { MdInfoOutline, MdEdit, MdDelete } from "react-icons/md";
import type { User, Booking } from "../types";

export default function StaffDashboard() {
  const user: User | null = (() => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
})();
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">("dashboard");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [infoBooking, setInfoBooking] = useState<Booking | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        // Only fetch bookings if we have a user
        if (user) {
          const bookingsRes = await fetch("http://localhost:5000/api/bookings", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
          
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(err instanceof Error ? err.message : "Loading error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // Add user as dependency

  const handleCreateBooking = async (newBooking: Booking) => {
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(newBooking)
      });

      if (!response.ok) throw new Error("Failed to create booking");
      
      const data = await response.json();
      setBookings(prev => [...prev, data]);
      setShowBookingModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Creation error");
    }
  };

  const handleUpdateBooking = async (updatedBooking: Booking) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/bookings/${updatedBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBooking),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      const data = await response.json();
      setBookings(prev => prev.map(b => b.id === data.id ? data : b));
      setEditBooking(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking");
      console.error("Update booking error:", err);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      setBookings(prev => prev.filter(b => b.id !== id));
      setDeleteBookingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete booking");
      console.error("Delete booking error:", err);
    }
  };

  return (
    <>
      <StaffNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="staff-dashboard">
        {error && <div className="error-message">{error}</div>}
        
        {activeTab === "dashboard" ? (
          <h1 className="staff-dashboard-welcome" style={{ marginBottom: "0.5em" }}>
            Welcome, {user?.name || "User"}!
          </h1>
        ) : (
          <>
            <button
              className="btn create-booking-btn"
              style={{ marginBottom: "1.2em" }}
              onClick={() => setShowBookingModal(true)}
            >
              + Create Booking
            </button>
            
            {loading ? (
              <div>Loading bookings...</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
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
                    {bookings.length > 0 ? (
                      bookings.map((b, i) => (
                        <tr key={b.id}>
                          <td>{i + 1}</td>
                          <td>{b.bookingDate}</td>
                          <td>{b.name}</td>
                          <td>{b.mobile}</td>
                          <td>{b.email}</td>
                          <td>{b.remarks}</td>
                          <td>
                            <button
                              title="More Info"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#1ab3f0",
                              }}
                              onClick={() => setInfoBooking(b)}
                            >
                              <MdInfoOutline size={22} />
                            </button>
                          </td>
                          <td>
                            <button
                              title="Edit"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#1ab3f0",
                                marginRight: 6,
                              }}
                              onClick={() => setEditBooking(b)}
                            >
                              <MdEdit size={20} />
                            </button>
                            <button
                              title="Delete"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#e74c3c",
                              }}
                              onClick={() => setDeleteBookingId(b.id)}
                            >
                              <MdDelete size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8}>No bookings found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {showBookingModal && (
        <CreateBookingModal 
          onClose={() => setShowBookingModal(false)}
          onCreate={handleCreateBooking}
        />
      )}

      {infoBooking && (
        <BookingInfoModal
          booking={infoBooking}
          onClose={() => setInfoBooking(null)}
        />
      )}
      
      {editBooking && (
        <EditBookingModal
          booking={editBooking}
          onClose={() => setEditBooking(null)}
          onSave={handleUpdateBooking}
        />
      )}
      
      {deleteBookingId !== null && (
        <DeleteConfirmModal
          onCancel={() => setDeleteBookingId(null)}
          onConfirm={() => handleDeleteBooking(deleteBookingId)}
        />
      )}
    </>
  );
}