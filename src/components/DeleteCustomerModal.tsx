import { useRef, useState } from "react";
import { MdCancel } from "react-icons/md";
import { IoMdWarning } from "react-icons/io";
import "../styles/Modal.css";

interface DeleteCustomerModalProps {
  customerName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteCustomerModal({
  customerName,
  onClose,
  onConfirm,
}: DeleteCustomerModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  // Modal closing on outside click has been intentionally removed to prevent accidental closes of deletion dialog

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await onConfirm();
    } catch (err) {
      console.error("Delete customer error:", err);
      setError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal delete-confirmation-modal"
        ref={ref}
        style={{ maxWidth: "450px" }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div
          className="delete-warning-icon"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0.5rem 0",
            width: "100%",
          }}
        >
          <IoMdWarning size={48} color="#e74c3c" />
        </div>

        <h2
          style={{
            color: "#e74c3c",
            marginTop: "0.5rem",
            fontSize: "1.8rem",
            textAlign: "center",
          }}
        >
          Delete Confirmation
        </h2>

        <p
          className="modal-text"
          style={{
            textAlign: "center",
            fontSize: "1.1rem",
            margin: "1.5rem 0",
            color: "#eaeaea",
            lineHeight: "1.5",
          }}
        >
          Are you sure you want to delete this customer "{customerName}"?
          <br />
          <span style={{ color: "#e74c3c", fontWeight: "bold" }}>
            This action cannot be undone.
          </span>
          <br />
          <span style={{ fontSize: "0.9rem", color: "#888" }}>
            The customer can only be deleted if they have no active or future
            bookings.
          </span>
        </p>

        {error && (
          <div className="error-message" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <div
          className="modal-actions"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <button
            onClick={onClose}
            className="cancel-button"
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              background: "transparent",
              border: "2px solid #666",
              color: "#eaeaea",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <MdCancel size={20} />
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="delete-button"
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              background: "#e74c3c",
              border: "none",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <IoMdWarning size={20} />
            {isDeleting ? "Deleting..." : "Delete Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}
