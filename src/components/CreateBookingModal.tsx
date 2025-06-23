import { useRef, useEffect, useState } from "react";
import "../styles/Modal.css";

type Props = {
  onClose: () => void;
};

export default function CreateBookingModal({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    ownerName: "",
    ownerMobile: "",
    ownerDob: "",
    ownerEmail: "",
    ownerAddress: "",
    petName: "",
    petType: "",
    bookingFrom: "",
    bookingTo: "",
    service: "",
    petDob: "",
    petAge: "",
    petFood: "",
    petVaccinated: "",
    vaccinationFile: null,
    remarks: "",
    acknowledge: false,
    signature: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, files } = e.target as any;
    if (type === "file") {
      setForm((f) => ({ ...f, [name]: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date || !form.mobile || !form.email) {
      setError("Please fill all required fields.");
      return;
    }
    alert("Booking created!\n\n" + JSON.stringify(form, null, 2));
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={ref}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>Create Booking</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-columns">
            <div className="modal-form-col">
              {/* LEFT COLUMN FIELDS */}
              {/* Owner Name, Mobile, DOB, Email, Address, Pet Name, Pet Type */}
              <div className="input-group">
                <input
                  type="text"
                  id="owner-name"
                  name="ownerName"
                  placeholder="Owner Name"
                  required
                  value={form.ownerName || ""}
                  onChange={handleChange}
                />
                <label htmlFor="owner-name">Owner Name</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="owner-mobile"
                  name="ownerMobile"
                  placeholder="Mobile Number"
                  required
                  value={form.ownerMobile || ""}
                  onChange={handleChange}
                />
                <label htmlFor="owner-mobile">Mobile Number</label>
              </div>
              <div className="input-group">
                <input
                  type="date"
                  id="owner-dob"
                  name="ownerDob"
                  required
                  value={form.ownerDob || ""}
                  onChange={handleChange}
                />
                <label htmlFor="owner-dob">Owner Date of Birth</label>
              </div>
              <div className="input-group">
                <input
                  type="email"
                  id="owner-email"
                  name="ownerEmail"
                  placeholder="Email"
                  required
                  value={form.ownerEmail || ""}
                  onChange={handleChange}
                />
                <label htmlFor="owner-email">Email</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="owner-address"
                  name="ownerAddress"
                  placeholder="Address"
                  required
                  value={form.ownerAddress || ""}
                  onChange={handleChange}
                />
                <label htmlFor="owner-address">Address</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="pet-name"
                  name="petName"
                  placeholder="Pet Name"
                  required
                  value={form.petName || ""}
                  onChange={handleChange}
                />
                <label htmlFor="pet-name">Pet Name</label>
              </div>
              <div className="input-group">
                <select
                  id="pet-type"
                  name="petType"
                  required
                  value={form.petType || ""}
                  onChange={handleChange}
                  className="modal-input"
                >
                  <option value="" disabled>
                    Select Pet Type
                  </option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
                <label htmlFor="pet-type">Pet Type</label>
              </div>
            </div>
            <div className="modal-form-col">
              {/* RIGHT COLUMN FIELDS */}
              {/* Booking From, Booking To, Service, Pet DOB, Pet Age, Pet Food, Vaccination, File, Remarks, Acknowledge, Signature */}
              <div className="input-group">
                <input
                  type="date"
                  id="booking-from"
                  name="bookingFrom"
                  required
                  value={form.bookingFrom || ""}
                  onChange={handleChange}
                />
                <label htmlFor="booking-from">Booking Date From</label>
              </div>
              <div className="input-group">
                <input
                  type="date"
                  id="booking-to"
                  name="bookingTo"
                  required
                  value={form.bookingTo || ""}
                  onChange={handleChange}
                />
                <label htmlFor="booking-to">Booking Date To</label>
              </div>
              <div className="input-group">
                <select
                  id="service"
                  name="service"
                  required
                  value={form.service || ""}
                  onChange={handleChange}
                  className="modal-input"
                >
                  <option value="" disabled>
                    Select Service
                  </option>
                  <option value="Boarding">Boarding</option>
                  <option value="Grooming">Grooming</option>
                  <option value="Training">Training</option>
                  <option value="Day Care">Day Care</option>
                </select>
                <label htmlFor="service">Service You Want to Opt For?</label>
              </div>
              <div className="input-group">
                <input
                  type="date"
                  id="pet-dob"
                  name="petDob"
                  required
                  value={form.petDob || ""}
                  onChange={(e) => {
                    handleChange(e);
                    // Calculate pet age
                    const dob = new Date(e.target.value);
                    const age =
                      dob && !isNaN(dob.getTime())
                        ? Math.floor(
                            (Date.now() - dob.getTime()) /
                              (365.25 * 24 * 60 * 60 * 1000)
                          )
                        : "";
                    setForm((f) => ({ ...f, petAge: age }));
                  }}
                />
                <label htmlFor="pet-dob">Pet Date of Birth</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="pet-age"
                  name="petAge"
                  placeholder="Pet Age"
                  value={form.petAge || ""}
                  readOnly
                  className="modal-input"
                  style={{ background: "#222", color: "#aaa" }}
                />
                <label htmlFor="pet-age">Pet Age (auto)</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="pet-food"
                  name="petFood"
                  placeholder="Pet Food Habit"
                  required
                  value={form.petFood || ""}
                  onChange={handleChange}
                />
                <label htmlFor="pet-food">Pet Food Habit</label>
              </div>
              <div className="input-group">
                <label className="switch-group" style={{ cursor: "pointer" }}>
                  <span className="switch-label">Pet Vaccinated?</span>
                  <span className="switch">
                    <input
                      type="checkbox"
                      id="pet-vaccinated"
                      name="petVaccinated"
                      checked={form.petVaccinated === "Yes"}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          petVaccinated: e.target.checked ? "Yes" : "No",
                        }))
                      }
                    />
                    <span className="slider"></span>
                  </span>
                  <span
                    style={{
                      marginLeft: "0.5em",
                      color: "#1ab3f0",
                      fontWeight: 500,
                      minWidth: 32,
                      display: "inline-block",
                      textAlign: "center",
                    }}
                  >
                    {form.petVaccinated === "Yes" ? "Yes" : "No"}
                  </span>
                </label>
              </div>
              {form.petVaccinated === "Yes" && (
                <div className="input-group">
                  <input
                    type="file"
                    id="vaccination-file"
                    name="vaccinationFile"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                    className="modal-input"
                  />
                  <label
                    htmlFor="vaccination-file"
                    style={{ color: "#eaf6fb" }}
                  >
                    Upload Vaccination Proof
                  </label>
                </div>
              )}
            </div>
          </div>
          <div style={{ marginTop: "1em", width: "100%", textAlign: "left" }}>
            <div className="input-group" style={{ width: "100%" }}>
              <input
                type="checkbox"
                id="acknowledge"
                name="acknowledge"
                required
                checked={!!form.acknowledge}
                onChange={(e) =>
                  setForm((f) => ({ ...f, acknowledge: e.target.checked }))
                }
                style={{ width: "auto", marginRight: "0.5em" }}
              />
              <label
                htmlFor="acknowledge"
                style={{
                  position: "static",
                  transform: "none",
                  fontSize: "0.97em",
                  color: "#eaf6fb",
                }}
              >
                By signing this form, I hereby acknowledge that I am at least 18
                years old and the information given is true.
              </label>
            </div>
            <div className="input-group" style={{ width: "100%" }}>
              <input
                type="text"
                id="signature"
                name="signature"
                placeholder="Signature"
                required
                value={form.signature || ""}
                onChange={handleChange}
              />
              <label htmlFor="signature">Signature</label>
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button
            type="submit"
            className="btn modal-btn"
            style={{ marginTop: "1rem" }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
