import { useRef, useEffect, useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import "../styles/Modal.css";
import "../styles/StaffDashboard.css";

type Props = {
  onClose: () => void;
};

export default function UserProfileModal({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    ownerName: "",
    ownerMobile: "",
    ownerEmail: "",
    ownerDob: "",
    ownerAddress: "",
  });

  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:5000/api/auth/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          ownerName: data.name || "",
          ownerMobile: data.mobile || "",
          ownerEmail: data.email || "",
          ownerDob: data.dob?.slice(0, 10) || "",
          ownerAddress: data.address || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  const nameRegex = /^[A-Z][a-zA-Z\s]*$/;
  const mobileRegex = /^\d{10}$/;
  const dobDate = new Date(form.ownerDob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dobDate.getMonth() ||
    (today.getMonth() === dobDate.getMonth() && today.getDate() >= dobDate.getDate());

  const actualAge = hasHadBirthdayThisYear ? age : age - 1;

  // 🚨 VALIDATIONS
  if (!form.ownerName || !nameRegex.test(form.ownerName)) {
    return alert("Name is required and must start with a capital letter.");
  }

  if (!form.ownerMobile || !mobileRegex.test(form.ownerMobile)) {
    return alert("Mobile number must be exactly 10 digits.");
  }

  if (!form.ownerDob || isNaN(dobDate.getTime())) {
    return alert("Please enter a valid date of birth.");
  }

  if (dobDate > today) {
    return alert("Date of birth cannot be in the future.");
  }

  if (actualAge < 18) {
    return alert("User must be at least 18 years old.");
  }

  if (!form.ownerAddress.trim()) {
    return alert("Address is required.");
  }

  try {
    const res = await fetch(`http://localhost:5000/api/auth/user/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: form.ownerName,
        mobile: form.ownerMobile,
        dob: form.ownerDob,
        address: form.ownerAddress
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Profile updated!");
      localStorage.setItem("user", JSON.stringify({
        ...user,
        name: form.ownerName,
        mobile: form.ownerMobile,
        dob: form.ownerDob,
        address: form.ownerAddress
      }));
      onClose();
    } else {
      alert(data.message || "Failed to update profile");
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Something went wrong while updating profile.");
  }
};
  if (loading) return null;

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
