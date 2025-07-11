import { useEffect, useState } from "react";
import type { User, Booking } from "../types";
import "../styles/StaffDashboard.css";
import UserNavbar from "../components/UserNavbar";
import BookingInfoModal from "../components/BookingInfoModal";
import CustomerBookingModal from "../components/CustomerBookingModal";
import UserProfileModal from "../components/UserProfileModal";
import { MdInfoOutline } from "react-icons/md";

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">("dashboard");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [infoBooking, setInfoBooking] = useState<Booking | null>(null);

  // ✅ Load user and bookings on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchBookings();
    }
  }, []);

  // ✅ Fetch bookings from backend (only logged-in user's bookings)
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch bookings");

      const data = await response.json();

      const transformed = data.map((b: any) => ({
        id: b.id,
        bookingDate: b.booking_date,
        remarks: b.remarks,
        petName: b.pet_name,
        petType: b.pet_type,
        bookingFrom: b.booking_from,
        bookingTo: b.booking_to,
        services: Array.isArray(b.services) ? b.services : [],
        petDob: b.pet_dob,
        petAge: b.pet_age,
        petFood: b.pet_food,
        vaccinationCertificate: b.vaccination_certificate,
        petVaccinated: Boolean(b.pet_vaccinated),
        amount: b.amount,
        userId: b.user_id,
        customerId: b.customer_id,
        customer: b.customer,
      }));

      setBookings(transformed);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };
const formatDate = (dateString: string | null) => {
    if (!dateString || dateString === "0000-00-00 00:00:00") return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // ✅ Handle booking submission
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
    <th>Application Date</th> {/* ✅ New column */}
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
         <td>{formatDate(booking.bookingDate)}</td> 
        <td>
          {formatDate(booking.bookingFrom)}&nbsp; - &nbsp;
          {formatDate(booking.bookingTo)}
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
      <td colSpan={6} style={{ textAlign: "center", padding: "1em" }}>
        No bookings found.Click the "Create Booking" button to add a new booking!
      </td>
    </tr>
  )}
</tbody>
</table>
          </>
        )}
      </div>

      {/* ✅ Create Booking Modal */}
      {showBookingModal && (
        <CustomerBookingModal
          onClose={() => setShowBookingModal(false)}
          onCreate={handleCreateBooking}
          userRole={user?.role || "customer"}
          userId={user?.id || 0}
        />
      )}

      {/* ✅ Profile Modal */}
      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}

      {/* ✅ Booking Info Modal */}
      {infoBooking && (
        <BookingInfoModal
          booking={infoBooking}
          onClose={() => setInfoBooking(null)}
        />
      )}
    </>
  );
}
