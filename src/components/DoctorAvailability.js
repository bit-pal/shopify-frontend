import React, { useState } from 'react';
import './DoctorAvailability.css';

const DoctorAvailability = ({ doctorId, availableTimes, onUpdateAvailability }) => {
  const [newTimeSlot, setNewTimeSlot] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddTimeSlot = () => {
    const updatedTimes = [...availableTimes, newTimeSlot];
    onUpdateAvailability(doctorId, updatedTimes);
    setNewTimeSlot({
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00'
    });
  };

  const handleRemoveTimeSlot = (index) => {
    const updatedTimes = availableTimes.filter((_, i) => i !== index);
    onUpdateAvailability(doctorId, updatedTimes);
  };

  return (
    <div className="doctor-availability">
      <h3>Manage Availability</h3>
      
      <div className="add-time-slot">
        <select
          value={newTimeSlot.day}
          onChange={(e) => setNewTimeSlot({ ...newTimeSlot, day: e.target.value })}
        >
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        
        <input
          type="time"
          value={newTimeSlot.startTime}
          onChange={(e) => setNewTimeSlot({ ...newTimeSlot, startTime: e.target.value })}
        />
        
        <input
          type="time"
          value={newTimeSlot.endTime}
          onChange={(e) => setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })}
        />
        
        <button onClick={handleAddTimeSlot}>Add Time Slot</button>
      </div>

      <div className="time-slots-list">
        <h4>Current Availability</h4>
        {availableTimes.map((slot, index) => (
          <div key={index} className="time-slot">
            <span>{slot.day}</span>
            <span>{slot.startTime} - {slot.endTime}</span>
            <button onClick={() => handleRemoveTimeSlot(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAvailability; 