import { useRef, useEffect, useState } from "react";
import "../styles/Modal.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = {
  onClose: () => void;
  onBackToLogin: () => void;
  userId?: number;
  email?: string;
};

export default function ResetPasswordModal({
  onClose,
  onBackToLogin,
  userId,
  email,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailInput, setEmailInput] = useState(email || "");

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

    if (isSubmitting) return;

    if (!emailInput && !userId) {
      setError("Email is required");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");
      let resetResponse;

      // If we have userId directly (admin resetting staff password)
      if (userId) {
        resetResponse = await fetch(
          "http://localhost:5000/api/auth/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId,
              newPassword,
            }),
          }
        );
      } else {
        // Email-based reset (for users who forgot password)
        resetResponse = await fetch(
          "http://localhost:5000/api/auth/reset-password-by-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: emailInput,
              newPassword,
            }),
          }
        );
      }

      const data = await resetResponse.json();

      if (!resetResponse.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      alert("Password reset successfully!");
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={ref}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          {!userId && (
            <div className="input-group">
              <input
                type="email"
                id="reset-email"
                placeholder=" "
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                disabled={!!email}
              />
              <label htmlFor="reset-email">Email</label>
            </div>
          )}

          {/* New Password */}
          <div className="input-group" style={{ position: "relative" }}>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label>New Password</label>
            <span
              onClick={() => setShowNew(!showNew)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#aaa",
              }}
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="input-group" style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label>Confirm Password</label>
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#aaa",
              }}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            type="submit"
            className="btn modal-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="modal-footer">
          <p style={{ textAlign: "center", width: "100%" }}>
            <button onClick={onBackToLogin} className="modal-link">
              Back to Profile
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
