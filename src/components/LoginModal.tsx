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

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Login successful
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("user-login"));
        onClose();
        const role = data.user.role;
        if (role === "staff") navigate("/staff-dashboard");
        else if (role === "admin") navigate("/admin-dashboard");
        else if (role === "customer") navigate("/customer-dashboard");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
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
