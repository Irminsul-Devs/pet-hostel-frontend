import { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Modal.css";

type Props = {
  onClose: () => void;
};

export default function ChangePasswordModal({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/auth/change-password/${storedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      // Get response text
      const responseData = await response.text();
      console.log("Server response:", responseData); // Debug log

      let data;
      // Handle empty response
      if (!responseData) {
        if (!response.ok) {
          throw new Error("Incorrect current password");
        }
        data = { message: "Success" };
      } else {
        // Try to parse non-empty response
        try {
          data = JSON.parse(responseData);
        } catch (error) {
          console.error("Raw response:", responseData);
          if (!response.ok) {
            throw new Error("Incorrect current password");
          }
          throw new Error("Server error occurred");
        }
      }

      // Handle error response
      if (!response.ok) {
        throw new Error(data?.message || "Incorrect current password");
      }

      // Success case
      alert("Password changed successfully!");
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while changing password");
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
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="input-group" style={{ position: "relative" }}>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label>Current Password</label>
            <span
              onClick={() => setShowCurrent(!showCurrent)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#aaa",
              }}
            >
              {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

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
            {isSubmitting ? "Saving..." : "Save Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
