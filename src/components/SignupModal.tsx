import { useRef, useEffect, useState } from 'react';
import '../styles/Modal.css';

type Props = {
  onClose: () => void;
  onSwitchToLogin: () => void;
};

export default function SignupModal({ onClose, onSwitchToLogin }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerMobile: "",
    ownerPassword: "",
    ownerDob: "",
    ownerAddress: ""
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      ...form
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    alert("Signup successful!");
    onClose();
    window.dispatchEvent(new Event("user-login"));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={ref}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <input
              type="text"
              id="signup-name"
              name="ownerName"
              placeholder=" "
              value={form.ownerName}
              onChange={handleChange}
              required
            />
            <label htmlFor="signup-name">Name</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              id="signup-email"
              name="ownerEmail"
              placeholder=" "
              value={form.ownerEmail}
              onChange={handleChange}
              required
            />
            <label htmlFor="signup-email">Email</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              id="signup-mobileno"
              name="ownerMobile"
              placeholder=" "
              value={form.ownerMobile}
              onChange={handleChange}
              required
            />
            <label htmlFor="signup-mobileno">Mobile No.</label>
          </div>

          <div className="input-group">
            <input
              type="date"
              id="signup-dob"
              name="ownerDob"
              placeholder=" "
              value={form.ownerDob}
              onChange={handleChange}
              required
            />
            <label htmlFor="signup-dob">Date of Birth</label>
          </div>

          <div className="input-group" style={{ position: "relative" }}>
            <textarea
              id="signup-address"
              name="ownerAddress"
              placeholder=" "
              value={form.ownerAddress}
              onChange={handleChange}
              required
            />
            <label
              style={{
                position: "absolute",
                left: "0.75rem",
                top: form.ownerAddress ? "-0.5rem" : "1rem",
                fontSize: form.ownerAddress ? "0.75rem" : "0.8rem",
                color: form.ownerAddress ? "#1ab3f0" : "#aaa",
                background: form.ownerAddress ? "#181f2a" : "transparent",
                padding: "0 0.3rem",
                pointerEvents: "none",
                transition: "top 0.25s, font-size 0.25s, color 0.25s, background 0.25s",
                zIndex: 2,
              }}
            >
              Address
            </label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="signup-password"
              name="ownerPassword"
              placeholder=" "
              value={form.ownerPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="signup-password">Password</label>
          </div>

          <button type="submit">Register</button>
        </form>

        <div className="modal-footer">
          <p>
            Already a user?{" "}
            <button onClick={onSwitchToLogin} className="modal-link">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
