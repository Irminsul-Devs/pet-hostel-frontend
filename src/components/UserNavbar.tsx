import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa"; 

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

        <FaUserShield
                   size={26}
                   style={{
                     marginRight: "1.2rem",
                     color: "#3498db",
                     background: "#222",
                     borderRadius: "50%",
                     padding: "0.3em",
                     boxShadow: "0 1px 6px rgba(52, 152, 219, 0.5)",
                     cursor: "pointer",
                     transition: "all 0.3s ease",
                   }}
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
