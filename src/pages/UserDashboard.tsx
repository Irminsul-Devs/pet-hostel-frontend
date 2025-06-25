import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import "../styles/UserDashboard.css";
import UserNavbar from "../components/UserNavbar";
import BookingInfoModal from "../components/BookingInfoModal";
import CreateBookingModal from "../components/CreateBookingModal";
import UserProfileModal from "../components/UserProfileModal";
import { MdInfoOutline } from "react-icons/md";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">("dashboard");
  const [bookings, setBookings] = useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [infoBooking, setInfoBooking] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

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
          <>
            <button
              className="btn create-booking-btn"
              style={{ marginBottom: "1.2em" }}
              onClick={() => setShowBookingModal(true)}
            >
              + Create Booking
            </button>
            <table className="staff-dashboard-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Booking Period</th>
                  <th>Service Opted</th>
                  <th>Remarks</th>
                  <th>More Info</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <tr key={booking.id}>
                      <td>{index + 1}</td>
                      <td>{booking.bookingFrom} - {booking.bookingTo}</td>
                      <td>{booking.services.join(", ")}</td>
                      <td>{booking.remarks}</td>
                      <td>
                        <button
                          title="More Info"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#1ab3f0",
                          }}
                          onClick={() => setInfoBooking(booking)}
                        >
                          <MdInfoOutline size={22} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "1em" }}>
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      {showBookingModal && (
        <CreateBookingModal onClose={() => setShowBookingModal(false)} />
      )}

      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}

      {infoBooking && (
        <BookingInfoModal
          booking={infoBooking}
          onClose={() => setInfoBooking(null)}
        />
      )}
    </>
  );
}
