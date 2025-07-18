import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { useState } from "react";
import UserProfileModal from "./UserProfileModal";

type Props = {
  activeTab: "dashboard" | "bookings" | "customers";
  setActiveTab: (tab: "dashboard" | "bookings" | "customers") => void;
};

export default function StaffNavbar({ activeTab, setActiveTab }: Props) {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.dispatchEvent(new Event("user-login"));
  };
  return (
    <>
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
              activeTab === "customers" ? "active-link staff-tab" : "staff-tab"
            }
            style={{ marginLeft: "1.2rem" }}
            onClick={() => setActiveTab("customers")}
          >
            Customer List
          </span>
        </div>
        <div
          className="navbar-right"
          style={{ display: "flex", alignItems: "center" }}
        >
          <FaUserShield
            size={26}
            style={{
              marginRight: "1.2rem",
              color: "#000000ff",
              background: "#fff",
              borderRadius: "50%",
              padding: "0.3em",
              boxShadow: "0 1px 6px rgba(52, 152, 219, 0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            title="Staff Profile"
            onClick={() => setShowProfile(true)}
          />
          <button onClick={handleLogout} className="btn logout-btn">
            Logout
          </button>
        </div>
      </nav>
      {showProfile && (
        <UserProfileModal onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}
