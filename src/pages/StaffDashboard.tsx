import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import StaffNavbar from "../components/StaffNavbar";
import CreateBookingModal from "../components/CreateBookingModal";
import BookingInfoModal from "../components/BookingInfoModal";
import EditBookingModal from "../components/EditBookingModal";
import DeleteBookingModal from "../components/DeleteBookingModal";
import SignupModal from "../components/SignupModal";
import EditCustomerModal from "../components/EditCustomerModal";
import DeleteCustomerModal from "../components/DeleteCustomerModal";
import { MdInfoOutline, MdEdit, MdDelete } from "react-icons/md";
import type { User, Booking } from "../types";

// to make TypeScript recognize HTML elements in JSX
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
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "bookings" | "customers"
  >("dashboard");
  const [customers, setCustomers] = useState<User[]>([]);
  const [refreshCustomers, setRefreshCustomers] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingSearchTerm, setBookingSearchTerm] = useState("");
  const [bookingSearchFilter, setBookingSearchFilter] = useState<
    "name" | "mobile" | "email" | "date"
  >("name");
    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerSearchFilter, setCustomerSearchFilter] = useState<
    "name" | "mobile" | "email"
  >("name");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<User | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<User | null>(null);
  const [infoBooking, setInfoBooking] = useState<Booking | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load user from localStorage and listen for profile updates
  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };

  
    loadUser();

    window.addEventListener("user-profile-updated", loadUser);

 
    return () => {
      window.removeEventListener("user-profile-updated", loadUser);
    };
  }, []);


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

    const filteredBookings = bookings                      .filter((booking) => {
                        if (!bookingSearchTerm) return true;
                        const searchLower = bookingSearchTerm.toLowerCase();
    
    
    switch (bookingSearchFilter) {
      case "name":
        return booking.customer?.name?.toLowerCase().includes(searchLower) ||
               booking.petName.toLowerCase().includes(searchLower);
      case "mobile":
        return booking.customer?.mobile?.includes(bookingSearchTerm);
      case "email":
        return booking.customer?.email?.toLowerCase().includes(searchLower);
      case "date":
        const formattedDate = formatDate(booking.bookingDate);
        return formattedDate.toLowerCase().includes(searchLower);
      default:
        return true;
    }
  });


  const getTodayCheckIns = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return bookings.filter((b) => {
      const checkIn = new Date(b.bookingFrom);
      return checkIn >= today && checkIn < tomorrow;
    }).length;
  };


  const getWeeklyTrends = () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weeklyBookings = bookings.filter(
      (b) => new Date(b.bookingDate) > lastWeek
    ).length;

    const previousWeek = bookings.filter((b) => {
      const date = new Date(b.bookingDate);
      return (
        date <= lastWeek &&
        date > new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000)
      );
    }).length;

    const trend = weeklyBookings - previousWeek;
    return { current: weeklyBookings, trend };
  };


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        if (user) {
          // Modify the endpoint to fetch all bookings (staff should see all bookings)
          // The backend should handle authorization and return all bookings for staff users
          // Fetch bookings and include customer details
          const response = await fetch(
            "http://localhost:5000/api/bookings/all?include=customer",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch bookings");

          const data = await response.json();
          console.log("API Response:", data);
       
          if (data && data.length > 0) {
            console.log(
              "First booking amount:",
              data[0].amount,
              typeof data[0].amount
            );
            console.log("Sample booking data:", data[0]);
          }

  
          const transformedData = data.map((item: any) => {
       
            let amount = 0;
            if (item.amount !== null && item.amount !== undefined) {
            
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
              petName: item.pet_name,
              petType: item.pet_type,
              bookingFrom: item.booking_from,
              bookingTo: item.booking_to,
              services: Array.isArray(item.services) ? item.services : [],
              petDob: item.pet_dob,
              petAge: item.pet_age,
              petFood: item.pet_food,
              vaccinationCertificate: item.vaccination_certificate,
              petVaccinated: Boolean(item.pet_vaccinated),
              amount: amount,
              userId: item.user_id,
              customerId: item.customer_id,
              customer: item.customer,
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

  // Fetch customers data
  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/users/role/customer",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Response status:", response.status);
          throw new Error("Failed to fetch customers");
        }

        const data = await response.json();
        console.log("Customers API Response:", data);
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load customers"
        );
      } finally {
        setLoading(false);
      }
    };

    // Fetch customers if we're on customers tab OR dashboard tab
    if (activeTab === "customers" || activeTab === "dashboard") {
      fetchCustomers();
    }
  }, [activeTab, refreshCustomers]);

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

      const transformedBooking: Booking = {
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
        amount: amount,
        userId: data.user_id,
        customerId: data.customer_id,
        customer: {
          id: data.customer_id,
          name: data.customer_name,
          email: data.customer_email,
          mobile: data.customer_mobile,
          dob: data.customer_dob,
          address: data.customer_address,
          password: "", // Required by type but not used
          role: "customer" as const, // Required by type but known for customer
        },
      };

      setBookings((prev) => [...prev, transformedBooking]);
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
      console.log("API response after update:", data);


      let amount = 0;
      if (data.amount !== null && data.amount !== undefined) {
        amount =
          typeof data.amount === "string"
            ? parseFloat(data.amount)
            : Number(data.amount);
        if (isNaN(amount)) amount = 0;
      }

      const transformedBooking: Booking = {
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
        amount: amount,
        userId: data.user_id,
        customerId: data.customer_id,
        customer: {
          id: data.customer_id,
          name: data.customer_name,
          email: data.customer_email,
          mobile: data.customer_mobile,
          dob: data.customer_dob,
          address: data.customer_address,
          password: "", // Required by type but not used
          role: "customer" as const, // Required by type but known for customer
        },
      };

      // Update the booking in the state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === transformedBooking.id ? transformedBooking : b
        )
      );

      // Update the info booking if this booking is currently being viewed
      if (infoBooking && infoBooking.id === transformedBooking.id) {
        setInfoBooking(transformedBooking);
      }
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteBooking = async (id: number) => {
    try {
      // if the booking exists in our current state
      console.log(
        "Current bookings in state:",
        bookings.map((b) => ({ id: b.id, petName: b.petName }))
      );
      const bookingExists = bookings.some((b) => b.id === id);
      console.log(`Checking if booking ${id} exists in state:`, bookingExists);

      if (!bookingExists) {
        throw new Error(
          "Booking not found in current list. Please refresh the page and try again."
        );
      }

      console.log("Attempting to delete booking:", id);
      const token = localStorage.getItem("token");
      console.log("Authorization token present:", !!token);

      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status);
      console.log(
        "Delete response headers:",
        Object.fromEntries(response.headers.entries())
      );

      let data;
      try {
        const responseText = await response.text();
        console.log("Raw response text:", responseText);
        data = responseText ? JSON.parse(responseText) : null;
        console.log("Parsed response data:", data);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}: ${response.statusText}`
          );
        }
      }

      if (!response.ok) {
        // Handle specific status codes with detailed error information
        if (response.status === 404) {
          console.error(`Server returned 404 for booking ${id}. Data:`, data);
          throw new Error(
            `Booking #${id} not found on server. Server response: ${JSON.stringify(
              data
            )}`
          );
        }
        if (response.status === 401 || response.status === 403) {
          console.error(
            `Authorization error (${response.status}) for booking ${id}. Data:`,
            data
          );
          throw new Error(
            "Not authorized to delete this booking. Please check your permissions."
          );
        }
        const errorMessage =
          data && data.message
            ? `Server error: ${data.message}`
            : `Failed to delete booking. Server returned ${response.status}`;
        console.error(`Delete error for booking ${id}:`, errorMessage);
        throw new Error(errorMessage);
      }

   
      console.log(`Successfully deleted booking ${id}. Updating state...`);
      setBookings((prev) => {
        const newBookings = prev.filter((b) => b.id !== id);
        console.log(
          `Bookings count before: ${prev.length}, after: ${newBookings.length}`
        );
        return newBookings;
      });
      setDeleteBookingId(null);
      alert("Booking deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete booking";
      alert(errorMessage);
      setError(errorMessage);
      setDeleteBookingId(null);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/user/${customerToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
       
        const isActiveBookingsError =
          response.status === 400 && data.message.includes("active bookings");

        if (isActiveBookingsError) {
          alert(
            "Cannot delete customer with active or future bookings. Please cancel or complete all bookings first."
          );
        } else {
       
          let errorMessage: string;
          if (response.status === 404) {
            errorMessage =
              "Customer not found. They may have already been deleted.";
          } else if (response.status === 403) {
            errorMessage = "Not authorized to delete this user.";
          } else {
            errorMessage = data.message || "Failed to delete customer";
          }
          setError(errorMessage);
        }

        setCustomerToDelete(null);
        return; 
      }

      setCustomers((prev) =>
        prev.filter((customer) => customer.id !== customerToDelete.id)
      );
      setCustomerToDelete(null);
 
      setError("Customer deleted successfully");

      setTimeout(() => setError(""), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete customer";

     
      if (errorMessage.includes("active or future bookings")) {
        alert(errorMessage);
      } else {
        setError(errorMessage);
      }

      setCustomerToDelete(null);
    }
  };

  const handleUpdateCustomer = async (updatedCustomer: User) => {
    const token = localStorage.getItem("token");
    try {
     
      const customerToUpdate: User = {
        ...updatedCustomer,
        role: "customer" as const, // Use const assertion to match UserRole type
      };

      console.log("Updating customer:", customerToUpdate); 

      const response = await fetch(
        `http://localhost:5000/api/auth/user/${updatedCustomer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(customerToUpdate),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Update failed:", errorData);
        throw new Error(`Failed to update customer: ${errorData}`);
      }

      const data = await response.json();
      console.log("Update successful:", data); 

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === updatedCustomer.id ? customerToUpdate : customer
        )
      );
      setEditCustomer(null);
    } catch (err) {
      console.error("Error updating customer:", err); 
      setError(
        err instanceof Error ? err.message : "Failed to update customer"
      );
      throw err; // Re-throw to be handled by the modal
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
              {/* Booking Statistics */}
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

           
              <div className="stat-card">
                <h3>Check-ins Today</h3>
                <p>{getTodayCheckIns()}</p>
              </div>

              <div className="stat-card">
                <h3>Total Customers</h3>
                <p>{customers.length}</p>
              </div>

       
              <div className="stat-card">
                <h3>Weekly Bookings</h3>
                <p>
                  {getWeeklyTrends().current}
                  <span
                    style={{
                      fontSize: "0.8em",
                      marginLeft: "8px",
                      color:
                        getWeeklyTrends().trend > 0
                          ? "#4cd137"
                          : getWeeklyTrends().trend < 0
                          ? "#e84118"
                          : "#7f8fa6",
                    }}
                  >
                    {getWeeklyTrends().trend > 0
                      ? "↑"
                      : getWeeklyTrends().trend < 0
                      ? "↓"
                      : "→"}
                    {Math.abs(getWeeklyTrends().trend)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : activeTab === "bookings" ? (
          <>
            <div className="bookings-header">
              <div className="header-top">
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

              <div className="search-bar">
                <div className="search-input-container">
                  <input
                    type="text"
                     placeholder={`Search by ${bookingSearchFilter}...`}
                    value={bookingSearchTerm}
                    onChange={(e) => setBookingSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <select
                   value={bookingSearchFilter}
                    onChange={(e) => 
                      setBookingSearchFilter(
                        e.target.value as "name" | "mobile" | "email" | "date"
                      )
                    }
                    className="search-filter"
                  >
                    <option value="name">Name (Pet/Owner)</option>
                    <option value="mobile">Mobile Number</option>
                    <option value="email">Email</option>
                    <option value="date">Booking Date</option>
                  </select>
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
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking, index) => {
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
                          <td>{booking.customer?.name || "N/A"}</td>
                          <td>
                            <div>{booking.customer?.mobile || "N/A"}</div>
                            <div className="text-muted">
                              {booking.customer?.email || "N/A"}
                            </div>
                          </td>
                          <td>
                            {formatDate(booking.bookingFrom)}&nbsp; - &nbsp;
                            {formatDate(booking.bookingTo)}
                          </td>
                          <td style={{ color: "#4cd137", fontWeight: "500" }}>
                            $
                            {(() => {
                             
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
        ) : (
          <>
            <div className="bookings-header">
              <button
                className="create-booking-btn"
                onClick={() => setShowAddCustomerModal(true)}
              >
                Add Customer
              </button>
            </div>

             <div className="search-bar">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder={`Search by ${customerSearchFilter}...`}
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  value={customerSearchFilter}
                  onChange={(e) =>
                    setCustomerSearchFilter(
                      e.target.value as "name" | "mobile" | "email"
                    )
                  }
                  className="search-filter"
                >
                  <option value="name">Name</option>
                  <option value="mobile">Mobile Number</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading customers...</div>
            ) : (
              <table className="staff-dashboard-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Date of Birth</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length > 0 ? (
                    customers
                      .filter((customer) => {
                        if (!customerSearchTerm) return true;
                        const searchLower = customerSearchTerm.toLowerCase();
                        switch (customerSearchFilter) {
                          case "name":
                            return customer.name?.toLowerCase().includes(searchLower);
                          case "mobile":
                            return customer.mobile?.toLowerCase().includes(searchLower);
                          case "email":
                            return customer.email.toLowerCase().includes(searchLower);
                          default:
                            return true;
                        }
                      })
                      .map((customer, index) => (
                      <tr key={customer.id}>
                        <td>{index + 1}</td>
                        <td>{customer.name || "N/A"}</td>
                        <td>{customer.email}</td>
                        <td>{customer.mobile || "N/A"}</td>
                        <td>{formatDate(customer.dob)}</td>
                        <td>{customer.address || "N/A"}</td>
                        <td className="actions-cell">
                          <button
                            className="icon-btn edit-btn"
                            onClick={() => {
                              console.log(
                                "Edit button clicked for customer:",
                                customer
                              );
                              setEditCustomer(customer);
                              console.log(
                                "editCustomer state after setting:",
                                customer
                              );
                            }}
                            title="Edit customer"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button
                            className="icon-btn delete-btn"
                            onClick={() => setCustomerToDelete(customer)}
                            title="Delete customer"
                          >
                            <MdDelete size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="no-data">
                        No customers found. Click the "Add Customer" button to
                        add a new customer.
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
          userRole={user?.role || "staff"}
          userId={user?.id || 0}
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
          userRole={user?.role || "staff"}
          userId={user?.id || 0}
        />
      )}

      {customerToDelete && (
        <DeleteCustomerModal
          customerName={customerToDelete.name || "Unnamed Customer"}
          onClose={() => setCustomerToDelete(null)}
          onConfirm={handleDeleteCustomer}
        />
      )}

      {editCustomer && (
        <EditCustomerModal
          customer={editCustomer}
          onClose={() => setEditCustomer(null)}
          onSave={handleUpdateCustomer}
        />
      )}

      {deleteBookingId && (
        <DeleteBookingModal
          onCancel={() => setDeleteBookingId(null)}
          onConfirm={() => handleDeleteBooking(deleteBookingId)}
        />
      )}

      {showAddCustomerModal && (
        <SignupModal
          onClose={() => {
            setShowAddCustomerModal(false);
         
            setRefreshCustomers((prev) => prev + 1);
          }}
          onSwitchToLogin={() => {
     
          }}
          hideLoginLink={true}
        />
      )}
    </>
  );
}
