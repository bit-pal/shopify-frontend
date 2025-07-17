import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppointmentBooking.css';

const AppointmentBooking = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      setError('Failed to fetch doctors');
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate('');
    setAvailableSlots([]);
    setSelectedSlot(null);
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    
    if (!selectedDoctor) return;

    try {
      setLoading(true);
      // Get doctor's available times for the selected date
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      const availableTimes = selectedDoctor.availableTimes.filter(
        time => time.day === dayOfWeek
      );
      
      // Get existing appointments for the selected date
      const response = await axios.get(`http://localhost:5000/api/appointments/doctor/${selectedDoctor._id}`);
      const existingAppointments = response.data.filter(
        appointment => appointment.date === date && appointment.status === 'scheduled'
      );

      // Filter out booked slots
      const availableSlots = availableTimes.filter(time => {
        return !existingAppointments.some(appointment => 
          appointment.startTime === time.startTime
        );
      });

      setAvailableSlots(availableSlots);
    } catch (error) {
      setError('Failed to fetch available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setError('Please select a doctor, date, and time slot');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/appointments', {
        doctorId: selectedDoctor._id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes
      });

      setSuccess('Appointment booked successfully!');
      // Reset form
      setSelectedDoctor(null);
      setSelectedDate('');
      setAvailableSlots([]);
      setSelectedSlot(null);
      setNotes('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-booking">
      <h1>Book a Video Consultation</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="booking-container">
        <div className="doctors-list">
          <h2>Select a Doctor</h2>
          <div className="doctors-grid">
            {doctors.map(doctor => (
              <div
                key={doctor._id}
                className={`doctor-card ${selectedDoctor?._id === doctor._id ? 'selected' : ''}`}
                onClick={() => handleDoctorSelect(doctor)}
              >
                <h3>{doctor.name}</h3>
                <p>{doctor.specialization}</p>
                <p>{doctor.state}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedDoctor && (
          <div className="booking-details">
            <h2>Select Date and Time</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateSelect(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />

            {loading ? (
              <div className="loading">Loading available slots...</div>
            ) : (
              <div className="time-slots">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))}
              </div>
            )}

            {selectedSlot && (
              <div className="booking-form">
                <textarea
                  placeholder="Add any notes or concerns (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button
                  className="book-button"
                  onClick={handleBooking}
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking; 