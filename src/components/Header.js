import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sxrx-header">
      <div className="sxrx-header-left">
        <Link to="/" className="sxrx-logo"><span className="sxrx-logo-blue">SXRX</span>Health</Link>
        <nav className="sxrx-nav">
          {/* Show links based on user role */}
          {user && (user.role === 'patient' || user.role === 'admin') && (
            <Link to="/womens-health" className="sxrx-nav-link">Women's Health</Link>
          )}
          {user && (user.role === 'patient' || user.role === 'admin') && (
            <Link to="/mens-health" className="sxrx-nav-link">Men's Health</Link>
          )}
          {user && (user.role === 'patient' || user.role === 'admin') && (
            <Link to="/mental-health" className="sxrx-nav-link">Mental Health</Link>
          )}
          {user && (
            <Link to="/video-consultation" className="sxrx-nav-link sxrx-video-btn">Video Consultation</Link>
          )}
          {user && (user.role === 'doctor' || user.role === 'admin') && (
            <Link to="/doctor/calendar" className="sxrx-nav-link">My Calendar</Link>
          )}
          {user && (user.role === 'patient' || user.role === 'admin') && (
            <Link to="/book-appointment" className="sxrx-nav-link">Book Appointment</Link>
          )}
          {user && (user.role === 'patient' || user.role === 'admin') && (
            <Link to="/products" className="sxrx-nav-link">Products</Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/doctor-management" className="sxrx-nav-link">Doctor Management</Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/user-management" className="sxrx-nav-link">User Management</Link>
          )}
        </nav>
      </div>
      <div className="sxrx-header-right">
        {user && <span className="sxrx-state">{user.state}</span>}
        <span className="sxrx-icon" title="Favorites">&#9825;</span>
        <span className="sxrx-icon" title="Cart">&#128722;</span>
        {user ? (
          <button onClick={logout} className="sxrx-logout-btn">Logout</button>
        ) : (
          <span className="sxrx-account">Account <span className="sxrx-account-arrow">▼</span></span>
        )}
      </div>
    </header>
  );
};

export default Header; 