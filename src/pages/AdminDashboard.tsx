import { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import "../styles/StaffDashboard.css";
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
      const res = await fetch("http://localhost:5000/api/bookings/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allBookings = await res.json();
      const fullBooking = allBookings.find((b: any) => b.id === bookingId);

      if (!fullBooking) {
        alert("Booking not found");
        return;
      }
      console.log("fullBooking.pet_food:", fullBooking.pet_food);

      // 🛠️ Mapping snake_case → camelCase
      const mappedBooking = {
        ...fullBooking,
        petName: fullBooking.pet_name,
        petType: fullBooking.pet_type,
        petAge: fullBooking.pet_age,
        petFood: fullBooking.pet_food, // ✅ fixed
        petVaccinated: fullBooking.pet_vaccinated,
        vaccinationCertificate: fullBooking.vaccination_certificate,
        bookingDate: fullBooking.booking_date,
        bookingFrom: fullBooking.booking_from,
        bookingTo: fullBooking.booking_to,
        amount: Number(fullBooking.amount),
        customer: fullBooking.customer,
        services: fullBooking.services,
        remarks: fullBooking.remarks,
      };

      setInfoBooking(mappedBooking);
    } catch (err) {
      console.error("Error fetching full booking info:", err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    }
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
  const filteredBookings = bookings.filter((b) =>
    b.customer?.name?.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="staff-dashboard">
        {activeTab === "dashboard" && (
          <div
            className="dashboard-welcome"
            style={{ maxWidth: "1100px", margin: "0 auto" }}
          >
            <h1 className="staff-dashboard-welcome">
              Welcome, {user?.name || "Admin"}!
            </h1>

            {analytics && (
              <div
                className="stats-container"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  justifyContent: "space-between",
                }}
              >
                <div className="stat-card" style={{ flex: "1 1 100%" }}>
                  <h3 style={{ textAlign: "center" }}>
                    🎂 Upcoming Pet Birthdays
                  </h3>

                  {analytics.upcomingPetBirthdays?.length > 0 ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <ul
                        style={{
                          paddingLeft: "1.2rem",
                          margin: 0,
                          textAlign: "left",
                          listStylePosition: "inside",
                        }}
                      >
                        {analytics.upcomingPetBirthdays
                          .sort(
                            (a: { petDob: string }, b: { petDob: string }) =>
                              new Date(a.petDob).getTime() -
                              new Date(b.petDob).getTime()
                          )
                          .map(
                            (pet: {
                              petName: string;
                              ownerName: string;
                              petDob: string;
                            }) => (
                              <li
                                key={`${pet.petName}-${pet.ownerName}`}
                                style={{
                                  fontSize: "0.85rem",
                                  marginBottom: "6px",
                                  lineHeight: "1.5",
                                  color: "black",
                                }}
                              >
                                <span
                                  style={{ color: "#ffa502", fontWeight: 500 }}
                                >
                                  {new Date(pet.petDob).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                    }
                                  )}
                                </span>{" "}
                                — {pet.petName} | Owner: {pet.ownerName}
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                  ) : (
                    <p style={{ fontSize: "0.85rem", textAlign: "center" }}>
                      No upcoming birthdays
                    </p>
                  )}
                </div>

                <div className="stat-card" style={{ flex: "1 1 32%" }}>
                  <h3 style={{ textAlign: "center" }}>Most Regular Customer</h3>
                  {analytics.mostRegularCustomer ? (
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "0.85rem",
                        color: "black",
                      }}
                    >
                      {analytics.mostRegularCustomer.name}
                    </div>
                  ) : (
                    <p style={{ fontSize: "0.85rem", textAlign: "center" }}>
                      No data
                    </p>
                  )}
                </div>

                <div className="stat-card" style={{ flex: "1 1 32%" }}>
                  <h3 style={{ textAlign: "center" }}>
                    Most Preferred Service
                  </h3>
                  <p style={{ fontSize: "0.85rem", textAlign: "center" }}>
                    {analytics.mostPreferredService || "No data"}
                  </p>
                </div>

                <div className="stat-card" style={{ flex: "1 1 32%" }}>
                  <h3 style={{ textAlign: "center" }}>Total Bookings</h3>
                  <p style={{ fontSize: "0.85rem", textAlign: "center" }}>
                    {analytics.totalBookingsThisMonth ?? "0"}
                  </p>
                </div>

                <div className="stat-card" style={{ flex: "1 1 32%" }}>
                  <h3 style={{ textAlign: "center" }}>Pets in Care</h3>
                  {analytics.petsInCare?.length > 0 ? (
                    <div
                      style={{
                        fontSize: "0.85rem",
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      {analytics.petsInCare.map(
                        (pet: { type: string; count: number }) => (
                          <span key={pet.type} style={{ marginRight: "8px" }}>
                            • {pet.type}: {pet.count}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p style={{ fontSize: "0.85rem", textAlign: "center" }}>
                      No pets currently
                    </p>
                  )}
                </div>

                <div className="stat-card" style={{ flex: "1 1 32%" }}>
                  <h3 style={{ textAlign: "center" }}>Top Pet Type Booked</h3>
                  <p style={{ fontSize: "0.85rem", textAlign: "center" }}>
                    {analytics.topPetType || "No data"}
                  </p>
                </div>

                <div className="stat-card" style={{ flex: "1 1 32%" }}>
                  <h3 style={{ textAlign: "center" }}>Total Revenue</h3>
                  <p style={{ fontSize: "0.85rem", textAlign: "center" }}>
                    ₹
                    {analytics.totalRevenueThisMonth?.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    ) ?? "0.00"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <>
            <div className="adsearch-bar">
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
            <table
              className="staff-dashboard-table"
              style={{ marginTop: "1.5rem" }}
            >
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Pet Owner</th>
                  <th>Booking Period</th>
                  <th>Service Opted</th>
                  <th>Amount Paid</th>
                  <th>Booked By</th>
                  <th>More Info</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b, i) => {
                    const bookedByStaff = staff.find((s) => s.id === b.user_id);
                    const bookedBy = bookedByStaff
                      ? `${bookedByStaff.name} (staff)`
                      : "Pet Owner";

                    return (
                      <tr key={b.id}>
                        <td>{i + 1}</td>
                        <td>{b.customer?.name || "Unknown"}</td>
                        <td>{formatDateRange(b.booking_from, b.booking_to)}</td>
                        <td>{b.services?.join(", ")}</td>
                        <td>₹{b.amount.toLocaleString()}</td>
                        <td>{bookedBy}</td>
                        <td>
                          <button
                            className="icon-btn info-btn"
                            title="More Info"
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
            <div>
              <button
                className="create-booking-btn"
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
                  placeholder="Search by ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <table
              className="staff-dashboard-table"
              style={{ marginTop: "1.5rem" }}
            >
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
                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            <button
                              className="icon-btn edit-btn"
                              title="Edit"
                              onClick={() => {
                                setEditStaff(s);
                                setShowAddModal(true);
                              }}
                            >
                              <MdEdit size={18} />
                            </button>
                            <button
                              className="icon-btn delete-btn"
                              title="Delete"
                              onClick={() => setConfirmDeleteId(s.id)}
                            >
                              <MdDelete size={18} />
                            </button>
                          </div>
                        </td>
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
