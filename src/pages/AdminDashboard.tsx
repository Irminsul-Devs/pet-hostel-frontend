import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import AdminNavbar from "../components/AdminNavbar";
import AddStaffModal from "../components/AddStaffModal";
import type { StaffData } from "../components/AddStaffModal";


export default function AdminDashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "bookings" | "staff"
  >("dashboard");
  const [bookings, setBookings] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setBookings([
  {
    id: 1,
    name: "John Doe",
    amountPaid: 2500,
    bookingDate: "2025-06-23",
    service: "Pet Boarding",
  },
  {
    id: 2,
    name: "Jane Smith",
    amountPaid: 1800,
    bookingDate: "2025-06-21",
    service: "Pet Grooming",
  },
]);
 // Dummy bookings
    setStaff([
        {
    id: 1,
    name: "Alice",
    age: "30",
    mobile: "9876543210",
    email: "alice@hostel.com",
    address: "Chennai"
  },
  {
    id: 2,
    name: "Bob",
    age: "28",
    mobile: "9876500000",
    email: "bob@hostel.com",
    address: "Bangalore"
  }
    ]);
  }, []);
 const [editStaff, setEditStaff] = useState<any | null>(null);

  const handleAddStaff = (newStaff: StaffData) => {
    setStaff((prev) => [
      ...prev,
      { ...newStaff, id: Math.max(0, ...prev.map((s) => s.id)) + 1 },
    ]);
  };

  return (
    <>
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="staff-dashboard">

        {activeTab === "dashboard" && (
          <h1 style={{ color: "#1ab3f0", marginBottom: "0.5em" }}>
            Welcome, {user?.name || "Admin"}!
          </h1>
        )}

        {activeTab === "bookings" && (
        <table className="staff-dashboard-table">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Name</th>
      <th>Amount Paid</th>
      <th>Booking Date</th>
      <th>Service Opted</th>
      <th>More Info</th>
    </tr>
  </thead>
  <tbody>
    {bookings.length > 0 ? (
      bookings.map((b, i) => (
        <tr key={b.id || i}>
          <td>{i + 1}</td>
          <td>{b.name}</td>
          <td>₹{b.amountPaid}</td>
          <td>{b.bookingDate}</td>
          <td>{b.service}</td>
          <td>
            <button onClick={() => alert("Details not implemented yet")}>ℹ️</button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={6}>No bookings found</td>
      </tr>
    )}
  </tbody>
</table>

        )}

        {activeTab === "staff" && (
          <>
            <button
              className="add-btn"
              onClick={() => {
                console.log("Add Staff button clicked");
                setShowAddModal(true);
              }}
              style={{ marginBottom: "1rem" }}
            >
              + Add Staff
            </button>
           <table className="staff-dashboard-table">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Name</th>
      <th>Age</th>
      <th>Mobile No</th>
      <th>Email</th>
      <th>Address</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {staff.length > 0 ? (
      staff.map((s, i) => (
        <tr key={s.id}>
          <td>{i + 1}</td>
          <td>{s.name}</td>
          <td>{s.age}</td>
          <td>{s.mobile}</td>
          <td>{s.email}</td>
          <td>{s.address}</td>
          <td>
            <button
              onClick={() => {
                setEditStaff(s);
                setShowAddModal(true);
              }}
            >
              ✏️
            </button>
            <button onClick={() => setStaff(staff.filter((st) => st.id !== s.id))}>
              🗑️
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={7}>No staff found</td>
      </tr>
    )}
  </tbody>
</table>

          </>
        )}
      </div>
{showAddModal && (
  <AddStaffModal
    initialData={editStaff}
    onClose={() => {
      setShowAddModal(false);
      setEditStaff(null);
    }}
    onSave={(data) => {
      if (editStaff) {
        setStaff(prev =>
          prev.map(st => st.username === editStaff.username ? { ...st, ...data } : st)
        );
      } else {
        handleAddStaff(data);
      }
      setShowAddModal(false);
      setEditStaff(null);
    }}
  />
)}


    </>
  );
}
