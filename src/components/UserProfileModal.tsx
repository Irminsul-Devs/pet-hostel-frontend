import { useRef, useEffect, useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import "../styles/Modal.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";

type Props = {
  onClose: () => void;
};

export default function UserProfileModal({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const defaultForm = {
    name: storedUser.name || "",
    mobile: storedUser.mobile || "",
    email: storedUser.email || "",
    dob: storedUser.dob || "",
    address: storedUser.address || "",
  };

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    if (!storedUser?.id) return;
    fetch(`http://localhost:5000/api/auth/user/${storedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          mobile: data.mobile || "",
          email: data.email || "",
          dob: data.dob || "",
          address: data.address || "",
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
    const dobDate = new Date(form.dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > dobDate.getMonth() ||
      (today.getMonth() === dobDate.getMonth() &&
        today.getDate() >= dobDate.getDate());

    const actualAge = hasHadBirthdayThisYear ? age : age - 1;

    // Validations
    console.log("Validating name:", form.name);
    console.log("Name regex test result:", nameRegex.test(form.name));
    console.log("Name first character:", form.name.charAt(0));
    console.log(
      "Is first character uppercase:",
      form.name.charAt(0) === form.name.charAt(0).toUpperCase()
    );

    if (!form.name || !nameRegex.test(form.name)) {
      console.log("Name validation failed");
      return alert(
        "Name must start with a capital letter and contain only letters and spaces."
      );
    }

    if (!form.mobile || !mobileRegex.test(form.mobile)) {
      return alert("Mobile number must be exactly 10 digits.");
    }

    if (!form.dob || isNaN(dobDate.getTime())) {
      return alert("Please enter a valid date of birth.");
    }

    if (dobDate > today) {
      return alert("Date of birth cannot be in the future.");
    }

    if (actualAge < 18) {
      return alert("User must be at least 18 years old.");
    }

    if (!form.address.trim()) {
      return alert("Address is required.");
    }

    try {
      console.log("Starting profile update...");
      console.log("User role:", storedUser.role);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const requestData = {
        name: form.name,
        mobile: form.mobile,
        dob: form.dob,
        address: form.address,
        ...(storedUser.role === "staff" ? { email: form.email } : {}),
      };
      console.log("Request data:", requestData);

      const res = await fetch(
        `http://localhost:5000/api/auth/user/${storedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      const responseText = await res.text();
      console.log("Raw server response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse server response:", e);
        throw new Error("Invalid server response");
      }

      console.log("Parsed response:", data);

      if (res.ok) {
        alert(data.message || "Profile updated!");
        const updatedUser = {
          ...storedUser,
          name: form.name,
          mobile: form.mobile,
          dob: form.dob,
          address: form.address,
          ...(storedUser.role === "staff" ? { email: form.email } : {}),
        };
        console.log("Updating localStorage with:", updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        window.dispatchEvent(new Event("user-profile-updated"));
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
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
            <h2>Profile</h2>
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
                  <div
                    className="input-group"
                    style={{ position: "relative", zIndex: 2001 }}
                  >
                    <ReactDatePicker
                      selected={form.dob ? new Date(form.dob) : null}
                      onChange={(date) =>
                        setForm((prev) => ({
                          ...prev,
                          dob: date ? date.toISOString().slice(0, 10) : "",
                        }))
                      }
                      showYearDropdown
                      showMonthDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
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
                            paddingRight: "2.2em",
                            cursor: "pointer",
                          }}
                          placeholder=" "
                        />
                      }
                      calendarClassName="modal-datepicker"
                      popperPlacement="bottom-end"
                      wrapperClassName="modal-datepicker-wrapper"
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
                        color: form.dob ? "#1ab3f0" : "#333",
                        background: form.dob ? "#fff" : "transparent",
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
                      maxLength={10}
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
                      }}
                      placeholder=" "
                    />
                    <label
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: form.address ? "-0.5rem" : "1rem",
                        fontSize: form.address ? "0.75rem" : "0.8rem",
                        color: form.address ? "#1ab3f0" : "#333",
                        background: form.address ? "#fff" : "transparent",
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
                  gap: "15px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  className="btn modal-btn"
                  onClick={() => setShowChangePasswordModal(true)}
                  style={{
                    minWidth: 140,
                    padding: "12px 24px",
                    fontSize: "0.9rem",
                    height: "45px",
                    marginTop: "10px",
                    background: "#000000ff",
                    color: "#fff",
                    border: "2px solid transparent",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#3d3d3dff";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#000000ff";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Reset Password
                </button>
                <button
                  type="submit"
                  className="btn modal-btn"
                  style={{
                    minWidth: 140,
                    padding: "12px 24px",
                    fontSize: "0.9rem",
                    height: "45px",
                    marginTop: "10px",
                    background: "#1ab3f0",
                    color: "#fff",
                    border: "2px solid transparent",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#47c4f7";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#1ab3f0";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </>
  );
}
