import { useEffect, useRef } from "react";
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal booking-info-modal" ref={ref}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 className="modal-title">Booking Details</h2>
        
        <div className="booking-details-grid">
          <div className="detail-item">
            <span className="detail-label">Booking Date:</span>
            <span className="detail-value">{booking.bookingDate || "Empty"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Client Name:</span>
            <span className="detail-value">{booking.name || "N/A"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Mobile:</span>
            <span className="detail-value">{booking.mobile || "N/A"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{booking.email || "N/A"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Remarks:</span>
            <span className="detail-value">{booking.remarks || "None"}</span>
          </div>
          {/* Add more fields as needed */}
        </div>
      </div>
    </div>
  );
}