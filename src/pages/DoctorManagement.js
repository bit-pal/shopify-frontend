import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorAvailability from '../components/DoctorAvailability';
import './DoctorManagement.css';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    state: '',
    email: '',
    phone: '',
    availableTimes: []
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDoctor) {
        await axios.put(`http://localhost:5000/api/doctors/${selectedDoctor._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/doctors', formData);
      }
      fetchDoctors();
      resetForm();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      state: doctor.state,
      email: doctor.email,
      phone: doctor.phone,
      availableTimes: doctor.availableTimes || []
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`);
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const handleUpdateAvailability = async (doctorId, availableTimes) => {
    try {
      await axios.patch(`http://localhost:5000/api/doctors/${doctorId}/availability`, {
        availableTimes
      });
      fetchDoctors();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const resetForm = () => {
    setSelectedDoctor(null);
    setFormData({
      name: '',
      specialization: '',
      state: '',
      email: '',
      phone: '',
      availableTimes: []
    });
  };

  return (
    <div className="doctor-management">
      <h1>Doctor Management</h1>
      
      <form onSubmit={handleSubmit} className="doctor-form">
        <div className="doctor-form-fields">
          <input
            type="text"
            name="name"
            placeholder="Doctor Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            required
          />
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          >
            <option value="">Select State</option>
            <option value="Texas">Texas</option>
            <option value="California">California</option>
          </select>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="doctor-form-actions">
          <button type="submit">{selectedDoctor ? 'Update Doctor' : 'Add Doctor'}</button>
          {selectedDoctor && (
            <button type="button" onClick={resetForm}>Cancel Edit</button>
          )}
        </div>
      </form>

      <div className="doctors-list">
        <h2>Doctors List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>State</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor._id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.state}</td>
                <td>{doctor.email}</td>
                <td>{doctor.phone}</td>
                <td>
                  <button onClick={() => handleEdit(doctor)}>Edit</button>
                  <button onClick={() => handleDelete(doctor._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDoctor && (
        <DoctorAvailability
          doctorId={selectedDoctor._id}
          availableTimes={selectedDoctor.availableTimes || []}
          onUpdateAvailability={handleUpdateAvailability}
        />
      )}
    </div>
  );
};

export default DoctorManagement; 