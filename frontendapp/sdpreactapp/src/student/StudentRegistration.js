import React, { useState } from 'react';
import axios from 'axios';

export default function StudentRegistration() {
  const [formData, setFormData] = useState({
    ID: '',
    fullname: '',
    gender: '',
    dateofbirth: '',
    email: '',
    password: '',
    location: '',
    contact: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:2004/insertstudent', formData);
      if (response.status === 200) {
        setFormData({
          ID: '',
          fullname: '',
          gender: '',
          dateofbirth: '',
          email: '',
          password: '',
          location: '',
          contact: ''
        });
      }
      setMessage(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data || err.message || "Registration failed");
      setMessage('');
    }
  };

  return (
    <div>
      <h3 align="center"><u>Student Registration</u></h3>
      { message ? <h4 align="center" style={{color: 'green'}}>{message}</h4> : <h4 align="center" style={{color: 'red'}}>{error}</h4> }

      <form onSubmit={handleSubmit}>
        <div>
          <label>Student ID</label>
          <input type="text" id="ID" value={formData.ID} onChange={handleChange} required />
          <label>Full Name</label>
          <input type="text" id="fullname" value={formData.fullname} onChange={handleChange} required />
        </div>
        <div>
          <label>Gender</label>
          <select id="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div>
          <label>Date of Birth</label>
          <input type="date" id="dateofbirth" value={formData.dateofbirth} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" id="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" id="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Location</label>
          <input type="text" id="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact</label>
          <input type="text" id="contact" pattern="[6789][0-9]{9}" placeholder="MUST be 10 Digits" value={formData.contact} onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
