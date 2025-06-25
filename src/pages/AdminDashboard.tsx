import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";
import AdminNavbar from "../components/AdminNavbar";
import AddStaffModal from "../components/AddStaffModal";
import BookingInfoModal from "../components/BookingInfoModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import type { StaffData } from "../components/AddStaffModal";
import { MdInfoOutline, MdEdit, MdDelete } from "react-icons/md";

export default function AdminDashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "bookings" | "staff"
  >("dashboard");
  const [bookings, setBookings] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStaff, setEditStaff] = useState<any | null>(null);
  const [infoBooking, setInfoBooking] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    setBookings([
      {
        id: 1,
        name: "Charlie",
        bookingDate: "2025-06-24",
        mobile: "9876543210",
        email: "charlie@pet.com",
        remarks: "First time boarding",
      },
      {
        id: 2,
        name: "Bella",
        bookingDate: "2025-06-23",
        mobile: "9876500000",
        email: "bella@pet.com",
        remarks: "Grooming only",
      },
    ]);

    setStaff([
      {
        id: 1,
        name: "Alice",
        age: "30",
        mobile: "9876543210",
        email: "alice@hostel.com",
        address: "Chennai",
      },
      {
        id: 2,
        name: "Bob",
        age: "28",
        mobile: "9876500000",
        email: "bob@hostel.com",
        address: "Bangalore",
      },
    ]);
  }, []);

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
                <th>Booking Date</th>
                <th>Name</th>
                <th>Mobile No</th>
                <th>Email</th>
                <th>Remarks</th>
                <th>More Info</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((b, i) => (
                  <tr key={b.id || i}>
                    <td>{i + 1}</td>
                    <td>{b.bookingDate}</td>
                    <td>{b.name}</td>
                    <td>{b.mobile}</td>
                    <td>{b.email}</td>
                    <td>{b.remarks}</td>
                    <td>
                      <button
                        title="More Info"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#1ab3f0",
                        }}
                        onClick={() => setInfoBooking(b)}
                      >
                        <MdInfoOutline size={22} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>No bookings found</td>
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
                setEditStaff(null);
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
              setStaff((prev) =>
                prev.map((st) =>
                  st.username === editStaff.username ? { ...st, ...data } : st
                )
              );
            } else {
              handleAddStaff(data);
            }
            setShowAddModal(false);
            setEditStaff(null);
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
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => {
            setStaff((prev) => prev.filter((st) => st.id !== confirmDeleteId));
            setConfirmDeleteId(null);
          }}
        />
      )}
    </>
  );
}
