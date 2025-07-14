import { useRef, useState } from "react";
import "../styles/Modal.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";

const parseDate = (dateString: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const isValidDateFormat = (dateStr: string): boolean => {
  // Check if empty or follows YYYY-MM-DD format
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }

  const [year, month, day] = dateStr.split("-").map(Number);

  // Check year range
  if (year < 1900 || year > 2100) return false;

  // Check month range
  if (month < 1 || month > 12) return false;

  // Get last day of the month
  const lastDay = new Date(year, month, 0).getDate();

  // Check day range
  if (day < 1 || day > lastDay) return false;

  return true;
};

const formatDateInput = (input: string): string => {
  // Remove any non-digit characters first
  const digits = input.replace(/\D/g, "");

  // Format as YYYY-MM-DD while typing
  if (digits.length <= 4) {
    return digits;
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
};

type Props = {
  onClose: () => void;
  onSwitchToLogin: () => void;
  hideLoginLink?: boolean;
};

export default function SignupModal({
  onClose,
  onSwitchToLogin,
  hideLoginLink = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerMobile: "",
    ownerPassword: "",
    ownerDob: "",
    ownerAddress: "",
  });

  // Modal closing on outside click has been intentionally removed to prevent accidental closes

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const isAtLeast18 = (dobStr: string) => {
    if (!dobStr || !isValidDateFormat(dobStr)) return false;
    const dob = new Date(dobStr);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    const d = today.getDate() - dob.getDate();
    return age > 18 || (age === 18 && (m > 0 || (m === 0 && d >= 0)));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ownerDob) {
      alert("Please enter your date of birth.");
      return;
    }

    if (!isAtLeast18(form.ownerDob)) {
      alert("Customer must be at least 18 years old.");
      return;
    }

    const newUser = {
      name: form.ownerName,
      email: form.ownerEmail,
      password: form.ownerPassword,
      mobile: form.ownerMobile,
      dob: form.ownerDob || null,
      address: form.ownerAddress,
      role: "customer",
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful!");
      onClose();
      window.dispatchEvent(new Event("user-login"));
    } catch (err) {
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={ref}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <input
              type="text"
              name="ownerName"
              placeholder=" "
              value={form.ownerName}
              onChange={handleChange}
              required
              pattern="^[A-Z][a-zA-Z\s]*$"
              title="Name must start with a capital letter and contain only letters or spaces."
            />
            <label>Name</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="ownerEmail"
              placeholder=" "
              value={form.ownerEmail}
              onChange={handleChange}
              required
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="ownerMobile"
              placeholder=" "
              value={form.ownerMobile}
              onChange={handleChange}
              required
              pattern="^\d{10}$"
              title="Enter a valid 10-digit mobile number."
              maxLength={10}
            />
            <label>Mobile No.</label>
          </div>

          <div className="input-group">
            <ReactDatePicker
              selected={parseDate(form.ownerDob)}
              onChange={(date) =>
                setForm((prev) => ({
                  ...prev,
                  ownerDob: date ? date.toISOString().split("T")[0] : "",
                }))
              }
              dateFormat="yyyy-MM-dd"
              customInput={
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    name="ownerDob"
                    id="ownerDob"
                    required
                    autoComplete="off"
                    value={form.ownerDob}
                    placeholder=" "
                    onChange={(e) => {
                      const formattedDate = formatDateInput(e.target.value);
                      setForm((prev) => ({
                        ...prev,
                        ownerDob: formattedDate,
                      }));
                    }}
                    onBlur={(e) => {
                      const dateStr = e.target.value;
                      if (!dateStr) {
                        setForm((prev) => ({ ...prev, ownerDob: "" }));
                        return;
                      }

                      if (!isValidDateFormat(dateStr)) {
                        // If invalid format or date, clear the field
                        setForm((prev) => ({ ...prev, ownerDob: "" }));
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "1rem 0.75rem 0.5rem",
                      border: "1px solid #555",
                      background: "#2a2a2a",
                      color: "#eaf6fb",
                      borderRadius: "6px",
                      fontSize: "1rem",
                      outline: "none",
                      paddingRight: "2.2em",
                      cursor: "text",
                    }}
                  />
                  <label
                    htmlFor="ownerDob"
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: form.ownerDob ? "-0.5rem" : "1rem",
                      color: form.ownerDob ? "#1ab3f0" : "#aaa",
                      pointerEvents: "none",
                      transition: "0.25s ease",
                      backgroundColor: form.ownerDob
                        ? "#1e1e1e"
                        : "transparent",
                      padding: form.ownerDob ? "0 0.3rem" : "0",
                      fontSize: form.ownerDob ? "0.75rem" : "0.8rem",
                      zIndex: 1,
                    }}
                  >
                    Date of Birth
                  </label>
                  <FaRegCalendarAlt
                    style={{
                      position: "absolute",
                      right: "0.8em",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#1ab3f0",
                      fontSize: "1.25em",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              }
              maxDate={new Date()}
              minDate={new Date("1900-01-01")}
              calendarClassName="modal-datepicker"
              popperPlacement="bottom-end"
              showYearDropdown
              showMonthDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              isClearable
              allowSameDay={true}
              strictParsing={false}
            />
          </div>

          <div className="input-group" style={{ position: "relative" }}>
            <textarea
              name="ownerAddress"
              placeholder=" "
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

          <div className="input-group">
            <input
              type="password"
              name="ownerPassword"
              placeholder=" "
              value={form.ownerPassword}
              onChange={handleChange}
              required
              pattern=".{6,}"
              title="Password must be at least 6 characters long."
            />
            <label>Password</label>
          </div>

          <button type="submit">Register</button>
        </form>

        <div className="modal-footer">
          {!hideLoginLink && (
            <p
              style={{
                textAlign: "center",
                width: "100%",
                marginBottom: "1rem",
              }}
            >
              Already a user?{" "}
              <button onClick={onSwitchToLogin} className="modal-link">
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
