import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import ResetPasswordModal from "./ResetPasswordModal";
import "../styles/Navbar.css";

export default function Navbar() {
  const [modal, setModal] = useState<"login" | "signup" | "reset" | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => {
      const saved = localStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    };
    updateUser();
    window.addEventListener("storage", updateUser);
    window.addEventListener("user-login", updateUser);
    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("user-login", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  let navLinks = null;
  if (!user) {
    navLinks = (
      <>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          About Us
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Contact Us
        </NavLink>
      </>
    );
  } else if (user.role === "staff") {
    navLinks = (
      <>
        <NavLink
          to="/staff-dashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Booking List
        </NavLink>
      </>
    );
  } else if (user.role === "admin") {
    navLinks = (
      <>
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Dashboard
        </NavLink>
      </>
    );
  } else if (user.role === "customer") {
    navLinks = (
      <>
        <NavLink
          to="/user-dashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          My Bookings
        </NavLink>
      </>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">{navLinks}</div>
        <div className="navbar-right">
          {user?.role === "staff" && (
            <button
              className="btn create-booking-btn"
              style={{ marginRight: "0.5rem" }}
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-create-booking"))
              }
            >
              + Create Booking
            </button>
          )}
          {!user ? (
            <>
              <button
                onClick={() => setModal("login")}
                className="btn login-btn"
              >
                Login
              </button>
              <button
                onClick={() => setModal("signup")}
                className="btn signup-btn"
              >
                Sign up
              </button>
            </>
          ) : (
            <button onClick={handleLogout} className="btn login-btn">
              Logout
            </button>
          )}
        </div>
      </nav>
      {modal === "login" && (
        <LoginModal
          onClose={() => setModal(null)}
          onSwitchToSignup={() => setModal("signup")}
          onSwitchToReset={() => setModal("reset")}
        />
      )}
      {modal === "signup" && (
        <SignupModal
          onClose={() => setModal(null)}
          onSwitchToLogin={() => setModal("login")}
        />
      )}
      {modal === "reset" && (
        <ResetPasswordModal
          onClose={() => setModal(null)}
          onBackToLogin={() => setModal("login")}
        />
      )}
    </>
  );
}
