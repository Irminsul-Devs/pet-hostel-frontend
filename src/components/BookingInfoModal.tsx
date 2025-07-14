import { useEffect, useRef } from "react";
import {
  MdPets,
  MdPerson,
  MdPhone,
  MdEmail,
  MdCalendarToday,
  MdDescription,
} from "react-icons/md";
import { FaFileDownload, FaFileAlt } from "react-icons/fa";
import type { Booking } from "../types";

type Props = {
  booking: Booking;
  onClose: () => void;
};

export default function BookingInfoModal({ booking, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const formatDate = (dateString: string, includeTime: boolean = false) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...(includeTime && {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const renderVaccinationCertificate = () => {
    if (!booking.vaccinationCertificate) {
      return (
        <div className="no-certificate">
          <FaFileAlt size={24} style={{ opacity: 0.5, marginRight: "8px" }} />
          <span>No certificate uploaded</span>
        </div>
      );
    }

    // Check if it's a base64 encoded PDF
    if (
      booking.vaccinationCertificate.startsWith("data:application/pdf;base64,")
    ) {
      return (
        <div
          className="pdf-viewer-container"
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <iframe
            src={booking.vaccinationCertificate}
            width="100%"
            height="400px"
            title="Vaccination Certificate"
            className="pdf-iframe"
            style={{ border: "none" }}
          />
          <a
            href={booking.vaccinationCertificate}
            download="vaccination_certificate.pdf"
            className="download-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#1ab3f0",
              color: "#fff",
              padding: "10px",
              textDecoration: "none",
              borderRadius: "0 0 8px 8px",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
          >
            <FaFileDownload size={16} />
            Download Certificate
          </a>
        </div>
      );
    }

    // Fallback for other file types or plain text
    return (
      <div
        className="certificate-available"
        style={{ display: "flex", alignItems: "center", color: "#1ab3f0" }}
      >
        <FaFileAlt size={24} style={{ marginRight: "8px" }} />
        <span>Certificate available (non-PDF format)</span>
      </div>
    );
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal booking-info-modal"
        ref={ref}
        style={{
          maxWidth: "800px",
          backgroundColor: "#222",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
        }}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
          style={{
            fontSize: "1.6rem",
            top: "15px",
            right: "20px",
          }}
        >
          ✕
        </button>

        <h2
          className="modal-title"
          style={{
            fontSize: "1.8rem",
            color: "#1ab3f0",
            textAlign: "center",
            marginBottom: "1.8rem",
            borderBottom: "2px solid #333",
            paddingBottom: "1rem",
          }}
        >
          Booking Details
        </h2>

        <div
          className="booking-info-sections"
          style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
        >
          {/* Owner & Booking Info Section */}
          <div className="info-section">
            <h3
              style={{
                fontSize: "1.4rem",
                color: "#eaeaea",
                marginBottom: "1rem",
                borderBottom: "1px solid #333",
                paddingBottom: "0.5rem",
              }}
            >
              Booking Information
            </h3>

            <div
              className="booking-details-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdCalendarToday
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Booking Date
                  </div>
                  <div
                    className="detail-value"
                    style={{ fontSize: "1.1rem", color: "#eaeaea" }}
                  >
                    {formatDate(booking.bookingDate, false) || "Empty"}
                  </div>
                </div>
              </div>

              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdCalendarToday
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Booking Period
                  </div>
                  <div
                    className="detail-value"
                    style={{ fontSize: "1.1rem", color: "#eaeaea" }}
                  >
                    {formatDate(booking.bookingFrom).split(",")[0]} -{" "}
                    {formatDate(booking.bookingTo).split(",")[0]}
                  </div>
                </div>
              </div>

              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdPerson
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Customer
                  </div>
                  <div
                    className="detail-value"
                    style={{ fontSize: "1.1rem", color: "#eaeaea" }}
                  >
                    {booking.customer?.name || "N/A"}
                  </div>
                </div>
              </div>

              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdPhone
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Contact
                  </div>
                  <div
                    className="detail-value"
                    style={{ fontSize: "1.1rem", color: "#eaeaea" }}
                  >
                    {booking.customer?.mobile || "N/A"}
                  </div>
                </div>
              </div>

              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdEmail
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Email
                  </div>
                  <div
                    className="detail-value"
                    style={{
                      fontSize: "1.1rem",
                      color: "#eaeaea",
                      wordBreak: "break-word",
                    }}
                  >
                    {booking.customer?.email || "N/A"}
                  </div>
                </div>
              </div>

              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdDescription
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Services
                  </div>
                  <div
                    className="detail-value"
                    style={{ fontSize: "1.1rem", color: "#eaeaea" }}
                  >
                    {booking.services && booking.services.length > 0
                      ? booking.services.join(", ")
                      : "No services selected"}
                  </div>
                </div>
              </div>

              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdDescription
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Total Amount
                  </div>
                  <div
                    className="detail-value"
                    style={{
                      fontSize: "1.1rem",
                      color: "#4cd137",
                      fontWeight: "600",
                    }}
                  >
                    $
                    {(() => {
                      console.log(
                        "BookingInfoModal amount:",
                        booking.amount,
                        typeof booking.amount
                      );
                      let amount = 0;
                      if (
                        booking.amount !== undefined &&
                        booking.amount !== null
                      ) {
                        amount =
                          typeof booking.amount === "string"
                            ? parseFloat(booking.amount)
                            : Number(booking.amount);

                        if (isNaN(amount)) amount = 0;
                      }
                      return amount.toFixed(2);
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pet Information Section */}
          <div className="info-section">
            <h3
              style={{
                fontSize: "1.4rem",
                color: "#eaeaea",
                marginBottom: "1rem",
                borderBottom: "1px solid #333",
                paddingBottom: "0.5rem",
              }}
            >
              Pet Information
            </h3>

            <div
              className="booking-details-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdPets
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Pet Name
                  </div>
                  <div
                    className="detail-value"
                    style={{ fontSize: "1.1rem", color: "#eaeaea" }}
                  >
                    {booking.petName || "N/A"}
                  </div>
                </div>
              </div>

              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdPets
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Pet Type
                  </div>
                  <div
                    className="detail-value"
                    style={{ fontSize: "1.1rem", color: "#eaeaea" }}
                  >
                    {booking.petType || "N/A"}
                  </div>
                </div>
              </div>

              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdPets
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Pet Age
                  </div>
                  <div
                    className="detail-value"
                    style={{ fontSize: "1.1rem", color: "#eaeaea" }}
                  >
                    {booking.petAge || "N/A"}
                  </div>
                </div>
              </div>

              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdPets
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Vaccinated
                  </div>
                  <div
                    className="detail-value"
                    style={{
                      fontSize: "1.1rem",
                      color: booking.petVaccinated ? "#4cd137" : "#e74c3c",
                      fontWeight: "500",
                    }}
                  >
                    {booking.petVaccinated ? "Yes" : "No"}
                  </div>
                </div>
              </div>

              <div
                className="detail-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdPets
                  size={20}
                  color="#1ab3f0"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <div
                    className="detail-label"
                    style={{ fontSize: "0.9rem", color: "#888" }}
                  >
                    Pet Food Habit
                  </div>
                  <div
                    className="detail-value"
                    style={{
                      fontSize: "1.1rem",
                      color: "#eaeaea",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {booking.petFood || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            {booking.remarks && (
              <div
                className="remarks-section"
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  backgroundColor: "#282828",
                  borderRadius: "8px",
                  border: "1px solid #333",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <MdDescription
                    size={20}
                    color="#1ab3f0"
                    style={{ marginRight: "10px" }}
                  />
                  <div
                    className="detail-label"
                    style={{ fontSize: "1rem", color: "#aaa" }}
                  >
                    Remarks
                  </div>
                </div>
                <div
                  className="detail-value"
                  style={{
                    fontSize: "1.1rem",
                    color: "#eaeaea",
                    whiteSpace: "pre-line",
                    lineHeight: "1.4",
                  }}
                >
                  {booking.remarks || "None"}
                </div>
              </div>
            )}
          </div>

          {/* Vaccination Certificate Section */}
          {booking.vaccinationCertificate && (
            <div className="info-section">
              <h3
                style={{
                  fontSize: "1.4rem",
                  color: "#eaeaea",
                  marginBottom: "1rem",
                  borderBottom: "1px solid #333",
                  paddingBottom: "0.5rem",
                }}
              >
                Vaccination Certificate
              </h3>
              {renderVaccinationCertificate()}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#1ab3f0",
              border: "none",
              borderRadius: "5px",
              color: "white",
              padding: "10px 20px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
