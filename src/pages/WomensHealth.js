import React, { useState, useRef, useEffect } from 'react';
import './WomensHealth.css';
import { saveQuestionnaire } from '../services/questionnaireService';
import { createPaymentLink } from '../services/paymentService';
const doctorInfo = {
  provider: 'Dr. Xavier Munoz, DO',
  address: '935 Sunland Park Dr #104, El Paso, TX 79922',
  phone: '(855) 671-5365',
  email: 'drmunoz@sxrx.com',
};

const steps = [
  'Doctor Info',
  'Personal Information',
  'Medical History',
  'Lifestyle Information',
  'Specific Concerns or Symptoms',
  'Previous Treatments',
  'Goals for Treatment',
  'Preferences for Treatment Options',
  'Discussed with Provider',
  'High-Risk Conditions',
  'Additional Comments',
  'Consent & Disclosure',
];

const initialForm = {
  // Personal Info
  fullName: '',
  dob: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  // Medical History
  allergies: '',
  allergiesNote: '',
  medications: '',
  medicationsNote: '',
  chronicConditions: '',
  surgeries: '',
  surgeriesNote: '',
  familyHistory: '',
  familyHistoryNote: '',
  // Lifestyle
  smoke: '',
  smokeFreq: '',
  alcohol: '',
  alcoholFreq: '',
  exercise: '',
  // Treatment-Specific
  concerns: [],
  concernsOther: '',
  prevTreatments: '',
  prevTreatmentsNote: '',
  goals: [],
  goalsOther: '',
  preferences: [],
  preferencesOther: '',
  discussedProvider: '',
  highRisk: [],
  // Additional Comments
  comments: '',
  // Consent
  agree: '',
  signature: '',
  date: '',
  // Red flag fields
  mentalHealthDiagnoses: '',
  substanceAbuse: '',
  mentalHealthHospitalization: '',
  mentalHealthMedications: '',
  thoughtsOfHarm: '',
  recreationalDrugs: '',
};

