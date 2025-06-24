import { useState, useEffect } from "react";
import "../styles/Modal.css";

export type StaffData = {
  name: string;
  age: string;
  address: string;
  email: string;
  mobile: string;
  username: string;
  password: string;
};

type Props = {
  initialData?: StaffData;
  onClose: () => void;
  onSave: (data: StaffData) => void;
};

export default function AddStaffModal({ initialData, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<StaffData>({
    name: "",
    age: "",
    address: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
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
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              required
            />
            <label>Age</label>
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
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              required
            />
            <label>Mobile</label>
          </div>
          <div className="input-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              disabled={!!initialData} // prevent changing username in edit mode
            />
            <label>Username</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              disabled={!!initialData} // prevent changing password in edit mode
            />
            <label>Password</label>
          </div>

          <div className="modal-buttons" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit">
              {initialData ? "Update" : "Save"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
