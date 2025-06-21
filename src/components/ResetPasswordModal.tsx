import { useRef, useEffect } from 'react';
import '../styles/Modal.css';

type Props = {
  onClose: () => void;
  onBackToLogin: () => void;
};

export default function ResetPasswordModal({ onClose, onBackToLogin }: Props) {
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
        <h2>Reset Password</h2>
        <form>
          <div className="input-group">
            <input type="email" id="reset-email" placeholder=" " required />
            <label htmlFor="reset-email">Email</label>
          </div>

          <button type="submit">Send Reset Link</button>
        </form>
        <div className="modal-footer">
          <p>
            <button onClick={onBackToLogin} className="modal-link">Back to Login</button>
          </p>
        </div>
      </div>
    </div>
  );
}
