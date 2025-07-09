import { useRef, useEffect, useState } from "react";
import "../styles/Modal.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import type { EditBookingModalProps, EditBookingForm } from "../types";

export default function EditBookingModal({
  booking,
  onClose,
  onSave,
}: EditBookingModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<EditBookingForm>({
    ...booking,
    services: booking.services || [],
    petAge: booking.petAge || "",
    petFood: booking.petFood || "",
    vaccinationCertificate: booking.vaccinationCertificate || null,
  });
  const [petVaccinated, setPetVaccinated] = useState(!!booking.petVaccinated);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      ...booking,
      services: booking.services || [],
      petAge: booking.petAge || "",
      petFood: booking.petFood || "",
      vaccinationCertificate: booking.vaccinationCertificate || null,
    });
    setPetVaccinated(!!booking.petVaccinated);
  }, [booking]);

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
    const { name, value, type, checked, files } = e.target as any;
    if (type === "file") {
      const file = files[0];
      if (file) {
        // Validate that the file is a PDF
        if (
          name === "vaccinationCertificate" &&
          !file.type.match("application/pdf")
        ) {
          setError("Only PDF files are allowed.");
          // Clear the file input so the invalid file isn't stored
          e.target.value = "";
          // Show popup alert
          alert("Please select a PDF file only.");
          return;
        }
        // Validate file size (1MB limit)
        if (file.size > 1 * 1024 * 1024) {
          setError("File too large (max 1MB)");
          // Clear the file input
          e.target.value = "";
          alert("The file is too large. Maximum size is 1MB.");
          return;
        }
        setForm((f: any) => ({ ...f, [name]: file }));
      }
    } else if (type === "checkbox") {
      setForm((f: any) => ({ ...f, [name]: checked }));
    } else {
      setForm((f: any) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Clear any previous errors
    setError("");

    // Comprehensive validation before proceeding
    if (!validateForm()) {
      // Don't set a generic error here since validateForm may set specific errors
      if (!error) {
        setError("Please fill all required fields.");
      }
      return;
    }

    // Explicitly check for vaccination certificate if pet is vaccinated
    if (petVaccinated) {
      if (form.vaccinationCertificate === null) {
        setError("Please upload a vaccination certificate.");
        alert("Please upload a vaccination certificate.");
        return;
      }

      // If it's a File object, validate it's a PDF and check size
      if (form.vaccinationCertificate instanceof File) {
        if (!form.vaccinationCertificate.type.match("application/pdf")) {
          setError("Only PDF files are allowed for vaccination certificate.");
          alert("Only PDF files are allowed. Please select a PDF file.");
          return;
        }

        // Double-check file size again before submission (1MB limit)
        if (form.vaccinationCertificate.size > 1 * 1024 * 1024) {
          setError("Vaccination certificate too large (max 1MB)");
          alert(
            "The vaccination certificate is too large. Maximum size is 1MB."
          );
          return;
        }
      }
    }

    try {
      setIsSubmitting(true);

      const isConfirmed = window.confirm(
        "Are you sure you want to update this booking?"
      );
      if (!isConfirmed) {
        setIsSubmitting(false);
        return;
      }

      // Prepare the updated booking data
      let finalCertificate = null;

      // Log file info if it's a File instance
      if (petVaccinated && form.vaccinationCertificate instanceof File) {
        const file = form.vaccinationCertificate;
        console.log(
          `File size before conversion: ${(file.size / 1024).toFixed(2)}KB`
        );

        finalCertificate = await convertFileToBase64(file);

        // Log base64 size after conversion
        if (finalCertificate) {
          console.log(
            `Base64 size after conversion: ${(
              finalCertificate.length / 1024
            ).toFixed(2)}KB`
          );
        }
      } else if (
        petVaccinated &&
        typeof form.vaccinationCertificate === "string"
      ) {
        // Keep existing certificate
        finalCertificate = form.vaccinationCertificate;
        console.log(
          `Using existing certificate, length: ${(
            finalCertificate.length / 1024
          ).toFixed(2)}KB`
        );
      }

      const updatedBooking = {
        ...form,
        petVaccinated,
        vaccinationCertificate: finalCertificate,
      };

      // Ensure we're sending null when pet is not vaccinated
      if (!petVaccinated) {
        updatedBooking.vaccinationCertificate = null;
      }

      await onSave(updatedBooking);

      alert("Booking updated successfully!");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    // Check if a file is present and is not a PDF
    if (petVaccinated && form.vaccinationCertificate instanceof File) {
      const fileType = form.vaccinationCertificate.type;
      if (!fileType.match("application/pdf")) {
        setError("Only PDF files are allowed for vaccination certificate.");
        return false;
      }
    }

    return (
      form.ownerName &&
      form.ownerMobile &&
      form.ownerDob &&
      form.ownerEmail &&
      form.ownerAddress &&
      form.petName &&
      form.petType &&
      form.bookingFrom &&
      form.bookingTo &&
      form.services?.length > 0 &&
      form.petDob &&
      form.petFood
    );
  };

  // Add this to your imports if not already there
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  const parseDate = (val: string) => (val ? new Date(val) : null);

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={ref}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>Edit Booking</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-columns">
            <div className="modal-form-col">
              {/* LEFT COLUMN */}
              <div className="input-group">
                <input
                  type="text"
                  name="ownerName"
                  placeholder="Owner Name"
                  required
                  value={form.ownerName}
                  onChange={handleChange}
                />
                <label>Owner Name</label>
              </div>
              <div className="input-group">
                <input
                  type="tel"
                  name="ownerMobile"
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number"
                  placeholder="Mobile Number"
                  required
                  value={form.ownerMobile}
                  onChange={handleChange}
                />
                <label>Mobile Number</label>
              </div>
              {/* --- Owner Date of Birth --- */}
              <div className="input-group" style={{ position: "relative" }}>
                <ReactDatePicker
                  selected={parseDate(form.ownerDob)}
                  onChange={(date) =>
                    setForm((f: any) => ({
                      ...f,
                      ownerDob: date ? date.toISOString().slice(0, 10) : "",
                    }))
                  }
                  dateFormat="yyyy-MM-dd"
                  customInput={
                    <input
                      type="text"
                      name="ownerDob"
                      required
                      autoComplete="off"
                      value={form.ownerDob}
                      onKeyDown={(e) => e.preventDefault()}
                      style={{
                        background: "#2a2a2a",
                        color: "#eaf6fb",
                        border: "1px solid #555",
                        paddingRight: "2.2em",
                        cursor: "pointer",
                      }}
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
                    top: form.ownerDob ? "-0.5rem" : "1rem",
                    fontSize: form.ownerDob ? "0.75rem" : "0.8rem",
                    color: form.ownerDob ? "#1ab3f0" : "#aaa",
                    background: form.ownerDob ? "#181f2a" : "transparent",
                    padding: "0 0.3rem",
                    pointerEvents: "none",
                    transition:
                      "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
                    zIndex: 2,
                  }}
                >
                  Owner Date of Birth
                </label>
              </div>
              <div className="input-group">
                <input
                  type="email"
                  name="ownerEmail"
                  placeholder="Email"
                  required
                  value={form.ownerEmail}
                  onChange={handleChange}
                />
                <label>Email</label>
              </div>
              {/* --- Address --- */}
              <div className="input-group" style={{ position: "relative" }}>
                <textarea
                  name="ownerAddress"
                  placeholder=""
                  required
                  value={form.ownerAddress}
                  onChange={handleChange}
                  rows={3}
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
                  type="text"
                  name="petName"
                  placeholder="Pet Name"
                  required
                  value={form.petName}
                  onChange={handleChange}
                />
                <label>Pet Name</label>
              </div>
              <div className="input-group">
                <select
                  name="petType"
                  required
                  value={form.petType}
                  onChange={handleChange}
                  data-has-value={form.petType !== ""}
                >
                  <option value="" disabled></option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
                <label>Pet Type</label>
              </div>
            </div>
            <div className="modal-form-col">
              {/* RIGHT COLUMN */}
              {/* --- Booking Date From & To on the same row --- */}
              <div style={{ display: "flex", gap: "1em", width: "100%" }}>
                <div
                  className="input-group"
                  style={{ position: "relative", flex: 1 }}
                >
                  {/* Booking Date From */}
                  <ReactDatePicker
                    selected={parseDate(form.bookingFrom)}
                    onChange={(date) =>
                      setForm((f: any) => ({
                        ...f,
                        bookingFrom: date
                          ? date.toISOString().slice(0, 10)
                          : "",
                      }))
                    }
                    dateFormat="yyyy-MM-dd"
                    customInput={
                      <input
                        type="text"
                        name="bookingFrom"
                        required
                        autoComplete="off"
                        value={form.bookingFrom}
                        onKeyDown={(e) => e.preventDefault()}
                        style={{
                          background: "#2a2a2a",
                          color: "#eaf6fb",
                          border: "1px solid #555",
                          paddingRight: "2.2em",
                          cursor: "pointer",
                        }}
                      />
                    }
                    calendarClassName="modal-datepicker"
                    popperPlacement="bottom-end"
                  />
                  <FaRegCalendarAlt
                    style={{
                      position: "absolute",
                      right: "0.5em",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#1ab3f0",
                      fontSize: "1em",
                      pointerEvents: "none",
                      opacity: 0.85,
                      transition: "color 0.2s",
                    }}
                  />
                  <label
                    style={{
                      position: "absolute",
                      left: "0.5rem",
                      right: "0.6rem", // NEW: constrain label width
                      top: form.bookingFrom ? "-0.5rem" : "1rem",
                      fontSize: form.bookingFrom ? "0.75rem" : "0.7rem",
                      color: form.bookingFrom ? "#1ab3f0" : "#aaa",
                      background: form.bookingFrom ? "#181f2a" : "transparent",
                      padding: "0 0.2rem",
                      pointerEvents: "none",
                      transition:
                        "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
                      zIndex: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    Booking Date From
                  </label>
                </div>
                <div
                  className="input-group"
                  style={{ position: "relative", flex: 1 }}
                >
                  {/* Booking Date To */}
                  <ReactDatePicker
                    selected={parseDate(form.bookingTo)}
                    onChange={(date) =>
                      setForm((f: any) => ({
                        ...f,
                        bookingTo: date ? date.toISOString().slice(0, 10) : "",
                      }))
                    }
                    dateFormat="yyyy-MM-dd"
                    customInput={
                      <input
                        type="text"
                        name="bookingTo"
                        required
                        autoComplete="off"
                        value={form.bookingTo}
                        onKeyDown={(e) => e.preventDefault()}
                        style={{
                          background: "#2a2a2a",
                          color: "#eaf6fb",
                          border: "1px solid #555",
                          paddingRight: "2.2em",
                          cursor: "pointer",
                        }}
                      />
                    }
                    calendarClassName="modal-datepicker"
                    popperPlacement="bottom-end"
                  />
                  <FaRegCalendarAlt
                    style={{
                      position: "absolute",
                      right: "0.7em",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#1ab3f0",
                      fontSize: "1em",
                      pointerEvents: "none",
                      opacity: 0.85,
                      transition: "color 0.2s",
                    }}
                  />
                  <label
                    style={{
                      position: "absolute",
                      left: "0.5rem",
                      right: "0.6rem", // NEW: constrain label width
                      top: form.bookingTo ? "-0.5rem" : "1rem",
                      fontSize: form.bookingTo ? "0.75rem" : "0.7rem",
                      color: form.bookingTo ? "#1ab3f0" : "#aaa",
                      background: form.bookingTo ? "#181f2a" : "transparent",
                      padding: "0 0.2rem",
                      pointerEvents: "none",
                      transition:
                        "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
                      zIndex: 2,
                    }}
                  >
                    Booking Date To
                  </label>
                </div>
              </div>
              <div style={{ marginTop: "1.2em", marginBottom: "1.2em" }}>
                <div
                  style={{
                    marginBottom: "0.5em",
                    color: "#eaf6fb",
                    fontWeight: 500,
                    fontSize: "0.9em",
                  }}
                >
                  Select Services
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    color: "#aaa",
                    gap: "0.7em",
                  }}
                >
                  {["Boarding", "Grooming", "Training", "Day Care"].map((s) => (
                    <label
                      key={s}
                      style={{
                        fontWeight: 400,
                        fontSize: "0.9em",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3em",
                        padding: "0.2em 0.7em",
                        minWidth: "0",
                        justifyContent: "flex-start",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="services"
                        value={s}
                        checked={
                          Array.isArray(form.services) &&
                          form.services.includes(s)
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm((f: any) => ({
                              ...f,
                              services: [...(f.services || []), s],
                            }));
                          } else {
                            setForm((f: any) => ({
                              ...f,
                              services: (f.services || []).filter(
                                (val: any) => val !== s // <-- add : any here
                              ),
                            }));
                          }
                        }}
                        style={{
                          marginRight: "0.4em",
                          accentColor: "#1ab3f0",
                        }}
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              {/* --- Pet Date of Birth --- */}
              <div className="input-group" style={{ position: "relative" }}>
                <ReactDatePicker
                  selected={parseDate(form.petDob)}
                  onChange={(date) => {
                    setForm((f: any) => {
                      const dob = date;
                      const age =
                        dob && !isNaN(dob.getTime())
                          ? Math.floor(
                              (Date.now() - dob.getTime()) /
                                (365.25 * 24 * 60 * 60 * 1000)
                            )
                          : "";
                      return {
                        ...f,
                        petDob: dob ? dob.toISOString().slice(0, 10) : "",
                        petAge: age.toString(),
                      };
                    });
                  }}
                  dateFormat="yyyy-MM-dd"
                  customInput={
                    <input
                      type="text"
                      name="petDob"
                      required
                      autoComplete="off"
                      value={form.petDob}
                      onKeyDown={(e) => e.preventDefault()}
                      style={{
                        background: "#2a2a2a",
                        color: "#eaf6fb",
                        border: "1px solid #555",
                        paddingRight: "2.2em",
                        cursor: "pointer",
                      }}
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
                    top: form.petDob ? "-0.5rem" : "1rem",
                    fontSize: form.petDob ? "0.75rem" : "0.8rem",
                    color: form.petDob ? "#1ab3f0" : "#aaa",
                    background: form.petDob ? "#181f2a" : "transparent",
                    padding: "0 0.3rem",
                    pointerEvents: "none",
                    transition:
                      "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
                    zIndex: 2,
                  }}
                >
                  Pet Date of Birth
                </label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="petAge"
                  placeholder="Pet Age"
                  value={form.petAge}
                  readOnly
                  tabIndex={-1}
                  style={{
                    background: "#222",
                    color: "#eaf6fb",
                    border: "1px solid #333",
                    pointerEvents: "none", // disables mouse interaction
                  }}
                />
                <label>Pet Age (Auto)</label>
              </div>
              {/* --- Pet Food Habit --- */}
              <div className="input-group" style={{ position: "relative" }}>
                <textarea
                  name="petFood"
                  placeholder=""
                  required
                  value={form.petFood}
                  onChange={handleChange}
                  rows={2}
                />
                <label
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: form.petFood ? "-0.5rem" : "1rem",
                    fontSize: form.petFood ? "0.75rem" : "0.8rem",
                    color: form.petFood ? "#1ab3f0" : "#aaa",
                    background: form.petFood ? "#181f2a" : "transparent",
                    padding: "0 0.3rem",
                    pointerEvents: "none",
                    transition:
                      "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
                    zIndex: 2,
                  }}
                >
                  Pet Food Habit
                </label>
              </div>
            </div>
          </div>
          <div
            className="pet-vaccinated-row"
            style={{
              display: "flex",
              fontSize: "0.9em",
              alignItems: "center",
              margin: "1em 0 0.5em 0",
              gap: "1em",
              minWidth: 0,
            }}
          >
            <span
              style={{
                marginRight: "1em",
                color: "#eaf6fb",
                fontWeight: 500,
                minWidth: 0,
                whiteSpace: "nowrap",
              }}
            >
              Pet Vaccinated:
            </span>
            <label className="toggle-switch" style={{ minWidth: 0 }}>
              <input
                type="checkbox"
                checked={petVaccinated}
                onChange={() => {
                  const newVaccinatedStatus = !petVaccinated;
                  setPetVaccinated(newVaccinatedStatus);
                  // Clear certificate immediately when toggling to "No"
                  if (!newVaccinatedStatus) {
                    setForm((f) => ({ ...f, vaccinationCertificate: null }));
                  }
                }}
                style={{ display: "none" }}
              />
              <span className="slider"></span>
            </label>
            <span
              style={{
                marginLeft: "0.3em",
                color: petVaccinated ? "#1ab3f0" : "#aaa",
                fontWeight: 600,
                minWidth: 0,
                textAlign: "left",
                fontSize: "1em",
                userSelect: "none",
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {petVaccinated ? "Yes" : "No"}
            </span>
            <div style={{ flex: 1, minWidth: 0 }} />
            {/* This pushes the next item to the right */}
            {petVaccinated && (
              <label
                style={{
                  color: "#ccc",
                  fontSize: "1em",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }}
              >
                Upload Certificate:
                <input
                  type="file"
                  name="vaccinationCertificate"
                  accept=".pdf"
                  onChange={handleChange} // Use the existing handleChange function
                  style={{
                    color: "#eaf6fb",
                    background: "#2a2a2a",
                    border: "1px solid #1ab3f0",
                    borderRadius: "4px",
                    padding: "0.3em 0.5em",
                    fontSize: "0.9em",
                    outline: "none",
                    boxShadow: "none",
                    width: "180px",
                    cursor: "pointer",
                  }}
                />
              </label>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError("")}>×</button>
            </div>
          )}
          <button
            type="submit"
            className="btn modal-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
