import React, { useRef, useEffect } from "react";

type Booking = {
  id: number;
  bookingDate: string;
  name: string;
  mobile: string;
  email: string;
  remarks: string;
  // Add other fields as needed
};

export default function BookingInfoModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
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

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={ref} style={{ minWidth: 320, maxWidth: 420 }}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 style={{ color: "#1ab3f0", marginBottom: "1em" }}>
          Booking Details
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
          <div>
            <label style={{ color: "#aaa" }}>Booking Date:</label>
            <div style={{ color: "#eaf6fb" }}>{booking.bookingDate}</div>
          </div>
          <div>
            <label style={{ color: "#aaa" }}>Name:</label>
            <div style={{ color: "#eaf6fb" }}>{booking.name}</div>
          </div>
          <div>
            <label style={{ color: "#aaa" }}>Mobile:</label>
            <div style={{ color: "#eaf6fb" }}>{booking.mobile}</div>
          </div>
          <div>
            <label style={{ color: "#aaa" }}>Email:</label>
            <div style={{ color: "#eaf6fb" }}>{booking.email}</div>
          </div>
          <div>
            <label style={{ color: "#aaa" }}>Remarks:</label>
            <div style={{ color: "#eaf6fb" }}>{booking.remarks}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
