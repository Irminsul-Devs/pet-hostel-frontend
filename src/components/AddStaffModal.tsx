import { useState, useEffect } from "react";
import "../styles/Modal.css";

export type StaffData = {
  id?: number; // <-- add this
  name: string;
  dob: string;
  address: string;
  email: string;
  mobile: string;
  password?: string; // optional during edit
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
        dob: initialData.dob.split("T")[0], // ✅ Strip time part for date input
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    // Delegate API call to parent
    onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>{initialData ? "Edit Staff" : "Add Staff"}</h2>
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

          <div className="input-group">
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              placeholder=" "
              max={new Date().toISOString().split("T")[0]}
              min="1900-01-01"
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
            style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
          >
            <button type="submit">{initialData ? "Save" : "Submit"}</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}