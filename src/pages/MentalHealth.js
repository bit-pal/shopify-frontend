import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './MentalHealth.css';

const doctorInfo = {
  provider: 'Dr. Xavier Munoz, DO',
  address: '935 Sunland Park Dr #104, El Paso, TX 79922',
  phone: '(855) 671-5365',
  email: 'drmunoz@sxrx.com',
};

const steps = [
  'Doctor Info',
  'Personal Information',
  'Medical History - Basic',
  'Medical History - High Risk',
  'Current Status - Symptoms',
  'Current Status - Support',
  'Lifestyle Information',
  'Treatment - Concerns',
  'Treatment - Previous',
  'Treatment - Goals',
  'Treatment - Preferences',
  'Additional Comments',
  'Consent & Disclosure',
];

const initialForm = {
  // Personal Info
  fullName: '', dob: '', gender: '', email: '', phone: '', address: '',
  // Medical History
  mentalDiagnoses: '', mentalDiagnosesNote: '', prevMentalTreatment: '', substanceAbuse: '', substanceAbuseNote: '', hospitalized: '', hospitalizedNote: '', mentalMeds: '', mentalMedsNote: '', highRisk: [],
  // Current Status
  overallMentalHealth: '', symptoms: [], symptomsOther: '', selfHarmThoughts: '', supportSystem: '', stressFreq: '',
  // Lifestyle
  smoke: '', alcohol: '', alcoholFreq: '', recDrugs: '', recDrugsNote: '', dailyRoutine: '',
  // Treatment-Specific
  concerns: [], concernsOther: '', prevTreatments: '', prevTreatmentsNote: '', goals: [], goalsOther: '', treatmentPref: [], treatmentPrefOther: '',
  // Additional Comments
  comments: '',
  // Consent
  agree: '', signature: '', date: '',
};

const highRiskOptions = [
  'History of Blood Clots or Stroke',
  'Heart Conditions',
  'Cancer',
  'Liver or Gallbladder Issues',
  'High Blood Pressure',
  'Clinical Obesity',
  'Nothing',
];
const symptomOptions = [
  'Feelings of sadness or hopelessness',
  'Anxiety or excessive worry',
  'Mood swings',
  'Difficulty concentrating',
  'Changes in sleep patterns (too much or too little)',
  'Changes in appetite or weight',
  'Loss of interest in activities',
  'Thoughts of self-harm or suicide',
  'Other',
];
const concernOptions = [
  'Anxiety',
  'Depression',
  'Stress management',
  'Substance use',
  'Other',
];
const goalOptions = [
  'Reduce anxiety',
  'Improve mood',
  'Manage stress',
  'Overcome substance use',
  'Other',
];
const treatmentPrefOptions = [
  'Therapy (e.g., CBT, talk therapy)',
  'Medication',
  'Holistic approaches (e.g., meditation, yoga)',
  'Other',
];

