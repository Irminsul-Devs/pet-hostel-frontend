import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import StaffNavbar from "../components/StaffNavbar";
import CreateBookingModal from "../components/CreateBookingModal";
import BookingInfoModal from "../components/BookingInfoModal";
import EditBookingModal from "../components/EditBookingModal";
import DeleteBookingModal from "../components/DeleteBookingModal";
import { MdInfoOutline, MdEdit, MdDelete } from "react-icons/md";
import type { User, Booking } from "../types";

// This is needed to make TypeScript recognize HTML elements in JSX
declare namespace JSX {
  interface IntrinsicElements {
    div: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >;
    button: React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >;
    table: React.DetailedHTMLProps<
      React.TableHTMLAttributes<HTMLTableElement>,
      HTMLTableElement
    >;
    thead: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLTableSectionElement>,
      HTMLTableSectionElement
    >;
    tbody: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLTableSectionElement>,
      HTMLTableSectionElement
    >;
    tr: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLTableRowElement>,
      HTMLTableRowElement
    >;
    th: React.DetailedHTMLProps<
      React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
      HTMLTableHeaderCellElement
    >;
    td: React.DetailedHTMLProps<
      React.TdHTMLAttributes<HTMLTableDataCellElement>,
      HTMLTableDataCellElement
    >;
    h1: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >;
    h3: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >;
    p: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >;
  }
}

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
          // Debug specific fields
          if (data && data.length > 0) {
            console.log(
              "First booking amount:",
              data[0].amount,
              typeof data[0].amount
            );
            console.log("Sample booking data:", data[0]);
          }

          // Transform the data to match your Booking type
          const transformedData = data.map((item: any) => {
            // Handle amount specially to ensure it's a number
            let amount = 0;
            if (item.amount !== null && item.amount !== undefined) {
              // Convert to number and handle different formats
              amount =
                typeof item.amount === "string"
                  ? parseFloat(item.amount)
                  : Number(item.amount);

              // If it's NaN, set to 0
              if (isNaN(amount)) amount = 0;
            }

            return {
              id: item.id,
              bookingDate: item.booking_date,
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
              services: Array.isArray(item.services) ? item.services : [],
              petDob: item.pet_dob,
              petAge: item.pet_age,
              petFood: item.pet_food,
              vaccinationCertificate: item.vaccination_certificate,
              petVaccinated: Boolean(item.pet_vaccinated), // Convert 1/0 to boolean
              amount: amount, // Use the properly processed amount
              userId: item.user_id,
            };
          });

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

  const handleCreateBooking = async (newBooking: Omit<Booking, "id">) => {
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

      // Transform the response data to match your Booking type format
      // Handle amount specially to ensure it's a number
      let amount = 0;
      if (data.amount !== null && data.amount !== undefined) {
        amount =
          typeof data.amount === "string"
            ? parseFloat(data.amount)
            : Number(data.amount);

        if (isNaN(amount)) amount = 0;
      }

      const transformedBooking = {
        id: data.id,
        bookingDate: data.booking_date,
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
        services: Array.isArray(data.services) ? data.services : [],
        petDob: data.pet_dob,
        petAge: data.pet_age,
        petFood: data.pet_food,
        vaccinationCertificate: data.vaccination_certificate,
        petVaccinated: Boolean(data.pet_vaccinated),
        amount: amount,
        userId: data.user_id,
      };

      setBookings((prev) => [...prev, transformedBooking]);
      setShowBookingModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Creation error");
    }
  };

  const handleUpdateBooking = async (updatedBooking: Booking) => {
    try {
      // Debug log to check if amount is being sent correctly
      console.log("Updating booking with amount:", updatedBooking.amount);

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
      console.log("API response after update:", data);
      console.log("Amount in API response:", data.amount, typeof data.amount);

      // Transform the response data to match your Booking type
      // Handle amount specially to ensure it's a number
      let amount = 0;
      if (data.amount !== null && data.amount !== undefined) {
        amount =
          typeof data.amount === "string"
            ? parseFloat(data.amount)
            : Number(data.amount);

        if (isNaN(amount)) amount = 0;
      }

      const transformedBooking = {
        id: data.id,
        bookingDate: data.booking_date,
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
        services: Array.isArray(data.services) ? data.services : [],
        petDob: data.pet_dob,
        petAge: data.pet_age,
        petFood: data.pet_food,
        vaccinationCertificate: data.vaccination_certificate,
        petVaccinated: Boolean(data.pet_vaccinated),
        amount: amount,
        userId: data.user_id,
      };

      // Update the booking in the state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === transformedBooking.id ? transformedBooking : b
        )
      );

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
              <div className="stat-card">
                <h3>Past Bookings</h3>
                <p>
                  {
                    bookings.filter((b) => new Date(b.bookingTo) < new Date())
                      .length
                  }
                </p>
              </div>
              <div className="stat-card">
                <h3>Future Bookings</h3>
                <p>
                  {
                    bookings.filter((b) => new Date(b.bookingFrom) > new Date())
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bookings-header">
              <button
                className="create-booking-btn"
                onClick={() => setShowBookingModal(true)}
              >
                Create Booking
              </button>

              <div className="booking-status-legend">
                <div className="status-item">
                  <span className="status-dot status-active"></span>
                  <span>Active</span>
                </div>
                <div className="status-item">
                  <span className="status-dot status-past"></span>
                  <span>Past</span>
                </div>
                <div className="status-item">
                  <span className="status-dot status-future"></span>
                  <span>Future</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading bookings...</div>
            ) : (
              <table className="staff-dashboard-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Application Date</th>
                    <th>Pet Name</th>
                    <th>Owner</th>
                    <th>Contact</th>
                    <th>Booking Period</th>
                    <th>Amount</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((booking, index) => {
                      // Determine booking status
                      const now = new Date();
                      const bookingFrom = new Date(booking.bookingFrom);
                      const bookingTo = new Date(booking.bookingTo);

                      const isActive = bookingFrom <= now && bookingTo >= now;
                      const isPast = bookingTo < now;
                      const isFuture = bookingFrom > now;

                      // Set appropriate class name for status indicator
                      let statusClassName = "";
                      if (isActive) statusClassName = "active-booking";
                      else if (isPast) statusClassName = "past-booking";
                      else if (isFuture) statusClassName = "future-booking";

                      return (
                        <tr key={booking.id} className={statusClassName}>
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
                          <td style={{ color: "#4cd137", fontWeight: "500" }}>
                            $
                            {(() => {
                              // Debug log to see what's coming from the backend
                              console.log(
                                `Booking ${booking.id} amount:`,
                                booking.amount,
                                typeof booking.amount
                              );
                              return booking.amount
                                ? Number(booking.amount).toFixed(2)
                                : "0.00";
                            })()}
                          </td>
                          <td>{booking.remarks || "N/A"}</td>
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
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="no-data">
                        No bookings found. Click the "Create Booking" button to
                        add a new booking.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
              await handleUpdateBooking(updatedBooking);
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
