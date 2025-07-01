import { useEffect, useRef, useState } from "react";

type Props = {
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteBookingModal({ onCancel, onConfirm }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onCancel();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

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
      <div className="modal" ref={ref}>
        <button className="modal-close" onClick={onCancel} aria-label="Close">
          ✕
        </button>
        <h2 style={{ color: "#e74c3c" }}>Delete Confirmation</h2>

        <p className="modal-text">
          Are you sure you want to delete this booking? This action cannot be undone.
        </p>

        {error && <div className="error-text">{error}</div>}

        <div className="modal-button-group">
          <button
            type="button"
            onClick={handleDelete}
            className="btn-danger"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            onClick={onCancel}
            className="btn-cancel"
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}