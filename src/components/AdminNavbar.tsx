import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

type Props = {
  activeTab: "dashboard" | "bookings" | "staff";
  setActiveTab: (tab: "dashboard" | "bookings" | "staff") => void;
};

export default function AdminNavbar({ activeTab, setActiveTab }: Props) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.dispatchEvent(new Event("user-login"));
  };
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span
          className={
            activeTab === "dashboard" ? "active-link staff-tab" : "staff-tab"
          }
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </span>
        <span
          className={
            activeTab === "bookings" ? "active-link staff-tab" : "staff-tab"
          }
          style={{ marginLeft: "1.2rem" }}
          onClick={() => setActiveTab("bookings")}
        >
          Booking List
        </span>
        <span
          className={
            activeTab === "staff" ? "active-link staff-tab" : "staff-tab"
          }
          style={{ marginLeft: "1.2rem" }}
          onClick={() => setActiveTab("staff")}
        >
          Staff List
        </span>
      </div>
      <div className="navbar-right">
        {/* <button
          className="btn create-booking-btn"
          style={{ marginRight: "0.5rem" }}
          onClick={() =>
            window.dispatchEvent(new CustomEvent("open-add-staff"))
          }
        >
          + Add Staff
        </button> */}
        <button onClick={handleLogout} className="btn logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
