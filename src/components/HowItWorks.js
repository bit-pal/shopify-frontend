import React from 'react';
import './HowItWorks.css';

const steps = [
  {
    number: 1,
    title: 'Complete Assessment',
    desc: 'Answer questions about your health and medical history online.'
  },
  {
    number: 2,
    title: 'Doctor Review',
    desc: 'A licensed physician reviews your answers and creates a treatment plan if appropriate.'
  },
  {
    number: 3,
    title: 'Discreet Delivery',
    desc: 'Your medication is shipped directly to your door in discreet packaging.'
  }
];

const HowItWorks = () => (
  <section className="sxrx-hiw-section">
    <h2 className="sxrx-hiw-title">How It Works</h2>
    <p className="sxrx-hiw-subtitle">
      We've streamlined the process of getting the care you need - no waiting rooms, no awkward conversations.
    </p>
    <div className="sxrx-hiw-steps">
      {steps.map(step => (
        <div className="sxrx-hiw-card" key={step.number}>
          <div className="sxrx-hiw-step-circle">{step.number}</div>
          <div className="sxrx-hiw-step-title">{step.title}</div>
          <div className="sxrx-hiw-step-desc">{step.desc}</div>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks; 