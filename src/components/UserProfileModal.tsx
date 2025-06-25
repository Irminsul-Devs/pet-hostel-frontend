import { useRef, useEffect, useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import "../styles/Modal.css";
import "../styles/StaffDashboard.css";

type Props = {
  onClose: () => void;
};

export default function UserProfileModal({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const defaultForm = {
    ownerName: storedUser.ownerName || "John Doe",
    ownerMobile: storedUser.ownerMobile || "9876543210",
    ownerEmail: storedUser.ownerEmail || "john@example.com",
    ownerDob: storedUser.ownerDob || "1990-01-01",
    ownerAddress: storedUser.ownerAddress || "123, ABC Street",
  };

  const [form, setForm] = useState(defaultForm);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = {
      ...storedUser,
      ownerName: form.ownerName,
      ownerMobile: form.ownerMobile,
      ownerEmail: form.ownerEmail,
      ownerDob: form.ownerDob,
      ownerAddress: form.ownerAddress,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profile updated!");
    onClose();
    window.dispatchEvent(new Event("user-login"));
  };

  return (
    <>
      {!showChangePasswordModal && (
        <div className="modal-backdrop">
          <div className="modal" ref={ref} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>✕</button>
            <h2>User Profile</h2>
            <form onSubmit={handleSave}>
              <div className="modal-form-columns">
                <div className="modal-form-col">
                  <div className="input-group">
                    <input
                      type="text"
                      name="ownerName"
                      value={form.ownerName}
                      onChange={handleChange}
                    />
                    <label>Owner Name</label>
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      name="ownerMobile"
                      value={form.ownerMobile}
                      onChange={handleChange}
                    />
                    <label>Mobile Number</label>
                  </div>
                  <div className="input-group">
                    <input
                      type="email"
                      name="ownerEmail"
                      value={form.ownerEmail}
                      disabled
                    />
                    <label>Email</label>
                  </div>
                </div>

                <div className="modal-form-col">
                  <div className="input-group">
                    <input
                      type="date"
                      name="ownerDob"
                      value={form.ownerDob}
                      onChange={handleChange}
                      required
                    />
                    <label>Date of Birth</label>
                  </div>
                  <div className="input-group">
                    <textarea
                      name="ownerAddress"
                      value={form.ownerAddress}
                      onChange={handleChange}
                      required
                    />
                    <label
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: form.ownerAddress ? "-0.5rem" : "1rem",
                        fontSize: form.ownerAddress ? "0.75rem" : "0.8rem",
                        color: form.ownerAddress ? "#1ab3f0" : "#aaa",
                        background: form.ownerAddress ? "#181f2a" : "transparent",
                        padding: "0 0.3rem",
                        pointerEvents: "none",
                        transition:
                          "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
                        zIndex: 2,
                      }}
                    >
                      Address
                    </label>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="submit"
                  className="btn modal-btn"
                  style={{ padding: "9px 25px", fontSize: "0.85rem", height: "48px" }}
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  className="btn modal-btn"
                  onClick={() => setShowChangePasswordModal(true)}
                  style={{
                    padding: "9px 25px",
                    fontSize: "0.85rem",
                    height: "48px",
                    backgroundColor: "black",
                    marginTop: "10px",
                  }}
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
      )}
    </>
  );
}
