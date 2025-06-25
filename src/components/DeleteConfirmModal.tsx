import React, { useEffect, useRef } from "react";
// import "../styles/Modal.css";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmModal({ onConfirm, onCancel }: Props) {
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

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={ref}>
        <button className="modal-close" onClick={onCancel}>
          ✕
        </button>
        <h2>Delete Confirmation</h2>

        <p style={{ textAlign: "center", color: "#ccc", marginBottom: "1rem" }}>
          Are you sure you want to delete this?
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1em" }}>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              backgroundColor: "#0eb2f2",
              color: "black",
              padding: "0.75rem 1.2rem",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
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
              transition: "background-color 0.3s ease",
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
