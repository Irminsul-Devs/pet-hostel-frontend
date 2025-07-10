import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Modal.css";

type Props = {
  onClose: () => void;
  onSwitchToSignup: () => void;
  onSwitchToReset: () => void;
};

type UserRole = "staff" | "admin" | "customer";

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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store complete user data
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          mobile: data.user.mobile,
          dob: data.user.dob,
          address: data.user.address,
        })
      );

      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("user-login"));
      onClose();

      // Type-safe role-based redirection
      const rolePaths: Record<UserRole, string> = {
        staff: "/staff-dashboard",
        admin: "/admin-dashboard",
        customer: "/user-dashboard",
      };

      const path = rolePaths[data.user.role as UserRole] || "/";
      navigate(path);
    } catch (err) {
      setError("Something went wrong. Try again later.");
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
          <div className={`input-group ${error ? "error" : ""}`}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // Clear error when typing
              }}
            />
            <label>Email</label>
          </div>

          <div className={`input-group ${error ? "error" : ""}`}>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(""); // Clear error when typing
              }}
            />
            <label>Password</label>
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
          <p style={{ textAlign: "center", width: "100%" }}>
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
