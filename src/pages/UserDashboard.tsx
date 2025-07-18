import { useEffect, useState } from "react";
import type { User, Booking } from "../types";
import "../styles/UserDashboard.css";
import UserNavbar from "../components/UserNavbar";
import BookingInfoModal from "../components/BookingInfoModal";
import CustomerBookingModal from "../components/CustomerBookingModal";
import UserProfileModal from "../components/UserProfileModal";
import { MdInfoOutline, MdDelete } from "react-icons/md";
import DeleteBookingModal from "../components/DeleteBookingModal";

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">("dashboard");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [infoBooking, setInfoBooking] = useState<Booking | null>(null);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const refreshUser = () => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  };

  useEffect(() => {
    refreshUser();
    fetchBookings();

    // Check for user changes every second
    const interval = setInterval(refreshUser, 1000);
    return () => clearInterval(interval);
  }, [])
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

      const transformed: Booking[] = data.map((b: any) => ({
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

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const totalThisMonth = transformed
        .filter((b) => {
          const booking = new Date(b.bookingDate);
          return (
            booking.getMonth() === currentMonth &&
            booking.getFullYear() === currentYear
          );
        })
        .reduce((sum, b) => sum + (typeof b.amount === "number" ? b.amount : Number(b.amount) || 0), 0);

      setMonthlyAmount(totalThisMonth);

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
  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      setBookings((prev) => prev.filter((b) => b.id !== bookingToDelete.id));
      setShowDeleteModal(false);
      setBookingToDelete(null);
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert(err instanceof Error ? err.message : "Failed to delete booking");
    }
  };
  const getPetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "cat":
        return "🐱";
      case "dog":
        return "🐶";
      case "bird":
        return "🐦";
      default:
        return "🐾";
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
          <div className="dashboard-welcome">
            <h3>Welcome, {user?.name || "User"}! {user?.name && " 🐾"}</h3>

            <div className="summary-cards">
              <div className="card">
                <h3>Total Bookings</h3>
                <p>{bookings.length}</p>
              </div>
              <div className="card">
                <h3>Completed Bookings</h3>
                <p>{bookings.filter(b => new Date(b.bookingTo) < new Date()).length}</p>
              </div>
              <div className="card">
                <h3>Upcoming Bookings</h3>
                <p>{bookings.filter(b => new Date(b.bookingFrom) > new Date()).length}</p>
              </div>
              <div className="card">
                <h3>Monthly Spending</h3>
                <p>₹{monthlyAmount.toFixed(2)}</p>
              </div>
            </div>

            <h2 className="section-titleh2">Your Pets Appointments</h2>
            <div className="pet-c">
              {bookings.filter(b => new Date(b.bookingTo) >= new Date()).length > 0 ? (
                bookings
                  .filter(b => new Date(b.bookingTo) >= new Date())
                  .map((booking) => (
                    <div key={booking.id} className="pet-card">
                      <h3>{getPetIcon(booking.petType)} {booking.petName}</h3>
                      <p><strong>Type:</strong> {booking.petType} &nbsp;&nbsp; <strong>Age:</strong> {booking.petAge}</p>
                      <p><strong>Vaccinated:</strong> {booking.petVaccinated ? "Yes" : "No"}</p>
                      <p><strong>Booking Period:</strong><br></br> {formatDate(booking.bookingFrom)} – {formatDate(booking.bookingTo)}</p>
                    </div>
                  ))
              ) : (
                <p style={{ fontSize: "1.2rem", color: "#999", textAlign: "center", width: "140%" }}>
                  🐾 No active appointments at the moment.
                </p>
              )}
            </div>

            <br></br>
            <h2 className="section-title">Available Services & Pricing</h2>
            <div className="services-card-container">
              <div className="service-cards">
                <h4>🐾 Boarding</h4>
                <p>₹35.00 <span className="unit">/ day</span></p>
              </div>
              <div className="service-cards">
                <h4>✂️ Grooming</h4>
                <p>₹45.00 <span className="unit">/ day</span></p>
              </div>
              <div className="service-cards">
                <h4>🎓 Training</h4>
                <p>₹50.00 <span className="unit">/ day</span></p>
              </div>
              <div className="service-cards">
                <h4>🍼 Day Care</h4>
                <p>₹25.00 <span className="unit">/ day</span></p>
              </div>
            </div>
          </div>
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
                  <th>Application Date</th>
                  <th>Booking Period</th>
                  <th>Service Opted</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <tr key={booking.id}>
                      <td>{index + 1}</td>
                      <td>{formatDate(booking.bookingDate)}</td>
                      <td>
                        {formatDate(booking.bookingFrom)} - {formatDate(booking.bookingTo)}
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
                        <button title="Delete Booking" style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#e74c3c",
                        }}
                          onClick={() => {
                            setBookingToDelete(booking);
                            setShowDeleteModal(true);
                          }}
                        >
                          <MdDelete size={22} />
                        </button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "1em" }}>
                      No bookings found. Click the "Create Booking" button to add a new booking!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      {showBookingModal && (
        <CustomerBookingModal
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
      {showDeleteModal && bookingToDelete && (
        <DeleteBookingModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteBooking}
        />
      )}

    </>
  );
}
