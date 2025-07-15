import { useState } from "react";
import "../styles/Modal.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import type { User } from "../types";

const parseDate = (dateString: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const isValidDateFormat = (dateStr: string): boolean => {

  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }

  const [year, month, day] = dateStr.split("-").map(Number);


  if (year < 1900 || year > 2100) return false;


  if (month < 1 || month > 12) return false;


  const lastDay = new Date(year, month, 0).getDate();


  if (day < 1 || day > lastDay) return false;

  return true;
};

const formatDateInput = (input: string): string => {

  const digits = input.replace(/\D/g, "");

  if (digits.length <= 4) {
    return digits;
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
};

interface EditCustomerModalProps {
  customer: User;
  onClose: () => void;
  onSave: (updatedCustomer: User) => Promise<void>;
}

export default function EditCustomerModal({
  customer,
  onClose,
  onSave,
}: EditCustomerModalProps) {
  const [formData, setFormData] = useState({
    name: customer.name || "",
    email: customer.email || "",
    mobile: customer.mobile || "",
    dob: customer.dob ? new Date(customer.dob).toISOString().split("T")[0] : "",
    address: customer.address || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSave({
        ...customer,
        ...formData,
        role: "customer",
        password: customer.password,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update customer"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Customer Details</h2>
          <button onClick={onClose} className="modal-close">
            ✕
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="modal-form-columns">
            <div className="modal-form-col">
              <div className="input-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Name"
                  pattern="^[A-Z][a-zA-Z\s]*$"
                  title="Name must start with a capital letter and contain only letters or spaces."
                />
                <label htmlFor="name">Name</label>
              </div>

              <div className="input-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-group">
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  pattern="^\d{10}$"
                  title="Enter a valid 10-digit mobile number."
                  maxLength={10}
                  placeholder="Mobile"
                />
                <label htmlFor="mobile">Mobile</label>
              </div>
            </div>

            <div className="modal-form-col">
              <div className="input-group">
                <ReactDatePicker
                  selected={parseDate(formData.dob)}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      dob: date ? date.toISOString().split("T")[0] : "",
                    }))
                  }
                  dateFormat="yyyy-MM-dd"
                  customInput={
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        name="dob"
                        id="dob"
                        required
                        autoComplete="off"
                        value={formData.dob}
                        placeholder="Date of Birth"
                        onChange={(e) => {
                          const formattedDate = formatDateInput(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            dob: formattedDate,
                          }));
                        }}
                        onBlur={(e) => {
                          const dateStr = e.target.value;
                          if (!dateStr) {
                            setFormData((prev) => ({ ...prev, dob: "" }));
                            return;
                          }

                          if (!isValidDateFormat(dateStr)) {
                            // If invalid format or date, clear the field
                            setFormData((prev) => ({ ...prev, dob: "" }));
                          }
                        }}
                        style={{
                          width: "100%",
                          padding: "1rem 0.75rem 0.5rem",
                          borderRadius: "6px",
                          fontSize: "1rem",
                          outline: "none",
                          paddingRight: "2.2em",
                          cursor: "text",
                        }}
                      />
                      <label
                        htmlFor="dob"
                        style={{
                          position: "absolute",
                          left: "0.75rem",
                          top: formData.dob ? "-0.5rem" : "1rem",
                          color: formData.dob ? "#1ab3f0" : "#888",
                          pointerEvents: "none",
                          transition: "0.25s ease",
                          padding: formData.dob ? "0 0.3rem" : "0",
                          fontSize: formData.dob ? "0.75rem" : "0.8rem",
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
                  allowSameDay={true}
                  strictParsing={false}
                />
              </div>

              <div className="input-group">
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder=" "
                  style={{ resize: "none" }}
                />
                <label htmlFor="address" className="floating-label">
                  Address
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
