import { useRef, useEffect } from 'react';
import '../styles/Modal.css';

type Props = {
  onClose: () => void;
  onSwitchToLogin: () => void;
};

export default function SignupModal({ onClose, onSwitchToLogin }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={ref}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Sign Up</h2>
        <form>
          <div className="input-group">
            <input type="text" id="signup-name" placeholder=" " required />
            <label htmlFor="signup-name">Name</label>
          </div>

          <div className="input-group">
            <input type="email" id="signup-email" placeholder=" " required />
            <label htmlFor="signup-email">Email</label>
          </div>

          <div className="input-group">
            <input type="text" id="signup-mobileno" placeholder=" " required />
            <label htmlFor="signup-mobileno">Mobile No.</label>
          </div>
          
          <div className="input-group">
            <input type="text" id="signup-username" placeholder=" " required />
            <label htmlFor="signup-username">Username</label>
          </div>

          <div className="input-group">
            <input type="password" id="signup-password" placeholder=" " required />
            <label htmlFor="signup-password">Password</label>
          </div>

          <button type="submit">Register</button>
        </form>
        <div className="modal-footer">
          <p>
            Already a user? <button onClick={onSwitchToLogin} className="modal-link">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