const concernOptions = [
  'Sexual health issues',
  'Hormonal imbalances',
  'Weight management',
  'Menstrual issues',
  'Other',
];
const goalOptions = [
  'Improve sexual health',
  'Manage hormonal balance',
  'Weight loss',
  'Alleviate menstrual symptoms',
  'Other',
];
const preferenceOptions = [
  'Oral medications',
  'Topical treatments',
  'Injections',
  'Other',
];
const highRiskOptions = [
  'History of Blood Clots or Stroke',
  'Heart Conditions',
  'Cancer',
  'Liver or Gallbladder Issues',
  'High Blood Pressure',
  'Clinical Obesity',
  'Nothing'
];
const purchaseOptions = [
  {
    id: 1,
    title: "Defense DoxyPrep:Doxycycline",
    description: "Protect yourself from sexually transmitted infections (STIs) with this comprehensive defense plan. Includes Doxycycline, a powerful antibiotic that helps prevent infections and supports overall health.",
    benefit: ["Supports sexual health and peace of mind", "Easy oral administration", "Affordable protection"],
    price: "$59.00"
  },
  {
    id: 2,
    title: "Skincare: Ultimate Radiance Complex",
    description: "Achieve a youthful glow with our Ultimate Radiance Complex, targeting fine liines and uneven tone",
    benefit: ["Reduces signs of aging", "Improves skin texture and clarity", "Hydrates and nourishes for a radiant look"],
    price: "$79.00"
  },
  {
    id: 3,
    title: "Testosterone Replacement Therapy (TRT)",
    description: "Revitalize your life with our TRT, tailored to help you regain energy and vitality",
    benefit: ["Boosts energy and mood", "Supports muscle health and performance", "Personalized treatment options"],
    price: "$149.00"
  },
  {
    id: 4,
    title: "Safeguard PrEP: Descovy",
    description: "Stay safe while enjoying intimacy with Descovy, a proven solution for HIV prevention",
    benefit: ["Highly effective in preventing HIV transmission", "Convenient options for daily use", "Peace of mind for your relationships"],
    price: "$120.00"
  },
  {
    id: 5,
    title: "Premature Ejaculation Solutions: Peak Performance",
    description: "Struggling with premature ejaculation? Our Peak Performance treatment with Lexapro and Dapoxetine is designed for effective management.",
    benefit: [
      "Increases control and satisfaction",
      "Reduces performance anxiety",
      "Supports emotional connection with partners"
    ],
    price: "$89.00"
  },
  {
    id: 6,
    title: "Skincar: Shield & Protect Antioxidant Sunscreen",
    description: "Protect your skin with our Shield & Protect sunscreen, infused with antioxidants for maximum protection.",
    benefit: [
      "Broad spectrum UV protection",
      "Lightweight and non-greasy formula",
      "Essential for daily skincare"
    ],
    price: "$39.00"
  },
  {
    id: 7,
    title: "Sexual Performance Enhancement: Power Performance Pack (Nasal Spray)",
    description: "Want a quick and effective boost? Our nasal spray combines Cialis and Viagra for fast-acting results.",
    benefit: [
      "Rapid absorption for immediate effects",
      "Discreet and easy to use",
      "Boosts confidence in intimate moments"
    ],
    price: "$109.00"
  },
  {
    id: 8,
    title: "Sexual Performance Enhancement: Power Performance Pack (Oral)",
    description: "Tired of performance anxiety? Our Power Performance Pack combines Cialis and Viagra with Oxytocin to help you reclaim your confidence in the bedroom.",
    benefit: [
      "Reliable treatment for erectile dysfunction",
      "Enhanced intimacy and emotional connection",
      "Convenient delivery to your door"
    ],
    price: "$99.00"
  },
  {
    id: 9,
    title: "Skincare: Renewal Glycolic Exfoliating Lotion",
    description: "Refresh your skin with our Renewal Glycolic Exfoliating Lotion, designed to improve texture and clarity.",
    benefit: [
      "Promotes cell turnover for healthier skin",
      "Brightens and smooths complexion",
      "Easy to incorporate into your routine"
    ],
    price: "$49.00"
  },
  {
    id: 10,
    title: "Men's Request a Consultation",
    description: "Schedule a consultation with our healthcare providers to discuss your unique health needs and receive personalized care.",
    benefit: [],
    price: "$120.00"
  }
  // ... up to 10 options
];
function WomensHealth() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [checkboxError, setCheckboxError] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const LS_FORM_KEY = 'womensHealthForm';
  const LS_STEP_KEY = 'womensHealthStep';
  
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({
        ...f,
        [name]: checked
          ? [...(f[name] || []), value]
          : (f[name] || []).filter(v => v !== value),
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };
  useEffect(() => {
    const savedForm = localStorage.getItem(LS_FORM_KEY);
    const savedStep = localStorage.getItem(LS_STEP_KEY);
    if (savedForm) {
      setForm(JSON.parse(savedForm));
    }
    if (savedStep) {
      setStep(Number(savedStep));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(LS_FORM_KEY, JSON.stringify(form));
    localStorage.setItem(LS_STEP_KEY, step);
  }, [form, step]);
  const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  // Progress indicator
  const Progress = () => (
    <div className="sxrx-wh-progress">
      {steps.map((label, idx) => (
        <div key={label} className={`sxrx-wh-progress-step${step === idx ? ' active' : ''}`}>{idx + 1}</div>
      ))}
    </div>
  );

  // Step 0: Doctor Info (static)
  if (step === 0) {
    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Doctor's Information</h2>
          <div className="sxrx-wh-doctor-info">
            <div><b>Provider:</b> {doctorInfo.provider}</div>
            <div><b>Address:</b> {doctorInfo.address}</div>
            <div><b>Phone Number:</b> {doctorInfo.phone}</div>
            <div><b>Email:</b> {doctorInfo.email}</div>
          </div>
          <button className="sxrx-wh-btn" onClick={nextStep}>Start Questionnaire</button>
        </div>
      </div>
    );
  }

  // Step 1: Personal Information
  if (step === 1) {
    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Personal Information</h2>
          <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
            <label>Full Name:<input name="fullName" value={form.fullName} onChange={handleChange} required /></label>
            <label>Date of Birth:<input type="date" name="dob" value={form.dob} onChange={handleChange} required /></label>
            <label>Gender:
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>Email Address:<input type="email" name="email" value={form.email} onChange={handleChange} required /></label>
            <label>Phone Number:<input name="phone" value={form.phone} onChange={handleChange} required /></label>
            <label>Address:<input name="address" value={form.address} onChange={handleChange} required /></label>
            <div className="sxrx-wh-nav-btns">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="submit">Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Medical History
  if (step === 2) {
    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Medical History</h2>
          <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
            <label>Do you have any known allergies?
              <select name="allergies" value={form.allergies} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.allergies === 'Yes' && (
              <label>If yes, please explain:
                <textarea name="allergiesNote" value={form.allergiesNote} onChange={handleChange} required />
              </label>
            )}
            <label>Are you currently taking any medications?
              <select name="medications" value={form.medications} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.medications === 'Yes' && (
              <label>If yes, please explain:
                <textarea name="medicationsNote" value={form.medicationsNote} onChange={handleChange} required />
              </label>
            )}
            <label>Do you have any chronic medical conditions?
              <select name="chronicConditions" value={form.chronicConditions} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <label>Have you had any surgeries in the past?
              <select name="surgeries" value={form.surgeries} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.surgeries === 'Yes' && (
              <label>If yes, please explain:
                <textarea name="surgeriesNote" value={form.surgeriesNote} onChange={handleChange} required />
              </label>
            )}
            <label>Do you have a family history of any medical conditions?
              <select name="familyHistory" value={form.familyHistory} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.familyHistory === 'Yes' && (
              <label>If yes, please explain:
                <textarea name="familyHistoryNote" value={form.familyHistoryNote} onChange={handleChange} required />
              </label>
            )}
            <div className="sxrx-wh-nav-btns">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="submit">Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 3: Lifestyle Information
  if (step === 3) {
    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Lifestyle Information</h2>
          <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
            <label>Do you smoke?
              <select name="smoke" value={form.smoke} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.smoke === 'Yes' && (
              <label>If yes, how often?
                <input name="smokeFreq" value={form.smokeFreq} onChange={handleChange} required />
              </label>
            )}
            <label>Do you consume alcohol?
              <select name="alcohol" value={form.alcohol} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.alcohol === 'Yes' && (
              <label>If yes, how often?
                <input name="alcoholFreq" value={form.alcoholFreq} onChange={handleChange} required />
              </label>
            )}
            <label>What is your current exercise routine?
              <select name="exercise" value={form.exercise} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Sedentary">Sedentary (no exercise)</option>
                <option value="Light">Light (e.g., walk occasionally)</option>
                <option value="Moderate">Moderate (e.g., exercise 1-3 times/week)</option>
                <option value="Active">Active (e.g., exercise 4-5 times/week)</option>
                <option value="Very Active">Very Active (e.g., daily vigorous exercise)</option>
              </select>
            </label>
            <div className="sxrx-wh-nav-btns">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="submit">Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 4: Specific Concerns or Symptoms
  if (step === 4) {
    const handleNext = e => {
      e.preventDefault();
      if (form.concerns.length === 0) {
        setCheckboxError('Please select at least one option.');
        return;
      }
      setCheckboxError('');
      nextStep();
    };
    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Specific Concerns or Symptoms</h2>
          <form onSubmit={handleNext}>
            <label>What specific concerns or symptoms are you experiencing?
              <div className="sxrx-wh-checkbox-group">
                {concernOptions.map(opt => (
                  <label key={opt} className="sxrx-wh-checkbox">
                    {opt}
                    <input
                      type="checkbox"
                      name="concerns"
                      value={opt}
                      checked={form.concerns.includes(opt)}
                      onChange={handleChange}
                    />
                  </label>
                ))}
              </div>
            </label>
            {form.concerns.includes('Other') && (
              <label>Please specify:
                <input name="concernsOther" value={form.concernsOther} onChange={handleChange} required />
              </label>
            )}
            {checkboxError && <div style={{ color: 'red', marginBottom: 8 }}>{checkboxError}</div>}
            <div className="sxrx-wh-nav-btns">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="submit">Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 5: Previous Treatments
  if (step === 5) {
    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Previous Treatments</h2>
          <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
            <label>Have you previously tried any treatments for your condition?
              <select name="prevTreatments" value={form.prevTreatments} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.prevTreatments === 'Yes' && (
              <label>If yes, which treatments?
                <input name="prevTreatmentsNote" value={form.prevTreatmentsNote} onChange={handleChange} required />
              </label>
            )}
            <div className="sxrx-wh-nav-btns">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="submit">Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 6: Goals for Treatment
  if (step === 6) {
    const handleNext = e => {
      e.preventDefault();
      if (form.goals.length === 0) {
        setCheckboxError('Please select at least one option.');
        return;
      }
      setCheckboxError('');
      nextStep();
    };
    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Goals for Treatment</h2>
          <form onSubmit={handleNext}>
            <label>What are your goals for treatment?
              <div className="sxrx-wh-checkbox-group">
                {goalOptions.map(opt => (
                  <label key={opt} className="sxrx-wh-checkbox">
                    {opt}
                    <input
                      type="checkbox"
                      name="goals"
                      value={opt}
                      checked={form.goals.includes(opt)}
                      onChange={handleChange}
                    />
                  </label>
                ))}
              </div>
            </label>
            {form.goals.includes('Other') && (
              <label>Please specify:
                <input name="goalsOther" value={form.goalsOther} onChange={handleChange} required />
              </label>
            )}
            {checkboxError && <div style={{ color: 'red', marginBottom: 8 }}>{checkboxError}</div>}
            <div className="sxrx-wh-nav-btns">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="submit">Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 7: Preferences for Treatment Options
  if (step === 7) {
    const handleNext = e => {
      e.preventDefault();
      if (form.preferences.length === 0) {
        setCheckboxError('Please select at least one option.');
        return;
      }
      setCheckboxError('');
      nextStep();
    };
    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Preferences for Treatment Options</h2>
          <form onSubmit={handleNext}>
            <label>Do you have any preferences for treatment options?
              <div className="sxrx-wh-checkbox-group">
                {preferenceOptions.map(opt => (
                  <label key={opt} className="sxrx-wh-checkbox">
                    {opt}
                    <input
                      type="checkbox"
                      name="preferences"
                      value={opt}
                      checked={form.preferences.includes(opt)}
                      onChange={handleChange}
                    />
                  </label>
                ))}
              </div>
            </label>
            {form.preferences.includes('Other') && (
              <label>Please specify:
                <input name="preferencesOther" value={form.preferencesOther} onChange={handleChange} required />
              </label>
            )}
            {checkboxError && <div style={{ color: 'red', marginBottom: 8 }}>{checkboxError}</div>}
            <div className="sxrx-wh-nav-btns">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="submit">Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 8: Discussed with Provider
  if (step === 8) {
    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Discussed with Provider</h2>
          <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
            <label>Have you discussed your health concerns with a healthcare provider before?
              <select name="discussedProvider" value={form.discussedProvider} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <div className="sxrx-wh-nav-btns">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="submit">Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 9: High-Risk Conditions
  if (step === 9) {
    const handleNext = e => {
      e.preventDefault();
      if (form.highRisk.length === 0) {
        setCheckboxError('Please select at least one option.');
        return;
      }
      setCheckboxError('');
      nextStep();
    };
    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">High-Risk Conditions</h2>
          <form onSubmit={handleNext}>
            <label>Do you have any of the following? (If yes cannot purchase without scheduling consultation)
              <div className="sxrx-wh-checkbox-group">
                {highRiskOptions.map(opt => (
                  <label key={opt} className="sxrx-wh-checkbox">
                    {opt}
                    <input
                      type="checkbox"
                      name="highRisk"
                      value={opt}
                      checked={form.highRisk.includes(opt)}
                      onChange={handleChange}
                    />
                  </label>
                ))}
              </div>
            </label>
            {checkboxError && <div style={{ color: 'red', marginBottom: 8 }}>{checkboxError}</div>}
            <div className="sxrx-wh-nav-btns">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="submit">Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 10: Additional Comments
  if (step === 10) {
    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Additional Comments or Questions/Concerns</h2>
          <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
            <label>Please share any additional comments, questions, or concerns you may have:
              <textarea name="comments" value={form.comments} onChange={handleChange} rows={4} />
            </label>
            <div className="sxrx-wh-nav-btns">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="submit">Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 11: Consent & Disclosure
  if (step === 11) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setSubmitError('');
      setSubmitSuccess(false);

      // Check for red flags
      const hasHighRisk = form.highRisk.length > 0 && !form.highRisk.includes('Nothing');
      const hasRedFlags = 
        form.chronicConditions === 'Yes' ||
        hasHighRisk ||
        form.mentalHealthDiagnoses === 'Yes' ||
        form.substanceAbuse === 'Yes' ||
        form.mentalHealthHospitalization === 'Yes' ||
        form.mentalHealthMedications === 'Yes' ||
        form.thoughtsOfHarm === 'Yes' ||
        form.recreationalDrugs === 'Yes';

      try {
        // Save questionnaire data to backend
        const user = JSON.parse(localStorage.getItem('user'));
        const user_id = user && (user._id || user.id);

        const data = await saveQuestionnaire({
          ...form,
          hasRedFlags,
          timestamp: new Date().toISOString(),
          user_id,
        });

        if (!data) {
          throw new Error('Failed to save questionnaire');
        }
        localStorage.removeItem(LS_FORM_KEY);
        localStorage.removeItem(LS_STEP_KEY);
        setSubmitting(false);
        setShowOptions(true);
        setCurrentId(data._id);
        setStep(12);
        // if (hasRedFlags) {
        //   // Redirect to booking page with questionnaire ID
        //   window.location.href = `/book-appointment?questionnaireId=${data.id}`;
        // } else {
        //   setSubmitSuccess(true);
        // }
      } catch (err) {
        setSubmitError('There was an error submitting your questionnaire. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="sxrx-womens-health-page">
        <div className="sxrx-womens-health-container">
          <Progress />
          <h1 className="sxrx-womens-health-title">Women's Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Consent and Disclosure Statements</h2>
          <form onSubmit={handleSubmit}>
            <div className="sxrx-wh-consent-box">
              <p>I understand that this online questionnaire is in lieu of a traditional consultation and constitutes a consultation with a medical provider, Dr. Perry T. Wolfe, MD.</p>
              <p>I am aware that my prescription may be sent to LA Compounding Pharmacy located at 8600 W 3rd St #1, Los Angeles, CA 90048, but I have the option to choose another pharmacy of my preference.</p>
              <p>I acknowledge this disclosure:</p>
              <div className="sxrx-wh-radio-group">
                <label className="sxrx-wh-radio">
                  <input type="radio" name="agree" value="I Agree" checked={form.agree === 'I Agree'} onChange={handleChange} required />
                  I Agree
                </label>
                <label className="sxrx-wh-radio">
                  <input type="radio" name="agree" value="I Do Not Agree" checked={form.agree === 'I Do Not Agree'} onChange={handleChange} required />
                  I Do Not Agree
                </label>
              </div>
            </div>
            <div className="sxrx-wh-signature-block">
              <label>Signature:
                <input 
                  type="text" 
                  name="signature" 
                  value={form.signature} 
                  onChange={handleChange} 
                  placeholder="Type your full name as signature" 
                  required 
                />
              </label>
            </div>
            <label>Date:
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </label>
            {submitError && <div style={{ color: 'red', marginBottom: 8 }}>{submitError}</div>}
            {submitSuccess && <div style={{ color: 'green', marginBottom: 8 }}>Thank you! Your questionnaire has been submitted.</div>}
            <div className="sxrx-wh-nav-btns">
              <button type="button" onClick={prevStep} disabled={submitting}>Back</button>
              <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  if (step === 12) {
    return (
      <div className='sxrx-option-panel'>
        <h2>Select a Service Option</h2>
        <div className="sxrx-option-cards-container">
          {purchaseOptions.map(opt => (
            <div key={opt.id} className="sxrx-option-card">
              <div>
                <div className="sxrx-option-title">{opt.title}</div>
                <div className="sxrx-option-description"><b>Description:</b> {opt.description}</div>
                <div className="sxrx-option-benefit">
                  <b>Benefits:</b>
                  <ul style={{margin: '8px 0 0 16px', padding: 0}}>
                    {opt.benefit.map((b, idx) => (
                      <li key={idx} style={{fontSize: '0.95rem', color: '#444'}}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <div className="sxrx-option-price">{opt.price} USD</div>
                <button
                  className="sxrx-option-btn"
                  onClick={async () => {
                    setSelectedOption(opt);
                    const response = await createPaymentLink(opt, currentId);
                    console.log("created Payment Link", response);
                    const data = response.paymentLink;
                    setPaymentLink(data);
                    setShowPaymentModal(true);
                  }}
                >
                  SELECT <span style={{fontWeight: 'bold', fontSize: '1.2em'}}>+</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        {showPaymentModal && (
          <div className="sxrx-modal-overlay">
            <div className="sxrx-modal">
              <h3>Payment Link</h3>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <input
                  type="text"
                  value={paymentLink}
                  readOnly
                  style={{ flex: 1, marginRight: 8 }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(paymentLink);
                  }}
                >
                  Copy
                </button>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  className="sxrx-option-btn"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Go to Dashboard
                </button>
                <button
                  className="sxrx-option-btn"
                  onClick={() => window.open(paymentLink, '_blank')}
                >
                  Go to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  // Fallback (should not be reached)
  return null;
}

export default WomensHealth; 