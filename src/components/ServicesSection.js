import React from 'react';
import './ServicesSection.css';

const services = [
  {
    title: "Women's Health",
    desc: 'Treatments for birth control, UTIs, skincare, and more',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    btn: true
  },
  {
    title: "Men's Health",
    desc: 'Treatments for ED, hair loss, skincare, and more',
    img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    btn: true
  },
  {
    title: 'Mental Health',
    desc: 'Treatments for anxiety, depression, and insomnia',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    btn: false,
    note: 'Not available in California'
  }
];

const ServicesSection = () => (
  <section className="sxrx-services-section">
    <h2 className="sxrx-services-title">Explore Our Services</h2>
    <p className="sxrx-services-subtitle">
      Get the care you need, when you need it. Browse our treatment categories.
    </p>
    <div className="sxrx-services-cards">
      {services.map((service, idx) => (
        <div
          className={`sxrx-service-card${!service.btn ? ' sxrx-service-card-disabled' : ''}`}
          key={service.title}
        >
          <img src={service.img} alt={service.title} className="sxrx-service-img" />
          <div className="sxrx-service-content">
            <div className="sxrx-service-title">{service.title}</div>
            <div className="sxrx-service-desc">{service.desc}</div>
            {service.btn ? (
              <button className="sxrx-service-btn">Explore Options</button>
            ) : (
              <div className="sxrx-service-note">⚠️ {service.note}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ServicesSection; 