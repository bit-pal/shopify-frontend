import React from 'react';
import './WhyChooseSection.css';

const features = [
  {
    icon: '🩺',
    title: 'Licensed Healthcare Providers',
    desc: 'Our network of board-certified physicians ensure you receive the highest quality care.'
  },
  {
    icon: '🔒',
    title: 'Privacy Focused',
    desc: 'Your information is protected with industry-leading security and privacy practices.'
  },
  {
    icon: '⏱️',
    title: 'Convenient & Fast',
    desc: 'Complete your consultation in minutes and receive your treatment quickly.'
  }
];

const testimonials = [
  {
    name: 'Sarah K.',
    text: 'The process was so simple and discreet. I received my prescription quickly and the doctor was very thorough.'
  },
  {
    name: 'Michael T.',
    text: 'I was skeptical at first, but the consultation was professional and the medication worked perfectly. Will use again!'
  }
];

const WhyChooseSection = () => (
  <section className="sxrx-why-section">
    <div className="sxrx-why-left">
      <h2 className="sxrx-why-title">Why Choose SXRX Health?</h2>
      <ul className="sxrx-why-features">
        {features.map((f, i) => (
          <li className="sxrx-why-feature" key={f.title}>
            <span className="sxrx-why-feature-icon">{f.icon}</span>
            <div>
              <div className="sxrx-why-feature-title">{f.title}</div>
              <div className="sxrx-why-feature-desc">{f.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="sxrx-why-right">
      <div className="sxrx-why-testimonials-box">
        <div className="sxrx-why-testimonials-title">What Our Patients Say</div>
        {testimonials.map((t, i) => (
          <div className="sxrx-why-testimonial" key={t.name}>
            <div className="sxrx-why-stars">{'★★★★★'.split('').map((s, idx) => (
              <span key={idx} className="sxrx-why-star">★</span>
            ))}</div>
            <span className="sxrx-why-testimonial-name">{t.name}</span>
            <div className="sxrx-why-testimonial-text">"{t.text}"</div>
          </div>
        ))}
        <a href="#" className="sxrx-why-testimonials-link">Read More Testimonials</a>
      </div>
    </div>
  </section>
);

export default WhyChooseSection; 