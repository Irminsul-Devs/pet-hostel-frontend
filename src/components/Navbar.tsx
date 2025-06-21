import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import ResetPasswordModal from './ResetPasswordModal';
import '../styles/Navbar.css';

export default function Navbar() {
  const [modal, setModal] = useState<'login' | 'signup' | 'reset' | null>(null);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active-link' : ''}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>About Us</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active-link' : ''}>Contact Us</NavLink>
        </div>
        <div className="navbar-right">
          <button onClick={() => setModal('login')} className="btn login-btn">Login</button>
          <button onClick={() => setModal('signup')} className="btn signup-btn">Sign up</button>
        </div>
      </nav>

      {modal === 'login' && (
        <LoginModal
          onClose={() => setModal(null)}
          onSwitchToSignup={() => setModal('signup')}
          onSwitchToReset={() => setModal('reset')}
        />
      )}
      {modal === 'signup' && (
        <SignupModal
          onClose={() => setModal(null)}
          onSwitchToLogin={() => setModal('login')}
        />
      )}
      {modal === 'reset' && (
        <ResetPasswordModal
          onClose={() => setModal(null)}
          onBackToLogin={() => setModal('login')}
        />
      )}
    </>
  );
}
