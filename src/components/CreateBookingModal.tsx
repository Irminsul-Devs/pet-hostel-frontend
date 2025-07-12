import { useRef, useEffect, useState } from "react";
import "../styles/Modal.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import type { Booking, BookingFormData } from "../types";
import type { CSSProperties } from "react";
import CustomerSelect from "./CustomerSelect";

// Define service prices
const SERVICE_PRICES = {
  Boarding: 35.0, // per day
  Grooming: 45.0, // flat fee
  Training: 50.0, // per session
  "Day Care": 25.0, // per day
};

type Props = {
  onClose: () => void;
  onCreate: (newBooking: Omit<Booking, "id">) => Promise<void>;
  userRole: "staff" | "admin" | "customer";
  userId: number;
};

type DateField = "petDob" | "bookingFrom" | "bookingTo";

const initialFormState: BookingFormData = {
  bookingDate: new Date().toISOString().split("T")[0],
  remarks: "",
  petName: "",
  petType: "",
  bookingFrom: "",
  bookingTo: "",
  services: [],
  petDob: "",
  petAge: "",
  petFood: "",
  vaccinationCertificate: null,
  petVaccinated: false,
  amount: 0.0,
  customerId: undefined,
};

export default function CreateBookingModal({
  onClose,
  onCreate,
  userRole,
  userId,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<BookingFormData>(initialFormState);
  const [error, setError] = useState("");
  const [petVaccinated, setPetVaccinated] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate pet age whenever petDob changes
  useEffect(() => {
    if (form.petDob) {
      const birthDate = new Date(form.petDob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      let ageString = "";
      if (age > 0) {
        ageString = `${age} year${age > 1 ? "s" : ""}`;
        const remainingMonths = today.getMonth() - birthDate.getMonth();
        if (remainingMonths > 0) {
          ageString += `, ${remainingMonths} month${
            remainingMonths > 1 ? "s" : ""
          }`;
        }
      } else {
        const months = Math.max(
          0,
          (today.getFullYear() - birthDate.getFullYear()) * 12 +
            (today.getMonth() - birthDate.getMonth())
        );
        ageString = `${months} month${months !== 1 ? "s" : ""}`;
      }

      setForm((prev) => ({ ...prev, petAge: ageString }));
    } else {
      setForm((prev) => ({ ...prev, petAge: "" }));
    }
  }, [form.petDob]);

  // Calculate amount whenever services or dates change
  useEffect(() => {
    let amount = 0;

    // Calculate boarding/day care based on days
    if (
      form.bookingFrom &&
      form.bookingTo &&
      (form.services.includes("Boarding") || form.services.includes("Day Care"))
    ) {
      const startDate = new Date(form.bookingFrom);
      const endDate = new Date(form.bookingTo);
      const days = Math.max(
        1,
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      if (form.services.includes("Boarding")) {
        amount += SERVICE_PRICES.Boarding * days;
      }
      if (form.services.includes("Day Care")) {
        amount += SERVICE_PRICES["Day Care"] * days;
      }
    }

    // Add flat-fee services
    if (form.services.includes("Grooming")) {
      amount += SERVICE_PRICES.Grooming;
    }
    if (form.services.includes("Training")) {
      amount += SERVICE_PRICES.Training;
    }

    setTotalAmount(amount);
    setForm((prev) => ({ ...prev, amount }));
  }, [form.services, form.bookingFrom, form.bookingTo]);

  // Close modal when clicking outside
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
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
        setForm((prev) => ({ ...prev, [name]: file }));
      }
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | null, field: DateField) => {
    if (field === "bookingTo" && date && form.bookingFrom) {
      // Ensure bookingTo date is not earlier than bookingFrom
      const fromDate = new Date(form.bookingFrom);
      if (date < fromDate) {
        alert("Booking end date cannot be earlier than start date");
        return;
      }
    }

    if (field === "bookingFrom" && date && form.bookingTo) {
      // If setting bookingFrom and we already have a bookingTo, validate it's not later
      const toDate = new Date(form.bookingTo);
      if (date > toDate) {
        // Two options: either clear the bookingTo or alert the user
        // Here we alert and don't allow the change
        alert("Booking start date cannot be later than end date");
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [field]: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const handleServiceChange = (service: string, isChecked: boolean) => {
    setForm((prev) => ({
      ...prev,
      services: isChecked
        ? [...prev.services, service]
        : prev.services.filter((s) => s !== service),
    }));
  };

  const convertFileToBase64 = (file: File | null): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateForm = (): boolean => {
    const requiredFields: Array<keyof BookingFormData> = [
      "petName",
      "petType",
      "bookingFrom",
      "bookingTo",
      "petDob",
      "petFood",
    ];

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
    if (petVaccinated && form.vaccinationCertificate) {
      // Check if it's a File object (during upload)
      const file = form.vaccinationCertificate as File;
      if (file && file.type && !file.type.match("application/pdf")) {
        setError("Only PDF files are allowed for vaccination certificate.");
        return false;
      }
    }

    return (
      requiredFields.every((field) => !!form[field]) && form.services.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    setError("");

    if (!validateForm()) {
      // Don't set a generic error here since validateForm may set specific errors
      if (!error) {
        setError("Please fill all required fields.");
      }
      return;
    }

    // Explicitly check for vaccination certificate if pet is vaccinated
    if (petVaccinated) {
      if (!form.vaccinationCertificate) {
        setError("Please upload a vaccination certificate.");
        alert("Please upload a vaccination certificate.");
        return;
      }

      // If it's a File object, validate it's a PDF
      const file = form.vaccinationCertificate as File;
      if (file && file.type && !file.type.match("application/pdf")) {
        setError("Only PDF files are allowed for vaccination certificate.");
        alert("Only PDF files are allowed. Please select a PDF file.");
        return;
      }
    }

    try {
      let vaccinationCertificate = null;
      // Only try to read file if it exists
      if (form.vaccinationCertificate) {
        // Log file size before conversion for debugging
        const file = form.vaccinationCertificate as File;
        console.log(
          `File size before conversion: ${(file.size / 1024).toFixed(2)}KB`
        );

        vaccinationCertificate = await convertFileToBase64(
          form.vaccinationCertificate
        );

        // Log base64 size after conversion
        if (vaccinationCertificate) {
          console.log(
            `Base64 size after conversion: ${(
              vaccinationCertificate.length / 1024
            ).toFixed(2)}KB`
          );
        }
      }

      const bookingData = {
        ...form,
        vaccinationCertificate,
        petVaccinated,
        userId,
        customerId: form.customerId || userId, // If no customer selected, user is booking for themselves
      };

      console.log("Submitting booking:", bookingData); // Debug log
      await onCreate(bookingData);

      setForm(initialFormState);
      setError("");
      alert("Booking created successfully!");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    }
  };

  const parseDate = (val: string) => (val ? new Date(val) : null);

  // Render functions for better organization
  const renderInputGroup = (
    name: keyof BookingFormData,
    label: string,
    type = "text",
    additionalProps: any = {}
  ) => (
    <div className="input-group">
      <input
        type={type}
        name={name}
        placeholder={label}
        required
        value={form[name] as string}
        onChange={handleChange}
        {...additionalProps}
      />
      <label>{label}</label>
    </div>
  );

  const renderDatePicker = (
    field: DateField,
    label: string,
    customFontSize?: { input?: string; label?: string }
  ) => (
    <div className="input-group" style={{ position: "relative" }}>
      <ReactDatePicker
        selected={parseDate(form[field])}
        onChange={(date) => handleDateChange(date, field)}
        dateFormat="yyyy-MM-dd"
        placeholderText={label}
        showYearDropdown
        scrollableYearDropdown
        dropdownMode="scroll"
        customInput={
          <input
            type="text"
            name={field}
            required
            placeholder={label}
            autoComplete="off"
            value={form[field]}
            onKeyDown={(e) => e.preventDefault()}
            style={{
              background: "#2a2a2a",
              color: "#eaf6fb",
              border: "1px solid #555",
              paddingRight: "2.2em",
              cursor: "pointer",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: customFontSize?.input || "inherit",
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
          top: form[field] ? "-0.5rem" : "1rem",
          fontSize: form[field]
            ? customFontSize?.label || "0.75rem"
            : customFontSize?.label || "0.7rem",
          color: form[field] ? "#1ab3f0" : "#aaa",
          background: form[field] ? "#181f2a" : "transparent",
          padding: "0 0.3rem",
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
        {label}
      </label>
    </div>
  );

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
              {/* Customer selection for staff users */}
              <CustomerSelect
                value={form.customerId}
                onChange={(customerId) =>
                  setForm((prev) => ({ ...prev, customerId }))
                }
                isStaff={userRole === "staff" || userRole === "admin"}
                currentUserId={userId}
              />

              {renderInputGroup("petName", "Pet Name")}

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

              <div style={{ width: "100%" }}>
                {renderDatePicker("petDob", "Pet Date of Birth")}
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
                    pointerEvents: "none",
                  }}
                />
                <label>Pet Age (Auto)</label>
              </div>
            </div>

            <div className="modal-form-col">
              <div style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
                <div
                  style={{
                    color: "#eaf6fb",
                    fontWeight: 500,
                    fontSize: "0.9em",
                    marginBottom: "0.5em",
                  }}
                >
                  Booking Date
                </div>
                <div style={{ display: "flex", gap: "1em", width: "100%" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {renderDatePicker("bookingFrom", "From", {
                      input: "1rem",
                      label: "0.8rem",
                    })}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {renderDatePicker("bookingTo", "To", {
                      input: "1rem",
                      label: "0.8rem",
                    })}
                  </div>
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
                  {["Boarding", "Grooming", "Training", "Day Care"].map(
                    (service) => (
                      <label key={service} style={serviceLabelStyle}>
                        <input
                          type="checkbox"
                          checked={form.services.includes(service)}
                          onChange={(e) =>
                            handleServiceChange(service, e.target.checked)
                          }
                          style={{
                            marginRight: "0.4em",
                            accentColor: "#1ab3f0",
                          }}
                        />
                        {service}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="input-group" style={{ position: "relative" }}>
                <textarea
                  name="petFood"
                  placeholder=""
                  required
                  value={form.petFood}
                  onChange={handleChange}
                  rows={2}
                />
                <label style={floatingLabelStyle(!!form.petFood)}>
                  Pet Food Habit
                </label>
              </div>
            </div>
          </div>

          {/* Pet Vaccinated Toggle */}
          <div className="pet-vaccinated-row" style={petVaccinatedRowStyle}>
            <span style={petVaccinatedLabelStyle}>Pet Vaccinated:</span>
            <label className="toggle-switch" style={{ minWidth: 0 }}>
              <input
                type="checkbox"
                checked={petVaccinated}
                onChange={() => setPetVaccinated((v) => !v)}
                style={{ display: "none" }}
              />
              <span className="slider"></span>
            </label>
            <span style={petVaccinatedStatusStyle(petVaccinated)}>
              {petVaccinated ? "Yes" : "No"}
            </span>
            <div style={{ flex: 1, minWidth: 0 }} />
            {petVaccinated && (
              <label style={uploadLabelStyle}>
                Upload Certificate:
                <input
                  type="file"
                  name="vaccinationCertificate"
                  accept=".pdf"
                  style={fileInputStyle}
                  onChange={handleChange}
                />
              </label>
            )}
          </div>

          {/* Total Amount Display */}
          <div style={amountContainerStyle}>
            <div style={amountHeaderStyle}>
              <h3 style={amountTitleStyle}>Booking Summary</h3>
              <div style={totalAmountStyle}>${totalAmount.toFixed(2)}</div>
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
            <label style={floatingLabelStyle(!!form.remarks)}>
              Remarks (Optional)
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn modal-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

// Style objects with proper typing
const serviceLabelStyle: CSSProperties = {
  fontWeight: 400,
  fontSize: "0.9em",
  display: "flex",
  alignItems: "center",
  gap: "0.3em",
  padding: "0.2em 0.7em",
  minWidth: 0,
  justifyContent: "flex-start",
};

const floatingLabelStyle = (hasValue: boolean): CSSProperties => ({
  position: "absolute",
  left: "0.75rem",
  top: hasValue ? "-0.5rem" : "1rem",
  fontSize: hasValue ? "0.75rem" : "0.8rem",
  color: hasValue ? "#1ab3f0" : "#aaa",
  background: hasValue ? "#181f2a" : "transparent",
  padding: "0 0.3rem",
  pointerEvents: "none",
  transition: "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
  zIndex: 2,
});

const petVaccinatedRowStyle: CSSProperties = {
  display: "flex",
  fontSize: "0.9em",
  alignItems: "center",
  margin: "1em 0 0.5em 0",
  gap: "1em",
  minWidth: 0,
};

const petVaccinatedLabelStyle: CSSProperties = {
  marginRight: "1em",
  color: "#eaf6fb",
  fontWeight: 500,
  minWidth: 0,
  whiteSpace: "nowrap",
};

const petVaccinatedStatusStyle = (isVaccinated: boolean): CSSProperties => ({
  marginLeft: "0.3em",
  color: isVaccinated ? "#1ab3f0" : "#aaa",
  fontWeight: 600,
  minWidth: 0,
  textAlign: "left",
  fontSize: "1em",
  userSelect: "none",
  transition: "color 0.2s",
  whiteSpace: "nowrap",
});

const uploadLabelStyle: CSSProperties = {
  color: "#ccc",
  fontSize: "1em",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "0.5em",
  whiteSpace: "nowrap",
  minWidth: 0,
};

const fileInputStyle: CSSProperties = {
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
};

// Styles for amount display
const amountContainerStyle: CSSProperties = {
  marginTop: "1.5rem",
  backgroundColor: "#222",
  borderRadius: "8px",
  border: "1px solid #333",
  padding: "1rem",
  overflow: "hidden",
};

const amountHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.8rem",
  borderBottom: "1px solid #444",
  paddingBottom: "0.5rem",
};

const amountTitleStyle: CSSProperties = {
  margin: 0,
  color: "#eaf6fb",
  fontSize: "1.1rem",
  fontWeight: 600,
};

const totalAmountStyle: CSSProperties = {
  color: "#3498db",
  fontWeight: 700,
  fontSize: "1.5rem",
  display: "flex",
  alignItems: "center",
};

const amountBreakdownStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const amountItemStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  color: "#ccc",
  fontSize: "0.9rem",
  padding: "0.2rem 0",
};
