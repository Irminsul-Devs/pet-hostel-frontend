import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import ResetPasswordModal from './ResetPasswordModal';
import '../styles/Navbar.css';

export default function Navbar() {
  const [modal, setModal] = useState<'login' | 'signup' | 'reset' | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Update user state on login/logout and on storage change (multi-tab)
  useEffect(() => {
    const updateUser = () => {
      const saved = localStorage.getItem('user');
      setUser(saved ? JSON.parse(saved) : null);
    };
    updateUser();
    window.addEventListener('storage', updateUser);
    window.addEventListener('user-login', updateUser); // Listen for custom event
    return () => {
      window.removeEventListener('storage', updateUser);
      window.removeEventListener('user-login', updateUser); // Clean up
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  // Set home link based on user role
  let homeLink = '/';
  if (user?.role === 'staff') homeLink = '/staff-dashboard';
  // Add more roles if needed

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          {/* Only show Home for staff, not Dashboard */}
          <NavLink
            to={homeLink}
            end
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Home
          </NavLink>
          {/* Only show About/Contact if not logged in */}
          {!user && (
            <>
              <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>About Us</NavLink>
              <NavLink to="/contact" className={({ isActive }) => isActive ? 'active-link' : ''}>Contact Us</NavLink>
            </>
          )}
        </div>
        <div className="navbar-right">
          {user?.role === 'staff' && (
            <button
              className="btn create-booking-btn"
              style={{ marginRight: '0.5rem' }}
              onClick={() => window.dispatchEvent(new CustomEvent("open-create-booking"))}
            >
              + Create Booking
            </button>
          )}
          {!user ? (
            <>
              <button onClick={() => setModal('login')} className="btn login-btn">Login</button>
              <button onClick={() => setModal('signup')} className="btn signup-btn">Sign up</button>
            </>
          ) : (
            <button onClick={handleLogout} className="btn login-btn">Logout</button>
          )}
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
