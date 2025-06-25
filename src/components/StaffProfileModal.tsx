import { useRef, useEffect, useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import "../styles/Modal.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";

type Props = {
  onClose: () => void;
};

export default function StaffProfileModal({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const defaultForm = {
    name: storedUser.name || "Staff",
    dob: storedUser.dob || "2001-06-01",
    mobile: storedUser.mobile || "1234567890",
    email: storedUser.email || "staff@example.com",
    address: storedUser.address || "123, ABC Street",
  };

  const [form, setForm] = useState(defaultForm);
  const [showResetModal, setShowResetModal] = useState(false);

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
    localStorage.setItem("user", JSON.stringify({ ...storedUser, ...form }));
    onClose();
  };

  return (
    <>
      {!showResetModal && (
        <div className="modal-backdrop">
          <div className="modal" ref={ref} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
            <h2>Staff Profile</h2>
            <form onSubmit={handleSave}>
              <div className="modal-form-columns">
                <div className="modal-form-col">
                  {/* Name */}
                  <div className="input-group">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label>Name</label>
                  </div>
                  {/* Date of Birth */}
                  <div className="input-group" style={{ position: "relative" }}>
                    <ReactDatePicker
                      selected={form.dob ? new Date(form.dob) : null}
                      onChange={(date) =>
                        setForm((prev) => ({
                          ...prev,
                          dob: date ? date.toISOString().slice(0, 10) : "",
                        }))
                      }
                      dateFormat="yyyy-MM-dd"
                      customInput={
                        <input
                          type="text"
                          name="dob"
                          required
                          autoComplete="off"
                          value={form.dob}
                          onKeyDown={(e) => e.preventDefault()}
                          style={{
                            background: "#2a2a2a",
                            color: "#eaf6fb",
                            border: "1px solid #555",
                            paddingRight: "2.2em",
                            cursor: "pointer",
                          }}
                          placeholder=" "
                        />
                      }
                      calendarClassName="modal-datepicker"
                      popperPlacement="bottom-end"
                    />
                    <FaRegCalendarAlt
                      style={{
                        position: "absolute",
                        right: "0.8em",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#1ab3f0",
                        fontSize: "1.25em",
                        pointerEvents: "none",
                        opacity: 0.85,
                        transition: "color 0.2s",
                      }}
                    />
                    <label
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: form.dob ? "-0.5rem" : "1rem",
                        fontSize: form.dob ? "0.75rem" : "0.8rem",
                        color: form.dob ? "#1ab3f0" : "#aaa",
                        background: form.dob ? "#181f2a" : "transparent",
                        padding: form.dob ? "0 0.3rem" : undefined,
                        pointerEvents: "none",
                        transition:
                          "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
                        zIndex: 2,
                      }}
                    >
                      Date of Birth
                    </label>
                  </div>
                  {/* Mobile */}
                  <div className="input-group">
                    <input
                      type="text"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      maxLength={15}
                      placeholder=" "
                    />
                    <label>Mobile No</label>
                  </div>
                  {/* Email */}
                  <div className="input-group">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      disabled
                      placeholder=" "
                    />
                    <label>Email</label>
                  </div>
                  {/* Address */}
                  <div className="input-group" style={{ position: "relative" }}>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={2}
                      style={{
                        resize: "vertical",
                        background: "#2a2a2a",
                        color: "#eaf6fb",
                        border: "1px solid #555",
                      }}
                      placeholder=" "
                    />
                    <label
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: form.address ? "-0.5rem" : "1rem",
                        fontSize: form.address ? "0.75rem" : "0.8rem",
                        color: form.address ? "#1ab3f0" : "#aaa",
                        background: form.address ? "#181f2a" : "transparent",
                        padding: form.address ? "0 0.3rem" : undefined,
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
                  type="button"
                  className="btn modal-btn"
                  onClick={() => setShowResetModal(true)}
                  style={{
                    minWidth: 140,
                    padding: "9px 0",
                    fontSize: "0.85rem",
                    height: "48px",
                    marginTop: "10px",
                  }}
                >
                  Reset Password
                </button>
                <button
                  type="submit"
                  className="btn modal-btn"
                  style={{
                    minWidth: 140,
                    padding: "9px 0",
                    fontSize: "0.85rem",
                    height: "48px",
                    marginTop: "10px",
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResetModal && (
        <ChangePasswordModal
          onClose={() => setShowResetModal(false)}
        />
      )}
    </>
  );
}
