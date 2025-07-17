import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="sxrx-hero">
      <div className="sxrx-hero-left">
        <h1 className="sxrx-hero-title">
          Healthcare <span className="sxrx-hero-title-blue">Simplified</span>, Just for You
        </h1>
        <p className="sxrx-hero-desc">
          Quality prescriptions from licensed doctors, discreetly delivered to your door.
        </p>
        <div className="sxrx-hero-actions">
          <select className="sxrx-hero-select">
            <option>California</option>
            <option>Texas</option>
          </select>
          <button className="sxrx-hero-btn">Get Started <span className="sxrx-hero-btn-arrow">→</span></button>
        </div>
        <div className="sxrx-hero-tags">
          <span className="sxrx-hero-tag"><span className="sxrx-hero-tag-icon">&#128104;&#8205;&#127891;</span> Licensed Doctors</span>
          <span className="sxrx-hero-tag"><span className="sxrx-hero-tag-icon">&#128274;</span> Secure & Private</span>
        </div>
      </div>
      <div className="sxrx-hero-right">
        <img
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          alt="Doctors"
          className="sxrx-hero-img"
        />
      </div>
    </section>
  );
};

export default HeroSection; 