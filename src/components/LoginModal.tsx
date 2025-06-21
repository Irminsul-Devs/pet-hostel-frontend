import { useRef, useEffect } from 'react';
import '../styles/Modal.css';

type Props = {
  onClose: () => void;
  onSwitchToSignup: () => void;
  onSwitchToReset: () => void;
};

export default function LoginModal({ onClose, onSwitchToSignup, onSwitchToReset }: Props) {
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
        <h2>Login</h2>
        <form>
          <div className="input-group">
            <input type="email" id="login-email" placeholder="Email" required />
            <label htmlFor="login-email">Email</label>
          </div>

          <div className="input-group">
            <input type="password" id="login-password" placeholder="Password" required />
            <label htmlFor="login-password">Password</label>
          </div>

          <div className="forgot-password">
            <button type="button" onClick={onSwitchToReset} className="modal-link">Forgot Password?</button>
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="modal-footer">
          <p>
            New user? <button onClick={onSwitchToSignup} className="modal-link">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
}