function MentalHealth() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [checkboxError, setCheckboxError] = useState('');
  const sigPadRef = useRef();
  const LS_FORM_KEY = 'mentalHealthForm';
  const LS_STEP_KEY = 'mentalHealthStep';
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

  // Step 0: Doctor Info
  if (step === 0) {
    return (
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
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
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
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

  // Step 2: Medical History - Basic
  if (step === 2) {
    return (
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Medical History - Basic Information</h2>
          <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
            <label>Do you have any known mental health diagnoses? (If yes cannot purchase without scheduling consultation)
              <select name="mentalDiagnoses" value={form.mentalDiagnoses} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.mentalDiagnoses === 'Yes' && (
              <label>If yes, please specify:
                <textarea name="mentalDiagnosesNote" value={form.mentalDiagnosesNote} onChange={handleChange} required />
              </label>
            )}
            <label>Have you previously received mental health treatment?
              <select name="prevMentalTreatment" value={form.prevMentalTreatment} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <label>Do you have a history of substance abuse? (If yes cannot purchase without scheduling consultation)
              <select name="substanceAbuse" value={form.substanceAbuse} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.substanceAbuse === 'Yes' && (
              <label>If yes, please specify the substances (e.g., narcotics, alcohol, illegal drugs):
                <textarea name="substanceAbuseNote" value={form.substanceAbuseNote} onChange={handleChange} required />
              </label>
            )}
            <label>Have you ever been hospitalized for mental health issues? (If yes cannot purchase without scheduling consultation)
              <select name="hospitalized" value={form.hospitalized} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.hospitalized === 'Yes' && (
              <label>If yes, please provide details:
                <textarea name="hospitalizedNote" value={form.hospitalizedNote} onChange={handleChange} required />
              </label>
            )}
            <label>Are you currently taking any medications for mental health or mood disorders? (If yes cannot purchase without scheduling consultation)
              <select name="mentalMeds" value={form.mentalMeds} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.mentalMeds === 'Yes' && (
              <label>If yes, please list:
                <textarea name="mentalMedsNote" value={form.mentalMedsNote} onChange={handleChange} required />
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

  // Step 3: Medical History - High Risk
  if (step === 3) {
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
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Medical History - High Risk Conditions</h2>
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

  // Step 4: Current Status - Symptoms
  if (step === 4) {
    const handleNext = e => {
      e.preventDefault();
      if (form.symptoms.length === 0) {
        setCheckboxError('Please select at least one option.');
        return;
      }
      setCheckboxError('');
      nextStep();
    };
    return (
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Current Mental Health Status - Symptoms</h2>
          <form onSubmit={handleNext}>
            <label>How would you rate your overall mental health?
              <select name="overallMentalHealth" value={form.overallMentalHealth} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </label>
            <label>In the past month, have you experienced any of the following? (Select all that apply)
              <div className="sxrx-wh-checkbox-group">
                {symptomOptions.map(opt => (
                  <label key={opt} className="sxrx-wh-checkbox">
                    {opt}
                    <input
                      type="checkbox"
                      name="symptoms"
                      value={opt}
                      checked={form.symptoms.includes(opt)}
                      onChange={handleChange}
                    />
                  </label>
                ))}
              </div>
            </label>
            {form.symptoms.includes('Other') && (
              <label>Please specify:
                <input name="symptomsOther" value={form.symptomsOther} onChange={handleChange} required />
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

  // Step 5: Current Status - Support
  if (step === 5) {
    return (
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Current Mental Health Status - Support System</h2>
          <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
            <label>Have you had any thoughts of harming yourself or others? (If yes cannot purchase without scheduling consultation)
              <select name="selfHarmThoughts" value={form.selfHarmThoughts} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <label>Do you have a support system in place? (e.g., family, friends, therapist)
              <select name="supportSystem" value={form.supportSystem} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <label>How often do you feel overwhelmed by stress?
              <select name="stressFreq" value={form.stressFreq} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Rarely">Rarely</option>
                <option value="Sometimes">Sometimes</option>
                <option value="Often">Often</option>
                <option value="Always">Always</option>
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

  // Step 6: Lifestyle Information
  if (step === 6) {
    return (
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Lifestyle Information</h2>
          <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
            <label>Do you smoke?
              <select name="smoke" value={form.smoke} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <label>Do you consume alcohol?
              <select name="alcohol" value={form.alcohol} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.alcohol === 'Yes' && (
              <label>If yes, how often?
                <select name="alcoholFreq" value={form.alcoholFreq} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Daily">Daily</option>
                </select>
              </label>
            )}
            <label>Do you use any recreational drugs? (If yes cannot purchase without scheduling consultation)
              <select name="recDrugs" value={form.recDrugs} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.recDrugs === 'Yes' && (
              <label>If yes, please specify:
                <input name="recDrugsNote" value={form.recDrugsNote} onChange={handleChange} required />
              </label>
            )}
            <label>What does your typical daily routine look like? (e.g., work, sleep, exercise)
              <textarea name="dailyRoutine" value={form.dailyRoutine} onChange={handleChange} required />
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

  // Step 7: Treatment - Concerns
  if (step === 7) {
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
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Treatment - Specific Concerns</h2>
          <form onSubmit={handleNext}>
            <label>What specific mental health concerns are you experiencing?
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

  // Step 8: Treatment - Previous
  if (step === 8) {
    return (
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Treatment - Previous Treatments</h2>
          <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
            <label>Have you previously tried any treatments for your mental health concerns?
              <select name="prevTreatments" value={form.prevTreatments} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            {form.prevTreatments === 'Yes' && (
              <label>If yes, please specify:
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

  // Step 9: Treatment - Goals
  if (step === 9) {
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
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Treatment - Goals</h2>
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

  // Step 10: Treatment - Preferences
  if (step === 10) {
    const handleNext = e => {
      e.preventDefault();
      if (form.treatmentPref.length === 0) {
        setCheckboxError('Please select at least one option.');
        return;
      }
      setCheckboxError('');
      nextStep();
    };
    return (
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Treatment - Preferences</h2>
          <form onSubmit={handleNext}>
            <label>Do you prefer any specific type of treatment?
              <div className="sxrx-wh-checkbox-group">
                {treatmentPrefOptions.map(opt => (
                  <label key={opt} className="sxrx-wh-checkbox">
                    {opt}
                    <input
                      type="checkbox"
                      name="treatmentPref"
                      value={opt}
                      checked={form.treatmentPref.includes(opt)}
                      onChange={handleChange}
                    />
                  </label>
                ))}
              </div>
            </label>
            {form.treatmentPref.includes('Other') && (
              <label>Please specify:
                <input name="treatmentPrefOther" value={form.treatmentPrefOther} onChange={handleChange} required />
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

  // Step 11: Additional Comments
  if (step === 11) {
    return (
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
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

  // Step 12: Consent & Disclosure
  if (step === 12) {
    const handleClear = () => {
      sigPadRef.current.clear();
      setForm(f => ({ ...f, signature: '' }));
    };
    const handleEnd = () => {
      setForm(f => ({ ...f, signature: sigPadRef.current.getTrimmedCanvas().toDataURL('image/png') }));
    };
    return (
      <div className="sxrx-mental-health-page">
        <div className="sxrx-mental-health-container">
          <Progress />
          <h1 className="sxrx-mental-health-title">Mental Health Questionnaire</h1>
          <h2 className="sxrx-wh-step-title">Consent and Disclosure Statements</h2>
          <form
            onSubmit={async e => {
              e.preventDefault();
              setSubmitting(true);
              setSubmitError('');
              setSubmitSuccess(false);
              try {
                // TODO: Replace with your backend endpoint
                const res = await fetch('/api/questionnaires', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error('Submission failed');
                setSubmitSuccess(true);
                localStorage.removeItem(LS_FORM_KEY);
                localStorage.removeItem(LS_STEP_KEY);
              } catch (err) {
                setSubmitError('There was an error submitting your questionnaire. Please try again.');
              } finally {
                setSubmitting(false);
              }
            }}
          >
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
            <label>Date:<input type="date" name="date" value={form.date} onChange={handleChange} required /></label>
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

  // Fallback
  return null;
}

export default MentalHealth; 