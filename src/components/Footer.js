import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="sxrx-footer">
    <div className="sxrx-footer-content">
      <div className="sxrx-footer-col sxrx-footer-brand">
        <div className="sxrx-footer-logo">SXRX <span>Health</span></div>
        <div className="sxrx-footer-desc">
          Modern healthcare, delivered conveniently<br />
          and discreetly to your door.
        </div>
      </div>
      <div className="sxrx-footer-col">
        <div className="sxrx-footer-col-title">Services</div>
        <Link to="/womens-health">Women's Health</Link>
        <Link to="/mens-health">Men's Health</Link>
        <Link to="/mental-health">Mental Health</Link>
      </div>
      <div className="sxrx-footer-col">
        <div className="sxrx-footer-col-title">Company</div>
        <a href="#">About Us</a>
        <a href="#">How It Works</a>
        <a href="#">Our Doctors</a>
      </div>
      <div className="sxrx-footer-col">
        <div className="sxrx-footer-col-title">Legal</div>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">HIPAA Compliance</a>
      </div>
    </div>
    <div className="sxrx-footer-divider" />
    <div className="sxrx-footer-copyright">
      © 2025 SXRX Health. All rights reserved.
    </div>
  </footer>
);

export default Footer; 