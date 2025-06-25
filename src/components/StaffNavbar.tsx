import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { useState } from "react";
import StaffProfileModal from "./StaffProfileModal";

type Props = {
  activeTab: "dashboard" | "bookings";
  setActiveTab: (tab: "dashboard" | "bookings") => void;
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
        </div>
        <div
          className="navbar-right"
          style={{ display: "flex", alignItems: "center" }}
        >
          <FaUserShield
            size={26}
            style={{
              marginRight: "1.2rem",
              color: "#fff",
              background: "#222",
              borderRadius: "50%",
              padding: "0.3em",
              boxShadow: "0 1px 6px #1ab3f055",
              cursor: "pointer",
            }}
            title="Staff Profile"
            onClick={() => setShowProfile(true)}
          />
          <button onClick={handleLogout} className="btn login-btn">
            Logout
          </button>
        </div>
      </nav>
      {showProfile && (
        <StaffProfileModal onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}
