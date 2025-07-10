import { useEffect, useState } from "react";
import type { User, Booking } from "../types";
import "../styles/StaffDashboard.css";
import UserNavbar from "../components/UserNavbar";
import BookingInfoModal from "../components/BookingInfoModal";
import CreateBookingModal from "../components/CreateBookingModal";
import UserProfileModal from "../components/UserProfileModal";
import { MdInfoOutline } from "react-icons/md";

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">(
    "dashboard"
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [infoBooking, setInfoBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    const testUserId = 1; // Test user ID
    setBookings([
      {
        id: 1,
        bookingDate: "2025-06-24",
        remarks: "First time boarding",
        petName: "Charlie",
        petType: "Dog",
        bookingFrom: "2025-06-24",
        bookingTo: "2025-06-28",
        services: ["Boarding"],
        petDob: "2020-05-01",
        petAge: "5",
        petFood: "Dry food",
        vaccinationCertificate: null,
        petVaccinated: true,
        userId: testUserId,
        customerId: testUserId,
        customer: {
          id: testUserId,
          name: "Charlie Owner",
          email: "charlie.owner@pet.com",
          mobile: "9876543210",
          dob: "1990-01-01",
          address: "123 Main St",
          role: "customer",
          password: "********",
        },
        amount: 140.0,
      },
      {
        id: 2,
        bookingDate: "2025-06-23",
        remarks: "Grooming only",
        petName: "Bella",
        petType: "Cat",
        bookingFrom: "2025-06-23",
        bookingTo: "2025-06-24",
        services: ["Grooming"],
        petDob: "2019-08-10",
        petAge: "6",
        petFood: "Wet food",
        vaccinationCertificate: null,
        petVaccinated: false,
        userId: testUserId,
        customerId: testUserId,
        customer: {
          id: testUserId,
          name: "Bella Owner",
          email: "bella.owner@pet.com",
          mobile: "9876500000",
          dob: "1988-03-15",
          address: "456 Park Ave",
          role: "customer",
          password: "********",
        },
        amount: 45.0,
      },
    ]);
  }, []);

  useEffect(() => {
    const handler = () => setShowBookingModal(true);
    window.addEventListener("open-create-booking", handler);
    return () => window.removeEventListener("open-create-booking", handler);
  }, []);

  const handleCreateBooking = async (newBooking: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBooking),
      });

      if (!response.ok) throw new Error("Failed to create booking");

      const data = await response.json();
      const transformedBooking = {
        id: data.id,
        bookingDate: data.booking_date,
        remarks: data.remarks,
        petName: data.pet_name,
        petType: data.pet_type,
        bookingFrom: data.booking_from,
        bookingTo: data.booking_to,
        services: Array.isArray(data.services) ? data.services : [],
        petDob: data.pet_dob,
        petAge: data.pet_age,
        petFood: data.pet_food,
        vaccinationCertificate: data.vaccination_certificate,
        petVaccinated: Boolean(data.pet_vaccinated),
        amount: data.amount,
        userId: data.user_id,
        customerId: data.customer_id,
        customer: data.customer,
      };

      setBookings((prev) => [...prev, transformedBooking]);
      setShowBookingModal(false);
    } catch (err) {
      console.error("Error creating booking:", err);
      alert(err instanceof Error ? err.message : "Failed to create booking");
    }
  };

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
                      <td>
                        {booking.bookingFrom} - {booking.bookingTo}
                      </td>
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
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: "1em" }}
                    >
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
        <CreateBookingModal
          onClose={() => setShowBookingModal(false)}
          onCreate={handleCreateBooking}
          userRole={user?.role || "customer"}
          userId={user?.id || 0}
        />
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
