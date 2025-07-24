import { useState, useEffect } from "react";
import "../styles/Modal.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";

export type StaffData = {
  id?: number;
  name: string;
  dob: string;
  address: string;
  email: string;
  mobile: string;
  password?: string;
};

type Props = {
  initialData?: StaffData;
  onClose: () => void;
  onSave: (data: StaffData) => void;
};

export default function AddStaffModal({ initialData, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<StaffData>({
    name: "",
    dob: "",
    address: "",
    email: "",
    mobile: "",
    password: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        dob: initialData.dob.split("T")[0],
      });
    }
  }, [initialData]);

  const isAtLeast18 = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();
    return age > 18 || (age === 18 && (m > 0 || (m === 0 && d >= 0)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAtLeast18(formData.dob)) {
      alert("Staff must be at least 18 years old.");
      return;
    }
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dob: date.toISOString().split("T")[0],
      }));
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2 style={{ textAlign: "center" }}>
          {initialData ? "Edit Staff" : "Add Staff"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <label>Name</label>
          </div>

          {/* Date of Birth */}
          <div className="input-group" style={{ position: "relative" }}>
            <ReactDatePicker
              selected={formData.dob ? new Date(formData.dob) : null}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText=" "
              className={`date-picker-input ${formData.dob ? "filled" : ""}`} // for label float
              popperPlacement="bottom-start"
              required
              
            />
            <label
              style={{
                position: "absolute",
                left: "0.75rem",
                top: formData.dob ? "-0.5rem" : "1rem",
                fontSize: formData.dob ? "0.75rem" : "0.8rem",
                color: formData.dob ? "#1ab3f0" : "#888",
                background: formData.dob ? "#fff" : "transparent",
                padding: "0 0.3rem",
                pointerEvents: "none",
                transition: "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
                zIndex: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "calc(100% - 1.5rem)",
              }}
              >
              Date of Birth
            </label>
            <FaRegCalendarAlt
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#1ab3f0",
                fontSize: "1.2em",
                pointerEvents: "none",
              }}
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
            />
            <label>Address</label>
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              required
              pattern="[0-9]{10}"
              maxLength={10}
              title="Enter a 10-digit mobile number"
            />
            <label>Mobile</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <label>Email</label>
          </div>

          {!initialData && (
            <div className="input-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
              <label>Password</label>
            </div>
          )}

          <div
            className="modal-buttons"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
              width: "100%", 
            }}
          >
            <button
              style={{
                padding: "10px 40px", 
                minWidth: "300px", 
              }}
              type="submit"
            >
              {initialData ? "Save" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
