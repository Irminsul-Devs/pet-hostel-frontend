import { useRef, useState } from "react";
import { MdDelete, MdCancel } from "react-icons/md";
import { IoMdWarning } from "react-icons/io";

type Props = {
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteBookingModal({ onCancel, onConfirm }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await onConfirm();
    } catch (err) {
      console.error("Delete booking error:", err);
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
        <button className="modal-close" onClick={onCancel} aria-label="Close">
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
          <IoMdWarning size={48} color="#ff1900ff" />
        </div>

        <h2
          style={{
            color: "#ff1900ff",
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
            color: "#333",
            lineHeight: "1.5",
          }}
        >
          Are you sure you want to delete this booking?
          <br />
          <span style={{ color: "#ff1900ff", fontWeight: "bold" }}>
            This action cannot be undone.
          </span>
        </p>

        {error && (
          <div
            className="error-text"
            style={{
              textAlign: "center",
              padding: "0.8rem",
              margin: "1rem 0",
              backgroundColor: "rgba(231, 76, 60, 0.2)",
              border: "1px solid #ff1900ff",
              borderRadius: "5px",
            }}
          >
            {error}
          </div>
        )}

        <div
          className="modal-button-group"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          <button
            onClick={onCancel}
            className="btn-cancel"
            disabled={isDeleting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.7rem 1.2rem",
              borderRadius: "5px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            <MdCancel size={18} />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn-danger"
            disabled={isDeleting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.7rem 1.2rem",
              borderRadius: "5px",
              backgroundColor: "#ff1900ff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "background-color 0.2s",
            }}
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <MdDelete size={18} />
                Yes, Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
