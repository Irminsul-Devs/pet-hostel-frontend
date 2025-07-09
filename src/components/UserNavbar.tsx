import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // For profile icon

type Props = {
  activeTab: "dashboard" | "bookings";
  setActiveTab: (tab: "dashboard" | "bookings") => void;
  onProfileClick: () => void;
};

export default function UserNavbar({
  activeTab,
  setActiveTab,
  onProfileClick,
}: Props) {
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
          My Bookings
        </span>
      </div>
      <div
        className="navbar-right"
        style={{ display: "flex", alignItems: "center" }}
      >
        {/* <button
    className="btn create-booking-btn"
    style={{ marginRight: "0.5rem" }}
    onClick={() =>
      window.dispatchEvent(new CustomEvent("open-create-booking"))
    }
  >
    + Create Booking
  </button> */}

        <FaUserCircle
          size={25}
          style={{ marginRight: "1rem", cursor: "pointer", color: "#fff" }}
          onClick={onProfileClick}
          title="View Profile"
        />

        <button onClick={handleLogout} className="btn logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
