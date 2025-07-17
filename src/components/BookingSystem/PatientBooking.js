import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './PatientBooking.css';
const API_URL = process.env.REACT_APP_BASE_URL;

const PatientBooking = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [nonAvailable, setNonAvailable] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingType, setBookingType] = useState('video');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/doctors`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchNonAvailable = async (doctorId) => {
    try {
      const res = await axios.get(`${API_URL}/availability/doctor/${doctorId}`);
      setNonAvailable(res.data.availability.filter(slot => slot.isAvailable === false));
    } catch (err) {
      console.error('Error fetching non-available:', err);
    }
  };

  const fetchAppointments = async (doctorId) => {
    try {
      const res = await axios.get(`${API_URL}/appointments/doctor/${doctorId}`);
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  useEffect(() => {
    if (selectedDoctor) {
      fetchNonAvailable(selectedDoctor);
      fetchAppointments(selectedDoctor);
    }
  }, [selectedDoctor]);

  useEffect(() => {
    // Combine events for calendar
    const nonAvailEvents = nonAvailable.map(slot => ({
      id: `nonavail-${slot._id}`,
      title: 'Not Available',
      start: slot.startTime,
      end: slot.endTime,
      backgroundColor: '#ef4444',
      borderColor: '#ef4444',
      rendering: 'background',
      overlap: false,
      editable: false,
      extendedProps: { type: 'non-available' }
    }));

    const bookedEvents = appointments.map(app => ({
      id: `appt-${app._id}`,
      title: app.patientId?.firstName
        ? `Booked: ${app.patientId.firstName} ${app.patientId.lastName}\n${app.meetingLink ? 'Meeting: ' + app.meetingLink : ''}`
        : `Booked${app.meetingLink ? '\\nMeeting: ' + app.meetingLink : ''}`,
      start: app.startTime,
      end: app.endTime,
      backgroundColor: '#2563eb',
      borderColor: '#2563eb',
      overlap: false,
      editable: false,
      extendedProps: { type: 'booked' }
    }));

    setEvents([...nonAvailEvents, ...bookedEvents]);
  }, [nonAvailable, appointments]);

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctor(doctorId);
  };

  const handleSlotSelect = (selectInfo) => {
    // Prevent selecting a slot that is not available
    const overlap = events.some(event =>
      (selectInfo.start < new Date(event.end) && selectInfo.end > new Date(event.start))
    );
    if (overlap) {
      alert('This time slot is not available.');
      return;
    }
    setSelectedSlot({
      start: selectInfo.start,
      end: selectInfo.end
    });
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = localStorage.getItem('user');  
      const user = JSON.parse(userData);
      const date = selectedSlot.start.toISOString().slice(0, 10);
      const appointmentData = {
        patientId: user.id,
        doctorId: selectedDoctor,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        type: bookingType,
        date: date,
        status: 'scheduled'
      };

      await axios.post(`${API_URL}/appointments`, appointmentData);
      setShowBookingModal(false);
      // Refresh available slots
      fetchAppointments(selectedDoctor);
      fetchNonAvailable(selectedDoctor);
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <div className="patient-booking-container">
      <h2>Book a Consultation</h2>
      <div className="doctor-selector">
        <label>Select Doctor:</label>
        <select 
          value={selectedDoctor || ''} 
          onChange={(e) => handleDoctorSelect(e.target.value)}
        >
          <option value="">Choose a doctor...</option>
          {doctors.map(doctor => (
            <option key={doctor._id} value={doctor._id}>
              Dr. {doctor.firstName} {doctor.lastName}
            </option>
          ))}
        </select>
      </div>

      {selectedDoctor && (
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay'
            }}
            initialView="timeGridWeek"
            businessHours={[
              { daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '17:00' }
            ]}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={false}
            events={events}
            select={handleSlotSelect}
            slotMinTime="09:00:00"
            slotMaxTime="17:00:00"
            slotDuration="00:30:00"
            allDaySlot={false}
            height="auto"
            selectConstraint="businessHours"
            selectOverlap={false}
            eventClick={(info) => {
              if (info.event.extendedProps.type === 'booked') {
                setSelectedBooking({
                  title: info.event.title,
                  start: info.event.start,
                  end: info.event.end,
                  meetingLink: info.event.extendedProps.meetingLink,
                  patient: info.event.title,
                });
              }
            }}
            selectAllow={(selectInfo) => {
              // Only allow selection if start and end times are exactly 30 minutes apart
              const duration = selectInfo.end.getTime() - selectInfo.start.getTime();
              return duration === 30 * 60 * 1000;
            }}
          />
        </div>
      )}

      {showBookingModal && (
        <div className="booking-modal">
          <div className="modal-content">
            <h3>Book Appointment</h3>
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Consultation Type:</label>
                <select 
                  value={bookingType} 
                  onChange={(e) => setBookingType(e.target.value)}
                >
                  <option value="video">Video Consultation</option>
                  <option value="in-person">In-Person Consultation</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date & Time:</label>
                <p>
                  {selectedSlot.start.toLocaleString()} - 
                  {selectedSlot.end.toLocaleString()}
                </p>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedBooking && (
        <div className="booking-modal">
          <div className="modal-content">
            <h3>Booking Details</h3>
            <p><strong>Patient:</strong> {selectedBooking.patient}</p>
            <p><strong>Start:</strong> {selectedBooking.start.toLocaleString()}</p>
            <p><strong>End:</strong> {selectedBooking.end.toLocaleString()}</p>
            {selectedBooking.meetingLink && (
              <p>
                <strong>Meeting Link:</strong>
                <a href={selectedBooking.meetingLink} target="_blank" rel="noopener noreferrer">
                  {selectedBooking.meetingLink}
                </a>
              </p>
            )}
            <div className="modal-actions">
              <button type="button" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientBooking; 