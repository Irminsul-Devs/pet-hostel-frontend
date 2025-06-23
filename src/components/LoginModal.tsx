import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Modal.css";

type Props = {
  onClose: () => void;
  onSwitchToSignup: () => void;
  onSwitchToReset: () => void;
};

export default function LoginModal({
  onClose,
  onSwitchToSignup,
  onSwitchToReset,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let fakeUser = null;
    if (email === "staff@example.com") {
      fakeUser = { name: "Staff User", role: "staff" };
    } else if (email === "admin@example.com") {
      fakeUser = { name: "Admin User", role: "admin" };
    } else if (email === "user@example.com") {
      fakeUser = { name: "Customer User", role: "customer" };
    }

    if (!fakeUser) {
      setError("Invalid credentials.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(fakeUser));
    window.dispatchEvent(new Event("user-login"));
    onClose();

    // Navigate to dashboard based on role
    if (fakeUser.role === "staff") {
      navigate("/staff-dashboard");
    } else if (fakeUser.role === "admin") {
      navigate("/admin-dashboard");
    } else if (fakeUser.role === "customer") {
      navigate("/user-dashboard");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={ref}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              id="login-email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="login-email">Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="login-password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="login-password">Password</label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="forgot-password">
            <button
              type="button"
              onClick={onSwitchToReset}
              className="modal-link"
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="modal-footer">
          <p>
            New user?{" "}
            <button onClick={onSwitchToSignup} className="modal-link">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
