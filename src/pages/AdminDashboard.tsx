import { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import AdminNavbar from "../components/AdminNavbar";
import AddStaffModal from "../components/AddStaffModal";
import BookingInfoModal from "../components/BookingInfoModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { MdInfoOutline, MdEdit, MdDelete } from "react-icons/md";

export default function AdminDashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "bookings" | "staff"
  >("dashboard");
  const [bookings, setBookings] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStaff, setEditStaff] = useState<any | null>(null);
  const [infoBooking, setInfoBooking] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchStaff();
    fetchAnalytics();
  }, []);

  const filteredStaff = staff.filter((s) => {
    const lowerTerm = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(lowerTerm) ||
      s.email.toLowerCase().includes(lowerTerm) ||
      s.mobile.includes(searchTerm)
    );
  });

  const fetchStaff = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/staff");
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      console.error("Error fetching staff", err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/analytics/admin-dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching analytics", err);
    }
  };

  const handleMoreInfoClick = async (bookingId: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch booking");

      const fullBooking = await res.json();
      setInfoBooking(fullBooking);
    } catch (err) {
      console.error("Error fetching full booking info:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "bookings") fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/bookings/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  function formatDateRange(from: string, to: string) {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const fromDate = new Date(from).toLocaleDateString("en-US", options);
    const toDate = new Date(to).toLocaleDateString("en-US", options);
    return `${fromDate} - ${toDate}`;
  }
  const filteredBookings = bookings.filter(
    (b) =>
      b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.services?.join(" ")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff
        .find((s) => s.id === b.user_id)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
  return (
    <div className="paw-background-container::before">
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="admin-dashboard-content">
        {activeTab === "dashboard" && (
          <div className="admin-analytics-container">
            <h2 className="analytics-title">
              Welcome, {user?.name || "Admin"}!
            </h2>

            {analytics && (
              <div className="analytics-grid-layout">
                {/* Left Column */}
                <div className="analytics-column">
                  <div className="analytics-card">
                    <h3>Most Regular Customer</h3>
                    {analytics.mostRegularCustomer ? (
                      <>
                        <p>
                          <strong>{analytics.mostRegularCustomer.name}</strong>{" "}
                          ({analytics.mostRegularCustomer.email})
                        </p>
                        <span>
                          {analytics.mostRegularCustomer.total_bookings}{" "}
                          bookings
                        </span>
                      </>
                    ) : (
                      <p>No data</p>
                    )}
                  </div>

                  <div className="analytics-card">
                    <h3>Most Preferred Service</h3>
                    <p>{analytics.mostPreferredService || "No data"}</p>
                  </div>

                  <div className="analytics-card">
                    <h3>Total Bookings</h3>
                    <p>Bookings: {analytics.totalBookingsThisMonth ?? "0"}</p>
                  </div>
                </div>

                {/* Center Column: Upcoming Pet Birthdays */}
                <div className="analytics-birthday-center">
                  <div className="analytics-card">
                    <h3>🎂 Upcoming Pet Birthdays</h3>
                    {analytics.upcomingPetBirthdays?.length > 0 ? (
                      <div className="birthday-list">
                        {analytics.upcomingPetBirthdays.map(
                          (pet: {
                            petName: string;
                            ownerName: string;
                            petDob: string;
                          }) => (
                            <div
                              key={`${pet.petName}-${pet.ownerName}`}
                              className="birthday-item"
                            >
                              <div className="pet-info">
                                <div className="pet-line">
                                  <span className="pet-emoji">🐶</span>
                                  <span className="pet-label">Pet</span>
                                  <span className="pet-colon">:</span>
                                  <span className="pet-name">
                                    {pet.petName}
                                  </span>
                                </div>
                                <div className="owner-line">
                                  <span className="owner-label">Owner:</span>
                                  <span className="owner-name">
                                    {pet.ownerName}
                                  </span>
                                </div>
                              </div>
                              <div className="birthday-date">
                                {new Date(pet.petDob).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                  }
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p>No upcoming birthdays</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="analytics-column">
                  <div className="analytics-card">
                    <h3>Pets in Care</h3>
                    {analytics.petsInCare?.length > 0 ? (
                      <div className="pet-counts">
                        {analytics.petsInCare.map(
                          (pet: { type: string; count: number }) => (
                            <div key={pet.type} className="pet-type-count">
                              <span className="pet-type">{pet.type}:</span>
                              <span className="count">{pet.count}</span>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p>No pets currently</p>
                    )}
                  </div>

                  <div className="analytics-card">
                    <h3>Top Pet Type Booked</h3>
                    <p>{analytics.topPetType || "No data"}</p>
                  </div>

                  <div className="analytics-card">
                    <h3>Total Revenue</h3>
                    <p>
                      Revenue: ₹
                      {analytics.totalRevenueThisMonth?.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                        }
                      ) ?? "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === "bookings" && (
          <>
            {/* Search Bar - Centered and styled like staff list */}
            <div
              className="adsearch-bar"
              // style={{
              //   margin: "0 20px 20px",
              //   display: "flex",
              //   justifyContent: "center", // Changed to center
              // }}
            >
              <div
                className="adsearch-input-container"
                // style={{ width: "100%", maxWidth: "500px" }}
              >
                <input
                  type="text"
                  className="adsearch-input"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 15px",
                    borderRadius: "4px",
                    border: "1px solid rgba(26, 179, 240, 0.3)",
                    background: "rgba(0, 0, 0, 0.3)",
                    color: "#fff",
                  }}
                />
              </div>
            </div>

            {/* Bookings Table */}
            <table className="staff-dashboard-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Amount Paid</th>
                  <th>Booking Period</th>
                  <th>Service Opted</th>
                  <th>Booked By</th>
                  <th>More Info</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? ( // Changed from bookings to filteredBookings
                  filteredBookings.map((b, i) => {
                    const bookedByStaff = staff.find((s) => s.id === b.user_id);
                    const bookedBy = bookedByStaff
                      ? bookedByStaff.name
                      : `${b.customer?.name || "Unknown"} (customer)`;

                    return (
                      <tr key={b.id}>
                        <td>{i + 1}</td>
                        <td>₹{b.amount.toLocaleString()}</td>
                        <td>{formatDateRange(b.booking_from, b.booking_to)}</td>
                        <td>{b.services?.join(", ")}</td>
                        <td>{bookedBy}</td>
                        <td>
                          <button
                            title="More Info"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#1ab3f0",
                            }}
                            onClick={() => handleMoreInfoClick(b.id)}
                          >
                            <MdInfoOutline size={22} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6}>
                      {searchTerm
                        ? "No matching bookings found"
                        : "No bookings available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "staff" && (
          <>
            {/* Existing Add Staff Button (unchanged) */}
            <div className="add-staff-container">
              <button
                className="add-btn"
                onClick={() => {
                  setEditStaff(null);
                  setShowAddModal(true);
                }}
              >
                + Add Staff
              </button>
            </div>

            {/* New Search Container - Matches your table styling */}

            <div className="adsearch-bar">
              <div className="adsearch-input-container">
                <input
                  type="text"
                  className="adsearch-input"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <table className="staff-dashboard-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>DOB</th>
                  <th>Mobile No</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td>{s.name}</td>
                      <td>{s.dob?.split("T")[0]}</td>
                      <td>{s.mobile}</td>
                      <td>{s.email}</td>
                      <td>{s.address}</td>
                      <td>
                        <button
                          title="Edit"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#1ab3f0",
                            marginRight: 8,
                          }}
                          onClick={() => {
                            setEditStaff(s);
                            setShowAddModal(true);
                          }}
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
                          onClick={() => setConfirmDeleteId(s.id)}
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      {searchTerm
                        ? "No matching staff found"
                        : "No staff available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddStaffModal
          initialData={editStaff}
          onClose={() => {
            setShowAddModal(false);
            setEditStaff(null);
          }}
          onSave={async (data) => {
            try {
              let result;
              if (editStaff) {
                const res = await fetch(
                  `http://localhost:5000/api/auth/update-staff/${editStaff.id}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  }
                );
                result = await res.json();
                if (!res.ok) {
                  alert(result.message || "Update failed");
                  return;
                }
                alert("Staff updated successfully");
              } else {
                const res = await fetch(
                  "http://localhost:5000/api/auth/add-staff",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  }
                );
                result = await res.json();
                if (!res.ok) {
                  alert(result.message || "Add failed");
                  return;
                }
                alert("Staff added successfully");
              }
              await fetchStaff();
            } catch (err) {
              console.error("Error saving staff:", err);
              alert("Something went wrong");
            } finally {
              setShowAddModal(false);
              setEditStaff(null);
            }
          }}
        />
      )}

      {infoBooking && (
        <BookingInfoModal
          booking={infoBooking}
          onClose={() => setInfoBooking(null)}
        />
      )}

      {confirmDeleteId !== null && (
        <DeleteConfirmModal
          staffId={confirmDeleteId}
          onSuccess={async () => {
            await fetchStaff();
            setConfirmDeleteId(null);
          }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
