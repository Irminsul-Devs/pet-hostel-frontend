import { useRef, useEffect, useState } from "react";
import "../styles/Modal.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import type { EditBookingModalProps, EditBookingForm } from "../types";
import type { CSSProperties } from "react";
import CustomerSelect from "./CustomerSelect";

// Define service prices - ensure these match with CreateBookingModal
const SERVICE_PRICES = {
  Boarding: 35.0, // per day
  Grooming: 45.0, // flat fee
  Training: 50.0, // per session
  "Day Care": 25.0, // per day
};

export default function EditBookingModal({
  booking,
  onClose,
  onSave,
  userRole,
  userId,
}: EditBookingModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<EditBookingForm>({
    ...booking,
    services: booking.services || [],
    petAge: booking.petAge || "",
    petFood: booking.petFood || "",
    vaccinationCertificate: booking.vaccinationCertificate || null,
    customerId: booking.customer?.id || booking.customerId,
  });
  const [petVaccinated, setPetVaccinated] = useState(!!booking.petVaccinated);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(booking.amount || 0);

  useEffect(() => {
    setForm({
      ...booking,
      services: booking.services || [],
      petAge: booking.petAge || "",
      petFood: booking.petFood || "",
      vaccinationCertificate: booking.vaccinationCertificate || null,
      customerId: booking.customer?.id || booking.customerId,
    });
    setPetVaccinated(!!booking.petVaccinated);
    setTotalAmount(booking.amount || 0);
  }, [booking]);

  // Calculate amount whenever services or dates change
  useEffect(() => {
    let amount = 0;

    // Calculate boarding/day care based on days
    if (
      form.bookingFrom &&
      form.bookingTo &&
      (form.services.includes("Boarding") || form.services.includes("Day Care"))
    ) {
      // Calculate days difference
      const fromDate = new Date(form.bookingFrom);
      const toDate = new Date(form.bookingTo);
      const days = Math.max(
        1,
        Math.ceil(
          (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      // Add boarding cost if selected
      if (form.services.includes("Boarding")) {
        amount += SERVICE_PRICES.Boarding * days;
      }
      // Add day care cost if selected
      if (form.services.includes("Day Care")) {
        amount += SERVICE_PRICES["Day Care"] * days;
      }
    }

    // Add grooming cost if selected (flat fee)
    if (form.services.includes("Grooming")) {
      amount += SERVICE_PRICES.Grooming;
    }
    // Add training cost if selected (flat fee)
    if (form.services.includes("Training")) {
      amount += SERVICE_PRICES.Training;
    }

    setTotalAmount(amount);
    setForm((prev) => ({ ...prev, amount }));
  }, [form.services, form.bookingFrom, form.bookingTo]);

  // Modal closing on outside click has been intentionally removed to prevent accidental closes

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
        amount: totalAmount, // Explicitly include the calculated amount
        userId, // Keep track of who is making the edit
        customerId: form.customerId, // Keep the selected customer
      };

      // Ensure we're sending null when pet is not vaccinated
      if (!petVaccinated) {
        updatedBooking.vaccinationCertificate = null;
      }

      console.log("Sending amount in update:", updatedBooking.amount);

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
    // Validate booking dates
    if (form.bookingFrom && form.bookingTo) {
      const fromDate = new Date(form.bookingFrom);
      const toDate = new Date(form.bookingTo);
      if (fromDate > toDate) {
        setError("Booking end date cannot be earlier than start date.");
        return false;
      }
    }

    // Check if a file is present and is not a PDF
    if (petVaccinated && form.vaccinationCertificate instanceof File) {
      const fileType = form.vaccinationCertificate.type;
      if (!fileType.match("application/pdf")) {
        setError("Only PDF files are allowed for vaccination certificate.");
        return false;
      }
    }

    return (
      form.petName &&
      form.petType &&
      form.bookingFrom &&
      form.bookingTo &&
      form.services?.length > 0 &&
      form.petDob &&
      form.petFood &&
      form.customerId
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
              {/* Customer selection for staff users */}
              <CustomerSelect
                value={form.customerId}
                onChange={(customerId) =>
                  setForm((prev) => ({ ...prev, customerId }))
                }
                isStaff={userRole === "staff" || userRole === "admin"}
                currentUserId={userId}
              />
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
                  <option value="Rabbit">Rabbit</option>
                </select>
                <label>Pet Type</label>
              </div>
              {/* --- Pet Date of Birth --- */}
              <div className="input-group" style={{ position: "relative" }}>
                <ReactDatePicker
                  selected={parseDate(form.petDob)}
                  onChange={(date) => {
                    if (!date) {
                      setForm((f: any) => ({
                        ...f,
                        petDob: "",
                        petAge: "",
                      }));
                      return;
                    }

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Don't allow future dates
                    if (date > today) {
                      alert("Pet's date of birth cannot be in the future");
                      return;
                    }

                    // Calculate age in years
                    const ageInYears =
                      (today.getTime() - date.getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000);

                    // Age validations based on pet type
                    if (form.petType) {
                      const maxAges: { [key: string]: number } = {
                        Dog: 25, // Maximum reasonable age for dogs
                        Cat: 30, // Maximum reasonable age for cats
                        Bird: 50, // Maximum reasonable age for common pet birds
                        Rabbit: 15, // Maximum reasonable age for rabbits
                      };

                      if (ageInYears > maxAges[form.petType]) {
                        alert(
                          `The entered date of birth seems unrealistic for a ${form.petType.toLowerCase()}. Please check the date.`
                        );
                        return;
                      }
                    }

                    // If validations pass, update the form
                    setForm((f: any) => {
                      const age = Math.floor(ageInYears);
                      let ageString = "";
                      if (age > 0) {
                        ageString = `${age} year${age > 1 ? "s" : ""}`;
                        const remainingMonths = Math.floor(
                          (ageInYears - age) * 12
                        );
                        if (remainingMonths > 0) {
                          ageString += `, ${remainingMonths} month${
                            remainingMonths > 1 ? "s" : ""
                          }`;
                        }
                      } else {
                        const months = Math.max(0, Math.floor(ageInYears * 12));
                        ageString = `${months} month${months !== 1 ? "s" : ""}`;
                      }

                      return {
                        ...f,
                        petDob: date.toISOString().slice(0, 10),
                        petAge: ageString,
                      };
                    });
                  }}
                  showYearDropdown
                  showMonthDropdown
                  scrollableYearDropdown
                  dropdownMode="scroll"
                  yearDropdownItemNumber={100}
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
                    color: form.petDob ? "#1ab3f0" : "#888",
                    background: form.petDob ? "#fff" : "transparent",
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
                    pointerEvents: "none",
                  }}
                />
                <label>Pet Age (Auto)</label>
              </div>
            </div>
            <div className="modal-form-col">
              {/* RIGHT COLUMN */}
              {/* --- Booking Date From & To on the same row --- */}
              <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    marginBottom: "0.7em",
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "0.9em",
                  }}
                >
                  Booking Date
                </div>
                <div style={{ display: "flex", gap: "1em", width: "100%" }}>
                  <div
                    className="input-group"
                    style={{ position: "relative", flex: 1 }}
                  >
                    {/* Booking Date From */}
                    <ReactDatePicker
                      selected={parseDate(form.bookingFrom)}
                      onChange={(date) => {
                        if (date && form.bookingTo) {
                          const toDate = new Date(form.bookingTo);
                          if (date > toDate) {
                            alert(
                              "Booking start date cannot be later than end date"
                            );
                            return;
                          }
                        }
                        setForm((f: any) => ({
                          ...f,
                          bookingFrom: date
                            ? date.toISOString().slice(0, 10)
                            : "",
                        }));
                      }}
                      showYearDropdown
                      showMonthDropdown
                      scrollableYearDropdown
                      dropdownMode="scroll"
                      yearDropdownItemNumber={100}
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
                            paddingRight: "2.2em",
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
                        top: form.bookingFrom ? "-0.5rem" : "1rem",
                        fontSize: form.bookingFrom ? "0.75rem" : "0.75rem",
                        color: form.bookingFrom ? "#1ab3f0" : "#888",
                        background: form.bookingFrom
                          ? "#fff"
                          : "transparent",
                        padding: "0 0.2rem",
                        pointerEvents: "none",
                        transition:
                          "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
                        zIndex: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "calc(100% - 1.5rem)",
                      }}
                    >
                      From
                    </label>
                  </div>
                  <div
                    className="input-group"
                    style={{ position: "relative", flex: 1 }}
                  >
                    {/* Booking Date To */}
                    <ReactDatePicker
                      selected={parseDate(form.bookingTo)}
                      onChange={(date) => {
                        if (date && form.bookingFrom) {
                          const fromDate = new Date(form.bookingFrom);
                          if (date < fromDate) {
                            alert(
                              "Booking end date cannot be earlier than start date"
                            );
                            return;
                          }
                        }
                        setForm((f: any) => ({
                          ...f,
                          bookingTo: date
                            ? date.toISOString().slice(0, 10)
                            : "",
                        }));
                      }}
                      showYearDropdown
                      showMonthDropdown
                      scrollableYearDropdown
                      dropdownMode="scroll"
                      yearDropdownItemNumber={100}
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
                            paddingRight: "2.2em",
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
                        top: form.bookingTo ? "-0.5rem" : "1rem",
                        fontSize: form.bookingTo ? "0.75rem" : "0.75rem",
                        color: form.bookingTo ? "#1ab3f0" : "#888",
                        background: form.bookingTo ? "#fff" : "transparent",
                        padding: "0 0.2rem",
                        pointerEvents: "none",
                        transition:
                          "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
                        zIndex: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "calc(100% - 1.5rem)",
                      }}
                    >
                      To
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "1.2em", marginBottom: "1.2em" }}>
                <div
                  style={{
                    marginBottom: "0.5em",
                    color: "#333",
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
                    color: "#444",
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
                    color: form.petFood ? "#1ab3f0" : "#888",
                    background: form.petFood ? "#fff" : "transparent",
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
                color: "#333",
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
                color: petVaccinated ? "#1ab3f0" : "#333",
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
                  color: "#333",
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
                    color: "#222",
                    background: "#fff",
                    border: "2px solid #1ab3f0",
                    borderRadius: "4px",
                    padding: "0.4em 0.5em",
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

          {/* Remarks field */}
          <div
            className="input-group"
            style={{ position: "relative", marginTop: "1.5rem" }}
          >
            <textarea
              name="remarks"
              placeholder=""
              value={form.remarks || ""}
              onChange={handleChange}
              rows={3}
              style={{ width: "100%" }}
            />
            <label
              style={{
                position: "absolute",
                left: "0.75rem",
                top: form.remarks ? "-0.5rem" : "1rem",
                fontSize: form.remarks ? "0.75rem" : "0.8rem",
                color: form.remarks ? "#1ab3f0" : "#888",
                background: form.remarks ? "#fff" : "transparent",
                padding: "0 0.3rem",
                pointerEvents: "none",
                transition: "all 0.2s ease-out",
              }}
            >
              Remarks (Optional)
            </label>
          </div>

          {/* Amount Summary Section */}
          <div style={amountContainerStyle}>
            <div style={amountHeaderStyle}>
              <h3 style={amountTitleStyle}>Booking Summary</h3>
              <div style={totalAmountStyle}>
                $
                {(() => {
                  console.log(
                    "EditBookingModal amount:",
                    totalAmount,
                    typeof totalAmount
                  );
                  let amount = 0;
                  if (totalAmount !== undefined && totalAmount !== null) {
                    amount =
                      typeof totalAmount === "string"
                        ? parseFloat(totalAmount)
                        : Number(totalAmount);

                    if (isNaN(amount)) amount = 0;
                  }
                  return amount.toFixed(2);
                })()}
              </div>
            </div>
            {form.services.length > 0 && (
              <div style={amountBreakdownStyle}>
                {form.services.includes("Boarding") &&
                  form.bookingFrom &&
                  form.bookingTo && (
                    <div style={amountItemStyle}>
                      <span>Boarding</span>
                      <span>
                        $
                        {(
                          SERVICE_PRICES.Boarding *
                          Math.max(
                            1,
                            Math.ceil(
                              (new Date(form.bookingTo).getTime() -
                                new Date(form.bookingFrom).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                {form.services.includes("Day Care") &&
                  form.bookingFrom &&
                  form.bookingTo && (
                    <div style={amountItemStyle}>
                      <span>Day Care</span>
                      <span>
                        $
                        {(
                          SERVICE_PRICES["Day Care"] *
                          Math.max(
                            1,
                            Math.ceil(
                              (new Date(form.bookingTo).getTime() -
                                new Date(form.bookingFrom).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                {form.services.includes("Grooming") && (
                  <div style={amountItemStyle}>
                    <span>Grooming</span>
                    <span>${SERVICE_PRICES.Grooming.toFixed(2)}</span>
                  </div>
                )}
                {form.services.includes("Training") && (
                  <div style={amountItemStyle}>
                    <span>Training</span>
                    <span>${SERVICE_PRICES.Training.toFixed(2)}</span>
                  </div>
                )}
              </div>
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

// Styles for amount section
const amountContainerStyle: CSSProperties = {
  marginTop: "1.5rem",
  marginBottom: "1.5rem",
  backgroundColor: "#1c2533",
  border: "1px solid #2c3e50",
  borderRadius: "8px",
  padding: "1rem",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
};

const amountHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.75rem",
  paddingBottom: "0.75rem",
  borderBottom: "1px solid #2c3e50",
};

const amountTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.2rem",
  color: "#eaeaea",
  fontWeight: "bold",
};

const totalAmountStyle: CSSProperties = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: "#4cd137",
};

const amountBreakdownStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const amountItemStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.9rem",
  color: "#aaa",
};
