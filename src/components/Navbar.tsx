import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
      <div className="navbar-right">
        <Link to="/login">Login</Link>
        <Link to="/register">Signup</Link>
      </div>
    </nav>
  );
}
