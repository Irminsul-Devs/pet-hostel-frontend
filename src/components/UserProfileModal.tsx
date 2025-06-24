import { useRef, useEffect, useState } from "react";
import "../styles/Modal.css";
import "../styles/UserDashboard.css";
type Props = {
  user: any;
  onClose: () => void;
};

export default function UserProfileModal({ user, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const defaultForm = {
    ownerName: user?.ownerName || "John Doe",
    ownerMobile: user?.ownerMobile || "9876543210",
    ownerEmail: user?.ownerEmail || "john@example.com",
    ownerDob: user?.ownerDob || "1990-01-01",
    ownerAddress: user?.ownerAddress || "123 Pet Street",
    services: user?.services || ["Boarding", "Grooming"],
    petName: user?.petName || "Tommy",
    petDob: user?.petDob || "2020-06-10",
    petType: user?.petType || "Dog",
  };

  const [form, setForm] = useState(defaultForm);

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
      ...user,
      ownerName: form.ownerName,
      ownerMobile: form.ownerMobile,
      ownerEmail: form.ownerEmail,
      ownerDob: form.ownerDob,
      ownerAddress: form.ownerAddress,
      services: form.services, // preserve this in storage
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profile updated!");
    onClose();
    window.dispatchEvent(new Event("user-login"));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={ref}>
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
                  required
                />
                <label>Owner Name</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="ownerMobile"
                  value={form.ownerMobile}
                  onChange={handleChange}
                  required
                />
                <label>Mobile Number</label>
              </div>
              <div className="input-group">
                <input
                  type="email"
                  name="ownerEmail"
                  value={form.ownerEmail}
                  onChange={handleChange}
                  required
                />
                <label>Email</label>
              </div>
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
                <label>Address</label>
              </div>
            </div>

            <div className="modal-form-col">
              <div >
                <label style={{ marginBottom: "0.5rem", display: "block", marginTop:"1rem"}}>
                  Services Opted
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  {["Boarding", "Grooming", "Training", "Day Care"].map((svc) => (
                    <label key={svc} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <input
                        type="checkbox"
                        checked={form.services.includes(svc)}
                        disabled
                      />
                      <span>{svc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <input type="text" value={form.petName} readOnly disabled />
                <label>Pet Name</label>
              </div>
              <div className="input-group">
                <input type="date" value={form.petDob} readOnly disabled />
                <label>Pet DOB</label>
              </div>
              <div className="input-group">
                <input type="text" value={form.petType} readOnly disabled />
                <label>Pet Type</label>
              </div>
            </div>
          </div>

<div style={{ display: "flex", gap: "10px", alignItems: "right" }}>
            <button type="button" className="btn modal-btn"  style={{  marginLeft:"200px" ,padding: "9px 25px ",marginTop:"10px", fontSize: "0.85rem",height: "48px",alignItems: "right"}}
              onClick={() => {
    setForm({
      ownerName: user?.ownerName || "John Doe",
      ownerMobile: user?.ownerMobile || "9876543210",
      ownerEmail: user?.ownerEmail || "john@example.com",
      ownerDob: user?.ownerDob || "1990-01-01",
      ownerAddress: user?.ownerAddress || "123 Pet Street",
      services: user?.services || ["Boarding", "Grooming"],
      petName: user?.petName || "Tommy",
      petDob: user?.petDob || "2020-06-10",
      petType: user?.petType || "Dog",
    });
  }}
            >
              Cancel
            </button>
            <button type="submit" className="btn modal-btn " style={{  marginLeft:"20px",paddingBottom:"10px",padding: "9px 25px", fontSize: "0.85rem", height: "48px",alignItems: "right" }}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
