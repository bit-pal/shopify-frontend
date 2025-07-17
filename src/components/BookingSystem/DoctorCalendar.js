import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './DoctorCalendar.css';
const API_URL = 'http://localhost:5000/api';

// Helper: get default business hours (Mon-Fri, 9am-5pm)
const businessHours = [
  { daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '17:00' }
];

const DoctorCalendar = () => {
  const [events, setEvents] = useState([]);
  const [nonAvailable, setNonAvailable] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNonAvailable();
    fetchAppointments();
  }, []);

  useEffect(() => {
    const nonAvailEvents = nonAvailable.map(slot => ({
      id: `nonavail-${slot._id}`,
      title: 'Not Available',
      start: slot.startTime,
      end: slot.endTime,
      backgroundColor: '#ef4444',
      borderColor: '#ef4444',
      rendering: 'background',
      overlap: false,
      editable: true,
      extendedProps: { type: 'non-available' }
    }));

    const bookedEvents = appointments.map(app => ({
      id: `appt-${app._id}`,
      title: app.patientName ? `Booked: ${app.patientName}` : 'Booked',
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

  const fetchNonAvailable = async () => {
    try {
      let user = localStorage.getItem('user');
      const userData = JSON.parse(user);
      const res = await axios.get(`${API_URL}/availability/doctor/${userData.id}`);
      setNonAvailable(res.data.filter(slot => slot.isAvailable === false));
    } catch (err) {
      console.error('Error fetching non-available:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      let user = localStorage.getItem('user');
      const userData = JSON.parse(user);
      const res = await axios.get(`${API_URL}/appointments/doctor/${userData.id}`);
      setAppointments(res.data.map(app => ({
        ...app,
        patientName: app.patientId?.firstName ? `${app.patientId.firstName} ${app.patientId.lastName}` : ''
      })));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setLoading(false);
    }
  };

  const handleDateSelect = async (selectInfo) => {
    // Check if the selected time is within business hours
    const startHour = selectInfo.start.getHours();
    const endHour = selectInfo.end.getHours();
    if (startHour < 9 || endHour > 17) {
      alert('Please select a time between 9 AM and 5 PM');
      return;
    }

    // Check if the slot is already booked
    const isBooked = appointments.some(app =>
      (selectInfo.start < new Date(app.endTime) && selectInfo.end > new Date(app.startTime))
    );
    if (isBooked) {
      alert('This time slot is already booked and cannot be modified.');
      return;
    }

    // Check if the slot is already marked as non-available
    const existingNonAvailable = nonAvailable.find(slot =>
      (selectInfo.start.getTime() === new Date(slot.startTime).getTime() &&
       selectInfo.end.getTime() === new Date(slot.endTime).getTime())
    );

    if (existingNonAvailable) {
      // If slot exists, make it available again
      try {
        await axios.delete(`${API_URL}/availability/${existingNonAvailable._id}`);
        setNonAvailable(nonAvailable.filter(slot => slot._id !== existingNonAvailable._id));
      } catch (err) {
        console.error('Error making slot available:', err);
      }
    } else {
      // Create new non-available slot
      try {
        const newSlot = {
          doctorId: JSON.parse(localStorage.getItem('user')).id,
          startTime: selectInfo.start.toISOString(),
          endTime: selectInfo.end.toISOString(),
          isAvailable: false,
          recurrence: 'none'
        };
        const res = await axios.post(`${API_URL}/availability`, newSlot);
        setNonAvailable([...nonAvailable, res.data]);
      } catch (err) {
        console.error('Error creating non-available slot:', err);
        alert('Failed to update availability. Please try again.');
      }
    }
  };

  const handleEventClick = async (clickInfo) => {
    const { type } = clickInfo.event.extendedProps;
    
    if (type === 'booked') {
      alert('This time slot is booked and cannot be modified.');
      return;
    }

    if (type === 'non-available') {
      if (window.confirm('Make this time slot available again?')) {
        try {
          await axios.delete(`${API_URL}/availability/${clickInfo.event.id.replace('nonavail-', '')}`);
          setNonAvailable(nonAvailable.filter(slot => `nonavail-${slot._id}` !== clickInfo.event.id));
        } catch (err) {
          console.error('Error making slot available:', err);
        }
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="doctor-calendar-container">
      <h2>My Calendar</h2>
      <div className="calendar-legend">
        <span className="legend available"></span> Available (9am-5pm, Mon-Fri)
        <span className="legend non-available"></span> Not Available
        <span className="legend booked"></span> Booked
      </div>
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
          }}
          initialView="timeGridWeek"
          businessHours={businessHours}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={false}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          slotMinTime="09:00:00"
          slotMaxTime="17:00:00"
          slotDuration="00:30:00"
          allDaySlot={false}
          height="auto"
          selectConstraint="businessHours"
          selectOverlap={false}
          selectAllow={(selectInfo) => {
            // Only allow selection if start and end times are exactly 30 minutes apart
            const duration = selectInfo.end.getTime() - selectInfo.start.getTime();
            return duration === 30 * 60 * 1000; // 30 minutes in milliseconds
          }}
        />
      </div>
    </div>
  );
};

export default DoctorCalendar; 