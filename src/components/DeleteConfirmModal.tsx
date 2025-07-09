import { useEffect, useRef } from "react";

type Props = {
  staffId: number;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmModal({ staffId, onSuccess, onCancel }: Props) {
  const ref = useRef<HTMLDivElement>(null);

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
    try {
      const res = await fetch(`http://localhost:5000/api/auth/delete-staff/${staffId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to delete staff");
        return;
      }

      alert("Staff deleted successfully");
      onSuccess(); // Refresh staff list in parent
    } catch (err) {
      console.error("Delete staff error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={ref}>
        <button className="modal-close" onClick={onCancel}>✕</button>
        <h2>Delete Confirmation</h2>

        <p style={{ textAlign: "center", color: "#ccc", marginBottom: "1rem" }}>
          Are you sure you want to delete this?
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1em" }}>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              backgroundColor: "#e74c3c",
              color: "#fff",
              padding: "0.75rem 1.2rem",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: "#0eb2f2",
              color: "black",
              padding: "0.75rem 1.2rem",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}