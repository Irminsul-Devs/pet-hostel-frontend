import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import StaffNavbar from "../components/StaffNavbar";
import CreateBookingModal from "../components/CreateBookingModal";
import BookingInfoModal from "../components/BookingInfoModal";
import EditBookingModal from "../components/EditBookingModal";
import DeleteBookingModal from "../components/DeleteBookingModal";
import { MdInfoOutline, MdEdit, MdDelete } from "react-icons/md";
import type { User, Booking } from "../types";

export default function StaffDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">(
    "dashboard"
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [infoBooking, setInfoBooking] = useState<Booking | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
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

  // Fetch bookings data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        if (user) {
          // Modify the endpoint to fetch all bookings (staff should see all bookings)
          // The backend should handle authorization and return all bookings for staff users
          const response = await fetch(
            "http://localhost:5000/api/bookings/all",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch bookings");

          const data = await response.json();
          console.log("API Response:", data);

          // Transform the data to match your Booking type
          const transformedData = data.map((item: any) => ({
            id: item.id,
            bookingDate: item.booking_date,
            name: item.name,
            mobile: item.mobile,
            email: item.email,
            remarks: item.remarks,
            ownerName: item.owner_name,
            ownerMobile: item.owner_mobile,
            ownerDob: item.owner_dob,
            ownerEmail: item.owner_email,
            ownerAddress: item.owner_address,
            petName: item.pet_name,
            petType: item.pet_type,
            bookingFrom: item.booking_from,
            bookingTo: item.booking_to,
            services: item.services,
            petDob: item.pet_dob,
            petAge: item.pet_age,
            petFood: item.pet_food,
            vaccinationCertificate: item.vaccination_certificate,
            petVaccinated: Boolean(item.pet_vaccinated), // Convert 1/0 to boolean
            userId: item.user_id,
          }));

          console.log("Transformed Bookings:", transformedData);
          setBookings(transformedData);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err instanceof Error ? err.message : "Loading error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCreateBooking = async (formData: BookingFormData) => {
    try {
      const token = localStorage.getItem("token");

      // Convert form data to full booking
      const newBooking: Omit<Booking, "id"> = {
        ...formData,
        vaccinationCertificate: formData.vaccinationCertificate
          ? await convertFileToBase64(formData.vaccinationCertificate)
          : null,
        userId: user?.id || null,
        petVaccinated: formData.petVaccinated,
      };

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
      setBookings((prev) => [...prev, data]);
      setShowBookingModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Creation error");
    }
  };

  const handleUpdateBooking = async (updatedBooking: Booking) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/bookings/${updatedBooking.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBooking),
        }
      );

      if (!response.ok) throw new Error("Failed to update booking");

      const data = await response.json();

      // Transform the response data to match your Booking type
      const transformedBooking = {
        id: data.id,
        bookingDate: data.booking_date,
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        remarks: data.remarks,
        ownerName: data.owner_name,
        ownerMobile: data.owner_mobile,
        ownerDob: data.owner_dob,
        ownerEmail: data.owner_email,
        ownerAddress: data.owner_address,
        petName: data.pet_name,
        petType: data.pet_type,
        bookingFrom: data.booking_from,
        bookingTo: data.booking_to,
        services: data.services,
        petDob: data.pet_dob,
        petAge: data.pet_age,
        petFood: data.pet_food,
        vaccinationCertificate: data.vaccination_certificate,
        petVaccinated: Boolean(data.pet_vaccinated),
        userId: data.user_id,
      };

      return transformedBooking;
    } catch (err) {
      throw err;
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

      if (!response.ok) throw new Error("Failed to delete booking");

      setBookings((prev) => prev.filter((b) => b.id !== id));
      setDeleteBookingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deletion error");
    }
  };

  return (
    <>
      <StaffNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="staff-dashboard">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        {activeTab === "dashboard" ? (
          <div className="dashboard-welcome">
            <h1 className="staff-dashboard-welcome">
              Welcome, {user?.name || "Staff Member"}!
            </h1>
            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <p>{bookings.length}</p>
              </div>
              <div className="stat-card">
                <h3>Active Bookings</h3>
                <p>
                  {
                    bookings.filter(
                      (b) =>
                        new Date(b.bookingFrom) <= new Date() &&
                        new Date(b.bookingTo) >= new Date()
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bookings-header">
              <button
                className="btn create-booking-btn"
                onClick={() => setShowBookingModal(true)}
              >
                + Create Booking
              </button>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading bookings...</div>
            ) : (
              <div className="staff-dashboard-table-wrapper">
                <table className="staff-dashboard-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Application Date</th>
                      <th>Pet Name</th>
                      <th>Owner</th>
                      <th>Contact</th>
                      <th>Booking Period</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length > 0 ? (
                      bookings.map((booking, index) => (
                        <tr key={booking.id}>
                          <td>{index + 1}</td>
                          <td>{formatDate(booking.bookingDate)}</td>
                          <td>
                            {booking.petName} ({booking.petType})
                          </td>
                          <td>{booking.ownerName}</td>
                          <td>
                            <div>{booking.ownerMobile}</div>
                            <div className="text-muted">
                              {booking.ownerEmail}
                            </div>
                          </td>
                          <td>
                            {formatDate(booking.bookingFrom)}&nbsp; - &nbsp;
                            {formatDate(booking.bookingTo)}
                          </td>
                          <td className="actions-cell">
                            <button
                              className="icon-btn info-btn"
                              onClick={() => setInfoBooking(booking)}
                              title="View details"
                            >
                              <MdInfoOutline size={20} />
                            </button>
                            <button
                              className="icon-btn edit-btn"
                              onClick={() => setEditBooking(booking)}
                              title="Edit booking"
                            >
                              <MdEdit size={18} />
                            </button>
                            <button
                              className="icon-btn delete-btn"
                              onClick={() => setDeleteBookingId(booking.id)}
                              title="Delete booking"
                            >
                              <MdDelete size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="no-data">
                          No bookings found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
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
          onSave={async (updatedBooking) => {
            try {
              const updated = await handleUpdateBooking(updatedBooking);
              setBookings((prev) =>
                prev.map((b) => (b.id === updated.id ? updated : b))
              );
              setEditBooking(null);
            } catch (err) {
              setError(
                err instanceof Error ? err.message : "Failed to update booking"
              );
            }
          }}
        />
      )}

      {deleteBookingId !== null && (
        <DeleteBookingModal
          onCancel={() => setDeleteBookingId(null)}
          onConfirm={async () => {
            await handleDeleteBooking(deleteBookingId);
          }}
        />
      )}
    </>
  );
}
