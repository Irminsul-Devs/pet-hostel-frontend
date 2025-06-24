import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import StaffNavbar from "../components/StaffNavbar";
import CreateBookingModal from "../components/CreateBookingModal";
import BookingInfoModal from "../components/BookingInfoModal";
import EditBookingModal from "../components/EditBookingModal";
import { MdInfoOutline, MdEdit, MdDelete } from "react-icons/md";

export default function StaffDashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">(
    "dashboard"
  );
  const [bookings, setBookings] = useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [infoBooking, setInfoBooking] = useState<any | null>(null);
  const [editBooking, setEditBooking] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    // Add some dummy bookings with all required fields
    setBookings([
      {
        id: 1,
        bookingDate: "2025-06-24",
        name: "Charlie",
        mobile: "9876543210",
        email: "charlie@pet.com",
        remarks: "First time boarding",
        ownerName: "Charlie Owner",
        ownerMobile: "9876543210",
        ownerDob: "1990-01-01",
        ownerEmail: "charlie.owner@pet.com",
        ownerAddress: "123 Main St",
        petName: "Charlie",
        petType: "Dog",
        bookingFrom: "2025-06-24",
        bookingTo: "2025-06-28",
        services: ["Boarding"],
        petDob: "2020-05-01",
        petAge: "5",
        petFood: "Dry food",
        signature: "Charlie Owner",
        acknowledge: true,
        vaccinationCertificate: null,
        petVaccinated: true,
      },
      {
        id: 2,
        bookingDate: "2025-06-23",
        name: "Bella",
        mobile: "9876500000",
        email: "bella@pet.com",
        remarks: "Grooming only",
        ownerName: "Bella Owner",
        ownerMobile: "9876500000",
        ownerDob: "1988-03-15",
        ownerEmail: "bella.owner@pet.com",
        ownerAddress: "456 Park Ave",
        petName: "Bella",
        petType: "Cat",
        bookingFrom: "2025-06-23",
        bookingTo: "2025-06-24",
        services: ["Grooming"],
        petDob: "2019-08-10",
        petAge: "6",
        petFood: "Wet food",
        signature: "Bella Owner",
        acknowledge: true,
        vaccinationCertificate: null,
        petVaccinated: false,
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
      <StaffNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="staff-dashboard">
        {activeTab === "dashboard" ? (
          <h1 style={{ color: "#1ab3f0", marginBottom: "0.5em" }}>
            Welcome, {user?.name || "Staff"}!
          </h1>
        ) : (
          <>
            {/* Add Create Booking button here */}
            <button
              className="btn create-booking-btn"
              style={{ marginBottom: "1.2em" }}
              onClick={() => setShowBookingModal(true)}
            >
              + Create Booking
            </button>
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
          </>
        )}
      </div>
      {showBookingModal && (
        <CreateBookingModal onClose={() => setShowBookingModal(false)} />
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
          onSave={(updated) => {
            setBookings((prev) =>
              prev.map((bk) => (bk.id === updated.id ? updated : bk))
            );
          }}
        />
      )}
    </>
  );
}
